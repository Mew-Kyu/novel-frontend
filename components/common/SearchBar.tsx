"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import apiClient from "@/lib/generated-api";

interface SearchResult {
  id: number;
  title: string;
  translatedTitle: string | null;
  description: string | null;
  coverImageUrl: string | null;
}

export const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (query.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    timeoutRef.current = setTimeout(async () => {
      try {
        const response = await apiClient.ai.semanticSearch({
          query: query.trim(),
          limit: 10,
        });

        setResults(response.data.results || []);
        setShowResults(true);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query]);

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setShowResults(false);
  };

  const handleResultClick = (storyId: number) => {
    console.log("Navigate to story:", storyId);
    setShowResults(false);
    // TODO: Navigate to /story/[id] when implemented
  };

  return (
    <div
      ref={searchRef}
      className="relative w-full max-w-2xl"
      suppressHydrationWarning
    >
      {/* Search Input */}
      <div className="relative" suppressHydrationWarning>
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgb(var(--text-muted))]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Bạn muốn đọc truyện gì? (Vd: Main bá đạo giấu nghề...)"
          className="w-full pl-12 pr-12 py-3 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-lg text-[rgb(var(--text))] placeholder:text-[rgb(var(--text-muted))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))] focus:border-transparent transition-all shadow-[0_1px_3px_0_rgb(0_0_0_/_0.1)] focus:shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1)]"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[rgb(var(--text-muted))] hover:text-[rgb(var(--text))] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {showResults && (
        <div className="absolute top-full mt-2 w-full bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-lg shadow-[0_10px_15px_-3px_rgb(0_0_0_/_0.1),_0_4px_6px_-4px_rgb(0_0_0_/_0.1)] max-h-96 overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-4 text-center text-[rgb(var(--text-muted))]">
              <div className="animate-spin w-6 h-6 border-2 border-[rgb(var(--primary))] border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-sm">Đang tìm kiếm...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result.id)}
                  className="w-full px-4 py-3 hover:bg-[rgb(var(--border))] transition-colors text-left flex gap-3"
                >
                  {/* Cover Image */}
                  {result.coverImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={result.coverImageUrl}
                      alt={result.title}
                      className="w-12 h-16 object-cover rounded flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-16 bg-[rgb(var(--border))] rounded flex-shrink-0 flex items-center justify-center">
                      <span className="text-[rgb(var(--text-muted))] text-xs">
                        No Image
                      </span>
                    </div>
                  )}

                  {/* Story Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-[rgb(var(--text))] truncate">
                      {result.translatedTitle || result.title}
                    </h3>
                    {result.translatedTitle && (
                      <p className="text-sm text-[rgb(var(--text-muted))] truncate">
                        {result.title}
                      </p>
                    )}
                    {result.description && (
                      <p className="text-sm text-[rgb(var(--text-muted))] line-clamp-2 mt-1">
                        {result.description.substring(0, 100)}...
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-[rgb(var(--text-muted))]">
              <p>Không tìm thấy kết quả</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
