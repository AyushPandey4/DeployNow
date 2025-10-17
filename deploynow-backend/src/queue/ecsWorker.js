const { Worker } = require("bullmq");
const supabase = require("../db/supabase");
const { runECSTask } = require("../ecs/runTask");
require("dotenv").config();

const worker = new Worker(
  "ecs-deploy-queue",
  async (job) => {
    const { projectId, repoUrl, envVars } = job.data;

    const { error: upsertError } = await supabase.from("deployments").upsert(
      {
        project_id: projectId,
        status: "building",
        logs: null, // Clear previous logs on redeployment
        updated_at: new Date(),
      },
      {
        onConflict: "project_id", // Ensure we update the existing record if it exists
      }
    );

    if (upsertError) {
      console.error(
        `❌ Failed to upsert deployment record for project ${projectId}:`,
        upsertError
      );
      return; // Exit early if upsert fails
    }

    try {
      const formattedEnvVars = envVars ? envVars.replace(/\r?\n/g, "\\n") : "";

      const taskArn = await runECSTask({
        id: projectId,
        repo_url: repoUrl,
        env_vars: formattedEnvVars,
      });
      console.log(`✅ ECS Task triggered for project ${projectId}:`, taskArn);
    } catch (err) {
      await supabase
        .from("deployments")
        .update({ status: "failed" })
        .eq("project_id", projectId);

      console.error(
        `❌ Failed to trigger ECS task for project ${projectId}:`,
        err.message
      );
    }
  },
  {
    connection: {
      url: process.env.REDIS_URL,
    },
  }
);
