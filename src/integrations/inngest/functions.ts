import { inngest } from "./client";

export const inggestPing = inngest.createFunction(
  { id: "inngest-server-ping", triggers: [{ event: "test/hello.world" }] },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);
