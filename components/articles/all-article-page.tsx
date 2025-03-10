import React from "react";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Search } from "lucide-react";
import type { Prisma } from "@prisma/client";
import Link from "next/link";
import Navbar from "../home/header/navbar";

type AllArticlePageProps = {
  articles: Prisma.ArticleGetPayload<{
    include: {
      author: {
        select: {
          name: true;
          email: true;
          imageUrl: true;
        };
      };
    };
  }>[];
};

const AllArticlePage: React.FC<AllArticlePageProps> = async ({ articles }) => {
  if (articles.length <= 0) {
    return <NoSearchResults />;
  }
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <Link key={article.id} href={`/articles/${article.id}`}>
          <Card
            key={article.id}
            className="group relative overflow-hidden translate-all hover:shadow-lg"
          >
            <div className="p-6">
              <div className="relative mb-4 h-48 w-full overflow-hidden rounded-xl">
                <img
                  src={article.featuredImage}
                  alt="some stuff"
                  className="object-fit"
                />
              </div>
              {/* Article Content */}
              <h3 className="text-xl font-semibold">{article.title}</h3>
              <p className="mt-2">{article.category}</p>
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={article.author.imageUrl || ""} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <span className="text-sm"> {article.author.name} </span>
                </div>
                <div className="text-sm">
                  {article.createdAt.toDateString()}
                </div>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default AllArticlePage;

const NoSearchResults = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-4 rounded-full bg-muted p-4">
        <Search className="h-8 w-8" />
      </div>
      <h3 className="font-bold text-xl"> No Result Found !</h3>
      <p className="mt-2 text-sm">
        We could not any articles matching your search query. Please try broader
        keywords.
      </p>
    </div>
  );
};
