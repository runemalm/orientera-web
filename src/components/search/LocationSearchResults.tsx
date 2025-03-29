
import React from "react";
import { CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { LocationItem } from "@/utils/locationHistory";

interface LocationSearchResultsProps {
  hasSearched: boolean;
  searchValue: string;
  isLoading: boolean;
  results: LocationItem[];
  onSelectLocation: (name: string, display: string) => void;
}

const LocationSearchResults = ({
  hasSearched,
  searchValue,
  isLoading,
  results,
  onSelectLocation
}: LocationSearchResultsProps) => {
  if (isLoading) {
    return <div className="py-6 text-center text-sm">Laddar förslag...</div>;
  }

  if (!hasSearched) {
    if (searchValue.length > 0 && searchValue.length < 2) {
      return (
        <div className="py-6 text-center text-sm text-muted-foreground">
          Skriv minst två tecken för att söka
        </div>
      );
    }
    return null;
  }

  return (
    <>
      {results.length === 0 && <CommandEmpty>Inga träffar i Sverige</CommandEmpty>}
      {results.length > 0 && (
        <CommandGroup heading="Sökresultat">
          {results.map((city, index) => (
            <CommandItem
              key={index}
              value={city.name}
              onSelect={() => onSelectLocation(city.name, city.display)}
              className="cursor-pointer flex items-start py-2"
            >
              <div className="text-sm w-full">
                <div className="font-medium">{city.name}</div>
                <div className="text-xs text-muted-foreground truncate max-w-full">
                  {city.display}
                </div>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      )}
    </>
  );
};

export default LocationSearchResults;
