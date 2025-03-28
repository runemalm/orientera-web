
import { debounce } from "@/lib/utils";

// Interface for city suggestion
export interface CitySuggestion {
  name: string;
  display: string;
}

// Fetch city suggestions from OpenStreetMap
export const fetchCitySuggestions = async (query: string): Promise<CitySuggestion[]> => {
  if (query.length < 2) {
    return [];
  }
  
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}, Sweden&countrycodes=se&limit=5`
  );
  
  const data = await response.json();
  
  if (data && data.length > 0) {
    return data.map((item: any) => ({
      name: item.name,
      display: item.display_name
    }));
  }
  
  return [];
};

// Geocode a city name to coordinates
export const geocodeCity = async (cityName: string): Promise<boolean> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}, Sweden&countrycodes=se&limit=1`
    );
    
    const data = await response.json();
    
    return data && data.length > 0;
  } catch (error) {
    console.error("Error geocoding city:", error);
    return false;
  }
};

// Create a debounced version of the fetch function that properly handles the callback
export const debouncedFetchSuggestions = (
  query: string, 
  callback: (results: CitySuggestion[]) => void
) => {
  const debouncedFn = debounce(async () => {
    const results = await fetchCitySuggestions(query);
    callback(results);
  }, 300);
  
  debouncedFn();
};
