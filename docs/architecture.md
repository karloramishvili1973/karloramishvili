Architecture & Stack

Goal: enterprise-grade DAO deployed on Ethereum mainnet with hardened governance, timelock, multisig ops, and off-chain services for indexing and UX.

Chain

- Primary: Ethereum Mainnet (security priority)
- Optional: L2s (Arbitrum, Optimism) for non-custodial heavy interactions and scaling; mainnet remains custody for treasury.

Smart Contract Stack

- Solidity: ^0.8.18
- Contracts: OpenZeppelin Contracts (ERC20Votes, Governor, TimelockController)
- Upgradeability: optional — prefer minimal upgradable surface; use governance-controlled proxies (Transparent/Beacon) only after audit and strong multisig controls.

Tooling

- Development: Hardhat (scripts, tests, network management)
- Testing: Foundry for fuzzing (optional) + Hardhat mocha tests (existing repo)
- Static analysis: Slither + MythX (optional)
- Formatting/Linting: Prettier, ESLint for JS/TS; Solhint/Solium for Solidity

Operational Infrastructure

- Multisig: Gnosis Safe for operational key management and upgrades
- Timelock: OpenZeppelin `TimelockController` as governance execution layer
- Storage: IPFS/Arweave for proposal metadata snapshots
- Indexing: The Graph for governance analytics and frontend data
- Monitoring: Tenderly / Etherscan alerts + custom on-chain monitors (Prometheus + Grafana)

Frontend

- Framework: Next.js + TypeScript (existing `packages/frontend` structure)
- Wallets: MetaMask, WalletConnect, and Gnosis Safe integration
- UI Toolkit: Radix/Chakra/Material (team preference)

Backend / Off-chain

- Services: Relayer for transactions (optional), snapshot off-chain voting integration, The Graph subgraph for events
- Storage: Postgres for analytics, Redis for caching

CI/CD

- GitHub Actions or GitLab CI for test, lint, static analysis, and deploy pipelines
- Automated deploys gated by multisig/TLS and manual approvals for mainnet

Secrets & Keys

- Store keys in secure vault (HashiCorp Vault / AWS Secrets Manager)
- Use Gnosis Safe for multi-owner signing; no private keys on CI

Notes

- Prioritize minimizing on-chain complexity pre-audit. Keep core treasury flows minimal and controlled via Timelock + Gnosis Safe.
