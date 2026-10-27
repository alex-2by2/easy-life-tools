# Easy Life Tools — Commit 001

Mobile-first starter for a daily-life tools platform.

## Stack
- Frontend: React + Vite
- API: Node.js + Express
- Database: MongoDB Atlas + Mongoose
- Authentication: JWT in HttpOnly cookie, bcrypt password hashes
- Future Android: frontend is a responsive web app that can later be wrapped with Capacitor

## Commit 001 scope
- Signup/login/logout and current-user endpoint
- Owner bootstrap from server environment variables
- Role-protected owner overview and user list
- User-owned tasks and notes API
- Responsive dashboard with task/note basics and calculator
- Rate limiting, Helmet, CORS allowlist, validation, and centralized errors

## Not included yet
Payment gateway, email verification, password reset delivery, push notifications, full reminder scheduling, production monitoring, and Android packaging are later commits. Do not advertise this starter as fully production-ready until deployment secrets, HTTPS, email flows, tests, backups, and monitoring are configured.

## Run locally
Requirements: Node.js 20+ and MongoDB connection string.

1. Copy `server/.env.example` to `server/.env`.
2. Set `MONGODB_URI`, a long random `JWT_SECRET`, `CLIENT_ORIGIN`, `OWNER_EMAIL`, and `OWNER_PASSWORD`.
3. From `server/`: `npm install` then `npm run dev`.
4. From `client/`: `npm install` then `npm run dev`.
5. Open the Vite URL printed in the terminal.

For phone-only development, use GitHub Codespaces or a compatible cloud IDE. Never commit `.env` or production secrets.
