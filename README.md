# SkillSwap - Social Networking + Skill Exchange Platform

A repository for a full-stack MERN application that implements a social network and skill exchange system using explicit Data Structures and Algorithms for core features (Recommendations, Search, Ranking, etc.).

## Prerequisites
- Node.js (v16+)
- MongoDB (running locally or Atlas URI)

## Data Structures Used
- **Directed Graph**: Modeling user relationships (Follow/Unfollow).
- **BFS (Breadth-First Search)**: Shortest path friend recommendations.
- **Trie (Prefix Tree)**: specific optimized storage for Skill Autocomplete.
- **Priority Queue (Max Heap)**: Ranking skill providers by Karma points.
- **Hash Maps / Sets**: O(1) lookups for active sessions, event participants, and caching.

## Getting Started

### 1. Setup Backend
```bash
cd backend
npm install
# Create .env file (see .env.example)
npm run seed  # Loads initial data
npm run dev   # Starts server on port 5000
```

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev   # Starts Vite server
```

## Deployment

This application is ready to be deployed to production! See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on:

- Setting up MongoDB Atlas (free cloud database)
- Deploying backend to Render
- Deploying frontend to Render
- Environment variable configuration

**Quick Start**: The application is configured to deploy to Render with a single `render.yaml` file. Just push to GitHub and connect to Render!

## Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

See `.env.example` files in both `backend/` and `frontend/` directories for templates.
