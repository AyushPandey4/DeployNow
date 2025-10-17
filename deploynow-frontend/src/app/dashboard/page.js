"use client";

import Link from "next/link";
import {
  Loader2,
  Plus,
  ExternalLink,
  GitBranch,
  Power,
  LayoutDashboard,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";
import { useProject } from "../context/ProjectContext";

// --- Custom Hook to track mouse position for the spotlight effect ---
const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: null, y: null });

  useEffect(() => {
    const updateMousePosition = (ev) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  return mousePosition;
};

// --- Main Dashboard Component ---
export default function Dashboard() {
  const { getUser, logout } = useUser();
  const { getProjects } = useProject();
  const router = useRouter();
  const mousePosition = useMousePosition();

  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [avatarMenu, setAvatarMenu] = useState(false);

  // --- Core Logic ---
  useEffect(() => {
    const u = getUser();
    if (u) setUser(u);
    else router.replace("/");
  }, [getUser, router]);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const result = await getProjects();
        setProjects(Array.isArray(result) ? result : []);
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

  // --- Status Badge Helper ---
  const statusBadge = (status) => {
    const baseClasses =
      "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold";
    switch (status) {
      case "deployed":
        return (
          <span className={`${baseClasses} bg-emerald-500/10 text-emerald-400`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Deployed
          </span>
        );
      case "building":
      case "deploying":
        return (
          <span className={`${baseClasses} bg-sky-500/10 text-sky-400`}>
            <Loader2 className="w-3 h-3 animate-spin" />
            Building
          </span>
        );
      case "failed":
        return (
          <span className={`${baseClasses} bg-red-500/10 text-red-400`}>
            <span className="w-2 h-2 rounded-full bg-red-500"></span>Failed
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-slate-500/10 text-slate-400`}>
            <span className="w-2 h-2 rounded-full bg-slate-500"></span>Queued
          </span>
        );
    }
  };

  // --- Skeleton Card for Loading State ---
  const ProjectCardSkeleton = () => (
    <div className="h-full p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 animate-pulse">
      <div className="h-6 bg-slate-700 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-slate-700 rounded w-1/2 mb-6"></div>
      <div className="flex justify-between items-center">
        <div className="h-8 bg-slate-700 rounded w-24"></div>
        <div className="h-4 bg-slate-700 rounded w-20"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A1A] text-slate-300 font-sans antialiased">
      {/* Dynamic Background */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          "--mouse-x": `${mousePosition.x}px`,
          "--mouse-y": `${mousePosition.y}px`,
        }}
      >
        <div className="absolute inset-0 grid-bg"></div>
        <div className="absolute inset-0 spotlight"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0A0A1A]/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center border-b border-white/10">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-7 h-7 text-violet-400" />
            <h1 className="text-xl font-bold text-white">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/deploy"
              className="group relative inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-br from-violet-600 to-sky-500 text-white font-semibold rounded-lg shadow-[0_0_20px_rgba(127,0,255,0.4)] hover:shadow-[0_0_30px_rgba(0,191,255,0.6)] transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="w-5 h-5" /> New Project
            </Link>
            <div className="relative">
              <button
                onClick={() => setAvatarMenu((v) => !v)}
                className="w-10 h-10 rounded-full border-2 border-transparent hover:border-violet-500 transition-colors"
              >
                <img
                  src={user.avatar_url}
                  alt={user.username}
                  className="w-full h-full rounded-full"
                />
              </button>
              {avatarMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-900/80 backdrop-blur-xl rounded-lg shadow-xl border border-white/10 overflow-hidden animate-fade-in">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-sm font-semibold text-white truncate">
                      {user.username}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-violet-500/20 hover:text-violet-300 transition-colors flex items-center gap-2"
                  >
                    <Power className="w-4 h-4" /> Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="relative p-12 bg-white/5 backdrop-blur-xl border border-dashed border-white/20 rounded-2xl max-w-lg mx-auto">
              <div className="mb-4 text-5xl">✨</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Your Dashboard is Ready
              </h3>
              <p className="text-slate-400 mb-6">
                It looks a little empty in here. Start by deploying your first
                project from a GitHub repository.
              </p>
              <Link
                href="/deploy"
                className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-violet-600 to-sky-500 text-white font-semibold rounded-lg shadow-[0_0_20px_rgba(127,0,255,0.4)] hover:shadow-[0_0_30px_rgba(0,191,255,0.6)] transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="w-5 h-5" /> Deploy First Project
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <div
                key={project.id}
                className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col justify-between gap-4 transform hover:-translate-y-2 transition-transform duration-300 hover:shadow-2xl hover:shadow-sky-500/10 animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-bold text-white">
                      {project.repo_url?.split("/").pop() || "Unnamed Project"}
                    </h2>
                    {statusBadge(project.status)}
                  </div>
                  <a
                    href={project.repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-sky-400 transition-colors break-all"
                  >
                    <GitBranch className="w-4 h-4 flex-shrink-0" />{" "}
                    {project.repo_url}
                  </a>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                  <p className="text-xs text-slate-500">
                    Deployed:{" "}
                    {new Date(project.created_at).toLocaleDateString()}
                  </p>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/project/${project.id}`}
                      className="px-3 py-1.5 text-sm bg-white/10 text-white rounded-md hover:bg-white/20 transition-colors"
                    >
                      Logs
                    </Link>
                    {project.preview_url && (
                      <a
                        href={project.preview_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-sky-500/20 text-sky-300 rounded-md hover:bg-sky-500/30 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" /> Preview
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");
        body {
          font-family: "Inter", sans-serif;
        }

        .grid-bg {
          background-image: linear-gradient(
              to right,
              rgba(255, 255, 255, 0.07) 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              rgba(255, 255, 255, 0.07) 1px,
              transparent 1px
            );
          background-size: 40px 40px;
        }
        .spotlight {
          background: radial-gradient(
            circle 250px at var(--mouse-x) var(--mouse-y),
            rgba(0, 191, 255, 0.08),
            transparent 80%
          );
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
          opacity: 0;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
