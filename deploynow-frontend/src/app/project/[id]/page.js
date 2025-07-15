"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useProject } from "../../context/ProjectContext";
import { Loader2, ExternalLink, RefreshCw } from "lucide-react";
import { useUser } from "../../context/UserContext";

// Framework badge/icon helper
const frameworkBadge = (fw) => {
  const color =
    fw === "React"
      ? "#61dafb"
      : fw === "Static"
      ? "#8BA9FF"
      : "#5D5FEF";
  const icon =
    fw === "React" ? (
      <svg
        width="18"
        height="18"
        viewBox="0 0 32 32"
        fill="none"
        className="mr-1"
      >
        <circle cx="16" cy="16" r="2.5" fill="#61dafb" />
        <g stroke="#61dafb" strokeWidth="2">
          <ellipse
            rx="12"
            ry="5"
            cx="16"
            cy="16"
            transform="rotate(60 16 16)"
          />
          <ellipse
            rx="12"
            ry="5"
            cx="16"
            cy="16"
            transform="rotate(120 16 16)"
          />
          <ellipse rx="12" ry="5" cx="16" cy="16" />
        </g>
      </svg>
    ) : null;
  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full font-semibold text-xs"
      style={{ background: color + "22", color }}
    >
      {icon}
      {fw || "N/A"}
    </span>
  );
};

// Status badge helper
const statusBadge = (status) => {
  if (status === "deployed")
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-600/10 text-green-400 font-semibold text-xs">
        <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
        Deployed
      </span>
    );
  if (status === "deploying" || status === "building")
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 font-semibold text-xs animate-pulse">
        <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block"></span>
        Building
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/10 text-red-400 font-semibold text-xs">
      <span className="w-2 h-2 rounded-full bg-red-400 inline-block"></span>
      Failed
    </span>
  );
};

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const { getUser } = useUser();
  const { getProjectDetails, redeployProject } = useProject();
  const [project, setProject] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Env vars state
  const [envVars, setEnvVars] = useState("");
  const [envVarsEdited, setEnvVarsEdited] = useState(false);
  const [redeploying, setRedeploying] = useState(false);

  // Logs auto-scroll
  const logsRef = useRef(null);

  useEffect(() => {
    const u = getUser();
    if (u) {
      setUser(u);
      // console.log("User fetched:", u);
    } else {
      router.replace("/");
    }
  }, [getUser]);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      const details = await getProjectDetails(id);
      setProject(details.project || null);
      setLogs(details.logs || []);
      setEnvVars(details.project?.env_vars || "");
      setEnvVarsEdited(false);
      setLoading(false);
    };
    fetchDetails();
  }, [id, getProjectDetails]);

  useEffect(() => {
    if (logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }
  }, [logs]);

  const handleEnvVarsChange = (e) => {
    setEnvVars(e.target.value);
    setEnvVarsEdited(e.target.value !== (project?.env_vars || ""));
  };

  const handleRedeploy = async () => {
    if (!envVarsEdited) return;
    setRedeploying(true);
    try {
      await redeployProject(id, envVars);
      alert("Redeploy initiated successfully!");
      setEnvVarsEdited(false);
      window.location.href = "/dashboard";
    } catch (err) {
      alert("Failed to redeploy project. Please try again.");
    }
    setRedeploying(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-slate-900 dark:text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                🛠️ Project Details
                {project && (
                  <span className="ml-3">{statusBadge(project.status)}</span>
                )}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Project ID: {id}
              </p>
            </div>
            <button
              onClick={handleRedeploy}
              disabled={!envVarsEdited || redeploying}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold 
                ${
                  envVarsEdited && !redeploying
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                } transition-all`}
            >
              {redeploying ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              {redeploying ? "Redeploying..." : "Redeploy"}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
          </div>
        ) : project ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Project Info Card */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">
                Project Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Repository URL
                  </label>
                  <a
                    href={project.repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 hover:underline break-all"
                  >
                    {project.repo_url}
                  </a>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Framework
                  </label>
                  {frameworkBadge(project.framework)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Status
                  </label>
                  {statusBadge(project.status)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Created At
                  </label>
                  <span className="text-slate-700 dark:text-slate-300">
                    {new Date(project.created_at).toLocaleString()}
                  </span>
                </div>
                {project.preview_url && (
                  <div>
                    <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                      Preview URL
                    </label>
                    <a
                      href={project.preview_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open Preview
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Environment Variables Card */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">
                Environment Variables
              </h2>
              <div className="mb-4">
                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 font-mono text-sm">
                  {envVars.trim() ? (
                    envVars.split("\n").map((line, i) => (
                      <div key={i} className="text-slate-700 dark:text-slate-300">
                        {line}
                      </div>
                    ))
                  ) : (
                    <span className="text-slate-400">
                      No environment variables set
                    </span>
                  )}
                </div>
              </div>
              <textarea
                className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 
                          text-slate-900 dark:text-slate-100 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                rows={4}
                value={envVars}
                onChange={handleEnvVarsChange}
                placeholder="KEY=value"
              />
              {envVarsEdited && (
                <p className="mt-2 text-sm text-indigo-600 dark:text-indigo-400">
                  Changes detected. Click Redeploy to update.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400">
            Project details not found.
          </div>
        )}

        {/* Logs Section */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">
            Deployment Logs
          </h2>
          <div
            ref={logsRef}
            className="bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 
                        p-4 font-mono text-sm h-[400px] overflow-auto"
          >
            {logs.length === 0 ? (
              <p className="text-slate-400">No logs available.</p>
            ) : (
              logs.map((log, index) => (
                <pre
                  key={index}
                  className={`whitespace-pre-wrap mb-1
                  ${
                    /error|fail/i.test(log.message)
                      ? "text-red-500"
                      : /warn/i.test(log.message)
                      ? "text-yellow-500"
                      : /success|deployed/i.test(log.message)
                      ? "text-green-500"
                      : "text-slate-600 dark:text-slate-300"
                  }`}
                >
                  [{log.timestamp}] {log.message}
                </pre>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}