const supabase = require("../db/supabase");
const { fetchLogsByProjectId } = require("../clickhouse/clickhouse");
const ecsQueue = require("../queue/ecsQueue");


async function createProject(req, res) {
  const userId = req.user.userId;
  const { repo_url, framework, envVars } = req.body;

  if (!repo_url || !framework)
    return res.status(400).json({ error: "Missing repo_url or framework" });

  try {
    const { data, error } = await supabase
      .from("projects")
      .insert([
        {
          user_id: userId,
          repo_url,
          framework,
          env_vars: envVars,
          status: "queued",
        },
      ])
      .select("id, repo_url, framework, env_vars, status, created_at")
      .single();

    if (error) {
      throw error;
    }

    await ecsQueue.add("deploy-project", {
      projectId: data.id,
      repoUrl: data.repo_url,
      envVars: data.env_vars,
    });

    return res.status(201).json({
      message: "Project created",
      project: data,
    });
  } catch (err) {
    console.error("Error creating project:", err);
    return res.status(500).json({ error: "Failed to create project" });
  }
}

async function getProjectDetails(req, res) {
  const { projectId } = req.params;
  if (!projectId) {
    return res.status(400).json({ error: "Missing projectId parameter" });
  }
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();
    const logs = await fetchLogsByProjectId(projectId);
    return res.status(200).json({ project: data, logs });
  } catch (err) {
    console.error("Error fetching logs:", err);
    return res.status(500).json({ error: "Failed to fetch logs" });
  }
}

async function getAllProjectsForUser(req, res) {
  const userId = req.user.userId;
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return res.status(200).json({ projects: data });
  } catch (err) {
    console.error("Error fetching user projects:", err);
    return res.status(500).json({ error: "Failed to fetch user projects" });
  }
}

async function redeployProject(req, res) {
  const userId = req.user.userId;
  const { projectId } = req.params;
  const { envVars } = req.body;

  if (!projectId) {
    return res.status(400).json({ error: "Missing projectId parameter" });
  }
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .eq("user_id", userId)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Project not found" });
    }

    await ecsQueue.add("redeploy-project", {
      projectId: data.id,
      repoUrl: data.repo_url,
      envVars: envVars || data.env_vars,
    });
    await supabase
      .from("projects")
      .update({ status: "queued", env_vars: envVars || data.env_vars })
      .eq("id", projectId);

    return res.status(200).json({ message: "Project redeployment queued" });
  } catch (err) {
    console.error("Error redeploying project:", err);
    return res.status(500).json({ error: "Failed to redeploy project" });
  }
}

module.exports = {
  createProject,
  getProjectDetails,
  getAllProjectsForUser,
  redeployProject,
};
