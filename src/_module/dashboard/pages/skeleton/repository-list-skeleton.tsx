import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function RepositoryListSkeleton() {
  return (
    <Card className="border-muted/60 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-6">
        <div className="space-y-2">
          <CardTitle>Connected Repositories</CardTitle>
          <CardDescription>Manage your connected Github repositories</CardDescription>
        </div>
        <Skeleton className="h-9 w-28 rounded-md" />
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border border-muted p-4"
            >
              <div className="min-w-0 flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-48 rounded" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </div>
              </div>
              <Skeleton className="h-8 w-8 rounded-md ml-4" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
