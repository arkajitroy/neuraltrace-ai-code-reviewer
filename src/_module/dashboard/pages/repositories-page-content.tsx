"use client";

import { useEffect, useRef, useState } from "react";
import { useRepositories } from "@/_module/repository/hooks/use-repositories";
import { formatDistanceToNow } from "date-fns";
import {
  ExternalLink,
  Search,
  Star,
  GitFork,
  Globe,
  Lock,
  Archive,
  BookMarked,
  CheckCircle2,
  CalendarDays,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RepositoriesListSkeleton } from "./skeleton/repositories-skeleton";
import { useConnectRepository } from "@/_module/repository/hooks/use-connect-repository";
import { cn } from "@/lib/utils";
import PageHeader from "@/components/custom/page-header";

const languageColors: Record<string, string> = {
  TypeScript: "bg-blue-500",
  JavaScript: "bg-yellow-400",
  Python: "bg-green-500",
  Java: "bg-orange-500",
  "C++": "bg-pink-500",
  Ruby: "bg-red-500",
  Go: "bg-cyan-500",
  Rust: "bg-black dark:bg-white",
  PHP: "bg-purple-500",
  HTML: "bg-orange-600",
  CSS: "bg-blue-400",
  Shell: "bg-green-400",
};

export default function RepositoriesPageContent() {
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useRepositories();
  const { mutate: connectRepoFn } = useConnectRepository();

  const observerTarget = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [localConnectingId, setLocalConnectingId] = useState<number | null>(null);
  const [filterConnect, setFilterConnect] = useState<"all" | "connected" | "not_connected">("all");

  const allRepositories = (data && data.pages.flatMap((page) => page)) || [];

  const filteredRepositories = allRepositories.filter((repo) => {
    const matchesSearch =
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.full_name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterConnect === "all" ||
      (filterConnect === "connected" && repo.isConnected) ||
      (filterConnect === "not_connected" && !repo.isConnected);

    return matchesSearch && matchesFilter;
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const handleConnect = (repo) => {
    setLocalConnectingId(repo.id);
    connectRepoFn(
      {
        owner: repo.owner?.login || repo.full_name.split("/")[0],
        repo: repo.name,
        githubId: repo.id,
      },
      {
        onSettled: () => setLocalConnectingId(null),
      },
    );
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) observer.observe(currentTarget);

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Repositories"
          description="View, manage, and seamlessly integrate your GitHub repositories with NeuralTrace."
        />
        <RepositoriesListSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center gap-4 rounded-xl border border-dashed text-muted-foreground">
        <Activity className="h-10 w-10 text-destructive/50" />
        <p>Failed to load repositories. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <PageHeader
        title="Repositories"
        description="View, manage, and seamlessly integrate your GitHub repositories with NeuralTrace."
      />

      {/* Filters & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-card p-4 rounded-xl">
        <div className="relative flex-1 max-w-md border-2 border-gray-200 rounded-lg">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            className="pl-9 h-10 bg-background border-none focus-visible:ring-primary/50 transition-all rounded-lg"
            placeholder="Search repositories by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="inline-flex items-center rounded-lg bg-muted/50 p-1 shadow-sm border border-border/40">
          <button
            onClick={() => setFilterConnect("all")}
            className={`px-4 py-1.5 text-sm font-medium transition-all duration-200 rounded-md ${
              filterConnect === "all"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All Repos
          </button>
          <button
            onClick={() => setFilterConnect("connected")}
            className={`px-4 py-1.5 text-sm font-medium transition-all duration-200 rounded-md ${
              filterConnect === "connected"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Connected
          </button>
          <button
            onClick={() => setFilterConnect("not_connected")}
            className={`px-4 py-1.5 text-sm font-medium transition-all duration-200 rounded-md ${
              filterConnect === "not_connected"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Not Connected
          </button>
        </div>
      </div>

      {/* Repository Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredRepositories.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed bg-card/50">
            <Archive className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold">No repositories found</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Try adjusting your search or filters to find what you&apos;re looking for.
            </p>
          </div>
        ) : (
          filteredRepositories.map((repo) => {
            const isConnecting = localConnectingId === repo.id;

            return (
              <Card
                key={repo.id}
                className={cn(
                  "group relative overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:border-primary/40",
                  repo.isConnected && "border-primary/20 bg-primary/5",
                )}
              >
                {/* Background decorative blob */}
                <div className="absolute -right-20 -top-20 z-0 h-40 w-40 rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors" />

                <CardHeader className="relative z-10 p-5 pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-1 overflow-hidden">
                      <div className="flex items-center gap-2">
                        <BookMarked className="h-4 w-4 text-primary shrink-0" />
                        <CardTitle className="truncate text-lg font-bold" title={repo.name}>
                          {repo.name}
                        </CardTitle>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-muted-foreground">
                        {repo.visibility === "private" ? (
                          <div className="flex items-center gap-1">
                            <Lock className="h-3 w-3" /> Private
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <Globe className="h-3 w-3" /> Public
                          </div>
                        )}
                        <span>•</span>
                        {repo.owner?.login && <span>{repo.owner.login}</span>}
                      </div>
                    </div>
                    {/* External Link */}
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors hover:scale-110"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  </div>
                </CardHeader>

                <CardContent className="relative z-10 p-5 pt-2 flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground line-clamp-2 min-h-10 mb-4">
                    {repo.description || "No description provided."}
                  </p>

                  {/* Topic Tags (Max 3) */}
                  {repo.topics && repo.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4 mt-auto">
                      {repo.topics.slice(0, 3).map((topic: string) => (
                        <Badge key={topic} variant="secondary" className="text-[10px] px-1.5 py-0 h-5 font-normal">
                          {topic}
                        </Badge>
                      ))}
                      {repo.topics.length > 3 && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 font-normal opacity-50">
                          +{repo.topics.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Metrics Row */}
                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground mt-auto">
                    {repo.language && (
                      <div className="flex items-center gap-1.5">
                        <span
                          className={cn("h-2.5 w-2.5 rounded-full", languageColors[repo.language] || "bg-gray-400")}
                        />
                        {repo.language}
                      </div>
                    )}
                    <div className="flex items-center gap-1" title="Stars">
                      <Star className="h-3.5 w-3.5 fill-muted-foreground/30 text-muted-foreground" />
                      {repo.stargazers_count}
                    </div>
                    <div className="flex items-center gap-1" title="Forks">
                      <GitFork className="h-3.5 w-3.5" />
                      {repo.forks_count || 0}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="relative z-10 p-4 border-t bg-muted/20 flex items-center justify-between gap-4 mt-auto">
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    <span className="truncate max-w-[120px]">
                      {repo.pushed_at || repo.updated_at
                        ? `Updated ${formatDistanceToNow(new Date(repo.pushed_at || repo.updated_at!))} ago`
                        : "Unknown update"}
                    </span>
                  </div>

                  <Button
                    variant={repo.isConnected ? "outline" : "default"}
                    size="sm"
                    className={cn(
                      "w-32 transition-all shadow-sm rounded-full",
                      repo.isConnected && "border-primary/50 text-primary hover:bg-primary/10 hover:text-primary",
                      isConnecting && "opacity-80 cursor-wait",
                    )}
                    disabled={isConnecting || repo.isConnected}
                    onClick={() => handleConnect(repo)}
                  >
                    {isConnecting ? (
                      <span className="flex items-center gap-2">
                        <Activity className="h-3.5 w-3.5 animate-spin" />
                        Connecting
                      </span>
                    ) : repo.isConnected ? (
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Connected
                      </span>
                    ) : (
                      "Connect"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })
        )}
      </div>

      <div ref={observerTarget} className="py-8 flex justify-center">
        {isFetchingNextPage && <Activity className="h-6 w-6 animate-spin text-primary/50" />}
        {!hasNextPage && allRepositories.length > 0 && (
          <div className="flex items-center gap-2 text-muted-foreground/60 text-sm bg-muted/30 px-4 py-2 rounded-full mt-4">
            <CheckCircle2 className="h-4 w-4" />
            You&apos;ve reached the end
          </div>
        )}
      </div>
    </div>
  );
}
