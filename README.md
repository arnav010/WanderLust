# Wanderlust hotel listing app

Express/EJS hotel-listing application using MongoDB Atlas and Cloudinary.

## Run locally

1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env`, then fill in every required value. Do not commit `.env`.
4. Run `npm start`, then visit `http://localhost:8080`.

### Required accounts and variables

| Service | Why it is needed | Environment variables |
| --- | --- | --- |
| MongoDB Atlas | application data and login sessions | `ATLASDB_URL` |
| Cloudinary | listing image uploads | `CLOUD_NAME`, `CLOUD_API_KEY`, `CLOUD_API_SECRET` |
| Your deployment host | runs the Express server | `NODE_ENV=production`, plus all values above |

Create a MongoDB Atlas database user, allow your deployment host in Atlas Network Access, and replace the placeholders in `ATLASDB_URL`. If the password contains special characters, URL-encode it in the connection string.

## Optional sample data

The sample-data command deletes **all** listings in the configured database. For a brand-new database only, set `SEED_ADMIN_PASSWORD` and `CONFIRM_SEED=true` in `.env`, then run `npm run seed`. Sign in with `SEED_ADMIN_USERNAME` and that password to manage the imported listings.

## Deploy

This app is ready for any Node.js host that runs `npm start` (for example, Render, Railway, or Fly.io). Configure:

- Build command: `npm install`
- Start command: `npm start`
- Environment: `NODE_ENV=production`
- Environment variables: every non-empty entry from `.env` except the seed-only values.

Use MongoDB Atlas rather than a local MongoDB URL in production. After deployment, add the host's outbound IP/network rule in Atlas if your Atlas configuration requires it, and test sign-up, login, and new listing uploads before sharing the site.
