# Governance Design (hybrid)

This document describes the hybrid governance model used by the DAO:

- Off-chain signaling: Snapshot for community discussion and signaling.
- On-chain execution: OpenZeppelin Governor v4 + Timelock for critical changes (upgrades, treasury moves).

Suggested parameters (editable):
- Total supply: 1,000,000,000
- Proposal threshold: 0.25% (2,500,000)
- Quorum: 4% (40,000,000)
- Voting period: 7 days
- Timelock delay: 48-72 hours (longer for critical ops)

Flow:
1. Community discusses and signals on Snapshot.
2. Core contributors or proposers create on-chain proposal via Governor contract.
3. Proposal votes. If passed, it is queued in Timelock.
4. After Timelock delay, proposal can be executed (transactions performed).

Snapshot integration:
- Use `erc20`/`erc20-balance-of` strategy tied to `ERC20Votes` snapshot support.
- Snapshot is for signaling; on-chain proposals are authoritative for actions requiring state changes.

Multisig & guardians:
- Initial admin keys are expected to be a Gnosis Safe multisig (placeholder 5-of-7 in `gnosis/`).
- The Timelock should be configured so that emergency operations require multiple signers until DAO fully decentralized.
