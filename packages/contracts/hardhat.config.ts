import "@nomiclabs/hardhat-ethers";
// Use minimal ethers plugin to provide `hre.ethers` without full toolbox.

const ALCHEMY = process.env.ALCHEMY_API_KEY || "";
const MNEMONIC = process.env.MNEMONIC || "test test test test test test test test test test test junk";

const config = {
  solidity: {
    compilers: [{ version: "0.8.18" }]
  },
  networks: {
    hardhat: { chainId: 1337 },
    sepolia: { url: ALCHEMY ? `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY}` : "", accounts: { mnemonic: MNEMONIC } },
    mainnet: { url: ALCHEMY ? `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY}` : "", accounts: { mnemonic: MNEMONIC } }
  }
} as any;

export default config;
