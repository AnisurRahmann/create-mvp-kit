# create-mvp-kit

**Scaffold a production-ready MVP with FastAPI + Next.js + Railway + Vercel in under 2 minutes.**

Stop wasting hours on boilerplate and deployment configuration. One command gives you a fully deployed full-stack app.

---

## ✨ What You Get

```
my-app/
├── backend/                 # Python FastAPI
│   ├── api.py              # API endpoints
│   ├── db.py               # SQLite database helpers
│   ├── requirements.txt    # Python dependencies
│   ├── Procfile            # Railway deployment
│   └── railway.json        # Railway config
├── frontend/               # Next.js 14 + Tailwind CSS
│   ├── app/
│   │   ├── page.tsx        # Home page
│   │   ├── layout.tsx      # Root layout
│   │   └── globals.css     # Tailwind styles
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
├── .github/
│   └── workflows/
│       └── deploy.yml      # Auto-deploy on push
├── package.json            # Root scripts
└── README.md
```

**Plus automatic setup of:**

| Feature                       | Status        |
| ----------------------------- | ------------- |
| Private GitHub repository     | ✅ Created    |
| Backend on Railway            | ✅ Deployed   |
| Frontend on Vercel            | ✅ Deployed   |
| GitHub Actions CI/CD          | ✅ Configured |
| Environment variables         | ✅ Set        |
| CORS between frontend/backend | ✅ Configured |
| GitHub secrets for CI/CD      | ✅ Added      |

---

## 🚀 Quick Start

### Step 1: Get Your Tokens (One-time Setup)

You'll need three tokens. Takes about 2 minutes:

