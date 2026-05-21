# Smart City - Automate Git Push
$Host.UI.RawUI.WindowTitle = "Push to Git - Smart City Dashboard"

Clear-Host
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  Smart City - Automate Git Push to GitHub         " -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Target Repository: https://github.com/Akshithanamaji/Smart-City.git" -ForegroundColor Yellow
Write-Host "Workspace Path:    $PSScriptRoot" -ForegroundColor Yellow
Write-Host ""
Write-Host "This script will:"
Write-Host " 1. Initialize Git (if not already done)"
Write-Host " 2. Add the remote 'origin'"
Write-Host " 3. Add all local changes"
Write-Host " 4. Commit your changes"
Write-Host " 5. Push to the 'main' branch"
Write-Host ""

$confirm = Read-Host "Do you want to continue? (Y/N, default Y)"
if ($confirm -eq "N" -or $confirm -eq "n") {
    exit
}

Write-Host ""
Write-Host "[1/5] Checking Git installation..." -ForegroundColor Cyan
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Git is not installed or not in your PATH." -ForegroundColor Red
    Write-Host "Please install Git from https://git-scm.com/ and try again." -ForegroundColor Red
    Read-Host "Press Enter to exit..."
    exit
}
Write-Host "Git is installed." -ForegroundColor Green

Write-Host ""
Write-Host "[2/5] Initializing Git repository if needed..." -ForegroundColor Cyan
if (!(Test-Path "$PSScriptRoot\.git")) {
    git init
    Write-Host "Git repository initialized!" -ForegroundColor Green
} else {
    Write-Host "Git repository already initialized." -ForegroundColor Green
}

Write-Host ""
Write-Host "[3/5] Setting up remote 'origin'..." -ForegroundColor Cyan
git remote remove origin 2>$null
git remote add origin https://github.com/Akshithanamaji/Smart-City.git
Write-Host "Remote 'origin' configured." -ForegroundColor Green

Write-Host ""
Write-Host "[4/5] Stage changes and Commit..." -ForegroundColor Cyan
git add .
Write-Host "Changes staged."

$commit_msg = Read-Host "Enter commit message (Press ENTER for default: 'feat: implement traffic dashboard settings and live feed')"
if ([string]::IsNullOrEmpty($commit_msg)) {
    $commit_msg = "feat: implement traffic dashboard settings and live feed"
}
git commit -m $commit_msg

Write-Host ""
Write-Host "[5/5] Pushing to GitHub (main branch)..." -ForegroundColor Cyan
git branch -M main
Write-Host ""
Write-Host "IMPORTANT: If a GitHub login window pops up, please complete the sign-in." -ForegroundColor Yellow
Write-Host ""
git push -u origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "---------------------------------------------------" -ForegroundColor Red
    Write-Host "ERROR: Push failed." -ForegroundColor Red
    Write-Host "Possible causes:" -ForegroundColor Red
    Write-Host " - You may need to authenticate with GitHub." -ForegroundColor Red
    Write-Host " - The repository https://github.com/Akshithanamaji/Smart-City.git is empty and needs standard push, or has existing commits you need to pull." -ForegroundColor Red
    Write-Host " - Network issue." -ForegroundColor Red
    Write-Host "---------------------------------------------------" -ForegroundColor Red
} else {
    Write-Host ""
    Write-Host "===================================================" -ForegroundColor Green
    Write-Host "SUCCESS: Code successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "===================================================" -ForegroundColor Green
}

Write-Host ""
Read-Host "Press Enter to exit..."
