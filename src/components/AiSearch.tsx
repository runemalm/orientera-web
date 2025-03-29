
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { processNaturalLanguageQuery } from "@/utils/aiQueryProcessor";

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
      
      // Add mode parameter to indicate AI search
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
            placeholder="Exempel: 'Jag letar efter nationella tävlingar i Skåne nästa månad' eller 'Medeldistans tävlingar för ungdomar på klubbnivå'"
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
export { processNaturalLanguageQuery };
