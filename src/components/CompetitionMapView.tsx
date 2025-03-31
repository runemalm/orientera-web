
import React, { useEffect, useState, useRef } from 'react';
import { Competition } from '@/types';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Info, Map as MapIcon, ZoomIn, ZoomOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface CompetitionMapViewProps {
  competitions: Competition[];
}

// Create custom markers for competitions with a traditional orienteering control flag design
const createCustomMarkerIcon = (competition: Competition) => {
  // Using the orienteering orange from the color palette
  const orangeColor = '#f97316';
  
  return L.divIcon({
    html: `
      <div style="
        width: 30px; 
        height: 30px; 
        position: relative;
        cursor: pointer;
      ">
        <div style="
          position: absolute;
          top: 0;
          left: 0;
          width: 30px;
          height: 30px;
          border-radius: 2px;
          overflow: hidden;
          transform: rotate(0deg);
          border: 1px solid rgba(0, 0, 0, 0.2);
        ">
          <!-- Traditional orienteering control flag with diagonal split - COLORS SWAPPED -->
          <div style="
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: ${orangeColor};
          "></div>
          <div style="
            position: absolute;
            top: 0;
            left: 0;
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 30px 30px 0 0;
            border-color: white transparent transparent transparent;
          "></div>
          <!-- Circle behind the flag for featured competitions -->
          ${competition.featured ? `
            <div style="
              position: absolute;
              width: 36px;
              height: 36px;
              border-radius: 50%;
              background-color: rgba(249, 115, 22, 0.3);
              top: -3px;
              left: -3px;
              z-index: -1;
            "></div>
          ` : ''}
        </div>
      </div>
    `,
    className: 'competition-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

const CompetitionMapView: React.FC<CompetitionMapViewProps> = ({ competitions }) => {
  const navigate = useNavigate();
  const [mapInitialized, setMapInitialized] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const userInteractingRef = useRef(false);
  const markersRef = useRef<L.Marker[]>([]);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isMapHovering, setIsMapHovering] = useState(false);
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);
  
  // Filter competitions with coordinates
  const competitionsWithCoordinates = competitions.filter(
    comp => comp.coordinates && comp.coordinates.lat && comp.coordinates.lng
  );
  
  useEffect(() => {
    if (competitionsWithCoordinates.length === 0) {
      toast.info('Inga tävlingar med platsdata hittades');
    }
    
    setMapInitialized(true);
  }, [competitionsWithCoordinates.length]);
  
  // Center point for Sweden (default view)
  const swedenCenter: [number, number] = [62.5, 15.5];
  
  // Clean up markers
  const clearMarkers = () => {
    if (!mapRef.current) return;
    
    // Remove existing markers
    markersRef.current.forEach(marker => {
      if (mapRef.current) marker.removeFrom(mapRef.current);
    });
    markersRef.current = [];
  };
  
  // Add markers to the map
  const addMarkers = () => {
    if (!mapRef.current) return;
    
    clearMarkers();
    
    // Add new markers
    competitionsWithCoordinates.forEach(competition => {
      if (!mapRef.current || !competition.coordinates) return;
      
      const marker = L.marker(
        [competition.coordinates.lat, competition.coordinates.lng],
        { icon: createCustomMarkerIcon(competition) }
      ).addTo(mapRef.current);
      
      marker.on('click', () => {
        navigate(`/competition/${competition.id}`);
      });
      
      const popupContent = `
        <div style="padding: 5px; max-width: 250px">
          <h3 style="font-weight: bold; margin-bottom: 5px">${competition.name}</h3>
          <p style="margin-bottom: 5px">${competition.date}</p>
          <p style="margin-bottom: 10px">${competition.location}</p>
          <p style="color: ${competition.featured ? '#f97316' : '#3b82f6'}; font-weight: bold">
            ${competition.featured ? 'Utmärkt tävling' : competition.discipline}
          </p>
        </div>
      `;
      
      marker.bindPopup(popupContent);
      markersRef.current.push(marker);
    });
  };
  
  // Zoom in and out functions
  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };
  
  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };
  
  // Initialize the map
  useEffect(() => {
    if (!mapInitialized) return;
    
    const mapElement = document.getElementById('competition-map');
    if (!mapElement) return;
    
    // Create map instance
    const mapInstance = L.map('competition-map', {
      center: swedenCenter,
      zoom: 4.5,
      zoomControl: false,
      scrollWheelZoom: false // Disable scroll wheel zoom by default
    });
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstance);
    
    // Add zoom control to top-right
    L.control.zoom({ position: 'topright' }).addTo(mapInstance);
    
    // Track user interaction to prevent auto-zoom
    mapInstance.on('zoomstart', () => {
      userInteractingRef.current = true;
    });
    
    mapInstance.on('dragstart', () => {
      userInteractingRef.current = true;
    });
    
    mapRef.current = mapInstance;
    
    // Add markers
    addMarkers();
    
    // Adjust map bounds to fit all markers
    if (competitionsWithCoordinates.length > 0 && !userInteractingRef.current) {
      if (competitionsWithCoordinates.length === 1) {
        const comp = competitionsWithCoordinates[0];
        mapInstance.setView([comp.coordinates!.lat, comp.coordinates!.lng], 10);
      } else {
        const bounds = L.latLngBounds(
          competitionsWithCoordinates.map(comp => [comp.coordinates!.lat, comp.coordinates!.lng])
        );
        mapInstance.fitBounds(bounds, { padding: [50, 50] });
      }
    }
    
    return () => {
      // Clean up map when component unmounts
      clearMarkers();
      mapInstance.remove();
      mapRef.current = null;
    };
  }, [mapInitialized]);
  
  // Update markers when competitions change
  useEffect(() => {
    if (!mapRef.current || !mapInitialized) return;
    
    addMarkers();
    
    // Only adjust bounds if user is not interacting with the map
    if (!userInteractingRef.current) {
      if (competitionsWithCoordinates.length === 1) {
        const comp = competitionsWithCoordinates[0];
        mapRef.current.setView([comp.coordinates!.lat, comp.coordinates!.lng], 10);
      } else if (competitionsWithCoordinates.length > 1) {
        const bounds = L.latLngBounds(
          competitionsWithCoordinates.map(comp => [comp.coordinates!.lat, comp.coordinates!.lng])
        );
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [competitionsWithCoordinates, mapInitialized]);
  
  // Handle keyboard events for Ctrl key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        setIsCtrlPressed(true);
        if (mapRef.current && isMapHovering) {
          mapRef.current.scrollWheelZoom.enable();
        }
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.metaKey) {
        setIsCtrlPressed(false);
        if (mapRef.current) {
          mapRef.current.scrollWheelZoom.disable();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isMapHovering]);
  
  // Handle mouse events for the map container
  const handleMouseEnter = () => {
    setIsMapHovering(true);
  };
  
  const handleMouseLeave = () => {
    setIsMapHovering(false);
    if (mapRef.current) {
      mapRef.current.scrollWheelZoom.disable();
    }
  };
  
  return (
    <div className="relative">
      <div 
        className="w-full h-[600px] rounded-lg border border-border shadow-sm" 
        ref={mapContainerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* The map container */}
        <div 
          id="competition-map" 
          style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
        ></div>
        
        {/* Custom zoom controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
          <Button 
            size="icon" 
            variant="default" 
            className="bg-white text-black hover:bg-gray-100 shadow-md"
            onMouseDown={() => {
              if (mapRef.current) {
                mapRef.current.scrollWheelZoom.enable();
              }
            }}
            onMouseUp={() => {
              if (mapRef.current) {
                mapRef.current.scrollWheelZoom.disable();
              }
            }}
            onMouseLeave={() => {
              if (mapRef.current) {
                mapRef.current.scrollWheelZoom.disable();
              }
            }}
            onClick={handleZoomIn}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button 
            size="icon" 
            variant="default" 
            className="bg-white text-black hover:bg-gray-100 shadow-md"
            onMouseDown={() => {
              if (mapRef.current) {
                mapRef.current.scrollWheelZoom.enable();
              }
            }}
            onMouseUp={() => {
              if (mapRef.current) {
                mapRef.current.scrollWheelZoom.disable();
              }
            }}
            onMouseLeave={() => {
              if (mapRef.current) {
                mapRef.current.scrollWheelZoom.disable();
              }
            }}
            onClick={handleZoomOut}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Message for no competitions with coordinates */}
      {mapInitialized && competitionsWithCoordinates.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 rounded-lg">
          <Info className="h-12 w-12 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">Inga tävlingar med platsdata</h3>
          <p className="text-muted-foreground mb-4 max-w-md text-center">
            De valda tävlingarna saknar geografisk information och kan inte visas på kartan.
          </p>
          <Button variant="outline" onClick={() => navigate("/search")}>
            <MapIcon className="h-4 w-4 mr-2" />
            Återgå till sökning
          </Button>
        </div>
      )}
      
      <div className="absolute bottom-4 right-4 p-2 bg-background/80 rounded-sm text-xs text-muted-foreground shadow-sm">
        OpenStreetMap
      </div>
      
      {/* Instructions */}
      {isMapHovering && (
        <div className="absolute bottom-4 left-4 p-2 bg-background/90 rounded-md text-xs text-muted-foreground shadow-sm transition-opacity">
          <p>Håll musknappen nedtryckt på zoom-knapparna för att zooma med scrollhjulet</p>
          <p className="text-xs opacity-75 mt-1">Eller håll ned CTRL-knappen</p>
        </div>
      )}
    </div>
  );
};

export default CompetitionMapView;
