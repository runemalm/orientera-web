import { FilterIcon, X, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { SearchFilters as SearchFiltersType, CompetitionType, CompetitionBranch } from "@/types";
import CheckboxFilter from "./search/CheckboxFilter";
import DateRangeFilter from "./search/DateRangeFilter";
import { useToast } from "@/hooks/use-toast";
import { districts } from "@/data/districts";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

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
  const [searchValue, setSearchValue] = useState("");

  const typesArray = Array.isArray(filters.types) ? filters.types : [];
  const branchesArray = Array.isArray(filters.branches) ? filters.branches : [];
  
  useEffect(() => {
    setSearchValue(filters.searchQuery || "");
  }, [filters.searchQuery]);
  
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
    
    onFilterChange(resetFilters);
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
                    onFilterChange({ ...filters, searchQuery: "" });
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

      {hasActiveFilters && (
        <div className="bg-muted/50 rounded-md p-2 mb-4 flex flex-wrap gap-1.5">
          {hasSearchQuery && (
            <Badge variant="outline" className="flex items-center gap-1 px-1.5 py-1 h-6 bg-background">
              <span className="text-xs">Sökord: {filters.searchQuery}</span>
              <Button variant="ghost" size="sm" onClick={() => handleClearFilter('search')} className="h-4 w-4 p-0">
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {filters.districts.length > 0 && (
            <Badge variant="outline" className="flex items-center gap-1 px-1.5 py-1 h-6 bg-background">
              <span className="text-xs">{filters.districts.length} {filters.districts.length === 1 ? 'distrikt' : 'distrikt'}</span>
              <Button variant="ghost" size="sm" onClick={() => handleClearFilter('districts')} className="h-4 w-4 p-0">
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {filters.disciplines.length > 0 && (
            <Badge variant="outline" className="flex items-center gap-1 px-1.5 py-1 h-6 bg-background">
              <span className="text-xs">{filters.disciplines.length} {filters.disciplines.length === 1 ? 'disciplin' : 'discipliner'}</span>
              <Button variant="ghost" size="sm" onClick={() => handleClearFilter('disciplines')} className="h-4 w-4 p-0">
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {typesArray.length > 0 && (
            <Badge variant="outline" className="flex items-center gap-1 px-1.5 py-1 h-6 bg-background">
              <span className="text-xs">{typesArray.length} {typesArray.length === 1 ? 'tävlingstyp' : 'tävlingstyper'}</span>
              <Button variant="ghost" size="sm" onClick={() => handleClearFilter('types')} className="h-4 w-4 p-0">
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {branchesArray.length > 0 && (
            <Badge variant="outline" className="flex items-center gap-1 px-1.5 py-1 h-6 bg-background">
              <span className="text-xs">{branchesArray.length} {branchesArray.length === 1 ? 'gren' : 'grenar'}</span>
              <Button variant="ghost" size="sm" onClick={() => handleClearFilter('branches')} className="h-4 w-4 p-0">
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {hasActiveDateFilter && (
            <Badge variant="outline" className="flex items-center gap-1 px-1.5 py-1 h-6 bg-background">
              <span className="text-xs">Datumfilter</span>
              <Button variant="ghost" size="sm" onClick={() => handleClearFilter('date')} className="h-4 w-4 p-0">
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}

      <Accordion 
        type="multiple" 
        value={expandedItems}
        onValueChange={setExpandedItems}
        className="space-y-2"
      >
        <AccordionItem value="dateRange" className="border rounded-md overflow-hidden">
          <AccordionTrigger className="px-3 py-2 hover:no-underline">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <span className="text-sm font-medium">Tävlingsperiod</span>
              </div>
              {hasActiveDateFilter && (
                <Badge variant="secondary" className="ml-auto mr-2">
                  Filter aktivt
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3 pb-3 pt-1">
            <DateRangeFilter 
              dateRange={filters.dateRange} 
              onDateRangeChange={handleDateRangeChange}
              hasActiveFilter={hasActiveDateFilter}
              removeHeader={true}
            />
          </AccordionContent>
        </AccordionItem>

        <CheckboxFilter
          title="Tävlingstyp"
          items={competitionTypes.map(t => ({ id: t, name: t }))}
          selectedItems={typesArray}
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
          selectedItems={branchesArray}
          onItemChange={handleBranchChange}
          accordionValue="branch"
        />
      </Accordion>
    </>
  );

  return (
    <div className="rounded-lg border bg-card">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FilterIcon className="h-4 w-4" />
            <h3 className="font-medium">Filtrera</h3>
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-1">
                {(filters.disciplines.length + filters.districts.length + typesArray.length + branchesArray.length) + 
                (hasActiveDateFilter ? 1 : 0) + (hasSearchQuery ? 1 : 0)}
              </Badge>
            )}
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

export default SearchFiltersComponent;
