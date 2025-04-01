
export type Region = {
  id: string;
  name: string;
};

export type District = {
  id: string;
  name: string;
};

export type Discipline = 'Sprint' | 'Medel' | 'Lång' | 'Natt' | 'Stafett' | 'Ultralång';

export type CompetitionLevel = 'Klubb' | 'Krets' | 'Distrikt' | 'Nationell' | 'Internationell' | 'Närtävling';

export type CompetitionType = 'Värdetävlingar' | 'Nationella tävlingar' | 'Distriktstävlingar' | 'Närtävlingar' | 'Veckans bana';
export type CompetitionBranch = 'Orienteringslöpning' | 'Skidorientering' | 'Mountainbikeorientering' | 'Precisionsorientering' | 'Orienteringsskytte';

export type Coordinates = {
  lat: number;
  lng: number;
};

export type CompetitionResourceType = 'Inbjudan' | 'PM' | 'Startlista' | 'Resultat' | 'Sträcktider';

export type CompetitionResource = {
  type: CompetitionResourceType;
  title: string;
  url: string;
  isFile: boolean;
  fileType?: string; // e.g., 'pdf', 'html'
  addedDate: string;
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
  type?: CompetitionType;
  branch?: CompetitionBranch;
  registrationDeadline: string;
  description: string;
  website?: string;
  featured?: boolean;
  distance?: number; // Optional distance field
  resources?: CompetitionResource[]; // Optional resources field
};

export type SearchFilters = {
  regions: string[];
  districts: string[];
  disciplines: Discipline[];
  levels: CompetitionLevel[];
  types: CompetitionType[];
  branches: CompetitionBranch[];
  searchQuery: string;
  userLocation?: Coordinates;
  locationCity?: string; // Location name for display
  dateRange?: {
    from?: Date;
    to?: Date;
  }; // Date range for filtering, both from and to are now optional
  distance?: number; // Optional distance filter
  datePreset?: string; // Field to track the date preset selection
  showMap?: boolean; // Field to track map visibility
};
