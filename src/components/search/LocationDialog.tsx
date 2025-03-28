
import React, { useState, useEffect, useCallback } from "react";
import { MapPinOff, X } from "lucide-react";
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
  const [citySearchValue, setCitySearchValue] = useState("");
  const [citySuggestions, setCitySuggestions] = useState<CitySuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [locationHistory, setLocationHistory] = useState<LocationItem[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setLocationHistory(getLocationHistory());
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
      if (displayName) {
        saveLocationHistory({ name: cityName, display: displayName });
        setLocationHistory(getLocationHistory());
      }
      setCitySearchValue("");
    }
  };

  const handleRemoveFromHistory = (e: React.MouseEvent, name: string) => {
    e.stopPropagation();
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
                <CommandInput 
                  id="city-search-input"
                  placeholder="Sök efter stad eller ort..." 
                  value={citySearchValue}
                  onValueChange={setCitySearchValue}
                  className="border-0"
                />
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
