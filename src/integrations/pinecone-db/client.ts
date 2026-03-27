import "dotenv/config";
import { Pinecone } from "@pinecone-database/pinecone";

const apiKey = process.env.PINECONE_DB_API_KEY;
const pineconeIndexName = process.env.PINECONE_INDEX_NAME;

// Initialize Pinecone client
export const pinecone = new Pinecone({ apiKey });
export const pineconeIndex = pinecone.index(pineconeIndexName);
