export interface ContributionDay {
  contributionCount: number;
  date: string; // keep as string (ISO), parse when needed
  color: string;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

export interface ContributionData {
  user: {
    contributionsCollection: {
      contributionCalendar: ContributionCalendar;
    };
  };
}

export type ContributionResponse = ContributionData;
