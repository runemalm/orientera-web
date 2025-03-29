
import React, { useEffect, useRef, useState } from 'react';
import { Competition } from '@/types';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Info, Map as MapIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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
  const map = useMap();
  
  useEffect(() => {
    const competitionsWithCoordinates = competitions.filter(
      comp => comp.coordinates && comp.coordinates.lat && comp.coordinates.lng
    );
    
    if (competitionsWithCoordinates.length === 0) return;
    
    if (competitionsWithCoordinates.length === 1) {
      const comp = competitionsWithCoordinates[0];
      map.setView([comp.coordinates!.lat, comp.coordinates!.lng], 10);
      return;
    }
    
    // Create bounds to fit all markers
    const bounds = L.latLngBounds(
      competitionsWithCoordinates.map(comp => [comp.coordinates!.lat, comp.coordinates!.lng])
    );
    
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [competitions, map]);
  
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
  
  return (
    <div className="relative">
      <div className="w-full h-[600px] rounded-lg border border-border shadow-sm">
        {/* The map container */}
        <MapContainer 
          style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
          zoom={4.5}
          zoomControl={false}
          center={swedenCenter}
        >
          {/* Add zoom control to top-right */}
          <div className="leaflet-top leaflet-right">
            <div className="leaflet-control-zoom leaflet-bar leaflet-control">
              <a className="leaflet-control-zoom-in" href="#" title="Zoom in" role="button" aria-label="Zoom in"></a>
              <a className="leaflet-control-zoom-out" href="#" title="Zoom out" role="button" aria-label="Zoom out"></a>
            </div>
          </div>
          
          {/* Add OpenStreetMap tile layer */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Add competition markers */}
          {competitionsWithCoordinates.map((competition) => (
            <Marker 
              key={competition.id}
              position={[competition.coordinates!.lat, competition.coordinates!.lng]}
              eventHandlers={{
                click: () => {
                  navigate(`/competition/${competition.id}`);
                }
              }}
            >
              <Popup>
                <div style={{ padding: '5px', maxWidth: '250px' }}>
                  <h3 style={{ fontWeight: 'bold', marginBottom: '5px' }}>{competition.name}</h3>
                  <p style={{ marginBottom: '5px' }}>{competition.date}</p>
                  <p style={{ marginBottom: '10px' }}>{competition.location}</p>
                  <p style={{ 
                    color: competition.featured ? '#f97316' : '#3b82f6', 
                    fontWeight: 'bold' 
                  }}>
                    {competition.featured ? 'Utmärkt tävling' : competition.discipline}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
          
          {/* Adjuster to fit map bounds */}
          <MapBoundsAdjuster competitions={competitionsWithCoordinates} />
        </MapContainer>
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
