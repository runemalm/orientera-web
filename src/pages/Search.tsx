
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CompetitionCard from "@/components/CompetitionCard";
import SearchFilters from "@/components/SearchFilters";
import { competitions } from "@/data/competitions";
import { filterCompetitions } from "@/lib/utils";
import { SearchFilters as SearchFiltersType } from "@/types";
import { useToast } from "@/hooks/use-toast";

const Search = () => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<SearchFiltersType>({
    regions: [],
    districts: [],
    disciplines: [],
    levels: [],
    searchQuery: "",
    userLocation: undefined,
    isManualLocation: false,
    locationCity: undefined,
    detectedLocationInfo: undefined
  });
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  
  const getLocationDetails = async (lat: number, lng: number) => {
    try {
      console.log("Fetching location details for coordinates:", lat, lng);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching location details:", error);
      throw error;
    }
  };

  const handleLocationSuccess = async (position: GeolocationPosition) => {
    try {
      const coords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      
      console.log("Position detected:", coords);
      
      try {
        // First update state with just coordinates to ensure we have position data
        // even if the detailed location lookup fails
        setFilters(prevFilters => ({
          ...prevFilters,
          userLocation: coords
        }));
        
        // Then try to get detailed location info
        const data = await getLocationDetails(coords.lat, coords.lng);
        
        const address = data.address || {};
        const city = address.city || address.town || address.village || address.hamlet;
        
        setFilters(prevFilters => ({
          ...prevFilters,
          userLocation: coords,
          detectedLocationInfo: {
            city: city,
            municipality: address.municipality,
            county: address.county,
            display_name: data.display_name
          }
        }));
        
        toast({
          title: "Plats hittad",
          description: `Din position (${city || 'Okänd plats'}) används nu för distansfiltrering.`,
        });
      } catch (detailsError) {
        console.error("Could not get location details, using coordinates only:", detailsError);
        
        // We already set the coordinates above, so we don't need to set them again
        // Just show a notification to the user
        toast({
          title: "Plats delvis hittad",
          description: "Din position används nu för distansfiltrering, men vi kunde inte hämta detaljerad platsinformation.",
        });
      }
    } catch (error) {
      console.error("Error handling position:", error);
      toast({
        title: "Problem med att bearbeta position",
        description: "Ett fel uppstod när din position bearbetades.",
        variant: "destructive"
      });
    } finally {
      setIsRequestingLocation(false);
    }
  };

  const handleLocationError = (error: GeolocationPositionError) => {
    console.error("Geolocation error:", error);
    let errorMessage = "Prova att ange din position manuellt för distansfiltrering.";
    
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = "Du har blockerat åtkomst till din position. Aktivera platstjänster i din webbläsare.";
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = "Din position är inte tillgänglig just nu. Prova igen senare.";
        break;
      case error.TIMEOUT:
        errorMessage = "Det tog för lång tid att hämta din position. Prova igen eller ange manuellt.";
        break;
    }
    
    toast({
      title: "Kunde inte hitta din position",
      description: errorMessage,
      variant: "destructive"
    });
    
    setIsRequestingLocation(false);
  };

  useEffect(() => {
    // Only attempt to get location if:
    // - We don't already have a location
    // - User hasn't chosen to enter location manually
    // - We're not already in the process of requesting location
    if (!filters.userLocation && !filters.isManualLocation && !isRequestingLocation) {
      if (!navigator.geolocation) {
        toast({
          title: "Geolokalisering stöds inte",
          description: "Din webbläsare stöder inte geolokalisering. Prova att ange din position manuellt.",
          variant: "destructive"
        });
        return;
      }

      try {
        console.log("Requesting geolocation...");
        setIsRequestingLocation(true);
        
        // Create a local copy of navigator.geolocation to avoid any potential
        // issues with it being overridden by extensions during the async call
        const nativeGeolocation = navigator.geolocation;
        
        // We've had issues with Chrome extensions intercepting geolocation
        // Use a defensive approach with timeouts and separate error handling
        const geoLocationTimeout = setTimeout(() => {
          // If we haven't gotten a response after 10 seconds, consider it a timeout
          if (isRequestingLocation) {
            console.warn("Geolocation request timed out in our custom timeout");
            setIsRequestingLocation(false);
            toast({
              title: "Positionsbegäran tog för lång tid",
              description: "Det tog för lång tid att hämta din position. Prova att ange din position manuellt.",
              variant: "destructive"
            });
          }
        }, 15000);
        
        nativeGeolocation.getCurrentPosition(
          // Wrap the success callback in a try/catch to handle unexpected errors
          (position) => {
            clearTimeout(geoLocationTimeout);
            try {
              handleLocationSuccess(position);
            } catch (error) {
              console.error("Error in geolocation success callback:", error);
              setIsRequestingLocation(false);
              toast({
                title: "Fel vid hämtning av position",
                description: "Ett oväntat fel uppstod när din position hämtades.",
                variant: "destructive"
              });
            }
          },
          // Wrap the error callback in a try/catch
          (error) => {
            clearTimeout(geoLocationTimeout);
            try {
              handleLocationError(error);
            } catch (callbackError) {
              console.error("Error in geolocation error callback:", callbackError);
              setIsRequestingLocation(false);
              toast({
                title: "Fel vid hämtning av position",
                description: "Ett oväntat fel uppstod när din position hämtades.",
                variant: "destructive"
              });
            }
          },
          {
            enableHighAccuracy: false,
            timeout: 30000, // Increased timeout for potentially slow connections
            maximumAge: 0
          }
        );
      } catch (geoError) {
        console.error("Fatal geolocation error:", geoError);
        toast({
          title: "Problem med positionstjänsten",
          description: "Det uppstod ett allvarligt problem med positionstjänsten. Prova att ange din position manuellt.",
          variant: "destructive"
        });
        setIsRequestingLocation(false);
      }
    }
  }, [filters.userLocation, filters.isManualLocation, isRequestingLocation, toast]);

  const filteredCompetitions = filterCompetitions(competitions, filters);

  const handleFilterChange = (newFilters: SearchFiltersType) => {
    setFilters(newFilters);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-6">Sök tävlingar</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <SearchFilters 
              filters={filters} 
              onFilterChange={handleFilterChange} 
              hasLocation={!!filters.userLocation}
            />
          </div>
          
          <div className="md:col-span-3">
            <div className="bg-card rounded-lg border p-4 mb-6">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold">
                  {filteredCompetitions.length} {filteredCompetitions.length === 1 ? 'tävling' : 'tävlingar'} hittades
                </h2>
                <div className="text-sm text-muted-foreground">
                  Visar alla kommande tävlingar
                </div>
              </div>
            </div>
            
            {filteredCompetitions.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredCompetitions.map((competition) => (
                  <CompetitionCard 
                    key={competition.id} 
                    competition={competition} 
                    featured={competition.featured}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-card rounded-lg border p-8 text-center">
                <h3 className="text-lg font-medium mb-2">Inga tävlingar hittades</h3>
                <p className="text-muted-foreground mb-4">
                  Det finns inga tävlingar som matchar dina filter. Prova att ändra dina sökkriterier.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Search;
