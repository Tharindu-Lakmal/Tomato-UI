# Tomato UI — Full-Stack VPS + Docker Deployment Guide

---

## ❓ First: Where Does Everything Actually Run?

This is the most important thing to understand before anything else.

```
┌──────────────────────────────────────────────────────────────────────┐
│                        YOUR LAPTOP                                   │
│  - Write code                                                        │
│  - git push → triggers the pipeline                                  │
└─────────────────────┬────────────────────────────────────────────────┘
                      │ git push
                      ▼
┌──────────────────────────────────────────────────────────────────────┐
│                      GITHUB                                          │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │              GitHub Actions Runner (ubuntu-latest)           │    │
│  │  ← This is a temporary VM that GitHub spins up for FREE     │    │
│  │                                                              │    │
│  │  Runs your workflow steps:                                   │    │
│  │   1. git checkout                                            │    │
│  │   2. npm install + npm run build                             │    │
│  │   3. docker build (builds the image)                         │    │
│  │   4. docker push (pushes image to Docker Hub)                │    │
│  │   5. SSH into your VPS and tells it to pull + restart        │    │
│  └──────────────────────────────┬──────────────────────────────┘    │
└─────────────────────────────────│────────────────────────────────────┘
                                  │ SSH + docker pull
                                  ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    YOUR VPS (e.g., DigitalOcean)                     │
│  - This is where Docker ACTUALLY RUNS permanently                    │
│  - Docker containers run here 24/7                                   │
│                                                                      │
│   ┌────────────────────────────────────────────────────────────┐    │
│   │  Docker Compose                                             │    │
│   │  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │    │
│   │  │   frontend   │  │   backend    │  │    postgres DB   │  │    │
│   │  │  (Nginx SPA) │  │ (Node/Express│  │  (persistent    │  │    │
│   │  │   :3000      │  │   :5000)     │  │   data volume)  │  │    │
│   │  └──────┬───────┘  └──────┬───────┘  └────────┬────────┘  │    │
│   │         └─────────────────┴──────────────────┘            │    │
│   │                           │                                │    │
│   │  ┌────────────────────────▼──────────────────────────┐    │    │
│   │  │         Nginx Reverse Proxy (:80 / :443)           │    │    │
│   │  │  yourdomain.com        → frontend container        │    │    │
│   │  │  yourdomain.com/api/*  → backend container         │    │    │
│   │  └────────────────────────────────────────────────────┘    │    │
│   └────────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────┘
```

### Summary — Who Does What

| Where | What Runs There | When |
|---|---|---|
| **Your laptop** | Code editing, `git push` | When you work |
| **GitHub Actions** | Build, test, `docker build`, `docker push`, SSH deploy command | On every `git push` to `main` |
| **Docker Hub** | Stores built Docker images | Persistent registry |
| **Your VPS** | Docker containers running frontend + backend + DB | 24/7, always on |

> [!IMPORTANT]
> **GitHub Actions does NOT run your app.** It's just a build-and-deploy robot.
> **Your VPS is where Docker actually runs your containers permanently.**

---

## 🏗️ Full Project Structure (Frontend + Backend)

Your monorepo should look like this:

```
tomato-ui/  (or rename to tomato-app/)
├── frontend/                  ← Your current Vite+React project
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── vite.config.js         ← Change base: '/' here
│   ├── package.json
│   └── Dockerfile             ← New file
│
├── backend/                   ← New Node.js/Express API
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── index.js
│   ├── package.json
│   └── Dockerfile             ← New file
│
├── nginx/                     ← Reverse proxy config
│   └── nginx.conf
│
├── docker-compose.yml         ← Orchestrates all containers
├── docker-compose.prod.yml    ← Production overrides
├── .env.example               ← Template for env variables
└── .github/
    └── workflows/
        └── deploy.yml         ← Updated CI/CD pipeline
```

---

## 📁 File Configurations

### 1. `frontend/vite.config.js` — Fix the base path

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',           // ← Change from '/Tomato-UI/' to '/'
  server: {
    open: true,
    port: 3001,
    proxy: {
      // Forward /api calls to backend during local dev
      '/api': 'http://localhost:5000'
    }
  }
})
```

### 2. `frontend/Dockerfile` — Multi-stage build

```dockerfile
# Stage 1: Build the React app
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx-spa.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

`frontend/nginx-spa.conf` — needed so React Router doesn't 404 on refresh:
```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    # React Router: send all routes to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 3. `backend/Dockerfile` — Node.js API

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 5000
CMD ["node", "src/index.js"]
```

### 4. `nginx/nginx.conf` — VPS Reverse Proxy

```nginx
upstream frontend {
    server frontend:80;
}

upstream backend {
    server backend:5000;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Route /api/* → backend container
    location /api/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }

    # Route everything else → frontend container
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 5. `docker-compose.yml` — Local Development

```yaml
version: '3.9'

services:
  frontend:
    build: ./frontend
    ports:
      - "3001:80"
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@db:5432/tomato
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: tomato
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - frontend
      - backend

volumes:
  postgres_data:
```

### 6. `docker-compose.prod.yml` — Production Overrides

```yaml
version: '3.9'

