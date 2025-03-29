import { FilterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion
} from "@/components/ui/accordion";
import { SearchFilters as SearchFiltersType, CompetitionType, CompetitionBranch } from "@/types";
import CheckboxFilter from "./search/CheckboxFilter";
import DateRangeFilter from "./search/DateRangeFilter";
import { useToast } from "@/hooks/use-toast";
import { districts } from "@/data/districts";

const disciplines = ['Sprint', 'Medel', 'Lång', 'Natt', 'Stafett', 'Ultralång'];
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

  const handleDateRangeChange = (dateRange: { from?: Date; to?: Date } | undefined) => {
    onFilterChange({ ...filters, dateRange });
  };

  const handleClearAllFilters = () => {
    const resetFilters: SearchFiltersType = {
      regions: [],
      districts: [],
      disciplines: [],
      levels: [],
      types: [],
      branches: [],
      searchQuery: "", 
      dateRange: undefined
    };
    
    onFilterChange(resetFilters);
    
    toast({
      title: "Filter rensade",
      description: "Alla filter har återställts"
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

        <Accordion type="multiple" defaultValue={["date-range", "district", "type", "discipline", "branch"]} className="space-y-2">
          <DateRangeFilter 
            dateRange={filters.dateRange} 
            onDateRangeChange={handleDateRangeChange}
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
