const { createClient } = require("@clickhouse/client");
require("dotenv").config();

const client = createClient({
  host: process.env.CLICKHOUSE_URL,
  username: process.env.CLICKHOUSE_USER,
  password: process.env.CLICKHOUSE_PASSWORD,
  protocol: "https",
});

async function fetchLogsByProjectId(projectId) {
  try {
    const query = `
      SELECT message, timestamp
      FROM deploy_logs
      WHERE project_id = {projectId:String}
      ORDER BY timestamp ASC
    `;

    const resultSet = await client.query({
      query,
      query_params: { projectId },
      format: "JSONEachRow",
    });

    const rows = await resultSet.json();
    return rows;
  } catch (err) {
    console.error("❌ Failed to fetch logs from ClickHouse:", err.message);
    return [];
  }
}

module.exports = {
  fetchLogsByProjectId,
  clickhouseClient: client,
};
