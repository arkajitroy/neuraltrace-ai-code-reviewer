"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import { Lock, ShieldCheck } from "lucide-react";
import { IconGithub } from "@/assets/brand-icons/icon-github";
import { useSearchParams } from "next/navigation";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const handleGithubLogin = async () => {
    setIsLoading(true);
    try {
      await signIn.social({
        provider: "github",
        callbackURL: callbackUrl,
      });
    } catch (error) {
      console.error("Login error", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col pt-4">
      <button
        onClick={handleGithubLogin}
        disabled={isLoading}
        className="group relative w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-foreground text-background hover:bg-foreground/90 rounded-xl font-semibold transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden shadow-lg hover:shadow-xl dark:shadow-none hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin relative z-10" />
        ) : (
          <IconGithub className="w-5 h-5 relative z-10" />
        )}
        <span className="relative z-10 text-[15px]">
          {isLoading ? "Connecting to GitHub..." : "Continue with GitHub"}
        </span>
      </button>

      <div className="relative mt-8 mb-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/60"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wider">
          <span className="bg-background px-4 text-muted-foreground font-semibold flex items-center gap-1.5">
            <Lock className="w-3 h-3" />
            Secure Authentication
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 transition-all hover:bg-primary/10 hover:border-primary/30">
        <div className="flex gap-3.5 items-start">
          <div className="mt-0.5 rounded-lg p-1.5 bg-background shadow-sm ring-1 ring-border text-primary">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">Write Access Not Required</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We only request read access to analyze your repositories. Your source code remains perfectly secure and is
              never permanently stored on our servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
