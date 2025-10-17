const AWS = require("aws-sdk");
require("dotenv").config();
const ecs = new AWS.ECS({ region: process.env.AWS_ECS_REGION });

async function runECSTask(project) {
  const { id: PROJECT_ID, repo_url: GIT_REPOSITORY__URL, env_vars } = project;

  const params = {
    cluster: process.env.AWS_CLUSTER_NAME,
    launchType: "FARGATE",
    taskDefinition: process.env.AWS_TASK_DEFINITION,
    count: 1,
    platformVersion: "LATEST",
    networkConfiguration: {
      awsvpcConfiguration: {
        subnets: [process.env.AWS_SUBNET],
        assignPublicIp: "ENABLED",
      },
    },
    overrides: {
      containerOverrides: [
        {
          name: process.env.AWS_CONTAINER_NAME,
          environment: [
            { name: "PROJECT_ID", value: PROJECT_ID },
            { name: "GIT_REPOSITORY__URL", value: GIT_REPOSITORY__URL },
            { name: "USER_ENV_VARS", value: env_vars },
            { name: "AWS_ACCESS_KEY_ID", value: process.env.AWS_ACCESS_KEY },
            { name: "AWS_SECRET_ACCESS_KEY", value: process.env.AWS_SECRET_KEY },
            { name: "SUPABASE_URL", value: process.env.SUPABASE_URL },
            {
              name: "SUPABASE_SERVICE_ROLE_KEY",
              value: process.env.SUPABASE_SERVICE_ROLE_KEY,
            },
          ],
        },
      ],
    },
  };

  try {
    const response = await ecs.runTask(params).promise();
    const taskArn = response.tasks[0]?.taskArn;
    console.log("🚀 ECS Task started:", taskArn);
    return taskArn;
  } catch (err) {
    console.error("❌ Failed to start ECS task:", err.message);
    throw err;
  }
}

module.exports = { runECSTask };
