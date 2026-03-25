import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";

export function RepositoriesCardSkeleton() {
  return (
    <Card className="group relative overflow-hidden flex flex-col border-border/50 shadow-sm min-h-[220px]">
      <CardHeader className="relative z-10 p-5 pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2 overflow-hidden">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full shrink-0" />
              <Skeleton className="h-6 w-3/4 rounded-md" />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Skeleton className="h-3 w-16" />
              <span className="text-muted-foreground/30 text-xs">•</span>
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-8 w-8 rounded-md shrink-0" />
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10 p-5 pt-2 flex-1 flex flex-col">
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6 mt-auto">
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>

        <div className="flex flex-wrap items-center gap-4 mt-auto">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
        </div>
      </CardContent>
      
      <CardFooter className="relative z-10 p-4 border-t bg-muted/10 flex items-center justify-between gap-4 mt-auto">
        <div className="flex items-center gap-2 w-1/2">
          <Skeleton className="h-4 w-4 shrink-0" />
          <Skeleton className="h-3 w-full max-w-[120px]" />
        </div>
        <Skeleton className="h-8 w-28 rounded-full shrink-0" />
      </CardFooter>
    </Card>
  );
}

export function RepositoriesListSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <RepositoriesCardSkeleton key={i} />
      ))}
    </div>
  );
}
