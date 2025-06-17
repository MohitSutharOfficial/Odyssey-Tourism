
import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { getPopularDestinations } from "@/services/api";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar = ({ onSearch, placeholder = "Search destinations...", className }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load popular destinations for suggestions
  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        const destinations = await getPopularDestinations();
        setSuggestions(destinations);
      } catch (error) {
        console.error("Error loading suggestions:", error);
      }
    };

    loadSuggestions();
  }, []);

  // Filter suggestions based on query
  const filteredSuggestions = query
    ? suggestions.filter(s => s.toLowerCase().includes(query.toLowerCase()))
    : suggestions;

  // Handle search submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsLoading(true);
      onSearch(query);
      setShowSuggestions(false);
      
      // Simulate loading state
      setTimeout(() => {
        setIsLoading(false);
      }, 800);
    }
  };

  // Handle clicking outside suggestions to close them
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionRef.current && 
        !suggestionRef.current.contains(event.target as Node) &&
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={cn("relative w-full max-w-md mx-auto", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className="premium-input pr-12 w-full"
          autoComplete="off"
        />
        <button
          type="submit"
          className={cn(
            "absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full",
            "text-muted-foreground hover:text-accent transition-colors",
            isLoading && "animate-pulse"
          )}
          disabled={isLoading}
        >
          <Search className="h-5 w-5" />
        </button>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div 
          ref={suggestionRef}
          className="absolute z-20 mt-1 w-full bg-card border border-border rounded-lg shadow-lg overflow-hidden animate-fade-in"
        >
          <ul className="py-1">
            {filteredSuggestions.map((suggestion, index) => (
              <li key={index}>
                <button
                  type="button"
                  className="w-full text-left px-4 py-2 hover:bg-secondary transition-colors"
                  onClick={() => {
                    setQuery(suggestion);
                    setShowSuggestions(false);
                    onSearch(suggestion);
                  }}
                >
                  {suggestion}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
