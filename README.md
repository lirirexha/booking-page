# Booking System

A full-stack booking system built with **Next.js App Router**, **GraphQL**, **Prisma**, and **PostgreSQL**.  

---

## Features

### Public booking flow
- List available services
- View available time slots
- Create bookings

### Admin view
- View all bookings
- Cancel existing bookings

---

## Tech Stack

### Frontend
- Next.js (App Router)
- React
- Apollo Client
- CSS Modules

### Backend
- GraphQL (graphql-yoga)
- Prisma ORM
- PostgreSQL
- Docker (local development)

---

## Getting Started (Local)

### 1. Install dependencies
```bash
yarn install
```


### 2. Start PostgreSQL
```bash
docker compose up -d
```

### 3. Set environment variables
Create a `.env.local` file inside `apps/web`:
```bash
# Database
DATABASE_URL="postgresql://booking:booking@localhost:5432/booking?schema=public"

# Admin (demo-only)
ADMIN_USER=admin
ADMIN_PASS=48d63db34fa0

# Client-side (demo-only)
NEXT_PUBLIC_ADMIN_USER=admin
NEXT_PUBLIC_ADMIN_PASS=48d63db34fa0
```

### 4. Run Prisma (from `apps/web`)
```bash
npx prisma migrate dev
npx prisma db seed
```

### 5. Start the application
```bash
yarn dev
```

________________________

# Local URLs

### Booking UI
- http://localhost:3000/book
- http://localhost:3000/admin/bookings

### GraphQL API
- http://localhost:3000/api/graphql

### Database (Prisma Studio)
```bash
npx prisma studio
```
- http://localhost:5555/

_______

## Authentication Note

> This project does **not** implement a real auth system

A real authentication system is yet to be worked on

