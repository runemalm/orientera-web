
import { FilterIcon, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion
} from "@/components/ui/accordion";
import { SearchFilters as SearchFiltersType, CompetitionType, CompetitionBranch } from "@/types";
import CheckboxFilter from "./search/CheckboxFilter";
import DateRangeFilter from "./search/DateRangeFilter";
import { useToast } from "@/hooks/use-toast";
import { districts } from "@/data/districts";
import { useState } from "react";

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
  const [expandedItems, setExpandedItems] = useState<string[]>(["date-range"]);
  const [isAllExpanded, setIsAllExpanded] = useState(false);
  
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

  const handleExpandCollapseAll = () => {
    if (isAllExpanded) {
      // Collapse all
      setExpandedItems([]);
    } else {
      // Expand all
      setExpandedItems(["date-range", "district", "type", "discipline", "branch"]);
    }
    setIsAllExpanded(!isAllExpanded);
  };

  // Determine if any date filters are active
  const hasActiveDateFilter = Boolean(filters.dateRange?.from || filters.dateRange?.to);

  return (
    <div className="rounded-lg border bg-card">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FilterIcon className="h-4 w-4" />
            <h3 className="font-medium">Filtrera</h3>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExpandCollapseAll}
              className="text-xs"
            >
              {isAllExpanded ? (
                <>
                  <ChevronUp className="h-3.5 w-3.5 mr-1.5" />
                  Dölj alla
                </>
              ) : (
                <>
                  <ChevronDown className="h-3.5 w-3.5 mr-1.5" />
                  Visa alla
                </>
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleClearAllFilters}
            >
              Rensa alla
            </Button>
          </div>
        </div>

        <Accordion 
          type="multiple" 
          value={expandedItems}
          onValueChange={setExpandedItems}
          className="space-y-2"
        >
          <DateRangeFilter 
            dateRange={filters.dateRange} 
            onDateRangeChange={handleDateRangeChange}
            hasActiveFilter={hasActiveDateFilter}
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
