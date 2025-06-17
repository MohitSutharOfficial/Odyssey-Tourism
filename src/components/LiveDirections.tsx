
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, CornerDownLeft, MapPin, Navigation, RotateCw, Compass } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";

interface LiveDirectionsProps {
  userLocation: { lat: number; lng: number } | null;
  destination: { lat: number; lng: number } | undefined;
  onClose: () => void;
}

type DirectionStep = {
  instruction: string;
  distance: string;
  duration: string;
  maneuver?: string;
}

// Define a more complete interface for Leaflet routing instructions
interface RouteInstructionWithIndex extends L.Routing.IInstruction {
  index: number;
  text: string;          
  distance: number;
  time: number;
  type?: string;
}

// Define a more complete interface for the route
interface ExtendedRoute extends L.Routing.IRoute {
  instructions: RouteInstructionWithIndex[];
  coordinates: L.LatLng[];
  summary: {
    totalDistance: number;
    totalTime: number;
  };
}

const LiveDirections = ({ userLocation, destination, onClose }: LiveDirectionsProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const destinationMarkerRef = useRef<L.Marker | null>(null);
  const routeRef = useRef<ExtendedRoute | null>(null);
  const routingControlRef = useRef<L.Routing.Control | null>(null);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [directions, setDirections] = useState<DirectionStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [distance, setDistance] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [isNavigating, setIsNavigating] = useState(true);
  const [bearing, setBearing] = useState(0);
  const [mapMode, setMapMode] = useState<'standard' | 'satellite'>('satellite');
  const [locationUpdateCount, setLocationUpdateCount] = useState(0);
  const [mapLoading, setMapLoading] = useState(true);
  const initializationAttempts = useRef(0);
  
  // Map layer URLs
  const mapLayers = {
    standard: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
  };
  
  // Initialize map once
  useEffect(() => {
    if (!userLocation || !destination) {
      console.error("LiveDirections missing data:", { userLocation, destination });
      toast.error("Missing location data for navigation");
      onClose();
      return;
    }
    
    let isMounted = true;
    setMapLoading(true);
    
    // Delay initialization to ensure DOM is ready
    const timer = setTimeout(() => {
      initializeMap();
    }, 500);
    
    function initializeMap() {
      try {
        if (!isMounted || !mapRef.current || isMapInitialized) return;
        
        // Ensure the map container has explicit dimensions before initializing
        if (mapRef.current) {
          mapRef.current.style.width = "100%";
          mapRef.current.style.minHeight = "500px"; // Increased minimum height
          mapRef.current.style.height = "100%"; 
        }
        
        console.log("Initializing map with refs:", {
          mapRef: mapRef.current,
          mapRefDimensions: mapRef.current ? { 
            width: mapRef.current.clientWidth,
            height: mapRef.current.clientHeight,
            offsetWidth: mapRef.current.offsetWidth,
            offsetHeight: mapRef.current.offsetHeight
          } : null,
          userLocation,
          destination,
          attempt: initializationAttempts.current + 1
        });
        
        // Import Leaflet explicitly to ensure it's loaded
        const leaflet = L;
        
        // Create custom icons
        const userIcon = leaflet.divIcon({
          className: 'custom-div-icon',
          html: `
            <div class="bg-primary text-white w-8 h-8 flex items-center justify-center rounded-full shadow-lg animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 32]
        });

        const destinationIcon = leaflet.divIcon({
          className: 'custom-div-icon',
          html: `
            <div class="bg-accent text-white w-8 h-8 flex items-center justify-center rounded-full shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 32]
        });
        
        // Initialize map with explicit dimensions and delay for proper DOM rendering
        setTimeout(() => {
          if (!mapRef.current || !isMounted) return;
          
          try {
            // Forcefully set explicit dimensions again right before map creation
            if (mapRef.current) {
              mapRef.current.style.width = "100%";
              mapRef.current.style.height = "500px"; // Hard-coded height
              mapRef.current.style.display = "block";
            }
            
            // Create the map with explicit container and dimensions
            const map = leaflet.map(mapRef.current, {
              zoomControl: false,
              attributionControl: true,
              fadeAnimation: true,
              zoomAnimation: true
            });
            
            // Add tile layer immediately to ensure it's visible
            const tileLayer = leaflet.tileLayer(mapLayers[mapMode], {
              attribution: '&copy; <a href="https://www.esri.com/en-us/home">Esri</a>',
              maxZoom: 19,
              className: "map-tiles"
            }).addTo(map);
            
            // Store the tile layer for later reference
            map.tileLayer = tileLayer as any;
            
            // Set initial view based on user location and destination
            const bounds = leaflet.latLngBounds([
              [userLocation.lat, userLocation.lng],
              [destination.lat, destination.lng]
            ]);
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
            
            // Force the map to refresh and redraw
            setTimeout(() => {
              if (map && map.invalidateSize) {
                map.invalidateSize(true);
                console.log("Map invalidateSize called");
              }
            }, 100);
            
            // Add multiple invalidation calls to ensure map renders properly
            const validateInterval = setInterval(() => {
              if (map && map.invalidateSize) {
                map.invalidateSize(true);
              }
            }, 500);
            
            setTimeout(() => clearInterval(validateInterval), 3000);
            
            // Add zoom controls in a more accessible position
            leaflet.control.zoom({ position: 'bottomright' }).addTo(map);
            
            // Add user marker with accuracy circle if user location is available
            if (userLocation) {
              userMarkerRef.current = leaflet.marker([userLocation.lat, userLocation.lng], { 
                icon: userIcon,
                zIndexOffset: 1000
              }).addTo(map);
              
              // Add accuracy circle
              const accuracyCircle = leaflet.circle([userLocation.lat, userLocation.lng], {
                radius: 30, // Assume 30m accuracy
                weight: 1,
                color: '#4338ca',
                fillColor: '#4338ca',
                fillOpacity: 0.15
              }).addTo(map);
              
              // Store accuracy circle
              if (userMarkerRef.current) {
                (userMarkerRef.current as any).accuracyCircle = accuracyCircle;
              }
            }
            
            // Add destination marker if destination is available
            if (destination) {
              destinationMarkerRef.current = leaflet.marker([destination.lat, destination.lng], { 
                icon: destinationIcon 
              }).addTo(map);
              
              // Add popup with destination info
              destinationMarkerRef.current.bindPopup("Your destination").openPopup();
            }
            
            // Calculate and display route if both user location and destination are available
            if (userLocation && destination) {
              try {
                console.log("Setting up routing between locations:", { 
                  from: [userLocation.lat, userLocation.lng],
                  to: [destination.lat, destination.lng]
                });
                
                // Create waypoints for routing
                const waypoints = [
                  leaflet.latLng(userLocation.lat, userLocation.lng),
                  leaflet.latLng(destination.lat, destination.lng)
                ];
                
                // Create the routing control
                const routing = leaflet.Routing.control({
                  waypoints: waypoints,
                  routeWhileDragging: false,
                  showAlternatives: false,
                  fitSelectedRoutes: true,
                  show: false, // Don't show the default UI
                  lineOptions: {
                    styles: [{ color: '#4C1D95', weight: 5, opacity: 0.8 }], // More visible route line
                    extendToWaypoints: true,
                    missingRouteTolerance: 0
                  },
                  createMarker: function() { return null; } // Don't create default markers
                });
                
                routing.addTo(map);
                
                // Listen for route calculation completion
                routing.on('routesfound', function(e: any) {
                  const routes = e.routes;
                  if (!routes || routes.length === 0) {
                    console.error("No routes found", e);
                    toast.error("Could not find a route to destination");
                    setMapLoading(false);
                    return;
                  }
                  
                  const route = routes[0] as ExtendedRoute; // Get the first (best) route
                  console.log("Route found", route);
                  
                  // Extract and format directions
                  if (route.instructions && Array.isArray(route.instructions)) {
                    const steps = route.instructions.map((instruction: RouteInstructionWithIndex) => ({
                      instruction: instruction.text,
                      distance: formatDistance(instruction.distance),
                      duration: formatTime(instruction.time),
                      maneuver: instruction.type
                    }));
                    
                    setDirections(steps);
                    
                    if (route.summary) {
                      setDistance(formatDistance(route.summary.totalDistance));
                      setDuration(formatTime(route.summary.totalTime));
                    }
                    
                    routeRef.current = route;
                    
                    // Determine the current step based on closest waypoint
                    if (userLocation && steps.length > 0) {
                      determineCurrentStep();
                    }
                  }
                  
                  // Ensure map is visible after route is calculated
                  map.invalidateSize(true);
                  
                  // Set map loading to false once route is found
                  setMapLoading(false);
                });
                
                routing.on('routingerror', function(e: any) {
                  console.error("Routing error:", e);
                  toast.error("Unable to calculate route to destination", {
                    description: "Please try again or choose a different destination"
                  });
                  setMapLoading(false);
                });
                
                // Store routing control for later use
                routingControlRef.current = routing;
                
                // Force route calculation
                routing.route();
              } catch (routingError) {
                console.error("Error setting up routing:", routingError);
                toast.error("Failed to set up navigation route");
                setMapLoading(false);
              }
            } else {
              setMapLoading(false);
            }
            
            // Add layer control button (custom)
            const LayerControl = leaflet.Control.extend({
              options: {
                position: 'topright'
              },
              onAdd: function() {
                const container = leaflet.DomUtil.create('div', 'leaflet-bar leaflet-control');
                const button = leaflet.DomUtil.create('a', 'bg-white p-2 flex items-center justify-center', container);
                button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/></svg>';
                button.href = '#';
                button.title = 'Toggle Map Mode';
                
                leaflet.DomEvent.on(button, 'click', function(e) {
                  leaflet.DomEvent.stopPropagation(e);
                  leaflet.DomEvent.preventDefault(e);
                  
                  const newMode = mapMode === 'standard' ? 'satellite' : 'standard';
                  setMapMode(newMode);
                  
                  // Update tile layer
                  if (map.tileLayer) {
                    map.tileLayer.setUrl(mapLayers[newMode]);
                  }
                  
                  // Show toast notification
                  toast.success(`Switched to ${newMode} view`);
                });
                
                return container;
              }
            });
            
            map.addControl(new LayerControl());
            
            // Store the map instance and set initialization flag
            mapInstanceRef.current = map;
            setIsMapInitialized(true);
            console.log("Map initialized successfully");
            
          } catch (error) {
            console.error("Error creating map instance:", error);
            setMapLoading(false);
            toast.error("Failed to initialize map");
          }
        }, 200);
        
      } catch (error) {
        console.error("Error initializing map:", error);
        
        // Attempt to retry initialization if under 3 attempts
        initializationAttempts.current += 1;
        if (initializationAttempts.current < 3) {
          console.log(`Retrying map initialization (attempt ${initializationAttempts.current + 1})`);
          setTimeout(initializeMap, 500);
        } else {
          toast.error("Failed to load navigation map", {
            description: "Please try again or refresh the page"
          });
          setMapLoading(false);
        }
      }
    }
    
    return () => {
      clearTimeout(timer);
      isMounted = false;
      
      // Clean up routing control if it exists
      if (routingControlRef.current && mapInstanceRef.current) {
        try {
          mapInstanceRef.current.removeControl(routingControlRef.current);
        } catch (error) {
          console.error("Error cleaning up routing control:", error);
        }
      }
      
      // Clean up map instance
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        } catch (error) {
          console.error("Error cleaning up map:", error);
        }
      }
    };
  }, [destination, onClose, mapMode]);

  // Update user marker position and re-route when location significantly changes
  useEffect(() => {
    if (!isMapInitialized || !userLocation || !mapInstanceRef.current || !userMarkerRef.current) return;
    
    try {
      // Move the user marker
      userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
      
      // Update accuracy circle
      const accuracyCircle = (userMarkerRef.current as any).accuracyCircle;
      if (accuracyCircle) {
        accuracyCircle.setLatLng([userLocation.lat, userLocation.lng]);
      }
      
      // Only center map on user if actively navigating
      if (isNavigating && mapInstanceRef.current) {
        mapInstanceRef.current.panTo([userLocation.lat, userLocation.lng]);
      }
      
      // Calculate bearing/heading if we have previous location data
      const prevLocation = (userMarkerRef.current as any)._previousLocation;
      if (prevLocation) {
        const heading = calculateBearing(
          prevLocation.lat, prevLocation.lng,
          userLocation.lat, userLocation.lng
        );
        
        if (!isNaN(heading)) {
          setBearing(heading);
        }
      }
      
      // Store current location for next comparison
      (userMarkerRef.current as any)._previousLocation = { ...userLocation };
      
      // Update location update counter
      setLocationUpdateCount(prev => prev + 1);
      
      // Re-route every 10 location updates (to prevent too frequent recalculations)
      if (locationUpdateCount % 10 === 0 && destination && routingControlRef.current) {
        try {
          // Update route waypoints
          routingControlRef.current.setWaypoints([
            L.latLng(userLocation.lat, userLocation.lng),
            L.latLng(destination.lat, destination.lng)
          ]);
        } catch (error) {
          console.error("Error updating route:", error);
        }
      }
      
      // Determine current navigation step
      determineCurrentStep();
    } catch (error) {
      console.error("Error updating user location:", error);
    }
    
  }, [userLocation, isMapInitialized, isNavigating, destination, locationUpdateCount]);
  
  // Helper function to determine current step based on user location
  const determineCurrentStep = () => {
    if (!routeRef.current || !userLocation) return;
    
    try {
      // Get coordinates of all steps
      const coordinates = routeRef.current.coordinates;
      
      if (!coordinates || coordinates.length === 0) return;
      
      // Find the closest waypoint to the user's current location
      let closestDistance = Infinity;
      let closestIndex = 0;
      
      coordinates.forEach((coord, index) => {
        const distance = calculateDistance(
          userLocation.lat, userLocation.lng,
          coord.lat, coord.lng
        );
        
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });
      
      // Find which instruction this waypoint belongs to
      const instructions = routeRef.current.instructions;
      let currentStepIndex = 0;
      
      for (let i = 0; i < instructions.length; i++) {
        if (closestIndex <= instructions[i].index) {
          currentStepIndex = i;
          break;
        }
      }
      
      if (currentStepIndex !== currentStep) {
        setCurrentStep(currentStepIndex);
      }
    } catch (error) {
      console.error("Error determining current step:", error);
    }
  };
  
  // Helper functions
  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    } else {
      return `${(meters / 1000).toFixed(1)} km`;
    }
  };
  
  const formatTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds} sec`;
    } else if (seconds < 3600) {
      return `${Math.floor(seconds / 60)} min`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      return `${hours} hr ${mins} min`;
    }
  };
  
  const calculateBearing = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    // Convert to radians
    const startLat = lat1 * (Math.PI / 180);
    const startLng = lon1 * (Math.PI / 180);
    const destLat = lat2 * (Math.PI / 180);
    const destLng = lon2 * (Math.PI / 180);
    
    // Calculate bearing
    const y = Math.sin(destLng - startLng) * Math.cos(destLat);
    const x = Math.cos(startLat) * Math.sin(destLat) -
              Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
    let bearing = Math.atan2(y, x) * (180 / Math.PI);
    bearing = (bearing + 360) % 360; // Normalize to 0-360
    
    return Math.round(bearing);
  };
  
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  };
  
  const toggleNavigation = () => {
    setIsNavigating(!isNavigating);
    toast.success(isNavigating ? "Manual navigation mode" : "Auto-follow mode enabled");
  };
  
  const recenterMap = () => {
    if (!mapInstanceRef.current) return;
    
    if (userLocation) {
      mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], 15, {
        animate: true,
        duration: 0.5
      });
      setIsNavigating(true);
      toast.success("Map recentered on your location");
    } else if (destination) {
      // If user location not available, center on destination
      mapInstanceRef.current.setView([destination.lat, destination.lng], 15, {
        animate: true,
        duration: 0.5
      });
      toast.success("Map centered on destination");
    }
    
    // Force redraw
    mapInstanceRef.current.invalidateSize(true);
  };
  
  const getDirectionFromBearing = (bearing: number): string => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(bearing / 45) % 8;
    return directions[index];
  };
  
  // Force map to refresh on window resize
  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="flex flex-col h-full rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="bg-primary text-primary-foreground p-3 flex items-center justify-between">
        <button 
          onClick={onClose}
          className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Map
        </button>
        <div className="flex items-center gap-1 text-sm">
          <MapPin className="h-4 w-4" />
          <span>Live Navigation</span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={toggleNavigation}
            className={cn(
              "p-1.5 rounded-full", 
              isNavigating ? "bg-primary-foreground/20" : "bg-transparent"
            )}
            title={isNavigating ? "Pause auto-follow" : "Resume auto-follow"}
          >
            <Navigation className="h-4 w-4" />
          </button>
          
          <button 
            onClick={recenterMap}
            className="p-1.5 rounded-full hover:bg-primary-foreground/20"
            title="Recenter map"
          >
            <RotateCw className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="relative flex-grow flex" style={{ minHeight: '500px', height: '500px' }}>
        {/* Map loading overlay */}
        {mapLoading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-20 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-sm font-medium">Loading map...</p>
            </div>
          </div>
        )}
        
        {/* The map container - explicitly set dimensions */}
        <div 
          ref={mapRef} 
          className="absolute inset-0 w-full h-full z-10"
          style={{ width: "100%", height: "500px" }}
        />
        
        {/* Navigation overlay */}
        <div className="absolute z-30 bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm p-4 shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="text-xs text-muted-foreground">TOTAL DISTANCE</p>
              <p className="font-bold">{distance || "Calculating..."}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">ESTIMATED TIME</p>
              <p className="font-bold">{duration || "Calculating..."}</p>
            </div>
            <div className="flex items-center">
              <div>
                <p className="text-xs text-muted-foreground">HEADING</p>
                <p className="font-bold">{bearing}° {getDirectionFromBearing(bearing)}</p>
              </div>
              <Compass className="h-5 w-5 ml-1.5 text-muted-foreground" 
                style={{ transform: `rotate(${bearing}deg)` }} />
            </div>
          </div>
          
          {directions.length > 0 ? (
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex items-center gap-2">
                <div className="bg-accent text-white p-1.5 rounded-full">
                  <CornerDownLeft className="h-4 w-4" />
                </div>
                <div className="flex-grow">
                  <p className="font-medium">
                    {directions[currentStep]?.instruction || "Calculating route..."}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {directions[currentStep]?.distance || ""}
                    {directions[currentStep] && " • "}
                    {directions[currentStep]?.duration || ""}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex items-center justify-center">
                <p className="text-sm">Calculating the best route...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveDirections;
