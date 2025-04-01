
import React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchFilters } from "@/types";
import { districts } from "@/data/districts";

interface FilterBadgesProps {
  filters: SearchFilters;
  onRemoveFilter: (filterType: string, value?: string) => void;
  onClearAllFilters: () => void;
}

const FilterBadges = ({ filters, onRemoveFilter, onClearAllFilters }: FilterBadgesProps) => {
  const typesArray = Array.isArray(filters.types) ? filters.types : [];
  const branchesArray = Array.isArray(filters.branches) ? filters.branches : [];
  
  const hasActiveFilters = filters.regions.length > 0 || 
                           filters.districts.length > 0 || 
                           filters.disciplines.length > 0 || 
                           filters.levels.length > 0 || 
                           typesArray.length > 0 || 
                           branchesArray.length > 0 ||
                           filters.dateRange?.from !== undefined;

  if (!hasActiveFilters) return null;
  
  // Get district names from ids
  const getDistrictName = (id: string) => {
    const district = districts.find(d => d.id === id);
    return district ? district.name : id;
  };

  // Format date to readable string
  const formatDate = (date?: Date) => {
    if (!date) return "";
    return new Intl.DateTimeFormat("sv-SE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(date);
  };

  // Get preset name for display
  const getPresetName = (presetId?: string) => {
    if (!presetId) return "";
    
    const presetLabels: {[key: string]: string} = {
      'today': 'Idag',
      'tomorrow': 'Imorgon',
      'thisWeekend': 'Helgen',
      'next7days': 'Kommande 7 dgr',
      'next30days': 'Kommande 30 dgr',
      'thisMonth': 'Denna månad',
      'nextMonth': 'Nästa månad'
    };
    
    return presetLabels[presetId] || "";
  };

  return (
    <div className="mb-4">
      <div className="flex flex-wrap gap-2 items-center">
        {filters.disciplines.map((discipline) => (
          <Badge key={`discipline-${discipline}`} variant="secondary" className="px-2 py-1">
            {discipline}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
              onClick={() => onRemoveFilter("disciplines", discipline)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Ta bort {discipline}</span>
            </Button>
          </Badge>
        ))}
        
        {filters.districts.map((district) => (
          <Badge key={`district-${district}`} variant="secondary" className="px-2 py-1">
            {getDistrictName(district)}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
              onClick={() => onRemoveFilter("districts", district)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Ta bort {getDistrictName(district)}</span>
            </Button>
          </Badge>
        ))}
        
        {typesArray.map((type) => (
          <Badge key={`type-${type}`} variant="secondary" className="px-2 py-1">
            {type}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
              onClick={() => onRemoveFilter("types", type)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Ta bort {type}</span>
            </Button>
          </Badge>
        ))}
        
        {branchesArray.map((branch) => (
          <Badge key={`branch-${branch}`} variant="secondary" className="px-2 py-1">
            {branch}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
              onClick={() => onRemoveFilter("branches", branch)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Ta bort {branch}</span>
            </Button>
          </Badge>
        ))}
        
        {filters.dateRange?.from && (
          <Badge variant="secondary" className="px-2 py-1">
            {filters.datePreset ? getPresetName(filters.datePreset) : 
              `${formatDate(filters.dateRange.from)}${filters.dateRange.to ? ` - ${formatDate(filters.dateRange.to)}` : ""}`}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
              onClick={() => onRemoveFilter("dateRange")}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Ta bort datumintervall</span>
            </Button>
          </Badge>
        )}
        
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={onClearAllFilters}
          >
            Rensa alla filter
          </Button>
        )}
      </div>
    </div>
  );
};

export default FilterBadges;
