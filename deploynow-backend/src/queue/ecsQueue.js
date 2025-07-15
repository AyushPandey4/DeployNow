const { Queue } = require("bullmq");
require('dotenv').config();

console.log("REDIS_URL:", process.env.REDIS_URL);

const ecsQueue = new Queue("ecs-deploy-queue", {
  connection: {
    url: process.env.REDIS_URL,
  },
});

module.exports = ecsQueue;
