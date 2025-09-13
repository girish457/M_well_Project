# M-Well Healthcare Application Setup Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "M-Well Healthcare Application Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js installation
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Node.js is installed! Version: $nodeVersion" -ForegroundColor Green
    } else {
        throw "Node.js not found"
    }
} catch {
    Write-Host "ERROR: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    Write-Host "Make sure to check 'Add to PATH' during installation" -ForegroundColor Red
    Write-Host "After installation, restart your computer and run this script again" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check npm
Write-Host ""
Write-Host "Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "npm is available! Version: $npmVersion" -ForegroundColor Green
    } else {
        throw "npm not found"
    }
} catch {
    Write-Host "ERROR: npm is not available" -ForegroundColor Red
    Write-Host "Please reinstall Node.js with npm included" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Install dependencies
Write-Host ""
Write-Host "Installing project dependencies..." -ForegroundColor Yellow
try {
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "Installation completed successfully!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "To start the development server, run:" -ForegroundColor Cyan
        Write-Host "  npm run dev" -ForegroundColor White
        Write-Host ""
        Write-Host "Then open http://localhost:3000 in your browser" -ForegroundColor Cyan
        Write-Host ""
    } else {
        throw "npm install failed"
    }
} catch {
    Write-Host "ERROR: Failed to install dependencies" -ForegroundColor Red
    Write-Host "Try running: npm cache clean --force" -ForegroundColor Red
    Write-Host "Then run this script again" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Read-Host "Press Enter to exit"





