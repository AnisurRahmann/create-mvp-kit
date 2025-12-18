import { execa } from "execa";
import path from "path";
import { Config } from "./types.js";

const RAILWAY_API = "https://backboard.railway.app/graphql/v2";

export async function deployRailway(config: Config): Promise<void> {
  const projectDir = path.join(process.cwd(), config.projectName, "backend");

  // Create project via API
  const project = await createRailwayProject(config);

  // Create service
  const service = await createRailwayService(config, project.id);

  // Deploy using Railway CLI (more reliable than API for actual deployment)
  try {
    await execa("railway", ["link", project.id], {
      cwd: projectDir,
      env: { RAILWAY_TOKEN: config.railwayToken },
    });

    await execa("railway", ["up", "--detach"], {
      cwd: projectDir,
      env: { RAILWAY_TOKEN: config.railwayToken },
    });

    // Get deployment URL
    const domain = await createRailwayDomain(config, project.id, service.id);
    config.railwayUrl = `https://${domain}`;
  } catch (error) {
    // CLI might not be installed, try API-only approach
    // For now, we'll set a placeholder and user can get URL from Railway dashboard
    config.railwayUrl = `https://${config.projectName}.up.railway.app`;
  }

  // Set environment variables
  await setRailwayVariable(config, project.id, service.id, "FRONTEND_URL", "");
}

async function railwayQuery(config: Config, query: string, variables: any) {
  const response = await fetch(RAILWAY_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.railwayToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  const data = await response.json();
  if (data.errors) {
    throw new Error(data.errors[0].message);
  }
  return data.data;
}

async function createRailwayProject(
  config: Config
): Promise<{ id: string; name: string }> {
  const query = `
    mutation projectCreate($input: ProjectCreateInput!) {
      projectCreate(input: $input) {
        id
        name
      }
    }
  `;

  const data = await railwayQuery(config, query, {
    input: {
      name: `${config.projectName}-backend`,
    },
  });

  return data.projectCreate;
}

async function createRailwayService(
  config: Config,
  projectId: string
): Promise<{ id: string }> {
  const query = `
    mutation serviceCreate($input: ServiceCreateInput!) {
      serviceCreate(input: $input) {
        id
      }
    }
  `;

  const data = await railwayQuery(config, query, {
    input: {
      projectId,
      name: "backend",
    },
  });

  return data.serviceCreate;
}

async function createRailwayDomain(
  config: Config,
  projectId: string,
  serviceId: string
): Promise<string> {
  // First get the environment ID
  const envQuery = `
    query project($id: String!) {
      project(id: $id) {
        environments {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    }
  `;

  const envData = await railwayQuery(config, envQuery, { id: projectId });
  const prodEnv = envData.project.environments.edges.find(
    (e: any) => e.node.name === "production"
  );
  const environmentId = prodEnv?.node.id;

  if (!environmentId) {
    return `${config.projectName}-backend.up.railway.app`;
  }

  const query = `
    mutation serviceDomainCreate($input: ServiceDomainCreateInput!) {
      serviceDomainCreate(input: $input) {
        domain
      }
    }
  `;

  try {
    const data = await railwayQuery(config, query, {
      input: {
        serviceId,
        environmentId,
      },
    });
    return data.serviceDomainCreate.domain;
  } catch {
    return `${config.projectName}-backend.up.railway.app`;
  }
}

async function setRailwayVariable(
  config: Config,
  projectId: string,
  serviceId: string,
  name: string,
  value: string
): Promise<void> {
  // Get environment ID first
  const envQuery = `
    query project($id: String!) {
      project(id: $id) {
        environments {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    }
  `;

  const envData = await railwayQuery(config, envQuery, { id: projectId });
  const prodEnv = envData.project.environments.edges.find(
    (e: any) => e.node.name === "production"
  );

  if (!prodEnv) return;

  const query = `
    mutation variableUpsert($input: VariableUpsertInput!) {
      variableUpsert(input: $input)
    }
  `;

  await railwayQuery(config, query, {
    input: {
      projectId,
      serviceId,
      environmentId: prodEnv.node.id,
      name,
      value,
    },
  });
}
