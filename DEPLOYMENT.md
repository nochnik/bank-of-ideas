# Deployment

The frontend is deployed to Vercel. The Spring Boot API, PostgreSQL, and a persistent upload volume are deployed to Railway. GitHub is the source for both services, so every push triggers an update.

## 1. GitHub

Create a private repository and push this folder. Do not commit `.env` or real passwords.

## 2. Railway backend

1. Create a Railway project from the GitHub repository.
2. Set the service root directory to `/backend`. Railway uses `backend/Dockerfile` and `backend/railway.toml`.
3. Add PostgreSQL to the same project.
4. Add a volume to the backend service and mount it at `/data`.
5. Generate a public domain for the backend service.
6. Add these backend variables:

```env
JDBC_DATABASE_URL=jdbc:postgresql://${{Postgres.PGHOST}}:${{Postgres.PGPORT}}/${{Postgres.PGDATABASE}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
JWT_SECRET=<random string of at least 32 characters>
ADMIN_USERNAME=admin
ADMIN_PASSWORD=<strong password>
CORS_ALLOWED_ORIGIN_PATTERNS=https://*.vercel.app
STORAGE_PATH=/data/uploads
PUBLIC_API_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}
BOOTSTRAP_USERS_JSON=[{"username":"client-demo","password":"<strong password>","fullName":"Demo Client","position":"Participant"}]
```

`BOOTSTRAP_USERS_JSON` is optional and accepts multiple participants. Existing usernames are skipped on restart. New participants can also be created later from the admin panel.

Check `https://<railway-domain>/actuator/health`; it must return `{"status":"UP"}`.

## 3. Vercel frontend

1. Import the same GitHub repository in Vercel.
2. Set Root Directory to `frontend`.
3. Keep Framework Preset `Vite`, Build Command `npm run build`, and Output Directory `dist`.
4. Add this environment variable for Production, Preview, and Development:

```env
VITE_API_URL=https://<railway-domain>/api
```

5. Deploy. Add the final custom domain to `CORS_ALLOWED_ORIGIN_PATTERNS` if one is connected.

## Updates

Commit and push changes to GitHub. Vercel and Railway redeploy automatically from the connected branch. Database records and uploaded files survive redeploys because PostgreSQL and the Railway volume are persistent.