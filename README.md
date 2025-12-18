# create-mvp-kit

[![npm version](https://img.shields.io/npm/v/create-mvp-kit.svg)](https://www.npmjs.com/package/create-mvp-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Scaffold a production-ready MVP with FastAPI + Next.js + Railway + Vercel in under 2 minutes.

## Installation

### Using npx (recommended)

```bash
npx create-mvp-kit my-app
```

### Using npm global install

```bash
npm install -g create-mvp-kit
create-mvp-kit my-app
```

### Using curl

```bash
curl -fsSL https://raw.githubusercontent.com/YOUR_USERNAME/create-mvp-kit/main/install.sh | bash
create-mvp-kit my-app
```

### Using GitHub directly

```bash
npx github:YOUR_USERNAME/create-mvp-kit my-app
```

## What You Get

```
my-app/
├── backend/           # FastAPI
│   ├── api.py
│   ├── db.py
│   └── requirements.txt
├── frontend/          # Next.js + Tailwind
│   ├── app/
│   └── package.json
└── .github/
    └── workflows/
        └── deploy.yml # Auto-deploy on push
```

Plus:

- ✅ Private GitHub repo created
- ✅ Backend deployed to Railway
- ✅ Frontend deployed to Vercel
- ✅ GitHub Actions CI/CD configured
- ✅ Environment variables set
- ✅ CORS configured

## Requirements

Before running, you'll need:

1. **GitHub Personal Access Token** - [Create here](https://github.com/settings/tokens)

   - Scopes: `repo`, `workflow`

2. **Railway Token** - [Create here](https://railway.app/account/tokens)

3. **Vercel Token** - [Create here](https://vercel.com/account/tokens)

## Options

```bash
# Just generate code, skip deployment
npx create-mvp-kit my-app --skip-deploy

# Skip GitHub repo creation
npx create-mvp-kit my-app --skip-github
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

Automatic on every push to `main` branch.

## License

MIT

```

---

## Part 5: Add LICENSE File

Create `LICENSE` in your repo:
```

MIT License

Copyright (c) 2024 Shakil

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
