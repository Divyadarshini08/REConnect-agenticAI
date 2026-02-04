# REConnect-agenticAI

A mentorship platform connecting students with alumni for career guidance and mentoring sessions. Features both traditional booking and AI-powered agent-based interactions using n8n.

## Features

- User authentication with role-based access (students and alumni)
- Profile management for both students and alumni
- Availability management for alumni to set mentoring slots
- Booking system with request/approval workflow
- Matching algorithm to connect students with relevant alumni
- AI-powered agent system using n8n for advanced interactions
- Dashboard views for students and alumni

## Tech Stack

- **Frontend**: React 19, Vite, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JWT, bcrypt
- **AI/Agents**: n8n integration

## Prerequisites

- Node.js (v18 or higher)
- MySQL server
- n8n (for agent features)

## Setup Instructions

1. Clone the repository

2. Install dependencies:
   ```bash
   npm run install:all
   ```

3. Set up the database:
   - Create a MySQL database named `reconnect`
   - Run the schema from `database/schema.sql`
   - Update database credentials in `backend/.env` if needed

4. Configure environment variables:
   - Copy the default environment files and customize as needed
   - Ensure the JWT_SECRET is set in `backend/.env`

5. Start the application:
   ```bash
   npm run dev
   ```

## Running Individual Services

- Backend only: `cd backend && npm run dev`
- Frontend only: `cd frontend && npm run dev`

## Environment Variables

The application uses several environment variables that can be configured in the `.env` files:

- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` - Database connection settings
- `JWT_SECRET` - Secret for JWT token signing
- `PORT` - Port for the backend server
- `N8N_WEBHOOK_URL` - URL for n8n webhook integration
- `FRONTEND_URL` - Frontend server URL for CORS

## Agent Features

The platform includes an AI agent system powered by n8n. To enable agent features:

1. Ensure n8n is running on port 5678
2. Set up the appropriate workflows in n8n
3. Keep `USE_AGENTS = true` in `frontend/src/config/appConfig.js`

To disable agent features, set `USE_AGENTS = false` to use the traditional booking system.

## Project Structure

```
├── backend/           # Node.js/Express backend
│   ├── agents/        # AI agent implementations
│   ├── middleware/    # Authentication and other middleware
│   ├── metrics/       # Performance metrics
│   └── routes/        # API routes
├── database/          # Database schema
├── frontend/          # React/Vite frontend
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/     # Page components
│   │   ├── services/  # API services
│   │   └── utils/     # Utility functions
└── public/            # Public assets
```
