"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// Simple animated particles background (CSS only)
const ParticlesBG = () => (
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
    <div className="animate-pulse absolute top-1/4 left-1/3 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"></div>
    <div className="animate-pulse absolute bottom-1/4 right-1/4 w-24 h-24 bg-indigo-400/30 rounded-full blur-2xl"></div>
    <div className="animate-pulse absolute top-2/3 right-1/2 w-16 h-16 bg-cyan-400/20 rounded-full blur-2xl"></div>
  </div>
);

export default function LandingPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // If user data exists in localStorage, redirect to dashboard
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
    "$ deploynow deploy myproject",
    "✔ Build completed",
    "✔ Uploaded to S3",
    "✔ Deployment live: https://project.deploynow.run",
  ];
  const [cliIdx, setCliIdx] = useState(0);
  useEffect(() => {
    if (cliIdx < cliLines.length - 1) {
      const timer = setTimeout(() => setCliIdx(cliIdx + 1), 1200);
      return () => clearTimeout(timer);
    }
  }, [cliIdx]);

  // Testimonials carousel
  const testimonials = [
    {
      name: "Alex J.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      text: "DeployNow made my side-project live in minutes!",
    },
    {
      name: "Priya S.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      text: "The dashboard is so clean and fast. Love the instant previews!",
    },
    {
      name: "Chris W.",
      avatar: "https://randomuser.me/api/portraits/men/65.jpg",
      text: "Zero config, zero headaches. Highly recommended.",
    },
  ];
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  useEffect(() => {
    const timer = setTimeout(
      () => setTestimonialIdx((testimonialIdx + 1) % testimonials.length),
      3500
    );
    return () => clearTimeout(timer);
  }, [testimonialIdx]);

  // GitHub login handler
  const handleGithubLogin = () => {
    setLoading(true);
    const githubOAuthURL = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`;
    window.location.href = githubOAuthURL;
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#181A3D] via-[#23255A] to-[#1B1F3A] text-gray-100 font-inter overflow-x-hidden">
      <ParticlesBG />

      {/* Sticky GitHub Star Button */}
      <a
        href="https://github.com/AyushPandey4/DeployNow"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-[#23255A] text-white px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform border border-white/10"
        style={{ backdropFilter: "blur(8px)" }}
      >
        <svg width="22" height="22" fill="currentColor" className="mr-1">
          <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.93.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.75-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .98-.31 3.2 1.18a11.1 11.1 0 012.92-.39c.99.01 1.99.13 2.92.39 2.22-1.49 3.2-1.18 3.2-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.43-2.7 5.41-5.27 5.7.42.36.8 1.09.8 2.2 0 1.59-.01 2.87-.01 3.26 0 .31.21.67.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z" />
        </svg>
        ⭐ Star us on GitHub
      </a>

      {/* Hero Section */}
      <section className="relative flex flex-col md:flex-row items-center justify-between px-8 py-24 max-w-7xl mx-auto z-10">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
            Deploy Sites in Seconds.
          </h1>
          <p className="text-white/80 text-xl md:text-2xl mb-8 font-medium">
            Zero-config deployments for modern web projects.
          </p>
          <button
            onClick={handleGithubLogin}
            disabled={loading}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#5D5FEF] to-[#8BA9FF] text-white text-xl font-bold rounded-full shadow-lg hover:scale-105 transition-transform focus:outline-none overflow-hidden"
            style={{ boxShadow: "0 4px 32px 0 #5D5FEF55" }}
          >
            <span className="absolute inset-0 group-hover:animate-ripple bg-white/10 rounded-full pointer-events-none"></span>
            <svg
              width="28"
              height="28"
              fill="currentColor"
              className="mr-2"
              viewBox="0 0 24 24"
            >
              <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.93.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.75-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .98-.31 3.2 1.18a11.1 11.1 0 012.92-.39c.99.01 1.99.13 2.92.39 2.22-1.49 3.2-1.18 3.2-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.43-2.7 5.41-5.27 5.7.42.36.8 1.09.8 2.2 0 1.59-.01 2.87-.01 3.26 0 .31.21.67.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z" />
            </svg>
            Sign in with GitHub
          </button>
          <p className="mt-6 text-white/70 text-base font-semibold">
            Trusted by <span className="font-bold text-[#8BA9FF]">1000+</span>{" "}
            developers.
          </p>
        </div>
        {/* Dashboard Screenshot + CLI Animation */}
        <div className="flex-1 flex flex-col items-center md:items-end mt-12 md:mt-0">
          <div
            className="relative w-[340px] h-[220px] md:w-[420px] md:h-[270px] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-br from-[#23255A] to-[#181A3D]"
            style={{
              transform: "rotate(-6deg) scale(1.04)",
              boxShadow: "0 0 32px 0 #5D5FEF55, 0 8px 32px 0 #23255A99",
            }}
          >
            {/* Fake dashboard screenshot */}
            <div className="absolute top-0 left-0 w-full h-8 bg-[#23255A] flex items-center px-4">
              <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="ml-auto text-xs text-white/40">
                deploynow.run
              </span>
            </div>
            <div className="pt-10 px-6 pb-6">
              <div className="text-white font-bold text-lg mb-2">
                DeployNow Dashboard
              </div>
              <div className="flex gap-2 mb-2">
                <div className="bg-[#5D5FEF] text-white px-2 py-1 rounded text-xs">
                  Live
                </div>
                <div className="bg-[#8BA9FF] text-white px-2 py-1 rounded text-xs">
                  Preview
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-2 text-xs text-white/80 mb-2">
                <span>
                  Project: <span className="font-semibold">myproject</span>
                </span>
                <br />
                <span>
                  Status:{" "}
                  <span className="font-semibold text-green-400">Deployed</span>
                </span>
              </div>
              <div className="mt-2 text-xs text-white/60">
                Last build: 12s ago
              </div>
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 pointer-events-none rounded-2xl border-2 border-[#5D5FEF]/30 blur-sm"></div>
          </div>
          {/* CLI Animation */}
          <div
            className="mt-6 w-[340px] md:w-[420px] bg-[#181A3D] rounded-lg shadow-lg px-6 py-4 text-green-400 font-mono text-sm border border-white/10"
            style={{
              boxShadow: "0 2px 16px 0 #5D5FEF33",
            }}
          >
            {cliLines.slice(0, cliIdx + 1).map((line, i) => (
              <div
                key={i}
                className={`fade-in-cli transition-opacity duration-500 ${
                  i === cliIdx ? "opacity-100" : "opacity-80"
                }`}
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-white text-center">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-br from-[#5D5FEF] to-[#8BA9FF] p-4 rounded-full mb-4 shadow-lg">
              <svg
                width="36"
                height="36"
                fill="none"
                stroke="white"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M4 4v16h16V4H4zm8 8v4m0-4l-4 4m4-4l4 4" />
              </svg>
            </div>
            <div className="text-lg font-semibold text-white mb-2">
              Connect your GitHub Repo
            </div>
            <div className="text-white/60 text-base">
              Authorize DeployNow to access your repositories securely.
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-br from-[#8BA9FF] to-[#5D5FEF] p-4 rounded-full mb-4 shadow-lg">
              <svg
                width="36"
                height="36"
                fill="none"
                stroke="white"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div className="text-lg font-semibold text-white mb-2">
              Deploy with 1 Click
            </div>
            <div className="text-white/60 text-base">
              Instantly build and ship your site with a single click.
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-br from-[#5D5FEF] to-[#8BA9FF] p-4 rounded-full mb-4 shadow-lg">
              <svg
                width="36"
                height="36"
                fill="none"
                stroke="white"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M8 17l4-4 4 4M12 3v10" />
              </svg>
            </div>
            <div className="text-lg font-semibold text-white mb-2">
              Get Instant Preview Links
            </div>
            <div className="text-white/60 text-base">
              Share live preview URLs with your team or clients.
            </div>
          </div>
        </div>
      </section>

      {/* Features Highlights */}
      <section className="py-16 px-6 bg-gradient-to-br from-[#23255A] to-[#181A3D]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10 text-white">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-2xl shadow-lg border border-white/10">
              <div className="text-3xl mb-4">🚀</div>
              <div className="text-xl font-semibold text-white mb-2">
                Blazing Fast Deployments
              </div>
              <div className="text-white/60">
                Your site goes live in seconds, not minutes.
              </div>
            </div>
            <div className="glass-card p-8 rounded-2xl shadow-lg border border-white/10">
              <div className="text-3xl mb-4">📈</div>
              <div className="text-xl font-semibold text-white mb-2">
                Auto-Scaling Built-in
              </div>
              <div className="text-white/60">
                Effortless scaling on AWS ECS, no config needed.
              </div>
            </div>
            <div className="glass-card p-8 rounded-2xl shadow-lg border border-white/10">
              <div className="text-3xl mb-4">💸</div>
              <div className="text-xl font-semibold text-white mb-2">
                Free Tier for Developers
              </div>
              <div className="text-white/60">
                No credit card required. Free for personal projects.
              </div>
            </div>
            <div className="glass-card p-8 rounded-2xl shadow-lg border border-white/10">
              <div className="text-3xl mb-4">🔒</div>
              <div className="text-xl font-semibold text-white mb-2">
                Secure AWS Infrastructure
              </div>
              <div className="text-white/60">
                Enterprise-grade security and reliability.
              </div>
            </div>
            <div className="glass-card p-8 rounded-2xl shadow-lg border border-white/10">
              <div className="text-3xl mb-4">📊</div>
              <div className="text-xl font-semibold text-white mb-2">
                Logs
              </div>
              <div className="text-white/60">
                Real-time build and deploy log.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-white text-center">
          What Developers Say
        </h2>
        <div className="relative flex items-center justify-center">
          <div className="w-full md:w-2/3 bg-gradient-to-br from-[#23255A] to-[#181A3D] rounded-2xl shadow-lg px-8 py-10 border border-white/10 flex flex-col items-center transition-all duration-700 fade-in-testimonial">
            <img
              src={testimonials[testimonialIdx].avatar}
              alt={testimonials[testimonialIdx].name}
              className="w-14 h-14 rounded-full mb-4 border-2 border-[#5D5FEF]"
            />
            <div className="text-lg text-white font-semibold mb-2">
              {testimonials[testimonialIdx].name}
            </div>
            <div className="text-white/80 text-base italic">
              “{testimonials[testimonialIdx].text}”
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#23255A] text-center text-white">
        <div className="mb-2 text-xl font-bold">DeployNow</div>
        <a
          href="https://github.com/AyushPandey4/DeployNow"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[#8BA9FF] hover:underline font-semibold"
        >
          <svg width="22" height="22" fill="currentColor">
            <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.93.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.75-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .98-.31 3.2 1.18a11.1 11.1 0 012.92-.39c.99.01 1.99.13 2.92.39 2.22-1.49 3.2-1.18 3.2-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.43-2.7 5.41-5.27 5.7.42.36.8 1.09.8 2.2 0 1.59-.01 2.87-.01 3.26 0 .31.21.67.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z" />
          </svg>
          GitHub Repo
        </a>
        <p className="text-sm mt-2 text-white/60">Crafted by Ayush Pandey.</p>
        <p className="text-xs mt-2 text-white/40">
          © {new Date().getFullYear()} DeployNow. All rights reserved.
        </p>
      </footer>

      {/* Animations CSS */}
      <style jsx global>
        {`
          .font-inter {
            font-family: "Inter", "Satoshi", "sans-serif";
          }
          .fade-in-cli {
            animation: fadeIn 0.7s;
          }
          .fade-in-testimonial {
            animation: fadeIn 1s;
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .glass-card {
            background: rgba(36, 38, 80, 0.6);
            backdrop-filter: blur(12px);
          }
          .group:hover .group-hover\\:animate-ripple {
            animation: ripple 0.5s linear;
          }
          @keyframes ripple {
            0% {
              opacity: 0.3;
              transform: scale(1);
            }
            50% {
              opacity: 0.2;
              transform: scale(1.2);
            }
            100% {
              opacity: 0;
              transform: scale(2);
            }
          }
        `}
      </style>
    </div>
  );
}
