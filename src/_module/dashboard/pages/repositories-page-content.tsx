"use client";

import { useEffect, useRef, useState } from "react";
import { useRepositories } from "@/_module/repository/hooks/use-repositories";
import { ExternalLink, Search, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RepositoriesListSkeleton } from "./skeleton/repositories-skeleton";

export default function RepositoriesPageContent() {
  // custom hooks and context
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useRepositories();

  // refs
  const observerTarget = useRef<HTMLDivElement>(null);

  // states
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [localConnectingId, setLocalConnectingId] = useState<number | null>(null);

  // filtered and mapped values
  const allRepositories = (data && data.pages.flatMap((page) => page)) || [];

  const filteredRepositories = allRepositories.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.full_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  //   const handleConnect = (repo) => {
  //     setLocalConnectingId(repo.id);
  //     connectRepo(
  //       {
  //         owner: repo.full_name.split("/")[0],
  //         repo: repo.name,
  //         githubId: repo.id,
  //       },
  //       {
  //         onSettled: () => setLocalConnectingId(null),
  //       },
  //     );
  //   };

  useEffect(
    function intersectionObserverFetching() {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        },
        {
          threshold: 0.1,
        },
      );

      const currentTarget = observerTarget.current;

      if (currentTarget) {
        observer.observe(currentTarget);
      }

      return () => {
        if (currentTarget) {
          observer.unobserve(currentTarget);
        }
      };
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Repositories</h1>
          <p className="text-muted-foreground">Manage and view all your Github repositories</p>
        </div>
        <RepositoriesListSkeleton />
      </div>
    );
  }

  if (isError) {
    return <div className="flex h-full w-full items-center justify-center">Failed to load repositories.</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Repositories</h1>
        <p className="text-muted-foreground">Manage and view all your Github repositories</p>
      </div>

      <div className="relative">
        <Search className="text-muted-foreground absolute top-2 left-2 h-4 w-4" />
        <Input
          className="pl-8 focus-visible:border-none focus-visible:ring-0 focus-visible:outline-none"
          placeholder="Search repositories"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {filteredRepositories.map((repo) => (
          <Card key={repo.id} className="transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{repo.name}</CardTitle>
                    <Badge variant="outline">{repo.language || "Unknown"}</Badge>
                    {/* {repo.isConnected && <Badge variant="secondary">Connected</Badge>} */}
                  </div>
                  <CardDescription>{repo.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    variant={repo.isConnected ? "outline" : "default"}
                    disabled={localConnectingId === repo.id || repo.isConnected}
                    // onClick={() => handleConnect(repo)}
                  >
                    {localConnectingId === repo.id ? "Connecting..." : repo.isConnected ? "Connected" : "Not Connected"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="fill-primary text-primary h-4 w-4" />
                    <span className="text-sm font-medium">{repo.stargazers_count}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div ref={observerTarget} className="py-4">
        {isFetchingNextPage && <RepositoriesListSkeleton />}
        {!hasNextPage && allRepositories.length > 0 && (
          <p className="text-muted-foreground text-center">No more Repositories</p>
        )}
      </div>
    </div>
  );
}
