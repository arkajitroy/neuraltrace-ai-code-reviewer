"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserProfile, updateUserProfile } from "../server/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import ProfileSettingsSkeleton from "@/_module/dashboard/pages/skeleton/profile-settings-skeleton";

export default function ProfileSettingForm() {
  const queryClient = useQueryClient();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const { data: profile, isLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => await getUserProfile(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { name: string; email: string }) => {
      return await updateUserProfile(data);
    },
    onSuccess: (result) => {
      if (result?.success) {
        queryClient.invalidateQueries({ queryKey: ["user-profile"] });
        toast.success("Profile upadted successfully");
      }
    },
    onError: (error) => toast.error("Failed to update profile"),
  });

  const handleSubmit = (evt: React.FormEvent) => {
    evt.preventDefault();
    updateMutation.mutate({ name, email });
  };

  useEffect(() => {
    if (profile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(profile.name || "");
      setEmail(profile.email || "");
    }
  }, [profile]);

  if (isLoading) return <ProfileSettingsSkeleton />;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Profile Settings</CardTitle>
        <CardDescription className="text-sm">Update your profile information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Naam"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={updateMutation.isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={updateMutation.isPending}
            />
          </div>
          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
