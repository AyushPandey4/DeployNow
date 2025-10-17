# DeployNow — Backend

This repository contains the backend API for DeployNow: a small service that
authenticates users via GitHub OAuth, stores user/project metadata in Supabase,
accepts requests to build and deploy public GitHub repos to an ECS Fargate
builder task, and stores build logs and preview URLs (S3) for each project.

This README documents the API surface, queue/worker behavior, and the exact
environment variables the service expects.

## Key components

- `src/index.js` — Express server wiring and route registration.
- `src/controllers/` — Route handlers for auth and project actions.
- `src/routes/` — Express routers (`auth.js`, `project.js`, `gitrepo.js`).
- `src/queue/ecsQueue.js`, `src/queue/ecsWorker.js` — Queue producer and worker
  that perform the asynchronous ECS deploy work (queue name: `ecs-deploy-queue`).
- `src/ecs/runTask.js` — Code that starts an ECS task (Fargate) to run the
  project build inside a container.
- `src/db/supabase.js` — Supabase client used for storing users and projects.
- `src/utils/s3.js` — Helpers to upload/construct S3 preview URLs.

## API (summary)

Note: All protected routes require `Authorization: Bearer <JWT>` header. The
JWT is issued after completing the GitHub OAuth flow handled at
`GET /auth/github/callback`.

- GET /auth/github/callback?code=<code>
  - Exchanges the GitHub code for an access token, upserts the user in
    Supabase, and returns a JWT + user info.

- GET /projects/
  - Returns projects belonging to the authenticated user.

- GET /projects/:projectId
  - Returns project metadata and associated build logs.

- POST /projects/createproject
  - Body: { repo_url: string, framework: string, envVars?: string }
  - Creates a project row and enqueues a job to build/deploy the repo.

- POST /projects/redeploy/:projectId
  - Body: { envVars?: string }
  - Re-enqueues a deploy job for an existing project (used for redeploys).

- GET /github/repos
  - Fetches repositories for the authenticated GitHub user (uses the
    access token saved during OAuth).

For full request/response shapes consult the controller files in
`src/controllers/`.

## Queue & worker behavior

- Queue name: `ecs-deploy-queue` (producer in `src/queue/ecsQueue.js`).
- Worker: `src/queue/ecsWorker.js` processes jobs with the payload:
  { projectId, repoUrl, envVars }
- Worker flow (high level): mark project building → start ECS task to run the
  build → stream/save logs → on success mark deployed and set preview URL → on
  failure mark failed and save logs.

## Environment variables

Create a `.env` file at the project root with the following variables. Values
must be provided for the service to function correctly. Do NOT commit secrets.

- SUPABASE_URL — Your Supabase project URL (example: https://xyz.supabase.co)
- SUPABASE_SERVICE_ROLE_KEY — Supabase service role key (server-side secret)
- GITHUB_CLIENT_ID — OAuth App client ID for GitHub
- GITHUB_CLIENT_SECRET — OAuth App client secret for GitHub
- JWT_SECRET — Secret used to sign JWTs returned to clients

- AWS_ACCESS_KEY — AWS IAM access key for any S3 / ECS actions
- AWS_SECRET_KEY — AWS IAM secret key
- S3_BUCKET — S3 bucket name used to store deployment previews
- AWS_PROJECT_BASE_LINK — Optional: public base URL used to construct the
  preview URL (e.g. http://<bucket>.s3-website.<region>.amazonaws.com)

- AWS_ECS_REGION — AWS region for ECS (e.g. eu-north-1)
- AWS_CLUSTER_NAME — ECS cluster name used to run the builder task
- AWS_TASK_DEFINITION — ECS task definition name for the builder container
- AWS_SUBNET — Subnet id where the Fargate task will run (if using awsvpc)
- AWS_CONTAINER_NAME — Container name inside the task to target

- REDIS_URL — Redis connection string used by the job queue (example:
  redis://default:<password>@host:port)


## Running locally (suggested)

1. Copy `.env.example` (if present) or create `.env` with the variables above.
2. Install dependencies and start the server. Check `package.json` for exact
   scripts; common commands are shown below and assume you have Node.js installed:

```cmd
npm install
npm run dev   # or: npm start
```

3. The API typically listens on a port defined in `src/index.js` (commonly
   9000). Use the returned JWT after GitHub OAuth to call protected endpoints.

## Troubleshooting & notes

- If queue jobs are not processed, ensure `REDIS_URL` is correct and the
  worker process (`src/queue/ecsWorker.js`) is running.
- ECS run errors generally surface in the worker logs; check CloudWatch or the
  saved logs persisted by the worker for diagnostics.
- Verify your ECS task definition has the required IAM permissions to access
  S3 and any other AWS resources you use.

---
