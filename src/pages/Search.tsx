import React, { useState, useEffect, useRef, useMemo } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchFilters from "@/components/SearchFilters";
import { competitions } from "@/data/competitions";
import { filterCompetitions } from "@/lib/utils";
import { SearchFilters as SearchFiltersType } from "@/types";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Search as SearchIcon, X, Sparkles, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { getDistance } from "@/lib/utils";
import CompetitionCompactView from "@/components/CompetitionCompactView";
import { isBefore, isAfter, isEqual, parseISO } from "date-fns";
import AiSearchCard from "@/components/search/AiSearchCard";
import { useIsMobile } from "@/hooks/use-mobile";

const Search = () => {
  const location = useLocation();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
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
  const [locationChangeCounter, setLocationChangeCounter] = useState(0);
  const [currentTab, setCurrentTab] = useState<string>("traditional");

  // Effekt för URL-parametrar
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
        setCurrentTab("ai");
        toast({
          title: "Sökning från AI",
          description: "Filtren har applicerats baserat på din AI-sökning",
          duration: 3000,
        });
      }
    }
  }, [location.search, toast]);

  // Effekt för att uppdatera filters när userLocation ändras
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

  // Loggning av ändringar (för debug)
  useEffect(() => {
    console.log("🚀 userLocation changed in Search:", userLocation);
  }, [userLocation]);

  useEffect(() => {
    console.log("🚀 detectedLocationInfo changed in Search:", detectedLocationInfo);
  }, [detectedLocationInfo]);

  useEffect(() => {
    console.log("🚀 isManualLocation changed in Search:", isManualLocation);
  }, [isManualLocation]);

  // Beräkna avstånd för tävlingar
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

  // Filtrera tävlingar baserat på alla filter
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

  // Handler för när filtren ändras
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

  // Handler för söktextfältet
  const handleSearchChange = (value: string) => {
    setSearchInputValue(value);
    
    setFilters({
      ...filters,
      searchQuery: value
    });
  };

  // Handler för att rensa sökning
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

  // Handler för att skicka sökformulär
  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Handler för AI-sökningens callback
  const handleAiSearchComplete = (newFilters: SearchFiltersType) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      disciplines: newFilters.disciplines,
      levels: newFilters.levels,
      dateRange: newFilters.dateRange,
      searchQuery: newFilters.searchQuery
    }));
    
    setSearchInputValue(newFilters.searchQuery || "");
    setCurrentTab("traditional");
  };

  // UI-renderingsfunktioner
  const renderTraditionalSearch = () => (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card p-4 mb-4">
        <div ref={searchContainerRef}>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="Sök efter namn eller plats..."
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
          </div>
        </div>
      </div>
      
      <SearchFilters 
        filters={filters} 
        onFilterChange={handleFilterChange} 
        hasLocation={!!filters.userLocation}
        hideSearchInput={true}
      />
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-6">Sök tävlingar</h1>
        
        <div className="max-w-3xl mx-auto">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="traditional">
                <SearchIcon className="h-4 w-4 mr-2" />
                <span>Filtrera</span>
              </TabsTrigger>
              <TabsTrigger value="ai">
                <Sparkles className="h-4 w-4 mr-2" />
                <span>AI-sökning</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="traditional" className="mt-2">
              {renderTraditionalSearch()}
            </TabsContent>
            
            <TabsContent value="ai" className="mt-2">
              <AiSearchCard onSearchComplete={handleAiSearchComplete} initialQuery="" />
            </TabsContent>
          </Tabs>
          
          <div className="bg-card rounded-lg border p-4 mb-6">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">
                {filteredCompetitions.length} {filteredCompetitions.length === 1 ? 'tävling' : 'tävlingar'} hittades
              </h2>
              {currentTab === "ai" && filters.searchQuery && (
                <Button
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setCurrentTab("traditional")}
                  className="text-xs"
                >
                  Visa filter
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              )}
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
      </main>
      
      <Footer />
    </div>
  );
};

export default Search;
