const supabase  = require('../db/supabase'); 

async function fetchLogsByProjectId(projectId) {
  if (!projectId) {
    throw new Error('Project ID is required to fetch logs.');
  }

  const { data, error } = await supabase
    .from('deployments')
    .select('id, status, logs, created_at')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase error fetching logs:', error.message);
    throw new Error('Failed to fetch deployment logs from the database.');
  }

  return data;
}

module.exports = { fetchLogsByProjectId };