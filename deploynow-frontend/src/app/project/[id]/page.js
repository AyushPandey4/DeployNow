"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useProject } from "../../context/ProjectContext";
import { useUser } from "../../context/UserContext";
import { Loader2, ExternalLink, RefreshCw, GitBranch, Terminal, Settings, Clock, Layers, ArrowLeft } from "lucide-react";

// --- Custom Hook for Mouse Position ---
const useMousePosition = () => {
    const [mousePosition, setMousePosition] = useState({ x: null, y: null });
    useEffect(() => {
        const updateMousePosition = (ev) => setMousePosition({ x: ev.clientX, y: ev.clientY });
        window.addEventListener("mousemove", updateMousePosition);
        return () => window.removeEventListener("mousemove", updateMousePosition);
    }, []);
    return mousePosition;
};

// --- Main Project Details Page Component ---
export default function ProjectDetailsPage() {
    const router = useRouter();
    const { id } = useParams();
    const { getUser } = useUser();
    const { getProjectDetails, redeployProject } = useProject();
    const mousePosition = useMousePosition();

    // --- State Management ---
    const [project, setProject] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [envVars, setEnvVars] = useState("");
    const [envVarsEdited, setEnvVarsEdited] = useState(false);
    const [redeploying, setRedeploying] = useState(false);

    const logsRef = useRef(null);

    // --- Core Logic ---
    useEffect(() => {
        const u = getUser();
        if (!u) router.replace("/");
        else setUser(u);
    }, [getUser, router]);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const details = await getProjectDetails(id);
                if (details && details.project) {
                    setProject(details.project);
                    setEnvVars(details.project.env_vars || "");
                    setLogs(details.logs?.[0]?.logs || []);
                }
            } catch (error) {
                console.error("Failed to fetch project details:", error);
            } finally {
                setEnvVarsEdited(false);
                setLoading(false);
            }
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
        } finally {
            setRedeploying(false);
        }
    };
    
    // --- Status Badge ---
    const statusBadge = (status) => {
        const baseClasses = "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold";
        switch (status) {
            case "deployed":
                return <span className={`${baseClasses} bg-emerald-500/10 text-emerald-400`}><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Deployed</span>;
            case "building":
            case "deploying":
                return <span className={`${baseClasses} bg-sky-500/10 text-sky-400`}><Loader2 className="w-3 h-3 animate-spin" />Building</span>;
            case "failed":
                return <span className={`${baseClasses} bg-red-500/10 text-red-400`}><span className="w-2 h-2 rounded-full bg-red-500"></span>Failed</span>;
            default:
                return <span className={`${baseClasses} bg-slate-500/10 text-slate-400`}><span className="w-2 h-2 rounded-full bg-slate-500"></span>Queued</span>;
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A1A] text-slate-300 font-sans antialiased">
            {/* Dynamic Background */}
            <div 
                className="fixed inset-0 z-0 pointer-events-none" 
                style={{ '--mouse-x': `${mousePosition.x}px`, '--mouse-y': `${mousePosition.y}px` }}
            >
                <div className="absolute inset-0 grid-bg"></div>
                <div className="absolute inset-0 spotlight-sm"></div>
            </div>

            {/* Header */}
            <header className="sticky top-0 z-20 bg-[#0A0A1A]/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center border-b border-white/10">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="p-2 rounded-full text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="flex items-center gap-3">
                            <Terminal className="w-7 h-7 text-violet-400" />
                            <div>
                                <h1 className="text-xl font-bold text-white">{project ? project.repo_url?.split("/").pop() : <>&nbsp;</>}</h1>
                                <p className="text-xs text-slate-500 font-mono mt-1">{id}</p>
                            </div>
                        </div>
                    </div>
                    {project && (
                         <div className="flex items-center gap-4">
                            {statusBadge(project.status)}
                             {project.preview_url && (
                                <a href={project.preview_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 text-sm bg-sky-500/20 text-sky-300 rounded-lg hover:bg-sky-500/30 transition-colors">
                                    <ExternalLink className="w-4 h-4" /> Live Preview
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </header>

            {/* Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                {loading ? (
                    <div className="flex justify-center items-center h-96">
                        <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
                    </div>
                ) : project ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Details & Actions */}
                        <div className="flex flex-col gap-8">
                            {/* Project Details Card */}
                            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                                <h2 className="text-lg font-bold text-white mb-4">Details</h2>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-3"><GitBranch className="w-5 h-5 text-slate-500" /><a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-sky-400 transition-colors break-all">{project.repo_url}</a></div>
                                    <div className="flex items-center gap-3"><Layers className="w-5 h-5 text-slate-500" /><span className="text-slate-300">{project.framework}</span></div>
                                    <div className="flex items-center gap-3"><Clock className="w-5 h-5 text-slate-500" /><span className="text-slate-300">{new Date(project.created_at).toLocaleString()}</span></div>
                                </div>
                            </div>
                            
                            {/* Environment Variables & Redeploy */}
                            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
                                <h2 className="flex items-center gap-2 text-lg font-bold text-white mb-4"><Settings className="w-5 h-5"/> Actions</h2>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Environment Variables</label>
                                <textarea
                                    value={envVars}
                                    onChange={handleEnvVarsChange}
                                    placeholder="KEY=VALUE"
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-slate-300 font-mono text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                />
                                {envVarsEdited && (
                                    <p className="mt-2 text-xs text-violet-400 animate-fade-in">Changes detected. Click Redeploy to apply.</p>
                                )}
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={handleRedeploy}
                                        disabled={!envVarsEdited || redeploying}
                                        className="group relative inline-flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-br from-violet-600 to-sky-500 text-white font-semibold rounded-lg shadow-[0_0_20px_rgba(127,0,255,0.4)] hover:shadow-[0_0_30px_rgba(0,191,255,0.6)] transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100"
                                    >
                                        {redeploying ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                                        {redeploying ? "Deploying..." : "Redeploy"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Logs */}
                        <div className="lg:col-span-2">
                             <div ref={logsRef} className="h-[600px] p-4 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/10 font-mono text-sm overflow-y-auto">
                                {logs.length === 0 ? (
                                    <p className="text-slate-500">Awaiting logs...</p>
                                ) : (
                                    logs.map((log, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <span className="text-slate-600 select-none w-6 text-right">{index + 1}</span>
                                            <pre className={`whitespace-pre-wrap flex-1 
                                                ${/error|fail/i.test(log.message) ? "text-red-400" 
                                                : /success|deployed|live/i.test(log.message) ? "text-emerald-400"
                                                : "text-slate-300"}`
                                            }>
                                                {log.message}
                                            </pre>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                     <div className="text-center py-20 text-red-400">Project details not found.</div>
                )}
            </main>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Fira+Code&display=swap');
                
                body { font-family: 'Inter', sans-serif; }
                .font-mono { font-family: 'Fira Code', monospace; }

                .grid-bg {
                    background-image:
                        linear-gradient(to right, rgba(255, 255, 255, 0.07) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255, 255, 255, 0.07) 1px, transparent 1px);
                    background-size: 40px 40px;
                }
                .spotlight-sm {
                    background: radial-gradient(circle 250px at var(--mouse-x) var(--mouse-y), rgba(0, 191, 255, 0.08), transparent 80%);
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                    opacity: 0;
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

