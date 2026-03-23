"use client";

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { sidebarData } from "../../constants/sidebar-data";
import { NavGroup } from "./navigation-group";
import NavUser from "./navigation-user";
import TeamSwitcher from "./team-switcher";

export default function DashboardSidebar() {
  return (
    <Sidebar collapsible={"icon"} variant={"inset"}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
