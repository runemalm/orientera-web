
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchFilters from "@/components/SearchFilters";
import { competitions } from "@/data/competitions";
import { filterCompetitions } from "@/lib/utils";
import { SearchFilters as SearchFiltersType } from "@/types";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Search as SearchIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getDistance } from "@/lib/utils";
import CompetitionCompactView from "@/components/CompetitionCompactView";
import { isBefore, isAfter, isEqual, parseISO } from "date-fns";

const Search = () => {
  const location = useLocation();
  
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
  
  const [locationChangeCounter, setLocationChangeCounter] = useState(0);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    
    const disciplinesParam = searchParams.get('disciplines');
    const disciplines = disciplinesParam ? disciplinesParam.split(',') : [];
    
    const levelsParam = searchParams.get('levels');
    const levels = levelsParam ? levelsParam.split(',') : [];
    
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    let dateRange = undefined;
    
    if (dateFrom) {
      dateRange = {
        from: new Date(dateFrom),
        to: dateTo ? new Date(dateTo) : undefined
      };
    }
    
    const searchQuery = searchParams.get('q') || "";
    const aiMode = searchParams.get('mode') === 'ai';
    
    if (disciplines.length > 0 || levels.length > 0 || dateRange || searchQuery) {
      setFilters(prevFilters => ({
        ...prevFilters,
        disciplines: disciplines as any[],
        levels: levels as any[],
        dateRange,
        searchQuery
      }));
      
      setSearchInputValue(searchQuery);
      
      if (aiMode) {
        toast({
          title: "Sökning från AI",
          description: "Filtren har applicerats baserat på din AI-sökning",
          duration: 3000,
        });
      }
    }
  }, [location.search, toast]);

  useEffect(() => {
    console.log("Location changed, updating filters:", { userLocation, detectedLocationInfo, isManualLocation });
    setFilters(prevFilters => ({
      ...prevFilters,
      userLocation,
      detectedLocationInfo,
      isManualLocation
    }));
    
    setLocationChangeCounter(prev => prev + 1);
  }, [userLocation, detectedLocationInfo, isManualLocation]);

  useEffect(() => {
    console.log("🚀 userLocation changed in Search:", userLocation);
  }, [userLocation]);

  useEffect(() => {
    console.log("🚀 detectedLocationInfo changed in Search:", detectedLocationInfo);
  }, [detectedLocationInfo]);

  useEffect(() => {
    console.log("🚀 isManualLocation changed in Search:", isManualLocation);
  }, [isManualLocation]);

  const competitionsWithDistance = useMemo(() => {
    console.log("Recalculating distances with userLocation:", userLocation);
    
    if (!userLocation) return competitions;
    
    return competitions.map(competition => {
      if (!competition.coordinates) {
        console.warn(`Competition ${competition.id} is missing coordinates!`);
        return competition;
      }
      
      const distance = getDistance(
        userLocation.lat,
        userLocation.lng,
        competition.coordinates.lat,
        competition.coordinates.lng
      );
      
      console.log(`Competition ${competition.name} - Distance: ${distance}m`);
      return { ...competition, distance };
    });
  }, [userLocation, locationChangeCounter]);

  const filteredCompetitions = useMemo(() => {
    let filtered = filterCompetitions(competitionsWithDistance, {
      ...filters,
      userLocation,
    });

    if (filters.dateRange?.from) {
      filtered = filtered.filter(competition => {
        const competitionDate = parseISO(competition.date);
        
        if (filters.dateRange?.from && isBefore(competitionDate, filters.dateRange.from) && 
            !isEqual(competitionDate, filters.dateRange.from)) {
          return false;
        }
        
        if (filters.dateRange?.to && isAfter(competitionDate, filters.dateRange.to) && 
            !isEqual(competitionDate, filters.dateRange.to)) {
          return false;
        }
        
        return true;
      });
    }
    
    return filtered;
  }, [competitionsWithDistance, filters, userLocation]);

  const handleFilterChange = (newFilters: SearchFiltersType) => {
    if (newFilters.isManualLocation !== filters.isManualLocation) {
      if (newFilters.isManualLocation === false && filters.isManualLocation === true) {
        clearLocation();
        detectLocation();
      }
    }

    if (newFilters.searchQuery === "" && filters.searchQuery !== "") {
      setSearchInputValue("");
      toast({
        title: "Sökfältet rensat",
        description: "Sökfrågan har rensats",
        duration: 2000,
      });
    }

    const locationChanged = newFilters.userLocation !== filters.userLocation;

    console.log("Filter changed:", newFilters);
    setFilters(newFilters);
    
    if (locationChanged) {
      setLocationChangeCounter(prev => prev + 1);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchInputValue(value);
    
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

  const renderSearchResults = () => (
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
          </div>
        </div>
        
        {filteredCompetitions.length > 0 ? (
          <CompetitionCompactView competitions={filteredCompetitions} />
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
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-6">Sök tävlingar</h1>
        
        {renderSearchResults()}
      </main>
      
      <Footer />
    </div>
  );
};

export default Search;
