"use client";

import { useEffect, useState, useRef } from "react";
import {
  Loader2,
  Rocket,
  Github,
  ChevronDown,
  ChevronUp,
  Check,
  GitBranch,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useProject } from "../context/ProjectContext";

// --- Custom Hook for Mouse Position ---
const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: null, y: null });
  useEffect(() => {
    const updateMousePosition = (ev) =>
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);
  return mousePosition;
};

// --- Frameworks Data ---
const frameworks = [
  { name: "React", icon: <Rocket className="w-5 h-5 text-sky-400" /> },
  {
    name: "Static",
    icon: <span className="font-bold text-slate-400 text-lg">H</span>,
  },
];

// --- Main Deploy Page Component ---
export default function DeployPage() {
  const { getRepos, deployProject } = useProject();
  const router = useRouter();
  const mousePosition = useMousePosition();

  // State Management
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [framework, setFramework] = useState("React");
  const [envVars, setEnvVars] = useState("");
  const [loadingRepos, setLoadingRepos] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEnvVarsOpen, setIsEnvVarsOpen] = useState(false);
  const [isRepoDropdownOpen, setIsRepoDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  // --- Logic Hooks ---
  useEffect(() => {
    (async () => {
      setLoadingRepos(true);
      const reposArr = await getRepos();
      setRepos(reposArr);
      setLoadingRepos(false);
    })();
  }, [getRepos]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsRepoDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeploy = async () => {
    if (!selectedRepo || !framework) return;
    setSubmitting(true);
    try {
      await deployProject({ repo_url: selectedRepo, framework, envVars });
      router.push("/dashboard");
    } catch (err) {
      console.error("Deployment failed", err);
      alert("Deployment failed. Check console for details.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedRepoName =
    repos.find((repo) => repo.html_url === selectedRepo)?.full_name ||
    "Choose a repository";

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
      <header className="sticky top-0 z-20 bg-[#0A0A1A]/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center border-b border-white/10">
          <div className="flex items-center gap-3">
            <Rocket className="w-7 h-7 text-violet-400" />
            <h1 className="text-xl font-bold text-white">Deploy New Project</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl shadow-violet-500/10 animate-fade-in">
          {/* Repository Selection */}
          <div className="mb-8">
            <label className="flex items-center gap-3 text-lg font-semibold text-white mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-sky-500 text-white font-bold">
                1
              </span>
              Select Repository
            </label>
            {loadingRepos ? (
              <div className="h-14 flex items-center gap-3 px-4 text-slate-400 bg-white/5 rounded-lg border border-white/10">
                <Loader2 className="w-5 h-5 animate-spin" /> Fetching
                repositories...
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsRepoDropdownOpen(!isRepoDropdownOpen)}
                  className="w-full h-14 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-slate-300 flex items-center justify-between hover:bg-white/10 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Github className="w-5 h-5" /> {selectedRepoName}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      isRepoDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isRepoDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-[#101020]/90 backdrop-blur-lg border border-white/10 rounded-lg shadow-xl max-h-60 overflow-auto animate-slide-down">
                    {repos.map((repo) => (
                      <button
                        key={repo.id}
                        onClick={() => {
                          setSelectedRepo(repo.html_url);
                          setIsRepoDropdownOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left text-slate-300 hover:bg-violet-500/20 hover:text-violet-300 transition-colors flex items-center gap-3"
                      >
                        <GitBranch className="w-4 h-4 text-slate-500" />{" "}
                        {repo.full_name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/*  Configure & Deploy */}
          <div
            className={`transition-opacity duration-500 ${
              selectedRepo ? "opacity-100" : "opacity-40 pointer-events-none"
            }`}
          >
            <label className="flex items-center gap-3 text-lg font-semibold text-white mb-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-sky-500 text-white font-bold">
                2
              </span>
              Configure & Deploy
            </label>

            <div className="p-6 rounded-lg bg-white/5 border border-white/10">
              {/* Framework Selection */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-400 mb-3">
                  Framework Preset
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {frameworks.map((fw) => (
                    <button
                      key={fw.name}
                      type="button"
                      onClick={() => setFramework(fw.name)}
                      className={`relative flex items-center gap-3 px-4 py-3 rounded-lg border transition-all ${
                        framework === fw.name
                          ? "bg-sky-500/20 border-sky-400 text-sky-300"
                          : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20"
                      }`}
                    >
                      {fw.icon}
                      <span className="font-semibold">{fw.name}</span>
                      {framework === fw.name && (
                        <Check className="w-5 h-5 absolute top-2 right-2 text-sky-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Environment Variables */}
              <div className="mb-6">
                <button
                  onClick={() => setIsEnvVarsOpen(!isEnvVarsOpen)}
                  className="flex items-center justify-between w-full"
                >
                  <h3 className="text-sm font-medium text-slate-400">
                    Environment Variables
                  </h3>
                  {isEnvVarsOpen ? (
                    <ChevronUp className="w-5 h-5 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500" />
                  )}
                </button>
                {isEnvVarsOpen && (
                  <div className="mt-3 animate-slide-down">
                    <textarea
                      value={envVars}
                      onChange={(e) => setEnvVars(e.target.value)}
                      placeholder="KEY=VALUE"
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-slate-300 font-mono text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    />
                  </div>
                )}
              </div>

              {/* Deploy Action */}
              <div className="flex justify-end pt-6 border-t border-white/10">
                <button
                  onClick={handleDeploy}
                  disabled={submitting || !selectedRepo || !framework}
                  className="group relative inline-flex items-center justify-center gap-3 px-8 py-3 bg-gradient-to-br from-violet-600 to-sky-500 text-white text-base font-bold rounded-lg shadow-[0_0_20px_rgba(127,0,255,0.4)] hover:shadow-[0_0_30px_rgba(0,191,255,0.6)] transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100"
                >
                  {submitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Rocket className="w-5 h-5" />
                  )}
                  <span>{submitting ? "Deploying..." : "Deploy"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
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
          animation: fade-in 0.5s ease-out forwards;
          opacity: 0;
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out forwards;
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
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
            max-height: 0;
          }
          to {
            opacity: 1;
            transform: translateY(0);
            max-height: 500px;
          }
        }
      `}</style>
    </div>
  );
}
