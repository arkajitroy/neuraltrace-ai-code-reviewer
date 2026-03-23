"use client";

import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import { getDashboardStatistics, getMonthlyActivity } from "../server/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GitBranch, GitCommit, GitPullRequest, Loader2, MessageSquare } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ContributionGraph from "../components/graph/contribution-graph";

export default function MainDashboardPage() {
  const { data: statistics, isLoading: isLoadingStatistics } = useQuery({
    queryKey: ["dashboard-statistics"],
    queryFn: async () => await getDashboardStatistics(),
  });

  const { data: monthlyActivity, isLoading: isLoadingMonthlyActivity } = useQuery({
    queryKey: ["monthly-activity"],
    queryFn: async () => await getMonthlyActivity(),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your coding activity and AI reviews</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Repositories</CardTitle>
            <GitBranch className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoadingStatistics ? <Loader2 className="h-8 w-8 animate-spin" /> : statistics?.totalRepos || 0}
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
              {isLoadingStatistics ? <Loader2 className="h-8 w-8 animate-spin" /> : statistics?.totalCommits || 0}
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
              {isLoadingStatistics ? <Loader2 className="h-8 w-8 animate-spin" /> : statistics?.totalPRs || 0}
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
              {isLoadingStatistics ? <Loader2 className="h-8 w-8 animate-spin" /> : statistics?.totalReviews || 0}
            </div>
            <p className="text-muted-foreground text-xs">Generated reviews</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contribution Activity</CardTitle>
          <CardDescription>Visualising your coding frequency over the last year</CardDescription>
        </CardHeader>
        <CardContent>
          <ContributionGraph />
        </CardContent>
      </Card>

      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
            <CardDescription>Monthly breakdown of commits, PRs, and reviews (last 6 months)</CardDescription>
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
