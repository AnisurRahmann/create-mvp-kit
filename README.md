# create-mvpkit

Scaffold a production-ready MVP with FastAPI + Next.js + Railway + Vercel in under 2 minutes.

## What You Get

```
my-app/
├── backend/           # FastAPI
│   ├── api.py         # Endpoints
│   ├── db.py          # SQLite helpers
│   └── ...
├── frontend/          # Next.js + Tailwind
│   ├── app/
│   └── ...
└── .github/
    └── workflows/
        └── deploy.yml # Auto-deploy on push
```

Plus:
- Private GitHub repo created
- Backend deployed to Railway
- Frontend deployed to Vercel
- GitHub Actions configured
- Environment variables set
- CORS configured

## Usage

```bash
npx create-mvpkit my-app
```

## Requirements

Before running, you'll need:

1. **GitHub Personal Access Token**
   - Go to github.com/settings/tokens
   - Generate new token (classic)
   - Scopes: `repo`, `workflow`

2. **Railway Token**
   - Go to railway.app/account/tokens
   - Create token

3. **Vercel Token**
   - Go to vercel.com/account/tokens
   - Create token

## Options

```bash
# Just generate code, skip deployment
npx create-mvpkit my-app --skip-deploy

# Skip GitHub repo creation
npx create-mvpkit my-app --skip-github
```

## Local Development

After creating your project:

```bash
cd my-app

# Install frontend dependencies
npm run install:all

# Install backend dependencies
pip install -r backend/requirements.txt

# Start frontend (localhost:3000)
npm run dev

# Start backend (localhost:8000) 
npm run dev:api
```

## Deployment

Automatic on push to `main` branch.

Or deploy manually:

```bash
# Backend
cd backend
railway up

# Frontend
cd frontend
vercel --prod
```

## License

MIT
