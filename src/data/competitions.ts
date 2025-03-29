
import { Competition, CompetitionResource } from '@/types';

// Sample resources for competitions
const stockholmResources: CompetitionResource[] = [
  {
    type: 'Inbjudan',
    title: 'Inbjudan till Stockholms Vårsprinten 2025',
    url: '/files/inbjudan_stockholm_varsprinten.pdf',
    isFile: true,
    fileType: 'pdf',
    addedDate: '2025-02-01'
  },
  {
    type: 'PM',
    title: 'PM Stockholms Vårsprinten 2025',
    url: '/files/pm_stockholm_varsprinten.pdf',
    isFile: true,
    fileType: 'pdf',
    addedDate: '2025-03-10'
  },
  {
    type: 'Startlista',
    title: 'Startlista',
    url: 'https://eventor.orientering.se/Events/StartList?eventId=38291',
    isFile: false,
    addedDate: '2025-03-12'
  }
];

const goteborgResources: CompetitionResource[] = [
  {
    type: 'Inbjudan',
    title: 'Inbjudan till Göteborgs Stafetten 2025',
    url: '/files/inbjudan_goteborg_stafetten.pdf',
    isFile: true,
    fileType: 'pdf',
    addedDate: '2025-05-15'
  },
  {
    type: 'PM',
    title: 'PM och övrig information',
    url: 'https://gok.se/stafetten/pm',
    isFile: false,
    addedDate: '2025-06-05'
  }
];

const oringenResources: CompetitionResource[] = [
  {
    type: 'Inbjudan',
    title: 'Inbjudan O-Ringen 2025',
    url: 'https://oringen.se/2025/inbjudan',
    isFile: false,
    addedDate: '2025-01-15'
  },
  {
    type: 'PM',
    title: 'PM Etapp 1',
    url: '/files/pm_oringen_etapp1.pdf',
    isFile: true,
    fileType: 'pdf',
    addedDate: '2025-07-15'
  },
  {
    type: 'Startlista',
    title: 'Startlista Etapp 1',
    url: 'https://oringen.se/2025/startlista',
    isFile: false,
    addedDate: '2025-07-20'
  },
  {
    type: 'Resultat',
    title: 'Resultat Etapp 1',
    url: 'https://liveresultat.orientering.se/followfull.php?comp=oringen2025etapp1',
    isFile: false,
    addedDate: '2025-07-22'
  }
];

