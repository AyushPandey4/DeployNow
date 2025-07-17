"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// Animated Background with neon-inspired gradient and particles
const ModernBG = () => (
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#3A3A3A]/10 to-[#0A0A0A] opacity-95" />
    <div className="absolute top-1/5 left-1/5 w-64 h-64 bg-[#00D4B8]/15 rounded-full blur-3xl animate-pulse-slow" />
    <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-[#FF3E79]/15 rounded-full blur-3xl animate-pulse-slow delay-1000" />
  </div>
);


export default function LandingPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
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
          setUser(res.data.user);
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

  // Animated CLI snippet
  const cliLines = [
    "$ deploynow init my-app",
    "✔ Initialized project",
    "✔ Deployed to AWS",
    "✔ Live: https://my-app.deploynow.io",
  ];
  const [cliIdx, setCliIdx] = useState(0);
  useEffect(() => {
    if (cliIdx < cliLines.length - 1) {
      const timer = setTimeout(() => setCliIdx(cliIdx + 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cliIdx]);

  // Features
  const features = [
    {
      icon: "🚀",
      title: "Lightning Deployments",
      desc: "Deploy your site in seconds with zero configuration.",
      accent: "bg-[#00D4B8]/20 text-[#00D4B8]",
    },
    {
      icon: "⚙️",
      title: "Auto-Scaling",
      desc: "Scale seamlessly on AWS infrastructure.",
      accent: "bg-[#FF3E79]/20 text-[#FF3E79]",
    },
    {
      icon: "💻",
      title: "Developer-First",
      desc: "Free tier for personal projects, no card required.",
      accent: "bg-[#22C55E]/20 text-[#22C55E]",
    },
    {
      icon: "🔒",
      title: "Robust Security",
      desc: "Enterprise-grade security with AWS.",
      accent: "bg-[#E8ECEF]/20 text-[#E8ECEF]",
    },
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Sophie L.",
      role: "Indie Developer",
      avatar: "https://randomuser.me/api/portraits/women/55.jpg",
      text: "DeployNow makes shipping projects effortless. The speed is unreal!",
    },
    {
      name: "James T.",
      role: "Startup CTO",
      avatar: "https://randomuser.me/api/portraits/men/77.jpg",
      text: "A polished, reliable platform that saves us hours.",
    },
    {
      name: "Mia K.",
      role: "Frontend Engineer",
      avatar: "https://randomuser.me/api/portraits/women/88.jpg",
      text: "The preview links are perfect for client feedback.",
    },
  ];
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  useEffect(() => {
    const timer = setTimeout(
      () => setTestimonialIdx((testimonialIdx + 1) % testimonials.length),
      4000
    );
    return () => clearTimeout(timer);
  }, [testimonialIdx]);
  const visibleTestimonials = [
    testimonials[testimonialIdx],
    testimonials[(testimonialIdx + 1) % testimonials.length],
  ];

  // GitHub login handler
  const handleGithubLogin = () => {
    setLoading(true);
    const githubOAuthURL = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`;
    window.location.href = githubOAuthURL;
  };

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-[#E8ECEF] font-sans overflow-x-hidden">
      <ModernBG />

      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#0A0A0A]/80 backdrop-blur-lg border-b border-[#3A3A3A]/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <svg width="28" height="28" fill="none" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="16" fill="#00D4B8" />
              <path
                d="M10 17l4-4 4 4"
                stroke="#0A0A0A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 11v10"
                stroke="#0A0A0A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-xl font-bold text-white">DeployNow</span>
          </div>
          <a
            href="https://github.com/AyushPandey4/DeployNow"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-[#3A3A3A]/50 text-[#E8ECEF] rounded-lg hover:bg-[#5A5A5A] hover:text-[#00D4B8] transition-all duration-300 border border-[#00D4B8]/20"
          >
            <svg width="20" height="20" fill="currentColor">
              <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.93.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.75-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .98-.31 3.2 1.18a11.1 11.1 0 012.92-.39c.99.01 1.99.13 2.92.39 2.22-1.49 3.2-1.18 3.2-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.43-2.7 5.41-5.27 5.7.42.36.8 1.09.8 2.2 0 1.59-.01 2.87-.01 3.26 0 .31.21.67.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z" />
            </svg>
            <span className="text-sm font-medium">Star on GitHub</span>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-6 max-w-7xl mx-auto z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
              Launch Your Web Apps <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00D4B8] to-[#FF3E79]">
                in Seconds
              </span>
            </h1>
            <p className="text-[#E8ECEF] text-lg mb-8 max-w-lg mx-auto lg:mx-0">
              DeployNow empowers developers to ship modern web projects with
              speed, security, and simplicity. No complex setup, just results.
            </p>
            <button
              onClick={handleGithubLogin}
              disabled={loading}
              className="group relative inline-flex items-center gap-2 px-6 py-3 bg-[#00D4B8] text-[#0A0A0A] text-lg font-medium rounded-lg shadow-md hover:shadow-lg hover:bg-[#FF3E79] transition-all duration-300"
            >
              <span className="absolute inset-0 bg-white/20 rounded-lg opacity-0 group-hover:opacity-100 group-hover:animate-ripple"></span>
              <svg width="20" height="20" fill="currentColor">
                <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.93.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.75-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .98-.31 3.2 1.18a11.1 11.1 0 012.92-.39c.99.01 1.99.13 2.92.39 2.22-1.49 3.2-1.18 3.2-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.43-2.7 5.41-5.27 5.7.42.36.8 1.09.8 2.2 0 1.59-.01 2.87-.01 3.26 0 .31.21.67.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z" />
              </svg>
              Get Started with GitHub
            </button>
            <p className="mt-4 text-[#E8ECEF]/80 text-sm">
              Trusted by{" "}
              <span className="text-[#00D4B8] font-semibold">3000+</span>{" "}
              developers worldwide
            </p>
          </div>
          <div className="flex-1">
            <div className="relative w-full max-w-[420px] mx-auto rounded-xl overflow-hidden shadow-xl border border-[#3A3A3A]/50 bg-[#3A3A3A]/20 backdrop-blur-lg transform hover:scale-102 transition-all duration-500">
              <div className="absolute top-0 left-0 w-full h-6 bg-[#3A3A3A]/50 flex items-center px-3">
                <div className="w-2 h-2 rounded-full bg-[#FF3E79] mr-1"></div>
                <div className="w-2 h-2 rounded-full bg-[#00D4B8] mr-1"></div>
                <div className="w-2 h-2 rounded-full bg-[#22C55E]"></div>
                <span className="ml-auto text-xs text-[#E8ECEF]/60">
                  deploynow.io
                </span>
              </div>
              <div className="pt-8 px-5 pb-5">
                <div className="text-white font-semibold text-lg mb-3">
                  DeployNow Dashboard
                </div>
                <div className="flex gap-2 mb-3">
                  <div className="bg-[#22C55E] text-[#0A0A0A] px-2 py-1 rounded text-xs">
                    Live
                  </div>
                  <div className="bg-[#00D4B8] text-[#0A0A0A] px-2 py-1 rounded text-xs">
                    Preview
                  </div>
                </div>
                <div className="bg-[#3A3A3A]/30 rounded-lg p-3 text-xs text-[#E8ECEF]">
                  <span>
                    Project: <span className="font-semibold">my-app</span>
                  </span>
                  <br />
                  <span>
                    Status:{" "}
                    <span className="font-semibold text-[#22C55E]">
                      Deployed
                    </span>
                  </span>
                </div>
                <div className="mt-3 text-xs text-[#E8ECEF]/60">
                  Last deploy: 6s ago
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLI Section */}
      <section className="py-12 px-6 max-w-4xl mx-auto">
        <div className="bg-[#3A3A3A]/20 rounded-xl p-6 shadow-xl border border-[#3A3A3A]/50 backdrop-blur-lg">
          {cliLines.slice(0, cliIdx + 1).map((line, i) => (
            <div
              key={i}
              className={`text-[#22C55E] font-mono text-sm transition-opacity duration-500 ${
                i === cliIdx ? "opacity-100" : "opacity-70"
              }`}
            >
              {line}
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-12 text-center">
          Built for Modern Developers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className={`group relative p-6 rounded-xl bg-[#3A3A3A]/20 border border-[#3A3A3A]/50 shadow-md hover:shadow-lg hover:border-[#00D4B8]/50 transition-all duration-300 backdrop-blur-lg`}
            >
              <div
                className={`text-2xl mb-4 ${f.accent} w-10 h-10 flex items-center justify-center rounded-lg`}
              >
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {f.title}
              </h3>
              <p className="text-[#E8ECEF]/80 text-sm">{f.desc}</p>
              <div className="absolute inset-0 bg-gradient-to-br from-[#00D4B8]/10 to-[#FF3E79]/10 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-12 text-center">
          Deploy in 3 Simple Steps
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: (
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 4v16h16V4H4zm8 8v4m0-4l-4 4m4-4l4 4" />
                </svg>
              ),
              title: "Connect GitHub",
              desc: "Securely link your repository in one click.",
            },
            {
              icon: (
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 4v16m8-8H4" />
                </svg>
              ),
              title: "Deploy Instantly",
              desc: "Launch your app with a single command.",
            },
            {
              icon: (
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 17l4-4 4 4M12 3v10" />
                </svg>
              ),
              title: "Share Previews",
              desc: "Instantly share live previews with your team.",
            },
          ].map((step, i) => (
            <div
              key={i}
              className="p-6 bg-[#3A3A3A]/20 rounded-xl border border-[#3A3A3A]/50 shadow-md hover:shadow-lg hover:border-[#00D4B8]/50 transition-all duration-300 backdrop-blur-lg text-center"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-[#00D4B8]/20 text-[#00D4B8] rounded-lg mb-4 mx-auto">
                {step.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {step.title}
              </h3>
              <p className="text-[#E8ECEF]/80 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-12 text-center">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visibleTestimonials.map((t, i) => (
            <div
              key={i}
              className="p-6 bg-[#3A3A3A]/20 rounded-xl border border-[#3A3A3A]/50 shadow-md hover:shadow-lg hover:border-[#00D4B8]/50 transition-all duration-300 backdrop-blur-lg text-center"
            >
              <img
                src={t.avatar}
                alt={t.name}
                className="w-12 h-12 rounded-full mx-auto mb-4 border border-[#00D4B8]/50"
              />
              <p className="text-[#E8ECEF]/80 text-sm italic mb-2">
                "{t.text}"
              </p>
              <p className="text-white font-medium">{t.name}</p>
              <p className="text-[#E8ECEF]/60 text-xs">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
          Ready to Deploy?
        </h2>
        <p className="text-[#E8ECEF]/80 text-lg mb-8">
          Join thousands of developers and launch your next project with
          DeployNow.
        </p>
        <button
          onClick={handleGithubLogin}
          disabled={loading}
          className="group relative inline-flex items-center gap-2 px-6 py-3 bg-[#00D4B8] text-[#0A0A0A] text-lg font-medium rounded-lg shadow-md hover:shadow-lg hover:bg-[#FF3E79] transition-all duration-300"
        >
          <span className="absolute inset-0 bg-white/20 rounded-lg opacity-0 group-hover:opacity-100 group-hover:animate-ripple"></span>
          <svg width="20" height="20" fill="currentColor">
            <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.93.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.75-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .98-.31 3.2 1.18a11.1 11.1 0 012.92-.39c.99.01 1.99.13 2.92.39 2.22-1.49 3.2-1.18 3.2-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.43-2.7 5.41-5.27 5.7.42.36.8 1.09.8 2.2 0 1.59-.01 2.87-.01 3.26 0 .31.21.67.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z" />
          </svg>
          Start Deploying Now
        </button>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-[#0A0A0A] text-center border-t border-[#3A3A3A]/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-xl font-bold text-white">
              <svg width="24" height="24" fill="none" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="16" fill="#00D4B8" />
                <path
                  d="M10 17l4-4 4 4"
                  stroke="#0A0A0A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 11v10"
                  stroke="#0A0A0A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              DeployNow
            </div>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-[#E8ECEF]/80 hover:text-[#00D4B8] text-sm"
              >
                Docs
              </a>
              <a
                href="#"
                className="text-[#E8ECEF]/80 hover:text-[#00D4B8] text-sm"
              >
                Pricing
              </a>
              <a
                href="#"
                className="text-[#E8ECEF]/80 hover:text-[#00D4B8] text-sm"
              >
                Support
              </a>
              <a
                href="https://github.com/AyushPandey4/DeployNow"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E8ECEF]/80 hover:text-[#00D4B8] text-sm"
              >
                GitHub
              </a>
            </div>
            <p className="text-xs text-[#E8ECEF]/60">
              © {new Date().getFullYear()} DeployNow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Custom Styles */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");
        body {
          font-family: "Inter", sans-serif;
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
        .group:hover .group-hover\:animate-ripple {
          animation: ripple 0.5s ease-out;
        }
        @keyframes ripple {
          0% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.2;
            transform: scale(1.3);
          }
          100% {
            opacity: 0;
            transform: scale(1.6);
          }
        }
      `}</style>
    </div>
  );
}
