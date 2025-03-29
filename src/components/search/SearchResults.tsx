
import React from "react";
import CompetitionCard from "@/components/CompetitionCard";
import { Competition } from "@/types";

interface SearchResultsProps {
  competitions: Competition[];
}

const SearchResults = ({ competitions }: SearchResultsProps) => {
  if (competitions.length === 0) {
    return (
      <div className="bg-card rounded-lg border p-8 text-center">
        <h3 className="text-lg font-medium mb-2">Inga tävlingar hittades</h3>
        <p className="text-muted-foreground mb-4">
          Det finns inga tävlingar som matchar dina filter. Prova att ändra dina sökkriterier.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {competitions.map((competition) => (
        <CompetitionCard 
          key={competition.id} 
          competition={competition} 
          featured={competition.featured}
        />
      ))}
    </div>
  );
};

export default SearchResults;
