Tokenomics — Seed Proposal

Token basics

- Token: `ERC20Votes` with 18 decimals
- Total supply: 1,000,000,000 (1 billion) tokens

Initial distribution (suggested)

- Treasury / Ecosystem: 30% (300,000,000)
- Team & Founders (vested): 20% (200,000,000) — 4-year vesting with 1-year cliff
- Investors / Seed: 15% (150,000,000) — vesting schedules as negotiated
- Liquidity & Market Ops: 15% (150,000,000)
- Community & Airdrop / Grants: 10% (100,000,000)
- Advisors: 5% (50,000,000)

Governance parameters (MVP sensible defaults)

- Voting token: `ERC20Votes` snapshot-based voting
- Voting delay: 1 block
- Voting period: 45818 blocks (~7 days at 15s blocks)
- Proposal threshold: 1e18 (1 token) — set higher in production as needed
- Quorum: 4% of total supply (GovernorVotesQuorumFraction(4))
- Timelock: 48–72 hours for major treasury changes; shorter for parameter changes if desired

Monetization mechanics

- Protocol fee: configurable small fee (e.g., 0.25%) routed to treasury
- Staking: optional staking for protocol benefits; staking fees feed treasury
- Enterprise features: subscription or on-chain fee for premium services
- Buyback policy: treasury-managed buybacks authorized by governance

Vesting & anti-dump

- Team tokens locked with linear vesting; cliff to align incentives
- Early investor tokens vesting to protect from immediate sell pressure

Sample calculations

- Quorum at 4% = 40,000,000 tokens
- A single large-holder owning 1% = 10,000,000 tokens

Next steps

- Decide final supply and distribution percentages
- Map vesting smart contracts (e.g., `TokenVesting` or OpenZeppelin `VestingWallet`)
- Adjust `proposalThreshold` and `quorum` after community/governance decisions
