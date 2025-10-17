# DeployNow Frontend

## Overview

Modern Next.js 13+ frontend for DeployNow, providing a streamlined interface for GitHub repository deployment automation. Features app router architecture, server components, and context-based state management.

## Project Structure

```
├── src/
│   ├── app/                    # Next.js 13+ App Router
│   │   ├── context/           # React Context Providers
│   │   │   ├── ProjectContext.js
│   │   │   └── UserContext.js
│   │   ├── dashboard/         # Dashboard Route
│   │   ├── deploy/           # Deployment Route
│   │   ├── project/          # Project Details Route
│   │   ├── globals.css       # Global Styles
│   │   ├── layout.js         # Root Layout
│   │   └── page.js          # Home Page
│   └── ...
├── public/                    # Static Assets
├── .env.local                # Local Environment Variables
├── next.config.mjs           # Next.js Configuration
├── postcss.config.mjs        # PostCSS Configuration
└── package.json              # Dependencies & Scripts
```

## Tech Stack

- **Framework:** Next.js 13+ with App Router
- **Styling:** Tailwind CSS with PostCSS
- **State Management:** React Context API
  - UserContext for authentication state
  - ProjectContext for project management
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **Development:** 
  - TypeScript configuration (jsconfig.json)
  - ESLint & Prettier

## Features

- **Modern Architecture:**
  - App Router for improved routing & layouts
  - Server & Client Components
  - Metadata API for SEO
  - Static & Dynamic Routes

- **Authentication:**
  - GitHub OAuth integration
  - Persistent sessions
  - Protected routes

- **Project Management:**
  - Dashboard view for all projects
  - Project creation workflow
  - Deployment status monitoring
  - Real-time build logs
  - Project-specific environment variables

## Getting Started

1. **Clone and Install:**
   ```bash
   git clone https://github.com/AyushPandey4/deploynow.git
   cd deploynow-frontend
   npm install
   ```

2. **Environment Setup:**
   Create `.env.local` with required variables:
   ```
   NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id
   NEXT_PUBLIC_BACKEND_URL=http://localhost:9000
   ```

3. **Development Server:**
   ```bash
   npm run dev
   ```
   Access the app at http://localhost:3000

4. **Build for Production:**
   ```bash
   npm run build
   npm start
   ```

## Routes

- `/` - Home/Landing page
- `/dashboard` - Project listing & management
- `/deploy` - New project deployment
- `/project/[id]` - Project details & logs

## State Management

- **UserContext:**
  - Authentication state
  - User profile
  - GitHub access token

- **ProjectContext:**
  - Project list
  - Active project details
  - Deployment status
  - Build logs

## Future Improvements

- Add real-time updates using WebSocket
- Implement project search & filtering
- Add deployment notifications
- Support custom deployment configurations
- Add project templates
- Enhance error handling & recovery
- Add unit & integration tests

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
