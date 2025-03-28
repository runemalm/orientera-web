
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Competition, SearchFilters } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('sv-SE', options);
}

export function filterCompetitions(competitions: Competition[], filters: SearchFilters): Competition[] {
  return competitions.filter(competition => {
    // Filter by regions
    if (filters.regions.length > 0 && !filters.regions.includes(competition.region)) {
      return false;
    }
    
    // Filter by districts
    if (filters.districts.length > 0 && !filters.districts.includes(competition.district)) {
      return false;
    }
    
    // Filter by disciplines
    if (filters.disciplines.length > 0 && !filters.disciplines.includes(competition.discipline)) {
      return false;
    }
    
    // Filter by levels
    if (filters.levels.length > 0 && !filters.levels.includes(competition.level)) {
      return false;
    }
    
    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        competition.name.toLowerCase().includes(query) ||
        competition.location.toLowerCase().includes(query) ||
        competition.organizer.toLowerCase().includes(query) ||
        competition.description.toLowerCase().includes(query)
      );
    }
    
    // If all filters passed or no filters applied
    return true;
  });
}
