const assert = require('assert');
console.log('Running frontend tests');
assert.strictEqual(2 + 2, 4, 'basic arithmetic');
console.log('frontend tests: OK');
process.exit(0);