services:
  frontend:
    image: ${DOCKER_USERNAME}/tomato-frontend:${IMAGE_TAG:-latest}
    restart: always

  backend:
    image: ${DOCKER_USERNAME}/tomato-backend:${IMAGE_TAG:-latest}
    restart: always
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}

  db:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf
      - /etc/letsencrypt:/etc/letsencrypt:ro  # SSL certs

volumes:
  postgres_data:
```

---

## 🤖 GitHub Actions CI/CD Workflow

`.github/workflows/deploy.yml`:

```yaml
name: Tomato UI — Build & Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

env:
  DOCKER_USERNAME: ${{ secrets.DOCKER_USERNAME }}
  IMAGE_TAG: ${{ github.sha }}

jobs:
  # ─────────────────────────────────────────────
  # JOB 1: Build & push Docker images
  # Runs on: GitHub's servers (ubuntu-latest VM)
  # ─────────────────────────────────────────────
  build-and-push:
    name: Build Docker Images
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build & push frontend image
        uses: docker/build-push-action@v5
        with:
          context: ./frontend
          push: true
          tags: |
            ${{ secrets.DOCKER_USERNAME }}/tomato-frontend:latest
            ${{ secrets.DOCKER_USERNAME }}/tomato-frontend:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Build & push backend image
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          push: true
          tags: |
            ${{ secrets.DOCKER_USERNAME }}/tomato-backend:latest
            ${{ secrets.DOCKER_USERNAME }}/tomato-backend:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  # ─────────────────────────────────────────────
  # JOB 2: Deploy to VPS
  # Runs on: GitHub's servers, but SSHes into VPS
  # Docker containers actually start ON the VPS
  # ─────────────────────────────────────────────
  deploy:
    name: Deploy to VPS
    runs-on: ubuntu-latest
    needs: build-and-push   # Wait for images to be pushed first

    steps:
      - name: SSH into VPS and deploy
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            # Navigate to the project directory on the VPS
            cd /opt/tomato-app

            # Pull the latest docker-compose file from repo (optional)
            git pull origin main

            # Set the image tag to this specific commit
            export IMAGE_TAG=${{ github.sha }}
            export DOCKER_USERNAME=${{ secrets.DOCKER_USERNAME }}

            # Pull the new images from Docker Hub
            docker compose -f docker-compose.prod.yml pull

            # Restart containers with zero-downtime
            docker compose -f docker-compose.prod.yml up -d --remove-orphans

            # Clean up old unused images to save disk space
            docker image prune -f
```

---

## 🔐 GitHub Secrets Required

Go to your repo → **Settings → Secrets and variables → Actions → New repository secret**

| Secret Name | Value | Where to Get |
|---|---|---|
| `DOCKER_USERNAME` | Your Docker Hub username | hub.docker.com |
| `DOCKER_PASSWORD` | Docker Hub access token | Docker Hub → Account Settings → Security |
| `VPS_HOST` | Your VPS IP address | Your hosting provider |
| `VPS_USER` | SSH username (e.g. `ubuntu`) | Your hosting provider |
| `VPS_SSH_KEY` | Private SSH key content | Run `cat ~/.ssh/id_rsa` |

---

## 🖥️ VPS First-Time Setup

Run these commands **once** on your fresh VPS:

```bash
# 1. Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# 2. Install Docker Compose plugin
sudo apt-get install docker-compose-plugin -y

# 3. Clone your repo on the VPS
sudo mkdir -p /opt/tomato-app
cd /opt/tomato-app
git clone https://github.com/YOUR_USERNAME/tomato-ui.git .

# 4. Create .env file with production secrets
cp .env.example .env
nano .env   # Fill in your real values

# 5. Start everything for the first time
docker compose -f docker-compose.prod.yml up -d

# 6. (Optional) Set up SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
```

---

## 🔄 Full Deployment Flow (Every git push)

```
You: git push origin main
        │
        ▼
GitHub: Triggers Actions workflow
        │
        ├─ Job 1 (on GitHub VM):
        │   ├─ Checkout code
        │   ├─ docker build frontend → image
        │   ├─ docker build backend  → image
        │   └─ docker push both images → Docker Hub
        │
        └─ Job 2 (on GitHub VM, SSH to VPS):
            ├─ SSH connect to your VPS
            ├─ docker compose pull (VPS downloads new images from Docker Hub)
            ├─ docker compose up -d (VPS starts/restarts containers)
            └─ docker image prune (cleanup)
                │
                ▼
        Your VPS: New version is live ✅
```

---

## 🌐 Final Architecture on VPS

```
Internet
    │
    ▼ :80 / :443
┌──────────────────────────────────────┐
│      Nginx Reverse Proxy             │
│   yourdomain.com/     → frontend     │
│   yourdomain.com/api/ → backend      │
└───────────┬──────────────────────────┘
            │ Docker internal network
    ┌───────┴────────┐
    ▼                ▼
frontend:80      backend:5000
(Nginx SPA)      (Node/Express)
                     │
                     ▼
                  db:5432
               (PostgreSQL)
               [data volume]
```
