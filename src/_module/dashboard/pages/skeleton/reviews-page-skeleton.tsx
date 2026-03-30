import React from "react";
import { Card } from "@/components/ui/card";

export default function ReviewsPageSkeleton() {
  return (
    <div className="flex flex-col gap-3 pt-2">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="overflow-hidden border-border/40 bg-background/50 backdrop-blur-sm shadow-sm">
          <div className="flex flex-col md:flex-row md:items-stretch relative p-5 gap-6">
            <div className="flex items-center gap-4 md:w-[35%] lg:w-[30%] shrink-0">
              <div className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-muted/80" />
              <div className="space-y-2.5 flex-1">
                <div className="h-4 w-3/4 animate-pulse rounded-md bg-muted/80" />
                <div className="h-3 w-1/2 animate-pulse rounded-md bg-muted/80" />
              </div>
            </div>
            <div className="flex-1 flex items-center shrink-0 min-w-0">
              <div className="h-12 w-full animate-pulse rounded-md bg-muted/40" />
            </div>
            <div className="flex items-center justify-between md:justify-end gap-6 md:w-[25%] lg:w-[20%] shrink-0">
              <div className="h-6 w-24 shrink-0 animate-pulse rounded-full bg-muted/80" />
              <div className="h-8 w-20 shrink-0 animate-pulse rounded-md bg-muted/80 hidden md:block" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
