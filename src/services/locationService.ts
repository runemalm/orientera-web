
import { debounce } from "@/lib/utils";

// Interface for city suggestion
export interface CitySuggestion {
  name: string;
  display: string;
}

// Fetch city suggestions from Photon API which has better partial matching
export const fetchCitySuggestions = async (query: string): Promise<CitySuggestion[]> => {
  if (query.length < 2) {
    return [];
  }
  
  try {
    // Use Photon API with place tags and "Sverige" suffix in the query
    // Note: Photon doesn't fully support 'sv' language code, using 'en' for better compatibility
    const response = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(query + " Sverige")}&lang=en&limit=5&osm_tag=place:city&osm_tag=place:town&osm_tag=place:village&osm_tag=place:hamlet`
    );
    
    const data = await response.json();
    
    if (data && data.features && data.features.length > 0) {
      // Process all results, not just filtering for Sweden since we added "Sverige" to query
      const results = data.features.map((feature: any) => {
        const name = feature.properties.name;
        const city = feature.properties.city || name;
        const state = feature.properties.county || feature.properties.state || "";
        const country = feature.properties.country || "Sverige";
        
        let display = name;
        if (state) {
          display = `${name}, ${state}, ${country}`;
        } else {
          display = `${name}, ${country}`;
        }
        
        return {
          name: city,
          display: display
        };
      });
      
      // Only apply Sweden filter if we have multiple results to avoid empty results
      if (results.length > 1) {
        return results.filter((item: CitySuggestion) => 
          item.display.toLowerCase().includes("sweden") || 
          item.display.toLowerCase().includes("sverige")
        );
      }
      
      return results;
    }
    
    // If no results found with Photon, try with Nominatim as backup
    if (!data || !data.features || data.features.length === 0) {
      const nominatimResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=se&limit=5`
      );
      
      const nominatimData = await nominatimResponse.json();
      
      if (nominatimData && nominatimData.length > 0) {
        return nominatimData.map((item: any) => ({
          name: item.name || item.display_name.split(',')[0].trim(),
          display: item.display_name
        }));
      }
    }
  } catch (error) {
    console.error("Error fetching city suggestions:", error);
  }
  
  return [];
};

// Geocode a city name to coordinates
export const geocodeCity = async (cityName: string): Promise<boolean> => {
  try {
    // First try with Photon API for geocoding
    const response = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(cityName + " Sverige")}&lang=en&limit=1&osm_tag=place:city&osm_tag=place:town&osm_tag=place:village&osm_tag=place:hamlet`
    );
    
    const data = await response.json();
    
    if (data && data.features && data.features.length > 0) {
      // Check if result is in Sweden
      const country = data.features[0].properties.country;
      return country === "Sweden" || country === "Sverige";
    }
    
    // If no results found with Photon, try with Nominatim as backup
    const nominatimResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}&countrycodes=se&limit=1`
    );
    
    const nominatimData = await nominatimResponse.json();
    
    return nominatimData && nominatimData.length > 0;
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
}, 500); // 500ms debounce time

// This function uses the singleton debounced function
export const debouncedFetchSuggestions = (
  query: string, 
  callback: (results: CitySuggestion[]) => void
) => {
  debouncedFetchFn(query, callback);
};
