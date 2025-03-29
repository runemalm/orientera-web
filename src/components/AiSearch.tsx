
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchFilters } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Simple NLP processing to extract key terms from natural language queries
const processNaturalLanguageQuery = (query: string): SearchFilters => {
  query = query.toLowerCase();
  const filters: SearchFilters = {
    regions: [],
    districts: [],
    disciplines: [],
    levels: [],
    searchQuery: "",
  };

  // Extract disciplines
  const disciplines = ['sprint', 'medel', 'lång', 'natt', 'stafett', 'ultralång'];
  disciplines.forEach(discipline => {
    if (query.includes(discipline)) {
      // Convert to proper case for first letter
      const formattedDiscipline = discipline.charAt(0).toUpperCase() + discipline.slice(1);
      filters.disciplines.push(formattedDiscipline as any);
    }
  });

  // Extract competition levels
  const levels = ['klubb', 'krets', 'distrikt', 'nationell', 'internationell'];
  levels.forEach(level => {
    if (query.includes(level)) {
      // Convert to proper case for first letter
      const formattedLevel = level.charAt(0).toUpperCase() + level.slice(1);
      filters.levels.push(formattedLevel as any);
    }
  });

  // Extract dates - basic date extraction
  if (query.includes('30 dagar') || query.includes('nästa månad')) {
    const now = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(now.getDate() + 30);
    
    filters.dateRange = {
      from: now,
      to: thirtyDaysLater
    };
  } else if (query.includes('denna vecka') || query.includes('den här veckan')) {
    const now = new Date();
    const endOfWeek = new Date();
    const day = endOfWeek.getDay();
    const diff = 7 - day;
    endOfWeek.setDate(endOfWeek.getDate() + diff);
    
    filters.dateRange = {
      from: now,
      to: endOfWeek
    };
  }

  // Extract text for general search
  // Remove the detected filters to leave the search terms
  const searchTerms = query
    .replace(/sprint|medel|lång|natt|stafett|ultralång/g, '')
    .replace(/klubb|krets|distrikt|nationell|internationell/g, '')
    .replace(/30 dagar|nästa månad|denna vecka|den här veckan/g, '')
    .trim();

  filters.searchQuery = searchTerms;

  return filters;
};

interface AiSearchProps {
  className?: string;
}

const AiSearch: React.FC<AiSearchProps> = ({ className }) => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast({
        title: "Tomt sökfält",
        description: "Vänligen ange vad du letar efter",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Process the natural language query
      const filters = processNaturalLanguageQuery(query);
      
      // Prepare URL search params
      const searchParams = new URLSearchParams();
      
      // Add disciplines
      if (filters.disciplines.length > 0) {
        searchParams.append('disciplines', filters.disciplines.join(','));
      }
      
      // Add levels
      if (filters.levels.length > 0) {
        searchParams.append('levels', filters.levels.join(','));
      }

      // Add date range if available
      if (filters.dateRange?.from) {
        searchParams.append('dateFrom', filters.dateRange.from.toISOString());
        
        if (filters.dateRange.to) {
          searchParams.append('dateTo', filters.dateRange.to.toISOString());
        }
      }
      
      // Add search query
      if (filters.searchQuery) {
        searchParams.append('q', filters.searchQuery);
      }
      
      // Add AI mode flag
      searchParams.append('mode', 'ai');

      // Navigate to search page with the extracted filters
      navigate(`/search?${searchParams.toString()}`);
      
      toast({
        title: "Sökning bearbetad",
        description: "Visar resultat baserat på din sökning",
      });
    } catch (error) {
      console.error("Error processing query:", error);
      toast({
        title: "Något gick fel",
        description: "Det gick inte att bearbeta din sökning",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exampleQueries = [
    "Sprint tävlingar i Stockholm",
    "Nationella tävlingar nästa månad",
    "Långdistans i Skåne"
  ];

  const handleExampleClick = (example: string) => {
    setQuery(example);
  };

  return (
    <div className={`w-full max-w-3xl mx-auto ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Textarea
            placeholder="Beskriv den tävling du letar efter, t.ex. 'Nationella tävlingar i Skåne nästa månad'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-[120px] text-base resize-none p-4 pr-12 shadow-md"
          />
          <Sparkles className="absolute right-4 top-4 h-6 w-6 text-muted-foreground" />
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? "Bearbetar sökning..." : "Sök med AI"}
        </Button>
      </form>
      
      <div className="mt-4">
        <p className="text-sm text-muted-foreground mb-2">Exempel:</p>
        <div className="flex flex-wrap gap-2">
          {exampleQueries.map((example, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleExampleClick(example)}
              className="text-xs"
            >
              {example}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AiSearch;
