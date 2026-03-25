"use client";

import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import {
  getDashboardStatistics,
  getMonthlyActivity,
  getRecentRepositories,
  getContributionInsights,
} from "../server/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GitBranch,
  GitCommit,
  GitPullRequest,
  Loader2,
  MessageSquare,
  FolderGit2,
  Star,
  Clock,
  ExternalLink,
  Code2,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ContributionGraph from "../components/visualizations/contribution-graph";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import ContributionStreak from "../components/visualizations/contribution-streak";
import { UrlObject } from "url";

export default function DashboardPageContent() {
  const { data: statistics, isLoading: isLoadingStatistics } = useQuery({
    queryKey: ["dashboard-statistics"],
    queryFn: async () => await getDashboardStatistics(),
  });

  const { data: insights, isLoading: isLoadingInsights } = useQuery({
    queryKey: ["contribution-insights"],
    queryFn: async () => await getContributionInsights(),
  });

  const { data: monthlyActivity, isLoading: isLoadingMonthlyActivity } = useQuery({
    queryKey: ["monthly-activity"],
    queryFn: async () => await getMonthlyActivity(),
  });

  const { data: recentRepos, isLoading: isLoadingRecentRepos } = useQuery({
    queryKey: ["recent-repositories"],
    queryFn: async () => await getRecentRepositories(),
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl">
            Overview of your coding activity and AI reviews
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Repositories</CardTitle>
            <GitBranch className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoadingStatistics ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : (
                statistics?.totalRepos || 0
              )}
            </div>
            <p className="text-muted-foreground text-xs">Connected Repos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commits</CardTitle>
            <GitCommit className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoadingStatistics ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : (
                statistics?.totalCommits || 0
              )}
            </div>
            <p className="text-muted-foreground text-xs">In the last year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pull Requests</CardTitle>
            <GitPullRequest className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoadingStatistics ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : (
                statistics?.totalPRs || 0
              )}
            </div>
            <p className="text-muted-foreground text-xs">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Reviews</CardTitle>
            <MessageSquare className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoadingStatistics ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : (
                statistics?.totalReviews || 0
              )}
            </div>
            <p className="text-muted-foreground text-xs">Generated reviews</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-5 flex flex-col h-full overflow-hidden shadow-sm">
          <CardHeader className="px-6 py-5 border-b shrink-0 bg-muted/10">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Code2 className="h-4 w-4 text-primary" />
              Contribution Activity
            </CardTitle>
            <CardDescription className="text-xs">
              Visualising your coding frequency and streak statistics over the last year
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 flex-1 flex flex-col gap-8 justify-between">
            <ContributionGraph />
            <ContributionStreak isLoadingInsights={isLoadingInsights} insights={insights!} />
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-2 flex flex-col h-full overflow-hidden">
          <CardHeader className="px-5 py-5 border-b shrink-0">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <FolderGit2 className="h-4 w-4 text-primary" />
              Recent Repositories
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0 flex-1 overflow-hidden">
            {isLoadingRecentRepos ? (
              <div className="flex h-full items-center justify-center">
                <Spinner />
              </div>
            ) : recentRepos?.length ? (
              <div className="flex flex-col h-full divide-y overflow-y-auto">
                {recentRepos.map((repo) => (
                  <Link
                    key={repo.id}
                    href={repo.html_url as unknown as UrlObject}
                    target="_blank"
                    className="group flex flex-col gap-2 px-6 py-4 hover:bg-muted/40 transition-colors"
                  >
                    {/* Top Row */}
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-semibold text-sm truncate group-hover:text-primary transition-colors flex-1 min-w-0">
                        {repo.name}
                      </span>
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </div>

                    {/* Description */}
                    {repo.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {repo.description}
                      </p>
                    )}

                    {/* Bottom Row */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      {repo.language && (
                        <div className="flex items-center gap-1.5 font-medium text-foreground/80">
                          <Code2 className="h-3.5 w-3.5 text-primary/70" />
                          <span>{repo.language}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5">
                        <Star className="h-3.5 w-3.5 text-yellow-500" />
                        <span>{repo.stargazers_count}</span>
                      </div>

                      <div className="flex items-center gap-1.5 opacity-80 ml-auto">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="whitespace-nowrap">
                          {formatDistanceToNow(new Date(repo.updated_at!), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                No recent repositories.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
            <CardDescription>
              Monthly breakdown of commits, PRs, and reviews (last 6 months)
            </CardDescription>
          </CardHeader>

          <CardContent>
            {isLoadingMonthlyActivity ? (
              <div className="flex h-80 w-full items-center justify-center">
                <Spinner />
              </div>
            ) : (
              <div className="h-80 w-full">
                <ResponsiveContainer width={"100%"} height={"100%"}>
                  <BarChart data={monthlyActivity || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--background)",
                        borderColor: "var(--border)",
                      }}
                      itemStyle={{ color: "var(--foreground)" }}
                    />
                    <Legend />
                    <Bar dataKey="commits" name="Commits" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="prs" name="Pull Requests" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="reviews" name="AI Reviews" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
