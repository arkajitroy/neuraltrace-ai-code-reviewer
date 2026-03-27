declare namespace NodeJS {
  interface ProcessEnv {
    APP_BASE_URL: string;
    NEXT_PUBLIC_APP_BASE_URL: string;
    BETTER_AUTH_URL: string;
    BETTER_AUTH_SECRET: string;
    GITHUB_CLIENT_ID: string;
    GITHUB_CLIENT_SECRET: string;
    DATABASE_URL: string;
    INNGEST_SIGNING_KEY: string;
    PINECONE_INDEX_NAME: string;
    PINECONE_DB_API_KEY: string;
    GEMINI_API_KEY: string;
  }
}
