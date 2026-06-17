import { safeJsonLd } from "../lib/utils";

const testData = {
  name: "Test Opportunity",
  description: "This is a <script>alert('XSS')</script> test.",
  nested: {
    html: "<b>bold</b>",
  },
};

const result = safeJsonLd(testData);
console.log("Input data:", JSON.stringify(testData, null, 2));
console.log("Safe JSON-LD:", result);

if (result.includes("<script>") || result.includes("</script>")) {
  console.error("FAILED: result still contains <script> tags!");
  process.exit(1);
}

if (result.includes("<b>") || result.includes("</b>")) {
  console.error("FAILED: result still contains <b> tags!");
  process.exit(1);
}

if (result.includes("\\u003c") && result.includes("\\u003e")) {
  console.log("SUCCESS: dangerous characters escaped correctly.");
} else {
  console.error("FAILED: dangerous characters not escaped.");
  process.exit(1);
}
