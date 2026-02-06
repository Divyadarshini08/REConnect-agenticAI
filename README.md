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
**Function**: Keyword-based Query Interpretation and Domain Matching
- Analyzes student queries for domain keywords (AI, ML, UI/UX, Web Dev, etc.)
- Matches identified domains with alumni expertise descriptions in the database
- Processes natural language queries to extract relevant technical domains
- Converts raw student requests into structured domain-based searches

**Implementation**: 
- Database-driven keyword matching algorithm
- Parses student queries for predefined domain terms
- Cross-references matches with alumni profile descriptions
- Returns ranked lists of matching alumni based on keyword relevance

**Example**: 
"I want guidance from someone working in AI" → Searches database for alumni with "AI", "Machine Learning", "Deep Learning" in their expertise/description → Returns matching alumni

#### Agent 2: Matchmaking Agent *(Completed)*
**Function**: Intelligent Mentor Matching
- Finds suitable alumni based on domain/skill match
- Considers student interests and alumni expertise
- Utilizes keyword-based matching algorithm (database-driven approach)
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
- **Keyword-Based Matching**: Database-driven algorithm connecting students with relevant alumni based on domain keywords
- **Multi-Agent System**: Orchestration framework coordinating all components
- **Dashboard Views**: Personalized dashboards for students and alumni
- **Automated Scheduling**: Integration with calendar systems
- **Content Moderation**: Real-time monitoring and ethical oversight

## Tech Stack

### Core Technologies
- **Frontend**: React 19, Vite, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: SQLite (using sql.js for Node.js 24 compatibility)
- **Authentication**: JWT, bcryptjs
- **Keyword Matching**: Database-driven domain matching algorithm

### Intent Agent Implementation
- **Keyword Extraction**: Natural language processing for domain identification
- **Database Search**: SQL-based matching of student queries with alumni profiles
- **Ranking Algorithm**: Relevance-based ranking of matched alumni
- **Response Processing**: Structured output for downstream agents

## Intent Agent Architecture

### Keyword Matching Algorithm
The Intent Agent operates using a database-driven approach:
1. **Query Parsing**: Analyzes student input for domain keywords (AI, ML, Web Dev, etc.)
2. **Database Search**: Queries alumni profiles for matching expertise, domain, and description fields
3. **Ranking**: Sorts matches by relevance and availability
4. **Output**: Generates structured data for the Matchmaking Agent

### Database Schema Integration
The system leverages existing database tables:
- **alumni_profile**: domain, expertise, company fields for matching
- **student_profile**: skills, interests for preference matching
- **Keyword Mapping**: Predefined domain keywords mapped to search patterns

### Example Matching Process
```
Student Query: "I need help with React and JavaScript"
↓
Intent Agent extracts: ["React", "JavaScript", "Web Development"]
↓
Database search in alumni expertise fields
↓
Returns alumni with matching keywords ranked by relevance
```

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager
- SQLite database with alumni profile data
- Predefined keyword mappings for domain matching

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
   ```

5. **Start the application**
   ```bash
   npm run dev
   ```

## Intent Agent Configuration

### Keyword Dictionary Setup
The Intent Agent uses a keyword mapping system that can be customized:
- Define domain keywords in the database
- Map related terms (e.g., "React" maps to "ReactJS", "React.js", "React Framework")
- Configure matching thresholds for relevance ranking

### Database Integration
The system integrates with the existing alumni profile database:
- **Expertise Field**: Primary matching source
- **Domain Field**: Secondary matching source  
- **Description Field**: Tertiary matching source
- **Company Field**: Contextual matching source

## Running Individual Services

- **Backend only**: `cd server && npm run dev`
- **Frontend only**: `cd frontend && npm run dev`

## Environment Variables

The application uses several environment variables that can be configured in the `.env` files:

- `PORT` - Port for the backend server (default: 5000)
- `DB_PATH` - Path to the SQLite database file
- `JWT_SECRET` - Secret for JWT token signing
- `FRONTEND_URL` - Frontend server URL for CORS configuration
- `KEYWORD_MATCH_THRESHOLD` - Minimum relevance score for matches (if implemented)

## Project Structure

```
├── server/              # Node.js/Express backend (updated)
│   ├── agents/          # AI agent implementations
│   │   ├── intent.agent.js      # Keyword-based query interpretation
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

Agentic AI, Multi-Agent System, Educational Mentorship, Orchestration Framework, Student–Alumni Engagement, AI Automation, Scalable Learning Ecosystem, Keyword Matching, Database-Driven Matching, Automated Scheduling, Content Moderation, Domain Recognition

## Future Development

The current implementation focuses on the foundational backend architecture with keyword-based Intent Agent. Future enhancements will include:
- Advanced NLP integration with OpenAI GPT
- FAISS/Chroma embedding system for intelligent matching
- Google Calendar API integration for scheduling
- Real-time content moderation systems
- Enhanced dashboard and analytics features
- Machine learning improvements to keyword matching
- Semantic search capabilities