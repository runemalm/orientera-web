
import { useState } from "react";
import { SearchIcon, FilterIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { regions } from "@/data/regions";
import { districts } from "@/data/districts";
import { SearchFilters } from "@/types";

interface SearchFiltersProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
}

const disciplines = ['Sprint', 'Medel', 'Lång', 'Natt', 'Stafett', 'Ultralång'];
const levels = ['Klubb', 'Krets', 'Distrikt', 'Nationell', 'Internationell'];
const distances = [10, 25, 50, 100, 200];

const SearchFiltersComponent = ({ filters, onFilterChange }: SearchFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState(filters.searchQuery || "");
  
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

          <AccordionItem value="distance" className="border-b-0">
            <AccordionTrigger className="py-2 hover:no-underline">
              <span className="text-sm font-medium">Avstånd från min position</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={filters.distance === undefined ? "bg-primary text-primary-foreground" : ""}
                    onClick={() => handleDistanceChange(null)}
                  >
                    Alla
                  </Button>
                  {distances.map(distance => (
                    <Button 
                      key={distance}
                      variant="outline" 
                      size="sm"
                      className={filters.distance === distance ? "bg-primary text-primary-foreground" : ""}
                      onClick={() => handleDistanceChange(distance)}
                    >
                      {distance} km
                    </Button>
                  ))}
                </div>
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
            distance: undefined
          })}
        >
          Rensa alla filter
        </Button>
      </div>
    </div>
  );
};

export default SearchFiltersComponent;
