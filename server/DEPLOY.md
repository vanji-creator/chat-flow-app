# Deployment Guide: Render + Supabase

This guide will walk you through hosting your backend for free using **Render** (for the Node.js server) and **Supabase** (for the PostgreSQL database).

## Prerequisites

- A GitHub account.
- A [Render](https://render.com/) account.
- A [Supabase](https://supabase.com/) account.

## Step 1: Set up Supabase (Database)

1.  Log in to your Supabase dashboard.
2.  Click **"New Project"**.
3.  Choose your organization, give your project a name (e.g., `chatflow-db`), and set a strong database password. **Save this password!**
4.  Select a region close to you (or your users).
5.  Click **"Create new project"**.
6.  Wait for the database to provision.
7.  Once ready, go to **Project Settings** (gear icon) -> **Database**.
8.  Under **Connection string**, make sure **Node.js** is selected.
9.  Copy the connection string. It will look like this:
    `postgresql://postgres.xxxx:[YOUR-PASSWORD]@aws-0-region.pooler.supabase.com:6543/postgres`
10. Replace `[YOUR-PASSWORD]` with the password you created in step 3. This is your `DATABASE_URL`.

## Step 2: Push Code to GitHub

Make sure your latest code (including the `package.json` and `tsconfig.json` changes) is pushed to a GitHub repository.

## Step 3: Deploy to Render (Server)

1.  Log in to your Render dashboard.
2.  Click **"New +"** and select **"Web Service"**.
3.  Connect your GitHub account if you haven't already.
4.  Select the repository containing your backend code.
5.  Configure the service:
    -   **Name:** `chatflow-server` (or whatever you like)
    -   **Region:** Choose the same region as your Supabase DB if possible (or close to it).
    -   **Branch:** `main` (or your working branch)
    -   **Root Directory:** `server` (Important! Since your backend is in a subdirectory)
    -   **Runtime:** `Node`
    -   **Build Command:** `npm install && npm run build`
    -   **Start Command:** `npx prisma migrate deploy && npm start`
    -   **Instance Type:** `Free`
6.  **Environment Variables:**
    -   Scroll down to the "Environment Variables" section.
    -   Add a key: `DATABASE_URL`
    -   Value: Paste the Supabase connection string from Step 1.
    -   Add any other env vars you need (e.g., `PORT` is handled by Render automatically, but your code should use `process.env.PORT || 3001`).
7.  Click **"Create Web Service"**.

## Step 4: Verify Deployment

Render will start building your app. You can watch the logs.
-   It will run `npm install`.
-   It will run `npm run build` (compiling TypeScript to `dist/`).
-   It will run `npm start` (starting `node dist/index.js`).

Once it says "Live", your backend is hosted! You will get a URL like `https://chatflow-server.onrender.com`.

## Step 5: Update Frontend (If applicable)

If you have a frontend connecting to this backend, update its API URL to point to your new Render URL.
