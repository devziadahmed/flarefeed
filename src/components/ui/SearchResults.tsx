import { Models } from "appwrite";
import React from "react";
import Loader from "./Loader";
import { searchPosts } from "@/lib/appwrite/services";
import GridPostList from "./GridPostList";

type SearchResultProps = {
  isSearchFetching: boolean;
  searchedPosts: Models.DocumentList<Models.Document> | undefined;
};

const SearchResults = ({ isSearchFetching, searchedPosts }: SearchResultProps) => {
  if (isSearchFetching) return <Loader />;

  if (searchedPosts && searchedPosts.documents.length > 0) {
    return <GridPostList posts={searchedPosts.documents} />;
  }

  return <p className="text-light-4 mt-10 text-center w-full">No results found</p>;
};

export default SearchResults;
