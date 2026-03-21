import { Octokit } from "octokit";
import { getGithubToken } from "../lib/github";

export async function createGithubClient() {
  const token = await getGithubToken();
  return new Octokit({ auth: token });
}

export async function getGithubContext() {
  const octokit = await createGithubClient();
  const { data: user } = await octokit.rest.users.getAuthenticated();

  return { octokit, user };
}
