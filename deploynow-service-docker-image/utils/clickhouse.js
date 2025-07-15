const { createClient } = require("@clickhouse/client");
require("dotenv").config();

const client = createClient({
  host: process.env.CLICKHOUSE_URL,
  username: process.env.CLICKHOUSE_USER,
  password: process.env.CLICKHOUSE_PASSWORD,
  protocol: "https",
});

async function insertLogs(projectId, logs) {
  if (!logs?.length) return;

  const rows = logs.map((message) => ({
    project_id: projectId,
    message,
    timestamp: new Date().toISOString(),
  }));

  try {
    await client.insert({
      table: "deploy_logs",
      values: rows,
      format: "JSONEachRow",
    });
    console.log("Logs generated successfully and inserted into ClickHouse.");
  } catch (err) {
    console.error("Failed to insert logs into ClickHouse:", err.message);
  }
}

module.exports = {
  insertLogs,
  clickhouseClient: client,
};
