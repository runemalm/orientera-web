
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SearchFilters } from "@/types";
import { processNaturalLanguageQuery } from "@/utils/aiQueryProcessor";

interface AiSearchCardProps {
  onSearchComplete: (newFilters: SearchFilters) => void;
  initialQuery?: string;
}

const AiSearchCard = ({ onSearchComplete, initialQuery = "" }: AiSearchCardProps) => {
  const [aiQuery, setAiQuery] = useState(initialQuery);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!aiQuery.trim()) {
      toast({
        title: "Tomt sökfält",
        description: "Vänligen beskriv vad du letar efter",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const newFilters = processNaturalLanguageQuery(aiQuery);
      
      onSearchComplete(newFilters);
      
      toast({
        title: "AI-sökning bearbetad",
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

  return (
    <div className="rounded-lg border bg-card shadow-sm p-5">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-medium">Sök med AI</h2>
      </div>
      
      <p className="text-muted-foreground mb-4 text-sm">
        Beskriv den typ av tävling du letar efter med dina egna ord, så hjälper AI dig att hitta rätt.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Textarea
            placeholder="Exempel: 'Jag letar efter nationella tävlingar i Skåne nästa månad' eller 'Medeldistans tävlingar för ungdomar på klubbnivå'"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            className="min-h-[100px] text-base resize-none"
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
              Bearbetar sökning...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Sök med AI
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default AiSearchCard;
