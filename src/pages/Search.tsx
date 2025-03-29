
import React, { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchFilters from "@/components/SearchFilters";
import { competitions } from "@/data/competitions";
import { SearchFilters as SearchFiltersType } from "@/types";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useToast } from "@/hooks/use-toast";
import { useCompetitionSearch } from "@/hooks/useCompetitionSearch";

// Import the new components
import SearchInput from "@/components/search/SearchInput";
import SearchHeader from "@/components/search/SearchHeader";
import SearchResults from "@/components/search/SearchResults";

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
    console.log("Location changed, updating filters:", { userLocation, isManualLocation });
    setFilters(prevFilters => ({
      ...prevFilters,
      userLocation,
      detectedLocationInfo,
      isManualLocation
    }));
  }, [userLocation, detectedLocationInfo, isManualLocation]);

  // Use the custom hook to get filtered competitions
  const { filteredCompetitions } = useCompetitionSearch(competitions, filters);

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

    console.log("Filter changed:", newFilters);
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
            <div ref={searchContainerRef}>
              <SearchInput 
                value={searchInputValue}
                onChange={handleSearchChange}
                onClear={handleClearSearch}
                onSubmit={handleManualSearch}
              />
            </div>
            
            <SearchFilters 
              filters={filters} 
              onFilterChange={handleFilterChange} 
              hasLocation={!!filters.userLocation}
              hideSearchInput={true}
            />
          </div>
          
          <div className="md:col-span-3">
            <SearchHeader resultCount={filteredCompetitions.length} />
            <SearchResults competitions={filteredCompetitions} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Search;
