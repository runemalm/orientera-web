
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Competition, SearchFilters } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const filterCompetitions = (
  competitions: Competition[],
  filters: SearchFilters
): Competition[] => {
  return competitions.filter((competition) => {
    const regionMatch =
      filters.regions.length === 0 ||
      filters.regions.includes(competition.region);

    const districtMatch =
      filters.districts.length === 0 ||
      filters.districts.includes(competition.district);

    const disciplineMatch =
      filters.disciplines.length === 0 ||
      filters.disciplines.includes(competition.discipline);

    const levelMatch =
      filters.levels.length === 0 || filters.levels.includes(competition.level);

    const searchQueryMatch =
      !filters.searchQuery ||
      competition.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      competition.location.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      competition.organizer.toLowerCase().includes(filters.searchQuery.toLowerCase());

    const distanceMatch =
      filters.distance === undefined ||
      (filters.userLocation !== undefined && competition.coordinates !== undefined &&
        getDistance(
          filters.userLocation.lat,
          filters.userLocation.lng,
          competition.coordinates.lat,
          competition.coordinates.lng
        ) <= (filters.distance * 1000)); // Convert km to meters

    return (
      regionMatch &&
      districtMatch &&
      disciplineMatch &&
      levelMatch &&
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

// Add format date function
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('sv-SE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
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
