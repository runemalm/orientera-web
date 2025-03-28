
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
  
  // First try with the exact query
  let response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}, Sweden&countrycodes=se&limit=5`
  );
  
  let data = await response.json();
  
  // If no results and query is at least 3 characters, try with a wildcard approach
  // by appending an asterisk to trigger partial matching
  if (data.length === 0 && query.length >= 3) {
    try {
      // Add wildcard to improve partial matching
      const wildcardQuery = `${query}*`;
      response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(wildcardQuery)}, Sweden&countrycodes=se&limit=5`
      );
      
      data = await response.json();
      
      // If still no results, try a more aggressive approach with partial word
      if (data.length === 0) {
        // Use a more general search approach
        const generalQuery = query;
        response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(generalQuery)}&countrycodes=se&limit=5`
        );
        
        data = await response.json();
      }
    } catch (error) {
      console.error("Error in enhanced search:", error);
    }
  }
  
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

// Create a properly debounced version of the fetch suggestions function
// This is a singleton instance of the debounced function to avoid recreating it on each render
const debouncedFetchFn = debounce(async (query: string, callback: (results: CitySuggestion[]) => void) => {
  try {
    const results = await fetchCitySuggestions(query);
    callback(results);
  } catch (error) {
    console.error("Error in debounced fetch:", error);
    callback([]);
  }
}, 500); // Increased to 500ms for better performance

// This function uses the singleton debounced function
export const debouncedFetchSuggestions = (
  query: string, 
  callback: (results: CitySuggestion[]) => void
) => {
  debouncedFetchFn(query, callback);
};
