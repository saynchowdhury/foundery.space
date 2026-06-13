import { safeJsonLd } from "../lib/utils";

const testData = {
  name: "Test Opportunity",
  description: "This is a test description with a <script>alert('XSS')</script> tag.",
  url: "https://foundery.space",
};

const result = safeJsonLd(testData);

console.log("Input data:", testData);
console.log("Safe JSON-LD output:", result);

if (result.includes("<script>") || result.includes("</script>")) {
  console.error("❌ FAILED: Script tag found in output!");
  process.exit(1);
}

if (result.includes("\\u003cscript\\u003e") && result.includes("\\u003c/script\\u003e")) {
  console.log("✅ PASSED: Script tags correctly escaped to \\u003c and \\u003e.");
} else {
  console.error("❌ FAILED: Script tags not correctly escaped.");
  process.exit(1);
}

const complexTestData = {
  text: "><img src=x onerror=alert(1)>",
};

const complexResult = safeJsonLd(complexTestData);
console.log("Complex Input:", complexTestData);
console.log("Complex Result:", complexResult);

if (complexResult.includes("<") || complexResult.includes(">")) {
  console.error("❌ FAILED: < or > found in output!");
  process.exit(1);
}

console.log("✅ All tests passed!");
