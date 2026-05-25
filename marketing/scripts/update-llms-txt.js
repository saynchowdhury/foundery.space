/**
 * Script to help validate and update llms.txt files
 * Run periodically to ensure llms.txt is accurate and up-to-date
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Validate llms.txt format
 * @param {string} content - The llms.txt content to validate
 * @returns {Object} Validation result
 */
function validateLlmsTxt(content) {
  const lines = content.split('\n').filter(line => line.trim() !== '');
  const errors = [];
  const warnings = [];
  
  // Check if file is empty
  if (lines.length === 0) {
    errors.push('File is empty');
    return { errors, warnings };
  }
  
  // Check H1 title (first line)
  if (!lines[0].startsWith('# ')) {
    errors.push('First line must be H1 title starting with "# "');
  }
  
  // Check description (second line should be blockquote)
  if (lines.length > 1 && !lines[1].startsWith('> ')) {
    errors.push('Second line must be blockquote description starting with "> "');
  }
  
  // Check for at least one H2 section
  const hasH2 = lines.some(line => line.startsWith('## '));
  if (!hasH2) {
    errors.push('Must contain at least one H2 section starting with "## "');
  }
  
  // Count page entries (lines starting with "- [")
  const pageEntries = lines.filter(line => line.trim().startsWith('- ['));
  if (pageEntries.length < 5) {
    warnings.push(`Only ${pageEntries.length} page entries found. Recommend 10-30.`);
  } else if (pageEntries.length > 30) {
    warnings.push(`${pageEntries.length} page entries found. Consider reducing to 10-30 for better AI comprehension.`);
  }
  
  // Check URL format in page entries
  pageEntries.forEach((entry, index) => {
    const urlMatch = entry.match(/\]\((https?:\/\/[^)]+)\)/);
    if (!urlMatch) {
      errors.push(`Page entry ${index + 1} has invalid or missing URL format`);
    } else {
      const url = urlMatch[1];
      if (!url.startsWith('https://')) {
        warnings.push(`Page entry ${index + 1} URL should use https://`);
      }
    }
  });
  
  // Check description format in page entries
  pageEntries.forEach((entry, index) => {
    // Match pattern: - [Text](URL): Description
    const descMatch = entry.match(/\]\([^)]+\):\s*(.+)/);
    if (!descMatch) {
      errors.push(`Page entry ${index + 1} is missing description after colon`);
    } else {
      const desc = descMatch[1].trim();
      if (desc.length < 10) {
        warnings.push(`Page entry ${index + 1} description is too short (${desc.length} chars). Recommend 10-30 words.`);
      } else if (desc.length > 100) {
        warnings.push(`Page entry ${index + 1} description is too long (${desc.length} chars). Consider shortening.`);
      }
    }
  });
  
  return { errors, warnings };
}

/**
 * Generate a report on llms.txt status
 */
function generateReport() {
  console.log('🔍 Foundery.Space llms.txt Validation Report');
  console.log('='.repeat(50));
  
  const llmsTxtPath = path.join(__dirname, '..', '..', 'public', 'llms.txt');
  const llmsFullTxtPath = path.join(__dirname, '..', '..', 'public', 'llms-full.txt');
  
  // Check llms.txt
  if (fs.existsSync(llmsTxtPath)) {
    const llmsTxtContent = fs.readFileSync(llmsTxtPath, 'utf8');
    const { errors, warnings } = validateLlmsTxt(llmsTxtContent);
    
    console.log(`\n📄 llms.txt (${llmsTxtPath})`);
    console.log(`   Size: ${llmsTxtContent.length} characters, ${llmsTxtContent.split('\n').length} lines`);
    
    if (errors.length === 0 && warnings.length === 0) {
      console.log('   ✅ Status: VALID');
    } else {
      console.log('   ❌ Status: ISSUES FOUND');
      if (errors.length > 0) {
        console.log('   Errors:');
        errors.forEach(error => console.log(`     - ${error}`));
      }
      if (warnings.length > 0) {
        console.log('   Warnings:');
        warnings.forEach(warning => console.log(`     - ${warning}`));
      }
    }
  } else {
    console.log(`\n📄 llms.txt (${llmsTxtPath})`);
    console.log('   ❌ Status: FILE NOT FOUND');
  }
  
  // Check llms-full.txt
  if (fs.existsSync(llmsFullTxtPath)) {
    const llmsFullTxtContent = fs.readFileSync(llmsFullTxtPath, 'utf8');
    console.log(`\n📄 llms-full.txt (${llmsFullTxtPath})`);
    console.log(`   Size: ${llmsFullTxtContent.length} characters, ${llmsFullTxtContent.split('\n').length} lines`);
    
    // Basic validation for full version
    const lines = llmsFullTxtContent.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) {
      console.log('   ⚠️  Warning: File is empty');
    } else if (!lines[0].startsWith('# ')) {
      console.log('   ⚠️  Warning: Missing H1 title');
    } else {
      console.log('   ✅ Status: PRESENT');
    }
  } else {
    console.log(`\n📄 llms-full.txt (${llmsFullTxtPath})`);
    console.log('   ⚠️  Status: FILE NOT FOUND (optional but recommended)');
  }
  
  console.log('\n💡 Recommendations:');
  console.log('   1. Update llms.txt monthly to reflect new opportunities');
  console.log('   2. Keep llms.txt between 50-150 lines for optimal AI comprehension');
  console.log('   3. Update llms-full.txt quarterly with more comprehensive data');
  console.log('   4. Verify all URLs are accessible monthly');
  console.log('   5. Use specific, factual descriptions (10-30 words per entry)');
  console.log('   6. Lead with your most authoritative content in each section');
  console.log('');
}

/**
 * Main execution
 */
function main() {
  try {
    generateReport();
  } catch (error) {
    console.error('❌ Error generating report:', error.message);
    process.exit(1);
  }
}

main();
