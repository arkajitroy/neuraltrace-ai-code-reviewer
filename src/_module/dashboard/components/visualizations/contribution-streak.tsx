import React from "react";
import { CalendarDays, Flame, Loader2, Trophy, Zap } from "lucide-react";

interface ContributionStreak {
  currentStreak: number;
  longestStreak: number;
  maxContributionsInADay: number;
  mostActiveDay: string;
}

interface ContributionStreakProps {
  isLoadingInsights: boolean;
  insights: ContributionStreak;
}

export default function ContributionStreak({
  isLoadingInsights,
  insights,
}: ContributionStreakProps) {
  return (
    <div className="grid grid-cols-2 h-24 md:grid-cols-4 gap-4 mt-auto border-border/50">
      <div className="flex flex-col gap-1.5 rounded-lg border bg-card p-3 shadow-sm hover:border-primary/20 transition-colors">
        <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
          <Flame className="h-4 w-4 text-orange-500" />
          Current Streak
        </span>
        <span className="font-semibold text-lg">
          {isLoadingInsights ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            `${insights?.currentStreak || 0} days`
          )}
        </span>
      </div>
      <div className="flex flex-col gap-1.5 rounded-lg border bg-card p-3 shadow-sm hover:border-primary/20 transition-colors">
        <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
          <Trophy className="h-4 w-4 text-yellow-500" />
          Longest Streak
        </span>
        <span className="font-semibold text-lg">
          {isLoadingInsights ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            `${insights?.longestStreak || 0} days`
          )}
        </span>
      </div>
      <div className="flex flex-col gap-1.5 rounded-lg border bg-card p-3 shadow-sm hover:border-primary/20 transition-colors">
        <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
          <Zap className="h-4 w-4 text-blue-500" />
          Max in a Day
        </span>
        <span className="font-semibold text-lg">
          {isLoadingInsights ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            insights?.maxContributionsInADay || 0
          )}
        </span>
      </div>
      <div className="flex flex-col gap-1.5 rounded-lg border bg-card p-3 shadow-sm hover:border-primary/20 transition-colors">
        <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
          <CalendarDays className="h-4 w-4 text-purple-500" />
          Busiest Day
        </span>
        <span className="font-semibold text-lg">
          {isLoadingInsights ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            insights?.mostActiveDay || "None"
          )}
        </span>
      </div>
    </div>
  );
}
