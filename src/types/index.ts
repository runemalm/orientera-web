
export type Region = {
  id: string;
  name: string;
};

export type District = {
  id: string;
  name: string;
};

export type Discipline = 'Sprint' | 'Medel' | 'Lång' | 'Natt' | 'Stafett' | 'Ultralång';

export type CompetitionLevel = 'Klubb' | 'Krets' | 'Distrikt' | 'Nationell' | 'Internationell';

export type Coordinates = {
  lat: number;
  lng: number;
};

export type Competition = {
  id: string;
  name: string;
  date: string;
  organizer: string;
  region: string;
  district: string;
  location: string;
  coordinates: Coordinates;
  discipline: Discipline;
  level: CompetitionLevel;
  registrationDeadline: string;
  description: string;
  website?: string;
  featured?: boolean;
  distance?: number; // Added distance field
};

export type SearchFilters = {
  regions: string[];
  distance?: number;
  districts: string[];
  disciplines: Discipline[];
  levels: CompetitionLevel[];
  searchQuery: string;
  userLocation?: Coordinates;
};
