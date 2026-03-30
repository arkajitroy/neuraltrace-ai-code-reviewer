"use client";

import { getReviews } from "@/_module/reviews/server/actions";
import PageHeader from "@/components/custom/page-header";
import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle2,
  XCircle,
  GitPullRequest,
  Calendar,
  ChevronRight,
  Code2,
  AlertCircle,
  Clock,
  MessageSquare,
} from "lucide-react";
import ReviewsPageSkeleton from "./skeleton/reviews-page-skeleton";
import { Card, CardHeader, CardTitle, CardFooter, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { IconGithub } from "@/assets/brand-icons";

export default function ReviewPageContent() {
  const {
    data: reviews,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const response = await getReviews();
      return response;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Reviews"
          description="View, manage, and seamlessly review your code repositories with AI-powered insights and feedback"
        />
        <ReviewsPageSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Reviews"
          description="View, manage, and seamlessly review your code repositories with AI-powered insights and feedback"
        />
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="flex h-64 w-full flex-col items-center justify-center gap-4 text-destructive">
            <AlertCircle className="h-10 w-10 opacity-80" />
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-lg">Failed to load reviews</h3>
              <p className="text-sm opacity-80">Please try refreshing the page or check your connection.</p>
            </div>
            <Button
              variant="outline"
              className="mt-2 border-destructive/20 hover:bg-destructive/10"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <PageHeader
        title="Reviews"
        description="View, manage, and seamlessly review your code repositories with AI-powered insights and feedback"
      />

      {reviews?.length === 0 ? (
        <Card className="border-dashed bg-muted/10">
          <CardContent className="flex h-[400px] w-full flex-col items-center justify-center gap-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 ring-8 ring-primary/5">
              <Code2 className="h-10 w-10 text-primary" />
            </div>
            <div className="flex flex-col items-center gap-3">
              <h3 className="text-2xl font-semibold tracking-tight">No reviews yet</h3>
              <div className="text-center text-sm text-muted-foreground flex items-center max-w-100 leading-relaxed">
                <Shimmer className="text-base" duration={3}>
                  Connect a repository and submit a pull request to unlock powerful, AI-driven code reviews tailored to
                  your context.
                </Shimmer>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3 pt-2">
          {reviews?.map((review) => (
            <Card
              key={review.id}
              className="group relative flex flex-col overflow-hidden border-border/40 bg-background/50 backdrop-blur-sm transition-all duration-500 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 cursor-pointer"
            >
              <div className="absolute inset-0 bg-linear-to-r from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

              <CardHeader className="flex flex-row items-start justify-between px-6 pt-6 pb-2 relative z-10 w-full space-y-0">
                <div className="flex items-center gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border bg-linear-to-b from-background to-muted shadow-sm group-hover:scale-110 transition-transform duration-300 ease-in-out">
                    <IconGithub className="h-6 w-6 text-foreground/80 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <CardTitle
                      className="text-lg font-bold tracking-tight mb-1.5 transition-colors group-hover:text-primary"
                      title={review.repository.name}
                    >
                      {review.repository.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-3 text-sm text-muted-foreground/90">
                      <span className="flex items-center gap-1.5 font-medium px-2.5 py-0.5 bg-muted/60 rounded-md">
                        <GitPullRequest className="h-3.5 w-3.5 text-primary/70" />
                        PR #{review.pullRequestNumber}
                      </span>
                      <span className="flex items-center gap-1.5 font-medium">
                        <Calendar className="h-3.5 w-3.5" />
                        <time dateTime={new Date(review.createdAt).toISOString()}>
                          {new Date(review.createdAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </time>
                      </span>
                    </CardDescription>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-end gap-2">
                  {review.status === "completed" && (
                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20 shadow-sm transition-transform group-hover:scale-[1.02]">
                      <CheckCircle2 className="mr-1.5 h-4 w-4" />
                      Completed
                    </span>
                  )}
                  {review.status === "pending" && (
                    <span className="inline-flex items-center rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 ring-1 ring-inset ring-amber-500/20 shadow-sm transition-transform group-hover:scale-[1.02]">
                      <Clock className="mr-1.5 h-4 w-4 animate-pulse" />
                      Pending
                    </span>
                  )}
                  {review.status === "failed" && (
                    <span className="inline-flex items-center rounded-full bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive ring-1 ring-inset ring-destructive/20 shadow-sm transition-transform group-hover:scale-[1.02]">
                      <XCircle className="mr-1.5 h-4 w-4" />
                      Failed
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="px-6 py-4 relative z-10 w-full">
                <div className="w-full relative rounded-lg bg-muted/20 px-5 pt-5 pb-4 transition-all duration-300 group-hover:bg-muted/40 border border-border/30 shadow-inner">
                  <div className="absolute -top-3 left-5 flex h-8 w-8 items-center justify-center rounded-full border border-border/50 bg-background shadow-xs transition-transform duration-300 group-hover:-translate-y-1">
                    <MessageSquare className="h-4 w-4 text-primary/70" />
                  </div>
                  <div
                    className="prose prose-sm dark:prose-invert line-clamp-3 max-w-none text-muted-foreground/90 text-[14.5px] leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 focus:outline-none"
                    dangerouslySetInnerHTML={{
                      __html:
                        review.review ||
                        "<span class='italic opacity-50 flex items-center gap-2 h-full'>Analyzing code... Summary is pending.</span>",
                    }}
                  />
                </div>
              </CardContent>

              <CardFooter className="px-6 pb-6 pt-2 relative z-10 flex flex-wrap items-center justify-end gap-3 border-t-0 w-full mt-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="group/github transition-all duration-300 hover:bg-muted"
                  asChild
                >
                  <a
                    href={`https://www.github.com/${review.repository.owner}/${review.repository.name}/pull/${review.pullRequestNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconGithub className="mr-2 h-4 w-4 text-foreground/80 group-hover/github:text-foreground" />
                    View on GitHub
                  </a>
                </Button>

                <Button size="sm" className="group/btn transition-all duration-300 shadow-sm hover:shadow-md" asChild>
                  <a href={`/dashboard/reviews/${review.id}`}>
                    <span className="font-medium">Full Analysis</span>
                    <ChevronRight className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
