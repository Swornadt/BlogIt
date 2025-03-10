import { BlogFooter } from "../../../components/home/blog-footer";
import HeroSection from "../../../components/home/hero-section";
import TopArticles from "../../../components/home/top-articles";
import { Button } from "../../../components/ui/button";
import Link from "next/link";
import React, { Suspense } from "react";
import { AllArticlePageSkeleton } from "../articles/page";

const page = async () => {
  return (
    <main>

      <HeroSection />

      <section className="relative py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Featured Articles
            </h2>
            <p> Discover our trending content </p>
          </div>

          <Suspense fallback={<AllArticlePageSkeleton/>}> 
            <TopArticles />
          </Suspense>

          <div className="text-center mt-12">
            <Link href={'/articles'}>
              <Button className="rounded-full hover:bg-gray-900 hover:text-white dark:hover:text-gray-900"> View All</Button>
            </Link>
          </div>
        </div>
      </section>

      <BlogFooter/>
    </main>
  );
}

export default page;
