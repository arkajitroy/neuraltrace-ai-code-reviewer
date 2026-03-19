"use client";

import { GitBranch, Sparkles, ShieldAlert } from "lucide-react";

export function AuthInfoCard() {
  const features = [
    {
      icon: Sparkles,
      title: "Context-Aware Analysis",
      description: "AI that truly understands your entire codebase context to provide highly accurate suggestions.",
    },
    {
      icon: GitBranch,
      title: "Automated PR Reviews",
      description: "Connect GitHub repositories to instantly get automatic inline code reviews before merging.",
    },
    {
      icon: ShieldAlert,
      title: "Security & Bug Detection",
      description: "Catch potential vulnerabilities, logic errors, and performance bottlenecks proactively.",
    },
  ];

  return (
    <div className="hidden lg:flex relative flex-col justify-between h-full bg-zinc-950 dark:bg-[#09090b] overflow-hidden border-l border-border/50 shadow-2xl">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent opacity-100 z-0"></div>
      <div
        className="absolute -left-[40%] text-[800px] text-zinc-900/40 select-none z-0 rotate-12 top-[-20%] pointer-events-none stroke-1 origin-center"
        style={{ fontFamily: "monospace", fontWeight: 900 }}
      >
        {`{}`}
      </div>

      <div className="relative z-10 flex flex-col h-full p-12 xl:p-16">
        <div className="flex-1 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary mb-8 backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <span className="text-[11px] font-bold tracking-widest uppercase">System Online</span>
          </div>

          <h2 className="text-4xl xl:text-[3.25rem] font-bold text-white mb-6 leading-[1.1] tracking-tight text-balance">
            Elevate your{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-primary/60">codebase</span> to
            the next level.
          </h2>
          <p className="text-lg text-zinc-400 leading-relaxed">
            Join thousands of modern engineering teams using NeuralTrace to write cleaner, more secure, and highly
            optimized code with the power of AI.
          </p>

          <div className="mt-14 space-y-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex gap-5 items-start group">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/10 transition-all duration-300 shadow-xl group-hover:scale-110">
                    <Icon className="w-5 h-5 text-zinc-100 group-hover:text-primary transition-colors duration-300" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-[1.05rem] font-semibold text-zinc-100 group-hover:text-white transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-[15px] text-zinc-400 leading-relaxed font-light">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Floating Code Snippet Card */}
        {/* <div className="mt-auto pt-16 relative w-full max-w-xl mx-auto">
          <div className="absolute -left-4 -right-4 -bottom-4 h-32 bg-gradient-to-t from-zinc-950 to-transparent z-10 pointer-events-none"></div>
          
          <div className="relative z-0 p-6 rounded-2xl bg-black/60 border border-zinc-800/80 backdrop-blur-2xl shadow-2xl hover:border-zinc-700 transition-colors">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
              </div>
              <div className="ml-2 text-[11px] font-mono font-medium tracking-wide text-zinc-500 uppercase">analyze_pr.ts</div>
            </div>
            <div className="font-mono text-[13px] leading-relaxed space-y-2">
              <div className="flex">
                <span className="text-zinc-600 mr-4 select-none">1</span>
                <span className="text-zinc-300"><span className="text-[#ff7b72]">import</span> {`{ analyze }`} <span className="text-[#ff7b72]">from</span> <span className="text-[#a5d6ff]">'@neuraltrace/core'</span>;</span>
              </div>
              <div className="flex">
                <span className="text-zinc-600 mr-4 select-none">2</span>
                <span className="text-zinc-500 italic">// AI analyzing Pull Request #142...</span>
              </div>
              <div className="flex">
                <span className="text-zinc-600 mr-4 select-none">3</span>
                <span className="text-zinc-300"><span className="text-[#ff7b72]">const</span> result = <span className="text-[#ff7b72]">await</span> <span className="text-[#d2a8ff]">analyze</span>(codebase);</span>
              </div>
              <div className="flex items-center mt-3 pt-3 border-t border-zinc-800/50 text-xs">
                <span className="flex items-center text-[#3fb950] font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Approved: 0 vulnerabilities found
                </span>
                <span className="font-sans ml-auto text-zinc-500 font-medium">12ms response</span>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
