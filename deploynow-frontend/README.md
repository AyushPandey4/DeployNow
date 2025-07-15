# DeployNow Frontend

## Overview

This is the frontend for DeployNow, providing a user interface for authentication, project management, GitHub integration, and deployment status monitoring.

---

## Tech Stack

- React.js
- Axios (API requests)
- Tailwind CSS (or other styling library)
- [Add any other major libraries used]

---

## Features

- **GitHub OAuth:** Login via GitHub and connect repositories.
- **Project Dashboard:** View, create, and manage deployment projects.
- **Deployment Status:** Real-time updates on build and deployment progress.
- **Logs & Previews:** View deployment logs and preview deployed sites.
- [Add any other features]

---

## Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/AyushPandey4/deploynow.git
    cd deploynow-frontend
    ```
2. **Install dependencies:**
    ```bash
    npm install
    ```
3. **Configure environment variables:**
    - Create a `.env` file and set API endpoint, e.g.:
      ```
      NEXT_PUBLIC_GITHUB_CLIENT_ID=xxx
      NEXT_PUBLIC_BACKEND_URL=http://localhost:9000

      ```
4. **Start the development server:**
    ```bash
    npm start
    ```

---

## Usage Guide

- **Login:** Click "Login with GitHub" to authenticate.
- **Create Project:** Use the dashboard to create a new deployment project by selecting a repo and framework.
- **View Status:** Monitor deployment status and logs from the dashboard.
- **Redeploy:** Trigger redeployment for failed or updated projects.

---

## Architecture Overview

- **React SPA:** Single Page Application for user interaction.
- **API Integration:** Communicates with backend via REST API.
- **State Management:** Context API for managing user and project state.
- **Routing:** Next.js Routing for navigation.

---

## Future Improvements

- Add notifications for deployment events.
- Improve error handling and user feedback.
- Support for more frameworks and cloud providers.

---
