import { Octokit } from "octokit";
import { getGithubToken } from "./github";

export async function getOctokit() {
  const token = await getGithubToken();
  return new Octokit({ auth: token });
}
