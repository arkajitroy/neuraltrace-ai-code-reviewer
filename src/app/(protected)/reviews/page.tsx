import { Metadata } from "next";
import ReviewPageContent from "@/_module/dashboard/pages/review-page-content";

export const metadata: Metadata = {
  title: "Reviews | NeuralTrace AI",
  description:
    "Manage and connect your GitHub repositories to NeuralTrace AI for intelligent code review and insights.",
};

export default function ReviewsPage() {
  return <ReviewPageContent />;
}
