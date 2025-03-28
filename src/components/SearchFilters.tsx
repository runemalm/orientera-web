
import { useState } from "react";
import { SearchIcon, FilterIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion
} from "@/components/ui/accordion";
import { regions } from "@/data/regions";
import { districts } from "@/data/districts";
import { SearchFilters as SearchFiltersType } from "@/types";
import DistanceFilter from "./search/DistanceFilter";
import CheckboxFilter from "./search/CheckboxFilter";

const disciplines = ['Sprint', 'Medel', 'Lång', 'Natt', 'Stafett', 'Ultralång'];
const levels = ['Klubb', 'Krets', 'Distrikt', 'Nationell', 'Internationell'];

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFilterChange: (filters: SearchFiltersType) => void;
  hasLocation: boolean;
}

const SearchFiltersComponent = ({ filters, onFilterChange, hasLocation }: SearchFiltersProps) => {
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

  const handleDetectLocation = () => {
    onFilterChange({
      ...filters,
      isManualLocation: false,
      userLocation: undefined,
      locationCity: undefined
    });
  };

  const handleSetManualLocation = async (cityName: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}, Sweden&countrycodes=se&limit=1`
      );
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        onFilterChange({
          ...filters,
          userLocation: { lat: parseFloat(lat), lng: parseFloat(lon) },
          isManualLocation: true,
          locationCity: cityName
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error geocoding city:", error);
      return false;
    }
  };

  const handleClearAllFilters = () => {
    onFilterChange({
      regions: [],
      districts: [],
      disciplines: [],
      levels: [],
      searchQuery: "",
      distance: undefined,
      userLocation: filters.userLocation,
      isManualLocation: filters.isManualLocation,
      locationCity: filters.locationCity,
      detectedLocationInfo: filters.detectedLocationInfo
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
          <DistanceFilter
            userLocation={filters.userLocation}
            detectedLocationInfo={filters.detectedLocationInfo}
            distance={filters.distance}
            isManualLocation={filters.isManualLocation || false}
            locationCity={filters.locationCity}
            onDistanceChange={handleDistanceChange}
            onDetectLocation={handleDetectLocation}
            onSetManualLocation={handleSetManualLocation}
          />

          <CheckboxFilter
            title="Län"
            items={regions.map(r => ({ id: r.id, name: r.name }))}
            selectedItems={filters.regions}
            onItemChange={handleRegionChange}
            accordionValue="regions"
          />

          <CheckboxFilter
            title="Distrikt"
            items={districts.map(d => ({ id: d.id, name: d.name }))}
            selectedItems={filters.districts}
            onItemChange={handleDistrictChange}
            accordionValue="districts"
          />

          <CheckboxFilter
            title="Disciplin"
            items={disciplines.map(d => ({ id: d, name: d }))}
            selectedItems={filters.disciplines}
            onItemChange={handleDisciplineChange}
            accordionValue="discipline"
          />

          <CheckboxFilter
            title="Tävlingsnivå"
            items={levels.map(l => ({ id: l, name: l }))}
            selectedItems={filters.levels}
            onItemChange={handleLevelChange}
            accordionValue="level"
          />
        </Accordion>
        
        <Button 
          className="w-full mt-4" 
          variant="outline"
          onClick={handleClearAllFilters}
        >
          Rensa alla filter
        </Button>
      </div>
    </div>
  );
};

export default SearchFiltersComponent;
