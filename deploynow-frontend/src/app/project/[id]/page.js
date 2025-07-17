"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProject } from "../../context/ProjectContext";
import { Loader2, ExternalLink, RefreshCw } from "lucide-react";
import { useUser } from "../../context/UserContext";


// Framework badge/icon helper
const frameworkBadge = (fw) => {
  const color = "#A3A3A3"; // Light Grey for all frameworks
  const icon =
    fw === "React" ? (
      <svg
        width="18"
        height="18"
        viewBox="0 0 32 32"
        fill="none"
        className="mr-1"
      >
        <circle cx="16" cy="16" r="2.5" fill={color} />
        <g stroke={color} strokeWidth="2">
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
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#16A34A]/20 text-[#16A34A] font-semibold text-xs">
        <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
        Deployed
      </span>
    );
  if (status === "deploying" || status === "building")
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#737373]/20 text-[#737373] font-semibold text-xs animate-pulse">
        <span className="w-2 h-2 rounded-full bg-[#737373]"></span>
        Building
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/20 text-red-400 font-semibold text-xs">
      <span className="w-2 h-2 rounded-full bg-red-400"></span>
      Failed
    </span>
  );
};

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
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
    } else {
      router.replace("/");
    }
  }, [getUser, router]);

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
      router.push("/dashboard");
    } catch (err) {
      alert("Failed to redeploy project. Please try again.");
    }
    setRedeploying(false);
  };

  return (
    <div className="min-h-screen bg-[#171717] text-[#D4D4D4] font-sans">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#171717] via-[#2D2D2D]/10 to-[#171717] opacity-90" />
        <div className="absolute top-1/5 left-1/5 w-56 h-56 bg-[#A3A3A3]/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-[#737373]/10 rounded-full blur-3xl animate-pulse-slow delay-1000" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#171717]/80 backdrop-blur-lg border-b border-[#2D2D2D]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <span className="text-[#A3A3A3]">🛠️</span>
              Project Details
              {project && (
                <span className="ml-3">{statusBadge(project.status)}</span>
              )}
            </h1>
            <p className="text-xs text-[#D4D4D4]/60 mt-1">Project ID: {id}</p>
          </div>
          <button
            onClick={handleRedeploy}
            disabled={!envVarsEdited || redeploying}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold 
              ${
                envVarsEdited && !redeploying
                  ? "bg-[#A3A3A3] hover:bg-[#737373] text-[#171717]"
                  : "bg-[#2D2D2D]/50 text-[#D4D4D4]/50"
              } transition-all shadow-md hover:shadow-[#737373]/20`}
          >
            {redeploying ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            {redeploying ? "Redeploying..." : "Redeploy"}
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#A3A3A3]" />
          </div>
        ) : project ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Project Info Card */}
            <div className="bg-[#2D2D2D]/20 rounded-lg shadow-lg p-6 border border-[#2D2D2D]/50 backdrop-blur-lg animate-fadeIn">
              <h2 className="text-lg font-semibold mb-4 text-white">
                Project Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#D4D4D4]/60 mb-1">
                    Repository URL
                  </label>
                  <a
                    href={project.repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#A3A3A3] hover:text-[#737373] break-all transition-colors"
                  >
                    {project.repo_url}
                  </a>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#D4D4D4]/60 mb-1">
                    Framework
                  </label>
                  {frameworkBadge(project.framework)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#D4D4D4]/60 mb-1">
                    Status
                  </label>
                  {statusBadge(project.status)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#D4D4D4]/60 mb-1">
                    Created At
                  </label>
                  <span className="text-[#D4D4D4]">
                    {new Date(project.created_at).toLocaleString()}
                  </span>
                </div>
                {project.preview_url && (
                  <div>
                    <label className="block text-sm font-medium text-[#D4D4D4]/60 mb-1">
                      Preview URL
                    </label>
                    <a
                      href={project.preview_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm bg-[#A3A3A3] text-[#171717] px-4 py-2 rounded-lg hover:bg-[#737373] transition-colors shadow-md hover:shadow-[#737373]/20"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open Preview
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Environment Variables Card */}
            <div className="bg-[#2D2D2D]/20 rounded-lg shadow-lg p-6 border border-[#2D2D2D]/50 backdrop-blur-lg animate-fadeIn">
              <h2 className="text-lg font-semibold mb-4 text-white">
                Environment Variables
              </h2>
              <div className="mb-4">
                <div className="bg-[#2D2D2D]/50 rounded-lg p-4 font-mono text-sm">
                  {envVars.trim() ? (
                    envVars.split("\n").map((line, i) => (
                      <div key={i} className="text-[#D4D4D4]">
                        {line}
                      </div>
                    ))
                  ) : (
                    <span className="text-[#D4D4D4]/60">
                      No environment variables set
                    </span>
                  )}
                </div>
              </div>
              <textarea
                className="w-full p-3 rounded-lg border border-[#2D2D2D]/50 bg-[#2D2D2D]/50 text-[#D4D4D4] font-mono text-sm focus:ring-2 focus:ring-[#A3A3A3] focus:border-transparent"
                rows={4}
                value={envVars}
                onChange={handleEnvVarsChange}
                placeholder="KEY=value"
              />
              {envVarsEdited && (
                <p className="mt-2 text-sm text-[#A3A3A3]">
                  Changes detected. Click Redeploy to update.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-400 animate-fadeIn">
            Project details not found.
          </div>
        )}

        {/* Logs Section */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4 text-white">
            Deployment Logs
          </h2>
          <div
            ref={logsRef}
            className="bg-[#2D2D2D]/50 rounded-lg border border-[#2D2D2D]/50 p-4 font-mono text-sm h-[400px] overflow-auto backdrop-blur-lg animate-fadeIn"
          >
            {logs.length === 0 ? (
              <p className="text-[#D4D4D4]/60">No logs available.</p>
            ) : (
              logs.map((log, index) => (
                <pre
                  key={index}
                  className={`whitespace-pre-wrap mb-1
                  ${
                    /error|fail/i.test(log.message)
                      ? "text-red-400"
                      : /warn/i.test(log.message)
                      ? "text-yellow-400"
                      : /success|deployed/i.test(log.message)
                      ? "text-[#16A34A]"
                      : "text-[#D4D4D4]"
                  }`}
                >
                  [{log.timestamp}] {log.message}
                </pre>
              ))
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");
        body {
          font-family: "Inter", sans-serif;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-pulse-slow {
          animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  );
}
