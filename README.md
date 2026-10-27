# Easy Life Tools

Cross-platform daily-life toolkit: React + Vite website/PWA, Capacitor Android/iOS wrapper, Express API, and MongoDB.

## Current features
- Email/password registration and login using bcrypt hashes and HttpOnly JWT session cookies
- Owner bootstrap from server environment variables and role-protected owner user list
- User-isolated tasks and notes
- Responsive dashboard and calculator with a parser (no JavaScript eval)
- Express security middleware, rate limiting, validation and CORS allowlist
- Capacitor config for Android and iOS, PWA manifest, and GitHub Actions build verification

## Setup
- See `MOBILE_RELEASE.md` for website/mobile build steps and release limitations.
- Copy `server/.env.example` to `server/.env`; set MongoDB URI, a strong random JWT secret, owner credentials, and exact production website origins.
- Copy `client/.env.example` to `client/.env`; set `VITE_API_URL` to your deployed HTTPS API URL ending in `/api`.
- Install and run the API from `server/` with `npm install` and `npm run dev`.
- Install and run the frontend from `client/` with `npm install` and `npm run dev`.

## Important
This repository is not yet a production release. The CI workflow builds a debug Android APK and an unsigned iOS simulator build; it does not deploy the backend, configure MongoDB, sign store releases, or publish apps. Configure and test HTTPS, cookie/session behavior, backups, monitoring, and all auth/data-isolation paths before release. Never commit `.env` or signing keys.
