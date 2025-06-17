
import { TouristPlace } from "./api";

const ITINERARY_KEY = "odyssey-itinerary";

// Load itinerary from localStorage
export const loadItinerary = (): TouristPlace[] => {
  try {
    const itinerary = localStorage.getItem(ITINERARY_KEY);
    return itinerary ? JSON.parse(itinerary) : [];
  } catch (error) {
    console.error("Error loading itinerary from localStorage:", error);
    return [];
  }
};

// Save itinerary to localStorage
export const saveItinerary = (places: TouristPlace[]): void => {
  try {
    localStorage.setItem(ITINERARY_KEY, JSON.stringify(places));
  } catch (error) {
    console.error("Error saving itinerary to localStorage:", error);
  }
};

// Add a place to itinerary
export const addToItinerary = (place: TouristPlace): TouristPlace[] => {
  try {
    const currentItinerary = loadItinerary();
    
    // Check if place already exists
    if (!currentItinerary.some(p => p.id === place.id)) {
      const updatedItinerary = [...currentItinerary, place];
      saveItinerary(updatedItinerary);
      return updatedItinerary;
    }
    
    return currentItinerary;
  } catch (error) {
    console.error("Error adding place to itinerary:", error);
    return loadItinerary();
  }
};

// Remove a place from itinerary
export const removeFromItinerary = (placeId: string): TouristPlace[] => {
  try {
    const currentItinerary = loadItinerary();
    const updatedItinerary = currentItinerary.filter(place => place.id !== placeId);
    saveItinerary(updatedItinerary);
    return updatedItinerary;
  } catch (error) {
    console.error("Error removing place from itinerary:", error);
    return loadItinerary();
  }
};

// Clear the entire itinerary
export const clearItinerary = (): void => {
  try {
    localStorage.removeItem(ITINERARY_KEY);
  } catch (error) {
    console.error("Error clearing itinerary:", error);
  }
};
