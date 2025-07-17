"use client";
import { useEffect, useState, useRef } from "react";
import { Loader2, Rocket, Github, ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useProject } from "../context/ProjectContext";

const frameworks = [
  { name: "React", icon: <Rocket className="w-4 h-4" /> },
  { name: "Static", icon: <span className="font-bold text-[#A3A3A3]">S</span> },
];

export default function DeployPage() {
  const { getRepos, deployProject } = useProject();
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [framework, setFramework] = useState("React");
  const [envVars, setEnvVars] = useState("");
  const [loadingRepos, setLoadingRepos] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEnvVarsOpen, setIsEnvVarsOpen] = useState(false);
  const [isRepoDropdownOpen, setIsRepoDropdownOpen] = useState(false);

  const router = useRouter();
  const dropdownRef = useRef(null);

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
      await deployProject({
        repo_url: selectedRepo,
        framework,
        envVars: envVars,
      });
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
    <div className="min-h-screen bg-[#171717] text-[#D4D4D4] font-sans">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#171717] via-[#2D2D2D]/10 to-[#171717] opacity-90" />
        <div className="absolute top-1/4 left-1/6 w-64 h-64 bg-[#A3A3A3]/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/3 right-1/5 w-56 h-56 bg-[#737373]/10 rounded-full blur-3xl animate-pulse-slow delay-1000" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#171717]/80 backdrop-blur-lg border-b border-[#2D2D2D]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold flex items-center gap-3">
            <span className="text-[#A3A3A3]">
              <Rocket className="w-6 h-6" />
            </span>
            Deploy New Project
          </h1>
          <div className="text-sm text-[#D4D4D4]/60">
            {new Date().toLocaleString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Stepper */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-[#A3A3A3] text-[#171717] font-semibold">
              1
            </span>
            <span className="text-sm font-medium">Select Repository</span>
          </div>
          <div className="h-px bg-[#2D2D2D] flex-1" />
          <div className="flex items-center gap-2">
            <span
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                selectedRepo
                  ? "bg-[#A3A3A3] text-[#171717]"
                  : "bg-[#2D2D2D]/50 text-[#D4D4D4]/50"
              } font-semibold`}
            >
              2
            </span>
            <span className="text-sm font-medium">Configure Settings</span>
          </div>
          <div className="h-px bg-[#2D2D2D] flex-1" />
          <div className="flex items-center gap-2">
            <span
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                selectedRepo && framework
                  ? "bg-[#A3A3A3] text-[#171717]"
                  : "bg-[#2D2D2D]/50 text-[#D4D4D4]/50"
              } font-semibold`}
            >
              3
            </span>
            <span className="text-sm font-medium">Deploy</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-[#2D2D2D]/20 rounded-xl shadow-2xl border border-[#2D2D2D]/30 backdrop-blur-lg p-8 animate-fadeIn">
          {/* Repository Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-[#D4D4D4]/60 mb-3">
              <span className="inline-flex items-center gap-2">
                <Github className="w-5 h-5 text-[#A3A3A3]" />
                Select GitHub Repository
              </span>
            </label>
            {loadingRepos ? (
              <div className="flex items-center gap-3 text-[#D4D4D4]/60 bg-[#2D2D2D]/50 rounded-lg p-4">
                <Loader2 className="w-5 h-5 animate-spin text-[#A3A3A3]" />
                Fetching repositories...
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsRepoDropdownOpen(!isRepoDropdownOpen)}
                  className="w-full px-4 py-3 rounded-lg bg-[#171717]/80 border border-[#2D2D2D]/50 text-[#D4D4D4] flex items-center justify-between hover:bg-[#2D2D2D]/80 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Github className="w-5 h-5 text-[#A3A3A3]" />
                    {selectedRepoName}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#A3A3A3] transition-transform ${
                      isRepoDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isRepoDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-[#171717]/90 backdrop-blur-lg border border-[#2D2D2D]/50 rounded-lg shadow-xl max-h-60 overflow-auto animate-slideDown">
                    {repos.length === 0 ? (
                      <div className="px-4 py-3 text-[#D4D4D4]/60">
                        No repositories found
                      </div>
                    ) : (
                      repos.map((repo) => (
                        <button
                          key={repo.id}
                          onClick={() => {
                            setSelectedRepo(repo.html_url);
                            setIsRepoDropdownOpen(false);
                          }}
                          className="w-full px-4 py-3 text-left text-[#D4D4D4] hover:bg-[#2D2D2D]/80 hover:text-[#A3A3A3] transition-all"
                        >
                          {repo.full_name}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Framework Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-[#D4D4D4]/60 mb-3">
              Framework
            </label>
            <div className="grid grid-cols-2 gap-4">
              {frameworks.map((fw) => (
                <button
                  key={fw.name}
                  type="button"
                  onClick={() => setFramework(fw.name)}
                  className={`flex items-center gap-3 px-6 py-4 rounded-lg border border-[#2D2D2D]/50 transition-all ${
                    framework === fw.name
                      ? "bg-[#A3A3A3] text-[#171717] shadow-lg"
                      : "bg-[#2D2D2D]/50 text-[#D4D4D4] hover:bg-[#2D2D2D]/80 hover:shadow-[#737373]/20"
                  }`}
                >
                  {fw.icon}
                  <span className="font-medium">{fw.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Environment Variables */}
          <div className="mb-8">
            <button
              onClick={() => setIsEnvVarsOpen(!isEnvVarsOpen)}
              className="flex items-center justify-between w-full px-4 py-3 rounded-lg bg-[#2D2D2D]/50 border border-[#2D2D2D]/50 text-[#D4D4D4] hover:bg-[#2D2D2D]/80 transition-all"
            >
              <span className="text-sm font-medium text-[#D4D4D4]/60">
                Environment Variables (Optional)
              </span>
              {isEnvVarsOpen ? (
                <ChevronUp className="w-5 h-5 text-[#A3A3A3]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[#A3A3A3]" />
              )}
            </button>
            {isEnvVarsOpen && (
              <div className="mt-3 animate-slideDown">
                <textarea
                  value={envVars}
                  onChange={(e) => setEnvVars(e.target.value)}
                  placeholder={`KEY=value\nANOTHER_KEY=another_value`}
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-[#2D2D2D]/50 border border-[#2D2D2D]/50 text-[#D4D4D4] font-mono text-sm focus:ring-2 focus:ring-[#A3A3A3] focus:border-transparent transition-all"
                />
                <p className="mt-2 text-xs text-[#D4D4D4]/60">
                  Enter environment variables in KEY=value format, one per line
                </p>
              </div>
            )}
          </div>

          {/* Deploy Action */}
          <div className="flex justify-end">
            <button
              onClick={handleDeploy}
              disabled={submitting || !selectedRepo || !framework}
              className={`flex items-center gap-3 px-6 py-3 rounded-lg font-semibold text-base transition-all ${
                !submitting && selectedRepo && framework
                  ? "bg-[#A3A3A3] hover:bg-[#737373] text-[#171717] shadow-lg hover:shadow-[#737373]/30"
                  : "bg-[#2D2D2D]/50 text-[#D4D4D4]/50 cursor-not-allowed"
              }`}
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin text-[#171717]" />
              ) : (
                <Rocket className="w-5 h-5 text-[#16A34A]" />
              )}
              {submitting ? "Deploying..." : "Deploy Project"}
            </button>
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
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
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