| Token   | Where to Get                                                                                    | Scopes Needed      |
| ------- | ----------------------------------------------------------------------------------------------- | ------------------ |
| GitHub  | [github.com/settings/tokens](https://github.com/settings/tokens) → Generate new token (classic) | `repo`, `workflow` |
| Railway | [railway.app/account/tokens](https://railway.app/account/tokens) → Create token                 | Full access        |
| Vercel  | [vercel.com/account/tokens](https://vercel.com/account/tokens) → Create token                   | Full access        |

### Step 2: Run the CLI

```bash
npx @shakil_nee/create-mvp-kit my-app
```

### Step 3: Answer the Prompts

```
? Project name: my-app
? GitHub username: your-username
? GitHub personal access token: ****
? Railway token: ****
? Vercel token: ****
```

### Step 4: Done! 🎉

```
✓ Project files generated
✓ GitHub repository created
✓ Backend deployed to Railway
✓ Frontend deployed to Vercel

🎉 Your MVP is ready!

  Frontend: https://my-app.vercel.app
  Backend:  https://my-app-production.up.railway.app
  Repo:     https://github.com/your-username/my-app
```

---

## 📦 Installation Options

### Option 1: npx (Recommended)

No installation needed. Runs directly:

```bash
npx @shakil_nee/create-mvp-kit my-app
```

### Option 2: Global Install via npm

Install once, use anywhere:

```bash
npm install -g @shakil_nee/create-mvp-kit
create-mvp-kit my-app
```

### Option 3: Global Install via yarn

```bash
yarn global add @shakil_nee/create-mvp-kit
create-mvp-kit my-app
```

### Option 4: Global Install via pnpm

```bash
pnpm add -g @shakil_nee/create-mvp-kit
create-mvp-kit my-app
```

### Option 5: Run from GitHub Directly

```bash
npx github:arshakil/create-mvp-kit my-app
```

### Option 6: Curl Install Script

```bash
curl -fsSL https://raw.githubusercontent.com/arshakil/create-mvp-kit/main/install.sh | bash
create-mvp-kit my-app
```

---

## ⚙️ CLI Options

```bash
# Full setup: generate code + create repo + deploy everything
npx @shakil_nee/create-mvp-kit my-app

# Generate code only, skip all deployments
npx @shakil_nee/create-mvp-kit my-app --skip-deploy

# Generate code + deploy, but skip GitHub repo creation
npx @shakil_nee/create-mvp-kit my-app --skip-github

# Show help
npx @shakil_nee/create-mvp-kit --help

# Show version
npx @shakil_nee/create-mvp-kit --version
```

---

## 💻 Local Development

After creating your project:

```bash
# Navigate to project
cd my-app

# Install frontend dependencies
npm run install:all

# Install backend dependencies
cd backend
pip install -r requirements.txt
cd ..

# Start frontend (http://localhost:3000)
npm run dev

# In another terminal, start backend (http://localhost:8000)
npm run dev:api
```

### Available Scripts

| Command               | Description                         |
| --------------------- | ----------------------------------- |
| `npm run dev`         | Start Next.js frontend on port 3000 |
| `npm run dev:api`     | Start FastAPI backend on port 8000  |
| `npm run install:all` | Install all frontend dependencies   |
| `npm run build`       | Build frontend for production       |

---

## 🚢 Deployment

### Automatic (Recommended)

Every push to `main` branch triggers automatic deployment via GitHub Actions:

```bash
git add .
git commit -m "Add new feature"
git push origin main
# ✅ Backend deploys to Railway
# ✅ Frontend deploys to Vercel
```

### Manual

**Deploy backend:**

```bash
cd backend
railway up
```

**Deploy frontend:**

```bash
cd frontend
vercel --prod
```

---

## 🔧 Environment Variables

### Backend (Railway)

Set these in Railway dashboard or via CLI:

| Variable       | Description                             |
| -------------- | --------------------------------------- |
| `FRONTEND_URL` | Your Vercel frontend URL (for CORS)     |
| `DB_PATH`      | Database file path (default: `data.db`) |

### Frontend (Vercel)

Set these in Vercel dashboard or via CLI:

| Variable              | Description              |
| --------------------- | ------------------------ |
| `NEXT_PUBLIC_API_URL` | Your Railway backend URL |

### GitHub Secrets (Auto-configured)

These are automatically added to your repo:

| Secret          | Description                   |
| --------------- | ----------------------------- |
| `RAILWAY_TOKEN` | For CI/CD backend deployment  |
| `VERCEL_TOKEN`  | For CI/CD frontend deployment |

---

## 📁 Project Structure Explained

```
my-app/
├── backend/
│   ├── api.py              # FastAPI app with CORS, health check
│   ├── db.py               # SQLite helpers (get_conn, init_db)
│   ├── requirements.txt    # fastapi, uvicorn, python-dotenv
│   ├── Procfile            # Railway: web process command
│   ├── railway.json        # Railway: build & deploy config
│   ├── .env.example        # Example environment variables
│   └── .gitignore          # Ignore __pycache__, .env, *.db
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx        # Home page with API health check
│   │   ├── layout.tsx      # Root layout with Inter font
│   │   └── globals.css     # Tailwind imports
│   ├── package.json        # Next.js 14, React 18, Tailwind
│   ├── tailwind.config.js  # Tailwind configuration
│   ├── postcss.config.js   # PostCSS for Tailwind
│   ├── tsconfig.json       # TypeScript config
│   ├── next.config.js      # Next.js config
│   ├── .env.example        # Example environment variables
│   ├── .env.local          # Local dev environment
│   └── .gitignore          # Ignore node_modules, .next
│
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions: deploy on push to main
│
├── package.json            # Root scripts (dev, dev:api, install:all)
├── README.md               # Project documentation
└── .gitignore              # Root ignores
```

---

## 🤔 FAQ

### Why Railway + Vercel?

- **Railway**: Best DX for backend. Git push to deploy. Generous free tier.
- **Vercel**: Best for Next.js. Zero config. Instant global CDN.

### Can I use different providers?

Yes! The generated code is standard FastAPI + Next.js. Deploy anywhere:

- Backend: Fly.io, Render, AWS, GCP, any Docker host
- Frontend: Netlify, Cloudflare Pages, AWS Amplify

### Is the GitHub repo private?

Yes, by default. You can change it to public in GitHub settings after creation.

### How much does this cost?

All services have free tiers:

- **GitHub**: Free
- **Railway**: Free tier ($5 credit/month)
- **Vercel**: Free tier (generous limits)

### Can I add authentication?

Yes! The generated code is a starting point. Add any auth:

- Backend: FastAPI-Users, Auth0, Supabase Auth
- Frontend: NextAuth.js, Clerk, Auth0

### Can I add a database?

SQLite is included by default. For production, consider:

- **Supabase**: Postgres + Auth + Storage
- **PlanetScale**: Serverless MySQL
- **Railway Postgres**: Add via Railway dashboard

---

## 🛠️ Tech Stack

| Layer      | Technology                                     |
| ---------- | ---------------------------------------------- |
| Frontend   | Next.js 14, React 18, TypeScript, Tailwind CSS |
| Backend    | Python, FastAPI, SQLite                        |
| Deployment | Railway (backend), Vercel (frontend)           |
| CI/CD      | GitHub Actions                                 |
| Repository | GitHub (private)                               |

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

**What this means:**

- ✅ Use commercially
- ✅ Modify
- ✅ Distribute
- ✅ Use privately
- ✅ No liability
- ✅ No warranty

---

## 🙏 Acknowledgments

Built with:

- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Railway](https://railway.app/) - Backend hosting
- [Vercel](https://vercel.com/) - Frontend hosting

---

## 📬 Support

- 🐛 [Report a bug](https://github.com/arshakil/create-mvp-kit/issues)
- 💡 [Request a feature](https://github.com/arshakil/create-mvp-kit/issues)
- ⭐ [Star the repo](https://github.com/arshakil/create-mvp-kit) if you find it useful!

---

**Made with ❤️ by [Shakil](https://arshakil.com)**
