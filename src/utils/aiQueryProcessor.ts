
import { SearchFilters } from "@/types";

// Simple NLP processing to extract key terms from natural language queries
export const processNaturalLanguageQuery = (query: string): SearchFilters => {
  query = query.toLowerCase();
  const filters: SearchFilters = {
    regions: [],
    districts: [],
    disciplines: [],
    levels: [],
    searchQuery: "",
  };

  // Extract disciplines
  const disciplines = ['sprint', 'medel', 'lång', 'natt', 'stafett', 'ultralång'];
  disciplines.forEach(discipline => {
    if (query.includes(discipline)) {
      // Convert to proper case for first letter
      const formattedDiscipline = discipline.charAt(0).toUpperCase() + discipline.slice(1);
      filters.disciplines.push(formattedDiscipline as any);
    }
  });

  // Extract competition levels
  const levels = ['klubb', 'krets', 'distrikt', 'nationell', 'internationell'];
  levels.forEach(level => {
    if (query.includes(level)) {
      // Convert to proper case for first letter
      const formattedLevel = level.charAt(0).toUpperCase() + level.slice(1);
      filters.levels.push(formattedLevel as any);
    }
  });

  // Extract dates - basic date extraction
  if (query.includes('30 dagar') || query.includes('nästa månad')) {
    const now = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(now.getDate() + 30);
    
    filters.dateRange = {
      from: now,
      to: thirtyDaysLater
    };
  } else if (query.includes('denna vecka') || query.includes('den här veckan')) {
    const now = new Date();
    const endOfWeek = new Date();
    const day = endOfWeek.getDay();
    const diff = 7 - day;
    endOfWeek.setDate(endOfWeek.getDate() + diff);
    
    filters.dateRange = {
      from: now,
      to: endOfWeek
    };
  }

  // Extract text for general search
  // Remove the detected filters to leave the search terms
  const searchTerms = query
    .replace(/sprint|medel|lång|natt|stafett|ultralång/g, '')
    .replace(/klubb|krets|distrikt|nationell|internationell/g, '')
    .replace(/30 dagar|nästa månad|denna vecka|den här veckan/g, '')
    .trim();

  filters.searchQuery = searchTerms;

  return filters;
};
