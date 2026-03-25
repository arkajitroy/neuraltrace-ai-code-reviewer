import RepositoriesPageContent from "@/_module/dashboard/pages/repositories-page-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Repositories | NeuralTrace AI",
  description: "Manage and connect your GitHub repositories to NeuralTrace AI for intelligent code review and insights.",
};

export default function RepositoriesPage() {
  return <RepositoriesPageContent />;
}
