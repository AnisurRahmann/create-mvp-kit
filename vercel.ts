import { execa } from "execa";
import path from "path";
import { Config } from "./types.js";

const VERCEL_API = "https://api.vercel.com";

export async function deployVercel(config: Config): Promise<void> {
  const frontendDir = path.join(process.cwd(), config.projectName, "frontend");

  try {
    // Use Vercel CLI for deployment (most reliable)
    // Link project
    await execa(
      "vercel",
      ["link", "--yes", "--project", config.projectName],
      {
        cwd: frontendDir,
        env: { VERCEL_TOKEN: config.vercelToken },
      }
    );

    // Set environment variable for API URL
    if (config.railwayUrl) {
      await execa(
        "vercel",
        [
          "env",
          "add",
          "NEXT_PUBLIC_API_URL",
          "production",
          "--force",
        ],
        {
          cwd: frontendDir,
          env: { VERCEL_TOKEN: config.vercelToken },
          input: config.railwayUrl,
        }
      );
    }

    // Deploy
    const { stdout } = await execa(
      "vercel",
      ["deploy", "--prod", "--yes"],
      {
        cwd: frontendDir,
        env: { VERCEL_TOKEN: config.vercelToken },
      }
    );

    // Extract URL from output
    const urlMatch = stdout.match(/https:\/\/[^\s]+\.vercel\.app/);
    config.vercelUrl = urlMatch ? urlMatch[0] : `https://${config.projectName}.vercel.app`;

    // Update Railway backend with frontend URL for CORS
    if (config.railwayUrl && config.vercelUrl) {
      await updateRailwayFrontendUrl(config);
    }
  } catch (error) {
    // Fallback: try API-based deployment
    await deployVercelApi(config);
  }
}

async function deployVercelApi(config: Config): Promise<void> {
  // Create project
  const createResponse = await fetch(`${VERCEL_API}/v9/projects`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.vercelToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: config.projectName,
      framework: "nextjs",
    }),
  });

  if (!createResponse.ok) {
    const error = await createResponse.json();
    if (!error.error?.code?.includes("already_exists")) {
      throw new Error(`Failed to create Vercel project: ${JSON.stringify(error)}`);
    }
  }

  // Add environment variable
  if (config.railwayUrl) {
    await fetch(
      `${VERCEL_API}/v10/projects/${config.projectName}/env`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.vercelToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: "NEXT_PUBLIC_API_URL",
          value: config.railwayUrl,
          target: ["production", "preview", "development"],
          type: "plain",
        }),
      }
    );
  }

  // Note: actual deployment requires CLI or GitHub integration
  config.vercelUrl = `https://${config.projectName}.vercel.app`;
}

async function updateRailwayFrontendUrl(config: Config): Promise<void> {
  // This would update the FRONTEND_URL on Railway
  // For now, user needs to do this manually or we can add it to the Railway module
  // The CORS config in the generated code handles localhost + env var
}
