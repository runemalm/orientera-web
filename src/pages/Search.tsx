import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchFilters from "@/components/SearchFilters";
import { competitions } from "@/data/competitions";
import { filterCompetitions } from "@/lib/utils";
import { SearchFilters as SearchFiltersType } from "@/types";
import { Filter, Trash2, Map, Calendar, LayoutPanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import CompetitionMapView from "@/components/CompetitionMapView";
import CompetitionCalendarView from "@/components/CompetitionCalendarView";
import { useIsMobile, useBreakpoint } from "@/hooks/use-mobile";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

const SEARCH_RESULTS_VIEW_KEY = "search-results-view";
const SEARCH_SIDEBAR_OPEN_KEY = "search-sidebar-open";
const SEARCH_FILTERS_KEY = "search-filters";
const SEARCH_MAP_VISIBLE_KEY = "search-map-visible";

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
    searchQuery: "",
    showMap: false
  });

  const [resultsView, setResultsView] = useState<"calendar">("calendar");

  useEffect(() => {
    const savedFilters = localStorage.getItem(SEARCH_FILTERS_KEY);
    if (savedFilters) {
      try {
        const parsedFilters = JSON.parse(savedFilters);
        
        parsedFilters.types = Array.isArray(parsedFilters.types) ? parsedFilters.types : [];
        parsedFilters.branches = Array.isArray(parsedFilters.branches) ? parsedFilters.branches : [];
        
        if (parsedFilters.dateRange) {
          if (parsedFilters.dateRange.from) {
            parsedFilters.dateRange.from = new Date(parsedFilters.dateRange.from);
          }
          if (parsedFilters.dateRange.to) {
            parsedFilters.dateRange.to = new Date(parsedFilters.dateRange.to);
          }
        }
        
        setFilters(parsedFilters);
      } catch (error) {
        console.error("Failed to parse saved filters", error);
      }
    }
  }, []);

  useEffect(() => {
    const savedMapVisible = localStorage.getItem(SEARCH_MAP_VISIBLE_KEY);
    if (savedMapVisible !== null) {
      setFilters(prev => ({
        ...prev,
        showMap: savedMapVisible === "true"
      }));
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
    if (filters.showMap !== undefined) {
      localStorage.setItem(SEARCH_MAP_VISIBLE_KEY, filters.showMap.toString());
    }
  }, [filters.showMap]);

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
    
    if (disciplines.length > 0 || levels.length > 0 || dateRange) {
      setFilters(prevFilters => ({
        ...prevFilters,
        disciplines: disciplines as any[],
        levels: levels as any[],
        dateRange
      }));
    }
  }, [location.search, toast]);

  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      localStorage.setItem(SEARCH_FILTERS_KEY, JSON.stringify(filters));
    }
  }, [filters]);

  const handleFilterChange = (newFilters: SearchFiltersType) => {
    newFilters.types = Array.isArray(newFilters.types) ? newFilters.types : [];
    newFilters.branches = Array.isArray(newFilters.branches) ? newFilters.branches : [];
    
    console.log("Filter changed:", newFilters);
    setFilters(newFilters);
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
      dateRange: undefined,
      showMap: filters.showMap // Preserve map visibility setting
    };
    
    setFilters(resetFilters);
    
    toast({
      title: "Filtren har återställts",
      description: "Alla valda filter har rensats - nu visas alla tävlingar"
    });
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMapVisibility = () => {
    setFilters(prev => ({
      ...prev,
      showMap: !prev.showMap
    }));
  };

  const typesArray = Array.isArray(filters.types) ? filters.types : [];
  const branchesArray = Array.isArray(filters.branches) ? filters.branches : [];
  
  const hasActiveFilters = filters.regions.length > 0 || 
                          filters.districts.length > 0 || 
                          filters.disciplines.length > 0 || 
                          filters.levels.length > 0 || 
                          typesArray.length > 0 || 
                          branchesArray.length > 0 ||
                          filters.dateRange?.from !== undefined;

  const filteredCompetitions = useMemo(() => {
    console.log("Filtering with:", { 
      typesLength: typesArray.length, 
      types: typesArray,
      branchesLength: branchesArray.length,
      branches: branchesArray
    });
    
    return filterCompetitions(competitions, filters);
  }, [competitions, filters, typesArray, branchesArray]);

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
              <Filter className="mr-2 h-4 w-4" />
              {sidebarOpen ? "Dölj filter" : "Visa filter"}
            </Button>
          )}
          
          {sidebarOpen && (
            <div className="w-full md:w-80 flex-shrink-0">
              <div className="mb-4 sticky top-4">
                <SearchFilters 
                  filters={filters} 
                  onFilterChange={handleFilterChange} 
                  hasLocation={false}
                  hideSearchInput={true}
                />
              </div>
            </div>
          )}
          
          <div className="flex-1">
            <div className="bg-card rounded-lg border p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex flex-col">
                <h2 className="font-semibold text-lg">
                  {filteredCompetitions.length === 0 ? 'Inga tävlingar hittades' : 
                  `${filteredCompetitions.length} ${filteredCompetitions.length === 1 ? 'tävling' : 'tävlingar'}`}
                </h2>
                {hasActiveFilters && (
                  <p className="text-muted-foreground text-sm">Filtrerade resultat</p>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {!isMobile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleSidebar}
                    className="mr-2"
                    title={sidebarOpen ? "Dölj filter" : "Visa filter"}
                  >
                    <LayoutPanelLeft className="h-4 w-4" />
                    <span className="sr-only">{sidebarOpen ? "Dölj filter" : "Visa filter"}</span>
                  </Button>
                )}
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-muted p-1.5 rounded-md">
                    <Switch 
                      id="map-toggle"
                      checked={filters.showMap}
                      onCheckedChange={toggleMapVisibility}
                      className="data-[state=checked]:bg-primary"
                    />
                    <label htmlFor="map-toggle" className="text-xs font-medium cursor-pointer">
                      <Map className="h-3.5 w-3.5 mr-1 inline-block" />
                      Visa karta
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            {filteredCompetitions.length > 0 ? (
              <div className="space-y-6">
                {filters.showMap && (
                  <div className="mb-6">
                    <CompetitionMapView competitions={filteredCompetitions} />
                  </div>
                )}
                
                <CompetitionCalendarView competitions={filteredCompetitions} />
              </div>
            ) : (
              <div className="bg-card rounded-lg border p-8 text-center">
                <h3 className="text-lg font-medium mb-2">Inga matchande tävlingar</h3>
                <p className="text-muted-foreground mb-4">
                  Vi hittade inga tävlingar som matchar dina kriterier. Prova att:
                </p>
                <ul className="text-left text-sm text-muted-foreground ml-6 mb-4 list-disc space-y-1">
                  <li>Ändra ditt datumintervall</li>
                  <li>Ta bort några filter</li>
                </ul>
                <Button
                  variant="outline"
                  onClick={handleClearAllFilters}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
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
