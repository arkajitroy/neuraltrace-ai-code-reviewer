import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function generateAIReview(query: string): Promise<string> {
  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    prompt: query,
  });

  return text;
}
