# Blogs App

<p align="left">
  <img src="frontend/public/vite.svg" alt="Project logo" width="60" />
</p>

Modern blog app with a React + Vite frontend and a Node.js GraphQL backend powered by Apollo Server and Prisma (PostgreSQL). Supports auth (JWT), CRUD for posts, and real-time post creation via GraphQL subscriptions.

## Tech Stack
- **Frontend**: React 19, Vite, Apollo Client, React Router, graphql-ws
- **Backend**: Node.js, Express, Apollo Server, graphql, graphql-ws, Prisma ORM
- **Database**: PostgreSQL
- **Auth**: JWT (Bearer token)

## Mono Repo Structure
- **frontend/**: React app (Vite)
- **backend/**: GraphQL API (Apollo Server + Prisma)

## Prerequisites
- Node.js 18+
- PostgreSQL database (local or hosted)

## Quick Start
1) Clone and install
```bash
# backend
npm install --prefix backend
# frontend
npm install --prefix frontend
```

2) Configure environment (backend)
Create `backend/.env` with:
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DBNAME?schema=public"
JWT_SECRET="your-strong-secret"
```

3) Setup Prisma (backend)
```bash
# generate client and apply migrations (creates tables)
npx --prefix backend prisma generate
npx --prefix backend prisma migrate dev --name init
```

4) Run the apps
```bash
# start backend (http + ws on :4000)
npm --prefix backend start
# in a separate terminal: start frontend (Vite dev server)
npm --prefix frontend run dev
```

Frontend dev URL: http://localhost:5173
GraphQL endpoint: http://localhost:4000/graphql
GraphQL subscriptions (WS): ws://localhost:4000/graphql

## Available Scripts
- **backend**: `npm start` (nodemon on `src/server.js`)
- **frontend**:
  - `npm run dev`
  - `npm run build`
  - `npm run preview`

## GraphQL Schema (high-level)
- **Queries**: `me`, `posts`, `post(id)`
- **Mutations**: `register(name,email,password)`, `login(email,password)`, `createPost(title,content)`
- **Subscriptions**: `postCreated`

Auth: send `Authorization: Bearer <token>` header (returned by `register`/`login`).

## Screenshots
<img src="frontend/public/home.png" alt="Home" />
<img src="frontend/public/create-post.png" alt="Create Post" />

## Notes
- Tokens are stored in `localStorage` on the client and attached to HTTP and WS requests.
- Prisma schema is in `backend/prisma/schema.prisma`. Update it and run `prisma migrate dev` to evolve the DB.

## Troubleshooting
- Ensure `DATABASE_URL` and `JWT_SECRET` are set before starting the backend.
- If subscriptions fail, confirm the WS URL `ws://localhost:4000/graphql` and that the token is included in `connectionParams`.
