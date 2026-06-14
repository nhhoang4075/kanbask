import { useState, useCallback, useEffect } from 'react';
import { searchTasks, searchUsers, searchMessages } from '../actions/search-action.js';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useSearch(type = 'tasks', initialQuery = '', initialStatus = 'all', debounceMs = 300) {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [status, setStatus] = useState(initialStatus);
  const [page, setPage] = useState(1);
  const [conversationId, setConversationId] = useState(null);
  const limit = 10;

  const debouncedQuery = useDebounce(searchQuery, debounceMs);

  const performSearch = useCallback(async (query, taskStatus, pageNumber) => {
    if (!query.trim() && (type === 'tasks' ? taskStatus === 'all' : true)) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const offset = (pageNumber - 1) * limit;

      let results;
      switch (type) {
        case 'tasks':
          results = await searchTasks({ 
            query, 
            status: taskStatus,
            limit,
            offset
          });
          break;
        case 'users':
          results = await searchUsers({
            query,
            limit,
            offset
          });
          break;
        case 'messages':
          if (!conversationId) {
            throw new Error('Conversation ID is required for message search');
          }
          results = await searchMessages({
            query,
            conversationId,
            limit,
            offset
          });
          break;
        default:
          throw new Error('Invalid search type');
      }
      
      setSearchResults(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [type, conversationId]);

  useEffect(() => {
    performSearch(debouncedQuery, status, page);
  }, [debouncedQuery, status, page, performSearch]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setStatus('all');
    setPage(1);
    setSearchResults([]);
  }, []);

  return {
    searchResults,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    status,
    setStatus,
    page,
    setPage,
    conversationId,
    setConversationId,
    clearSearch
  };
}