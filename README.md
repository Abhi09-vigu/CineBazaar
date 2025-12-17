# CineWave — Movie Ticket Booking (MERN)

Production-ready, full-stack movie ticket booking platform with auth, admin, shows, seat locking, atomic booking, and a modern UI.

## Tech Stack
- Frontend: React (Vite), React Router, Axios, Tailwind CSS, Framer Motion, Context API
- Backend: Node.js, Express.js, MongoDB (Mongoose), JWT, bcrypt, dotenv, CORS, Stripe (mock)

## Features
- Auth: Signup/Login, password hashing, JWT, role-based routes (USER/ADMIN)
- Movies: Admin CRUD, browse/search/filter/sort
- Theaters & Shows: Admin create theaters and shows
- Seat Booking: Visual grid, lock during checkout (TTL), atomic seat booking transaction, double-booking prevention
- Booking Flow: Select show → seats → checkout (mock payment) → confirmation
- Dashboards: User (history, cancel with rule), Admin (CRUD, simple analytics)
- UI/UX: Dark theme, accent color, responsive, smooth transitions, skeleton loaders

## Monorepo Structure
- backend: Node/Express API
- frontend: Vite React SPA

## Setup

1) Clone and install

```bash
cd "Movie Booking"/backend
npm install
cd ../frontend
npm install
```

2) Configure environment

- Copy backend/.env.example → backend/.env and fill values
- Copy frontend/.env.example → frontend/.env and adjust API base if needed

Backend `.env` keys:
- NODE_ENV, PORT
- MONGODB_URI (MongoDB Atlas — do not commit)
- JWT_SECRET, JWT_EXPIRES_IN
- CLIENT_ORIGIN (e.g., http://localhost:5173)
- STRIPE_PUBLIC_KEY, STRIPE_SECRET_KEY (mocked)
- LOCK_TTL_SECONDS (e.g., 300)

3) Run

In two terminals:

```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

Open http://localhost:5173.

## API Highlights
- Auth: POST /api/auth/signup, /api/auth/login, GET /api/auth/me
- Movies: GET /api/movies, GET /api/movies/:id, ADMIN: POST/PUT/DELETE /api/movies
- Theaters: GET /api/theaters, ADMIN: POST/PUT/DELETE /api/theaters
- Shows: GET /api/shows, GET /api/shows/:id, ADMIN: POST/PUT/DELETE /api/shows
- Booking: POST /api/bookings/lock, POST /api/bookings/book, GET /api/bookings/me, POST /api/bookings/cancel/:id
- Payment: POST /api/payments/intent (mock)

## Security & Notes
- Never commit real secrets. Use .env. Verified via dotenv.
- JWT-based auth middleware protects routes; `requireRole('ADMIN')` for admin.
- Booking uses MongoDB transactions and a TTL-based `SeatLock` collection to avoid double booking.
- CORS restricted to `CLIENT_ORIGIN`.

## Production Readiness
- Clear separation (MVC), input validation, centralized error handler
- Minimal logs in production, graceful DB connect failure
- Indexes on critical fields and TTL for locks
- Ready for containerization and CI (not included here)

## License
Internal project sample; add your preferred license if needed.
