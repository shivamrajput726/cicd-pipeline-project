# CI/CD Pipeline Project (Jenkins + Docker + GitHub)

A beginner-friendly, resume-ready CI/CD project where **Jenkins (running in Docker)** pulls source code from **GitHub**, **builds a Docker image** for a sample Node.js app, and **runs the container**.

## Tech stack

- **App:** Node.js (Express)
- **CI/CD:** Jenkins Pipeline as Code (`Jenkinsfile`)
- **Containerization:** Docker
- **Local orchestration:** Docker Compose

## Architecture (text-based)

```
Developer -> GitHub Repo
                |
                v
        Jenkins (Docker container)
                |
                v
   Host Docker Engine (Docker socket mount)
                |
                v
     App Container (sample-cicd-app:latest)
                |
                v
      http://localhost:3001  (API)
```

## Repository structure

```
.
|-- app/
|   |-- package.json
|   `-- server.js
|-- jenkins/
|   `-- Dockerfile
|-- .dockerignore
|-- .gitignore
|-- Dockerfile
|-- Jenkinsfile
|-- docker-compose.yml
`-- README.md
```

## Prerequisites

- Docker Desktop (or Docker Engine) + Docker Compose
- Git
- A GitHub repository (this repo)

## Setup (Jenkins + Docker)

### 1) Start Jenkins

From the repo root:

```bash
docker compose up -d --build
```

Open Jenkins:

- http://localhost:8080

Get the initial admin password:

```bash
docker exec -it jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

Install **Suggested plugins** and create an admin user.

> Learning note: `docker-compose.yml` runs Jenkins as `root` to avoid Docker permission issues. This is fine for a demo, not a production recommendation.

### 2) Docker socket note (Windows)

This project mounts the host Docker socket into the Jenkins container so Jenkins can run `docker build` and `docker run`.

If the default socket mount does not work on Windows, set:

```powershell
setx DOCKER_SOCK //./pipe/docker_engine
```

Then open a new terminal and run Compose again.

### 3) Create a Pipeline job in Jenkins

1. Jenkins dashboard -> **New Item**
2. Name: `cicd-pipeline-project` (any name is fine)
3. Select: **Pipeline**
4. In **Pipeline** section:
   - Definition: **Pipeline script from SCM**
   - SCM: **Git**
   - Repository URL: your GitHub repo URL
   - Branch Specifier: `*/main`
   - Script Path: `Jenkinsfile`
5. **Save** -> **Build Now**

## CI/CD pipeline (explained)

The pipeline is defined in `Jenkinsfile` and has three stages:

### Stage 1: Pull code from GitHub

- Jenkins checks out the repository (SCM checkout).
- Output: Jenkins workspace contains the latest code from the `main` branch.

### Stage 2: Build Docker image

- Jenkins builds the app image using the root `Dockerfile`.
- Output: Docker image tagged as:
  - `<DOCKERHUB_REPO>:latest`
  - `<DOCKERHUB_REPO>:<BUILD_NUMBER>`

### Stage 3: Push image to Docker Hub

- Jenkins logs in to Docker Hub using Jenkins credentials.
- Pushes both tags (`latest` and `<BUILD_NUMBER>`) to your Docker Hub repo.

### Stage 4: Run container

- Removes any previous container named `sample-cicd-app`
- Runs the latest image in detached mode and maps port `3001:3001`
- Output: running container serving the app locally

## Verify the deployment

After a successful pipeline run:

- http://localhost:3001/ (JSON response)
- http://localhost:3001/health (health check)

Check running containers:

```bash
docker ps
```

## Useful commands

Stop Jenkins:

```bash
docker compose down
```

Reset Jenkins (deletes Jenkins data volume):

```bash
docker compose down -v
```

## Resume bullets (optional)

- Built a Jenkins CI/CD pipeline to automatically checkout GitHub code, build a Docker image, and deploy a containerized Node.js app.
- Containerized Jenkins using Docker Compose and enabled Docker builds inside Jenkins via Docker socket mounting.
- Implemented repeatable deployments by version-tagging Docker images with Jenkins build numbers.
