import prisma from "@/lib/db";
import { Octokit } from "octokit";
import { ContributionCalendar, ContributionResponse } from "../types";
import { getAppSession } from "@/lib/sessions";

export async function getGithubToken() {
  const session = await getAppSession();

  const account = await prisma.account.findFirst({
    where: {
      userId: session.user.id,
      providerId: "github",
    },
    select: {
      accessToken: true,
    },
  });
  if (!account?.accessToken) throw new Error("GitHub token not found");
  return account.accessToken;
}

export async function getUserContribution(username: string): Promise<ContributionCalendar> {
  const token = await getGithubToken();
  const octokit = new Octokit({ auth: token });

  const query = `
    query($username:String!){
      user(login:$username){
        contributionsCollection{
          contributionCalendar{
            totalContributions
            weeks {
              contributionDays{
                contributionCount
                date
                color
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await octokit.graphql<ContributionResponse>(query, {
      username,
    });
    return response.user.contributionsCollection.contributionCalendar;
  } catch (error) {
    throw new Error("Failed to fetch GitHub contributions");
  }
}
