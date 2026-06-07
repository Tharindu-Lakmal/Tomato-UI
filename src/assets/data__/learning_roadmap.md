# Full-Stack Deployment Learning Roadmap
### From Zero → Production (Docker + VPS + CI/CD)

> **Your Goal**: Deploy a React frontend + Node.js backend on a VPS using Docker,
> with GitHub Actions automating every deployment on `git push`.

---

## 🗺️ The Big Picture First

Before studying anything, understand what you're building toward:

```
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6 → Phase 7
Linux     SSH &     Backend   Docker    Docker    VPS &     CI/CD
Terminal  Security  (Node.js) Basics    Compose   Nginx     Pipeline
```

Each phase **depends on the previous one**. Do not skip ahead.

---

## ✅ What You Already Know (Skip These)

- React, Vite, HTML/CSS/JS ✅
- Basic Git (`git push`, `git commit`) ✅
- GitHub (repos, branches) ✅
- npm / package.json ✅

---

## Phase 1 — Linux & Terminal Basics
> ⏱️ Estimated time: 3–5 days

**Why**: Your VPS runs Linux. You will manage it entirely through the terminal. No GUI. Everything else depends on this.

### Topics to Study

| Topic | What to Learn |
|---|---|
| File system navigation | `ls`, `cd`, `pwd`, `mkdir`, `rm`, `cp`, `mv` |
| File reading/editing | `cat`, `nano`, `vim` (basics), `less` |
| Permissions | `chmod`, `chown`, `sudo` |
| Users & groups | `adduser`, `usermod`, `su` |
| Processes | `ps`, `top`, `htop`, `kill`, `systemctl` |
| Networking commands | `curl`, `wget`, `ping`, `netstat`, `ss` |
| Package manager | `apt update`, `apt install`, `apt remove` |
| Environment variables | `export VAR=value`, `.env` files, `printenv` |
| Shell scripting basics | Variables, `if`, loops, running `.sh` files |

### Practice Tasks
- [ ] Navigate the Linux file system without using a GUI
- [ ] Create a user, give it sudo access
- [ ] Write a simple shell script that prints "Hello, World!"
- [ ] Install Nginx on a local VM and start/stop it with `systemctl`

