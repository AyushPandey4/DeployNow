"use client";
import Link from "next/link";
import {
  Loader2,
  Plus,
  ExternalLink,
  TerminalSquare,
  User2,
} from "lucide-react";
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
    } else {
      router.replace("/");
    }
  }, [getUser, router]);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const result = await getProjects();
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
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#A3A3A3]/20 text-[#A3A3A3] font-semibold text-xs">
          <span className="w-2 h-2 rounded-full bg-[#A3A3A3]"></span>
          Queued
        </span>
      );
    if (status === "deployed")
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#16A34A]/20 text-[#16A34A] font-semibold text-xs">
          <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
          Deployed
        </span>
      );
    if (status === "deploying" || status === "building")
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#737373]/20 text-[#737373] font-semibold text-xs">
          <span className="w-2 h-2 rounded-full bg-[#737373]"></span>
          Building
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-500/20 text-red-400 font-semibold text-xs">
        <span className="w-2 h-2 rounded-full bg-red-400"></span>
        Failed
      </span>
    );
  };

  // User avatar initials
  const initials = user?.username
    ? user.username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <span className="text-[#A3A3A3]">📁</span>
            DeployNow Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <Link
              href="/deploy"
              className="inline-flex items-center gap-2 bg-[#A3A3A3] text-[#171717] px-4 py-2 rounded-lg hover:bg-[#737373] transition-all shadow-lg hover:shadow-[#737373]/20"
            >
              <Plus className="w-4 h-4" />
              New Project
            </Link>
            <div className="relative">
              <button
                className="w-10 h-10 rounded-full bg-gradient-to-r from-[#A3A3A3] to-[#737373] flex items-center justify-center text-[#171717] shadow-lg hover:shadow-[#737373]/20 transition-all"
                onClick={() => setAvatarMenu((v) => !v)}
              >
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.username}
                    className="w-10 h-10 rounded-full border-2 border-[#D4D4D4]"
                  />
                ) : (
                  <span>{initials}</span>
                )}
              </button>
              {avatarMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-[#2D2D2D]/20 rounded-lg shadow-xl border border-[#2D2D2D]/50 backdrop-blur-lg overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#2D2D2D]/50">
                    <p className="text-sm font-medium text-[#D4D4D4]">
                      {user?.username}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-[#D4D4D4] hover:bg-[#2D2D2D]/50 transition-colors"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#A3A3A3]" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-[#2D2D2D]/20 rounded-lg p-8 shadow-lg max-w-md mx-auto border border-[#2D2D2D]/50 backdrop-blur-lg">
              <h3 className="text-xl font-semibold text-white mb-2">
                No projects yet
              </h3>
              <p className="text-[#D4D4D4]/80 mb-4">
                Start by deploying your first project
              </p>
              <Link
                href="/deploy"
                className="inline-flex items-center gap-2 bg-[#A3A3A3] text-[#171717] px-6 py-2 rounded-lg hover:bg-[#737373] transition-colors shadow-md hover:shadow-[#737373]/20"
              >
                <Plus className="w-4 h-4" />
                Deploy Project
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-[#2D2D2D]/20 rounded-lg shadow-lg overflow-hidden border border-[#2D2D2D]/50 backdrop-blur-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#2D2D2D]/30 border-b border-[#2D2D2D]/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#D4D4D4]">
                      Project
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#D4D4D4]">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#D4D4D4]">
                      Framework
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#D4D4D4]">
                      Created
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-[#D4D4D4]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project, idx) => (
                    <tr
                      key={project.id}
                      className="border-b border-[#2D2D2D]/50 hover:bg-[#2D2D2D]/30 transition-colors"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <TerminalSquare className="w-5 h-5 text-[#A3A3A3]" />
                          <span className="font-medium text-white">
                            {project.repo_url?.split("/").pop() || "Unnamed"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {statusBadge(project.status)}
                      </td>
                      <td className="px-6 py-4 text-[#D4D4D4]/80">
                        {project.framework || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-[#D4D4D4]/80">
                        {new Date(project.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/project/${project.id}`}
                            className="inline-flex items-center gap-1 bg-[#A3A3A3] text-[#171717] px-3 py-1.5 rounded-md text-sm font-medium hover:bg-[#737373] transition-colors"
                          >
                            <TerminalSquare className="w-4 h-4" />
                            Logs
                          </Link>
                          {project.preview_url && (
                            <a
                              href={project.preview_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 bg-[#D4D4D4]/20 text-[#D4D4D4] px-3 py-1.5 rounded-md text-sm font-medium hover:bg-[#D4D4D4]/30 transition-colors"
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
        tbody tr {
          animation: fadeIn 0.3s ease-out forwards;
          opacity: 0;
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
