
import { SearchFilters } from "@/types";

// No longer used as freetext search has been removed
export const processNaturalLanguageQuery = (query: string): SearchFilters => {
  return {
    regions: [],
    districts: [],
    disciplines: [],
    levels: [],
    types: [],
    branches: [],
    searchQuery: "",
  };
};
