"use client";

import { ActivityCalendar } from "react-activity-calendar";
import { useTheme } from "next-themes";
import { useQuery } from "@tanstack/react-query";
import { getContributionStats } from "../../server/actions";
import { Loader2 } from "lucide-react";

export default function ContributionGraph() {
  const { resolvedTheme } = useTheme();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["contribution-graph"],
    queryFn: getContributionStats,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="flex flex-1 min-h-[160px] items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/10 my-2">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-primary/60" />
          <p className="text-sm font-medium">Loading contribution graph...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-1 min-h-[160px] items-center justify-center rounded-xl border border-dashed border-destructive/40 bg-destructive/5 my-2">
        <p className="text-sm text-destructive font-medium flex items-center gap-2">
          Failed to load contribution data
        </p>
      </div>
    );
  }

  if (!data || !data.contributions?.length) {
    return (
      <div className="flex flex-1 min-h-[160px] items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/10 my-2">
        <p className="text-sm text-muted-foreground">No contribution data available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="text-lg font-bold text-foreground">
            {data.totalContributions}
          </span>{" "}
          contributions in the last year
        </p>
      </div>

      <div className="w-full overflow-x-auto pb-2">
        <div className="min-w-max px-1">
          <ActivityCalendar
            data={data.contributions}
            colorScheme={resolvedTheme === "dark" ? "dark" : "light"}
            blockMargin={4}
            blockSize={14}
            fontSize={12}
            showMonthLabels
            showWeekdayLabels={false}
          />
        </div>
      </div>
    </div>
  );
}
