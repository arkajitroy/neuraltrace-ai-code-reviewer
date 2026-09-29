import { NextRequest, NextResponse } from "next/server";
import { reviewPullRequest } from "@/_module/ai/server/actions";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const event = req.headers.get("x-github-event");

    if (event === "ping") {
      return NextResponse.json({ message: "Webhooks Ping", status: 200 });
    }

    if (event === "pull_request") {
      const action = body.action;
      const repository = body.repository.full_name;
      const pull_request_number = body.number;

      const [owner, repoName] = repository.split("/");

      console.log("all-parameters-data", {
        action,
        repository,
        pull_request_number,
        owner,
        repoName,
      });

      // Handle pull request events (opened, synchronize, reopened)
      if (action === "opened" || action === "synchronize" || action === "reopened") {
        reviewPullRequest(owner, repoName, pull_request_number)
          .then(() => {
            console.log(`Pull request #${pull_request_number} reviewed successfully.`);
          })
          .catch((error) => {
            console.error(`Error reviewing pull request #${pull_request_number}:`, error);
          });
      }
    }

    return NextResponse.json({ message: "Event processes" }, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
