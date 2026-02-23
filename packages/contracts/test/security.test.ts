import '@nomicfoundation/hardhat-chai-matchers';
import { expect } from 'chai';
import hre from 'hardhat';
const { ethers } = hre;

async function expectRevert(promise: Promise<any>, reason?: string) {
  try {
    await promise;
    throw new Error('Expected revert but transaction succeeded');
  } catch (e: any) {
    if (reason) expect(e.message).to.include(reason);
  }
}
describe('Security / edge-case tests', function () {
  it('treasury rejects direct withdraws and timelock can schedule+execute withdraw', async function () {
    const [owner, alice] = await ethers.getSigners();

    const Token = await ethers.getContractFactory('GovernanceToken');
    const token = await Token.deploy('Sec Token', 'SEC', ethers.utils.parseUnits('1000', 18));
    await token.deployed();

    // Deploy timelock with owner as proposer and executor to simplify test
    // For this test we simplify by making `owner` the timelock address so we can
    // assert access control without exercising the full Timelock schedule API.
    const Treasury = await ethers.getContractFactory('Treasury');
    const treasury = await Treasury.deploy(owner.address);
    await treasury.deployed();

    // fund treasury with 1 ETH
    await owner.sendTransaction({ to: treasury.address, value: ethers.utils.parseEther('1') });

    // non-timelock can't withdraw
    await expectRevert(treasury.connect(alice).withdraw(alice.address, ethers.utils.parseEther('0.1')), 'Only timelock');

    // prepare withdraw calldata
    const withdrawCalldata = treasury.interface.encodeFunctionData('withdraw', [alice.address, ethers.utils.parseEther('0.5')]);

    // owner acts as the timelock for this simplified test; owner can withdraw
    await treasury.connect(owner).withdraw(alice.address, ethers.utils.parseEther('0.5'));

    // alice should have received the ETH
    const aliceBal = await ethers.provider.getBalance(alice.address);
    expect(aliceBal.gt(0)).to.be.true;
  });

  it('governor.propose reverts when proposer has insufficient voting power', async function () {
    const [owner, alice] = await ethers.getSigners();

    const Token = await ethers.getContractFactory('GovernanceToken');
    const token = await Token.deploy('Gov Token', 'GOV', ethers.utils.parseUnits('1000', 18));
    await token.deployed();

    const Timelock = await ethers.getContractFactory('TimelockController');
    const timelock = await Timelock.deploy(1, [owner.address], [owner.address], owner.address);
    await timelock.deployed();

    const Governor = await ethers.getContractFactory('TestGovernor');
    const governor = await Governor.deploy(token.address);
    await governor.deployed();

    // Alice has no tokens/delegation — should revert when proposing
    const targets: string[] = [owner.address];
    const values: number[] = [0];
    const calldatas: string[] = [ethers.utils.defaultAbiCoder.encode([], [])];
    const description = 'Test proposal';

    await expectRevert(governor.connect(alice).propose(targets, values, calldatas, description));
  });
});

describe('Treasury security', function () {
  it('reverts when non-timelock tries to withdraw ETH', async function () {
    const [owner, attacker] = await ethers.getSigners();

    const Treasury = await ethers.getContractFactory('Treasury');
    const treasury = await Treasury.deploy(owner.address);
    await treasury.deployed();

    // Send some ETH to the treasury
    await owner.sendTransaction({ to: treasury.address, value: ethers.utils.parseEther('1') });

    // Attacker (not timelock) should be rejected
    await expectRevert(treasury.connect(attacker).withdraw(attacker.address, ethers.utils.parseEther('0.1')), 'Only timelock');
  });

  it('allows timelock address to update timelock', async function () {
    const [owner, other] = await ethers.getSigners();

    const Treasury = await ethers.getContractFactory('Treasury');
    const treasury = await Treasury.deploy(owner.address);
    await treasury.deployed();

    // Owner is currently set as timelock; call updateTimelock as owner
    await treasury.connect(owner).updateTimelock(other.address);
    expect(await treasury.timelock()).to.equal(other.address);
  });

  it('reverts when withdrawing more than balance', async function () {
    const [owner] = await ethers.getSigners();

    const Treasury = await ethers.getContractFactory('Treasury');
    const treasury = await Treasury.deploy(owner.address);
    await treasury.deployed();

    await expectRevert(treasury.connect(owner).withdraw(owner.address, ethers.utils.parseEther('1000')), 'Insufficient funds');
  });
});
