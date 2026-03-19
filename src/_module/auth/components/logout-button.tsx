"use client";

import { useState } from "react";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Props = {
  title: string;
  icon?: React.ElementType;
  className?: string;
};

export default function LogoutButton({ title, icon: Icon, className }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    if (loading) return;

    setLoading(true);

    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.replace("/sign-in");
        },
      },
    });

    setLoading(false);
  };

  return (
    <Button onClick={handleLogout} disabled={loading} className={className} variant="ghost">
      {Icon && <Icon className="mr-2 h-4 w-4" />}
      {loading ? "Signing out..." : title}
    </Button>
  );
}
