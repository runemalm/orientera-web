
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

// Calculate distance between two coordinates using Haversine formula
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}

// Format distance to a readable string
export function formatDistance(distance: number | undefined): string {
  if (distance === undefined) return "";
  
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  
  return `${Math.round(distance)} km`;
}

export function filterCompetitions(competitions: Competition[], filters: SearchFilters): Competition[] {
  // Check if we need to filter by distance
  const userLocation = filters.userLocation;
  
  // Create a copy of the competitions array to add distances
  const competitionsWithDistance = competitions.map(competition => {
    const comp = { ...competition };
    
    // Calculate distance if user location is available
    if (userLocation) {
      comp.distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        competition.coordinates.lat,
        competition.coordinates.lng
      );
    }
    
    return comp;
  });
  
  return competitionsWithDistance.filter(competition => {
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
    
    // Filter by distance if userLocation is provided and distance filter is set
    if (userLocation && filters.distance) {
      if (competition.distance && competition.distance > filters.distance) {
        return false;
      }
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
