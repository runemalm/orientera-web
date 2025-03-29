
import React, { useEffect, useState } from 'react';
import { Competition } from '@/types';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Info, Map as MapIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for Leaflet marker icons
// This is needed because Leaflet's default marker images are loaded using relative paths
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

// Component to adjust map view to fit all markers
const MapBoundsAdjuster = ({ competitions }: { competitions: Competition[] }) => {
  const map = L.map('map'); // We won't use this directly, just setting up for type checking
  
  useEffect(() => {
    // The map and bounds adjustment logic will be handled differently
    const mapElement = document.getElementById('competition-map');
    if (!mapElement) return;
    
    // This is now handled in the main component
  }, [competitions]);
  
  return null;
};

// Create custom markers for competitions
const createCustomMarkerIcon = (competition: Competition) => {
  const color = competition.featured ? '#f97316' : '#3b82f6';
  
  return L.divIcon({
    html: `
      <div style="
        width: 30px; 
        height: 30px; 
        border-radius: 50%; 
        background-color: ${color}; 
        border: 2px solid white;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        font-weight: bold;
        cursor: pointer;
      ">
        ${String(competition.id).slice(0, 1)}
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
  const [map, setMap] = useState<L.Map | null>(null);
  
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
  
  // Initialize map and adjust bounds when component mounts or competitions change
  useEffect(() => {
    if (!mapInitialized || !map) return;
    
    // Add competition markers to map using direct Leaflet methods
    competitionsWithCoordinates.forEach(competition => {
      if (!map || !competition.coordinates) return;
      
      const marker = L.marker(
        [competition.coordinates.lat, competition.coordinates.lng],
        { icon: createCustomMarkerIcon(competition) }
      ).addTo(map);
      
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
    });
    
    // Adjust map bounds to fit all markers
    if (competitionsWithCoordinates.length > 0) {
      if (competitionsWithCoordinates.length === 1) {
        const comp = competitionsWithCoordinates[0];
        map.setView([comp.coordinates!.lat, comp.coordinates!.lng], 10);
      } else {
        const bounds = L.latLngBounds(
          competitionsWithCoordinates.map(comp => [comp.coordinates!.lat, comp.coordinates!.lng])
        );
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
    
    return () => {
      // Clean up markers when component unmounts or competitions change
      map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });
    };
  }, [mapInitialized, map, competitionsWithCoordinates, navigate]);

  // Initialize the map
  useEffect(() => {
    if (!mapInitialized) return;
    
    const mapElement = document.getElementById('competition-map');
    if (!mapElement) return;
    
    // Create map instance
    const mapInstance = L.map('competition-map', {
      center: swedenCenter,
      zoom: 4.5,
      zoomControl: false
    });
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapInstance);
    
    // Add zoom control to top-right
    L.control.zoom({ position: 'topright' }).addTo(mapInstance);
    
    setMap(mapInstance);
    
    return () => {
      // Clean up map when component unmounts
      mapInstance.remove();
    };
  }, [mapInitialized]);
  
  return (
    <div className="relative">
      <div className="w-full h-[600px] rounded-lg border border-border shadow-sm">
        {/* The map container */}
        <div id="competition-map" style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}></div>
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
    </div>
  );
};

export default CompetitionMapView;