### Best Resources
- **[The Odin Project — Command Line](https://www.theodinproject.com/lessons/foundations-command-line-basics)** — Free, hands-on
- **[Linux Journey](https://linuxjourney.com/)** — Interactive, beginner-friendly
- **[Ryan's Tutorials — Linux](https://ryanstutorials.net/linuxtutorial/)** — Clean reference

---

## Phase 2 — SSH & Secure Remote Access
> ⏱️ Estimated time: 1–2 days

**Why**: You will never physically touch your VPS. You connect to it via SSH. GitHub Actions also uses SSH to deploy.

### Topics to Study

| Topic | What to Learn |
|---|---|
| What SSH is | Client-server model, encrypted connection |
| Key-based auth | `ssh-keygen`, public key, private key |
| `~/.ssh/authorized_keys` | How the server recognizes your key |
| SSH config file | `~/.ssh/config` — shortcuts for servers |
| SCP / rsync | Copying files to/from a server |
| Port forwarding | `-L` flag (useful for debugging) |

### Practice Tasks
- [ ] Generate an SSH key pair on your laptop
- [ ] Connect to a remote server (get a free VPS from Oracle Cloud Free Tier)
- [ ] Add your public key to the server — never type a password again
- [ ] Copy a file to your server with `scp`

### Best Resources
- **[SSH Academy](https://www.ssh.com/academy/ssh)** — Official, very clear
- **[DigitalOcean SSH Guide](https://www.digitalocean.com/community/tutorials/how-to-configure-ssh-key-based-authentication-on-a-linux-server)** — Step-by-step

---

## Phase 3 — Backend Development (Node.js + Express)
> ⏱️ Estimated time: 1–3 weeks (depending on experience)

**Why**: Your Tomato UI needs a backend API for orders, users, menu items, etc.

### Topics to Study

| Topic | What to Learn |
|---|---|
| Node.js basics | `require`/`import`, `process.env`, modules |
| Express.js | Routes, middleware, request/response |
| REST API design | GET, POST, PUT, DELETE — what each means |
| Environment variables | `dotenv` package, `.env` files |
| Database basics | PostgreSQL — tables, queries, relationships |
| ORM (optional) | Prisma or Sequelize — talk to DB without raw SQL |
| API security | JWT authentication, password hashing (bcrypt) |
| Error handling | Try/catch, HTTP status codes |

### Practice Tasks
- [ ] Build a simple Express API with routes: `GET /api/menu`, `POST /api/orders`
- [ ] Connect it to a local PostgreSQL database
- [ ] Add user login with JWT
- [ ] Test your API with Postman or Thunder Client

### Best Resources
- **[Node.js Official Docs](https://nodejs.org/en/docs)** — For reference
- **[Express.js Official Guide](https://expressjs.com/en/guide/routing.html)** — For routing patterns
- **[The Odin Project — NodeJS path](https://www.theodinproject.com/paths/full-stack-javascript/courses/nodejs)** — Free full course
- **[Prisma Getting Started](https://www.prisma.io/docs/getting-started)** — Best ORM for Node.js

---

## Phase 4 — Docker Basics
> ⏱️ Estimated time: 1 week

**Why**: Docker is the foundation of everything. You must understand it deeply before Docker Compose or CI/CD makes sense.

### Topics to Study

| Topic | What to Learn |
|---|---|
| What a container is | vs. a VM — lightweight, isolated process |
| What an image is | Blueprint for a container (like a class vs. object) |
| `Dockerfile` | Instructions to build an image |
| Key Dockerfile commands | `FROM`, `WORKDIR`, `COPY`, `RUN`, `CMD`, `EXPOSE` |
| Multi-stage builds | Build in one stage, serve from another (smaller image) |
| Docker CLI | `docker build`, `docker run`, `docker ps`, `docker logs`, `docker exec` |
| Volumes | Persist data outside containers (DB data) |
| Networks | How containers talk to each other |
| Docker Hub | Public registry — push/pull images |
| `.dockerignore` | Like `.gitignore` — exclude files from image |

### Practice Tasks
- [ ] Write a `Dockerfile` for your Node.js backend
- [ ] Build the image: `docker build -t my-backend .`
- [ ] Run it: `docker run -p 5000:5000 my-backend`
- [ ] Write a `Dockerfile` for your Vite frontend (multi-stage)
- [ ] Push both images to Docker Hub
- [ ] Pull them on another machine and run them

### Best Resources
- **[Docker Official Get Started](https://docs.docker.com/get-started/)** — Best first resource, official
- **[TechWorld with Nana — Docker Tutorial](https://www.youtube.com/watch?v=3c-iBn73dDE)** — Best YouTube video (3 hrs, covers everything)
- **[Play with Docker](https://labs.play-with-docker.com/)** — Free browser-based Docker playground

---

## Phase 5 — Docker Compose
> ⏱️ Estimated time: 3–5 days

**Why**: You have multiple containers (frontend, backend, database). Docker Compose runs them all together with one command.

### Topics to Study

| Topic | What to Learn |
|---|---|
| `docker-compose.yml` structure | `services`, `networks`, `volumes` |
| `depends_on` | Start order between services |
| Environment variables | `.env` file + `environment:` in compose |
| Named volumes | Persist database data across restarts |
| Port mapping | `"host_port:container_port"` |
| `docker compose up/down` | Start and stop everything |
| `docker compose logs` | See logs from all containers |
| Multiple compose files | `docker-compose.yml` + `docker-compose.prod.yml` |

### Practice Tasks
- [ ] Write a `docker-compose.yml` that runs: frontend + backend + postgres
- [ ] Run it with `docker compose up -d`
- [ ] Stop it with `docker compose down`
- [ ] Verify the frontend can call the backend API
- [ ] Verify backend can connect to postgres

### Best Resources
- **[Docker Compose Official Docs](https://docs.docker.com/compose/)** — Reference
- **[TechWorld with Nana — Docker Compose](https://www.youtube.com/watch?v=MVIcrmeV_6c)** — Clear tutorial

---

## Phase 6 — VPS Setup + Nginx Reverse Proxy
> ⏱️ Estimated time: 3–5 days

**Why**: This is where your app lives on the internet. Nginx routes traffic to the right container.

### Topics to Study

| Topic | What to Learn |
|---|---|
| VPS providers | DigitalOcean, Hetzner, AWS EC2, Linode |
| Server hardening | Disable root login, setup firewall (`ufw`) |
| Nginx as reverse proxy | Route domain → container internally |
| `proxy_pass` | Forward requests to a container port |
| `try_files` | Fix React Router 404 on page refresh |
| Domain + DNS | Point your domain's A record to VPS IP |
| SSL / HTTPS | Let's Encrypt + Certbot (free SSL) |
| Nginx config structure | `server`, `location`, `upstream` blocks |

### Practice Tasks
- [ ] Create a VPS (start with Hetzner CX11 ~$4/mo or Oracle Free Tier)
- [ ] SSH into it, install Docker and Docker Compose
- [ ] Deploy your docker-compose stack on the VPS
- [ ] Install Nginx, configure it to proxy to your containers
- [ ] Point a domain (or free subdomain) to your VPS
- [ ] Set up free HTTPS with Certbot: `certbot --nginx -d yourdomain.com`

### Best Resources
- **[DigitalOcean Nginx Reverse Proxy Tutorial](https://www.digitalocean.com/community/tutorials/how-to-configure-nginx-as-a-reverse-proxy-on-ubuntu-22-04)** — Step by step
- **[Certbot Official](https://certbot.eff.org/)** — Free SSL setup
- **[Nginx Beginner's Guide](https://nginx.org/en/docs/beginners_guide.html)** — Official

---

## Phase 7 — GitHub Actions CI/CD Pipeline
> ⏱️ Estimated time: 3–5 days

**Why**: Automate everything. Never manually SSH into your server to deploy. Every `git push` should do it automatically.

### Topics to Study

| Topic | What to Learn |
|---|---|
| What CI/CD means | Continuous Integration / Continuous Delivery |
| GitHub Actions concepts | Workflow, Job, Step, Runner, Trigger |
| `on: push` | What triggers a workflow |
| `runs-on: ubuntu-latest` | GitHub's free VM (this is where jobs run) |
| `uses:` vs `run:` | Prebuilt actions vs raw shell commands |
| Secrets | `${{ secrets.MY_SECRET }}` — store credentials safely |
| Job dependencies | `needs:` — run jobs in sequence |
| `docker/build-push-action` | Build and push Docker image from CI |
| `appleboy/ssh-action` | SSH into your VPS from CI and run commands |
| Caching | Speed up builds with `cache-from`, `cache-to` |

### Practice Tasks
- [ ] Write a workflow that runs `npm run build` on every push
- [ ] Add a job that builds a Docker image and pushes to Docker Hub
- [ ] Add secrets to your GitHub repo for Docker credentials + VPS SSH key
- [ ] Add a deploy job that SSHes into your VPS and runs `docker compose up`
- [ ] Push code → watch the GitHub Actions tab → see your app update live

### Best Resources
- **[GitHub Actions Official Docs](https://docs.github.com/en/actions)** — Best reference
- **[TechWorld with Nana — GitHub Actions CI/CD](https://www.youtube.com/watch?v=R8_veQiYBjI)** — Full tutorial
- **[GitHub Actions Marketplace](https://github.com/marketplace?type=actions)** — Find prebuilt actions

---

## 📅 Suggested Study Schedule

| Week | Phase | Goal |
|---|---|---|
| Week 1 | Phase 1 + 2 | Comfortable in Linux terminal, SSH into a remote server |
| Week 2–3 | Phase 3 | Build a basic REST API for Tomato UI |
| Week 4 | Phase 4 | Containerize your frontend and backend |
| Week 5 | Phase 5 | Run both containers + DB with Docker Compose |
| Week 6 | Phase 6 | Deploy on a real VPS, get HTTPS working |
| Week 7 | Phase 7 | Automate deployments with GitHub Actions |

---

## 🧠 Key Concepts to Always Remember

```
Container  = A running process in isolation (like a mini-server)
Image      = The blueprint/snapshot that creates a container
Dockerfile = Instructions to build an image
Compose    = Tool to run multiple containers together
Registry   = Storage for images (Docker Hub)
VPS        = A real Linux server in the cloud you rent
SSH        = Encrypted remote terminal access to a server
Nginx      = Web server that routes traffic to the right container
CI/CD      = Automated pipeline: code → build → test → deploy
Runner     = The machine that runs your CI/CD steps (GitHub's free VM)
Secret     = Encrypted variable (passwords, keys) stored in GitHub
```

---

## 🎯 Milestone Checkpoints

- **Checkpoint 1**: Can SSH into a remote Linux server and install software
- **Checkpoint 2**: Can run a Node.js API that connects to a database
- **Checkpoint 3**: Can `docker build` and `docker run` both frontend and backend
- **Checkpoint 4**: Can run all services with one `docker compose up` command
- **Checkpoint 5**: App is live on the internet with HTTPS on a real VPS
- **Checkpoint 6**: Pushing to GitHub automatically deploys the new version ✅
