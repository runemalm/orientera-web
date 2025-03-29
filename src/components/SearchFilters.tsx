
import { FilterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion
} from "@/components/ui/accordion";
import { SearchFilters as SearchFiltersType, CompetitionType, CompetitionBranch } from "@/types";
import DistanceFilter from "./search/DistanceFilter";
import CheckboxFilter from "./search/CheckboxFilter";
import DateRangeFilter from "./search/DateRangeFilter";
import { useToast } from "@/hooks/use-toast";
import { districts } from "@/data/districts";

const disciplines = ['Sprint', 'Medel', 'Lång', 'Natt', 'Stafett', 'Ultralång'];
const levels = ['Klubb', 'Krets', 'Distrikt', 'Nationell', 'Internationell'];
const competitionTypes: CompetitionType[] = ['Värdetävlingar', 'Nationella tävlingar', 'Distriktstävlingar', 'Närtävlingar', 'Veckans bana'];
const competitionBranches: CompetitionBranch[] = ['Orienteringslöpning', 'Skidorientering', 'Mountainbikeorientering', 'Precisionsorientering', 'Orienteringsskytte'];

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
  const { toast } = useToast();
  
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

  const handleTypeChange = (type: string, checked: boolean) => {
    let updatedTypes = [...(filters.types || [])];
    if (checked) {
      updatedTypes.push(type as CompetitionType);
    } else {
      updatedTypes = updatedTypes.filter(t => t !== type);
    }
    onFilterChange({ ...filters, types: updatedTypes });
  };

  const handleBranchChange = (branch: string, checked: boolean) => {
    let updatedBranches = [...(filters.branches || [])];
    if (checked) {
      updatedBranches.push(branch as CompetitionBranch);
    } else {
      updatedBranches = updatedBranches.filter(b => b !== branch);
    }
    onFilterChange({ ...filters, branches: updatedBranches });
  };

  const handleDistrictChange = (district: string, checked: boolean) => {
    let updatedDistricts = [...filters.districts];
    if (checked) {
      updatedDistricts.push(district);
    } else {
      updatedDistricts = updatedDistricts.filter(d => d !== district);
    }
    onFilterChange({ ...filters, districts: updatedDistricts });
  };

  const handleDateRangeChange = (dateRange: { from: Date; to?: Date } | undefined) => {
    onFilterChange({ ...filters, dateRange });
  };

  const handleDistanceChange = (distance: number | null) => {
    onFilterChange({ ...filters, distance: distance || undefined });
  };

  const handleLocationSearch = async (cityName: string) => {
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
      types: [],
      branches: [],
      searchQuery: "", 
      distance: undefined,
      userLocation: undefined,
      locationCity: undefined,
      dateRange: undefined
    });
    
    toast({
      title: "Filter rensade",
      description: "Alla filter har återställts"
    });
  };

  // Get a friendly location name to display
  const locationName = filters.locationCity;

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

        <Accordion type="multiple" defaultValue={["date-range", "distance", "district", "type", "discipline", "branch"]} className="space-y-2">
          <DateRangeFilter 
            dateRange={filters.dateRange} 
            onDateRangeChange={handleDateRangeChange}
          />

          <DistanceFilter
            userLocation={filters.userLocation}
            distance={filters.distance}
            locationName={locationName}
            onDistanceChange={handleDistanceChange}
            onLocationSearch={handleLocationSearch}
          />

          <CheckboxFilter
            title="Distrikt"
            items={districts.map(d => ({ id: d.id, name: d.name }))}
            selectedItems={filters.districts}
            onItemChange={handleDistrictChange}
            accordionValue="district"
          />

          <CheckboxFilter
            title="Typ"
            items={competitionTypes.map(t => ({ id: t, name: t }))}
            selectedItems={filters.types || []}
            onItemChange={handleTypeChange}
            accordionValue="type"
          />

          <CheckboxFilter
            title="Disciplin"
            items={disciplines.map(d => ({ id: d, name: d }))}
            selectedItems={filters.disciplines}
            onItemChange={handleDisciplineChange}
            accordionValue="discipline"
          />

          <CheckboxFilter
            title="Gren"
            items={competitionBranches.map(b => ({ id: b, name: b }))}
            selectedItems={filters.branches || []}
            onItemChange={handleBranchChange}
            accordionValue="branch"
          />
        </Accordion>
      </div>
    </div>
  );
};

export default SearchFiltersComponent;
