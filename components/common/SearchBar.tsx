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
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Bạn muốn đọc truyện gì? (Vd: Main bá đạo giấu nghề...)"
          className="w-full pl-12 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {showResults && (
        <div className="absolute top-full mt-2 w-full bg-gray-900 border border-gray-800 rounded-lg shadow-2xl max-h-96 overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-4 text-center text-gray-400">
              <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-sm">Đang tìm kiếm...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result.id)}
                  className="w-full px-4 py-3 hover:bg-gray-800 transition-colors text-left flex gap-3"
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
                    <div className="w-12 h-16 bg-gray-800 rounded flex-shrink-0 flex items-center justify-center">
                      <span className="text-gray-600 text-xs">No Image</span>
                    </div>
                  )}

                  {/* Story Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white truncate">
                      {result.translatedTitle || result.title}
                    </h3>
                    {result.translatedTitle && (
                      <p className="text-sm text-gray-400 truncate">
                        {result.title}
                      </p>
                    )}
                    {result.description && (
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                        {result.description.substring(0, 100)}...
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-400">
              <p>Không tìm thấy kết quả</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
