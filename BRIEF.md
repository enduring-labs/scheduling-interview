# Maintenance Scheduling

You're working on a property maintenance platform. The database already has **work orders** (tenant-reported maintenance issues) and **technicians** who service them.

Right now there's no way to schedule appointments. Tenants and technicians coordinate over the phone, and the dispatcher (an internal employee) tracks everything in their head.

## Your task

Build a scheduling feature. Here's what we need:

**Tenant experience** — A tenant needs a way to tell us when they're available for a technician visit. They should be able to see their upcoming work order and communicate their availability for the coming week. Once an appointment is booked, they should see when it is.

**Dispatcher experience** — An internal dispatcher manages scheduling for all technicians. They need to see each tech's day at a glance, see where tenant availability lines up, and book appointments. They also need to know which work orders still need scheduling.

**Technician experience** — A tech needs to see their schedule for the day — what jobs they have, when, and where.

## What's already here

- Next.js 15 (App Router) + TypeScript + Tailwind v4
- Drizzle ORM + Postgres
- `workOrders` and `technicians` tables with seed data
- A homepage listing work orders

## Setup

```bash
cp .env.example .env
# Edit .env with your database connection string
pnpm install
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm dev
```

## Notes

- You can use any UI libraries you want
- You're free to modify the existing schema however you see fit
- Don't worry about authentication — you can use URL params or separate routes to distinguish users
- Focus on getting the core flow working end to end over polishing any single piece
