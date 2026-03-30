import React from "react";

interface PageHeaderProps {
  title: string;
  description: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-linear-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-muted-foreground md:text-lg max-w-2xl leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
