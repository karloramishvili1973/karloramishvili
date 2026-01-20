# Security Checklist

- Use a Timelock for all privileged actions and upgrades.
- Hold initial admin keys in a Gnosis Safe multisig (example 5-of-7 placeholder).
- Require all upgrades to be proposed via Governor and executed through Timelock.
- Run static analysis (Slither) and symbolic analysis (MythX/CERTA) before audits.
- Budget for at least 1 professional audit; follow-up re-audit recommended.
- Start a bug bounty (Immunefi) after audits and fixes are complete.
- Monitor contracts with Tenderly or custom alerting for large transfers and unusual activity.
- Keep an emergency pause pattern accessible via Timelock + multisig in critical situations.

> Legal: consult counsel regarding token distribution and compliance in target jurisdictions.
