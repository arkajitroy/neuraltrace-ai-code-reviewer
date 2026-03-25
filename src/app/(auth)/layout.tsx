import { Metadata } from "next";
import { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Neuraltrace: AI Powered Code Analysis Platform",
  description: "Get detailed insights and intelligent reviews for your code with AI-powered analysis.",
};

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="relative min-h-screen bg-background text-foreground antialiased selection:bg-primary/30">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[32px_32px]"></div>
        {/* Glow effect */}
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-77.5 w-77.5 rounded-full bg-primary/20 opacity-30 blur-[100px] animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}
