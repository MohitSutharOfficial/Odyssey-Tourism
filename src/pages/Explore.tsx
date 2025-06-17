
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "@/components/SearchBar";
import PlaceCard from "@/components/PlaceCard";
import Map from "@/components/Map";
import { TouristPlace, searchPlaces } from "@/services/api";
import { Loader2, Info, Briefcase, Filter, ChevronDown, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Explore = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("query") || "";
  
  const [places, setPlaces] = useState<TouristPlace[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<TouristPlace[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showBusinessOnly, setShowBusinessOnly] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [hoveredPlaceId, setHoveredPlaceId] = useState<string | null>(null);

  // Extract unique categories from places
  const categories = [...new Set(places.map(place => place.category))];

  // Handle search functionality
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsLoading(true);
    setHasSearched(true);
    setShowBusinessOnly(false);
    setCategoryFilter("all");
    
    try {
      const results = await searchPlaces(query);
      setPlaces(results);
      setFilteredPlaces(results);
    } catch (error) {
      console.error("Error searching places:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle business-friendly places
  const toggleBusinessPlaces = async () => {
    setIsLoading(true);
    
    try {
      if (!showBusinessOnly) {
        const businessPlaces = places.filter(place => place.businessFeatures?.isBusinessFriendly);
        setFilteredPlaces(businessPlaces);
      } else {
        setFilteredPlaces(places);
      }
      
      setShowBusinessOnly(!showBusinessOnly);
    } catch (error) {
      console.error("Error filtering business places:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle category filtering
  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    
    if (value === "all") {
      // If no category is selected, show all places or business places if that filter is active
      setFilteredPlaces(showBusinessOnly 
        ? places.filter(place => place.businessFeatures?.isBusinessFriendly)
        : places);
      return;
    }
    
    // Apply category filter (and business filter if active)
    const filtered = places.filter(place => {
      const matchesCategory = place.category === value;
      const matchesBusiness = !showBusinessOnly || place.businessFeatures?.isBusinessFriendly;
      return matchesCategory && matchesBusiness;
    });
    
    setFilteredPlaces(filtered);
  };

  // Mouse enter handler for place cards - using useCallback to optimize performance
  const handleMouseEnterPlace = useCallback((placeId: string) => {
    setHoveredPlaceId(placeId);
  }, []);

  // Mouse leave handler for place cards
  const handleMouseLeavePlace = useCallback(() => {
    setHoveredPlaceId(null);
  }, []);

  // Load places on initial render if query is present
  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Explore Destinations</h1>
        <p className="text-muted-foreground mb-6">
          Discover amazing tourist attractions and create your perfect itinerary.
        </p>
        
        <Card className="p-4 bg-card/50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1 w-full">
              <SearchBar 
                onSearch={handleSearch} 
                placeholder="Search for a city (e.g., Ahmedabad)"
                className="w-full"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    onClick={toggleBusinessPlaces}
                    variant={showBusinessOnly ? "default" : "outline"}
                    className="w-full sm:w-auto flex items-center gap-1.5"
                  >
                    <Briefcase className="h-4 w-4" />
                    <span>Business Friendly</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Show only business-friendly places</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {searchQuery && !isLoading && (
            <div className="mt-4 flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              <span>Showing results for "{searchQuery}"</span>
              {filteredPlaces.length > 0 && (
                <Badge variant="outline" className="ml-2">
                  {filteredPlaces.length} places found
                </Badge>
              )}
            </div>
          )}
        </Card>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-12 w-12 text-accent animate-spin mb-4" />
          <p className="text-muted-foreground">Searching for places in {searchQuery}...</p>
        </div>
      ) : hasSearched ? (
        filteredPlaces.length > 0 ? (
          <div>
            {/* Filters section - Additional contextual help */}
            <div className="mb-6 flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Hints:</span>
              </div>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                    <Info className="h-4 w-4" />
                    <span>Travel Tips</span>
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-2">
                    <h3 className="font-medium">Travel Tips for {searchQuery}</h3>
                    <p className="text-sm text-muted-foreground">
                      • Hover over a place card to highlight its location on the map
                    </p>
                    <p className="text-sm text-muted-foreground">
                      • Click any card to see detailed information and reviews
                    </p>
                    <p className="text-sm text-muted-foreground">
                      • Use filters to find places that match your interests
                    </p>
                    <p className="text-sm text-muted-foreground">
                      • Add places to your itinerary to plan your trip
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Map 
                  places={filteredPlaces} 
                  className="mb-6 lg:mb-0 sticky top-20 h-[410px] lg:h-[600px]" 
                  hoveredPlaceId={hoveredPlaceId}
                />
              </div>
              
              <div className="space-y-6">
                <h2 className="text-xl font-semibold flex items-center">
                  Tourist Places
                  <Badge variant="outline" className="ml-2">
                    {filteredPlaces.length}
                  </Badge>
                </h2>
                
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
                  {filteredPlaces.map((place) => (
                    <PlaceCard 
                      key={place.id} 
                      place={place} 
                      onMouseEnter={() => handleMouseEnterPlace(place.id)}
                      onMouseLeave={handleMouseLeavePlace}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-muted/50 p-4 rounded-full mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">No places found</h3>
            <p className="text-muted-foreground max-w-md">
              {showBusinessOnly 
                ? "No business-friendly places found. Try disabling the business filter."
                : categoryFilter !== "all"
                  ? `No places found in the "${categoryFilter}" category. Try a different category.`
                  : `We couldn't find any tourist places in "${searchQuery}". Try searching for a different city like "Ahmedabad".`}
            </p>
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-accent/10 p-4 rounded-full mb-4">
            <MapPin className="h-8 w-8 text-accent" />
          </div>
          <h3 className="text-xl font-medium mb-2">Search for a destination</h3>
          <p className="text-muted-foreground max-w-md">
            Enter a city name in the search bar above to discover tourist attractions.
            Try searching for "Ahmedabad" to see demo results.
          </p>
        </div>
      )}
    </div>
  );
};

export default Explore;
