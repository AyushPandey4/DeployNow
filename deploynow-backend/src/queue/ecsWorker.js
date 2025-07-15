const { Worker } = require("bullmq");
const supabase = require("../db/supabase");
const { runECSTask } = require("../ecs/runTask");
const { fetchLogsByProjectId } = require("../clickhouse/clickhouse");
require("dotenv").config();

const worker = new Worker(
  "ecs-deploy-queue",
  async (job) => {
    const { projectId, repoUrl, envVars } = job.data;

    await supabase
      .from("projects")
      .update({ status: "building" })
      .eq("id", projectId);

    try {
      const formattedEnvVars = envVars
        ? envVars.replace(/\r?\n/g, "\\n")
        : "";

      const taskArn = await runECSTask({
        id: projectId,
        repo_url: repoUrl,
        env_vars: formattedEnvVars,
      });
      console.log("✅ ECS Task triggered:", taskArn);

      await new Promise((r) => setTimeout(r, 10000)); // flush logs

      console.log("✅ Logs saved to ClickHouse");

      const s3Url = `https://deploynow-projects.s3.eu-north-1.amazonaws.com/${projectId}/index.html`;

      await supabase
        .from("projects")
        .update({
          status: "deployed",
          preview_url: s3Url,
        })
        .eq("id", projectId);

      console.log(`🌐 S3 Preview URL saved: ${s3Url}`);
    } catch (err) {
      await supabase
        .from("projects")
        .update({ status: "failed" })
        .eq("id", projectId);

      console.error("❌ Deployment failed:", err.message);
    }
  },
  {
    connection: {
      url: process.env.REDIS_URL,
    },
  }
);
