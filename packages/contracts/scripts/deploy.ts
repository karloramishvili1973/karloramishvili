import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying from:", deployer.address);

  const initialSupply = ethers.utils.parseUnits("1000000000", 18); // 1B tokens
  const Token = await ethers.getContractFactory("GovernanceToken");
  const token = await Token.deploy("Enterprise DAO Token", "EDAO", initialSupply);
  await token.deployed();
  console.log("GovernanceToken deployed to:", token.address);

  const Timelock = await ethers.getContractFactory("TimelockController");
  const timelock = await Timelock.deploy(2 * 24 * 3600, [], []);
  await timelock.deployed();
  console.log("TimelockController deployed to:", timelock.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
