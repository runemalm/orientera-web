
import { LocationInfo } from "@/hooks/useGeolocation";

export const getLocationDetails = async (lat: number, lng: number): Promise<any> => {
  try {
    console.log("Fetching location details for coordinates:", lat, lng);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching location details:", error);
    throw error;
  }
};

export const geocodeCity = async (cityName: string): Promise<{ lat: number; lng: number } | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}, Sweden&countrycodes=se&limit=1`
    );
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      return { 
        lat: parseFloat(lat), 
        lng: parseFloat(lon) 
      };
    }
    return null;
  } catch (error) {
    console.error("Error geocoding city:", error);
    return null;
  }
};

export const parseLocationDetails = (data: any): LocationInfo => {
  const address = data.address || {};
  const city = address.city || address.town || address.village || address.hamlet;
  
  return {
    city,
    municipality: address.municipality,
    county: address.county,
    display_name: data.display_name
  };
};

export const getGeolocationErrorMessage = (errorCode: number): string => {
  switch (errorCode) {
    case 1: // PERMISSION_DENIED
      return "Du har blockerat åtkomst till din position. Aktivera platstjänster i din webbläsare.";
    case 2: // POSITION_UNAVAILABLE
      return "Din position är inte tillgänglig just nu. Prova igen senare.";
    case 3: // TIMEOUT
      return "Det tog för lång tid att hämta din position. Prova igen eller ange manuellt.";
    default:
      return "Prova att ange din position manuellt för distansfiltrering.";
  }
};
