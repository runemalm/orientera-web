
import { SearchFilters, CompetitionType, CompetitionBranch, Discipline, CompetitionLevel } from "@/types";

// Basic search query processor
export const processNaturalLanguageQuery = (query: string): SearchFilters => {
  query = query.toLowerCase();
  const filters: SearchFilters = {
    regions: [],
    districts: [],
    disciplines: [],
    levels: [],
    types: [],
    branches: [],
    searchQuery: query,
  };

  return filters;
};
