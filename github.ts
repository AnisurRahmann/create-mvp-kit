import { execa } from "execa";
import path from "path";
import { Config } from "./types.js";

const GITHUB_API = "https://api.github.com";

export async function setupGitHub(config: Config): Promise<void> {
  const projectDir = path.join(process.cwd(), config.projectName);

  // Create private repo via API
  const createRepoResponse = await fetch(`${GITHUB_API}/user/repos`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.githubToken}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github+json",
    },
    body: JSON.stringify({
      name: config.projectName,
      private: true,
      auto_init: false,
    }),
  });

  if (!createRepoResponse.ok) {
    const error = await createRepoResponse.json();
    if (error.errors?.[0]?.message?.includes("already exists")) {
      // Repo exists, continue
    } else {
      throw new Error(`Failed to create repo: ${JSON.stringify(error)}`);
    }
  }

  // Initialize git and push
  await execa("git", ["init"], { cwd: projectDir });
  await execa("git", ["add", "."], { cwd: projectDir });
  await execa("git", ["commit", "-m", "Initial commit from create-mvpkit"], {
    cwd: projectDir,
  });
  await execa("git", ["branch", "-M", "main"], { cwd: projectDir });

  const remoteUrl = `https://${config.githubToken}@github.com/${config.githubUsername}/${config.projectName}.git`;
  await execa("git", ["remote", "add", "origin", remoteUrl], {
    cwd: projectDir,
  });
  await execa("git", ["push", "-u", "origin", "main"], { cwd: projectDir });

  // Add secrets for GitHub Actions
  await addRepoSecret(
    config.githubUsername,
    config.projectName,
    config.githubToken,
    "RAILWAY_TOKEN",
    config.railwayToken
  );

  await addRepoSecret(
    config.githubUsername,
    config.projectName,
    config.githubToken,
    "VERCEL_TOKEN",
    config.vercelToken
  );
}

async function addRepoSecret(
  owner: string,
  repo: string,
  token: string,
  secretName: string,
  secretValue: string
): Promise<void> {
  // Get repo public key for encryption
  const keyResponse = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/actions/secrets/public-key`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
    }
  );

  if (!keyResponse.ok) {
    throw new Error("Failed to get repo public key");
  }

  const { key, key_id } = await keyResponse.json();

  // Encrypt secret using libsodium
  const encryptedValue = await encryptSecret(key, secretValue);

  // Create or update secret
  const secretResponse = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/actions/secrets/${secretName}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.github+json",
      },
      body: JSON.stringify({
        encrypted_value: encryptedValue,
        key_id: key_id,
      }),
    }
  );

  if (!secretResponse.ok) {
    throw new Error(`Failed to create secret ${secretName}`);
  }
}

async function encryptSecret(
  publicKey: string,
  secretValue: string
): Promise<string> {
  // Use tweetnacl for encryption (same as libsodium sealed box)
  const { default: sodium } = await import("tweetnacl");
  const { default: util } = await import("tweetnacl-util");

  const keyBytes = util.decodeBase64(publicKey);
  const messageBytes = util.decodeUTF8(secretValue);

  // Generate ephemeral keypair
  const ephemeralKeyPair = sodium.box.keyPair();

  // Encrypt
  const nonce = new Uint8Array(24); // zeros for sealed box
  const encrypted = sodium.box(
    messageBytes,
    nonce,
    keyBytes,
    ephemeralKeyPair.secretKey
  );

  // Combine ephemeral public key + encrypted message (sealed box format)
  const combined = new Uint8Array(
    ephemeralKeyPair.publicKey.length + encrypted.length
  );
  combined.set(ephemeralKeyPair.publicKey);
  combined.set(encrypted, ephemeralKeyPair.publicKey.length);

  return util.encodeBase64(combined);
}
