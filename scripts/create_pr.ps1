$token = $env:GITHUB_PAT
if (-not $token) { Write-Error 'GITHUB_PAT environment variable not set'; exit 1 }
$owner = 'karloramishvili1973'
$repoName = 'karloramishvili'
$uri = "https://api.github.com/repos/$owner/$repoName"
$repo = Invoke-RestMethod -Headers @{ Authorization = "token $token" } -Uri $uri
$base = $repo.default_branch
$body = @{
    title = 'chore: fix TestGovernor overrides and tests'
    head  = 'feature/governance-tests-fix'
    base  = $base
    body  = 'Fixes TestGovernor override, makes proposal test resilient, adds tsconfig and small hardhat config tweaks.'
} | ConvertTo-Json
$pr = Invoke-RestMethod -Headers @{ Authorization = "token $token"; 'User-Agent' = 'powershell' } -Method Post -Uri ($uri + '/pulls') -Body $body -ContentType 'application/json'
Write-Output $pr.html_url
