import "dotenv/config";
import { Pinecone } from "@pinecone-database/pinecone";

const apiKey = process.env.PINECONE_DB_API_KEY;

export const pinecone = new Pinecone({ apiKey });

export const pineconeIndex = pinecone.createIndex({
  name: "neuraltrace-ai-code-reviewer",
  vectorType: "dense",
  dimension: 1024,
  metric: "cosine",
  spec: {
    serverless: {
      cloud: "aws",
      region: "us-east-1",
    },
  },
  deletionProtection: "disabled",
  tags: { environment: "development" },
});
