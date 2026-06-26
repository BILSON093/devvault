import { useState, useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  initialPage?: number;
}

/**
 * Infinite scroll hook.
 * Returns a ref to attach to the scroll container and loading state.
 */
export function useInfiniteScroll<T>(
  fetchFn: (page: number) => Promise<{ list: T[]; total: number; totalPages: number }>,
  options: UseInfiniteScrollOptions = {}
) {
  const { threshold = 200, initialPage = 1 } = options;

  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const result = await fetchFn(page);
      setItems((prev) => [...prev, ...result.list]);
      setTotal(result.total);
      setHasMore(page < result.totalPages);
      setPage((p) => p + 1);
    } catch (err) {
      console.error('Infinite scroll load error:', err);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, fetchFn]);

  // Initial load
  useEffect(() => {
    loadMore();
  }, []);

  // Scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollHeight - scrollTop - clientHeight < threshold) {
        loadMore();
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [loadMore, threshold]);

  const reset = useCallback(() => {
    setItems([]);
    setPage(initialPage);
    setHasMore(true);
    setTotal(0);
  }, [initialPage]);

  return { items, loading, hasMore, total, containerRef, reset, loadMore };
}
