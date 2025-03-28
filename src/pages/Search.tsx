import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchFilters from "@/components/SearchFilters";
import { competitions } from "@/data/competitions";
import { filterCompetitions } from "@/lib/utils";
import { SearchFilters as SearchFiltersType } from "@/types";
import { X, Sparkles, Clock, Search as SearchIcon, Filter, Trash2, TrendingUp, List, Map, Calendar, LayoutPanelLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import CompetitionCompactView from "@/components/CompetitionCompactView";
import CompetitionListView from "@/components/CompetitionListView";
import CompetitionMapView from "@/components/CompetitionMapView";
import CompetitionCalendarView from "@/components/CompetitionCalendarView";
import { isBefore, isAfter, isEqual, parseISO } from "date-fns";
import { processNaturalLanguageQuery } from "@/utils/aiQueryProcessor";
import { useIsMobile, useBreakpoint } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

const popularSearches = [
  "Nationella tävlingar i sommar",
  "Sprinttävlingar i Stockholm",
  "Ungdomstävlingar nästa månad",
  "Stafetter i södra Sverige",
  "Långdistans i fjällen",
];

const SEARCH_ACTIVE_TAB_KEY = "search-active-tab";
const SEARCH_RESULTS_VIEW_KEY = "search-results-view";
const RECENT_AI_SEARCHES_KEY = "recentAiSearches";
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
  const [activeTab, setActiveTab] = useState<string>("ai");
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultsView, setResultsView] = useState<"list" | "calendar" | "map">("list");
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem(RECENT_AI_SEARCHES_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const savedTab = localStorage.getItem(SEARCH_ACTIVE_TAB_KEY);
    if (savedTab) {
      setActiveTab(savedTab);
    }

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
    localStorage.setItem(SEARCH_ACTIVE_TAB_KEY, activeTab);
  }, [activeTab]);

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
      
      if (aiMode || searchQuery) {
        setActiveTab("ai");
        
        if (aiMode) {
          toast({
            title: "Sökning från AI",
            description: "Filtren har applicerats baserat på din AI-sökning",
            duration: 3000,
          });
        }
      }
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

  const handleClearHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_AI_SEARCHES_KEY);
    toast({
      title: "Sökhistoriken rensad",
      description: "Dina tidigare sökningar har tagits bort"
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

  const processQuery = (query: string) => {
    if (!query.trim()) {
      toast({
        title: "Tomt sökfält",
        description: "Beskriv gärna vilken typ av tävling du letar efter",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setSearchInputValue(query);

    try {
      const newFilters = processNaturalLanguageQuery(query);
      
      const updatedSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
      setRecentSearches(updatedSearches);
      localStorage.setItem(RECENT_AI_SEARCHES_KEY, JSON.stringify(updatedSearches));
      
      setFilters({
        ...filters,
        disciplines: newFilters.disciplines,
        levels: newFilters.levels,
        dateRange: newFilters.dateRange,
        searchQuery: query
      });
      
      toast({
        title: "Sökningen bearbetad",
        description: "Din sökning har tolkats och resultaten visas nedan"
      });
    } catch (error) {
      console.error("Error processing query:", error);
      toast({
        title: "Något gick fel",
        description: "Vi kunde inte bearbeta din sökning just nu",
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

  const handleTabChange = (value: string) => {
    setActiveTab(value);
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
              <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="ai">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Smarta sökningar
                  </TabsTrigger>
                  <TabsTrigger value="manual">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtrera tävlingar
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="ai" className="space-y-4">
                  <div className="rounded-lg border bg-card p-4">
                    <div className="mb-4 text-sm text-muted-foreground">
                      <p className="mb-2">Beskriv tävlingen du söker med dina egna ord, så hjälper vår AI dig hitta den perfekta matchen.</p>
                      <p>Testa att beskriva plats, disciplin, svårighetsgrad eller när du vill tävla!</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="relative">
                        <Input
                          placeholder="Till exempel: &quot;Sprinttävlingar i Skåne under våren&quot;..."
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
                        {isProcessing ? (
                          <>
                            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                            Letar efter tävlingar...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Hitta tävlingar
                          </>
                        )}
                      </Button>
                    </form>
                    
                    {recentSearches.length > 0 && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <h3 className="text-sm font-medium">Dina senaste sökningar</h3>
                          </div>
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
                        <div className="flex flex-col gap-1">
                          {recentSearches.map((search, index) => (
                            <Button
                              key={index}
                              variant="ghost"
                              size="sm"
                              onClick={() => processQuery(search)}
                              className="text-xs justify-start h-auto py-1.5 text-muted-foreground hover:text-foreground"
                            >
                              <SearchIcon className="h-3 w-3 mr-2" />
                              {search.length > 60 ? `${search.substring(0, 60)}...` : search}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-medium">Populära sökningar</h3>
                      </div>
                      <div className="flex flex-col gap-1">
                        {popularSearches.map((search, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            onClick={() => processQuery(search)}
                            className="text-xs justify-start h-auto py-1.5 text-muted-foreground hover:text-foreground"
                          >
                            <SearchIcon className="h-3 w-3 mr-2" />
                            {search}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="manual">
                  <div className="mb-4">
                    <SearchFilters 
                      filters={filters} 
                      onFilterChange={handleFilterChange} 
                      hasLocation={false}
                      hideSearchInput={true}
                    />
                  </div>
                </TabsContent>
              </Tabs>
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
                  
                  {activeTab === "manual" && (
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
                  )}
                </div>
              </div>
            </div>
            
            {filteredCompetitions.length > 0 ? (
              <>
                {activeTab === "ai" && (
                  <CompetitionCompactView competitions={filteredCompetitions} />
                )}
                
                {activeTab === "manual" && resultsView === "list" && (
                  <CompetitionListView competitions={filteredCompetitions} />
                )}
                
                {activeTab === "manual" && resultsView === "calendar" && (
                  <CompetitionCalendarView competitions={filteredCompetitions} />
                )}
                
                {activeTab === "manual" && resultsView === "map" && (
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
