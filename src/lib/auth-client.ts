import { createAuthClient } from "better-auth/react";

// Singleton Auth client Instance (avoids re-rendering accross imports)
const baseURL = process.env.BASE_URL;
const authClient = createAuthClient({ baseURL });

export const { signIn, signUp, signOut, useSession } = authClient;
