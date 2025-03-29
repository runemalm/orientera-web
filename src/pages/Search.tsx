
import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchFilters from "@/components/SearchFilters";
import { competitions } from "@/data/competitions";
import { filterCompetitions } from "@/lib/utils";
import { SearchFilters as SearchFiltersType } from "@/types";
import { X, Clock, Search as SearchIcon, Filter, Trash2, TrendingUp, List, Calendar, Map, ViewIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import CompetitionCompactView from "@/components/CompetitionCompactView";
import CompetitionListView from "@/components/CompetitionListView";
import CompetitionCalendarView from "@/components/CompetitionCalendarView";
import CompetitionMapView from "@/components/CompetitionMapView";
import { isBefore, isAfter, isEqual, parseISO } from "date-fns";
import { processNaturalLanguageQuery } from "@/utils/aiQueryProcessor";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Array of popular searches to display when no recent searches exist
const popularSearches = [
  "Nationella tävlingar i sommar",
  "Sprinttävlingar i Stockholm",
  "Ungdomstävlingar nästa månad",
  "Stafetter i södra Sverige",
  "Långdistans i fjällen",
];

// View options for search results
type ViewOption = "compact" | "list" | "calendar" | "map";

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
  const [viewOption, setViewOption] = useState<ViewOption>("compact");
  const [isProcessing, setIsProcessing] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('recentAiSearches');
    return saved ? JSON.parse(saved) : [];
  });

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

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-6">Sök tävlingar</h1>
        
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <SearchFilters 
              filters={filters} 
              onFilterChange={handleFilterChange} 
              hasLocation={false}
              hideSearchInput={true}
            />
          </div>
          
          <div className="bg-card rounded-lg border p-4 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h2 className="font-semibold">
                {filteredCompetitions.length} {filteredCompetitions.length === 1 ? 'tävling' : 'tävlingar'} hittades
              </h2>
              
              <div className="w-full sm:w-auto">
                <Tabs 
                  value={viewOption} 
                  onValueChange={(value) => setViewOption(value as ViewOption)}
                  className="w-full sm:w-auto"
                >
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="compact" title="Kompakt vy">
                      <ViewIcon className="h-4 w-4" />
                      {!isMobile && <span className="ml-2">Kompakt</span>}
                    </TabsTrigger>
                    <TabsTrigger value="list" title="Listvy">
                      <List className="h-4 w-4" />
                      {!isMobile && <span className="ml-2">Lista</span>}
                    </TabsTrigger>
                    <TabsTrigger value="calendar" title="Kalendervy">
                      <Calendar className="h-4 w-4" />
                      {!isMobile && <span className="ml-2">Kalender</span>}
                    </TabsTrigger>
                    <TabsTrigger value="map" title="Kartvy">
                      <Map className="h-4 w-4" />
                      {!isMobile && <span className="ml-2">Karta</span>}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>
          
          {filteredCompetitions.length > 0 ? (
            <>
              {viewOption === "compact" && <CompetitionCompactView competitions={filteredCompetitions} />}
              {viewOption === "list" && <CompetitionListView competitions={filteredCompetitions} />}
              {viewOption === "calendar" && <CompetitionCalendarView competitions={filteredCompetitions} />}
              {viewOption === "map" && <CompetitionMapView competitions={filteredCompetitions} />}
            </>
          ) : (
            <div className="bg-card rounded-lg border p-8 text-center">
              <h3 className="text-lg font-medium mb-2">Inga tävlingar hittades</h3>
              <p className="text-muted-foreground mb-4">
                Det finns inga tävlingar som matchar dina filter. Prova att ändra dina sökkriterier.
              </p>
            </div>
          )}
          
          {recentSearches.length > 0 && (
            <div className="mt-8 bg-card rounded-lg border p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium">Senaste sökningar</h3>
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
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchInputValue(search);
                      processQuery(search);
                    }}
                    className="text-xs"
                  >
                    <SearchIcon className="h-3 w-3 mr-2" />
                    {search.length > 20 ? `${search.substring(0, 20)}...` : search}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-4 bg-card rounded-lg border p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium">Populära sökningar</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((search, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchInputValue(search);
                    processQuery(search);
                  }}
                  className="text-xs"
                >
                  <SearchIcon className="h-3 w-3 mr-2" />
                  {search}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Search;
