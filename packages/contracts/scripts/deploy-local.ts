import { ethers } from 'hardhat';

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with', deployer.address);

  const Token = await ethers.getContractFactory('GovernanceToken');
  const token = await Token.deploy('DAO Token', 'DAO', ethers.utils.parseUnits('1000000', 18));
  await token.deployed();
  console.log('GovernanceToken deployed to:', token.address);

  const Timelock = await ethers.getContractFactory('TimelockController');
  const minDelay = 1; // 1 second for local testing
  const proposers: string[] = [deployer.address];
  const executors: string[] = [deployer.address];
  const timelock = await Timelock.deploy(minDelay, proposers, executors, deployer.address);
  await timelock.deployed();
  console.log('TimelockController deployed to:', timelock.address);

  const Governor = await ethers.getContractFactory('GovernorContract');
  const governor = await Governor.deploy(token.address, timelock.address, { gasLimit: 8000000 });
  await governor.deployed();
  console.log('GovernorContract deployed to:', governor.address);

  const Treasury = await ethers.getContractFactory('Treasury');
  const treasury = await Treasury.deploy(timelock.address);
  await treasury.deployed();
  console.log('Treasury deployed to:', treasury.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
