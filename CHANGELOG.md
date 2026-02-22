# Changelog

## Unreleased (2026-02-22)

- CI: Harden GitHub Actions workflow to install workspace and per-package dependencies; added pnpm cache and pnpm v10 setup.
- Tests: Added Vitest smoke + unit tests for `packages/frontend` and `packages/backend` (utilities + tests).
- Contracts: Enabled Solidity optimizer in `packages/contracts/hardhat.config.ts` to reduce bytecode size.
- Repo: Committed `pnpm-lock.yaml` and adjusted workflow to ensure package binaries (`hardhat`, `vitest`) are available in CI.

Notes:

- CI run verified: contracts (Hardhat) tests pass (4 passing), frontend and backend Vitest smoke tests pass.
- Next actions: expand test coverage, address contract size warnings, and align Hardhat Node.js compatibility if needed.
  Changelog placeholder
