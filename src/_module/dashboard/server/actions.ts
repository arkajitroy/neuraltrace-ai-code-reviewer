"use server";

import { getUserContribution } from "@/_module/repository/lib/github";
import { DEFAULT_MONTH_LIST, DEFAULT_REPOSITORY_COUNT, DEFAULT_REVIEW_COUNT } from "../constants/repository";
import { getGithubContext } from "@/_module/repository/utils";

export async function getDashboardStats() {
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
