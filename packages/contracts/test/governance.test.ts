import { expect } from "chai";
import hre from 'hardhat';
const { ethers } = hre;

describe("Governance flow (basic)", function () {
  it("deploys token and timelock", async function () {
    const [owner] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("GovernanceToken");
    const token = await Token.deploy("Test Token", "TST", ethers.utils.parseUnits("1000", 18));
    await token.deployed();

    const Timelock = await ethers.getContractFactory("TimelockController");
    const timelock = await Timelock.deploy(1, [], [], owner.address);
    await timelock.deployed();

    expect((await token.totalSupply()).gt(0)).to.be.true;
    expect((await timelock.getMinDelay()).toNumber()).to.equal(1);
  });
});
