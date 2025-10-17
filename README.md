# DeployNow

A **Vercel-like Deployment Automation Platform** enabling users to securely deploy and manage web applications via Docker containers on AWS ECS.

---

## 🚀 Overview

DeployNow is a **self-hosted deployment platform** that automates containerized deployments using AWS ECS and Docker, featuring GitHub authentication and scalable log analytics. Built for developers seeking a lightweight alternative to commercial platforms without losing scalability and flexibility.


## Demo

### 🏠 Home Page

<p align="center">
  <img src="https://raw.githubusercontent.com/AyushPandey4/DeployNow/main/assets/Home_Page.png" alt="Home Page" width="800">
</p>

### 📊 Dashboard Page

<p align="center">
  <img src="https://raw.githubusercontent.com/AyushPandey4/DeployNow/main/assets/Dashboard_Page.png" alt="Dashboard Page" width="800">
</p>

### 📜 Logs Page

<p align="center">
  <img src="https://raw.githubusercontent.com/AyushPandey4/DeployNow/main/assets/Logs_Page.png" alt="Logs Page" width="800">
</p>

### 🌐 Deployed Site

<p align="center">
  <img src="https://raw.githubusercontent.com/AyushPandey4/DeployNow/main/assets/Deployed_Page.png" alt="Deployed Site" width="800">
</p>

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Containerization & Orchestration**: Docker, AWS ECS
- **Authentication**: GitHub OAuth
- **Logs & Monitoring**: AWS CloudWatch, Supabase
- **Queue Management**: BullMQ, Redis (Upstash Redis)
- **Database**: Supabase (for metadata storage)
- **Cloud Storage**: AWS S3

---

## ✨ Features

- 🔑 Secure GitHub login for deployment authentication.
- ⚙️ Docker-based project deployments automated via AWS ECS.
- 📊 Container logs collection using CloudWatch and Supabase.
- 📥 Background job queue system powered by BullMQ and Redis.
- 📂 File upload and project assets managed via AWS S3.
- 🔒 Zero-downtime deployments with task health monitoring.

---

## 📦 Installation

```bash
# Clone repository
$ git clone https://github.com/AyushPandey4/deploynow.git
$ cd deploynow

# Install dependencies
$ npm install

# Set environment variables in .env in deploynow-backend folder
SUPABASE_URL=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx
JWT_SECRET=xxx
AWS_ACCESS_KEY=xxx
AWS_SECRET_KEY=xxx
S3_BUCKET=xxx

REDIS_URL=xxx

# Set environment variables in .env in deploynow-frontend folder
NEXT_PUBLIC_GITHUB_CLIENT_ID=xxx
NEXT_PUBLIC_BACKEND_URL=http://localhost:9000

# Start development server
$ cd deploynow-backend
$ npx nodemon

# Start Woker Queue Sever
$ cd deploynow-backend
$ node src/queue/ecsWorker.js

# Start Next.js development server
$ cd deploynow-frontend
$ npm run dev
```

> Ensure AWS ECS cluster, Supabase project, and Upstash Redis are properly set up.

---

## 🐳 Running deploynow-service-docker-image

DeployNow uses a Docker image (`deploynow-service-docker-image`) to build and deploy user projects inside AWS ECS. You can build and run this image locally for testing or development.

### Build the Docker Image

```bash
# Navigate to the service directory (replace with actual path if needed)
cd deploynow-service-docker-image

# Build the Docker image
docker build -t deploynow-service-docker-image .
```

### Run the Docker Image Locally

```bash
docker run --rm \
  -e PROJECT_ID=your_project_id \
  -e GIT_REPOSITORY__URL=https://github.com/your/repo.git \
  -e AWS_ACCESS_KEY=xxx \
  -e AWS_SECRET_KEY=xxx \
  -e SUPABASE_URL=xxx \
  -e SUPABASE_SERVICE_ROLE_KEY=xxx \
  -e USER_ENV_VARS="KEY=value" \
  deploynow-service-docker-image
```

**Environment Variables:**

- `PROJECT_ID`: Unique project identifier.
- `GIT_REPOSITORY__URL`: Git repository to clone and build.
- `AWS_ACCESS_KEY` / `AWS_SECRET_KEY`: AWS credentials for S3 upload.
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`: For log storage.
- `USER_ENV_VARS`: Custom environment variables for the build.

> The same image and environment variables are used by AWS ECS for automated deployments.

---

## 🛠️ Usage

1. Login via GitHub OAuth.
2. Upload Dockerized project.
3. Backend API triggers automated ECS task with uploaded image.
4. Logs collected via CloudWatch and stored in ClickHouse.
5. Deployment status accessible via backend APIs.

---

## 📐 Architecture Overview

- **Frontend (optional)**: React or similar framework to interact with backend APIs.
- **Backend**: REST APIs handle user authentication, deployment triggers, and logs.
- **ECS Cluster**: Runs container tasks per deployment.
- **CloudWatch + Supabase**: Stores and serves container logs.
- **BullMQ Queue**: Processes deployments asynchronously.

---

## 🗄️ Database Schemas

### Supabase Table: `users`

```sql
create table users (
  id uuid primary key default gen_random_uuid(),
  github_id text not null unique,
  username text,
  email text,
  access_token text,
  created_at timestamp default now()
);
```

### Supabase Table: `projects`

```sql
create table projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  repo_url text not null,
  framework text,
  env_vars jsonb default '{}',
  status text default 'queued',
  created_at timestamp default now()
);
```

### Supabase Table: `deployments`

```sql
CREATE TABLE deployments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'queued',
  logs JSONB, -- This column will store the entire log file as JSON
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 📊 Future Improvements

- Custom domain support with SSL provisioning.
- Frontend dashboard with real-time WebSocket log streaming.
- Cost monitoring and analytics dashboard.
- Multi-cloud provider support (Azure, GCP).
- NGINX reverse proxy for subdomain routing.
- GitHub auto-deployment on commit.

---

## 🤝 Contributing

Contributions welcome! Open an issue or submit a pull request.

---

## 📄 License

MIT License
