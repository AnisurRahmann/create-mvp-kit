import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.join(__dirname, "..", "templates");
export async function createProject(config) {
    const projectDir = path.join(process.cwd(), config.projectName);
    // Create project directory
    await fs.ensureDir(projectDir);
    // Generate backend
    await generateBackend(projectDir, config);
    // Generate frontend
    await generateFrontend(projectDir, config);
    // Generate GitHub Actions
    await generateGitHubActions(projectDir, config);
    // Generate root files
    await generateRootFiles(projectDir, config);
}
async function generateBackend(projectDir, config) {
    const backendDir = path.join(projectDir, "backend");
    await fs.ensureDir(backendDir);
    // api.py
    await fs.writeFile(path.join(backendDir, "api.py"), `from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os

app = FastAPI(title="${config.projectName} API")

# CORS - update origins after deployment
origins = [
    "http://localhost:3000",
]

# Add production frontend URL if set
if os.environ.get("FRONTEND_URL"):
    origins.append(os.environ.get("FRONTEND_URL"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "ok", "app": "${config.projectName}"}

@app.get("/health")
def health():
    return {"status": "healthy"}

# Add your endpoints below
`);
    // db.py
    await fs.writeFile(path.join(backendDir, "db.py"), `import sqlite3
from datetime import datetime
import os

DB_PATH = os.environ.get("DB_PATH", "data.db")

def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_conn()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

# Initialize on import
init_db()
`);
    // requirements.txt
    await fs.writeFile(path.join(backendDir, "requirements.txt"), `fastapi
uvicorn
python-dotenv
requests
`);
    // Procfile for Railway
    await fs.writeFile(path.join(backendDir, "Procfile"), `web: uvicorn api:app --host 0.0.0.0 --port $PORT
`);
    // .env.example
    await fs.writeFile(path.join(backendDir, ".env.example"), `FRONTEND_URL=http://localhost:3000
DB_PATH=data.db
`);
    // railway.json
    await fs.writeFile(path.join(backendDir, "railway.json"), JSON.stringify({
        $schema: "https://railway.app/railway.schema.json",
        build: { builder: "NIXPACKS" },
        deploy: {
            startCommand: "uvicorn api:app --host 0.0.0.0 --port $PORT",
            restartPolicyType: "ON_FAILURE",
        },
    }, null, 2));
    // .gitignore
    await fs.writeFile(path.join(backendDir, ".gitignore"), `__pycache__/
*.py[cod]
.env
*.db
venv/
.venv/
`);
}
async function generateFrontend(projectDir, config) {
    const frontendDir = path.join(projectDir, "frontend");
    await fs.ensureDir(path.join(frontendDir, "app"));
    // package.json
    await fs.writeFile(path.join(frontendDir, "package.json"), JSON.stringify({
        name: `${config.projectName}-frontend`,
        version: "0.1.0",
        private: true,
        scripts: {
            dev: "next dev",
            build: "next build",
            start: "next start",
            lint: "next lint",
        },
        dependencies: {
            next: "14.1.0",
            react: "^18",
            "react-dom": "^18",
        },
        devDependencies: {
            "@types/node": "^20",
            "@types/react": "^18",
            "@types/react-dom": "^18",
            autoprefixer: "^10.0.1",
            postcss: "^8",
            tailwindcss: "^3.3.0",
            typescript: "^5",
        },
    }, null, 2));
    // app/layout.tsx
    await fs.writeFile(path.join(frontendDir, "app", "layout.tsx"), `import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "${config.projectName}",
  description: "Built with create-mvpkit",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
`);
    // app/page.tsx
    await fs.writeFile(path.join(frontendDir, "app", "page.tsx"), `"use client";

import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Home() {
  const [status, setStatus] = useState<string>("checking...");

  useEffect(() => {
    fetch(\`\${API_URL}/health\`)
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus("error"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">${config.projectName}</h1>
        <p className="text-zinc-400 mb-8">Your MVP is ready to build</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-lg">
          <span className="text-zinc-500">API Status:</span>
          <span className={status === "healthy" ? "text-green-400" : "text-red-400"}>
            {status}
          </span>
        </div>
      </div>
    </main>
  );
}
`);
    // app/globals.css
    await fs.writeFile(path.join(frontendDir, "app", "globals.css"), `@tailwind base;
@tailwind components;
@tailwind utilities;
`);
    // tailwind.config.js
    await fs.writeFile(path.join(frontendDir, "tailwind.config.js"), `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
`);
    // postcss.config.js
    await fs.writeFile(path.join(frontendDir, "postcss.config.js"), `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`);
    // tsconfig.json
    await fs.writeFile(path.join(frontendDir, "tsconfig.json"), JSON.stringify({
        compilerOptions: {
            target: "es5",
            lib: ["dom", "dom.iterable", "esnext"],
            allowJs: true,
            skipLibCheck: true,
            strict: true,
            noEmit: true,
            esModuleInterop: true,
            module: "esnext",
            moduleResolution: "bundler",
            resolveJsonModule: true,
            isolatedModules: true,
            jsx: "preserve",
            incremental: true,
            plugins: [{ name: "next" }],
            paths: { "@/*": ["./*"] },
        },
        include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
        exclude: ["node_modules"],
    }, null, 2));
    // next.config.js
    await fs.writeFile(path.join(frontendDir, "next.config.js"), `/** @type {import('next').NextConfig} */
const nextConfig = {};
module.exports = nextConfig;
`);
    // .env.example
    await fs.writeFile(path.join(frontendDir, ".env.example"), `NEXT_PUBLIC_API_URL=http://localhost:8000
`);
    // .env.local for development
    await fs.writeFile(path.join(frontendDir, ".env.local"), `NEXT_PUBLIC_API_URL=http://localhost:8000
`);
    // .gitignore
    await fs.writeFile(path.join(frontendDir, ".gitignore"), `node_modules/
.next/
.env*.local
`);
}
async function generateGitHubActions(projectDir, config) {
    const workflowsDir = path.join(projectDir, ".github", "workflows");
    await fs.ensureDir(workflowsDir);
    await fs.writeFile(path.join(workflowsDir, "deploy.yml"), `name: Deploy

on:
  push:
    branches: [main, master]

jobs:
  deploy-backend:
    name: Deploy Backend to Railway
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Install Railway CLI
        run: npm install -g @railway/cli

      - name: Deploy to Railway
        run: |
          cd backend
          railway up --service ${config.projectName}-backend
        env:
          RAILWAY_TOKEN: \${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    name: Deploy Frontend to Vercel
    runs-on: ubuntu-latest
    needs: deploy-backend
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Install Vercel CLI
        run: npm install -g vercel

      - name: Pull Vercel Environment
        run: |
          cd frontend
          vercel pull --yes --token=\${{ secrets.VERCEL_TOKEN }}

      - name: Build
        run: |
          cd frontend
          vercel build --prod --token=\${{ secrets.VERCEL_TOKEN }}

      - name: Deploy
        run: |
          cd frontend
          vercel deploy --prebuilt --prod --token=\${{ secrets.VERCEL_TOKEN }}
`);
}
async function generateRootFiles(projectDir, config) {
    // Root package.json for convenience scripts
    await fs.writeFile(path.join(projectDir, "package.json"), JSON.stringify({
        name: config.projectName,
        version: "0.1.0",
        private: true,
        scripts: {
            dev: "cd frontend && npm run dev",
            "dev:api": "cd backend && uvicorn api:app --reload --port 8000",
            "install:all": "cd frontend && npm install",
            build: "cd frontend && npm run build",
        },
    }, null, 2));
    // README
    await fs.writeFile(path.join(projectDir, "README.md"), `# ${config.projectName}

Built with [create-mvpkit](https://github.com/TODO/create-mvpkit)

## Development

\`\`\`bash
# Install dependencies
npm run install:all
pip install -r backend/requirements.txt

# Start frontend (localhost:3000)
npm run dev

# Start backend (localhost:8000)
npm run dev:api
\`\`\`

## Deployment

Deploys automatically on push to main via GitHub Actions.

- **Frontend:** Vercel
- **Backend:** Railway

## Environment Variables

### Backend (Railway)
- \`FRONTEND_URL\` - Your Vercel frontend URL

### Frontend (Vercel)
- \`NEXT_PUBLIC_API_URL\` - Your Railway backend URL

### GitHub Secrets
- \`RAILWAY_TOKEN\`
- \`VERCEL_TOKEN\`
`);
    // .gitignore
    await fs.writeFile(path.join(projectDir, ".gitignore"), `node_modules/
.env
.env.local
`);
}
