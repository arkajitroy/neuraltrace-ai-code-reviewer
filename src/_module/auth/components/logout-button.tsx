"use client";

import { HTMLAttributes, useState } from "react";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LogoutButtonProps {
  title: string;
  className?: HTMLAttributes<HTMLSpanElement>["className"];
}

export default function LogoutButton({ title, className }: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleLogout = () => {
    setIsLoading(true);
    return signOut({
      fetchOptions: {
        onSuccess: () => {
          setIsLoading(false);
          router.replace("/sign-in");
        },
      },
    });
  };

  return (
    <Button disabled={isLoading} className={cn(className, "cursor-pointer")} onClick={handleLogout}>
      {title}
    </Button>
  );
}
