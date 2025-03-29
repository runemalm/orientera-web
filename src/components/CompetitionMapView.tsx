
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Competition } from '@/types';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Info, Map as MapIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from './ui/input';

interface CompetitionMapViewProps {
  competitions: Competition[];
}

// Mapbox token will be managed via local storage
const MAPBOX_TOKEN_KEY = 'mapbox_access_token';

const CompetitionMapView: React.FC<CompetitionMapViewProps> = ({ competitions }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapInitialized, setMapInitialized] = useState(false);
  const navigate = useNavigate();
  const [mapboxToken, setMapboxToken] = useState<string>(() => {
    // Try to get token from localStorage
    return localStorage.getItem(MAPBOX_TOKEN_KEY) || '';
  });
  const [isTokenSubmitted, setIsTokenSubmitted] = useState<boolean>(!!mapboxToken);

  // Initialize map when token is provided
  useEffect(() => {
    if (!mapContainer.current || !isTokenSubmitted || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [15.5, 62.5], // Centrerad över Sverige
        zoom: 4.5,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // När kartan har laddats, sätt status till initialiserad
      map.current.on('load', () => {
        setMapInitialized(true);
      });

      // Handle map load errors
      map.current.on('error', (e) => {
        console.error('Map error:', e);
        // Check if it's an authentication error
        if (e.error && e.error.status === 401) {
          toast.error('Ogiltig Mapbox-token. Kontrollera att du angett rätt token.');
          setIsTokenSubmitted(false);
          localStorage.removeItem(MAPBOX_TOKEN_KEY);
        }
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      toast.error('Kunde inte ladda kartan. Kontrollera din internetanslutning.');
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [mapboxToken, isTokenSubmitted]);

  // Add markers when competitions change or map is initialized
  useEffect(() => {
    if (!map.current || !mapInitialized || !isTokenSubmitted) return;

    // Rensa befintliga markörer
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Filtrera ut tävlingar utan koordinater
    const competitionsWithCoordinates = competitions.filter(
      comp => comp.coordinates && comp.coordinates.lat && comp.coordinates.lng
    );

    if (competitionsWithCoordinates.length === 0) {
      toast.info('Inga tävlingar med platsdata hittades');
      return;
    }

    // Skapa nya markörer för varje tävling
    competitionsWithCoordinates.forEach(competition => {
      if (!competition.coordinates) return;

      // Skapa en anpassad markör
      const markerElement = document.createElement('div');
      markerElement.className = 'competition-marker';
      markerElement.style.width = '30px';
      markerElement.style.height = '30px';
      markerElement.style.borderRadius = '50%';
      markerElement.style.backgroundColor = competition.featured ? '#f97316' : '#3b82f6';
      markerElement.style.border = '2px solid white';
      markerElement.style.display = 'flex';
      markerElement.style.justifyContent = 'center';
      markerElement.style.alignItems = 'center';
      markerElement.style.color = 'white';
      markerElement.style.fontWeight = 'bold';
      markerElement.style.cursor = 'pointer';
      markerElement.innerHTML = `<span>${String(competition.id).slice(0, 1)}</span>`;

      // Skapa popup för markören
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="padding: 10px; max-width: 250px;">
          <h3 style="font-weight: bold; margin-bottom: 5px;">${competition.name}</h3>
          <p style="margin-bottom: 5px;">${competition.date}</p>
          <p style="margin-bottom: 10px;">${competition.location}</p>
          <p style="color: ${competition.featured ? '#f97316' : '#3b82f6'}; font-weight: bold;">
            ${competition.featured ? 'Utmärkt tävling' : competition.discipline}
          </p>
        </div>
      `);

      // Skapa markör
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([competition.coordinates.lng, competition.coordinates.lat])
        .setPopup(popup)
        .addTo(map.current!);

      // Lägg till klickhändelse för att navigera till tävlingsdetaljer
      marker.getElement().addEventListener('click', () => {
        navigate(`/competition/${competition.id}`);
      });

      markersRef.current.push(marker);
    });

    // Justera kartvy för att passa alla markörer om det finns fler än en tävling
    if (competitionsWithCoordinates.length > 1) {
      const bounds = new mapboxgl.LngLatBounds();
      competitionsWithCoordinates.forEach(comp => {
        if (comp.coordinates) {
          bounds.extend([comp.coordinates.lng, comp.coordinates.lat]);
        }
      });
      
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 10
      });
    } else if (competitionsWithCoordinates.length === 1) {
      // Om det bara finns en tävling, centrera och zooma in
      const comp = competitionsWithCoordinates[0];
      map.current.flyTo({
        center: [comp.coordinates!.lng, comp.coordinates!.lat],
        zoom: 10
      });
    }
  }, [competitions, mapInitialized, navigate, isTokenSubmitted]);

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mapboxToken) {
      localStorage.setItem(MAPBOX_TOKEN_KEY, mapboxToken);
      setIsTokenSubmitted(true);
      
      // If map was already initialized with another token, we need to recreate it
      if (map.current) {
        map.current.remove();
        map.current = null;
        setMapInitialized(false);
      }
    }
  };

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMapboxToken(e.target.value);
  };

  return (
    <div className="relative">
      <div ref={mapContainer} className="w-full h-[600px] rounded-lg border border-border shadow-sm" />
      
      {!isTokenSubmitted && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/95 rounded-lg z-10 p-4">
          <MapIcon className="h-12 w-12 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium mb-2">Mapbox API-token krävs</h3>
          <p className="text-muted-foreground mb-4 max-w-md text-center">
            För att visa kartan behöver du ange en giltig Mapbox API-token.
            Du kan skapa en gratis på <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com</a>
          </p>
          <form onSubmit={handleTokenSubmit} className="flex flex-col items-center w-full max-w-md space-y-2">
            <Input
              type="text"
              value={mapboxToken}
              onChange={handleTokenChange}
              placeholder="Ange din Mapbox API-token här..."
              className="w-full"
            />
            <Button type="submit" disabled={!mapboxToken}>
              Använd token
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-4 max-w-md text-center">
            Din token sparas lokalt i din webbläsare och skickas endast till Mapbox.
          </p>
        </div>
      )}
      
      {isTokenSubmitted && !competitions.some(comp => comp.coordinates) && (
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
      
      <div className="absolute bottom-4 right-4 p-2 bg-background rounded-sm text-xs text-muted-foreground shadow-sm">
        Powered by Mapbox
      </div>
    </div>
  );
};

export default CompetitionMapView;
