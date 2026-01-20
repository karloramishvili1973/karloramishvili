Param()
Write-Host "Running local CI steps (PowerShell)" -ForegroundColor Cyan

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# Use pnpm if available, otherwise fall back to npm
function Run-InstallRoot() {
    if (Get-Command pnpm -ErrorAction SilentlyContinue) {
        Write-Host "Using pnpm to install workspace dependencies..."
        pnpm -w install --frozen-lockfile
    } else {
        Write-Host "pnpm not found; using npm to install workspace dependencies..."
        npm install
    }
}

function Run-ContractsTests() {
    Push-Location packages/contracts
    try {
        if (Test-Path node_modules -PathType Container -ErrorAction SilentlyContinue) {
            Write-Host "Node modules present in packages/contracts"
        } else {
            Write-Host "Installing packages/contracts dependencies..."
            if (Get-Command pnpm -ErrorAction SilentlyContinue) { pnpm install --frozen-lockfile } else { npm install }
        }

        Write-Host "Compiling contracts..."
        npm run compile

        Write-Host "Running contracts tests..."
        npm test 2>&1 | Tee-Object test-output.txt
        Write-Host "Tests finished. Output saved to packages/contracts/test-output.txt"
    } finally {
        Pop-Location
    }
}

Run-InstallRoot
Run-ContractsTests
