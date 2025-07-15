"use client";
import Link from "next/link";
import { Loader2, Plus, ExternalLink, TerminalSquare, User2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";
import { useProject } from "../context/ProjectContext";

export default function Dashboard() {
  const { getUser, logout } = useUser();
  const { getProjects } = useProject();

  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [avatarMenu, setAvatarMenu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const u = getUser();
    if (u) {
      setUser(u);
      // console.log("User fetched:", u);
    } else {
      router.replace("/");
    }
  }, [getUser, router]);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const result = await getProjects(); // ✅ await the Promise
        if (Array.isArray(result)) {
          setProjects(result);
        } else {
          console.warn("getProjects() did not return an array", result);
          setProjects([]);
        }
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [getProjects]);

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  if (!user) return null;

  // Status badge helper
  const statusBadge = (status) => {
    if (!status || status === "queued")
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-500/10 text-blue-400 font-semibold text-xs">
          <span className="w-2 h-2 rounded-full bg-blue-400 inline-block"></span>
          Queued
        </span>
      );
    if (status === "deployed")
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-600/10 text-green-400 font-semibold text-xs">
          <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
          Deployed
        </span>
      );
    if (status === "deploying" || status === "building")
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-yellow-500/10 text-yellow-400 font-semibold text-xs">
          <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block"></span>
          Building
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-500/10 text-red-400 font-semibold text-xs">
        <span className="w-2 h-2 rounded-full bg-red-400 inline-block"></span>
        Failed
      </span>
    );
  };

  // User avatar initials
  const initials = user?.username
    ? user.username.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-slate-900 dark:text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <span className="text-indigo-600 dark:text-indigo-400">📁</span>
              Projects Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <Link
                href="/deploy"
                className="inline-flex items-center gap-2 bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all shadow-lg hover:shadow-indigo-500/20"
              >
                <Plus className="w-4 h-4" />
                New Project
              </Link>
              
              <div className="relative">
                <button
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg hover:shadow-indigo-500/20 transition-all"
                  onClick={() => setAvatarMenu((v) => !v)}
                >
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt={user.username} className="w-10 h-10 rounded-full border-2 border-white" />
                  ) : (
                    <span>{initials}</span>
                  )}
                </button>
                {avatarMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                      <p className="text-sm font-medium">{user?.username}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-8 shadow-lg max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">Start by deploying your first project</p>
              <Link
                href="/deploy"
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Deploy Project
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-200">Project</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-200">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-200">Framework</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-200">Created</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900 dark:text-slate-200">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project, idx) => (
                    <tr 
                      key={project.id}
                      className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <TerminalSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                          <span className="font-medium text-slate-900 dark:text-white">
                            {project.repo_url?.split("/").pop() || "Unnamed"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{statusBadge(project.status)}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {project.framework || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {new Date(project.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/project/${project.id}`}
                            className="inline-flex items-center gap-1 bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
                          >
                            <TerminalSquare className="w-4 h-4" />
                            Logs
                          </Link>
                          {project.preview_url && (
                            <a
                              href={project.preview_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Preview
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        tbody tr {
          animation: fadeIn 0.3s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
