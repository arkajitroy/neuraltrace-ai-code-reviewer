import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileSettingsSkeleton() {
  return (
    <Card className="border-muted/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Profile Settings</CardTitle>
        <CardDescription className="text-sm">Update your profile information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}
