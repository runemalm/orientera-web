
import { FilterIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion
} from "@/components/ui/accordion";
import { SearchFilters as SearchFiltersType, CompetitionType, CompetitionBranch } from "@/types";
import CheckboxFilter from "./search/CheckboxFilter";
import DateRangeFilter from "./search/DateRangeFilter";
import { useToast } from "@/hooks/use-toast";
import { districts } from "@/data/districts";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const disciplines = ['Sprint', 'Medel', 'Lång', 'Natt', 'Stafett', 'Ultralång'];
const competitionTypes: CompetitionType[] = ['Värdetävlingar', 'Nationella tävlingar', 'Distriktstävlingar', 'Närtävlingar', 'Veckans bana'];
const competitionBranches: CompetitionBranch[] = ['Orienteringslöpning', 'Skidorientering', 'Mountainbikeorientering', 'Precisionsorientering', 'Orienteringsskytte'];

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFilterChange: (filters: SearchFiltersType) => void;
  hasLocation: boolean;
  hideSearchInput?: boolean;
}

const EXPANDED_FILTERS_KEY = "search-expanded-filters";

const SearchFiltersComponent = ({ 
  filters, 
  onFilterChange, 
  hasLocation,
  hideSearchInput = false
}: SearchFiltersProps) => {
  const { toast } = useToast();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  
  useEffect(() => {
    const savedExpandedItems = localStorage.getItem(EXPANDED_FILTERS_KEY);
    if (savedExpandedItems) {
      try {
        const parsed = JSON.parse(savedExpandedItems);
        setExpandedItems(parsed);
      } catch (error) {
        console.error("Failed to parse saved expanded filters", error);
        setExpandedItems([]);
      }
    } 
  }, []);

  useEffect(() => {
    if (expandedItems.length > 0) {
      localStorage.setItem(EXPANDED_FILTERS_KEY, JSON.stringify(expandedItems));
    }
  }, [expandedItems]);
  
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
      title: "Filtren har återställts",
      description: "Alla valda filter har rensats - nu visas alla tävlingar"
    });
  };

  const handleClearFilter = (filterType: 'districts' | 'disciplines' | 'types' | 'branches') => {
    const updatedFilters = {...filters};
    updatedFilters[filterType] = [];
    onFilterChange(updatedFilters);
    
    toast({
      title: `${getFilterGroupName(filterType)} har rensats`,
      description: `Alla valda ${getFilterGroupName(filterType).toLowerCase()} har rensats`
    });
  };
  
  const getFilterGroupName = (filterType: string): string => {
    switch(filterType) {
      case 'districts': return 'Distrikt';
      case 'disciplines': return 'Discipliner';
      case 'types': return 'Tävlingstyper';
      case 'branches': return 'Orienteringsgrenar';
      default: return 'Filter';
    }
  };

  const hasActiveDateFilter = Boolean(filters.dateRange?.from || filters.dateRange?.to);
  const hasActiveFilters = filters.districts.length > 0 || 
                           filters.disciplines.length > 0 || 
                           filters.types?.length > 0 || 
                           filters.branches?.length > 0 ||
                           hasActiveDateFilter;

  return (
    <div className="rounded-lg border bg-card">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FilterIcon className="h-4 w-4" />
            <h3 className="font-medium">Filtrera tävlingar</h3>
          </div>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleClearAllFilters}
              className="text-xs h-7 px-2"
            >
              <X className="h-3 w-3 mr-1" />
              Rensa alla
            </Button>
          )}
        </div>

        {hasActiveFilters && (
          <div className="bg-muted/50 rounded-md p-2 mb-4 flex flex-wrap gap-1.5">
            {filters.districts.length > 0 && (
              <Badge variant="outline" className="flex items-center gap-1 px-1.5 py-1 h-6 bg-background">
                <span className="text-xs">{filters.districts.length} distrikt</span>
                <Button variant="ghost" size="sm" onClick={() => handleClearFilter('districts')} className="h-4 w-4 p-0">
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {filters.disciplines.length > 0 && (
              <Badge variant="outline" className="flex items-center gap-1 px-1.5 py-1 h-6 bg-background">
                <span className="text-xs">{filters.disciplines.length} discipliner</span>
                <Button variant="ghost" size="sm" onClick={() => handleClearFilter('disciplines')} className="h-4 w-4 p-0">
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {filters.types && filters.types.length > 0 && (
              <Badge variant="outline" className="flex items-center gap-1 px-1.5 py-1 h-6 bg-background">
                <span className="text-xs">{filters.types.length} tävlingstyper</span>
                <Button variant="ghost" size="sm" onClick={() => handleClearFilter('types')} className="h-4 w-4 p-0">
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {filters.branches && filters.branches.length > 0 && (
              <Badge variant="outline" className="flex items-center gap-1 px-1.5 py-1 h-6 bg-background">
                <span className="text-xs">{filters.branches.length} grenar</span>
                <Button variant="ghost" size="sm" onClick={() => handleClearFilter('branches')} className="h-4 w-4 p-0">
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {hasActiveDateFilter && (
              <Badge variant="outline" className="flex items-center gap-1 px-1.5 py-1 h-6 bg-background">
                <span className="text-xs">Datumfilter</span>
                <Button variant="ghost" size="sm" onClick={() => handleDateRangeChange(undefined)} className="h-4 w-4 p-0">
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
          </div>
        )}

        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Datum</h4>
          <div className="bg-background rounded-md border p-3">
            <DateRangeFilter 
              dateRange={filters.dateRange} 
              onDateRangeChange={handleDateRangeChange}
              hasActiveFilter={hasActiveDateFilter}
              removeHeader={true}
            />
          </div>
        </div>

        <Accordion 
          type="multiple" 
          value={expandedItems}
          onValueChange={setExpandedItems}
          className="space-y-2"
        >
          <CheckboxFilter
            title="Typ av tävling"
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
            title="Distrikt"
            items={districts.map(d => ({ id: d.id, name: d.name }))}
            selectedItems={filters.districts}
            onItemChange={handleDistrictChange}
            accordionValue="district"
          />

          <CheckboxFilter
            title="Orienteringsgren"
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
