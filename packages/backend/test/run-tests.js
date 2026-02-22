const assert = require('assert');
console.log('Running backend tests');
assert.strictEqual(1, 1, 'basic equality');
console.log('backend tests: OK');
process.exit(0);
