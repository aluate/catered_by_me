# Catered By Me - Web App

Next.js frontend for the Catered By Me meal planning application.

## Overview

This is the web interface that allows users to:
- Paste recipe text (ingredients + directions)
- Set headcount and serve time
- Generate a cooking schedule with swim-lane visualization

The frontend communicates with the FastAPI backend running on Render.

## Configuration

The API base URL is configured via environment variable:

- **Production**: Set `NEXT_PUBLIC_API_BASE_URL` to your Render backend URL (e.g., `https://catered-by-me.onrender.com`)
- **Local Development**: Defaults to `http://localhost:8003` if the env var is not set

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

4. Make sure the backend is running locally on port 8003, or set `NEXT_PUBLIC_API_BASE_URL` to point to your Render backend.

## Build & Deploy

### Build for production:
```bash
npm run build
```

### Start production server:
```bash
npm start
```

### Deploy to Vercel

See `DEPLOY_FRONTEND_VERCEL.md` in the repo root for detailed Vercel deployment instructions.

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React 18** - UI library

## Project Structure

```
apps/web/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── page.tsx      # Main homepage
│   │   ├── layout.tsx    # Root layout
│   │   └── globals.css   # Global styles
│   ├── components/       # React components
│   │   ├── RecipeForm.tsx    # Recipe input form
│   │   └── ScheduleView.tsx  # Schedule visualization
│   └── lib/
│       └── api.ts        # API client functions
├── package.json
└── next.config.mjs
```
