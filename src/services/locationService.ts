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
    console.log("Fetching suggestions for:", query);
    // Always append "Sverige" to every search query
    const response = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(query + " Sverige")}&lang=en&limit=10&osm_tag=place:city&osm_tag=place:town&osm_tag=place:village&osm_tag=place:hamlet`
    );
    
    const data = await response.json();
    console.log("API response data:", data);
    
    if (data && data.features && data.features.length > 0) {
      // Map all features to CitySuggestion objects
      const results = data.features.map((feature: any) => {
        const name = feature.properties.name;
        
        // For hamlets and villages, use city property if available
        let locationContext = "";
        
        if (feature.properties.city) {
          // If it's a hamlet with a city, show "Name, City"
          locationContext = feature.properties.city;
        } else if (feature.properties.county) {
          // Otherwise show county
          locationContext = feature.properties.county;
        }
        
        // Create a cleaner display 
        let display = name;
        if (locationContext) {
          display = `${name}, ${locationContext}`;
        }
        
        return {
          name: name,
          display: display
        };
      });
      
      console.log("Mapped results:", results);
      
      // Return all results - removed filtering that was causing Fröseke to be filtered out
      return results;
    }
    
    // If no results found with Photon, try with Nominatim as backup
    if (!data || !data.features || data.features.length === 0) {
      // Only search in Sweden with Nominatim (countrycodes=se)
      const nominatimResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=se&limit=5`
      );
      
      const nominatimData = await nominatimResponse.json();
      
      if (nominatimData && nominatimData.length > 0) {
        // Process Nominatim results to match our format
        return nominatimData.map((item: any) => {
          const name = item.name || item.display_name.split(',')[0].trim();
          // Clean up display_name but don't filter out Sweden parts
          const displayParts = item.display_name.split(',').slice(0, 3);
          
          return {
            name: name,
            display: displayParts.join(', ')
          };
        });
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
    // First try with Photon API for geocoding, explicitly adding Sverige to search
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
    // Explicitly set countrycodes=se to only search in Sweden
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
