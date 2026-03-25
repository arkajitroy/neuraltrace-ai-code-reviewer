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

export async function getRepositories(page = 1, perPage = 10) {
  const token = await getGithubToken();
  const octokit = new Octokit({ auth: token });

  const { data } = await octokit.rest.repos.listForAuthenticatedUser({
    sort: "updated",
    direction: "desc",
    visibility: "all",
    per_page: perPage,
    page: page,
  });

  return data;
}

export const createWebhook = async (owner: string, repo: string) => {
  const token = await getGithubToken();

  const octokit = new Octokit({ auth: token });

  const webhookUrl = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/webhooks/github`;

  const { data: hooks } = await octokit.rest.repos.listWebhooks({
    owner,
    repo,
  });

  const existingHook = hooks.find((hook) => hook.config.url === webhookUrl);
  if (existingHook) {
    return existingHook;
  }

  const { data } = await octokit.rest.repos.createWebhook({
    owner,
    repo,
    config: {
      url: webhookUrl,
      content_type: "json",
    },
    events: ["pull_request"],
  });

  return data;
};

export const deleteWebhook = async (owner: string, repo: string) => {
  const token = await getGithubToken();
  const octokit = new Octokit({ auth: token });

  const webhookUrl = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/webhooks/github`;

  try {
    const { data: hooks } = await octokit.rest.repos.listWebhooks({
      owner,
      repo,
    });

    const hookToDelete = hooks.find((hook) => hook.config.url === webhookUrl);
    if (hookToDelete) {
      await octokit.rest.repos.deleteWebhook({
        owner,
        repo,
        hook_id: hookToDelete.id,
      });

      return true;
    }

    return false;
  } catch (error) {
    console.log("Error deleting webhook", error);
    return false;
  }
};
