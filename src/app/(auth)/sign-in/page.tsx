import { Suspense } from "react";
import { AuthInfoCard } from "@/_module/auth/components/auth-info-card";
import SignInForm from "@/_module/auth/components/login-form";

export default function SignInPage() {
  return (
    <div className="flex flex-col min-h-screen relative w-full">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 relative h-full min-h-screen z-10">
        {/* Left side - Sign In Form */}
        <div className="flex flex-col items-center justify-center px-6 py-12 lg:px-16 xl:px-24 order-2 lg:order-1 relative bg-background/50 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none">
          <div className="absolute top-8 left-8 flex items-center gap-3">
            {/* Logo */}
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20 ring-1 ring-primary/20">
              <span className="font-bold text-primary-foreground text-xl">N</span>
            </div>
            <span className="font-bold text-foreground text-2xl tracking-tight">NeuralTrace</span>
          </div>

          <div className="w-full max-w-sm space-y-10 mt-16 lg:mt-0">
            <div className="space-y-3 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">Welcome back</h1>
              <p className="text-muted-foreground text-[15px] leading-relaxed">
                Log in to securely access your AI-powered code analysis and repository insights.
              </p>
            </div>

            <Suspense fallback={<div className="w-full h-12 rounded-xl bg-muted/20 animate-pulse" />}>
              <SignInForm />
            </Suspense>

            <p className="text-sm text-center text-muted-foreground/80 pt-6">
              By clicking continue, you agree to our{" "}
              <a href="#" className="font-medium underline underline-offset-4 hover:text-primary transition-colors">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="font-medium underline underline-offset-4 hover:text-primary transition-colors">
                Privacy
              </a>
              .
            </p>
          </div>
        </div>

        {/* Right side - Info Card (hidden on mobile) */}
        <div className="order-1 lg:order-2">
          <AuthInfoCard />
        </div>
      </div>
    </div>
  );
}
