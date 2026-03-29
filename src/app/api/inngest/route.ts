import { serve } from "inngest/next";
import { inngest } from "@/integrations/inngest/client";
import { indexRepository, reviewPullRequest } from "@/integrations/inngest/functions";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [indexRepository, reviewPullRequest],
});
