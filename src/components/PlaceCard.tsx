
import { useState } from "react";
import { Star, Plus, Minus, Globe, Clock, Wifi, Users, ArrowUpRight, MapPin, Info, Camera, Calendar } from "lucide-react";
import { useItinerary } from "@/context/ItineraryContext";
import { TouristPlace } from "@/services/api";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import PlaceDetails from "@/components/PlaceDetails";
import { useIsMobile } from "@/hooks/use-mobile";

interface PlaceCardProps {
  place: TouristPlace;
  variant?: "default" | "itinerary";
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const PlaceCard = ({ 
  place, 
  variant = "default", 
  className,
  onMouseEnter,
  onMouseLeave
}: PlaceCardProps) => {
  const { addToItinerary, removeFromItinerary, isInItinerary } = useItinerary();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const isInUserItinerary = isInItinerary(place.id);
  
  const handleAddRemove = (e: React.MouseEvent) => {
    // Stop propagation to prevent opening the details dialog
    e.stopPropagation();
    
    if (variant === "itinerary" || isInUserItinerary) {
      removeFromItinerary(place.id);
    } else {
      addToItinerary(place);
    }
  };

  const handleImageError = () => {
    setImageError(true);
    // Use a fallback image
    setImageLoaded(true);
  };

  // Handle card hover with limited rate of events to reduce lag
  const handleMouseEnter = () => {
    if (onMouseEnter) {
      requestAnimationFrame(() => {
        onMouseEnter();
      });
    }
  };

  const handleMouseLeave = () => {
    if (onMouseLeave) {
      requestAnimationFrame(() => {
        onMouseLeave();
      });
    }
  };
  
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <div 
          className={cn(
            "glass-card overflow-hidden group hover:shadow-md transition-all duration-300 cursor-pointer",
            className
          )}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Image Container */}
          <div className="relative h-48 overflow-hidden">
            {/* Image Loading Placeholder */}
            <div className={cn(
              "absolute inset-0 bg-muted animate-pulse",
              imageLoaded ? "opacity-0" : "opacity-100"
            )} />
            
            <img 
              src={imageError ? "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?q=80&w=600" : place.imageUrl} 
              alt={place.name}
              className={cn(
                "w-full h-full object-cover transition-all duration-500",
                "group-hover:scale-105 ease-out",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setImageLoaded(true)}
              onError={handleImageError}
            />
            
            {/* Rating Badge */}
            <div className="absolute top-3 left-3 flex items-center bg-black/60 text-white px-2 py-1 rounded-full text-sm backdrop-blur-sm">
              <Star className="h-3.5 w-3.5 text-yellow-400 mr-1" />
              <span>{place.rating}/5</span>
            </div>

            {/* Business Badge */}
            {place.businessFeatures?.isBusinessFriendly && (
              <div className="absolute top-3 right-3 flex items-center bg-accent/80 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm">
                <Users className="h-3 w-3 mr-1" />
                <span>Business Friendly</span>
              </div>
            )}
            
            {/* Location Indicator */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm">
              <MapPin className="h-3 w-3" />
              <span>{place.address}</span>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-4">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-medium text-lg tracking-tight">{place.name}</h3>
              
              <HoverCard>
                <HoverCardTrigger asChild>
                  <button 
                    className="text-muted-foreground hover:text-foreground"
                    onClick={(e) => e.stopPropagation()} // Stop propagation to prevent opening the details dialog
                  >
                    <Info className="h-4 w-4" />
                  </button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">{place.name}</h4>
                    <p className="text-xs text-muted-foreground">{place.description}</p>
                    
                    {place.specialFeatures && place.specialFeatures.length > 0 && (
                      <div className="mt-2">
                        <h5 className="text-xs font-medium mb-1">Special Features:</h5>
                        <ul className="text-xs text-muted-foreground list-disc ml-4 space-y-1">
                          {place.specialFeatures.map((feature, idx) => (
                            <li key={idx}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {place.bestTimeToVisit && (
                      <div className="text-xs">
                        <span className="font-medium">Best time to visit: </span>
                        {place.bestTimeToVisit}
                      </div>
                    )}
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
            
            <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
              {place.description}
            </p>
            
            {/* Feature Badges */}
            <div className="flex flex-wrap gap-1 mb-3">
              <Badge variant="outline" className="text-xs bg-secondary/20">
                {place.category}
              </Badge>
              
              {place.bestTimeToVisit && (
                <Badge variant="outline" className="text-xs flex items-center gap-1 bg-secondary/20">
                  <Calendar className="h-3 w-3" />
                  <span>Best Time: {place.bestTimeToVisit.split(" ").slice(0, 2).join(" ")}</span>
                </Badge>
              )}
              
              {place.specialFeatures && place.specialFeatures.length > 0 && (
                <Badge variant="outline" className="text-xs flex items-center gap-1 bg-secondary/20">
                  <Camera className="h-3 w-3" />
                  <span>{place.specialFeatures.length} Features</span>
                </Badge>
              )}
            </div>
            
            {/* Business Features Section */}
            {place.businessFeatures && (
              <div className="mb-3 space-y-1.5">
                {place.businessFeatures.openingHours && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1.5" />
                    <span>{place.businessFeatures.openingHours}</span>
                  </div>
                )}
                
                {place.businessFeatures.website && (
                  <div className="flex items-center text-xs text-accent hover:underline">
                    <Globe className="h-3 w-3 mr-1.5" />
                    <a 
                      href={place.businessFeatures.website.startsWith('http') ? place.businessFeatures.website : `https://${place.businessFeatures.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center"
                      onClick={(e) => e.stopPropagation()} // Stop propagation to prevent opening the details dialog
                    >
                      {place.businessFeatures.website.replace(/^(https?:\/\/)?(www\.)?/, '')}
                      <ArrowUpRight className="h-2.5 w-2.5 ml-1" />
                    </a>
                  </div>
                )}
                
                {place.businessFeatures.wifiAvailable && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Wifi className="h-3 w-3 mr-1.5" />
                    <span>Free WiFi</span>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">{place.category}</span>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleAddRemove}
                      className={cn(
                        "flex items-center justify-center p-2 rounded-full transition-all",
                        variant === "itinerary" || isInUserItinerary
                          ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                          : "bg-accent/10 text-accent hover:bg-accent/20"
                      )}
                      aria-label={variant === "itinerary" || isInUserItinerary ? "Remove place" : "Add place"}
                    >
                      {variant === "itinerary" || isInUserItinerary ? (
                        <Minus className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{variant === "itinerary" || isInUserItinerary ? "Remove from itinerary" : "Add to itinerary"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="p-0 h-[90vh] overflow-hidden">
        <DialogTitle className="sr-only">{place.name}</DialogTitle>
        <DialogDescription className="sr-only">Details about {place.name}</DialogDescription>
        <PlaceDetails place={place} onClose={() => setDialogOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default PlaceCard;
