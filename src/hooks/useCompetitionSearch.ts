
import { useMemo, useState } from "react";
import { Competition, SearchFilters } from "@/types";
import { filterCompetitions, getDistance } from "@/lib/utils";

export function useCompetitionSearch(allCompetitions: Competition[], filters: SearchFilters) {
  // Calculate distances for all competitions when location changes
  const competitionsWithDistance = useMemo(() => {
    console.log("Recalculating distances with userLocation:", filters.userLocation);
    
    if (!filters.userLocation) return allCompetitions;
    
    return allCompetitions.map(competition => {
      if (!competition.coordinates) {
        console.warn(`Competition ${competition.id} is missing coordinates!`);
        return competition;
      }
      
      const distance = getDistance(
        filters.userLocation!.lat,
        filters.userLocation!.lng,
        competition.coordinates.lat,
        competition.coordinates.lng
      );
      
      console.log(`Competition ${competition.name} - Distance: ${distance}m`);
      return { ...competition, distance };
    });
  }, [allCompetitions, filters.userLocation]);

  // Apply all filters to the competitions with calculated distances
  const filteredCompetitions = useMemo(() => {
    return filterCompetitions(competitionsWithDistance, filters);
  }, [competitionsWithDistance, filters]);

  return {
    filteredCompetitions,
    competitionsWithDistance
  };
}
