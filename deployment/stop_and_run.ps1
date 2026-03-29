# Docker Test - Run Script for College Evaluation System
# Optimized for Windows PowerShell

Write-Host "--- Stopping existing containers ---" -ForegroundColor Cyan
docker-compose -f deployment/docker-compose.yml down

Write-Host "--- Staging ignore rules for optimized build context ---" -ForegroundColor Yellow
Copy-Item ".\deployment\.dockerignore" ".\" -ErrorAction SilentlyContinue

Write-Host "--- Building and starting in detached mode ---" -ForegroundColor Green
docker-compose -f deployment/docker-compose.yml up -d --build

Write-Host "--- Cleaning up temporary build artifacts ---" -ForegroundColor Yellow
Remove-Item ".\.dockerignore" -ErrorAction SilentlyContinue

Write-Host "--- Project is now deployed across [app, nginx, redis, db] ---" -ForegroundColor Green
Write-Host "Access locally via: http://localhost" -ForegroundColor White
Write-Host "Database available on port 3306" -ForegroundColor White
Write-Host "Redis available on port 6379" -ForegroundColor White

Write-Host "--- Checking logs for initial startup errors (Ctrl+C to stop trailing) ---" -ForegroundColor Cyan
docker-compose -f deployment/docker-compose.yml logs -f app
