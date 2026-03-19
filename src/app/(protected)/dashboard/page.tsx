import LogoutButton from "@/_module/auth/components/logout-button";
import { ThemeToggle } from "@/components/custom/theme-toggle";

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard Page</h1>
      <LogoutButton title="Logout" />
      <ThemeToggle />
    </div>
  );
}
