"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Github,
  Rocket,
  GitBranch,
  TerminalSquare,
  Globe,
  Loader2,
} from "lucide-react";

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

// --- Main Landing Page Component ---
export default function LandingPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const mousePosition = useMousePosition();

  // --- Core Authentication Logic ---
  useEffect(() => {
    if (localStorage.getItem("user")) {
      router.replace("/dashboard");
      return;
    }
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    if (code) {
      setLoading(true);
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/github/callback?code=${code}`
        )
        .then((res) => {
          localStorage.setItem("user", JSON.stringify(res.data.user));
          localStorage.setItem("token", res.data.token);
          router.replace("/dashboard");
        })
        .catch((err) => {
          setLoading(false);
          console.error("OAuth Failed", err);
        });
    }
  }, [router]);

  // --- GitHub Login Handler ---
  const handleGithubLogin = () => {
    setLoading(true);
    const githubOAuthURL = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`;
    window.location.href = githubOAuthURL;
  };

  // --- Content Data ---
  const steps = [
    {
      icon: <GitBranch className="w-8 h-8 text-cyan-300" />,
      title: "1. Connect Your Repo",
      desc: "Authorize via GitHub and select the repository you want to deploy. No complex setup required.",
    },
    {
      icon: <TerminalSquare className="w-8 h-8 text-fuchsia-300" />,
      title: "2. We Build & Deploy",
      desc: "Our pipeline auto-detects your framework, builds your project in a secure container, and deploys it to AWS.",
    },
    {
      icon: <Globe className="w-8 h-8 text-emerald-300" />,
      title: "3. Go Live, Globally",
      desc: "Receive a live URL, ready to be shared. Your app is now running on scalable, secure infrastructure.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah K.",
      role: "Frontend Lead @ TechCorp",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      text: "DeployNow has become indispensable for our team. The speed from PR to preview is just magical.",
    },
    {
      name: "Mike R.",
      role: "Indie Hacker",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      text: "I can focus on building my product, not on wrestling with deployment scripts. It's a total game-changer.",
    },
    {
      name: "Elena V.",
      role: "CTO @ Innovate Co.",
      avatar: "https://randomuser.me/api/portraits/women/67.jpg",
      text: "The reliability is top-notch. We've migrated all our staging environments to DeployNow.",
    },
    {
      name: "David L.",
      role: "Full-Stack Dev",
      avatar: "https://randomuser.me/api/portraits/men/56.jpg",
      text: "The interface is clean, the process is simple. This is what a deployment platform should be.",
    },
  ];

  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <div className="min-h-screen bg-[#0A0A1A] text-slate-300 font-sans antialiased overflow-x-hidden">
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
        <Rocket className="fixed -bottom-20 -left-20 w-96 h-96 text-white/5 rocket-anim" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#0A0A1A]/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center border-b border-white/10">
          <div className="flex items-center gap-3">
            <svg
              width="28"
              height="28"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="16" cy="16" r="16" fill="url(#logo-gradient)" />
              <path
                d="M10 17L14 13L18 17"
                stroke="#0A0A1A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 11V21"
                stroke="#0A0A1A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient
                  id="logo-gradient"
                  x1="0"
                  y1="0"
                  x2="32"
                  y2="32"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#38bdf8" />
                  <stop offset="1" stopColor="#a78bfa" />
                </linearGradient>
              </defs>
            </svg>
            <span className="text-xl font-bold text-white">DeployNow</span>
          </div>
          <a
            href="https://github.com/AyushPandey4/DeployNow"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-white/5 text-slate-300 rounded-lg hover:bg-white/10 hover:text-white transition-colors duration-300 border border-white/10"
          >
            <Github className="w-5 h-5" />
            <span className="text-sm font-medium">Star on GitHub</span>
          </a>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-56 pb-32 px-6 max-w-5xl mx-auto text-center">
          <div className="relative inline-block">
            <div className="absolute -inset-2 bg-gradient-to-br from-violet-600 to-sky-600 rounded-full blur-2xl opacity-50 animate-pulse-slow"></div>
            <div className="relative px-8 py-4 bg-black/80 backdrop-blur-lg rounded-full border border-white/10">
              <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 tracking-tighter">
                From Code to Global.
              </h1>
            </div>
          </div>
          <p className="text-lg md:text-xl text-slate-400 mt-8 mb-12 max-w-2xl mx-auto">
            The self-hosted deployment platform for developers who'd rather
            build products than fight with infrastructure.
          </p>
          <button
            onClick={handleGithubLogin}
            disabled={loading}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-br from-violet-600 to-sky-500 text-white text-lg font-bold rounded-xl shadow-[0_0_40px_rgba(127,0,255,0.5)] hover:shadow-[0_0_60px_rgba(0,191,255,0.7)] transition-all duration-300 transform hover:scale-105 overflow-hidden"
          >
            <span className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Github className="w-6 h-6" />
            )}
            <span className="relative">
              {loading ? "Authenticating..." : "Deploy with GitHub"}
            </span>
          </button>
        </section>

        {/* "How It Works" Section */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent"></div>
            {steps.map((step, i) => (
              <div
                key={i}
                className={`flex items-center my-12 ${
                  i % 2 !== 0 ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`flex-1 p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 transform transition-transform duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-violet-500/10 ${
                    i % 2 !== 0 ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block mb-4 p-3 bg-gradient-to-br from-violet-500/20 to-sky-500/20 rounded-lg border border-white/10`}
                  >
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-slate-400">{step.desc}</p>
                </div>
                <div className="flex-1"></div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials Section - Infinite Scroller */}
        <section className="py-24 w-full">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Trusted by Developers Worldwide
          </h2>
          <div className="relative w-full overflow-hidden mask-gradient">
            <div className="flex testimonial-scroller">
              {duplicatedTestimonials.map((t, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-[350px] p-6 mx-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-12 h-12 rounded-full border-2 border-sky-500"
                    />
                    <div>
                      <p className="font-semibold text-white">{t.name}</p>
                      <p className="text-sm text-slate-400">{t.role}</p>
                    </div>
                  </div>
                  <p className="text-slate-300 italic">"{t.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-white/10 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">
          Ready to Ship Faster?
        </h2>
        <button
          onClick={handleGithubLogin}
          disabled={loading}
          className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-br from-violet-600 to-sky-500 text-white text-lg font-bold rounded-xl shadow-[0_0_40px_rgba(127,0,255,0.5)] hover:shadow-[0_0_60px_rgba(0,191,255,0.7)] transition-all duration-300 transform hover:scale-105 overflow-hidden"
        >
          <span className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Github className="w-6 h-6" />
          )}
          <span className="relative">
            {loading ? "Please wait..." : "Start for Free"}
          </span>
        </button>
        <p className="text-slate-500 mt-12">
          &copy; {new Date().getFullYear()} DeployNow. An open-source project by
          Ayush Pandey.
        </p>
      </footer>

      {/* Custom Global Styles */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");

        html {
          scroll-behavior: smooth;
        }
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
            circle 500px at var(--mouse-x) var(--mouse-y),
            rgba(0, 191, 255, 0.15),
            transparent 80%
          );
        }

        .rocket-anim {
          animation: fly-rocket 20s linear infinite;
        }

        @keyframes fly-rocket {
          0% {
            transform: translate(100vw, -20vh) rotate(-45deg);
          }
          100% {
            transform: translate(-50vw, 120vh) rotate(-45deg);
          }
        }

        .animate-pulse-slow {
          animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          50% {
            opacity: 0.8;
          }
        }

        .testimonial-scroller {
          animation: scroll-left 40s linear infinite;
        }

        @keyframes scroll-left {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .mask-gradient {
          -webkit-mask-image: linear-gradient(
            to right,
            transparent,
            black 20%,
            black 80%,
            transparent
          );
          mask-image: linear-gradient(
            to right,
            transparent,
            black 20%,
            black 80%,
            transparent
          );
        }
      `}</style>
    </div>
  );
}
