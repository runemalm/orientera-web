
import { FilterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion
} from "@/components/ui/accordion";
import { SearchFilters as SearchFiltersType } from "@/types";
import DistanceFilter from "./search/DistanceFilter";
import CheckboxFilter from "./search/CheckboxFilter";
import DateRangeFilter from "./search/DateRangeFilter";

const disciplines = ['Sprint', 'Medel', 'Lång', 'Natt', 'Stafett', 'Ultralång'];
const levels = ['Klubb', 'Krets', 'Distrikt', 'Nationell', 'Internationell'];

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFilterChange: (filters: SearchFiltersType) => void;
  hasLocation: boolean;
  hideSearchInput?: boolean;
}

const SearchFiltersComponent = ({ 
  filters, 
  onFilterChange, 
  hasLocation,
  hideSearchInput = false
}: SearchFiltersProps) => {
  
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

  const handleDateRangeChange = (dateRange: { from: Date; to?: Date } | undefined) => {
    onFilterChange({ ...filters, dateRange });
  };

  const handleDetectLocation = () => {
    onFilterChange({
      ...filters,
      isManualLocation: false
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
      detectedLocationInfo: filters.detectedLocationInfo,
      dateRange: undefined
    });
  };

  return (
    <div className="rounded-lg border bg-card">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FilterIcon className="h-4 w-4" />
            <h3 className="font-medium">Filtrera</h3>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleClearAllFilters}
          >
            Rensa alla
          </Button>
        </div>

        <Accordion type="multiple" defaultValue={["date-range", "distance", "discipline", "level"]} className="space-y-2">
          <DateRangeFilter 
            dateRange={filters.dateRange} 
            onDateRangeChange={handleDateRangeChange}
          />

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
      </div>
    </div>
  );
};

export default SearchFiltersComponent;
