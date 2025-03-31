import React, { useState, useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchFilters from "@/components/SearchFilters";
import { competitions } from "@/data/competitions";
import { filterCompetitions } from "@/lib/utils";
import { SearchFilters as SearchFiltersType } from "@/types";
import { Filter, Trash2, MapPin, PanelLeftClose, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import CompetitionMapView from "@/components/CompetitionMapView";
import CompetitionCalendarView from "@/components/CompetitionCalendarView";
import { useIsMobile, useBreakpoint } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const SEARCH_SIDEBAR_OPEN_KEY = "search-sidebar-open";
const SEARCH_FILTERS_KEY = "search-filters";
const SEARCH_MAP_VISIBLE_KEY = "search-map-visible";
const HEADER_HEIGHT = 64;

const Search = () => {
  const location = useLocation();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const breakpoint = useBreakpoint();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const filterRef = useRef<HTMLDivElement>(null);
  const filterContentRef = useRef<HTMLDivElement>(null);
  
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
    if (isMobile) {
      setSidebarOpen(true);
    } else if (savedSidebarState !== null) {
      setSidebarOpen(savedSidebarState === "true");
    } else {
      setSidebarOpen(!isMobile);
    }
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem(SEARCH_SIDEBAR_OPEN_KEY, sidebarOpen.toString());
    }
  }, [sidebarOpen, isMobile]);

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
      showMap: filters.showMap
    };
    
    setFilters({...resetFilters});
    
    toast({
      title: "Filtren har återställts",
      description: "Alla valda filter har rensats - nu visas alla tävlingar"
    });
  };

  const toggleSidebar = () => {
    if (!isMobile) {
      setSidebarOpen(!sidebarOpen);
    }
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
    return filterCompetitions(competitions, filters);
  }, [competitions, filters, typesArray, branchesArray]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Hitta tävlingar</h1>
          <p className="text-muted-foreground">Upptäck orienteringsutmaningar baserat på datum, plats och disciplin</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-full">
          {(sidebarOpen || isMobile) && (
            <div className="w-full md:w-80 flex-shrink-0" ref={filterRef}>
              <div ref={filterContentRef} className="mb-4">
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
            <div className="bg-card rounded-lg border p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex flex-col">
                  <h2 className="font-semibold text-lg">
                    {filteredCompetitions.length === 0 ? 'Inga tävlingar hittades' : 
                    `${filteredCompetitions.length} ${filteredCompetitions.length === 1 ? 'tävling' : 'tävlingar'}`}
                  </h2>
                  {hasActiveFilters && (
                    <p className="text-muted-foreground text-sm">Anpassade resultat baserat på dina val</p>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {!isMobile && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={sidebarOpen ? "default" : "outline"}
                            size="icon"
                            onClick={toggleSidebar}
                            className="h-9 w-9 active:bg-primary focus:bg-primary active:text-primary-foreground focus:text-primary-foreground relative"
                          >
                            {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
                            {hasActiveFilters && !sidebarOpen && (
                              <Badge 
                                variant="secondary"
                                className="absolute -top-2 -right-2 h-5 min-w-5 flex items-center justify-center p-0 text-xs"
                              >
                                {filters.disciplines.length + filters.districts.length + typesArray.length + branchesArray.length + (filters.dateRange ? 1 : 0)}
                              </Badge>
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          {sidebarOpen ? "Dölj filter" : "Visa filter"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  
                  <Button
                    variant={filters.showMap ? "default" : "outline"}
                    size="sm"
                    onClick={toggleMapVisibility}
                    className="h-9 active:bg-primary focus:bg-primary active:text-primary-foreground focus:text-primary-foreground"
                    onTouchEnd={(e) => {
                      e.currentTarget.blur();
                    }}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{filters.showMap ? "Dölj karta" : "Visa karta"}</span>
                  </Button>
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
                <h3 className="text-lg font-medium mb-2">Vi hittade inga tävlingar</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Inga tävlingar matchar dina nuvarande filter. Prova att justera dem för att se fler resultat.
                </p>
                <ul className="text-left text-sm text-muted-foreground max-w-xs mx-auto mb-6 space-y-2">
                  <li className="flex items-start">
                    <span className="bg-muted rounded-full p-1 mr-2 mt-0.5">
                      <Filter className="h-3 w-3" />
                    </span>
                    <span>Minska antalet aktiva filter</span>
                  </li>
                </ul>
                <Button
                  onClick={handleClearAllFilters}
                  className="bg-primary hover:bg-primary/90"
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
