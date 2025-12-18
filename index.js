#!/usr/bin/env node
import { program } from "commander";
import * as p from "@clack/prompts";
import chalk from "chalk";
import { createProject } from "./generator.js";
import { setupGitHub } from "./github.js";
import { deployRailway } from "./railway.js";
import { deployVercel } from "./vercel.js";
const VERSION = "1.0.0";
async function main() {
    console.log();
    p.intro(chalk.bgCyan.black(" create-mvpkit "));
    program
        .name("create-mvpkit")
        .description("Scaffold a full-stack MVP in minutes")
        .version(VERSION)
        .argument("[project-name]", "Name of the project")
        .option("--skip-deploy", "Skip deployment, only generate code")
        .option("--skip-github", "Skip GitHub repo creation")
        .parse();
    const args = program.args;
    const opts = program.opts();
    // Gather user input
    const projectName = args[0] ||
        (await p.text({
            message: "Project name:",
            placeholder: "my-mvp",
            validate: (value) => {
                if (!value)
                    return "Project name is required";
                if (!/^[a-z0-9-]+$/.test(value))
                    return "Use lowercase letters, numbers, and hyphens only";
            },
        }));
    if (p.isCancel(projectName)) {
        p.cancel("Cancelled");
        process.exit(0);
    }
    const config = {
        projectName,
        skipDeploy: opts.skipDeploy || false,
        skipGitHub: opts.skipGithub || false,
        githubUsername: "",
        githubToken: "",
        railwayToken: "",
        vercelToken: "",
        railwayUrl: "",
        vercelUrl: "",
    };
    // Get tokens if deploying
    if (!config.skipDeploy) {
        const githubUsername = await p.text({
            message: "GitHub username:",
            placeholder: "your-username",
            validate: (value) => (!value ? "Required" : undefined),
        });
        if (p.isCancel(githubUsername)) {
            p.cancel("Cancelled");
            process.exit(0);
        }
        config.githubUsername = githubUsername;
        const githubToken = await p.password({
            message: "GitHub personal access token:",
            validate: (value) => (!value ? "Required" : undefined),
        });
        if (p.isCancel(githubToken)) {
            p.cancel("Cancelled");
            process.exit(0);
        }
        config.githubToken = githubToken;
        const railwayToken = await p.password({
            message: "Railway token (from railway.app/account/tokens):",
            validate: (value) => (!value ? "Required" : undefined),
        });
        if (p.isCancel(railwayToken)) {
            p.cancel("Cancelled");
            process.exit(0);
        }
        config.railwayToken = railwayToken;
        const vercelToken = await p.password({
            message: "Vercel token (from vercel.com/account/tokens):",
            validate: (value) => (!value ? "Required" : undefined),
        });
        if (p.isCancel(vercelToken)) {
            p.cancel("Cancelled");
            process.exit(0);
        }
        config.vercelToken = vercelToken;
    }
    // Execute steps
    const s = p.spinner();
    try {
        // Step 1: Generate project files
        s.start("Generating project files");
        await createProject(config);
        s.stop("Project files generated");
        if (!config.skipDeploy) {
            // Step 2: Create GitHub repo and push
            if (!config.skipGitHub) {
                s.start("Creating GitHub repository");
                await setupGitHub(config);
                s.stop("GitHub repository created");
            }
            // Step 3: Deploy to Railway
            s.start("Deploying backend to Railway");
            await deployRailway(config);
            s.stop(`Backend deployed to Railway`);
            // Step 4: Deploy to Vercel
            s.start("Deploying frontend to Vercel");
            await deployVercel(config);
            s.stop(`Frontend deployed to Vercel`);
        }
        // Done!
        p.outro(chalk.green("🎉 Your MVP is ready!"));
        console.log();
        console.log(chalk.bold("  Your app:"));
        if (config.vercelUrl) {
            console.log(`    Frontend: ${chalk.cyan(config.vercelUrl)}`);
        }
        if (config.railwayUrl) {
            console.log(`    Backend:  ${chalk.cyan(config.railwayUrl)}`);
        }
        if (!config.skipGitHub) {
            console.log(`    Repo:     ${chalk.cyan(`https://github.com/${config.githubUsername}/${config.projectName}`)}`);
        }
        console.log();
        console.log(chalk.bold("  Next steps:"));
        console.log(`    cd ${config.projectName}`);
        console.log(`    npm run dev        ${chalk.dim("# Start frontend")}`);
        console.log(`    npm run dev:api    ${chalk.dim("# Start backend")}`);
        console.log();
    }
    catch (error) {
        s.stop("Error");
        p.log.error(String(error));
        process.exit(1);
    }
}
main();
