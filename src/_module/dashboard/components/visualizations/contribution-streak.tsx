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
  const statCards = [
    {
      label: "Current Streak",
      icon: Flame,
      iconColor: "text-orange-500",
      bgClass: "bg-orange-500/10",
      value: insights?.currentStreak,
      suffix: "days",
    },
    {
      label: "Longest Streak",
      icon: Trophy,
      iconColor: "text-amber-500",
      bgClass: "bg-amber-500/10",
      value: insights?.longestStreak,
      suffix: "days",
    },
    {
      label: "Max in a Day",
      icon: Zap,
      iconColor: "text-blue-500",
      bgClass: "bg-blue-500/10",
      value: insights?.maxContributionsInADay,
      suffix: "",
    },
    {
      label: "Busiest Day",
      icon: CalendarDays,
      iconColor: "text-purple-500",
      bgClass: "bg-purple-500/10",
      value: insights?.mostActiveDay || "None",
      suffix: "",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-auto">
      {statCards.map((stat, i) => (
        <div
          key={i}
          className="group relative overflow-hidden flex flex-col gap-2 rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:border-primary/20"
        >
          <div className="flex items-center gap-2 mb-1">
            <div className={`p-1.5 rounded-md ${stat.bgClass}`}>
              <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
              {stat.label}
            </span>
          </div>
          
          <div className="mt-auto">
            {isLoadingInsights ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground/60" />
            ) : (
              <div className="flex items-baseline gap-1.5 truncate">
                <span className="text-2xl font-bold tracking-tight">
                  {stat.value || 0}
                </span>
                {stat.suffix && (
                  <span className="text-xs text-muted-foreground font-medium">
                    {stat.suffix}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
