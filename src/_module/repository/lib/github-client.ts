import { Octokit } from "octokit";
import { getGithubToken } from "./github";

export async function getOctokit(token?: string) {
  const authToken = token || await getGithubToken();
  return new Octokit({ auth: authToken });
}
