
import { useState } from "react";
import { SearchIcon, FilterIcon, MapPin, MapPinOff, Locate } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { regions } from "@/data/regions";
import { districts } from "@/data/districts";
import { SearchFilters, Coordinates } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface SearchFiltersProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
  hasLocation: boolean;
}

const disciplines = ['Sprint', 'Medel', 'Lång', 'Natt', 'Stafett', 'Ultralång'];
const levels = ['Klubb', 'Krets', 'Distrikt', 'Nationell', 'Internationell'];
const distances = [10, 25, 50, 100, 200];

// Schema for location validation
const locationSchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
});

const SearchFiltersComponent = ({ filters, onFilterChange, hasLocation }: SearchFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState(filters.searchQuery || "");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const form = useForm<z.infer<typeof locationSchema>>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      lat: filters.userLocation?.lat || 59.329,
      lng: filters.userLocation?.lng || 18.068,
    },
  });

  const handleTextSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ ...filters, searchQuery });
  };

  const handleRegionChange = (regionId: string, checked: boolean) => {
    let updatedRegions = [...filters.regions];
    if (checked) {
      updatedRegions.push(regionId);
    } else {
      updatedRegions = updatedRegions.filter(id => id !== regionId);
    }
    onFilterChange({ ...filters, regions: updatedRegions });
  };

  const handleDistrictChange = (districtId: string, checked: boolean) => {
    let updatedDistricts = [...filters.districts];
    if (checked) {
      updatedDistricts.push(districtId);
    } else {
      updatedDistricts = updatedDistricts.filter(id => id !== districtId);
    }
    onFilterChange({ ...filters, districts: updatedDistricts });
  };

  const handleDisciplineChange = (discipline: string, checked: boolean) => {
    let updatedDisciplines = [...filters.disciplines];
    if (checked) {
      updatedDisciplines.push(discipline as any);
    } else {
      updatedDisciplines = updatedDisciplines.filter(d => d !== discipline);
    }
    onFilterChange({ ...filters, disciplines: updatedDisciplines });
  };

  const handleLevelChange = (level: string, checked: boolean) => {
    let updatedLevels = [...filters.levels];
    if (checked) {
      updatedLevels.push(level as any);
    } else {
      updatedLevels = updatedLevels.filter(l => l !== level);
    }
    onFilterChange({ ...filters, levels: updatedLevels });
  };

  const handleDistanceChange = (distance: number | null) => {
    onFilterChange({ ...filters, distance: distance || undefined });
  };

  const handleLocationSubmit = (values: z.infer<typeof locationSchema>) => {
    onFilterChange({
      ...filters,
      userLocation: { lat: values.lat, lng: values.lng },
      isManualLocation: true
    });
    setIsDialogOpen(false);
  };

  const handleAutoDetect = () => {
    onFilterChange({
      ...filters,
      isManualLocation: false,
      userLocation: undefined, // This will trigger the geolocation request in Search.tsx
    });
  };

  return (
    <div className="rounded-lg border bg-card">
      <div className="p-4 border-b">
        <form onSubmit={handleTextSearch} className="flex gap-2">
          <Input
            placeholder="Sök efter tävlingsnamn eller plats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <SearchIcon className="h-4 w-4" />
          </Button>
        </form>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <FilterIcon className="h-4 w-4" />
          <h3 className="font-medium">Filtrera</h3>
        </div>

        <Accordion type="multiple" defaultValue={["distance", "discipline", "level"]} className="space-y-4">
          <AccordionItem value="distance" className="border-b-0">
            <AccordionTrigger className="py-2 hover:no-underline">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm font-medium">Avstånd från min position</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                {/* Improved location status and controls layout */}
                <div className="space-y-2">
                  {/* Location status indicator */}
                  <div className="text-sm">
                    {filters.userLocation ? (
                      <span className="text-sm text-muted-foreground">
                        {filters.isManualLocation ? "Manuellt vald position" : "Detekterad position"}
                      </span>
                    ) : (
                      <span className="text-sm text-destructive font-medium">
                        Ingen position tillgänglig
                      </span>
                    )}
                  </div>
                  
                  {/* Location control buttons in a responsive grid */}
                  <div className="grid grid-cols-2 gap-2">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full">
                          <MapPinOff className="h-3.5 w-3.5 mr-1" />
                          <span className="truncate">Manuell</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Ange din position manuellt</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={form.handleSubmit(handleLocationSubmit)} className="space-y-4 pt-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="latitude">Latitude</Label>
                              <Input
                                id="latitude"
                                placeholder="59.329"
                                {...form.register("lat")}
                              />
                              {form.formState.errors.lat && (
                                <p className="text-sm text-destructive">Ogiltigt latitudvärde</p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="longitude">Longitude</Label>
                              <Input
                                id="longitude"
                                placeholder="18.068"
                                {...form.register("lng")}
                              />
                              {form.formState.errors.lng && (
                                <p className="text-sm text-destructive">Ogiltigt longitudvärde</p>
                              )}
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Button type="submit">Använd position</Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={handleAutoDetect}
                    >
                      <Locate className="h-3.5 w-3.5 mr-1" />
                      <span className="truncate">Auto</span>
                    </Button>
                  </div>
                </div>
                
                {/* Distance buttons UI */}
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant={filters.distance === undefined ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleDistanceChange(null)}
                    className="w-full"
                  >
                    Alla
                  </Button>
                  {distances.map(distance => (
                    <Button 
                      key={distance}
                      variant={filters.distance === distance ? "default" : "outline"}
                      size="sm"
                      disabled={!filters.userLocation}
                      onClick={() => handleDistanceChange(distance)}
                      className="w-full"
                    >
                      {distance} km
                    </Button>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="regions" className="border-b-0">
            <AccordionTrigger className="py-2 hover:no-underline">
              <span className="text-sm font-medium">Län</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-2">
                {regions.map((region) => (
                  <div className="flex items-center space-x-2" key={region.id}>
                    <Checkbox 
                      id={`region-${region.id}`} 
                      checked={filters.regions.includes(region.id)}
                      onCheckedChange={(checked) => 
                        handleRegionChange(region.id, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={`region-${region.id}`}
                      className="text-sm cursor-pointer"
                    >
                      {region.name}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="districts" className="border-b-0">
            <AccordionTrigger className="py-2 hover:no-underline">
              <span className="text-sm font-medium">Distrikt</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-2">
                {districts.map((district) => (
                  <div className="flex items-center space-x-2" key={district.id}>
                    <Checkbox 
                      id={`district-${district.id}`} 
                      checked={filters.districts.includes(district.id)}
                      onCheckedChange={(checked) => 
                        handleDistrictChange(district.id, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={`district-${district.id}`}
                      className="text-sm cursor-pointer"
                    >
                      {district.name}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="discipline" className="border-b-0">
            <AccordionTrigger className="py-2 hover:no-underline">
              <span className="text-sm font-medium">Disciplin</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-2">
                {disciplines.map((discipline) => (
                  <div className="flex items-center space-x-2" key={discipline}>
                    <Checkbox 
                      id={`discipline-${discipline}`} 
                      checked={filters.disciplines.includes(discipline as any)}
                      onCheckedChange={(checked) => 
                        handleDisciplineChange(discipline, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={`discipline-${discipline}`}
                      className="text-sm cursor-pointer"
                    >
                      {discipline}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="level" className="border-b-0">
            <AccordionTrigger className="py-2 hover:no-underline">
              <span className="text-sm font-medium">Tävlingsnivå</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-2">
                {levels.map((level) => (
                  <div className="flex items-center space-x-2" key={level}>
                    <Checkbox 
                      id={`level-${level}`} 
                      checked={filters.levels.includes(level as any)}
                      onCheckedChange={(checked) => 
                        handleLevelChange(level, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={`level-${level}`}
                      className="text-sm cursor-pointer"
                    >
                      {level}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <Button 
          className="w-full mt-4" 
          variant="outline"
          onClick={() => onFilterChange({
            regions: [],
            districts: [],
            disciplines: [],
            levels: [],
            searchQuery: "",
            distance: undefined,
            userLocation: filters.userLocation,
            isManualLocation: filters.isManualLocation
          })}
        >
          Rensa alla filter
        </Button>
      </div>
    </div>
  );
};

export default SearchFiltersComponent;
