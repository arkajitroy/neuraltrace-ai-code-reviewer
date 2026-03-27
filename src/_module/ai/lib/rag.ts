import { GitHubFile } from "@/_module/repository/types";
import { pineconeIndex } from "@/integrations/pinecone-db/client";
import { google } from "@ai-sdk/google";
import { embed } from "ai";

export async function generateEmbedding(text: string) {
  const { embedding } = await embed({
    model: google.embeddingModel("gemini-embedding-001"),
    value: text,
  });

  return embedding;
}

export async function indexCodebase(repositoryId: string, files: Array<GitHubFile>) {
  const vectors = [];

  for (const file of files) {
    const content = `File: ${file.path}\n\n${file.content}`;
    const truncatedContent = content.slice(0, 8000);

    try {
      const embedding = await generateEmbedding(truncatedContent);

      vectors.push({
        id: `${repositoryId}-${file.path.replace(/\//g, "_")}`,
        values: embedding,
        metadata: {
          repositoryId,
          path: file.path,
          content: truncatedContent,
        },
      });
    } catch (error) {
      console.error(`Failed to embed ${file.path}: `, error);
    }
  }

  if (vectors.length > 0) {
    const batchSize = 100;
    for (let i = 0; i < vectors.length; i += batchSize) {
      const batch = vectors.slice(i, i + batchSize);
      await pineconeIndex.upsert({ records: batch });
    }
  }

  console.log("indexing completed!");
}

export async function retrieveContext(repositoryId: string, query: string, topK: number = 5) {
  const queryEmbedding = await generateEmbedding(query);
  const results = await pineconeIndex.query({
    vector: queryEmbedding,
    topK,
    filter: { repositoryId },
    includeMetadata: true,
  });

  return results.matches.map((match) => match.metadata?.content as string).filter(Boolean);
}
