/**
 * useSearch — Custom hook for real-time trend search with debouncing
 * 
 * @param {string} query - Search query
 * @param {number} debounceMs - Debounce delay in milliseconds
 * @returns {{ trends, loading, error, total, page, totalPages, fetchPage }}
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000';

export function useSearch(query, debounceMs = 500) {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);

  const abortRef = useRef(null);
  const LIMIT = 10;

  const fetchPage = useCallback(async (q, p = 1) => {
    if (!q || q.trim().length < 2) {
      setTrends([]);
      setTotal(0);
      setTotalPages(0);
      return;
    }

    // Cancel previous request
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(`${API_BASE}/api/search`, {
        params: { q: q.trim(), page: p, limit: LIMIT },
        signal: abortRef.current.signal,
        withCredentials: true,
      });

      if (p === 1) {
        setTrends(res.data.trends || []);
      } else {
        setTrends(prev => [...prev, ...(res.data.trends || [])]);
      }
      setTotal(res.data.total || 0);
      setTotalPages(res.data.totalPages || 0);
      setPage(p);
    } catch (err) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') return;
      console.error('Search failed:', err);
      setError(err.response?.data?.error || 'Search failed. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchPage(query, 1);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs, fetchPage]);

  const loadMore = useCallback(() => {
    if (page < totalPages && !loading) {
      fetchPage(query, page + 1);
    }
  }, [page, totalPages, loading, query, fetchPage]);

  return { trends, loading, error, total, page, totalPages, loadMore, hasMore: page < totalPages };
}

export default useSearch;
