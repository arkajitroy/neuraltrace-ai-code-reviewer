import React from "react";
import { DashboardHeaderLayout } from "./dashboard-header-layout";
import { DashboardTopNavbar } from "./dashboard-top-navbar";
import { TOP_NAVBAR_OPTIONS } from "../../constants/repository";
import { ThemeToggle } from "@/components/custom/theme-toggle";

export default function DashboardHeader() {
  return (
    <DashboardHeaderLayout>
      <DashboardTopNavbar links={TOP_NAVBAR_OPTIONS} />
      <div className="ms-auto flex items-center space-x-4">
        {/* <Search /> */}
        <ThemeToggle />
        {/* <ConfigDrawer /> */}
        {/* <ProfileDropdown /> */}
      </div>
    </DashboardHeaderLayout>
  );
}