export const competitions: Competition[] = [
  {
    id: '1',
    name: 'Stockholms Vårsprinten',
    date: '2025-03-15',
    organizer: 'IFK Stockholm',
    region: 'stockholm',
    district: 'stockholm',
    location: 'Nackareservatet, Stockholm',
    coordinates: {
      lat: 59.2998,
      lng: 18.1350
    },
    discipline: 'Sprint',
    level: 'Nationell',
    registrationDeadline: '2025-03-10',
    description: 'Välkommen till vårens höjdpunkt för stockholmslöpare! Snabba och tekniska banor genom Nackareservatet.',
    website: 'https://ifkstockholm.se/varsprinten',
    featured: true,
    resources: stockholmResources
  },
  {
    id: '2',
    name: 'Göteborgs Stafetten',
    date: '2025-06-12',
    organizer: 'Göteborgs OK',
    region: 'vastra-gotaland',
    district: 'goteborg',
    location: 'Delsjöområdet, Göteborg',
    coordinates: {
      lat: 57.6889,
      lng: 12.0267
    },
    discipline: 'Stafett',
    level: 'Nationell',
    registrationDeadline: '2025-06-05',
    description: 'Klassisk stafett i Delsjöområdet med 3-mannalag. Missa inte årets roligaste lagaktivitet!',
    website: 'https://gok.se/stafetten',
    featured: true,
    resources: goteborgResources
  },
  {
    id: '3',
    name: 'Uppsala Nattorientering',
    date: '2025-01-20',
    organizer: 'OK Linné',
    region: 'uppsala',
    district: 'uppland',
    location: 'Lunsen, Uppsala',
    coordinates: {
      lat: 59.7965,
      lng: 17.6435
    },
    discipline: 'Natt',
    level: 'Distrikt',
    registrationDeadline: '2025-01-15',
    description: 'Utmanande nattorientering i Lunsens tekniska terräng. Ta med pannlampa!',
    website: 'https://oklinne.se/natt2025'
  },
  {
    id: '4',
    name: 'Smålands Långdistans',
    date: '2025-08-10',
    organizer: 'Växjö OK',
    region: 'kronoberg',
    district: 'smaland',
    location: 'Teleborg, Växjö',
    coordinates: {
      lat: 56.8570,
      lng: 14.8359
    },
    discipline: 'Lång',
    level: 'Nationell',
    registrationDeadline: '2025-08-01',
    description: 'Traditionell långdistans i vacker småländsk terräng med inslag av tekniska partier.',
    website: 'https://vaxjook.se/lang2025'
  },
  {
    id: '5',
    name: 'Skånes Medeldistans',
    date: '2025-09-15',
    organizer: 'FK Åsen',
    region: 'skane',
    district: 'skane',
    location: 'Åsljunga, Örkelljunga',
    coordinates: {
      lat: 56.3109,
      lng: 13.3561
    },
    discipline: 'Medel',
    level: 'Nationell',
    registrationDeadline: '2025-09-08',
    description: 'Tekniskt utmanande medeldistans på detaljrik karta över Åsljunga.',
    website: 'https://fkasen.se/medel2025',
    featured: true
  },
  {
    id: '6',
    name: 'Västerbottens Ultralånga',
    date: '2025-07-15',
    organizer: 'Umeå OK',
    region: 'vasterbotten',
    district: 'vasterbotten',
    location: 'Holmön, Umeå',
    coordinates: {
      lat: 63.7901,
      lng: 20.8675
    },
    discipline: 'Ultralång',
    level: 'Distrikt',
    registrationDeadline: '2025-07-01',
    description: 'Uthållighetsprövande ultralång tävling i vacker norrländsk kustterräng.',
    website: 'https://uok.se/ultra2025'
  },
  {
    id: '7',
    name: 'Klubbmästerskap Linköping',
    date: '2025-05-20',
    organizer: 'Linköpings OK',
    region: 'ostergotland',
    district: 'ostergotland',
    location: 'Vidingsjö, Linköping',
    coordinates: {
      lat: 58.3882,
      lng: 15.6322
    },
    discipline: 'Medel',
    level: 'Klubb',
    registrationDeadline: '2025-05-18',
    description: 'Klubbmästerskap för Linköpings OK. Öppen även för gästande löpare utom tävlan.',
    website: 'https://lok.se/km2025'
  },
  {
    id: '8',
    name: 'Kretsträff Örebro',
    date: '2025-04-12',
    organizer: 'Hagaby GoIF',
    region: 'orebro',
    district: 'orebro',
    location: 'Kilsbergen, Örebro',
    coordinates: {
      lat: 59.3801,
      lng: 14.9059
    },
    discipline: 'Lång',
    level: 'Krets',
    registrationDeadline: '2025-04-08',
    description: 'Vårsäsongens sista kretstävling i Kilsbergens vackra terräng. Fokus på glädje och gemenskap.',
    website: 'https://hagaby.se/krets2025'
  },
  {
    id: '9',
    name: 'O-Ringen Etapp 1',
    date: '2025-07-22',
    organizer: 'O-Ringen',
    region: 'dalarna',
    district: 'dalarna',
    location: 'Idre, Älvdalen',
    coordinates: {
      lat: 61.8579,
      lng: 12.7236
    },
    discipline: 'Lång',
    level: 'Internationell',
    registrationDeadline: '2025-06-30',
    description: 'Första etappen av världens största orienteringsevenemang. Spektakulär fjällterräng i Idre.',
    website: 'https://oringen.se/2025',
    featured: true,
    resources: oringenResources
  },
  {
    id: '10',
    name: 'Hallands 3-dagars',
    date: '2025-07-05',
    organizer: 'Falkenbergs OK',
    region: 'halland',
    district: 'halland',
    location: 'Ullared, Falkenberg',
    coordinates: {
      lat: 57.1134,
      lng: 12.7199
    },
    discipline: 'Medel',
    level: 'Nationell',
    registrationDeadline: '2025-06-25',
    description: 'Första dagen av tre i Hallands populära sommartävling. Härlig terräng och bra camping.',
    website: 'https://hallands3dagars.se'
  },
  {
    id: '11',
    name: 'Höstens Veteranträff',
    date: '2025-10-05',
    organizer: 'Södertälje OK',
    region: 'stockholm',
    district: 'stockholm',
    location: 'Tveta, Södertälje',
    coordinates: {
      lat: 59.1584,
      lng: 17.6253
    },
    discipline: 'Medel',
    level: 'Nationell',
    registrationDeadline: '2025-09-28',
    description: 'Traditionell hösttävling för veteraner med lättlöpta banor i vacker terräng.',
    website: 'https://sok.se/veteran2025'
  },
  {
    id: '12',
    name: 'Vintercupen Etapp 2',
    date: '2025-12-15',
    organizer: 'Järfälla OK',
    region: 'stockholm',
    district: 'stockholm',
    location: 'Järvafältet, Stockholm',
    coordinates: {
      lat: 59.4231,
      lng: 17.8371
    },
    discipline: 'Sprint',
    level: 'Distrikt',
    registrationDeadline: '2025-12-10',
    description: 'Spännande vintersprint med kartbyte. Bär reflexer och pannlampa!',
    website: 'https://jok.se/vintercupen2025'
  }
];
