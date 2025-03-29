import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchFilters from "@/components/SearchFilters";
import { competitions } from "@/data/competitions";
import { filterCompetitions } from "@/lib/utils";
import { SearchFilters as SearchFiltersType } from "@/types";
import { X, Sparkles, Clock, Search as SearchIcon, Filter, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import CompetitionCompactView from "@/components/CompetitionCompactView";
import { isBefore, isAfter, isEqual, parseISO } from "date-fns";
import { processNaturalLanguageQuery } from "@/utils/aiQueryProcessor";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [activeTab, setActiveTab] = useState("ai");
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

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-6">Sök tävlingar</h1>
        
        <div className="max-w-3xl mx-auto">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="ai">
                <Sparkles className="mr-2 h-4 w-4" />
                Sök med AI
              </TabsTrigger>
              <TabsTrigger value="manual">
                <Filter className="mr-2 h-4 w-4" />
                Klassisk sök
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="ai" className="space-y-4">
              <div className="rounded-lg border bg-card p-4">
                <div className="mb-4 text-sm text-muted-foreground">
                  <p className="mb-2">Beskriv den tävling du letar efter med dina egna ord, så hjälper vår AI dig att hitta rätt.</p>
                  <p>Exempel: "Nationella tävlingar nära Stockholm i juni" eller "Sprint för ungdomar på klubbnivå"</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Input
                      placeholder="Sök efter tävlingar med vanligt språk..."
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
                        Bearbetar sökning...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Sök
                      </>
                    )}
                  </Button>
                </form>
                
                {recentSearches.length > 0 && (
                  <div className="mt-4">
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
      </main>
      
      <Footer />
    </div>
  );
};

export default Search;
