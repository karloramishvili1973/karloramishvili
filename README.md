# Enterprise DAO Monorepo (fresh)

This is a fresh ASCII-named workspace for the Enterprise DAO scaffold.

Run steps (PowerShell):

```powershell
npm install -g pnpm   # or use corepack prepare pnpm@latest --activate
pnpm -w install
cd packages/contracts
pnpm run compile
pnpm test
cd ../frontend
pnpm run dev
```
