import {
  BrainCircuit,
  Settings,
  UserCog,
  Bell,
  Palette,
  LayoutDashboard,
  GitPullRequest,
  Bot,
  Box,
  LifeBuoy,
  FileCode2,
  Users,
  Terminal,
} from "lucide-react";
import { SidebarData } from "../types";

export const sidebarData: SidebarData = {
  user: {
    name: "Arkajit Roy",
    email: "admin@neuraltrace.ai",
    avatar: "/avatar.jpg",
  },
  teams: [
    {
      name: "Neuraltrace",
      logo: BrainCircuit,
      plan: "Enterprise",
    },
    {
      name: "Personal",
      logo: Box,
      plan: "Free",
    },
  ],
  navGroups: [
    {
      title: "Workspace",
      items: [
        {
          title: "Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Repositories",
          href: "/repositories",
          icon: Box,
        },
        {
          title: "Pull Requests",
          href: "/pull-requests",
          badge: "12",
          icon: GitPullRequest,
        },
        {
          title: "Code Reviews",
          href: "/reviews",
          icon: FileCode2,
        },
        {
          title: "AI Analysis",
          href: "/analysis",
          icon: Bot,
        },
      ],
    },
    {
      title: "Organization",
      items: [
        {
          title: "Members",
          href: "/members",
          icon: Users,
        },
        {
          title: "Audit Logs",
          href: "/audit-logs",
          icon: Terminal,
        },
      ],
    },
    {
      title: "Preferences",
      items: [
        {
          title: "Settings",
          href: "/settings",
          icon: Settings,
        },
        {
          title: "Support",
          href: "/support",
          icon: LifeBuoy,
        },
      ],
    },
  ],
};
