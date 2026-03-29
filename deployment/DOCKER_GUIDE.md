# 🚀 College Evaluation System - Docker Guide

This guide describes how to deploy the entire system using our autonomous Docker environment, pre-loaded with your real evaluation data.

## 📁 Deployment Directory Overview
All Docker files are located in the `deployment/` folder:
- `Dockerfile`: Production Next.js build.
- `docker-compose.yml`: Multi-service orchestration (App, Nginx, Redis, MySQL).
- `stop_and_run.ps1`: Automation script for Windows.
- `.dockerignore`: Optimized build context.

---

## 🛠️ Step-by-Step Deployment

### Step 1: Prepare the Environment
Ensure **Docker Desktop** is running. You no longer need a local MySQL service (like XAMPP) running on your machine, as Docker will provision its own database initialized with your real data.

### Step 2: Run the Automation Script
Open your terminal (PowerShell) in the project root and run:
```powershell
.\deployment\stop_and_run.ps1
```
This script will:
1. Stop any old containers.
2. Stage the optimized `.dockerignore` for the build.
3. Build the production image.
4. Launch **App**, **Nginx**, **Redis**, and **MySQL**.
5. Clean up the project root.

### Step 3: Access the Portal
Once the terminal logs show `ready on 0.0.0.0:3000`, open your browser:
- **Main Portal (Nginx Proxy)**: [http://localhost:81](http://localhost:81)
- **Direct App Access**: [http://localhost:3000](http://localhost:3000)

### Step 4: Database Connection (Internal)
The application is now connected to a dedicated **MySQL Container** within the Docker network:
- **Source of Data**: `database/cite_es.sql` (Real evaluation records, users, and audit logs)
- **Persistence**: Data is stored in a Docker volume, persisting across restarts.
- **Port (External/Host)**: `3307` (The Docker database is on 3307 so it doesn't conflict with your local XAMPP/MySQL on 3306)
- **Port (Internal/App)**: `3306` (The application automatically handles this; no changes needed)

---

## 🏗️ Architecture Features
- **Nginx Proxy**: Securely manages all incoming traffic on Port 80 (Internal) / 81 (External).
- **In-Docker Database**: Autonomous MySQL 8.0 instance initialized with real PHP-version data.
- **Redis Cache**: Provisioned for high-performance session tracking.
- **Clean Root**: No Docker clutter in your workspace.

---

## 🛑 Management Commands
- **Stop System**: `docker-compose -f deployment/docker-compose.yml down`
- **View Logs**: `docker-compose -f deployment/docker-compose.yml logs -f`
- **Rebuild**: Run Step 2 again.
