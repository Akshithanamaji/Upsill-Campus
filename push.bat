@echo off
title Push to Git - Smart City Dashboard
color 0B
echo ===================================================
echo   Smart City - Automate Git Push to GitHub
echo ===================================================
echo.
echo Target Repository: https://github.com/Akshithanamaji/Smart-City.git
echo Workspace Path:    %~dp0
echo.
echo This script will:
echo  1. Initialize Git (if not already done)
echo  2. Add the remote 'origin'
echo  3. Add all local changes
echo  4. Commit your changes
echo  5. Push to the 'main' branch
echo.
set /p confirm="Do you want to continue? (Y/N, default Y): "
if /i "%confirm%"=="N" goto end

echo.
echo [1/5] Checking Git installation...
where git >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo ERROR: Git is not installed or not in your PATH.
    echo Please install Git from https://git-scm.com/ and try again.
    goto pause_end
)
echo Git is installed.

echo.
echo [2/5] Initializing Git repository if needed...
if not exist "%~dp0.git" (
    git init
    echo Git repository initialized!
) else (
    echo Git repository already initialized.
)

echo.
echo [3/5] Setting up remote 'origin'...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/Akshithanamaji/Smart-City.git
echo Remote 'origin' configured to: https://github.com/Akshithanamaji/Smart-City.git

echo.
echo [4/5] Stage changes and Commit...
git add .
echo Changes staged.
echo.
set /p commit_msg="Enter commit message (Press ENTER for default: 'feat: implement traffic dashboard settings and live feed'): "
if "%commit_msg%"=="" (
    set commit_msg=feat: implement traffic dashboard settings and live feed
)
git commit -m "%commit_msg%"

echo.
echo [5/5] Pushing to GitHub (main branch)...
git branch -M main
echo.
echo IMPORTANT: If a GitHub login window pops up, please complete the sign-in.
echo.
git push -u origin main

if %errorlevel% neq 0 (
    color 0C
    echo.
    echo ---------------------------------------------------
    echo ERROR: Push failed.
    echo Possible causes:
    echo  - You may need to authenticate with GitHub.
    echo  - The repository https://github.com/Akshithanamaji/Smart-City.git is empty and needs standard push, or has existing commits you need to pull.
    echo  - Network issue.
    echo ---------------------------------------------------
) else (
    color 0A
    echo.
    echo ===================================================
    echo SUCCESS: Code successfully pushed to GitHub!
    echo ===================================================
)

:pause_end
echo.
pause
:end
