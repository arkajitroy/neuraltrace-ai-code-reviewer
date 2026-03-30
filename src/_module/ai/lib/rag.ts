import { GitHubFile } from "@/_module/repository/types";
import { pineconeIndex } from "@/integrations/pinecone-db/client";
import { google } from "@ai-sdk/google";
import { embed, embedMany } from "ai";

export async function generateEmbedding(text: string) {
  const { embedding } = await embed({
    model: google.embeddingModel("gemini-embedding-2-preview"),
    value: text,
  });

  // MRL allows truncation to 768 dimensions natively
  return embedding.slice(0, 768);
}

export async function indexCodebase(repositoryId: string, files: Array<GitHubFile>) {
  const vectors = [];

  const batchSize = 25; // Process 25 files per batch to drastically reduce RPM.

  for (let i = 0; i < files.length; i += batchSize) {
    const fileBatch = files.slice(i, i + batchSize);

    // Process and truncate contents safely
    const validFiles = fileBatch.map((f) => ({
      ...f,
      content: `File: ${f.path}\n\n${f.content}`.slice(0, 6000), // ~1500 tokens, well below 2048 token limit
    }));
    const texts = validFiles.map((f) => f.content);

    try {
      if (texts.length === 0) continue;

      // Group calls to respect the 15 RPM rate limiting threshold
      const { embeddings } = await embedMany({
        model: google.embeddingModel("gemini-embedding-2-preview"),
        values: texts,
      });

      for (let j = 0; j < validFiles.length; j++) {
        vectors.push({
          id: `${repositoryId}-${validFiles[j].path.replace(/\//g, "_")}`,
          values: embeddings[j].slice(0, 768), // MRL truncate to 768 dimension pinecone index size
          metadata: {
            repositoryId,
            path: validFiles[j].path,
            content: validFiles[j].content,
          },
        });
      }

      // Small throttling 2.5sec interval to rest the rate-limiter
      await new Promise((resolve) => setTimeout(resolve, 2500));
    } catch (error) {
      console.error(`Failed to embed batch: `, error);
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
