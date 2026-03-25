import DashboardPageContent from "@/_module/dashboard/pages/dashboard-page-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | NeuralTrace AI",
  description: "Dashboard for NeuralTrace AI",
};

export default function DashboardPage() {
  return <DashboardPageContent />;
}
