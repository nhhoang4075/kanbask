"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { getUserSearchResults, getMessageSearchResults, getTaskSearchResults } from "@/actions/search-actions";
import { useDebouncedCallback } from "use-debounce" 

const SearchContext = createContext();

export function useSearch() {
  return useContext(SearchContext);
}
export function SearchProvider({ initialSearchResults = [], children }) {
  const [searchResults, setSearchResults] = useState(initialSearchResults);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchTimeoutRef = useRef(null);

  const performSearch = useDebouncedCallback(async (query, conversationId = null) => {
    if (!query) {
      setSearchResults([]);
      return null;
    }

    setLoading(true);
    setError(null);

    try {
        const userResults = await getUserSearchResults(query) || [];
        const messageResults = conversationId ? await getMessageSearchResults(query, conversationId) : [];
        const taskResults = await getTaskSearchResults(query) || [];

        setSearchResults({
          users: userResults.users,
          messages: messageResults.messages,
          tasks: taskResults.tasks,
        });
        console.log("Search results:", {
          users: userResults.users,
          messages: messageResults.messages,
          tasks: taskResults.tasks,
        });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, 1000);
  useEffect(() => {
    return () => {
      clearTimeout(searchTimeoutRef.current);
    };
  }, []);
  const clearSearch = () => {
    setSearchResults([]);
  };
  const contextValue = {
    searchResults,
    loading,
    error,
    performSearch,
    clearSearch,
  };
  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
}