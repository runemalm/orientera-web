
import React, { useState, useEffect } from "react";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Competition } from "@/types";
import { MapPin } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface SearchAutocompleteProps {
  competitions: Competition[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onCompetitionSelect: (competition: Competition) => void;
  isOpen: boolean;
}

const SearchAutocomplete = ({
  competitions,
  searchQuery,
  onSearchChange,
  onCompetitionSelect,
  isOpen
}: SearchAutocompleteProps) => {
  const [filteredCompetitions, setFilteredCompetitions] = useState<Competition[]>([]);
  
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setFilteredCompetitions([]);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const matches = competitions.filter(competition => 
      competition.name.toLowerCase().includes(query) || 
      competition.location.toLowerCase().includes(query) ||
      competition.organizer.toLowerCase().includes(query)
    ).slice(0, 5); // Limit to 5 results
    
    setFilteredCompetitions(matches);
  }, [searchQuery, competitions]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 right-0 z-50 border rounded-md bg-background shadow-md mt-1">
      <CommandList className="max-h-[300px] overflow-y-auto p-1">
        {filteredCompetitions.length === 0 ? (
          <CommandEmpty>Inga tävlingar hittades</CommandEmpty>
        ) : (
          <CommandGroup heading="Tävlingar">
            {filteredCompetitions.map((competition) => (
              <CommandItem
                key={competition.id}
                onSelect={() => onCompetitionSelect(competition)}
                className="flex flex-col items-start py-3 cursor-pointer"
              >
                <div className="font-medium">{competition.name}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{competition.location}</span>
                  <span className="mx-2">•</span>
                  <span>{formatDate(competition.date)}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </div>
  );
};

export default SearchAutocomplete;
