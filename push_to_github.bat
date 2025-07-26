@echo off
REM Set Git user info (global, only needed once per machine)
git config --global user.name "Paras0143"
git config --global user.email "paraskumar9953952680@gmail.com"

REM Initialize git if not already initialized
IF NOT EXIST ".git" (
    git init
)

REM Add remote origin (ignore error if already exists)
git remote add origin https://github.com/Paras0143/ECO-.git 2>nul

REM Add all files
git add .

REM Commit changes
git commit -m "Initial commit of EcoVision Waste Management project"

REM Set branch to main
git branch -M main

REM Push to GitHub
git push -u origin main

pause 