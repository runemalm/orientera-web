
import React, { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CompetitionCard from "@/components/CompetitionCard";
import SearchFilters from "@/components/SearchFilters";
import { competitions } from "@/data/competitions";
import { filterCompetitions, getDistance } from "@/lib/utils";
import { SearchFilters as SearchFiltersType } from "@/types";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Search as SearchIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Command } from "@/components/ui/command";
import { useToast } from "@/hooks/use-toast";

const Search = () => {
  const {
    coords: userLocation,
    detectedLocationInfo,
    isManualLocation,
    loading: isRequestingLocation,
    setManualLocation,
    clearLocation,
    detectLocation
  } = useGeolocation(true);

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

  const [searchInputValue, setSearchInputValue] = useState("");
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Update filters when geolocation changes
  useEffect(() => {
    if (userLocation) {
      // When location changes, make sure to update the filters with the latest location
      setFilters(prevFilters => ({
        ...prevFilters,
        userLocation, // This ensures the userLocation is always updated in filters
        detectedLocationInfo,
        isManualLocation
      }));
    }
  }, [userLocation, detectedLocationInfo, isManualLocation]);

  // Calculate distances for each competition if user location is available
  const competitionsWithDistance = React.useMemo(() => {
    if (!userLocation) return competitions;
    
    return competitions.map(competition => {
      if (!competition.coordinates) return competition;
      
      // Calculate distance in meters - ensure we're getting an actual number
      const distance = getDistance(
        userLocation.lat,
        userLocation.lng,
        competition.coordinates.lat,
        competition.coordinates.lng
      );
      
      // Add calculated distance to competition object (ensure it's a valid number)
      return { ...competition, distance };
    });
  }, [userLocation]); // Only recalculate when userLocation changes

  const filteredCompetitions = filterCompetitions(competitionsWithDistance, filters);

  const handleFilterChange = (newFilters: SearchFiltersType) => {
    // Handle special cases for location changes
    if (newFilters.isManualLocation !== filters.isManualLocation) {
      if (newFilters.isManualLocation === false && filters.isManualLocation === true) {
        // User wants to switch from manual to auto detection
        clearLocation();
        detectLocation();
      }
    }

    // If the searchQuery was cleared by the filters, update the searchInputValue too
    if (newFilters.searchQuery === "" && filters.searchQuery !== "") {
      setSearchInputValue("");
      toast({
        title: "Sökfältet rensat",
        description: "Sökfrågan har rensats",
        duration: 2000,
      });
    }

    setFilters(newFilters);
  };

  const handleSearchChange = (value: string) => {
    setSearchInputValue(value);
    
    // Immediately update filters for real-time search
    setFilters({
      ...filters,
      searchQuery: value
    });
  };

  const handleClearSearch = () => {
    setSearchInputValue("");
    setFilters({
      ...filters,
      searchQuery: ""
    });
    toast({
      title: "Sökningen rensad",
      description: "Alla sökresultat visas nu",
      duration: 2000,
    });
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-6">Sök tävlingar</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <div className="rounded-lg border bg-card mb-4">
              <div className="p-4" ref={searchContainerRef}>
                <form onSubmit={handleManualSearch} className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      placeholder="Sök efter tävlingsnamn eller plats..."
                      value={searchInputValue}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="w-full pr-8"
                    />
                    {searchInputValue && (
                      <button
                        type="button"
                        onClick={handleClearSearch}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label="Rensa sökning"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <Button type="submit" size="icon">
                    <SearchIcon className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
            
            <SearchFilters 
              filters={filters} 
              onFilterChange={handleFilterChange} 
              hasLocation={!!filters.userLocation}
              hideSearchInput={true}
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
