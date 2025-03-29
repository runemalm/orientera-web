
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, Search, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SearchFilters } from "@/types";
import { processNaturalLanguageQuery } from "@/utils/aiQueryProcessor";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AiSearchCardProps {
  onSearchComplete: (newFilters: SearchFilters) => void;
  initialQuery?: string;
}

// Quick searches that users can select directly
const quickSearches = [
  { id: 'upcoming', label: 'Kommande tävlingar', query: 'Tävlingar de närmaste 30 dagarna' },
  { id: 'national', label: 'Nationella tävlingar', query: 'Nationella tävlingar' },
  { id: 'youth', label: 'Ungdomstävlingar', query: 'Tävlingar för ungdomar' },
  { id: 'sprint', label: 'Sprinttävlingar', query: 'Sprint tävlingar' },
];

const AiSearchCard = ({ onSearchComplete, initialQuery = "" }: AiSearchCardProps) => {
  const [aiQuery, setAiQuery] = useState(initialQuery);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('recentAiSearches');
    return saved ? JSON.parse(saved) : [];
  });
  const { toast } = useToast();

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
      
      // Save the search to history
      const updatedSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
      setRecentSearches(updatedSearches);
      localStorage.setItem('recentAiSearches', JSON.stringify(updatedSearches));
      
      onSearchComplete(newFilters);
      
      toast({
        title: "Sökning genomförd",
        description: "Filtren har uppdaterats baserat på din sökning",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error processing AI query:", error);
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
    processQuery(aiQuery);
  };

  const handleQuickSearch = (query: string) => {
    setAiQuery(query);
    processQuery(query);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Sök med AI</CardTitle>
        </div>
        <CardDescription>
          Beskriv tävlingen du letar efter med egna ord
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Textarea
              placeholder="Exempel: 'Nationella tävlingar i Skåne nästa månad' eller 'Sprinttävlingar för ungdomar'"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              className="min-h-[80px] text-base resize-none"
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Bearbetar...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Sök med AI
              </>
            )}
          </Button>
        </form>
        
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Snabbval</h3>
          <div className="flex flex-wrap gap-2">
            {quickSearches.map((search) => (
              <Button
                key={search.id}
                variant="outline"
                size="sm"
                onClick={() => handleQuickSearch(search.query)}
                className="text-xs"
              >
                {search.label}
              </Button>
            ))}
          </div>
        </div>
        
        {recentSearches.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Senaste sökningar</h3>
            </div>
            <div className="flex flex-col gap-1">
              {recentSearches.map((search, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuickSearch(search)}
                  className="text-xs justify-start h-auto py-1.5 text-muted-foreground hover:text-foreground"
                >
                  <Search className="h-3 w-3 mr-2" />
                  {search.length > 60 ? `${search.substring(0, 60)}...` : search}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AiSearchCard;
