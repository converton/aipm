# ProjectPilot MVP

ProjectPilot is an AI-first project management SaaS MVP built with Next.js, Prisma, PostgreSQL, and OpenAI.

## Features
- Workspace + project dashboard
- AI project plan generation from a natural language brief
- Structured plan entities: phases, work items, milestones, dependencies, risks
- Deterministic project health engine + score
- AI-generated reports (weekly status, executive summary, customer update)
- Mock AI fallback when `OPENAI_API_KEY` is not set

## Stack
- Next.js 14 + React + TypeScript
- Tailwind CSS + lightweight shadcn-style UI primitives
- Prisma ORM + PostgreSQL
- OpenAI API

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env template and configure DB:
   ```bash
   cp .env.example .env
   ```
3. Run Prisma setup:
   ```bash
   npx prisma migrate dev --name init
   npm run prisma:seed
   ```
4. Start app:
   ```bash
   npm run dev
   ```

Open `http://localhost:3000`.

## Environment variables
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/projectpilot"
OPENAI_API_KEY=""
```

If `OPENAI_API_KEY` is empty, ProjectPilot uses deterministic mock AI generation for local MVP testing.

## Notes
- MVP scope only: no chat, gantt, timesheets, billing, or advanced permissions.
- Default seed creates one workspace, one user, and one demo project.
