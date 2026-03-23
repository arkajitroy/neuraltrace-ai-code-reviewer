"use server";

import { getUserContribution } from "@/_module/repository/lib/github";
import { DEFAULT_MONTH_LIST, DEFAULT_REPOSITORY_COUNT, DEFAULT_REVIEW_COUNT } from "../constants/repository";
import { getGithubContext } from "@/_module/repository/utils";

export async function getDashboardStatistics() {
  try {
    const { octokit, user } = await getGithubContext();

    const [{ data: prs }, calendar] = await Promise.all([
      octokit.rest.search.issuesAndPullRequests({
        q: `author:${user.login} type:pr`,
        per_page: 1,
      }),
      getUserContribution(user.login),
    ]);

    return {
      totalCommits: calendar.totalContributions,
      totalPRs: prs.total_count,
      totalReviews: DEFAULT_REVIEW_COUNT,
      totalRepos: DEFAULT_REPOSITORY_COUNT,
    };
  } catch (error) {
    console.error("getDashboardStats failed:", error);

    return {
      totalCommits: 0,
      totalPRs: 0,
      totalReviews: 0,
      totalRepos: 0,
    };
  }
}

export async function getMonthlyActivity() {
  try {
    const { octokit, user } = await getGithubContext();
    const calendar = await getUserContribution(user.login);

    const monthlyData: Record<string, { commits: number; prs: number; reviews: number }> = {};

    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = DEFAULT_MONTH_LIST[date.getMonth()];

      monthlyData[key] = { commits: 0, prs: 0, reviews: 0 };
    }

    // ✅ commits
    calendar.weeks.forEach((week) => {
      week.contributionDays.forEach((day) => {
        const date = new Date(day.date);
        const key = DEFAULT_MONTH_LIST[date.getMonth()];

        if (monthlyData[key]) {
          monthlyData[key].commits += day.contributionCount;
        }
      });
    });

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // ✅ PRs
    const { data: prs } = await octokit.rest.search.issuesAndPullRequests({
      q: `author:${user.login} type:pr created:>${sixMonthsAgo.toISOString().split("T")[0]}`,
      per_page: 100,
    });

    prs.items.forEach((pr) => {
      const key = DEFAULT_MONTH_LIST[new Date(pr.created_at).getMonth()];

      if (monthlyData[key]) {
        monthlyData[key].prs += 1;
      }
    });

    // ⚠️ still mocked reviews (fine for now)
    const reviews = Array.from({ length: DEFAULT_REVIEW_COUNT });

    reviews.forEach(() => {
      const randomMonth = Math.floor(Math.random() * 6);
      const key = DEFAULT_MONTH_LIST[(now.getMonth() - randomMonth + 12) % 12];

      if (monthlyData[key]) {
        monthlyData[key].reviews += 1;
      }
    });

    return Object.entries(monthlyData).map(([name, value]) => ({
      name,
      ...value,
    }));
  } catch (error) {
    console.error("getMonthlyActivity failed:", error);
    return [];
  }
}

export async function getContributionStats() {
  try {
    const { user } = await getGithubContext();
    const calendar = await getUserContribution(user.login);

    const contributions = calendar.weeks.flatMap((week) =>
      week.contributionDays.map((day) => ({
        date: day.date,
        count: day.contributionCount,
        level: Math.min(4, Math.floor(day.contributionCount / 3)),
      })),
    );

    return {
      contributions,
      totalContributions: calendar.totalContributions,
    };
  } catch (error) {
    console.error("getContributionStats failed:", error);
    return null;
  }
}

export async function getRecentRepositories() {
  try {
    const { octokit, user } = await getGithubContext();

    const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
      sort: "updated",
      per_page: 4,
      direction: "desc",
    });

    return repos.map((repo) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      updated_at: repo.updated_at,
      pushed_at: repo.pushed_at,
      html_url: repo.html_url,
      visibility: repo.visibility,
    }));
  } catch (error) {
    console.error("getRecentRepositories failed:", error);
    return [];
  }
}

export async function getContributionInsights() {
  try {
    const { user } = await getGithubContext();
    const calendar = await getUserContribution(user.login);

    const days = calendar.weeks.flatMap((w) => w.contributionDays);
    
    let currentStreak = 0;
    let longestStreak = 0;
    let maxContributionsInADay = 0;
    const weekdayCounts = new Array(7).fill(0);
    
    let tempStreak = 0;

    for (const day of days) {
      if (day.contributionCount > 0) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
        maxContributionsInADay = Math.max(maxContributionsInADay, day.contributionCount);
        
        const date = new Date(day.date);
        weekdayCounts[date.getDay()] += day.contributionCount;
      } else {
        tempStreak = 0;
      }
    }
    
    let current = 0;
    for (let i = days.length - 1; i >= 0; i--) {
        if (days[i].contributionCount > 0) {
            current++;
        } else if (i !== days.length - 1) { 
            break;
        }
    }
    currentStreak = current;

    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const maxDayIndex = weekdayCounts.indexOf(Math.max(...weekdayCounts));
    const mostActiveDay = Math.max(...weekdayCounts) > 0 ? weekdays[maxDayIndex] : "None";

    return {
      longestStreak,
      currentStreak,
      maxContributionsInADay,
      mostActiveDay,
    };
  } catch (error) {
    console.error("getContributionInsights failed:", error);
    return { longestStreak: 0, currentStreak: 0, maxContributionsInADay: 0, mostActiveDay: "None" };
  }
}
