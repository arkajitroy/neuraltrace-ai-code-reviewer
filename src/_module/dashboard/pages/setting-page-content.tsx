"use client";

export default function SettingPageContent() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl">
            User settings page for customizing the user preferences
          </p>
        </div>
      </div>
    </div>
  );
}
