import { FilterIcon, X, SearchIcon, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { SearchFilters as SearchFiltersType, CompetitionType, CompetitionBranch, Discipline } from "@/types";
import CheckboxFilter from "./search/CheckboxFilter";
import DateRangeFilter from "./search/DateRangeFilter";
import { useToast } from "@/hooks/use-toast";
import { districts } from "@/data/districts";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useIsMobile, useBreakpoint } from "@/hooks/use-mobile";
import { Switch } from "@/components/ui/switch";
import { MapPin } from "lucide-react";

const disciplines: Discipline[] = ['Sprint', 'Medel', 'Lång', 'Natt', 'Stafett', 'Ultralång'];
const competitionTypes: CompetitionType[] = ['Värdetävlingar', 'Nationella tävlingar', 'Distriktstävlingar', 'Närtävlingar', 'Veckans bana'];
const competitionBranches: CompetitionBranch[] = ['Orienteringslöpning', 'Skidorientering', 'Mountainbikeorientering', 'Precisionsorientering', 'Orienteringsskytte'];

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFilterChange: (filters: SearchFiltersType) => void;
  hasLocation: boolean;
  hideSearchInput?: boolean;
  showMapToggle?: boolean;
}

const SearchFiltersComponent = ({ 
  filters, 
  onFilterChange, 
  hasLocation,
  hideSearchInput = false,
  showMapToggle = false
}: SearchFiltersProps) => {
  const { toast } = useToast();
  const [searchValue, setSearchValue] = useState("");
  const isMobile = useIsMobile();
  const breakpoint = useBreakpoint();
  
  const expandedItems = ['dateRange', 'type', 'discipline', 'district', 'branch'];

  const typesArray = Array.isArray(filters.types) ? filters.types : [];
  const branchesArray = Array.isArray(filters.branches) ? filters.branches : [];
  
  useEffect(() => {
    setSearchValue(filters.searchQuery || "");
  }, [filters.searchQuery]);
  
  const handleDisciplineChange = (discipline: Discipline, checked: boolean) => {
    let updatedDisciplines = [...filters.disciplines];
    if (checked) {
      updatedDisciplines.push(discipline);
    } else {
      updatedDisciplines = updatedDisciplines.filter(d => d !== discipline);
    }
    onFilterChange({ ...filters, disciplines: updatedDisciplines });
  };

  const handleTypeChange = (type: string, checked: boolean) => {
    const currentTypes = typesArray;
    let updatedTypes = [...currentTypes];
    
    if (checked) {
      updatedTypes.push(type as CompetitionType);
    } else {
      updatedTypes = updatedTypes.filter(t => t !== type);
    }
    
    onFilterChange({ ...filters, types: updatedTypes });
  };

  const handleBranchChange = (branch: string, checked: boolean) => {
    const currentBranches = branchesArray;
    let updatedBranches = [...currentBranches];
    
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onFilterChange({ ...filters, searchQuery: searchValue });
  };

  const handleToggleMap = () => {
    onFilterChange({
      ...filters,
      showMap: !filters.showMap
    });
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
      dateRange: undefined,
      showMap: filters.showMap
    };
    
    onFilterChange({...resetFilters});
    setSearchValue("");
    
    toast({
      title: "Filtren har återställts",
      description: "Alla valda filter har rensats"
    });
  };
  
  const handleClearFilter = (filterType: 'districts' | 'disciplines' | 'types' | 'branches' | 'search' | 'date') => {
    const updatedFilters = {...filters};
    
    if (filterType === 'search') {
      updatedFilters.searchQuery = "";
      setSearchValue("");
    } else if (filterType === 'date') {
      updatedFilters.dateRange = undefined;
    } else {
      updatedFilters[filterType] = [];
    }
    
    onFilterChange(updatedFilters);
    
    toast({
      title: `${getFilterGroupName(filterType)} borttaget`,
      description: `Filtret har tagits bort`
    });
  };
  
  const getFilterGroupName = (filterType: string): string => {
    switch(filterType) {
      case 'districts': return 'Distrikt';
      case 'disciplines': return 'Discipliner';
      case 'types': return 'Tävlingstyper';
      case 'branches': return 'Orienteringsgrenar';
      case 'search': return 'Sökord';
      case 'date': return 'Datumintervall';
      default: return 'Filter';
    }
  };

  const hasActiveDateFilter = Boolean(filters.dateRange?.from || filters.dateRange?.to);
  const hasSearchQuery = Boolean(filters.searchQuery && filters.searchQuery.trim() !== '');
  
  const hasActiveFilters = filters.districts.length > 0 || 
                           filters.disciplines.length > 0 || 
                           typesArray.length > 0 || 
                           branchesArray.length > 0 ||
                           hasActiveDateFilter ||
                           hasSearchQuery;
  
  const filterContent = (
    <>
      {!hideSearchInput && (
        <form onSubmit={handleSearchSubmit} className="mb-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Sök tävlingar..."
              value={searchValue}
              onChange={handleSearchChange}
              className="pl-9 pr-10"
            />
            {searchValue && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => {
                  setSearchValue("");
                  if (filters.searchQuery) {
                    handleClearFilter('search');
                  }
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <button type="submit" className="sr-only">Sök</button>
        </form>
      )}

      {showMapToggle && (
        <div className="mb-4 flex items-center justify-between rounded-md border p-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-medium">Visa karta</span>
          </div>
          <Switch
            checked={filters.showMap}
            onCheckedChange={handleToggleMap}
          />
        </div>
      )}

      <div className="space-y-2">
        <div className="border rounded-md overflow-hidden">
          <div className="px-3 py-2 min-h-10">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <span className="text-sm font-medium">Tävlingsperiod</span>
              </div>
            </div>
          </div>
          <div className="px-3 pb-3 pt-1">
            <DateRangeFilter 
              dateRange={filters.dateRange} 
              onDateRangeChange={handleDateRangeChange}
              hasActiveFilter={hasActiveDateFilter}
              removeHeader={true}
              onClearFilter={() => handleClearFilter('date')}
            />
          </div>
        </div>

        <div className="border rounded-md overflow-hidden">
          <div className="px-3 py-2 min-h-10">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <span className="text-sm font-medium">Tävlingstyp</span>
              </div>
            </div>
          </div>
          <div className="px-3 pb-3 pt-1">
            <div className="space-y-3">
              {competitionTypes.map(type => (
                <div key={type} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`type-${type}`}
                    checked={typesArray.includes(type)}
                    onChange={(e) => handleTypeChange(type, e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor={`type-${type}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border rounded-md overflow-hidden">
          <div className="px-3 py-2 min-h-10">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <span className="text-sm font-medium">Disciplin</span>
              </div>
            </div>
          </div>
          <div className="px-3 pb-3 pt-1">
            <div className="space-y-3">
              {disciplines.map(discipline => (
                <div key={discipline} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`discipline-${discipline}`}
                    checked={filters.disciplines.includes(discipline)}
                    onChange={(e) => handleDisciplineChange(discipline, e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor={`discipline-${discipline}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {discipline}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border rounded-md overflow-hidden">
          <div className="px-3 py-2 min-h-10">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <span className="text-sm font-medium">Distrikt</span>
              </div>
            </div>
          </div>
          <div className="px-3 pb-3 pt-1">
            <div className="space-y-3">
              {districts.map(district => (
                <div key={district.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`district-${district.id}`}
                    checked={filters.districts.includes(district.id)}
                    onChange={(e) => handleDistrictChange(district.id, e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor={`district-${district.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {district.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border rounded-md overflow-hidden">
          <div className="px-3 py-2 min-h-10">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <span className="text-sm font-medium">Orienteringsgren</span>
              </div>
            </div>
          </div>
          <div className="px-3 pb-3 pt-1">
            <div className="space-y-3">
              {competitionBranches.map(branch => (
                <div key={branch} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`branch-${branch}`}
                    checked={branchesArray.includes(branch)}
                    onChange={(e) => handleBranchChange(branch, e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor={`branch-${branch}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {branch}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="rounded-lg border bg-card">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center h-9">
            <div className="flex items-center">
              <FilterIcon className="h-4 w-4" />
              <h3 className="font-medium ml-2">Filtrera</h3>
            </div>
          </div>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleClearAllFilters}
              className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3 mr-1" />
              Rensa alla
            </Button>
          )}
        </div>

        <div className="md:block">
          {filterContent}
        </div>
      </div>
    </div>
  );
};

SearchFiltersComponent.displayName = "SearchFilters";

export default SearchFiltersComponent;
