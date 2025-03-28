
import React, { useState, useEffect } from "react";
import { CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Competition } from "@/types";
import { Search as SearchIcon, MapPin } from "lucide-react";
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

  return (
    <div className={`relative ${isOpen ? '' : 'hidden'}`}>
      <div className="absolute top-0 left-0 right-0 z-50 border rounded-md bg-background shadow-md mt-1">
        <div className="flex items-center border-b px-3">
          <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <CommandInput
            value={searchQuery}
            onValueChange={onSearchChange}
            placeholder="Sök efter tävlingsnamn eller plats..."
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        
        <CommandList className="max-h-[300px] overflow-y-auto p-1">
          {filteredCompetitions.length === 0 && searchQuery.length >= 2 ? (
            <CommandEmpty>Inga tävlingar hittades</CommandEmpty>
          ) : (
            filteredCompetitions.length > 0 && (
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
            )
          )}
        </CommandList>
      </div>
    </div>
  );
};

export default SearchAutocomplete;
