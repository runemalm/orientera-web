
import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchFilters from "@/components/SearchFilters";
import { competitions } from "@/data/competitions";
import { filterCompetitions } from "@/lib/utils";
import { SearchFilters as SearchFiltersType } from "@/types";
import { X, Filter, Trash2, ListFilter, CalendarDays, Map as MapIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import CompetitionCompactView from "@/components/CompetitionCompactView";
import CompetitionCalendarView from "@/components/CompetitionCalendarView";
import CompetitionMapView from "@/components/CompetitionMapView";
import CompetitionListView from "@/components/CompetitionListView";
import { isBefore, isAfter, isEqual, parseISO } from "date-fns";
import { processNaturalLanguageQuery } from "@/utils/aiQueryProcessor";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from "@/components/ui/toggle-group";

// Array of popular searches to display
const popularSearches = [
  "Nationella tävlingar i sommar",
  "Sprinttävlingar i Stockholm",
  "Ungdomstävlingar nästa månad",
  "Stafetter i södra Sverige",
  "Långdistans i fjällen",
];

// View type for competition display
type ViewType = "list" | "compact" | "calendar" | "map";

const Search = () => {
  const location = useLocation();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [filters, setFilters] = useState<SearchFiltersType>({
    regions: [],
    districts: [],
    disciplines: [],
    levels: [],
    types: [],
    branches: [],
    searchQuery: ""
  });

  const [searchInputValue, setSearchInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('recentAiSearches');
    return saved ? JSON.parse(saved) : [];
  });
  const [viewType, setViewType] = useState<ViewType>("compact");

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
    
    if (disciplines.length > 0 || levels.length > 0 || dateRange || searchQuery) {
      setFilters(prevFilters => ({
        ...prevFilters,
        disciplines: disciplines as any[],
        levels: levels as any[],
        dateRange,
        searchQuery
      }));
      
      setSearchInputValue(searchQuery);
    }
  }, [location.search, toast]);

  const filteredCompetitions = useMemo(() => {
    let filtered = filterCompetitions(competitions, filters);

    if (filters.dateRange?.from || filters.dateRange?.to) {
      filtered = filtered.filter(competition => {
        const competitionDate = parseISO(competition.date);
        
        // Check from date if it exists
        if (filters.dateRange?.from && isBefore(competitionDate, filters.dateRange.from) && 
            !isEqual(competitionDate, filters.dateRange.from)) {
          return false;
        }
        
        // Check to date if it exists
        if (filters.dateRange?.to && isAfter(competitionDate, filters.dateRange.to) && 
            !isEqual(competitionDate, filters.dateRange.to)) {
          return false;
        }
        
        return true;
      });
    }

    if (filters.types && filters.types.length > 0) {
      filtered = filtered.filter(competition => 
        competition.type && filters.types.includes(competition.type)
      );
    }

    if (filters.branches && filters.branches.length > 0) {
      filtered = filtered.filter(competition => 
        competition.branch && filters.branches.includes(competition.branch)
      );
    }
    
    return filtered;
  }, [competitions, filters]);

  const handleFilterChange = (newFilters: SearchFiltersType) => {
    console.log("Filter changed:", newFilters);
    setFilters(newFilters);
    
    if (newFilters.searchQuery === "" && filters.searchQuery !== "") {
      setSearchInputValue("");
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchInputValue(value);
    
    if (value === "") {
      setFilters({
        ...filters,
        searchQuery: ""
      });
    }
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

  const handleClearHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentAiSearches');
    toast({
      title: "Historik rensad",
      description: "Alla tidigare sökningar har tagits bort",
      duration: 2000,
    });
  };

  const processQuery = (query: string) => {
    if (!query.trim()) {
      toast({
        title: "Tomt sökfält",
        description: "Vänligen beskriv vad du letar efter",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setSearchInputValue(query); // Update the search input value when processing a query

    try {
      const newFilters = processNaturalLanguageQuery(query);
      
      const updatedSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
      setRecentSearches(updatedSearches);
      localStorage.setItem('recentAiSearches', JSON.stringify(updatedSearches));
      
      setFilters({
        ...filters,
        disciplines: newFilters.disciplines,
        levels: newFilters.levels,
        dateRange: newFilters.dateRange,
        searchQuery: query
      });
      
      toast({
        title: "Sökning bearbetad",
        description: "Filtren har uppdaterats baserat på din sökning",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error processing query:", error);
      toast({
        title: "Något gick fel",
        description: "Det gick inte att bearbeta din sökning",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processQuery(searchInputValue);
  };

  const renderCompetitionView = () => {
    if (filteredCompetitions.length === 0) {
      return (
        <div className="bg-card rounded-lg border p-8 text-center">
          <h3 className="text-lg font-medium mb-2">Inga tävlingar hittades</h3>
          <p className="text-muted-foreground mb-4">
            Det finns inga tävlingar som matchar dina filter. Prova att ändra dina sökkriterier.
          </p>
        </div>
      );
    }

    switch (viewType) {
      case "list":
        return <CompetitionListView competitions={filteredCompetitions} />;
      case "compact":
        return <CompetitionCompactView competitions={filteredCompetitions} />;
      case "calendar":
        return <CompetitionCalendarView competitions={filteredCompetitions} />;
      case "map":
        return <CompetitionMapView competitions={filteredCompetitions} />;
      default:
        return <CompetitionCompactView competitions={filteredCompetitions} />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold">Sök tävlingar</h1>
            
            <ToggleGroup 
              type="single" 
              value={viewType} 
              onValueChange={(value) => value && setViewType(value as ViewType)}
              className="bg-muted p-1 rounded-md"
            >
              <ToggleGroupItem value="list" aria-label="Lista" title="Lista">
                <ListFilter className="h-5 w-5" />
              </ToggleGroupItem>
              <ToggleGroupItem value="compact" aria-label="Kompakt" title="Kompakt">
                <Filter className="h-5 w-5" />
              </ToggleGroupItem>
              <ToggleGroupItem value="calendar" aria-label="Kalender" title="Kalender">
                <CalendarDays className="h-5 w-5" />
              </ToggleGroupItem>
              <ToggleGroupItem value="map" aria-label="Karta" title="Karta">
                <MapIcon className="h-5 w-5" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          
          <div className="space-y-6">
            <div className="rounded-lg border bg-card p-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Input
                    placeholder="Sök efter tävlingar..."
                    value={searchInputValue}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pr-8 text-base"
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
                
                <Button 
                  type="submit" 
                  disabled={isProcessing || !searchInputValue.trim()}
                  className="w-full"
                >
                  {isProcessing ? "Bearbetar sökning..." : "Sök"}
                </Button>
              </form>
              
              {/* Popular searches - always shown */}
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-sm font-medium">Populära sökningar</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => processQuery(search)}
                      className="text-xs"
                    >
                      {search}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Recent searches - only shown if there are any */}
              {recentSearches.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium">Senaste sökningar</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearHistory}
                      className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Rensa historik
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => processQuery(search)}
                        className="text-xs"
                      >
                        {search.length > 30 ? `${search.substring(0, 30)}...` : search}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="mb-4">
              <SearchFilters 
                filters={filters} 
                onFilterChange={handleFilterChange} 
                hasLocation={false}
                hideSearchInput={true}
              />
            </div>
            
            <div className="bg-card rounded-lg border p-4 mb-6">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold">
                  {filteredCompetitions.length} {filteredCompetitions.length === 1 ? 'tävling' : 'tävlingar'} hittades
                </h2>
              </div>
            </div>
            
            {renderCompetitionView()}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Search;
