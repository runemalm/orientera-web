
import React from "react";
import { History, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommandItem, CommandGroup, CommandSeparator } from "@/components/ui/command";
import { LocationItem } from "@/utils/locationHistory";

interface LocationHistoryListProps {
  locations: LocationItem[];
  onSelectLocation: (name: string, display: string) => void;
  onRemoveLocation: (e: React.MouseEvent, name: string) => void;
  onClearHistory: () => void;
}

const LocationHistoryList = ({
  locations,
  onSelectLocation,
  onRemoveLocation,
  onClearHistory
}: LocationHistoryListProps) => {
  if (locations.length === 0) {
    return null;
  }
  
  return (
    <>
      <CommandGroup heading="Tidigare platser">
        <div className="flex items-center justify-between px-2 mb-1">
          <span className="text-xs text-muted-foreground">
            Tidigare platser du använt
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearHistory}
            className="h-7 px-2 text-xs"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Rensa historik
          </Button>
        </div>
        {locations.map((city, index) => (
          <CommandItem
            key={`history-${index}`}
            value={`history-${city.name}`}
            onSelect={() => onSelectLocation(city.name, city.display)}
            className="cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center space-x-2">
              <History className="h-4 w-4 opacity-50" />
              <div className="text-sm">
                <div className="font-medium">{city.name}</div>
                <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                  {city.display}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-50 hover:opacity-100"
              onClick={(e) => onRemoveLocation(e, city.name)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Ta bort från historik</span>
            </Button>
          </CommandItem>
        ))}
      </CommandGroup>
      <CommandSeparator />
    </>
  );
};

export default LocationHistoryList;
