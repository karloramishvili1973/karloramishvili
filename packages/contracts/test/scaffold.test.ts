import hre from 'hardhat';
import { expect } from 'chai';
const { ethers } = hre;

describe('Contracts scaffold', function () {
  it('Treasury: accepts deposits and rejects non-timelock withdraws', async function () {
    const [deployer, other] = await ethers.getSigners();

    const Treasury = await ethers.getContractFactory('Treasury');
    const treasury = await Treasury.connect(deployer).deploy(deployer.address);
    await treasury.deployed();

    // deposit 1 ETH
    await deployer.sendTransaction({ to: treasury.address, value: ethers.utils.parseEther('1') });
    const balance = await ethers.provider.getBalance(treasury.address);
    expect(balance.eq(ethers.utils.parseEther('1'))).to.be.true;

    // non-timelock withdraw should revert (use try/catch to avoid matcher dependency)
    try {
      await treasury.connect(other).withdraw(other.address, ethers.utils.parseEther('0.1'));
      throw new Error('Expected revert');
    } catch (err: any) {
      expect(err.message).to.include('Only timelock');
    }
  });
});
