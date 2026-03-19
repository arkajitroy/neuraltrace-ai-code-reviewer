"use client";

import { Github, BookOpen, Settings, Moon, Sun, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LogoutButton from "@/_module/auth/components/logout-button";

type NavItem = {
  title: string;
  url: string;
  icon: React.ElementType;
};

const NAV_ITEMS: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: BookOpen },
  { title: "Repository", url: "/dashboard/repository", icon: Github },
  { title: "Reviews", url: "/dashboard/reviews", icon: BookOpen },
  { title: "Subscription", url: "/dashboard/subscription", icon: BookOpen },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { value: sessionState } = useSession;

  if (sessionState && sessionState.data?.session) return null;

  const user = sessionState?.data?.user;

  const isActive = (url: string) => pathname === url || pathname.startsWith(`${url}/`);

  const userName = user?.name ?? "Guest";
  const userEmail = user?.email ?? "";
  const userAvatar = user?.image ?? "";

  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Sidebar>
      {/* HEADER */}
      <SidebarHeader className="border-b px-3 py-5">
        <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/50 px-3 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Github className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/60">
              Connected Account
            </p>
            <p className="truncate text-sm font-medium">@{userName}</p>
          </div>
        </div>
      </SidebarHeader>

      {/* NAVIGATION */}
      <SidebarContent className="px-3 py-5">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-sidebar-foreground/60">Menu</p>

        <SidebarMenu className="gap-1">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.url);

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={`h-11 rounded-lg px-4 transition ${
                    active
                      ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/60"
                  }`}
                >
                  <Link href={item.url} className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span className="text-sm">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter className="border-t px-3 py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="h-12 rounded-lg px-3 hover:bg-sidebar-accent/50">
              <Avatar className="h-9 w-9 rounded-lg">
                <AvatarImage src={userAvatar} />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>

              <div className="ml-2 text-left">
                <p className="truncate text-sm font-semibold">{userName}</p>
                <p className="truncate text-xs text-sidebar-foreground/70">{userEmail}</p>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" side="right" className="w-64 rounded-lg">
            {/* THEME TOGGLE */}
            <DropdownMenuItem
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="cursor-pointer gap-3"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="h-4 w-4" />
                  Light mode
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4" />
                  Dark mode
                </>
              )}
            </DropdownMenuItem>

            {/* LOGOUT */}
            <DropdownMenuItem asChild>
              <LogoutButton
                title="Sign out"
                icon={LogOut}
                className="w-full justify-start text-red-600 hover:bg-red-500/10"
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
