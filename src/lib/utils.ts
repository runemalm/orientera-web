
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
  // Ensure all inputs are valid numbers
  if (typeof lat1 !== 'number' || typeof lon1 !== 'number' || 
      typeof lat2 !== 'number' || typeof lon2 !== 'number' ||
      isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
    console.error('Invalid coordinates provided to getDistance:', { lat1, lon1, lat2, lon2 });
    return 0; // Return 0 instead of NaN to prevent rendering issues
  }

  // Earth's radius in meters
  const R = 6371000; 
  
  const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Distance in meters
  const distance = R * c;
  return distance;
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

// Update format distance function to properly handle and display distances
export function formatDistance(distanceInMeters: number): string {
  // Make sure we're working with a valid number
  if (typeof distanceInMeters !== 'number' || isNaN(distanceInMeters)) {
    console.error('Invalid distance provided to formatDistance:', distanceInMeters);
    return "Okänt avstånd";
  }
  
  if (distanceInMeters < 1000) {
    return `${Math.round(distanceInMeters)} m`;
  } else {
    const km = distanceInMeters / 1000;
    // For distances less than 10km, show one decimal place
    // For larger distances, round to whole numbers
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
