
import React, { useState, useEffect, useCallback } from "react";
import { MapPinOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  Command,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { useToast } from "@/hooks/use-toast";
import { 
  getLocationHistory, 
  saveLocationHistory, 
  removeFromHistory, 
  clearLocationHistory,
  LocationItem 
} from "@/utils/locationHistory";
import { 
  CitySuggestion,
  debouncedFetchSuggestions 
} from "@/services/locationService";
import LocationHistoryList from "./LocationHistoryList";
import LocationSearchResults from "./LocationSearchResults";

interface LocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCitySelect: (city: string) => Promise<boolean>;
}

const LocationDialog = ({ open, onOpenChange, onCitySelect }: LocationDialogProps) => {
  const [citySuggestions, setCitySuggestions] = useState<CitySuggestion[]>([]);
  const [citySearchValue, setCitySearchValue] = useState("");
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [locationHistory, setLocationHistory] = useState<LocationItem[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  // Load location history when dialog opens
  useEffect(() => {
    if (open) {
      setLocationHistory(getLocationHistory());
      // Reset search state when dialog opens
      setCitySearchValue("");
      setHasSearched(false);
    }
  }, [open]);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 2) {
      setCitySuggestions([]);
      return;
    }
    
    setIsLoadingSuggestions(true);
    setHasSearched(true);
    
    try {
      // Use the updated debouncedFetchSuggestions with callback pattern
      debouncedFetchSuggestions(query, (suggestions) => {
        setCitySuggestions(suggestions);
        setIsLoadingSuggestions(false);
      });
    } catch (error) {
      console.error("Error fetching city suggestions:", error);
      setCitySuggestions([]);
      setIsLoadingSuggestions(false);
    }
  }, []);

  // Fetch suggestions when search value changes
  useEffect(() => {
    if (citySearchValue) {
      fetchSuggestions(citySearchValue);
    } else {
      setCitySuggestions([]);
      setHasSearched(false);
    }
  }, [citySearchValue, fetchSuggestions]);

  const handleSelectCity = async (cityName: string, displayName?: string) => {
    const success = await onCitySelect(cityName);
    if (success) {
      // Save to history if selection was successful
      if (displayName) {
        saveLocationHistory({ name: cityName, display: displayName });
        // Update the local state to reflect changes
        setLocationHistory(getLocationHistory());
      }
      setCitySearchValue("");
    }
  };

  const handleRemoveFromHistory = (e: React.MouseEvent, name: string) => {
    e.stopPropagation(); // Prevent triggering the parent's onClick
    const updatedHistory = removeFromHistory(name);
    setLocationHistory(updatedHistory);
  };

  const handleClearHistory = () => {
    const updatedHistory = clearLocationHistory();
    setLocationHistory(updatedHistory);
    toast({
      title: "Platshistorik rensad",
      description: "Alla tidigare platser har tagits bort",
      duration: 3000,
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="w-full">
            <MapPinOff className="h-3.5 w-3.5 mr-1" />
            <span className="truncate">Ange ort</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ange stad eller ort i Sverige</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="city-search">Stad eller ort</Label>
              <Command className="rounded-lg border shadow-md">
                <div className="flex items-center border-b px-3">
                  <Label htmlFor="city-search-input" className="sr-only">Search</Label>
                  <MapPinOff className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  <CommandInput 
                    id="city-search-input"
                    placeholder="Sök efter stad eller ort..." 
                    value={citySearchValue}
                    onValueChange={setCitySearchValue}
                  />
                </div>
                <CommandList>
                  <LocationHistoryList 
                    locations={locationHistory}
                    onSelectLocation={handleSelectCity}
                    onRemoveLocation={handleRemoveFromHistory}
                    onClearHistory={handleClearHistory}
                  />
                  
                  <LocationSearchResults 
                    hasSearched={hasSearched}
                    searchValue={citySearchValue}
                    isLoading={isLoadingSuggestions}
                    results={citySuggestions}
                    onSelectLocation={handleSelectCity}
                  />
                </CommandList>
              </Command>
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Avbryt
              </Button>
              <Button 
                type="button"
                disabled={citySearchValue.length < 2}
                onClick={() => handleSelectCity(citySearchValue)}
              >
                Använd position
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LocationDialog;
