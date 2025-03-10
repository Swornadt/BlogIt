import AllArticlePage from "@/components/articles/all-article-page";
import ArticleSearchInput from "@/components/articles/article-search-input";
import Navbar from "@/components/home/header/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getArticleByQuery } from "@/lib/query/get-article-by-query";
import Link from "next/link";
import React, { Suspense } from "react";

type SearchPageProps = {
  searchParams: Promise<{ search?: string; page?: string }>;
};

const ITEMS_PER_PAGE = 3;

const Page: React.FC<SearchPageProps> = async ({ searchParams }) => {
  const searchText = (await searchParams).search || "";
  const currPage = Number((await searchParams).page || 1);

  const skip = (currPage - 1) * ITEMS_PER_PAGE; //gives how many articles to skip
  const take = ITEMS_PER_PAGE;

  const { article, total } = await getArticleByQuery(searchText, skip, take);
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-background">
      <Navbar/>
      <main className="container mx-auto px-4 py-12 sm:px-6 lg:text-5xl">
        {/* Page header */}
        <div className="mb-12 space-y-6 text-center">
          <h1 className="text-4xl font-bold sm:text-5xl"> All Articles </h1>
          {/* Search Bar */}
          <ArticleSearchInput />
        </div>

        {/* All Articles Card */}
        <Suspense fallback={<AllArticlePageSkeleton />}>
          <AllArticlePage articles={article} />
        </Suspense>
        
        {/* Pagination */}
        <div className="mt-12 flex justify-center gap-2">

          {/* Previous Button */}
          {currPage > 1 && (
            <Link href={`?search=${searchText}&page=${currPage - 1}`} passHref>
              <Button disabled={currPage === 1} variant={"ghost"}>
                {" "}
                Prev
              </Button>
            </Link>
          )}
          {currPage === 1 && (
            <Button disabled variant={"ghost"}>
              Prev
            </Button>
          )}

          {/* Numbering Buttons */}
          {Array.from({ length: totalPages }).map((_, index) => (
            <Link
              key={index}
              href={`?search=${searchText}&page=${index + 1}`}
              passHref
            >
              <Button variant={`${currPage === index+1 ? 'destructive' : 'ghost'}`} size={"sm"}>
                {index + 1}
              </Button>
            </Link>
          ))}

          {/* Next Button */}
          {currPage < totalPages && (
            <Link href={`?search=${searchText}&page=${currPage + 1}`} passHref>
              <Button disabled={currPage === totalPages} variant={"ghost"}>
                Next
              </Button>
            </Link>
          )}
          {currPage === totalPages && (
            <Button disabled variant={"ghost"}>
              Next
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default Page;

export const AllArticlePageSkeleton = () => {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card
          key={index}
          className="group relative overflow-hidden transition-all hover:shadow-lg"
        >
          <div className="p-6">
            {/* Article Image Skeleton */}
            <Skeleton className="mb-4 h-48 w-full rounded-xl bg-gradient-to-br from-purple-100/50 to-blue-100/50 dark:from-purple-900/20 dark:to-blue-900/20" />

            {/* Article Title Skeleton */}
            <Skeleton className="h-6 w-3/4 rounded-lg" />

            {/* Article Category Skeleton */}
            <Skeleton className="mt-2 h-4 w-1/2 rounded-lg" />

            {/* Author & Metadata Skeleton */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Author Avatar Skeleton */}
                <Skeleton className="h-8 w-8 rounded-full" />

                {/* Author Name Skeleton */}
                <Skeleton className="h-4 w-20 rounded-lg " />
              </div>

              {/* Date Skeleton */}
              <Skeleton className="h-4 w-24 rounded-lg " />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
