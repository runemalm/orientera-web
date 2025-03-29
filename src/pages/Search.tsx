
import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchFilters from "@/components/SearchFilters";
import { competitions } from "@/data/competitions";
import { filterCompetitions } from "@/lib/utils";
import { SearchFilters as SearchFiltersType } from "@/types";
import { X, Filter, Trash2, List, Map, Calendar, LayoutPanelLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import CompetitionCompactView from "@/components/CompetitionCompactView";
import CompetitionListView from "@/components/CompetitionListView";
import CompetitionMapView from "@/components/CompetitionMapView";
import CompetitionCalendarView from "@/components/CompetitionCalendarView";
import { isBefore, isAfter, isEqual, parseISO } from "date-fns";
import { useIsMobile, useBreakpoint } from "@/hooks/use-mobile";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

const SEARCH_RESULTS_VIEW_KEY = "search-results-view";
const SEARCH_SIDEBAR_OPEN_KEY = "search-sidebar-open";

const Search = () => {
  const location = useLocation();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const breakpoint = useBreakpoint();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
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
  const [resultsView, setResultsView] = useState<"list" | "calendar" | "map">("list");

  useEffect(() => {
    const savedView = localStorage.getItem(SEARCH_RESULTS_VIEW_KEY) as "list" | "calendar" | "map" | null;
    if (savedView && ["list", "calendar", "map"].includes(savedView)) {
      setResultsView(savedView);
    }
  }, []);

  useEffect(() => {
    const savedSidebarState = localStorage.getItem(SEARCH_SIDEBAR_OPEN_KEY);
    if (savedSidebarState !== null) {
      setSidebarOpen(savedSidebarState === "true");
    } else {
      setSidebarOpen(!isMobile);
    }
  }, [isMobile]);

  useEffect(() => {
    localStorage.setItem(SEARCH_RESULTS_VIEW_KEY, resultsView);
  }, [resultsView]);

  useEffect(() => {
    localStorage.setItem(SEARCH_SIDEBAR_OPEN_KEY, sidebarOpen.toString());
  }, [sidebarOpen]);

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
      description: "Alla tävlingar visas nu utan sökfilter"
    });
  };

  const handleClearAllFilters = () => {
    const resetFilters: SearchFiltersType = {
      regions: [],
      districts: [],
      disciplines: [],
      levels: [],
      types: [],
      branches: [],
      searchQuery: "", 
      dateRange: undefined
    };
    
    setFilters(resetFilters);
    setSearchInputValue("");
    
    toast({
      title: "Filtren har återställts",
      description: "Alla valda filter har rensats - nu visas alla tävlingar"
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchInputValue.trim()) {
      return;
    }
    
    setFilters({
      ...filters,
      searchQuery: searchInputValue
    });
    
    toast({
      title: "Sökning slutförd",
      description: `Visar resultat för "${searchInputValue}"`
    });
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-6">Hitta din nästa orienteringsutmaning</h1>
        
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-full">
          {isMobile && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSidebar}
              className="mb-4 flex items-center"
            >
              <LayoutPanelLeft className="mr-2 h-4 w-4" />
              {sidebarOpen ? "Dölj filter" : "Visa filter"}
            </Button>
          )}
          
          {sidebarOpen && (
            <div className="w-full md:w-80 flex-shrink-0">
              <div className="mb-4">
                <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
                  <Filter className="h-5 w-5" />
                  Filtrera tävlingar
                </h2>
                
                <form onSubmit={handleSubmit} className="mb-4">
                  <div className="relative mb-4">
                    <Input
                      placeholder="Sök efter tävlingsnamn, plats..."
                      value={searchInputValue}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="pr-8"
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
                    variant="default" 
                    className="w-full"
                    disabled={!searchInputValue.trim()}
                  >
                    Sök
                  </Button>
                </form>
                
                <SearchFilters 
                  filters={filters} 
                  onFilterChange={handleFilterChange} 
                  hasLocation={false}
                  hideSearchInput={true}
                />
                
                {(filters.regions.length > 0 || 
                  filters.districts.length > 0 || 
                  filters.disciplines.length > 0 || 
                  filters.levels.length > 0 || 
                  filters.types.length > 0 || 
                  filters.branches.length > 0 || 
                  filters.searchQuery) && (
                  <Button
                    variant="outline"
                    onClick={handleClearAllFilters}
                    className="w-full mt-4"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Rensa alla filter
                  </Button>
                )}
              </div>
            </div>
          )}
          
          <div className="flex-1">
            <div className="bg-card rounded-lg border p-4 mb-6">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold">
                  {filteredCompetitions.length === 0 ? 'Inga tävlingar hittades' : 
                  `${filteredCompetitions.length} ${filteredCompetitions.length === 1 ? 'tävling' : 'tävlingar'} matchar dina kriterier`}
                </h2>
                
                <div className="flex items-center gap-2">
                  {!isMobile && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleSidebar}
                      className="mr-2"
                    >
                      <LayoutPanelLeft className="h-4 w-4" />
                      <span className="sr-only">{sidebarOpen ? "Dölj filter" : "Visa filter"}</span>
                    </Button>
                  )}
                  
                  <ToggleGroup type="single" value={resultsView} onValueChange={(value) => value && setResultsView(value as "list" | "calendar" | "map")}>
                    <ToggleGroupItem value="list" aria-label="Visa som lista">
                      <List className="h-4 w-4 mr-1" />
                      Lista
                    </ToggleGroupItem>
                    <ToggleGroupItem value="calendar" aria-label="Visa som kalender">
                      <Calendar className="h-4 w-4 mr-1" />
                      Kalender
                    </ToggleGroupItem>
                    <ToggleGroupItem value="map" aria-label="Visa på karta">
                      <Map className="h-4 w-4 mr-1" />
                      Karta
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>
            </div>
            
            {filteredCompetitions.length > 0 ? (
              <>
                {resultsView === "list" && (
                  <CompetitionListView competitions={filteredCompetitions} />
                )}
                
                {resultsView === "calendar" && (
                  <CompetitionCalendarView competitions={filteredCompetitions} />
                )}
                
                {resultsView === "map" && (
                  <CompetitionMapView competitions={filteredCompetitions} />
                )}
              </>
            ) : (
              <div className="bg-card rounded-lg border p-8 text-center">
                <h3 className="text-lg font-medium mb-2">Inga matchande tävlingar</h3>
                <p className="text-muted-foreground mb-4">
                  Vi hittade inga tävlingar som matchar dina kriterier. Prova att:
                </p>
                <ul className="text-left text-sm text-muted-foreground ml-6 mb-4 list-disc space-y-1">
                  <li>Ändra ditt datumintervall</li>
                  <li>Ta bort några filter</li>
                  <li>Bredda din sökning med färre söktermer</li>
                </ul>
                <Button
                  variant="outline"
                  onClick={handleClearAllFilters}
                >
                  Rensa alla filter
                </Button>
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
