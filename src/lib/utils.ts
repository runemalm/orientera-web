
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Competition, SearchFilters } from "@/types";
import { isAfter, isBefore, isEqual, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const filterCompetitions = (
  competitions: Competition[],
  filters: SearchFilters
): Competition[] => {
  return competitions.filter((competition) => {
    // Region filter
    const regionMatch =
      filters.regions.length === 0 ||
      filters.regions.includes(competition.region);

    // District filter
    const districtMatch =
      filters.districts.length === 0 ||
      filters.districts.includes(competition.district);

    // Discipline filter
    const disciplineMatch =
      filters.disciplines.length === 0 ||
      filters.disciplines.includes(competition.discipline);

    // Level filter
    const levelMatch =
      filters.levels.length === 0 || filters.levels.includes(competition.level);

    // Type filter - fixed to correctly handle undefined types
    const typeMatch = (() => {
      if (!filters.types || filters.types.length === 0) return true;
      // If competition.type is undefined but filters.types has items, it should not match
      if (!competition.type) return false;
      return filters.types.includes(competition.type);
    })();

    // Branch filter - fixed to correctly handle undefined branches
    const branchMatch = (() => {
      if (!filters.branches || filters.branches.length === 0) return true;
      // If competition.branch is undefined but filters.branches has items, it should not match
      if (!competition.branch) return false;
      return filters.branches.includes(competition.branch);
    })();

    // Date range filter
    const dateMatch = (() => {
      if (!filters.dateRange?.from && !filters.dateRange?.to) return true;
      
      const competitionDate = parseISO(competition.date);
      
      if (filters.dateRange?.from && 
          (isBefore(competitionDate, filters.dateRange.from) && 
           !isEqual(competitionDate, filters.dateRange.from))) {
        return false;
      }
      
      if (filters.dateRange?.to && 
          (isAfter(competitionDate, filters.dateRange.to) && 
           !isEqual(competitionDate, filters.dateRange.to))) {
        return false;
      }
      
      return true;
    })();

    // Search query filter
    const searchQueryMatch =
      !filters.searchQuery ||
      competition.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      competition.location.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      competition.organizer.toLowerCase().includes(filters.searchQuery.toLowerCase());

    // Distance filter
    const distanceMatch = (() => {
      if (!filters.userLocation || !filters.distance) return true;
      
      if (!competition.coordinates) return false;
      
      const distanceInKm = getDistance(
        filters.userLocation.lat,
        filters.userLocation.lng,
        competition.coordinates.lat,
        competition.coordinates.lng
      ) / 1000; // Convert meters to kilometers
      
      return distanceInKm <= filters.distance;
    })();

    return (
      regionMatch &&
      districtMatch &&
      disciplineMatch &&
      levelMatch &&
      typeMatch &&
      branchMatch &&
      dateMatch &&
      searchQueryMatch &&
      distanceMatch
    );
  });
};

// Function to calculate distance between two coordinates in meters
export const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3; // Radius of the earth in meters
  const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c; // Distance in meters
  return d;
}

// Update format date function with more user-friendly output
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  
  // Swedish month names are already used by the 'sv-SE' locale
  const formatted = new Intl.DateTimeFormat('sv-SE', options).format(date);
  return formatted;
}

// Add format distance function
export function formatDistance(distanceInMeters: number): string {
  if (distanceInMeters < 1000) {
    return `${Math.round(distanceInMeters)} m`;
  } else {
    const km = distanceInMeters / 1000;
    return km < 10 
      ? `${km.toFixed(1)} km`
      : `${Math.round(km)} km`;
  }
}

// Add debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number | undefined;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait) as unknown as number;
  };
}
