const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");
const { uploadDirToS3 } = require("./utils/s3");
require("dotenv").config();

const { PROJECT_ID, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, USER_ENV_VARS } =
  process.env;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const LOGS_BUFFER = [];
const outDirPath = path.join(__dirname, "output");

function log(message) {
  const formattedMessage = message.trim();
  console.log(formattedMessage);
  LOGS_BUFFER.push({
    timestamp: new Date().toISOString(),
    message: formattedMessage,
  });
}

function runCommand(command) {
  return new Promise((resolve, reject) => {
    const proc = exec(command, { cwd: outDirPath });

    proc.stdout.on("data", (data) => log(data.toString()));
    proc.stderr.on("data", (data) => log(data.toString()));

    proc.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}: ${command}`));
      }
    });
  });
}

async function main() {
  let finalStatus = "deployed";
  let previewUrl = null;

  try {
    log(`Build process started for Project ID: ${PROJECT_ID}`);

    if (USER_ENV_VARS) {
      fs.writeFileSync(path.join(outDirPath, ".env"), USER_ENV_VARS, "utf8");
      log("Environment variables injected.");
    }

    const packageJsonPath = path.join(outDirPath, "package.json");
    let buildDir = outDirPath;

    if (fs.existsSync(packageJsonPath)) {
      log("JavaScript project detected. Running build steps...");
      await runCommand(`npm install`);
      await runCommand(`npm run build`);
      // Determine build output directory
      const possibleBuildDirs = ["build", "dist"];
      const foundBuildDir = possibleBuildDirs.find((dir) =>
        fs.existsSync(path.join(outDirPath, dir))
      );

      if (foundBuildDir) {
        log(`Detected build folder: '${foundBuildDir}'.`);
        buildDir = path.join(outDirPath, foundBuildDir);
      } else {
        throw new Error(
          "Build process completed, but no 'build' or 'dist' folder was found."
        );
      }
    } else {
      log("Static site detected. Skipping build steps.");
    }

    log("Uploading build output to S3...");
    previewUrl = await uploadDirToS3(buildDir, PROJECT_ID);
    log(`✅ Project deployed successfully.`);
  } catch (err) {
    finalStatus = "failed";
    log(`❌ Process failed. Reason: ${err.message}`);
    throw err;
  } finally {
    log(`Sending final status '${finalStatus}' and logs to Supabase...`);

    try {
      const { error: deployError } = await supabase.from("deployments").upsert(
        {
          project_id: PROJECT_ID,
          status: finalStatus,
          logs: LOGS_BUFFER,
        },
        { onConflict: "project_id" }
      );

      if (deployError) throw deployError; // Throw error to be caught below

      const projectUpdatePayload = { status: finalStatus };
      if (finalStatus === "deployed" && previewUrl) {
        projectUpdatePayload.preview_url = previewUrl;
      }

      const { error: projectError } = await supabase
        .from("projects")
        .update(projectUpdatePayload)
        .eq("id", PROJECT_ID);

      if (projectError) throw projectError;

      log("Update complete. Exiting.");
    } catch (error) {
      log(`❌ Supabase update failed: ${error.message}`);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
