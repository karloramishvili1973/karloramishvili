param(
    [string]$pat
)
if (-not $pat) { $pat = $env:GITHUB_PAT }
if (-not $pat) { Write-Error 'PAT not provided as argument or environment variable'; exit 1 }
Set-Location -Path (Join-Path $PSScriptRoot '..')
$owner = 'karloramishvili1973'
$repo = 'karloramishvili'
$remoteUrl = "https://$pat@github.com/$owner/$repo.git"
Write-Output "Setting remote origin to: https://<REDACTED>@github.com/$owner/$repo.git"
git remote remove origin -ErrorAction SilentlyContinue
git remote add origin $remoteUrl
git push -u origin feature/governance-tests-fix
