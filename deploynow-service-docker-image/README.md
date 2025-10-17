# DeployNow Service Docker Image

This directory contains the Docker image and supporting scripts for the DeployNow build and deployment service. This service is responsible for:
- Cloning a user-specified GitHub repository
- Injecting environment variables
- Building the project (if needed)
- Uploading the build output to AWS S3
- Logging build and deployment events to Supabase

## File Overview

### Dockerfile
- **Purpose:** Defines the Docker image for the build service.
- **Key Steps:**
  - Uses Ubuntu as the base image
  - Installs Node.js, curl, and git
  - Sets up the working directory `/home/app`
  - Installs Node.js dependencies from `package.json`
  - Copies in the main scripts and the `utils` directory
  - Makes `main.sh` and `script.js` executable
  - Sets the entrypoint to `main.sh`

### main.sh
- **Purpose:** Entrypoint shell script for the container.
- **What it does:**
  1. Sets a build start time environment variable
  2. Clones the repository specified by the `GIT_REPOSITORY__URL` environment variable into `/home/app/output`
  3. Executes `script.js` using Node.js

### script.js
- **Purpose:** Main Node.js script that handles the build and deployment logic.
- **What it does:**
  1. Loads environment variables and project ID
  2. Injects user-provided environment variables into the cloned repo (if any)
  3. Detects if the project is a static site or a Node.js/React app
  4. If Node.js/React, runs `npm install` and `npm run build`
  5. Uploads the build output (or static files) to AWS S3 using `utils/s3.js`
  6. Logs all steps and errors to ClickHouse using `utils/clickhouse.js`

### utils/s3.js
- **Purpose:** Utility for uploading directories/files to AWS S3.
- **What it does:**
  - Recursively walks a directory and uploads all files to the `deploynow-projects` S3 bucket under the project ID prefix
  - Sets the correct MIME type for each file
  - Returns the public S3 website URL for the deployed project



### package.json & package-lock.json
- **Purpose:** Define Node.js dependencies and lock their versions for reproducible builds.
- **Key dependencies:**
  - `@aws-sdk/client-s3`: For S3 uploads
  - `@supabase/supabase-js`: For logging to Supabase
  - `dotenv`: For loading environment variables
  - `mime-types`: For correct file uploads to S3

### .env (not included)
- **Purpose:** You may provide environment variables for AWS, ClickHouse, and user project builds. Example variables:
  - `AWS_ACCESS_KEY`, `AWS_SECRET_KEY`
  - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
  - `PROJECT_ID`, `USER_ENV_VARS`, `GIT_REPOSITORY__URL`

## Usage

1. **Build the Docker image:**
   ```sh
   docker build -t deploynow-builder .
   ```
2. **Run the container:**
   ```sh
   docker run --env-file .env deploynow-builder
   ```
   Ensure your `.env` file contains all required environment variables.

## Folder Structure

- `Dockerfile` — Docker image definition
- `main.sh` — Entrypoint shell script
- `script.js` — Main build/deploy logic
- `utils/` — Helper utilities for S3 and logging
- `package.json`, `package-lock.json` — Node.js dependencies

---

For more details, see comments in each file or contact the DeployNow team. 