import path from 'path';
describe('Hardhat debug', function () {
  it('prints hre keys', async function () {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const hre = require('hardhat');
    // expose keys to test output
    console.log('HRE KEYS:', Object.keys(hre).join(','));
  });
});
