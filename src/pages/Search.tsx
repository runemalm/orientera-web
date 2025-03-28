
import React, { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CompetitionCard from "@/components/CompetitionCard";
import SearchFilters from "@/components/SearchFilters";
import SearchAutocomplete from "@/components/search/SearchAutocomplete";
import { competitions } from "@/data/competitions";
import { filterCompetitions } from "@/lib/utils";
import { SearchFilters as SearchFiltersType, Competition } from "@/types";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Command } from "@/components/ui/command";

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
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Update filters when geolocation changes
  useEffect(() => {
    setFilters(prevFilters => ({
      ...prevFilters,
      userLocation,
      detectedLocationInfo,
      isManualLocation
    }));
  }, [userLocation, detectedLocationInfo, isManualLocation]);

  // Close autocomplete when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsAutocompleteOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredCompetitions = filterCompetitions(competitions, filters);

  const handleFilterChange = (newFilters: SearchFiltersType) => {
    // Handle special cases for location changes
    if (newFilters.isManualLocation !== filters.isManualLocation) {
      if (newFilters.isManualLocation === false) {
        // User wants to switch to auto detection
        clearLocation();
        detectLocation();
      }
    }

    setFilters(newFilters);
  };

  const handleSearchChange = (value: string) => {
    setSearchInputValue(value);
    setIsAutocompleteOpen(value.length >= 2);
    
    // Immediately update filters for real-time search
    if (value.length >= 2 || value === "") {
      setFilters({
        ...filters,
        searchQuery: value
      });
    }
  };

  const handleCompetitionSelect = (competition: Competition) => {
    // When a competition is selected from autocomplete, update search query
    setSearchInputValue(competition.name);
    setFilters({
      ...filters,
      searchQuery: competition.name
    });
    setIsAutocompleteOpen(false);
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({
      ...filters,
      searchQuery: searchInputValue
    });
    setIsAutocompleteOpen(false);
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
                <Command className="rounded-lg border-none w-full" shouldFilter={false}>
                  <form onSubmit={handleManualSearch} className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        placeholder="Sök efter tävlingsnamn eller plats..."
                        value={searchInputValue}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        onFocus={() => setIsAutocompleteOpen(searchInputValue.length >= 2)}
                        className="w-full"
                      />
                      <SearchAutocomplete
                        competitions={competitions}
                        searchQuery={searchInputValue}
                        onSearchChange={handleSearchChange}
                        onCompetitionSelect={handleCompetitionSelect}
                        isOpen={isAutocompleteOpen}
                      />
                    </div>
                    <Button type="submit" size="icon">
                      <SearchIcon className="h-4 w-4" />
                    </Button>
                  </form>
                </Command>
              </div>
            </div>
            
            <SearchFilters 
              filters={filters} 
              onFilterChange={handleFilterChange} 
              hasLocation={!!filters.userLocation}
              hideSearchInput={true} // Add this prop to hide the search input in SearchFilters
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
