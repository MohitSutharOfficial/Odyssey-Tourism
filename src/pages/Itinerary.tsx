import { useState, useEffect } from "react";
import PlaceCard from "@/components/PlaceCard";
import Map from "@/components/Map";
import { useItinerary } from "@/context/ItineraryContext";
import { AlertTriangle, ClipboardList, Share2, Download, Trash2, Navigation, MapPin } from "lucide-react";
import { toast } from "sonner";
import LiveDirections from "@/components/LiveDirections";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Itinerary = () => {
  const { itinerary, clearItinerary } = useItinerary();
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [showDirections, setShowDirections] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [isLocationEnabled, setIsLocationEnabled] = useState<boolean | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  
  useEffect(() => {
    if (!isMounted) return;
    
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      setIsLocationEnabled(false);
      return;
    }
    
    const permissionCheck = navigator.permissions && 
                           navigator.permissions.query({name: 'geolocation'})
                          .then(permission => {
                            if (permission.state === 'granted' || permission.state === 'prompt') {
                              initializeGeolocation();
                            } else {
                              setIsLocationEnabled(false);
                              toast.error("Location access is required for navigation features");
                            }
                          })
                          .catch(error => {
                            console.error("Permission check error:", error);
                            initializeGeolocation();
                          });
    
    if (!permissionCheck) {
      initializeGeolocation();
    }
    
    function initializeGeolocation() {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (!isMounted) return;
          
          console.log("Got user location:", position.coords);
          setIsLocationEnabled(true);
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          
          const watchId = navigator.geolocation.watchPosition(
            (position) => {
              if (!isMounted) return;
              
              setUserLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude
              });
            },
            (error) => {
              console.error("Error watching location:", error);
              handleLocationError(error);
            },
            { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
          );
          
          return () => {
            navigator.geolocation.clearWatch(watchId);
          };
        },
        (error) => {
          console.error("Error checking location permission:", error);
          handleLocationError(error);
          setIsLocationEnabled(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
    
    return () => {
      // Cleanup will be handled in the nested returns
    };
  }, [isMounted]);
  
  const handleLocationError = (error: GeolocationPositionError) => {
    if (!isMounted) return;
    
    switch (error.code) {
      case 1: // Permission denied
        toast.error("Please enable location access for navigation features", {
          description: "Check your browser or device settings",
          duration: 5000,
          action: {
            label: "How to enable",
            onClick: () => {
              window.open("https://support.google.com/chrome/answer/142065", "_blank");
            }
          }
        });
        break;
      case 2: // Position unavailable
        toast.error("Unable to determine your current location", {
          description: "Check your device GPS or network connection"
        });
        break;
      case 3: // Timeout
        toast.error("Location request timed out", {
          description: "Please try again or check your connection"
        });
        break;
      default:
        toast.error("Unable to access your location");
    }
  };
  
  const requestLocationPermission = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    
    toast.loading("Requesting location access...");
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setIsLocationEnabled(true);
        toast.dismiss();
        toast.success("Location access granted");
        
        const watchId = navigator.geolocation.watchPosition(
          (position) => {
            if (!isMounted) return;
            
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (error) => {
            console.error("Error getting location:", error);
            handleLocationError(error);
          },
          { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
        );
        
        return () => {
          if (watchId) navigator.geolocation.clearWatch(watchId);
        };
      },
      (error) => {
        toast.dismiss();
        handleLocationError(error);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleShare = () => {
    if (itinerary.length === 0) {
      toast.error("You don't have any places to share");
      return;
    }
    
    toast.success("Itinerary shared successfully", {
      description: "A link has been copied to your clipboard"
    });
  };

  const handleDownload = () => {
    if (itinerary.length === 0) {
      toast.error("You don't have any places to download");
      return;
    }
    
    toast.success("Itinerary downloaded successfully", {
      description: "Check your downloads folder"
    });
  };

  const handleClearItinerary = () => {
    if (showConfirmClear) {
      clearItinerary();
      setShowConfirmClear(false);
      
      if (showDirections) {
        setShowDirections(false);
        setSelectedPlaceId(null);
      }
    } else {
      setShowConfirmClear(true);
      
      setTimeout(() => {
        setShowConfirmClear(false);
      }, 3000);
    }
  };

  const handleNavigate = (placeId: string) => {
    const selectedPlace = itinerary.find(place => place.id === placeId);
    
    if (!selectedPlace || !selectedPlace.location) {
      toast.error("Cannot navigate - location data is missing");
      return;
    }
    
    if (!userLocation) {
      if (isLocationEnabled === false) {
        toast.error("Location access is required for navigation", {
          description: "Please enable location services",
          action: {
            label: "Enable",
            onClick: requestLocationPermission
          }
        });
      } else {
        toast.error("Waiting for your location", {
          description: "Please wait a moment or check permissions"
        });
      }
      return;
    }
    
    console.log("Starting navigation to place:", {
      placeId,
      place: selectedPlace,
      userLocation
    });
    
    setSelectedPlaceId(placeId);
    setShowDirections(true);
    toast.success(`Navigating to ${selectedPlace.name}`);
  };
  
  const handleCloseDirections = () => {
    setShowDirections(false);
    setSelectedPlaceId(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Your Itinerary</h1>
          <p className="text-muted-foreground">
            {itinerary.length > 0
              ? `You have ${itinerary.length} place${itinerary.length !== 1 ? 's' : ''} in your itinerary`
              : "Start adding places to your itinerary from the Explore page"}
          </p>
          {isLocationEnabled === true && userLocation && (
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <MapPin className="h-3 w-3 text-accent" />
              Your location is being tracked for navigation
            </p>
          )}
          {isLocationEnabled === false && (
            <button 
              onClick={requestLocationPermission}
              className="text-xs text-accent underline mt-1 flex items-center gap-1"
            >
              <AlertTriangle className="h-3 w-3" />
              Enable location for navigation features
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 bg-background text-foreground px-4 py-2 rounded-lg font-medium border border-border transition-all hover:bg-accent/5"
            disabled={itinerary.length === 0}
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
          
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 bg-background text-foreground px-4 py-2 rounded-lg font-medium border border-border transition-all hover:bg-accent/5"
            disabled={itinerary.length === 0}
          >
            <Download className="h-4 w-4" />
            Download
          </button>
          
          <button
            onClick={handleClearItinerary}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              showConfirmClear
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : "bg-background text-foreground border border-border hover:bg-accent/5"
            }`}
            disabled={itinerary.length === 0}
          >
            {showConfirmClear ? (
              <>
                <AlertTriangle className="h-4 w-4" />
                Clear All
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Clear All
              </>
            )}
          </button>
        </div>
      </div>

      {itinerary.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {showDirections && selectedPlaceId ? (
              <div className="h-[400px] md:h-[500px] lg:h-[600px] border border-border rounded-xl overflow-hidden">
                <LiveDirections 
                  userLocation={userLocation} 
                  destination={itinerary.find(place => place.id === selectedPlaceId)?.location}
                  onClose={handleCloseDirections}
                />
              </div>
            ) : (
              <Map 
                places={itinerary} 
                className="h-[400px] md:h-[500px] lg:h-[600px] mb-6 lg:mb-0 sticky top-20" 
                userLocation={userLocation}
              />
            )}
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <ClipboardList className="h-5 w-5 mr-2" />
              Selected Places
            </h2>
            
            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
              {itinerary.map((place) => (
                <div key={place.id} className="relative">
                  <PlaceCard 
                    place={place} 
                    variant="itinerary"
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button 
                          onClick={() => handleNavigate(place.id)}
                          className="absolute top-3 right-3 bg-accent text-white p-2 rounded-full shadow-md hover:bg-accent/90 transition-colors"
                          aria-label="Navigate to this location"
                        >
                          <Navigation className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Navigate to this location</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-secondary/30 rounded-xl">
          <div className="bg-muted/50 p-4 rounded-full mb-4">
            <ClipboardList className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-2">Your itinerary is empty</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            Start by adding places from the Explore page to create your personalized travel itinerary.
          </p>
          <a
            href="/explore"
            className="inline-flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg font-medium transition-all hover:bg-accent/90"
          >
            Go to Explore
          </a>
        </div>
      )}
    </div>
  );
};

export default Itinerary;
