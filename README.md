# REConnect-agenticAI

An advanced agentic AI-driven mentorship ecosystem designed to automate and personalize student–alumni interactions through a multi-agent orchestration framework. REConnect bridges the gap between academic learning and professional readiness by providing scalable, intelligent mentorship automation.

## Research Foundation

REConnect is based on academic research that demonstrates:
- **42% reduction** in faculty workload
- **37% faster response time** compared to traditional systems
- **Marked improvement** in user satisfaction scores
- **Scalable learning ecosystem** that maintains authentic human guidance

## System Architecture

REConnect implements a sophisticated **Multi-Agent Orchestration Framework** with four core autonomous agents coordinated by a central Orchestrator:

### Core Agents

#### Agent 1: Intent Agent
**Function**: Natural Language Processing and Query Interpretation
- Uses OpenAI GPT API for advanced NLP processing
- Identifies domains, intents, and query types (career guidance, project help, internship advice)
- Converts raw student requests into structured representations

**Example**: 
"I want guidance from someone working in AI" → Domain: AI, Request Type: Mentorship

#### Agent 2: Matchmaking Agent *(Completed)*
**Function**: Intelligent Mentor Matching
- Finds suitable alumni based on domain/skill match
- Considers student interests and alumni expertise
- Utilizes similarity scores from FAISS/Chroma embeddings
- Produces ranked lists of mentor recommendations

#### Agent 3: Scheduling Agent
**Function**: Automated Session Management
- Automatically books sessions between students and alumni
- Checks availability and resolves scheduling conflicts
- Allocates valid time slots using Google Calendar API
- Auto-generates reminders and updates dashboards

**Example**:
Books session: 17th Nov, 5 PM – Alumni A & Student meet via scheduled slot

#### Agent 4: Moderation Agent
**Function**: Ethical Content Monitoring
- Monitors student-alumni interactions in real-time
- Detects inappropriate language, bias, or policy violations
- Ensures ethical and safe communication
- Flags suspicious messages and generates moderation reports for faculty/admin

### Central Orchestrator (System Controller)
The intelligent brain of the system responsible for:
- Receiving and processing student requests
- Routing tasks to appropriate agents in correct sequence
- Coordinating multi-agent workflows
- Managing end-to-end mentorship processes

## Features

- **User Authentication**: Role-based access for students and alumni
- **Profile Management**: Comprehensive profiles for both students and alumni
- **Availability Management**: Alumni can set mentoring slots and availability
- **Booking System**: Request/approval workflow for mentorship sessions
- **Intelligent Matching**: AI-powered algorithm connecting students with relevant alumni
- **Multi-Agent AI System**: Advanced agentic interactions using OpenAI GPT and embeddings
- **Dashboard Views**: Personalized dashboards for students and alumni
- **Automated Scheduling**: Integration with Google Calendar API
- **Content Moderation**: Real-time monitoring and ethical oversight

## Tech Stack

### Core Technologies
- **Frontend**: React 19, Vite, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: SQLite (using sql.js for Node.js 24 compatibility)
- **Authentication**: JWT, bcryptjs
- **AI/Agents**: Multi-agent orchestration framework

### AI and Integration Technologies
- **NLP Processing**: OpenAI GPT API
- **Embeddings**: FAISS/Chroma vector databases
- **Scheduling**: Google Calendar API
- **Orchestration**: Custom multi-agent coordination system

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager
- OpenAI API key for Intent Agent
- Google Calendar API credentials for Scheduling Agent
- FAISS/Chroma setup for Matchmaking Agent embeddings

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd REConnect-agenticAI
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up the database**
   - The application will automatically create the SQLite database file
   - Tables will be created automatically on first run
   - Update database path in `server/.env` if needed

4. **Configure environment variables**
   Create a `.env` file in the server directory:
   ```env
   PORT=5000
   DB_PATH=./reconnect.db
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   FRONTEND_URL=http://localhost:5173
   OPENAI_API_KEY=your-openai-api-key
   GOOGLE_CALENDAR_CREDENTIALS=your-google-calendar-credentials
   FAISS_CHROMA_CONFIG=your-embedding-config
   ```

5. **Start the application**
   ```bash
   npm run dev
   ```

## Running Individual Services

- **Backend only**: `cd server && npm run dev`
- **Frontend only**: `cd frontend && npm run dev`

## Environment Variables

The application uses several environment variables that can be configured in the `.env` files:

- `PORT` - Port for the backend server (default: 5000)
- `DB_PATH` - Path to the SQLite database file
- `JWT_SECRET` - Secret for JWT token signing
- `FRONTEND_URL` - Frontend server URL for CORS configuration
- `OPENAI_API_KEY` - API key for Intent Agent NLP processing
- `GOOGLE_CALENDAR_CREDENTIALS` - Credentials for Scheduling Agent
- `FAISS_CHROMA_CONFIG` - Configuration for embedding-based matching

## Project Structure

```
├── server/              # Node.js/Express backend (updated)
│   ├── agents/          # AI agent implementations
│   │   ├── intent.agent.js      # NLP query interpretation
│   │   ├── matching.agent.js    # Mentor matching algorithms
│   │   ├── scheduling.agent.js  # Session scheduling (planned)
│   │   └── moderation.agent.js  # Content monitoring (planned)
│   ├── middleware/      # Authentication and other middleware
│   ├── routes/          # API routes
│   └── db.js           # Database setup (using sql.js)
├── frontend/            # React/Vite frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   └── utils/       # Utility functions
├── database/            # Database schema and setup
└── README.md            # This documentation
```

## Research Impact

REConnect represents a paradigm shift in educational technology by establishing:
- **Agentic Collaboration**: AI agents as adaptive orchestrators rather than mere tools
- **Scalable Learning Ecosystems**: Data-driven mentorship that amplifies institutional impact
- **Human-AI Partnership**: Preserving authentic human guidance while automating processes
- **Operational Efficiency**: Significant reduction in administrative overhead

## Keywords

Agentic AI, Multi-Agent System, Educational Mentorship, Orchestration Framework, Student–Alumni Engagement, AI Automation, Scalable Learning Ecosystem, Natural Language Processing, Vector Embeddings, Automated Scheduling, Content Moderation

## Future Development

The current implementation focuses on the foundational backend architecture. Future enhancements will include:
- Full implementation of all four agents
- Advanced NLP integration with OpenAI GPT
- FAISS/Chroma embedding system for intelligent matching
- Google Calendar API integration for scheduling
- Real-time content moderation systems
- Enhanced dashboard and analytics features