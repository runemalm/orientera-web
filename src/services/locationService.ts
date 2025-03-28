
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
    // Use Photon API which has better partial matching support
    const response = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&lang=en&limit=5&osm_tag=place:city&osm_tag=place:town&osm_tag=place:village&bbox=10.5,55.3,24.2,69.1`
    );
    
    const data = await response.json();
    
    if (data && data.features && data.features.length > 0) {
      // Filter for only Swedish results
      const swedishResults = data.features.filter((feature: any) => {
        const country = feature.properties.country;
        return country === "Sweden" || country === "Sverige";
      });

      return swedishResults.map((feature: any) => {
        const name = feature.properties.name;
        const city = feature.properties.city || name;
        const state = feature.properties.state || "";
        
        let display = name;
        if (state) {
          display = `${name}, ${state}, Sweden`;
        } else {
          display = `${name}, Sweden`;
        }
        
        return {
          name: city,
          display: display
        };
      });
    }
  } catch (error) {
    console.error("Error fetching from Photon API:", error);
  }
  
  return [];
};

// Geocode a city name to coordinates
export const geocodeCity = async (cityName: string): Promise<boolean> => {
  try {
    // Use Photon API for geocoding
    const response = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(cityName)}&lang=en&limit=1&osm_tag=place:city&osm_tag=place:town&osm_tag=place:village&bbox=10.5,55.3,24.2,69.1`
    );
    
    const data = await response.json();
    
    if (data && data.features && data.features.length > 0) {
      // Check if result is in Sweden
      const country = data.features[0].properties.country;
      return country === "Sweden" || country === "Sverige";
    }
    
    return false;
  } catch (error) {
    console.error("Error geocoding city with Photon:", error);
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
