"use client";

import ProfileSettingForm from "@/_module/settings/components/profile-setting-form";
import RepositoryList from "@/_module/settings/components/repositories-list";
import { Settings, ShieldCheck, Activity, Key } from "lucide-react";

export default function SettingPageContent() {
  return (
    <div className="space-y-10 max-w-6xl mx-auto w-full pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b pb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-linear-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
                Preferences
              </h1>
            </div>
          </div>
          <p className="text-muted-foreground md:text-lg max-w-2xl leading-relaxed">
            Manage your account settings, configure repository integrations, and personalize your
            NeuralTrace AI code review experience.
          </p>
        </div>

        {/* Quick Stats / Meta Info */}
        <div className="flex items-center gap-4 text-sm bg-muted/50 p-3 rounded-lg border">
          <div className="flex items-center gap-2 px-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="font-medium">Secure</span>
          </div>
          <div className="w-px h-8 bg-border"></div>
          <div className="flex items-center gap-2 px-2">
            <Activity className="w-4 h-4 text-primary" />
            <span className="font-medium">Active</span>
          </div>
        </div>
      </div>

      {/* Grid Layout for Settings */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 xl:gap-12">
        {/* Profile Details Section */}
        <div className="xl:col-span-1 space-y-4">
          <div className="sticky top-6">
            <h2 className="text-2xl font-semibold tracking-tight">Profile Details</h2>
            <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
              Update your personal information. This information will be used to identify your
              account across the NeuralTrace platform and in notification emails.
            </p>
            <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground bg-primary/5 border border-primary/10 p-4 rounded-xl">
              <Key className="w-5 h-5 text-primary shrink-0" />
              <p>
                Your email address is also used for important security alerts and repository
                analytics summaries.
              </p>
            </div>
          </div>
        </div>

        <div className="xl:col-span-2">
          <ProfileSettingForm />
        </div>

        <div className="col-span-1 xl:col-span-3">
          <hr className="border-border/50" />
        </div>

        {/* Repositories Section */}
        <div className="xl:col-span-1 space-y-4">
          <div className="sticky top-6">
            <h2 className="text-2xl font-semibold tracking-tight">Connected Integrations</h2>
            <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
              Manage your connected GitHub repositories. NeuralTrace automatically analyzes pull
              requests for these selected codebases.
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex justify-between items-center text-sm border-b pb-2">
                <span className="text-muted-foreground">Sync Status</span>
                <span className="font-medium text-emerald-500 flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Real-time
                </span>
              </div>
              <div className="flex justify-between items-center text-sm border-b pb-2">
                <span className="text-muted-foreground">Auto-Review</span>
                <span className="font-medium text-foreground">Enabled</span>
              </div>
            </div>
          </div>
        </div>

        <div className="xl:col-span-2">
          <RepositoryList />
        </div>
      </div>
    </div>
  );
}
