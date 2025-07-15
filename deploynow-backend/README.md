# DeployNow Backend API Documentation

## Overview

This backend powers DeployNow, handling authentication, project management, GitHub integration, deployment orchestration, and queue-based ECS deployments.

---

## API Routes

### Auth Routes

#### `GET /auth/github/callback`
- **Description:** Handles GitHub OAuth callback, exchanges code for access token, upserts user, and returns JWT.
- **Query Params:** `code` (string, required)
- **Response:** `{ token, user }`

---

### Project Routes

#### `GET /projects/`
- **Auth Required:** Yes (Bearer token)
- **Description:** Fetch all projects for the authenticated user.
- **Response:** `{ projects: [...] }`

#### `GET /projects/:projectId`
- **Auth Required:** Yes
- **Description:** Get details and logs for a specific project.
- **Params:** `projectId` (string, required)
- **Response:** `{ project, logs }`

#### `POST /projects/createproject`
- **Auth Required:** Yes
- **Description:** Create a new project and queue deployment.
- **Body:** 
  ```json
  {
    "repo_url": "string",
    "framework": "string",
    "envVars": "string (optional)"
  }
  ```
- **Response:** `{ message, project }`

#### `POST /projects/redeploy/:projectId`
- **Auth Required:** Yes
- **Description:** Redeploy an existing project (optionally with new env vars).
- **Params:** `projectId` (string, required)
- **Body:** 
  ```json
  {
    "envVars": "string (optional)"
  }
  ```
- **Response:** `{ message }`

---

### GitHub Repo Routes

#### `GET /github/repos`
- **Auth Required:** Yes
- **Description:** Fetch all GitHub repositories for the authenticated user.
- **Response:** `{ repos: [...] }`

---

## Queue Worker

### ECS Deploy Queue (`ecs-deploy-queue`)

- **Worker Location:** `src/queue/ecsWorker.js`
- **Job Data:**
  ```json
  {
    "projectId": "string",
    "repoUrl": "string",
    "envVars": "string"
  }
  ```
- **Process:**
  1. Updates project status to `building`.
  2. Triggers ECS Fargate task to build/deploy.
  3. Waits for logs, saves logs to ClickHouse.
  4. Updates project status to `deployed` and sets preview URL.
  5. On error, updates status to `failed`.

---

## Auth

- All protected routes require a JWT in the `Authorization: Bearer <token>` header.
- JWT is issued after GitHub OAuth via `/auth/github/callback`.

---

## Error Handling

- All endpoints return JSON error responses with appropriate HTTP status codes.

---

## Example Usage

```bash
# Get all projects (requires JWT)
curl -H "Authorization: Bearer <token>" http://localhost:9000/projects/

# Create a new project
curl -X POST -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  -d '{"repo_url":"https://github.com/user/repo","framework":"react"}' \
  http://localhost:9000/projects/createproject
```

---

## Notes

- ECS deployment and logs are handled asynchronously via BullMQ queue and worker.
- S3 preview URLs are generated after successful deployment.
- All environment variables must be set in `.env`.

---
