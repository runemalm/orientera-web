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

// The original 12 competitions remain
const originalCompetitions: Competition[] = [
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

// New competitions - January 2025 (additional)
const januaryCompetitions: Competition[] = [
  {
    id: '13',
    name: 'Vintercupen Etapp 1',
    date: '2025-01-05',
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
    registrationDeadline: '2024-12-28',
    description: 'Årets första sprinttävling. Perfekt tillfälle att starta det nya året med en fartfylld tävling.',
    website: 'https://jok.se/vintercupen2025'
  },
  {
    id: '14',
    name: 'Vintergaloppen',
    date: '2025-01-12',
    organizer: 'Tullinge SK',
    region: 'stockholm',
    district: 'stockholm',
    location: 'Lida, Botkyrka',
    coordinates: {
      lat: 59.1750,
      lng: 17.8340
    },
    discipline: 'Lång',
    level: 'Nationell',
    registrationDeadline: '2025-01-07',
    description: 'Klassisk långdistans i vinterterräng. Möjlighet för att använda dubbskor om isigt.',
    website: 'https://tullingesk.se/vintergaloppen'
  },
  {
    id: '15',
    name: 'Sundsvalls Vinternatt',
    date: '2025-01-18',
    organizer: 'Sundsvalls OK',
    region: 'vasternorrland',
    district: 'vasternorrland',
    location: 'Södra Berget, Sundsvall',
    coordinates: {
      lat: 62.3875,
      lng: 17.3078
    },
    discipline: 'Natt',
    level: 'Distrikt',
    registrationDeadline: '2025-01-13',
    description: 'Utmanande nattorientering i kuperad terräng. Extra kraftig pannlampa rekommenderas!',
    website: 'https://sundsvallsok.se/vinternatt'
  },
  {
    id: '16',
    name: 'Dalarna Vinterträffen',
    date: '2025-01-25',
    organizer: 'Stora Tuna OK',
    region: 'dalarna',
    district: 'dalarna',
    location: 'Romme, Borlänge',
    coordinates: {
      lat: 60.4826,
      lng: 15.4630
    },
    discipline: 'Medel',
    level: 'Distrikt',
    registrationDeadline: '2025-01-20',
    description: 'Medeldistans på vinterkartan. Välpreparerade spår.',
    website: 'https://storatuna.se/vinter2025'
  },
  {
    id: '17',
    name: 'Göteborgs Vinterrace',
    date: '2025-01-26',
    organizer: 'Göteborg-Majorna OK',
    region: 'vastra-gotaland',
    district: 'goteborg',
    location: 'Slottsskogen, Göteborg',
    coordinates: {
      lat: 57.6851,
      lng: 11.9418
    },
    discipline: 'Sprint',
    level: 'Nationell',
    registrationDeadline: '2025-01-21',
    description: 'Urban sprinttävling genom Slottsskogens vindlande gångar. Publikvänlig avslutning.',
    website: 'https://gmok.se/vinterrace'
  }
];

// February 2025
const februaryCompetitions: Competition[] = [
  {
    id: '18',
    name: 'Gävle Vinterlänga',
    date: '2025-02-02',
    organizer: 'Gävle OK',
    region: 'gavleborg',
    district: 'gavleborg',
    location: 'Hemlingby, Gävle',
    coordinates: {
      lat: 60.6465,
      lng: 17.1851
    },
    discipline: 'Lång',
    level: 'Nationell',
    registrationDeadline: '2025-01-27',
    description: 'Traditionell långdistans med extra långa banor. Uthållighet testas till max.',
    website: 'https://gavleok.se/vinterlanga'
  },
  {
    id: '19',
    name: 'Skåne Indoor Sprint',
    date: '2025-02-08',
    organizer: 'Malmö OK',
    region: 'skane',
    district: 'skane',
    location: 'Malmö Mässan, Malmö',
    coordinates: {
      lat: 55.5631,
      lng: 12.9772
    },
    discipline: 'Sprint',
    level: 'Nationell',
    registrationDeadline: '2025-02-03',
    description: 'Unik inomhussprint i mässhallarna. Tekniskt utmanande med många vägvalsmöjligheter.',
    website: 'https://malmook.se/indoor2025',
    featured: true
  },
  {
    id: '20',
    name: 'Värmlands Vintertrofé',
    date: '2025-02-15',
    organizer: 'Karlskoga OK',
    region: 'varmland',
    district: 'varmland',
    location: 'Rävåsen, Karlskoga',
    coordinates: {
      lat: 59.3265,
      lng: 14.5168
    },
    discipline: 'Medel',
    level: 'Distrikt',
    registrationDeadline: '2025-02-10',
    description: 'Medeldistans med kreativa banor. Löpning på både skidspår och i terräng.',
    website: 'https://karlskogaok.se/vinter'
  },
  {
    id: '21',
    name: 'Stockholm Indoor Cup',
    date: '2025-02-22',
    organizer: 'OK Södertörn',
    region: 'stockholm',
    district: 'stockholm',
    location: 'Globen, Stockholm',
    coordinates: {
      lat: 59.2935,
      lng: 18.0834
    },
    discipline: 'Sprint',
    level: 'Internationell',
    registrationDeadline: '2025-02-15',
    description: 'Prestigefylld inomhussprint med internationella löpare. Flervåningsbanor med höga krav på kartläsning.',
    website: 'https://indoorcup.se',
    featured: true
  },
  {
    id: '22',
    name: 'Göteborg Nattsprint',
    date: '2025-02-28',
    organizer: 'IFK Göteborg Orientering',
    region: 'vastra-gotaland',
    district: 'goteborg',
    location: 'Hisingen, Göteborg',
    coordinates: {
      lat: 57.7284,
      lng: 11.9472
    },
    discipline: 'Natt',
    level: 'Nationell',
    registrationDeadline: '2025-02-23',
    description: 'Nattsprinttävling genom Hisingens urbana miljö. Utmanande vägval och begränsad sikt.',
    website: 'https://ifkgoteborg.se/nattsprint'
  }
];

// March 2025
const marchCompetitions: Competition[] = [
  {
    id: '23',
    name: 'Motala Vårtävling',
    date: '2025-03-01',
    organizer: 'Motala AIF',
    region: 'ostergotland',
    district: 'ostergotland',
    location: 'Fålehagen, Motala',
    coordinates: {
      lat: 58.5374,
      lng: 15.0366
    },
    discipline: 'Medel',
    level: 'Nationell',
    registrationDeadline: '2025-02-24',
    description: 'Vårens första större tävling i Östergötland. Snabba banor med tekniska inslag.',
    website: 'https://motalaorientering.se/vartavling'
  },
  {
    id: '24',
    name: 'Uppsala Vårsprint',
    date: '2025-03-08',
    organizer: 'OK Linné',
    region: 'uppsala',
    district: 'uppland',
    location: 'Polacksbacken, Uppsala',
    coordinates: {
      lat: 59.8399,
      lng: 17.6469
    },
    discipline: 'Sprint',
    level: 'Nationell',
    registrationDeadline: '2025-03-03',
    description: 'Sprintorientering genom Uppsalas historiska universitetsområde. Snabba vägval och hög fart.',
    website: 'https://oklinne.se/varsprint'
  },
  {
    id: '25',
    name: 'Västkustens Vårlöp',
    date: '2025-03-22',
    organizer: 'OK Nackhe',
    region: 'halland',
    district: 'halland',
    location: 'Åsa, Kungsbacka',
    coordinates: {
      lat: 57.3562,
      lng: 12.1163
    },
    discipline: 'Lång',
    level: 'Nationell',
    registrationDeadline: '2025-03-17',
    description: 'Härlig kustnära långdistans genom Hallands skogar och längs strandkanten.',
    website: 'https://oknackhe.se/varlop'
  },
  {
    id: '26',
    name: 'Smålandskavlen Vårupplagan',
    date: '2025-03-29',
    organizer: 'Jönköpings OK',
    region: 'jonkoping',
    district: 'smaland',
    location: 'Huskvarna, Jönköping',
    coordinates: {
      lat: 57.7893,
      lng: 14.2862
    },
    discipline: 'Stafett',
    level: 'Nationell',
    registrationDeadline: '2025-03-22',
    description: 'Prestigefylld stafett med blandlag. Fem sträckor genom varierande terräng.',
    website: 'https://jonkopingsok.se/smalandskavlen',
    featured: true
  },
  {
    id: '27',
    name: 'Gävle Vårmönstring',
    date: '2025-03-30',
    organizer: 'Gävle OK',
    region: 'gavleborg',
    district: 'gavleborg',
    location: 'Hemlingby, Gävle',
    coordinates: {
      lat: 60.6465,
      lng: 17.1851
    },
    discipline: 'Medel',
    level: 'Distrikt',
    registrationDeadline: '2025-03-25',
    description: 'Medeldistans för att testa vårformen. Varierad banläggning för alla nivåer.',
    website: 'https://gavleok.se/varmonstring'
  }
];

// April 2025
const aprilCompetitions: Competition[] = [
  {
    id: '28',
    name: 'Linköpings Vårdubbel, dag 1',
    date: '2025-04-05',
    organizer: 'Linköpings OK',
    region: 'ostergotland',
    district: 'ostergotland',
    location: 'Vidingsjö, Linköping',
    coordinates: {
      lat: 58.3882,
      lng: 15.6322
    },
    discipline: 'Medel',
    level: 'Nationell',
    registrationDeadline: '2025-03-31',
    description: 'Första dagen av vårdubbeln. Medeldistans i detaljrik terräng kring Vidingsjö.',
    website: 'https://lok.se/vardubbel'
  },
  {
    id: '29',
    name: 'Linköpings Vårdubbel, dag 2',
    date: '2025-04-06',
    organizer: 'Linköpings OK',
    region: 'ostergotland',
    district: 'ostergotland',
    location: 'Tinnerö, Linköping',
    coordinates: {
      lat: 58.3773,
      lng: 15.6455
    },
    discipline: 'Lång',
    level: 'Nationell',
    registrationDeadline: '2025-03-31',
    description: 'Andra dagen av vårdubbeln. Långdistans i eklandskapet i Tinnerö.',
    website: 'https://lok.se/vardubbel'
  },
  {
    id: '30',
    name: 'Örebros Vårserie, etapp 1',
    date: '2025-04-13',
    organizer: 'OK Alferna',
    region: 'orebro',
    district: 'orebro',
    location: 'Karlslund, Örebro',
    coordinates: {
      lat: 59.2921,
      lng: 15.1871
    },
    discipline: 'Medel',
    level: 'Distrikt',
    registrationDeadline: '2025-04-08',
    description: 'Första etappen i Örebros populära vårserie. Medeldistans genom lättlöpt terräng.',
    website: 'https://okalferna.se/varserie'
  },
  {
    id: '31',
    name: 'Svenska Cupen, deltävling 1',
    date: '2025-04-19',
    organizer: 'Uddevalla OK',
    region: 'vastra-gotaland',
    district: 'bohuslan-dal',
    location: 'Herrestadsfjället, Uddevalla',
    coordinates: {
      lat: 58.3359,
      lng: 11.9432
    },
    discipline: 'Lång',
    level: 'Nationell',
    registrationDeadline: '2025-04-12',
    description: 'Första deltävlingen i Svenska Cupen. Långdistans i tekniskt svår bohuslänsk terräng.',
    website: 'https://svenskacupen.se/deltavling1',
    featured: true
  },
  {
    id: '32',
    name: 'Svenska Cupen, deltävling 2',
    date: '2025-04-20',
    organizer: 'Uddevalla OK',
    region: 'vastra-gotaland',
    district: 'bohuslan-dal',
    location: 'Uddevalla Centrum',
    coordinates: {
      lat: 58.3498,
      lng: 11.9351
    },
    discipline: 'Sprint',
    level: 'Nationell',
    registrationDeadline: '2025-04-12',
    description: 'Andra deltävlingen i Svenska Cupen. Stadssprint genom Uddevallas centrala delar.',
    website: 'https://svenskacupen.se/deltavling2',
    featured: true
  },
  {
    id: '33',
    name: 'Örebros Vårserie, etapp 2',
    date: '2025-04-27',
    organizer: 'Almby IK',
    region: 'orebro',
    district: 'orebro',
    location: 'Markaskogen, Örebro',
    coordinates: {
      lat: 59.2534,
      lng: 15.2628
    },
    discipline: 'Lång',
    level: 'Distrikt',
    registrationDeadline: '2025-04-22',
    description: 'Andra etappen i Örebros populära vårserie. Långdistans genom varierande terräng i Markaskogen.',
    website: 'https://almbyik.se/varserie'
  }
];

// May 2025
const mayCompetitions: Competition[] = [
  {
    id: '34',
    name: 'Södertälje City Race',
    date: '2025-05-03',
    organizer: 'Södertälje-Nykvarn Orientering',
    region: 'stockholm',
    district: 'stockholm',
    location: 'Södertälje Centrum',
    coordinates: {
      lat: 59.1962,
      lng: 17.6264
    },
    discipline: 'Sprint',
    level: 'Nationell',
    registrationDeadline: '2025-04-28',
    description: 'Urban sprint genom Södertäljes centrala delar. Snabba vägval och många kontroller.',
    website: 'https://snoracing.se/cityrace'
  },
  {
    id: '35',
    name: 'Stockholms Vårlångdistans',
    date: '2025-05-04',
    organizer: 'Snättringe SK',
    region: 'stockholm',
    district: 'stockholm',
    location: 'Flemingsberg, Huddinge',
    coordinates: {
      lat: 59.2199,
      lng: 17.9436
    },
    discipline: 'Lång',
    level: 'Nationell',
    registrationDeadline: '2025-04-28',
    description: 'Krävande långdistans genom Flemingsbergskogens naturreservat. Kuperad terräng med inslag av tekniska partier.',
    website: 'https://snattringe.se/varlang'
  },
  {
    id: '36',
    name: 'Umeå Midnattsol',
    date: '2025-05-10',
    organizer: 'Umeå OK',
    region: 'vasterbotten',
    district: 'vasterbotten',
    location: 'Nydala, Umeå',
    coordinates: {
      lat: 63.8275,
      lng: 20.3337
    },
    discipline: 'Natt',
    level: 'Nationell',
    registrationDeadline: '2025-05-05',
    description: 'Unikt lopp som startar i skymningen och avslutas i ljusa norrländska sommarnätter. Speciell upplevelse!',
    website: 'https://umeaok.se/midnattsol',
    featured: true
  },
  {
    id: '37',
    name: 'Hälsinglands 2-dagars, dag 1',
    date: '2025-05-17',
    organizer: 'Söderhamns OK',
    region: 'gavleborg',
    district: 'gavleborg',
    location: 'Mohed, Söderhamn',
    coordinates: {
      lat: 61.2690,
      lng: 16.8318
    },
    discipline: 'Medel',
    level: 'Nationell',
    registrationDeadline: '2025-05-10',
    description: 'Första dagen av Hälsinglands 2-dagars. Medeldistans i gammal hälsingsk skogsmark.',
    website: 'https://soderok.se/2dagars'
  },
  {
    id: '38',
    name: 'Hälsinglands 2-dagars, dag 2',
    date: '2025-05-18',
    organizer: 'Söderhamns OK',
    region: 'gavleborg',
    district: 'gavleborg',
    location: 'Söderala, Söderhamn',
    coordinates: {
      lat: 61.2995,
      lng: 17.0471
    },
    discipline: 'Lång',
    level: 'Nationell',
    registrationDeadline: '2025-05-10',
    description: 'Andra dagen av Hälsinglands 2-dagars. Långdistans med jaktstart baserat på resultaten från dag 1.',
    website: 'https://soderok.se/2dagars'
  },
  {
    id: '39',
    name: 'Roslagsvåren',
    date: '2025-05-25',
    organizer: 'Roslagens OK',
    region: 'stockholm',
    district: 'stockholm',
    location: 'Rimbo, Norrtälje',
    coordinates: {
      lat: 59.7489,
      lng: 18.3542
    },
    discipline: 'Lång',
    level: 'Nationell',
    registrationDeadline: '2025-05-19',
    description: 'Långdistans genom lättlöpta roslagsskogar. Perfekt tillfälle att testa formen inför sommarsäsongen.',
    website: 'https://rok.nu/roslagsvaren'
  },
  {
    id: '40',
    name: 'Sigtuna Urban Sprint',
    date: '2025-05-31',
    organizer: 'Sigtuna OK',
    region: 'stockholm',
    district: 'uppland',
    location: 'Sigtuna Gamla Stan',
    coordinates: {
      lat: 59.6173,
      lng: 17.7236
    },
    discipline: 'Sprint',
    level: 'Nationell',
    registrationDeadline: '2025-05-26',
    description: 'Spännande sprint genom Sigtunas historiska kvarter, en av Sveriges äldsta städer.',
    website: 'https://sigtunaok.se/urbansprint'
  }
];

// June 2025
const juneCompetitions: Competition[] = [
  {
    id: '41',
    name: 'Gotland Ultra',
    date: '2025-06-01',
    organizer: 'Gotlands Bro OK',
    region: 'gotland',
    district: 'gotland',
    location: 'Tofta, Gotland',
    coordinates: {
      lat: 57.4923,
      lng: 18.1326
    },
    discipline: 'Ultralång',
    level: 'Nationell',
    registrationDeadline: '2025-05-25',
    description: 'Ultralång distans längs Gotlands vackra västkust. Kombinerar strand, skog och alvarmark.',
    website: 'https://gotlandsbrook.se/ultra2025'
  },
  {
    id: '42',
    name: 'Norrköpingsnatten',
    date: '2025-06-07',
    organizer: 'OK Denseln',
    region: 'ostergotland',
    district: 'ostergotland',
    location: 'Vrinnevi, Norrköping',
    coordinates: {
      lat: 58.5677,
      lng: 16.1571
    },
    discipline: 'Natt',
    level: 'Nationell',
    registrationDeadline: '2025-06-02',
    description: 'Unik nattorientering under sommarens ljusa kvällar. Tekniskt utmanande i stadsnära skogar.',
    website: 'https://okdenseln.se/natten'
  },
  {
    id: '43',
    name: 'Sundsvall City Challenge',
    date: '2025-06-14',
    organizer: 'Sundsvalls OK',
    region: 'vasternorrland',
    district: 'vasternorrland',
    location: 'Sundsvall Centrum',
    coordinates: {
      lat: 62.3908,
      lng: 17.3069
    },
    discipline: 'Sprint',
    level: 'Nationell',
    registrationDeadline: '2025-06-09',
    description: 'Urban sprinttävling genom Sundsvalls centrum med inslag av trappor och passager.',
    website: 'https://sok.se/citychallenge'
  },
  {
    id: '44',
    name: 'Midsommardubbeln, dag 1',
    date: '2025-06-20',
    organizer: 'IK Hakarpspojkarna',
    region: 'jonkoping',
    district: 'smaland',
    location: 'Hakarp, Huskvarna',
    coordinates: {
      lat: 57.8245,
      lng: 14.3023
    },
    discipline: 'Medel',
    level: 'Nationell',
    registrationDeadline: '2025-06-15',
    description: 'Traditionell midsommartävling med medeldistans. Perfekt mix av utmaning och fest.',
    website: 'https://hakarpspojkarna.se/midsommar'
  },
  {
    id: '45',
    name: 'Midsommardubbeln, dag 2',
    date: '2025-06-21',
    organizer: 'IK Hakarpspojkarna',
    region: 'jonkoping',
    district: 'smaland',
    location: 'Hakarp, Huskvarna',
    coordinates: {
      lat: 57.8245,
      lng: 14.3023
    },
    discipline: 'Lång',
    level: 'Nationell',
    registrationDeadline: '2025-06-15',
    description: 'Traditionell midsommartävling med långdistans. Jaktstart baserad på dag 1:s resultat.',
    website: 'https://hakarpspojkarna.se/midsommar'
  },
  {
    id: '46',
    name: 'Värmlandsdubbeln, dag 1',
    date: '2025-06-28',
    organizer: 'OK Tyr',
    region: 'varmland',
    district: 'varmland',
    location: 'Karlstad',
    coordinates: {
      lat: 59.4022,
      lng: 13.5115
    },
    discipline: 'Sprint',
    level: 'Nationell',
    registrationDeadline: '2025-06-23',
    description: 'Första dagen av Värmlandsdubbeln. Snabb sprintorientering genom Karlstads centrum.',
    website: 'https://oktyr.se/varmland2025'
  },
  {
    id: '47',
    name: 'Värmlandsdubbeln, dag 2',
    date: '2025-06-29',
    organizer: 'OK Tyr',
    region: 'varmland',
    district: 'varmland',
    location: 'Karlstad',
    coordinates: {
      lat: 59.4022,
      lng: 13.5115
    },
    discipline: 'Medel',
    level: 'Nationell',
    registrationDeadline: '2025-06-23',
    description: 'Andra dagen av Värmlandsdubbeln. Medeldistans i teknisk terräng utanför Karlstad.',
    website: 'https://oktyr.se/varmland2025'
  }
];

// July 2025
const julyCompetitions: Competition[] = [
  {
    id: '48',
    name: 'Hallands 3-dagars, dag 2',
    date: '2025-07-06',
    organizer: 'Falkenbergs OK',
    region: 'halland',
    district: 'halland',
    location: 'Ullared, Falkenberg',
    coordinates: {
      lat: 57.1134,
      lng: 12.7199
    },
    discipline: 'Lång',
    level: 'Nationell',
    registrationDeadline: '2025-06-25',
    description: 'Andra dagen av Hallands 3-dagars. Långdistans genom kuperad halländsk terräng.',
    website: 'https://hallands3dagars.se'
  },
  {
    id: '49',
    name: 'Hallands 3-dagars, dag 3',
    date: '2025-07-07',
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
    description: 'Tredje och sista dagen av Hallands 3-dagars. Medeldistans med jaktstart baserat på tidigare dagar.',
    website: 'https://hallands3dagars.se'
  },
  {
    id: '50',
    name: 'Idre Fjällvecka - Prologen',
    date: '2025-07-19',
    organizer: 'Särna SK',
    region: 'dalarna',
    district: 'dalarna',
    location: 'Idre Fjäll, Älvdalen',
    coordinates: {
      lat: 61.8903,
      lng: 12.7243
    },
    discipline: 'Sprint',
    level: 'Nationell',
    registrationDeadline: '2025-07-10',
    description: 'Inledande sprinttävling för Idre Fjällvecka. Orientering på kalfjället med imponerande utsikt.',
    website: 'https://idrefjallvecka.se'
  },
  {
    id: '51',
    name: 'O-Ringen Etapp 2',
    date: '2025-07-23',
    organizer: 'O-Ringen',
    region: 'dalarna',
    district: 'dalarna',
    location: 'Idre, Älvdalen',
    coordinates: {
      lat: 61.8579,
      lng: 12.7250
    },
    discipline: 'Lång',
    level: 'Internationell',
    registrationDeadline: '2025-06-30',
    description: 'Andra etappen av O-Ringen. Långdistans med tekniska moment och höjdskillnader.',
    website: 'https://oringen.se/2025',
    featured: true
  },
  {
    id: '52',
    name: 'O-Ringen Etapp 3',
    date: '2025-07-24',
    organizer: 'O-Ringen',
    region: 'dalarna',
    district: 'dalarna',
    location: 'Idre, Älvdalen',
    coordinates: {
      lat: 61.8589,
      lng: 12.7260
    },
    discipline: 'Medel',
    level: 'Internationell',
    registrationDeadline: '2025-06-30',
    description: 'Tredje etappen av O-Ringen. Medeldistans med extra teknisk utmaning.',
    website: 'https://oringen.se/2025',
    featured: true
  },
  {
    id: '53',
    name: 'O-Ringen Etapp 4',
    date: '2025-07-25',
    organizer: 'O-Ringen',
    region: 'dalarna',
    district: 'dalarna',
    location: 'Idre, Älvdalen',
    coordinates: {
      lat: 61.8599,
      lng: 12.7270
    },
    discipline: 'Lång',
    level: 'Internationell',
    registrationDeadline: '2025-06-30',
    description: 'Fjärde etappen av O-Ringen. Långdistans med delvis öppen fjällterräng.',
    website: 'https://oringen.se/2025',
    featured: true
  },
  {
    id: '54',
    name: 'O-Ringen Etapp 5',
    date: '2025-07-26',
    organizer: 'O-Ringen',
    region: 'dalarna',
    district: 'dalarna',
    location: 'Idre, Älvdalen',
    coordinates: {
      lat: 61.8609,
      lng: 12.7280
    },
    discipline: 'Lång',
    level: 'Internationell',
    registrationDeadline: '2025-06-30',
    description: 'Femte och avslutande etappen av O-Ringen. Jaktstart baserat på tidigare etappers resultat.',
    website: 'https://oringen.se/2025',
    featured: true
  }
];

// August 2025
const augustCompetitions: Competition[] = [
  {
    id: '55',
    name: 'Göteborg O-Meeting, dag 1',
    date: '2025-08-02',
    organizer: 'IFK Göteborg Orientering',
    region: 'vastra-gotaland',
    district: 'goteborg',
    location: 'Delsjön, Göteborg',
    coordinates: {
      lat: 57.6885,
      lng: 12.0459
    },
    discipline: 'Sprint',
    level: 'Nationell',
    registrationDeadline: '2025-07-28',
    description: 'Första dagen av Göteborg O-Meeting. Stadssprint genom centrala Göteborg.',
    website: 'https://ifkgoteborg.se/omeeting'
  },
  {
    id: '56',
    name: 'Göteborg O-Meeting, dag 2',
    date: '2025-08-03',
    organizer: 'IFK Göteborg Orientering',
    region: 'vastra-gotaland',
    district: 'goteborg',
    location: 'Änggårdsbergen, Göteborg',
    coordinates: {
      lat: 57.6792,
      lng: 11.9336
    },
    discipline: 'Medel',
    level: 'Nationell',
    registrationDeadline: '2025-07-28',
    description: 'Andra dagen av Göteborg O-Meeting. Medeldistans i den tekniska terrängen i Änggårdsbergen.',
    website: 'https://ifkgoteborg.se/omeeting'
  },
  {
    id: '57',
    name: 'DM Lång Stockholm',
    date: '2025-08-17',
    organizer: 'Järfälla OK',
    region: 'stockholm',
    district: 'stockholm',
    location: 'Järvafältet, Stockholm',
    coordinates: {
      lat: 59.4231,
      lng: 17.8371
    },
    discipline: 'Lång',
    level: 'Distrikt',
    registrationDeadline: '2025-08-11',
    description: 'Distriktsmästerskap långdistans för Stockholm. Krävande terräng och fysiskt utmanande banor.',
    website: 'https://stockholmsorientering.se/dm2025'
  },
  {
    id: '58',
    name: 'DM Medel Uppsala',
    date: '2025-08-23',
    organizer: 'OK Linné',
    region: 'uppsala',
    district: 'uppland',
    location: 'Lunsen, Uppsala',
    coordinates: {
      lat: 59.7965,
      lng: 17.6435
    },
    discipline: 'Medel',
    level: 'Distrikt',
    registrationDeadline: '2025-08-18',
    description: 'Distriktsmästerskap medeldistans för Uppsala län. Teknisk orientering i detaljrik terräng.',
    website: 'https://oklinne.se/dmmedel'
  },
  {
    id: '59',
    name: 'DM Stafett Uppsala',
    date: '2025-08-24',
    organizer: 'OK Linné',
    region: 'uppsala',
    district: 'uppland',
    location: 'Lunsen, Uppsala',
    coordinates: {
      lat: 59.7965,
      lng: 17.6435
    },
    discipline: 'Stafett',
    level: 'Distrikt',
    registrationDeadline: '2025-08-18',
    description: 'Distriktsmästerskap stafett för Uppsala län. Spännande lagmätning som ofta avgörs på upploppet.',
    website: 'https://oklinne.se/dmstafett'
  },
  {
    id: '60',
    name: 'Swedish League Final',
    date: '2025-08-30',
    organizer: 'Stora Tuna OK',
    region: 'dalarna',
    district: 'dalarna',
    location: 'Borlänge',
    coordinates: {
      lat: 60.4843,
      lng: 15.4353
    },
    discipline: 'Lång',
    level: 'Nationell',
    registrationDeadline: '2025-08-24',
    description: 'Avslutande deltävling i Swedish League. Här avgörs säsongens totalsegrare.',
    website: 'https://swedishleague.se/final',
    featured: true
  },
  {
    id: '61',
    name: 'Swedish League Sprint Final',
    date: '2025-08-31',
    organizer: 'Stora Tuna OK',
    region: 'dalarna',
    district: 'dalarna',
    location: 'Borlänge Centrum',
    coordinates: {
      lat: 60.4843,
      lng: 15.4353
    },
    discipline: 'Sprint',
    level: 'Nationell',
    registrationDeadline: '2025-08-24',
    description: 'Avslutande sprinttävling i Swedish League. Urban sprintorientering genom Borlänge centrum.',
    website: 'https://swedishleague.se/sprintfinal',
    featured: true
  }
];

// September 2025
const septemberCompetitions: Competition[] = [
  {
    id: '62',
    name: 'DM Sprint Stockholm',
    date: '2025-09-06',
    organizer: 'Sundbybergs IK',
    region: 'stockholm',
    district: 'stockholm',
    location: 'Sundbyberg Centrum',
    coordinates: {
      lat: 59.3613,
      lng: 17.9718
    },
    discipline: 'Sprint',
    level: 'Distrikt',
    registrationDeadline: '2025-09-01',
    description: 'Distriktsmästerskap sprint för Stockholm. Fartfylld tävling genom stadsmiljö.',
    website: 'https://sik.se/dmsprint'
  },
  {
    id: '63',
    name: 'DM Stafett Stockholm',
    date: '2025-09-07',
    organizer: 'Sundbybergs IK',
    region: 'stockholm',
    district: 'stockholm',
    location: 'Ursvik, Sundbyberg',
    coordinates: {
      lat: 59.3799,
      lng: 17.9565
    },
    discipline: 'Stafett',
    level: 'Distrikt',
    registrationDeadline: '2025-09-01',
    description: 'Distriktsmästerskap stafett för Stockholm. Spännande avslutning på DM-helgen.',
    website: 'https://sik.se/dmstafett'
  },
  {
    id: '64',
    name: 'Höstöppet Skåne',
    date: '2025-09-13',
    organizer: 'Lunds OK',
    region: 'skane',
    district: 'skane',
    location: 'Dalby, Lund',
    coordinates: {
      lat: 55.6705,
      lng: 13.3509
    },
    discipline: 'Medel',
    level: 'Nationell',
    registrationDeadline: '2025-09-08',
    description: 'Traditionell hösttävling i Skåne. Medeldistans i den vackra bokskogen.',
    website: 'https://lundsok.se/hostoppet'
  },
  {
    id: '65',
    name: 'SM Medel',
    date: '2025-09-20',
    organizer: 'Malmö OK',
    region: 'skane',
    district: 'skane',
    location: 'Torups Bokskog, Malmö',
    coordinates: {
      lat: 55.5597,
      lng: 13.2125
    },
    discipline: 'Medel',
    level: 'Nationell',
    registrationDeadline: '2025-09-10',
    description: 'Svenska Mästerskapen i medeldistans. Eliten samlas för årlig kraftmätning.',
    website: 'https://svenskorientering.se/sm2025',
    featured: true
  },
  {
    id: '66',
    name: 'SM Stafett',
    date: '2025-09-21',
    organizer: 'Malmö OK',
    region: 'skane',
    district: 'skane',
    location: 'Torups Bokskog, Malmö',
    coordinates: {
      lat: 55.5597,
      lng: 13.2125
    },
    discipline: 'Stafett',
    level: 'Nationell',
    registrationDeadline: '2025-09-10',
    description: 'Svenska Mästerskapen i stafett. Klubbarnas viktigaste tävling där allt kan hända.',
    website: 'https://svenskorientering.se/sm2025',
    featured: true
  },
  {
    id: '67',
    name: 'Östgötaklassikern',
    date: '2025-09-27',
    organizer: 'OK Roxen',
    region: 'ostergotland',
    district: 'ostergotland',
    location: 'Stjärnorp, Linköping',
    coordinates: {
      lat: 58.5075,
      lng: 15.5346
    },
    discipline: 'Lång',
    level: 'Nationell',
    registrationDeadline: '2025-09-22',
    description: 'Klassisk långdistans i östgötsk terräng. Kuperat och tekniskt krävande.',
    website: 'https://okroxen.se/klassikern'
  },
  {
    id: '68',
    name: 'Gävle Höstmeeting',
    date: '2025-09-28',
    organizer: 'Gävle OK',
    region: 'gavleborg',
    district: 'gavleborg',
    location: 'Hemlingby, Gävle',
    coordinates: {
      lat: 60.6465,
      lng: 17.1851
    },
    discipline: 'Medel',
    level: 'Nationell',
    registrationDeadline: '2025-09-22',
    description: 'Säsongsavslutande medeldistans med spännande och varierade banor.',
    website: 'https://gavleok.se/hostmeeting'
  }
];

// October 2025
const octoberCompetitions: Competition[] = [
  {
    id: '69',
    name: 'Uppsala Mörkertävling',
    date: '2025-10-04',
    organizer: 'OK Linné',
    region: 'uppsala',
    district: 'uppland',
    location: 'Fjällnora, Uppsala',
    coordinates: {
      lat: 59.8394,
      lng: 17.9115
    },
    discipline: 'Natt',
    level: 'Nationell',
    registrationDeadline: '2025-09-29',
    description: 'Säsongspremiär för nattävlingar. Utmanande orientering i totalt mörker.',
    website: 'https://oklinne.se/morker'
  },
  {
    id: '70',
    name: 'Stockholm City Cup, etapp 1',
    date: '2025-10-11',
    organizer: 'Järla Orientering',
    region: 'stockholm',
    district: 'stockholm',
    location: 'Södermalm, Stockholm',
    coordinates: {
      lat: 59.3139,
      lng: 18.0753
    },
    discipline: 'Sprint',
    level: 'Nationell',
    registrationDeadline: '2025-10-06',
    description: 'Första etappen av populära Stockholm City Cup. Urban sprint genom Södermalms gator och gränder.',
    website: 'https://stockholmcitycup.se'
  },
  {
    id: '71',
    name: 'Stockholm City Cup, etapp 2',
    date: '2025-10-18',
    organizer: 'Järla Orientering',
    region: 'stockholm',
    district: 'stockholm',
    location: 'Gamla Stan, Stockholm',
    coordinates: {
      lat: 59.3253,
      lng: 18.0713
    },
    discipline: 'Sprint',
    level: 'Nationell',
    registrationDeadline: '2025-10-13',
    description: 'Andra etappen av Stockholm City Cup. Historisk sprint genom Gamla Stans medeltida gatunät.',
    website: 'https://stockholmcitycup.se'
  },
  {
    id: '72',
    name: 'Smålandskavlen',
    date: '2025-10-25',
    organizer: 'Växjö OK',
    region: 'kronoberg',
    district: 'smaland',
    location: 'Teleborg, Växjö',
    coordinates: {
      lat: 56.8570,
      lng: 14.8359
    },
    discipline: 'Stafett',
    level: 'Nationell',
    registrationDeadline: '2025-10-15',
    description: 'Klassisk höststafett med natt- och dagsträckor. En av Sveriges äldsta och mest prestigefyllda stafetter.',
    website: 'https://smalandskavlen.se',
    featured: true
  },
  {
    id: '73',
    name: 'Stockholm City Cup, etapp 3',
    date: '2025-10-26',
    organizer: 'Järla Orientering',
    region: 'stockholm',
    district: 'stockholm',
    location: 'Kungsholmen, Stockholm',
    coordinates: {
      lat: 59.3307,
      lng: 18.0284
    },
    discipline: 'Sprint',
    level: 'Nationell',
    registrationDeadline: '2025-10-20',
    description: 'Tredje och avslutande etappen av Stockholm City Cup. Final med jaktstart baserat på tidigare etapper.',
    website: 'https://stockholmcitycup.se'
  }
];

// November 2025
const novemberCompetitions: Competition[] = [
  {
    id: '74',
    name: 'Novembersprinten',
    date: '2025-11-01',
    organizer: 'OK Södertörn',
    region: 'stockholm',
    district: 'stockholm',
    location: 'Flemingsberg, Huddinge',
    coordinates: {
      lat: 59.2199,
      lng: 17.9436
    },
    discipline: 'Sprint',
    level: 'Nationell',
    registrationDeadline: '2025-10-27',
    description: 'Inledande vintersäsongstävling. Sprint i dagsljus med tekniska utmaningar.',
    website: 'https://oksodertorn.se/november'
  },
  {
    id: '75',
    name: 'Norrköpings Nattcup, etapp 1',
    date: '2025-11-08',
    organizer: 'OK Denseln',
    region: 'ostergotland',
    district: 'ostergotland',
    location: 'Vrinnevi, Norrköping',
    coordinates: {
      lat: 58.5677,
      lng: 16.1571
    },
    discipline: 'Natt',
    level: 'Distrikt',
    registrationDeadline: '2025-11-03',
    description: 'Första etappen av Norrköpings Nattcup. Orienteringsutmaning i kompakt stadsnära skog.',
    website: 'https://okdenseln.se/nattcup'
  },
  {
    id: '76',
    name: 'Göteborg By Night, etapp 1',
    date: '2025-11-15',
    organizer: 'Göteborg-Majorna OK',
    region: 'vastra-gotaland',
    district: 'goteborg',
    location: 'Slottsskogen, Göteborg',
    coordinates: {
      lat: 57.6851,
      lng: 11.9418
    },
    discipline: 'Natt',
    level: 'Distrikt',
    registrationDeadline: '2025-11-10',
    description: 'Första etappen av Göteborgs populära nattserie. Sprint genom Slottsskogens mörka gångar.',
    website: 'https://gmok.se/bynight'
  },
  {
    id: '77',
    name: 'Norrköpings Nattcup, etapp 2',
    date: '2025-11-22',
    organizer: 'OK Denseln',
    region: 'ostergotland',
    district: 'ostergotland',
    location: 'Folkparken, Norrköping',
    coordinates: {
      lat: 58.5882,
      lng: 16.1728
    },
    discipline: 'Natt',
    level: 'Distrikt',
    registrationDeadline: '2025-11-17',
    description: 'Andra etappen av Norrköpings Nattcup. Parkorientering med många kontroller.',
    website: 'https://okdenseln.se/nattcup'
  },
  {
    id: '78',
    name: 'Göteborg By Night, etapp 2',
    date: '2025-11-29',
    organizer: 'Göteborg-Majorna OK',
    region: 'vastra-gotaland',
    district: 'goteborg',
    location: 'Änggårdsbergen, Göteborg',
    coordinates: {
      lat: 57.6792,
      lng: 11.9336
    },
    discipline: 'Natt',
    level: 'Distrikt',
    registrationDeadline: '2025-11-24',
    description: 'Andra etappen av Göteborgs populära nattserie. Teknisk nattorientering i kuperad terräng.',
    website: 'https://gmok.se/bynight'
  }
];

// December 2025
const decemberCompetitions: Competition[] = [
  {
    id: '79',
    name: 'Luciatävlingen',
    date: '2025-12-13',
    organizer: 'IFK Lidingö SOK',
    region: 'stockholm',
    district: 'stockholm',
    location: 'Lidingö',
    coordinates: {
      lat: 59.3662,
      lng: 18.1333
    },
    discipline: 'Natt',
    level: 'Distrikt',
    registrationDeadline: '2025-12-08',
    description: 'Traditionell luciafirande med orienteringstävling. Facklor och lyktor lyser upp kontrollerna.',
    website: 'https://ifklsok.se/lucia2025'
  },
  {
    id: '80',
    name: 'Vintercupen Etapp 1',
    date: '2025-12-06',
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
    registrationDeadline: '2025-12-01',
    description: 'Första etappen av årets Vintercup. Sprint med kreativa inslag och överraskningar.',
    website: 'https://jok.se/vintercupen2025'
  },
  {
    id: '81',
    name: 'Julavslutningen',
    date: '2025-12-20',
    organizer: 'Sundbybergs IK',
    region: 'stockholm',
    district: 'stockholm',
    location: 'Ursvik, Sundbyberg',
    coordinates: {
      lat: 59.3799,
      lng: 17.9565
    },
    discipline: 'Lång',
    level: 'Distrikt',
    registrationDeadline: '2025-12-15',
    description: 'Traditionell julavslutning med glögg och pepparkakor vid målet. Tävling i skämtsam anda.',
    website: 'https://sik.se/julavslutning'
  },
  {
    id: '82',
    name: 'Nyårsraketen',
    date: '2025-12-31',
    organizer: 'Tullinge SK',
    region: 'stockholm',
    district: 'stockholm',
    location: 'Lida, Botkyrka',
    coordinates: {
      lat: 59.1750,
      lng: 17.8340
    },
    discipline: 'Sprint',
    level: 'Klubb',
    registrationDeadline: '2025-12-28',
    description: 'Avsluta året med en fartfylld sprint. Mål innan tolvslaget och gemensamt nyårsfirande efteråt.',
    website: 'https://tullingesk.se/nyarsraket'
  }
];

// New club competitions - Veteran-OL and similar club events
const clubCompetitions: Competition[] = [
  {
    id: '83',
    name: 'Veteran-OL Täby',
    date: '2025-01-14',
    organizer: 'Täby OK',
    region: 'stockholm',
    district: 'stockholm',
    location: 'Täby Centrum, Stockholm',
    coordinates: {
      lat: 59.4448,
      lng: 18.0722
    },
    discipline: 'Medel',
    level: 'Klubb',
    registrationDeadline: '2025-01-13',
    description: 'Veteran-OL för klubbmedlemmar 50+ år. Gemensamt fika efter tävlingen i klubbstugan.',
    website: 'https://tabyok.se/veteran-ol'
  },
  {
    id: '84',
    name: 'Veteran-OL Täby',
    date: '2025-01-28',
    organizer: 'Täby OK',
    region: 'stockholm',
    district: 'stockholm',
    location: 'Rösjöskogen, Täby',
    coordinates: {
      lat: 59.4578,
      lng: 17.9906
    },
    discipline: 'Lång',
    level: 'Klubb',
    registrationDeadline: '2025-01-27',
    description: 'Andra Veteran-OL för säsongen. Varannan tisdag genom vintern för klubbens seniorlöpare.',
    website: 'https://tabyok.se/veteran-ol'
  },
  {
    id: '85',
    name: 'Veteran-OL Uppsala',
    date: '2025-01-16',
    organizer: 'OK Linné',
    region: 'uppsala',
    district: 'uppland',
    location: 'Hågadalen, Uppsala',
    coordinates: {
      lat: 59.8340,
      lng: 17.5891
    },
    discipline: 'Medel',
    level: 'Klubb',
    registrationDeadline: '2025-01-15',
    description: 'Första Veteran-OL i Uppsala för säsongen. Lätta banor med social samvaro efteråt.',
    website: 'https://oklinne.se/veteranol'
  },
  {
    id: '86',
    name: 'Veteran-OL Uppsala',
    date: '2025-01-30',
    organizer: 'OK Linné',
    region: 'uppsala',
    district: 'uppland',
    location: 'Stabby, Uppsala',
    coordinates: {
      lat: 59.8576,
      lng: 17.6145
    },
    discipline: 'Medel',
    level: 'Klubb',
    registrationDeadline: '2025-01-29',
    description: 'Andra Veteran-OL i Uppsala för säsongen. Välj mellan tre olika banor efter förmåga.',
    website: 'https://oklinne.se/veteranol'
  },
  {
    id: '87',
    name: 'Torsdags-OL Göteborg',
    date: '2025-01-09',
    organizer: 'IFK Göteborg Orientering',
    region: 'vastra-gotaland',
    district: 'goteborg',
    location: 'Skatås, Göteborg',
    coordinates: {
      lat: 57.7065,
      lng: 12.0492
    },
    discipline: 'Medel',
    level: 'Klubb',
    registrationDeadline: '2025-01-08',
    description: 'Veckans klubbträning öppen för alla åldrar. Gemensam start kl 18.00.',
    website: 'https://ifkgoteborg.se/torsdagsol'
  },
  {
    id: '88',
    name: 'Torsdags-OL Göteborg',
    date: '2025-01-23',
    organizer: 'IFK Göteborg Orientering',
    region: 'vastra-gotaland',
    district: 'goteborg',
    location: 'Delsjön, Göteborg',
    coordinates: {
      lat: 57.6885,
      lng: 12.0459
    },
    discipline: 'Lång',
    level: 'Klubb',
    registrationDeadline: '2025-01-22',
    description: 'Klubbträning med teknikfokus. Tre olika längder att välja mellan.',
    website: 'https://ifkgoteborg.se/torsdagsol'
  },
  {
    id: '89',
    name: 'Veteran-OL Täby',
    date: '2025-02-11',
    organizer: 'Täby OK',
    region: 'stockholm',
    district: 'stockholm',
    location: 'Skogberga, Täby',
    coordinates: {
      lat: 59.4780,
      lng: 18.0851
    },
    discipline: 'Medel',
    level: 'Klubb',
    registrationDeadline: '2025-02-10',
    description: 'Fortsättning på våra varannanveckors-träffar för veteraner. Fika efteråt i klubbstugan.',
    website: 'https://tabyok.se/veteran-ol'
  },
  {
    id: '90',
    name: 'Veteran-OL Täby',
    date: '2025-02-25',
    organizer: 'Täby OK',
    region: 'stockholm',
    district: 'stockholm',
    location: 'Näsbypark, Täby',
    coordinates: {
      lat: 59.4287,
      lng: 18.0936
    },
    discipline: 'Lång',
    level: 'Klubb',
    registrationDeadline: '2025-02-24',
    description: 'Veteran-OL med längre banor för att bygga uthållighet inför vårsäsongen.',
    website: 'https://tabyok.se/veteran-ol'
  },
  {
    id: '91',
    name: 'Veteran-OL Uppsala',
    date: '2025-02-13',
    organizer: 'OK Linné',
    region: 'uppsala',
    district: 'uppland',
    location: 'Sunnersta, Uppsala',
    coordinates: {
      lat: 59.8091,
      lng: 17.6362
    },
    discipline: 'Medel',
    level: 'Klubb',
    registrationDeadline: '2025-02-12',
    description: 'Veteran-OL med kartövningar och trevlig samvaro för klubbens seniorer.',
    website: 'https://oklinne.se/veteranol'
  },
  {
    id: '92',
    name: 'Veteran-OL Uppsala',
    date: '2025-02-27',
    organizer: 'OK Linné',
    region: 'uppsala',
    district: 'uppland',
    location: 'Gränby, Uppsala',
    coordinates: {
      lat: 59.8789,
      lng: 17.6738
    },
    discipline: 'Medel',
    level: 'Klubb',
    registrationDeadline: '2025-02-26',
    description: 'Februari månads sista Veteran-OL i Uppsala. Fika som vanligt efter loppet.',
    website: 'https://oklinne.se/veteranol'
  },
  {
    id: '93',
    name: 'Torsdags-OL Göteborg',
    date: '2025-02-06',
    organizer: 'IFK Göteborg Orientering',
    region: 'vastra-gotaland',
    district: 'goteborg',
    location: 'Änggårdsbergen, Göteborg',
    coordinates: {
      lat: 57.6792,
      lng: 11.9336
    },
    discipline: 'Medel',
    level: 'Klubb',
    registrationDeadline: '2025-02-05',
    description: 'Veckans klubbträning i teknisk terräng. Passar alla nivåer med olika banval.',
    website: 'https://ifkgoteborg.se/torsdagsol'
  },
  {
    id: '94',
    name: 'Torsdags-OL Göteborg',
    date: '2025-02-20',
    organizer: 'IFK Göteborg Orientering',
    region: 'vastra-gotaland',
    district: 'goteborg',
    location: 'Slottsskogen, Göteborg',
    coordinates: {
      lat: 57.6851,
      lng: 11.9418
    },
    discipline: 'Sprint',
    level: 'Klubb',
    registrationDeadline: '2025-02-19',
    description: 'Sprintfokuserad träning i parkmiljö. Bra för att träna snabba beslut.',
    website: 'https://ifkgoteborg.se/torsdagsol'
  },
  {
    id: '95',
    name: 'Tisdagsorientering Örebro',
    date: '2025-01-07',
    organizer: 'Almby IK',
    region: 'orebro',
    district: 'orebro',
    location: 'Markaskogen, Örebro',
    coordinates: {
      lat: 59.2534,
      lng: 15.2628
    },
    discipline: 'Medel',
    level: 'Klubb',
    registrationDeadline: '2025-01-06',
    description: 'Årets första tisdagsträning. Gemensam start kl 10.00 för pensionärer och veteraner.',
    website: 'https://almbyik.se/tisdagsol'
  },
  {
    id: '96',
    name: 'Tisdagsorientering Örebro',
    date: '2025-01-21',
    organizer: 'Almby IK',
    region: 'orebro',
    district: 'orebro',
    location: 'Karlslund, Örebro',
    coordinates: {
      lat: 59.2921,
      lng: 15.1871
    },
    discipline: 'Lång',
    level: 'Klubb',
    registrationDeadline: '2025-01-20',
    description: 'Tisdagsträning med längre banor. Välj mellan 3, 5 eller 7 km. Fika i klubbstugan efteråt.',
    website: 'https://almbyik.se/tisdagsol'
  },
  {
    id: '97',
    name: 'Veteran-OL Skåne',
    date: '2025-01-08',
    organizer: 'Lunds OK',
    region: 'skane',
    district: 'skane',
    location: 'Dalby, Lund',
    coordinates: {
      lat: 55.6705,
      lng: 13.3509
    },
    discipline: 'Medel',
    level: 'Klubb',
    registrationDeadline: '2025-01-07',
    description: 'Skånes veteranorientering för löpare 60+. Lätta banor i behaglig terräng.',
    website: 'https://lundsok.se/veteran'
  },
  {
    id: '98',
    name: 'Veteran-OL Skåne',
    date: '2025-01-22',
    organizer: 'Lunds OK',
    region: 'skane',
    district: 'skane',
    location: 'Sankt Hans backar, Lund',
    coordinates: {
      lat: 55.7145,
      lng: 13.1850
    },
    discipline: 'Medel',
    level: 'Klubb',
    registrationDeadline: '2025-01-21',
    description: 'Varannan-onsdags träff för veteranlöpare i Skåneregionen. Socialt fokus med orientering.',
    website: 'https://lundsok.se/veteran'
  },
  {
    id: '99',
    name: 'Tisdagsorientering Örebro',
    date: '2025-02-04',
    organizer: 'Almby IK',
    region: 'orebro',
    district: 'orebro',
    location: 'Adolfsberg, Örebro',
    coordinates: {
      lat: 59.2417,
      lng: 15.1566
    },
    discipline: 'Medel',
    level: 'Klubb',
    registrationDeadline: '2025-02-03',
    description: 'Träning för alla nivåer med tekniskt fokus. Start mellan 10.00-11.00.',
    website: 'https://almbyik.se/tisdagsol'
  },
  {
    id: '100',
    name: 'Tisdagsorientering Örebro',
    date: '2025-02-18',
    organizer: 'Almby IK',
    region: 'orebro',
    district: 'orebro',
    location: 'Öknaskogen, Örebro',
    coordinates: {
      lat: 59.2733,
      lng: 15.2894
    },
    discipline: 'Lång',
    level: 'Klubb',
    registrationDeadline: '2025-02-17',
    description: 'Långdistansträning med gemensam reflexgenomgång efteråt inför nattorienteringssäsongen.',
    website: 'https://almbyik.se/tisdagsol'
  },
  {
    id: '101',
    name: 'Veteran-OL Skåne',
    date: '2025-02-05',
    organizer: 'Lunds OK',
    region: 'skane',
    district: 'skane',
    location: 'Bokskogen, Malmö',
    coordinates: {
      lat: 55.5597,
      lng: 13.2125
    },
    discipline: 'Medel',
    level: 'Klubb',
    registrationDeadline: '2025-02-04',
    description: 'Första februariträffen för veteraner. Orientering i klassisk Skånsk bokskog.',
    website: 'https://lundsok.se/veteran'
  },
  {
    id: '102',
    name: 'Veteran-OL Skåne',
    date: '2025-02-19',
    organizer: 'Lunds OK',
    region: 'skane',
    district: 'skane',
    location: 'Skrylle, Lund',
    coordinates: {
      lat: 55.6900,
      lng: 13.3834
    },
    discipline: 'Medel',
    level: 'Klubb',
    registrationDeadline: '2025-02-18',
    description: 'Veteran-OL för löpare i alla åldrar. Samlingsplats vid Skryllegården kl 10.00.',
    website: 'https://lundsok.se/veteran'
  }
];

// Combine all competitions
export const competitions: Competition[] = [
  ...originalCompetitions,
  ...januaryCompetitions,
  ...februaryCompetitions,
  ...marchCompetitions,
  ...aprilCompetitions,
  ...mayCompetitions,
  ...juneCompetitions,
  ...julyCompetitions,
  ...augustCompetitions,
  ...septemberCompetitions,
  ...octoberCompetitions,
  ...novemberCompetitions,
  ...decemberCompetitions,
  ...clubCompetitions
];
