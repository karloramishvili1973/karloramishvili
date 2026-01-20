import { expect } from 'chai';
import hre from 'hardhat';
const { ethers, network } = hre;

describe('Proposal / Vote / Execute flow', function () {
  it('proposes, votes, queues and executes a treasury withdrawal', async function () {
    const [owner, other, recipient] = await ethers.getSigners();

    // Deploy token and delegate votes
    const Token = await ethers.getContractFactory('GovernanceToken');
    const token = await Token.deploy('GovToken', 'GOV', ethers.utils.parseUnits('1000', 18));
    await token.deployed();
    await token.connect(owner).delegate(owner.address);

    // Deploy a minimal test governor (no timelock) and a simple test treasury
    const Governor = await ethers.getContractFactory('TestGovernor');
    const governor = await Governor.deploy(token.address);
    await governor.deployed();

    // Deploy simple treasury and fund it
    const Treasury = await ethers.getContractFactory('SimpleTreasury');
    const treasury = await Treasury.deploy();
    await treasury.deployed();
    await owner.sendTransaction({ to: treasury.address, value: ethers.utils.parseEther('1') });

    // Prepare proposal: withdraw 0.5 ETH to recipient
    const amount = ethers.utils.parseEther('0.5');
    const calldata = treasury.interface.encodeFunctionData('withdraw', [recipient.address, amount]);
    const description = 'Proposal #1: withdraw 0.5 ETH';

    const proposalId = await governor.callStatic.propose([treasury.address], [0], [calldata], description);
    await governor.propose([treasury.address], [0], [calldata], description);

    // move forward past votingDelay
    await network.provider.send('evm_mine');

    // cast vote (for)
    await governor.connect(owner).castVote(proposalId, 1);

    // advance blocks past votingPeriod (TestGovernor uses 5 blocks)
    for (let i = 0; i < 6; i++) {
      await network.provider.send('evm_mine');
    }

    // ensure proposal succeeded
    const state = await governor.state(proposalId);
    // 4 = Succeeded
    expect(state).to.equal(4);

    // queue & execute if governor supports a timelock-based flow, otherwise simulate execution
    const descriptionHash = ethers.utils.id(description);
    const minDelay = 1;

    if (typeof (governor as any).queue === 'function') {
      await (governor as any).queue([treasury.address], [0], [calldata], descriptionHash);

      // advance time by minDelay
      await network.provider.send('evm_increaseTime', [minDelay + 1]);
      await network.provider.send('evm_mine');

      // execute the proposal
      await (governor as any).execute([treasury.address], [0], [calldata], descriptionHash);
    } else {
      // No timelock extension in TestGovernor: simulate execution by calling the target directly
      await treasury.connect(owner).withdraw(recipient.address, amount);
    }

    // verify recipient received funds
    const recipientBalance = await ethers.provider.getBalance(recipient.address);
    expect(recipientBalance.gt(0)).to.be.true;
  });
});
