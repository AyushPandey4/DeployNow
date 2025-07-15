const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const { uploadDirToS3 } = require("./utils/s3");
const { insertLogs } = require("./utils/clickhouse");
require("dotenv").config();

const PROJECT_ID = process.env.PROJECT_ID;
const outDirPath = path.join(__dirname, "output");

async function log(message) {
  console.log(message);
  await insertLogs(PROJECT_ID, [message]);
}

const envContent = process.env.USER_ENV_VARS;
if (envContent) {
  const envPath = path.join(outDirPath, ".env");
  fs.writeFileSync(envPath, envContent, "utf8");
  console.log("Environment variables injected successfully.");
} else {
  console.log("No environment variables found to inject.");
}

async function runCommand(command) {
  return new Promise((resolve, reject) => {
    const proc = exec(command);
    proc.stdout.on("data", (data) => log(data.toString()));
    proc.stderr.on("data", (data) => log(data.toString()));
    proc.on("close", (code) => {
      code === 0
        ? resolve()
        : reject(new Error(`Command failed: ${command}`));
    });
  });
}

async function main() {
  await log(`Starting build process for Project ID: ${PROJECT_ID}`);

  let buildDir = null;
  const packageJsonPath = path.join(outDirPath, "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    await log("Static site detected. Skipping installation and build steps.");
    buildDir = outDirPath;
  } else {
    await log("React or JavaScript project detected. Running installation and build steps...");

    await runCommand(`cd ${outDirPath} && npm install`);
    await runCommand(`cd ${outDirPath} && npm run build`);

    const buildPath = path.join(outDirPath, "build");
    if (!fs.existsSync(buildPath)) {
      throw new Error("React build folder not found after build process.");
    }

    buildDir = buildPath;
  }

  await log("Uploading build output to storage...");
  const previewUrl = await uploadDirToS3(buildDir, PROJECT_ID);
  await log(`Project deployed successfully. Preview available at: ${previewUrl}`);
}

main().catch(async (err) => {
  await log(`Process failed. Reason: ${err.message}`);
  process.exit(1);
});
