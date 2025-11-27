# Git Setup Script for Catered By Me
# Run these commands one at a time in PowerShell

# Step 1: Configure Git (REPLACE WITH YOUR EMAIL)
Write-Host "Step 1: Configuring Git identity..." -ForegroundColor Yellow
Write-Host "⚠️  IMPORTANT: Replace YOUR_GITHUB_EMAIL with your actual GitHub email!" -ForegroundColor Red
# git config --global user.name "Karl"
# git config --global user.email "YOUR_GITHUB_EMAIL@example.com"

# Step 2: Navigate to project
Write-Host "`nStep 2: Navigating to project..." -ForegroundColor Yellow
Set-Location "C:\Users\small\My Drive\catered_by_me"

# Step 3: Check status
Write-Host "`nStep 3: Checking Git status..." -ForegroundColor Yellow
git status

# Step 4: Add all files
Write-Host "`nStep 4: Adding all files..." -ForegroundColor Yellow
git add .

# Step 5: Commit
Write-Host "`nStep 5: Creating commit..." -ForegroundColor Yellow
git commit -m "Initial MVP - ready for deployment"

# Step 6: Check remote
Write-Host "`nStep 6: Checking remote connection..." -ForegroundColor Yellow
git remote -v

# Step 7: Ensure branch is main
Write-Host "`nStep 7: Setting branch to main..." -ForegroundColor Yellow
git branch -M main

# Step 8: Push to GitHub
Write-Host "`nStep 8: Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "⚠️  You may be prompted for GitHub credentials!" -ForegroundColor Red
git push -u origin main

Write-Host "`n✅ Done! Check https://github.com/aluate/catered_by_me" -ForegroundColor Green

