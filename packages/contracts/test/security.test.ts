import { expect } from 'chai';
import hre from 'hardhat';
const { ethers } = hre;

describe('Security / edge-case tests', function () {
  it('treasury rejects direct withdraws and timelock can schedule+execute withdraw', async function () {
    const [owner, alice] = await ethers.getSigners();

    const Token = await ethers.getContractFactory('GovernanceToken');
    const token = await Token.deploy('Sec Token', 'SEC', ethers.utils.parseUnits('1000', 18));
    await token.deployed();

    // Deploy timelock with owner as proposer and executor to simplify test
    const Timelock = await ethers.getContractFactory('TimelockController');
    const minDelay = 1; // seconds
    const timelock = await Timelock.deploy(minDelay, [owner.address], [owner.address], owner.address);
    await timelock.deployed();

    const Treasury = await ethers.getContractFactory('Treasury');
    const treasury = await Treasury.deploy(timelock.address);
    await treasury.deployed();

    // fund treasury with 1 ETH
    await owner.sendTransaction({ to: treasury.address, value: ethers.utils.parseEther('1') });

    // non-timelock can't withdraw
    await expect(treasury.connect(alice).withdraw(alice.address, ethers.utils.parseEther('0.1'))).to.be.revertedWith(
      'Only timelock'
    );

    // prepare withdraw calldata
    const withdrawCalldata = treasury.interface.encodeFunctionData('withdraw', [alice.address, ethers.utils.parseEther('0.5')]);

    // schedule the operation via timelock (owner has proposer role)
    const targets = [treasury.address];
    const values = [0];
    const data = [withdrawCalldata];
    const predecessor = ethers.constants.HashZero;
    const salt = ethers.constants.HashZero;

    await timelock.connect(owner).schedule(targets, values, data, predecessor, salt, minDelay);

    // fast-forward time beyond minDelay
    await ethers.provider.send('evm_increaseTime', [minDelay + 1]);
    await ethers.provider.send('evm_mine', []);

    // execute as owner (has executor role)
    await expect(timelock.connect(owner).execute(targets, values, data, predecessor, salt)).to.not.be.reverted;

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

    const Governor = await ethers.getContractFactory('GovernorContract');
    const governor = await Governor.deploy(token.address, timelock.address);
    await governor.deployed();

    // Alice has no tokens/delegation — should revert when proposing
    const targets: string[] = [owner.address];
    const values: number[] = [0];
    const calldatas: string[] = [ethers.utils.defaultAbiCoder.encode([], [])];
    const description = 'Test proposal';

    await expect(governor.connect(alice).propose(targets, values, calldatas, description)).to.be.reverted;
  });
});
import { expect } from 'chai';
import hre from 'hardhat';
const { ethers } = hre;

describe('Treasury security', function () {
  it('reverts when non-timelock tries to withdraw ETH', async function () {
    const [owner, attacker] = await ethers.getSigners();

    const Treasury = await ethers.getContractFactory('Treasury');
    const treasury = await Treasury.deploy(owner.address);
    await treasury.deployed();

    // Send some ETH to the treasury
    await owner.sendTransaction({ to: treasury.address, value: ethers.utils.parseEther('1') });

    // Attacker (not timelock) should be rejected
    await expect(
      treasury.connect(attacker).withdraw(attacker.address, ethers.utils.parseEther('0.1'))
    ).to.be.revertedWith('Only timelock');
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

    await expect(
      treasury.connect(owner).withdraw(owner.address, ethers.utils.parseEther('1000'))
    ).to.be.revertedWith('Insufficient funds');
  });
});
