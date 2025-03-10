"use client";
import { searchAction } from "@/actions/search";
import { Input } from "../../ui/input";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React from "react";

const SearchInput = () => {
  const searchParams = useSearchParams();

  return (
    <form action={searchAction}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-10 w-48 focus-visible:ring-1"
          type="text"
          name="search"
          defaultValue={searchParams.get("search") || ""}
          placeholder="Search Articles"
        />
      </div>
    </form>
  );
};

export default SearchInput;
