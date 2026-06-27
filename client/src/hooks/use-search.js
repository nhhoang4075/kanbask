"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";

import { searchUsers, searchTasks, searchMessages } from "@/actions/search-actions";

const SEARCH_LIMIT = 5;

const SearchContext = createContext();

export function useSearch() {
  return useContext(SearchContext);
}

export function SearchProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(null);
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState({});
  const [results, setResults] = useState({ users: null, tasks: null, messages: null });
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  // Track pagination state
  const [offsets, setOffsets] = useState({ users: 0, tasks: 0, messages: 0 });
  const [hasMore, setHasMore] = useState({ users: true, tasks: true, messages: true });

  const fetchResults = async ({ limit = SEARCH_LIMIT, offset = 0, append = false }) => {
    append ? setLoadingMore(true) : setLoadingInitial(true);
    setError(null);

    try {
      let data;
      switch (type) {
        case "users":
          data = await searchUsers({ query, limit, offset });
          if (append) {
            setResults((prev) => ({
              ...prev,
              users: [...prev.users, ...data.users]
            }));
          } else {
            setResults((prev) => ({ ...prev, users: data.users }));
          }
          setHasMore((prev) => ({ ...prev, users: data.users.length === limit }));
          setOffsets((prev) => ({ ...prev, users: offset + data.users.length }));
          break;

        case "tasks":
          data = await searchTasks({ query, status: options.status || "all", limit, offset });
          if (append) {
            setResults((prev) => ({
              ...prev,
              tasks: [...prev.tasks, ...data.tasks]
            }));
          } else {
            setResults((prev) => ({ ...prev, tasks: data.tasks }));
          }
          setHasMore((prev) => ({ ...prev, tasks: data.tasks.length === limit }));
          setOffsets((prev) => ({ ...prev, tasks: offset + data.tasks.length }));
          break;

        case "messages":
          if (!options.conversationId) {
            setResults((prev) => ({
              ...prev,
              messages: null
            }));
            break;
          }

          data = await searchMessages({
            query,
            conversationId: options.conversationId,
            limit,
            offset
          });
          if (append) {
            setResults((prev) => ({
              ...prev,
              messages: [...prev.messages, ...data.messages]
            }));
          } else {
            setResults((prev) => ({ ...prev, messages: data.messages }));
          }
          setHasMore((prev) => ({ ...prev, messages: data.messages.length === limit }));
          setOffsets((prev) => ({ ...prev, messages: offset + data.messages.length }));
          break;

        default:
          break;
      }
    } catch (err) {
      setError(err);
    } finally {
      append ? setLoadingMore(false) : setLoadingInitial(false);
    }
  };

  // Debounced initial fetch (resets pagination)
  const performSearch = useDebouncedCallback(() => {
    // Reset results, offsets and hasMore
    setResults({ users: [], tasks: [], messages: [] });
    setOffsets({ users: 0, tasks: 0, messages: 0 });
    setHasMore({ users: true, tasks: true, messages: true });
    fetchResults({ limit: SEARCH_LIMIT, offset: 0, append: false });
  }, 500);

  // Automatically fetch when query/type/options change
  useEffect(() => {
    if (query.trim() && type) {
      performSearch();
    } else {
      // Clear results if no query or no type selected
      setResults({ users: null, tasks: null, messages: null });
    }
  }, [query, type, options]);

  // Load more when needed
  const searchMore = useCallback(async () => {
    if (type && hasMore[type]) {
      await fetchResults({ limit: SEARCH_LIMIT, offset: offsets[type], append: true });
    }
  }, [type, hasMore, offsets]);

  const contextValue = {
    open,
    setOpen,
    type,
    setType,
    query,
    setQuery,
    options,
    setOptions,
    results,
    loadingInitial,
    loadingMore,
    error,
    hasMore,
    searchMore
  };

  return <SearchContext.Provider value={contextValue}>{children}</SearchContext.Provider>;
}
