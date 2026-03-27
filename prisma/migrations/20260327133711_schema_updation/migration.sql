-- CreateTable
CREATE TABLE "review" (
    "id" TEXT NOT NULL,
    "repositoryId" TEXT NOT NULL,
    "pullRequestNumber" INTEGER NOT NULL,
    "pullRequestTitle" TEXT NOT NULL,
    "pullRequestUrl" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "review" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "review_repositoryId_idx" ON "review"("repositoryId");

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "repository"("id") ON DELETE CASCADE ON UPDATE CASCADE;
