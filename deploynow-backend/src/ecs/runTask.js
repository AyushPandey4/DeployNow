const AWS = require("aws-sdk");
require("dotenv").config();
const ecs = new AWS.ECS({ region: "eu-north-1" });

async function runECSTask(project) {
  const { id: PROJECT_ID, repo_url: GIT_REPOSITORY__URL, env_vars } = project;

  const params = {
    cluster: "deploynow-cluster",
    launchType: "FARGATE",
    taskDefinition: "deploynow-builder-task",
    count: 1,
    platformVersion: "LATEST",
    networkConfiguration: {
      awsvpcConfiguration: {
        subnets: ["subnet-03a90115459ebdfb4"],
        assignPublicIp: "ENABLED",
      },
    },
    overrides: {
      containerOverrides: [
        {
          name: "deploynow-builder",
          environment: [
            { name: "PROJECT_ID", value: PROJECT_ID },
            { name: "GIT_REPOSITORY__URL", value: GIT_REPOSITORY__URL },
            { name: "AWS_ACCESS_KEY", value: process.env.AWS_ACCESS_KEY },
            { name: "AWS_SECRET_KEY", value: process.env.AWS_SECRET_KEY },
            { name: "CLICKHOUSE_URL", value: process.env.CLICKHOUSE_URL },
            { name: "CLICKHOUSE_USER", value: process.env.CLICKHOUSE_USER },
            {
              name: "CLICKHOUSE_PASSWORD",
              value: process.env.CLICKHOUSE_PASSWORD,
            },
            { name: "USER_ENV_VARS", value: env_vars },
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
