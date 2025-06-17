
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { TouristPlace } from "@/services/api";
import { 
  loadItinerary, 
  saveItinerary, 
  addToItinerary as addPlace, 
  removeFromItinerary as removePlace 
} from "@/services/localStorage";
import { toast } from "sonner";

interface ItineraryContextType {
  itinerary: TouristPlace[];
  addToItinerary: (place: TouristPlace) => void;
  removeFromItinerary: (placeId: string) => void;
  clearItinerary: () => void;
  isInItinerary: (placeId: string) => boolean;
}

const ItineraryContext = createContext<ItineraryContextType | undefined>(undefined);

export const ItineraryProvider = ({ children }: { children: ReactNode }) => {
  const [itinerary, setItinerary] = useState<TouristPlace[]>([]);

  // Load itinerary from localStorage on initial render
  useEffect(() => {
    setItinerary(loadItinerary());
  }, []);

  // Add a place to itinerary
  const addToItinerary = (place: TouristPlace) => {
    if (isInItinerary(place.id)) {
      toast.info(`${place.name} is already in your itinerary`);
      return;
    }
    
    const updatedItinerary = addPlace(place);
    setItinerary(updatedItinerary);
    toast.success(`Added ${place.name} to your itinerary`);
  };

  // Remove a place from itinerary
  const removeFromItinerary = (placeId: string) => {
    const placeToRemove = itinerary.find(place => place.id === placeId);
    const updatedItinerary = removePlace(placeId);
    setItinerary(updatedItinerary);
    
    if (placeToRemove) {
      toast.success(`Removed ${placeToRemove.name} from your itinerary`);
    }
  };

  // Clear entire itinerary
  const clearItinerary = () => {
    saveItinerary([]);
    setItinerary([]);
    toast.success("Cleared your itinerary");
  };

  // Check if place is in itinerary
  const isInItinerary = (placeId: string): boolean => {
    return itinerary.some(place => place.id === placeId);
  };

  return (
    <ItineraryContext.Provider
      value={{
        itinerary,
        addToItinerary,
        removeFromItinerary,
        clearItinerary,
        isInItinerary,
      }}
    >
      {children}
    </ItineraryContext.Provider>
  );
};

export const useItinerary = () => {
  const context = useContext(ItineraryContext);
  if (context === undefined) {
    throw new Error("useItinerary must be used within an ItineraryProvider");
  }
  return context;
};
