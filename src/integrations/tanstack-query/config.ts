import { MutationCache, QueryCache } from "@tanstack/react-query";

export const QueryDefaultOptions = {
  defaultOptions: {
    queries: {
      // Avoid aggressive refetching
      staleTime: 1000 * 60, // 1 min
      gcTime: 1000 * 60 * 5, // 5 min

      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: false,
    },
    mutations: {
      retry: 1,
    },
  },

  // Centralized error handling
  queryCache: new QueryCache({
    onError: (error) => {
      console.error("Query Error:", error);
    },
  }),

  mutationCache: new MutationCache({
    onError: (error) => {
      console.error("Mutation Error:", error);
    },
  }),
};
