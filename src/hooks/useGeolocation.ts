
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getLocationDetails, geocodeCity, parseLocationDetails, getGeolocationErrorMessage } from "@/utils/locationUtils";

export type LocationInfo = {
  city?: string;
  municipality?: string;
  county?: string;
  display_name?: string;
};

export type GeolocationState = {
  coords: { lat: number; lng: number } | undefined;
  detectedLocationInfo: LocationInfo | undefined;
  loading: boolean;
  error: string | null;
};

export const useGeolocation = (autoDetect = true) => {
  const { toast } = useToast();
  const [state, setState] = useState<GeolocationState>({
    coords: undefined,
    detectedLocationInfo: undefined,
    loading: false,
    error: null
  });
  const [isManualLocation, setIsManualLocation] = useState(false);

  const detectLocation = () => {
    // Reset the state completely before requesting a new location
    setState({
      coords: undefined,
      detectedLocationInfo: undefined,
      loading: true,
      error: null
    });
    setIsManualLocation(false);
    
    console.log("Requesting geolocation...");
    
    if (!navigator.geolocation) {
      setState(prev => ({ ...prev, loading: false, error: "Geolocation is not supported by your browser" }));
      toast({
        title: "Geolokalisering stöds inte",
        description: "Din webbläsare stöder inte geolokalisering. Prova att ange din position manuellt.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create a local copy to avoid any potential issues with it being overridden
      const nativeGeolocation = navigator.geolocation;
      
      // Custom timeout for geolocation request
      const geoLocationTimeout = setTimeout(() => {
        if (state.loading) {
          console.warn("Geolocation request timed out in our custom timeout");
          setState(prev => ({ ...prev, loading: false, error: "Timeout" }));
          toast({
            title: "Positionsbegäran tog för lång tid",
            description: "Det tog för lång tid att hämta din position. Prova att ange din position manuellt.",
            variant: "destructive"
          });
        }
      }, 15000);
      
      nativeGeolocation.getCurrentPosition(
        // Success handler
        async (position) => {
          clearTimeout(geoLocationTimeout);
          try {
            const coords = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            
            console.log("Position detected:", coords);
            
            // Immediately update state with coordinates
            setState(prev => ({
              ...prev,
              coords,
              loading: false
            }));
            
            // Then try to get detailed location info
            try {
              const data = await getLocationDetails(coords.lat, coords.lng);
              const locationInfo = parseLocationDetails(data);
              
              setState(prev => ({
                ...prev,
                detectedLocationInfo: locationInfo
              }));
              
              toast({
                title: "Plats hittad",
                description: `Din position (${locationInfo.city || 'Okänd plats'}) används nu för distansfiltrering.`,
              });
            } catch (detailsError) {
              console.error("Could not get location details, using coordinates only:", detailsError);
              toast({
                title: "Plats delvis hittad",
                description: "Din position används nu för distansfiltrering, men vi kunde inte hämta detaljerad platsinformation.",
              });
            }
          } catch (error) {
            console.error("Error handling position:", error);
            setState(prev => ({ ...prev, loading: false, error: "Failed to process location" }));
            toast({
              title: "Problem med att bearbeta position",
              description: "Ett fel uppstod när din position bearbetades.",
              variant: "destructive"
            });
          }
        },
        // Error handler
        (error) => {
          clearTimeout(geoLocationTimeout);
          try {
            console.error("Geolocation error:", error);
            const errorMessage = getGeolocationErrorMessage(error.code);
            
            setState(prev => ({ ...prev, loading: false, error: errorMessage }));
            toast({
              title: "Kunde inte hitta din position",
              description: errorMessage,
              variant: "destructive"
            });
          } catch (callbackError) {
            console.error("Error in geolocation error callback:", callbackError);
            setState(prev => ({ ...prev, loading: false, error: "An unexpected error occurred" }));
            toast({
              title: "Fel vid hämtning av position",
              description: "Ett oväntat fel uppstod när din position hämtades.",
              variant: "destructive"
            });
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } catch (geoError) {
      console.error("Fatal geolocation error:", geoError);
      setState(prev => ({ ...prev, loading: false, error: "Fatal geolocation error" }));
      toast({
        title: "Problem med positionstjänsten",
        description: "Det uppstod ett allvarligt problem med positionstjänsten. Prova att ange din position manuellt.",
        variant: "destructive"
      });
    }
  };

  const setManualLocation = async (cityName: string) => {
    try {
      const coords = await geocodeCity(cityName);
      
      if (coords) {
        setState({
          coords,
          detectedLocationInfo: { city: cityName },
          loading: false,
          error: null
        });
        setIsManualLocation(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error geocoding city:", error);
      setState(prev => ({ ...prev, error: "Failed to geocode city" }));
      return false;
    }
  };

  const clearLocation = () => {
    setState({
      coords: undefined,
      detectedLocationInfo: undefined,
      loading: false,
      error: null
    });
    setIsManualLocation(false);
  };

  // Auto-detect location on mount if enabled
  useEffect(() => {
    if (autoDetect && !state.coords && !isManualLocation && !state.loading) {
      detectLocation();
    }
  }, [autoDetect]); // Only depend on autoDetect to prevent re-runs when state changes

  return {
    ...state,
    isManualLocation,
    detectLocation,
    setManualLocation,
    clearLocation
  };
};
