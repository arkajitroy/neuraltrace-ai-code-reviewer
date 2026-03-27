import prisma from "@/lib/db";
import { Octokit } from "octokit";
import { ContributionCalendar, ContributionResponse, GitHubFile } from "../types";
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

export const getRepositoryFileContents = async (
  authToken: string,
  owner: string,
  repository: string,
  pathURL: string = "",
): Promise<Array<GitHubFile>> => {
  const octokit = new Octokit({ auth: authToken });

  const { data } = await octokit.rest.repos.getContent({
    owner,
    repo: repository,
    path: pathURL,
  });

  if (!Array.isArray(data)) {
    // filetype data
    if (data.type === "file" && data.content) {
      return [
        {
          path: data.path,
          content: Buffer.from(data.content, "base64").toString("utf-8"),
        },
      ];
    }
    return [];
  }

  let files: Array<GitHubFile> = [];

  for (const item of data) {
    // edgecase: file type
    if (item.type === "file") {
      const { data: fileData } = await octokit.rest.repos.getContent({
        owner,
        repo: repository,
        path: item.path,
      });

      if (!Array.isArray(fileData) && fileData.type === "file" && fileData.content) {
        // Filter out non-code files if needed (images, etc.)
        // For now, let's include everything that looks like text
        if (!item.path.match(/\.(png|jpg|jpeg|gif|svg|ico|pdf|zip|tar|gz)$/i)) {
          files.push({
            path: item.path,
            content: Buffer.from(fileData.content, "base64").toString("utf-8"),
          });
        }
      }
    }

    // edgecase: directory type
    else if (item.type === "dir") {
      const subFiles = await getRepositoryFileContents(authToken, owner, repository, item.path);
      files = files.concat(subFiles);
    }
  }

  return files;
};
