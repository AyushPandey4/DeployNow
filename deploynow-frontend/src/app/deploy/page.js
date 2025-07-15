"use client";
import { useEffect, useState } from "react";
import { Loader2, Rocket, Github } from "lucide-react";
import { useRouter } from "next/navigation";
import { useProject } from "../context/ProjectContext";

const frameworks = [
  { name: "React", icon: <Rocket className="w-4 h-4" /> },
  { name: "Static", icon: <span className="font-bold text-indigo-500">S</span> },
];

export default function DeployPage() {
  const { getRepos, deployProject } = useProject();
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [framework, setFramework] = useState("React");
  const [envVars, setEnvVars] = useState("");
  const [loadingRepos, setLoadingRepos] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      setLoadingRepos(true);
      const reposArr = await getRepos();
      setRepos(reposArr);
      setLoadingRepos(false);
    })();
  }, [getRepos]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-slate-900 dark:text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <span className="text-indigo-600 dark:text-indigo-400">🚀</span>
              Deploy New Project
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-200 dark:border-slate-700">
          {/* Repository Selection */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                <span className="inline-flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  Select Repository
                </span>
              </label>
              {loadingRepos ? (
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Fetching repositories...
                </div>
              ) : (
                <select
                  value={selectedRepo}
                  onChange={(e) => setSelectedRepo(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 
                           text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                >
                  <option value="">Choose a repository</option>
                  {repos.map((repo) => (
                    <option key={repo.id} value={repo.html_url}>
                      {repo.full_name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Framework Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Framework
              </label>
              <div className="flex gap-3">
                {frameworks.map((fw) => (
                  <button
                    key={fw.name}
                    type="button"
                    onClick={() => setFramework(fw.name)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                      ${framework === fw.name
                        ? "bg-indigo-600 text-white shadow-lg hover:bg-indigo-700"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                      }`}
                  >
                    {fw.icon}
                    {fw.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Environment Variables */} 
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Environment Variables (optional)
                    </label>
                    <textarea
                    value={envVars}
                    onChange={(e) => setEnvVars(e.target.value)}
                    placeholder={`KEY=value\nANOTHER_KEY=another_value`}
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700
                         text-slate-900 dark:text-slate-100 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Each line should be in KEY=value format
                    </p>
                  </div>

                  {/* Deploy Button */}
            <button
              onClick={handleDeploy}
              disabled={submitting || !selectedRepo || !framework}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-base flex items-center justify-center gap-2
                ${!submitting && selectedRepo && framework
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-indigo-500/20"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                } transition-all`}
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Rocket className="w-5 h-5" />
              )}
              {submitting ? "Deploying..." : "Deploy Project"}
            </button>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
              Your project will be deployed immediately after confirmation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
