import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfileSettingsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>Update your profile information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="animate-pulse space-y-4">
          <div className="bg-muted h-10"></div>
          <div className="bg-muted h-10"></div>
        </div>
      </CardContent>
    </Card>
  );
}
