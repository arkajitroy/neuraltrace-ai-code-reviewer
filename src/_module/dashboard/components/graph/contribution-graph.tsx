"use client";

import { ActivityCalendar } from "react-activity-calendar";
import { useTheme } from "next-themes";
import { useQuery } from "@tanstack/react-query";
import { getContributionStats } from "../../server/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContributionGraph() {
  const { resolvedTheme } = useTheme();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["contribution-graph"],
    queryFn: getContributionStats,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contribution Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-40 items-center justify-center">
            <p className="text-sm text-muted-foreground animate-pulse">Loading contributions...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contribution Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-40 items-center justify-center">
            <p className="text-sm text-destructive">Failed to load contribution data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.contributions?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contribution Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-40 items-center justify-center">
            <p className="text-sm text-muted-foreground">No contribution data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Contribution Activity</CardTitle>

        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{data.totalContributions}</span> contributions in the last
          year
        </p>
      </CardHeader>

      <CardContent>
        <div className="w-full overflow-x-auto">
          <div className="min-w-full px-2">
            <ActivityCalendar
              data={data.contributions}
              colorScheme={resolvedTheme === "dark" ? "dark" : "light"}
              blockMargin={3}
              blockSize={12}
              fontSize={12}
              showMonthLabels
              showWeekdayLabels={false}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
