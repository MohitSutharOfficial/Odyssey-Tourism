
import { useEffect, useRef, useState } from "react";
import { TouristPlace } from "@/services/api";
import "leaflet/dist/leaflet.css";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Layers } from "lucide-react";

interface MapProps {
  places: TouristPlace[];
  center?: [number, number];
  zoom?: number;
  className?: string;
  hoveredPlaceId?: string | null;
  userLocation?: { lat: number; lng: number } | null;
}

const Map = ({ places, center = [23.0225, 72.5714], zoom = 12, className, hoveredPlaceId, userLocation }: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const userMarkerRef = useRef<any>(null);
  const [defaultIcon, setDefaultIcon] = useState<any>(null);
  const [highlightedIcon, setHighlightedIcon] = useState<any>(null);
  const [userIcon, setUserIcon] = useState<any>(null);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [mapMode, setMapMode] = useState<'standard' | 'satellite'>('standard');
  
  // Map layer URLs
  const mapLayers = {
    standard: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
  };

  // Initialize map once
  useEffect(() => {
    let isMounted = true;
    
    const initializeMap = async () => {
      try {
        // Dynamically import leaflet
        const L = await import("leaflet");
        
        if (!isMounted || !mapRef.current || isMapInitialized) return;
        
        // Create default, highlighted and user location icons
        const defaultIconInstance = L.divIcon({
          className: 'custom-div-icon',
          html: `
            <div class="bg-accent text-white w-6 h-6 flex items-center justify-center rounded-full shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 24]
        });

        const highlightedIconInstance = L.divIcon({
          className: 'custom-div-icon',
          html: `
            <div class="bg-primary text-white w-8 h-8 flex items-center justify-center rounded-full shadow-lg animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 32]
        });
        
        const userIconInstance = L.divIcon({
          className: 'custom-div-icon',
          html: `
            <div class="bg-blue-600 text-white w-6 h-6 flex items-center justify-center rounded-full shadow-lg border-2 border-white">
              <div class="w-2 h-2 bg-blue-300 rounded-full animate-ping"></div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        setDefaultIcon(defaultIconInstance);
        setHighlightedIcon(highlightedIconInstance);
        setUserIcon(userIconInstance);
        
        // Initialize map
        const map = L.map(mapRef.current).setView(center, zoom);
        
        // Add the initial map layer (standard)
        const tileLayer = L.tileLayer(mapLayers.standard, {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        }).addTo(map);
        
        // Store the tile layer for later reference
        map.tileLayer = tileLayer;
        
        // Add a subtle pulsing effect to the map to show it's interactive
        L.DomUtil.addClass(map.getContainer(), 'transition-all duration-300');
        
        // Store the map instance
        mapInstanceRef.current = map;
        setIsMapInitialized(true);
        
        // Add zoom controls
        map.addControl(new L.Control.Zoom({ position: 'bottomright' }));
        
        // Add layer control button (custom)
        const layerControl = L.Control.extend({
          options: {
            position: 'topright'
          },
          onAdd: function() {
            const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
            const button = L.DomUtil.create('a', 'bg-background text-foreground p-2 flex items-center justify-center rounded-md shadow-md', container);
            button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>';
            button.href = '#';
            button.title = 'Toggle Map Mode';
            
            L.DomEvent.on(button, 'click', function(e) {
              L.DomEvent.stopPropagation(e);
              L.DomEvent.preventDefault(e);
              
              const newMode = mapMode === 'standard' ? 'satellite' : 'standard';
              setMapMode(newMode);
              
              // Update tile layer
              map.tileLayer.setUrl(mapLayers[newMode]);
              
              // Update button appearance
              if (newMode === 'satellite') {
                button.style.backgroundColor = '#ffffff';
                button.style.color = '#000000';
              } else {
                button.style.backgroundColor = '';
                button.style.color = '';
              }
              
              // Show toast notification
              toast.success(`Switched to ${newMode} view`);
            });
            
            return container;
          }
        });
        
        map.addControl(new layerControl());
      } catch (error) {
        console.error("Error initializing map:", error);
        toast.error("Failed to load map. Please refresh the page.");
      }
    };
    
    initializeMap();
    
    return () => {
      isMounted = false;
    };
  }, [center, zoom, isMapInitialized]);

  // Update markers when places change
  useEffect(() => {
    const updateMarkers = async () => {
      if (!mapInstanceRef.current || !defaultIcon) return;
      
      try {
        // Dynamically import leaflet
        const L = await import("leaflet");
        
        // Clear existing markers
        Object.values(markersRef.current).forEach((marker: any) => marker.remove());
        markersRef.current = {};
        
        // Add markers for each place
        places.forEach(place => {
          const { lat, lng } = place.location;
          
          const marker = L.marker([lat, lng], { 
            icon: defaultIcon 
          }).addTo(mapInstanceRef.current);
          
          // Add popup with place info
          marker.bindPopup(`
            <div class="p-2">
              <div class="font-bold">${place.name}</div>
              <div class="text-sm mt-1">${place.category}</div>
              <div class="text-sm font-medium mt-1">${place.rating}/5 ★</div>
              ${place.businessFeatures?.isBusinessFriendly ? 
                '<div class="text-xs font-medium text-accent mt-1">Business Friendly</div>' : ''}
            </div>
          `);
          
          markersRef.current[place.id] = marker;
        });
        
        // If there are places, fit the map to show all markers with reduced animation
        if (places.length > 0) {
          const markerArray = Object.values(markersRef.current);
          const group = L.featureGroup(markerArray);
          mapInstanceRef.current.fitBounds(group.getBounds(), { 
            padding: [50, 50],
            duration: 0.5, // Reduce animation duration
            easing: true
          });
        }
      } catch (error) {
        console.error("Error updating markers:", error);
      }
    };
    
    if (isMapInitialized) {
      updateMarkers();
    }
  }, [places, defaultIcon, isMapInitialized]);

  // Effect to handle highlighting of hovered place with debounce for better performance
  useEffect(() => {
    if (!mapInstanceRef.current || !defaultIcon || !highlightedIcon) return;

    const highlightMarker = () => {
      // Reset all markers to default icon
      Object.entries(markersRef.current).forEach(([id, marker]) => {
        if (id !== hoveredPlaceId) {
          marker.setIcon(defaultIcon);
          marker.closePopup();
        }
      });

      // If there's a hovered place, highlight it and open popup
      if (hoveredPlaceId && markersRef.current[hoveredPlaceId]) {
        const marker = markersRef.current[hoveredPlaceId];
        marker.setIcon(highlightedIcon);
        marker.openPopup();
        
        // Pan to the marker with minimal animation to reduce lag
        mapInstanceRef.current.panTo(marker.getLatLng(), {
          animate: true,
          duration: 0.3,
          easing: true
        });
      }
    };

    // Use requestAnimationFrame for smoother rendering
    const animationFrame = requestAnimationFrame(highlightMarker);
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [hoveredPlaceId, defaultIcon, highlightedIcon]);
  
  // Update user location marker when it changes
  useEffect(() => {
    if (!isMapInitialized || !userIcon || !mapInstanceRef.current) return;
    
    const updateUserMarker = async () => {
      try {
        // Dynamically import leaflet
        const L = await import("leaflet");
        
        // Remove existing user marker if it exists
        if (userMarkerRef.current) {
          userMarkerRef.current.remove();
          userMarkerRef.current = null;
        }
        
        // Add new user marker if location is available
        if (userLocation) {
          userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
            icon: userIcon,
            zIndexOffset: 1000 // Make sure user marker is on top
          }).addTo(mapInstanceRef.current);
          
          userMarkerRef.current.bindTooltip("Your Location", {
            permanent: false,
            direction: 'top'
          });
        }
      } catch (error) {
        console.error("Error updating user location marker:", error);
      }
    };
    
    updateUserMarker();
  }, [userLocation, userIcon, isMapInitialized]);

  return (
    <div 
      ref={mapRef}
      className={cn("rounded-xl border border-border shadow-sm overflow-hidden", className)}
      style={{ height: className?.includes("h-") ? undefined : "400px" }}
    />
  );
};

export default Map;
