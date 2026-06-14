import { safeJsonLd } from "../lib/utils";

const testPayloads = [
  {
    name: "Basic object",
    data: { key: "value" },
    expected: '{"key":"value"}'
  },
  {
    name: "Script breakout attempt",
    data: { description: "</script><script>alert('XSS')</script>" },
    expected: '{"description":"\\u003c/script\\u003e\\u003cscript\\u003ealert(\'XSS\')\\u003c/script\\u003e"}'
  },
  {
    name: "Angle brackets in text",
    data: { bio: "I <3 coding & 1 > 0" },
    expected: '{"bio":"I \\u003c3 coding & 1 \\u003e 0"}'
  }
];

function runTests() {
  console.log("Running safeJsonLd verification tests...");
  let passed = 0;
  let failed = 0;

  for (const test of testPayloads) {
    const result = safeJsonLd(test.data);
    if (result === test.expected) {
      console.log(`✅ PASSED: ${test.name}`);
      passed++;
    } else {
      console.error(`❌ FAILED: ${test.name}`);
      console.error(`   Expected: ${test.expected}`);
      console.error(`   Received: ${result}`);
      failed++;
    }
  }

  console.log(`\nTests finished: ${passed} passed, ${failed} failed.`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
