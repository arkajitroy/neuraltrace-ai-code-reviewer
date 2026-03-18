import React from "react";
import prisma from "@/lib/db";

export default async function HomePage() {
  const posts = await prisma.post.findMany();

  return (
    <div>
      <h3>Code Review Application</h3>
      {posts.map((post) => (
        <div className="flex flex-col border w-fit my-2" key={post.id}>
          <span>Title: {post.title}</span>
          <span>Content: {post.content}</span>
        </div>
      ))}
    </div>
  );
}
