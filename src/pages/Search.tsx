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

  useEffect(() => {
    // Ask for user location if not already set and not using manual location
    if (!filters.userLocation && !filters.isManualLocation) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            
            // Get location info from coordinates using reverse geocoding
            fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&zoom=18&addressdetails=1`
            )
              .then(response => response.json())
              .then(data => {
                setFilters(prev => ({
                  ...prev,
                  userLocation: coords,
                  detectedLocationInfo: {
                    city: data.address.city || data.address.town || data.address.village || data.address.hamlet,
                    municipality: data.address.municipality,
                    county: data.address.county,
                    display_name: data.display_name
                  }
                }));
                
                toast({
                  title: "Plats hittad",
                  description: "Din position används nu för distansfiltrering.",
                });
              })
              .catch(error => {
                console.error("Error getting location details:", error);
                setFilters(prev => ({
                  ...prev,
                  userLocation: coords
                }));
              });
          },
          (error) => {
            console.error("Error getting location:", error);
            toast({
              title: "Kunde inte hitta din position",
              description: "Prova att ange din position manuellt för distansfiltrering.",
              variant: "destructive"
            });
          }
        );
      } else {
        toast({
          title: "Geolokalisering stöds inte",
          description: "Din webbläsare stöder inte geolokalisering. Prova att ange din position manuellt.",
          variant: "destructive"
        });
      }
    }
  }, [filters.userLocation, filters.isManualLocation, toast]);

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
