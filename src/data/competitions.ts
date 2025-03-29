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
    description: 'Krävande långdistans genom Flemingsbergskogens naturreservat. Kuperad terräng med inslag av tekniska partier.'
  }
];

// Småland Veteran-OL competitions
const smalandVeteranCompetitions: Competition[] = [
  {
    id: '36',
    name: 'Veteran-OL Torsås',
    date: '2025-03-05',
    organizer: 'Torsås OK',
    region: 'kronoberg',
    district: 'smaland',
    location: 'Torsås Skogarna',
    coordinates: {
      lat: 56.4116,
      lng: 16.1319
    },
    discipline: 'Medel',
    level: 'Närtävling',
    registrationDeadline: '2025-03-03',
    description: 'Veteran-OL i Torsås skogar. Lättlöpta banor med varierande svårighetsgrad för alla veteraner.'
  },
  {
    id: '37',
    name: 'Veteran-OL Nybro',
    date: '2025-03-19',
    organizer: 'Nybro OK',
    region: 'kalmar',
    district: 'smaland',
    location: 'Svartbäcksmåla, Nybro',
    coordinates: {
      lat: 56.7450,
      lng: 15.9157
    },
    discipline: 'Medel',
    level: 'Närtävling',
    registrationDeadline: '2025-03-17',
    description: 'Veteran-OL i Nybroskogarna. Teknisk orientering med kontroller i detaljrika områden.'
  }
];

// More Småland competitions throughout the year
const additionalSmalandCompetitions: Competition[] = [
  {
    id: '38',
    name: 'Veteran-OL Orion',
    date: '2025-04-02',
    organizer: 'OK Orion',
    region: 'kronoberg',
    district: 'smaland',
    location: 'Teleborg, Växjö',
    coordinates: {
      lat: 56.8570,
      lng: 14.8359
    },
    discipline: 'Medel',
    level: 'Närtävling',
    registrationDeadline: '2025-03-31',
    description: 'Veteran-OL arrangerad av OK Orion. Trevliga banor för alla veteraner i området kring Teleborg.'
  },
  {
    id: '39',
    name: 'Veteran-OL Emmaboda',
    date: '2025-04-16',
    organizer: 'Emmaboda Verda OK',
    region: 'kalmar',
    district: 'smaland',
    location: 'Emmaboda Centrum',
    coordinates: {
      lat: 56.6309,
      lng: 15.5371
    },
    discipline: 'Sprint',
    level: 'Närtävling',
    registrationDeadline: '2025-04-14',
    description: 'Urban sprintorientering i Emmaboda. Perfekt för alla som uppskattar snabba beslut och korta sträckor.'
  },
  {
    id: '40',
    name: 'Veteran-OL Torsås',
    date: '2025-04-30',
    organizer: 'Torsås OK',
    region: 'kronoberg',
    district: 'smaland',
    location: 'Bergkvara, Torsås',
    coordinates: {
      lat: 56.3950,
      lng: 16.0970
    },
    discipline: 'Lång',
    level: 'Närtävling',
    registrationDeadline: '2025-04-28',
    description: 'Längre banor som passar veteraner som vill ha lite mer utmaning och distans.'
  },
  {
    id: '41',
    name: 'Veteran-OL Nybro',
    date: '2025-05-14',
    organizer: 'Nybro OK',
    region: 'kalmar',
    district: 'smaland',
    location: 'Örsjö, Nybro',
    coordinates: {
      lat: 56.7121,
      lng: 15.8334
    },
    discipline: 'Medel',
    level: 'Närtävling',
    registrationDeadline: '2025-05-12',
    description: 'Vårorientering i härlig småländsk terräng. Varierande svårighetsgrad på alla banor.'
  },
  {
    id: '42',
    name: 'Veteran-OL Orion',
    date: '2025-05-28',
    organizer: 'OK Orion',
    region: 'kronoberg',
    district: 'smaland',
    location: 'Fylleryd, Växjö',
    coordinates: {
      lat: 56.8874,
      lng: 14.8762
    },
    discipline: 'Medel',
    level: 'Närtävling',
    registrationDeadline: '2025-05-26',
    description: 'Våravslutning för Veteran-OL med gemensam fika efteråt. Trevliga banor i vacker miljö.'
  }
];

// Combine all competitions into one exported array
export const competitions = [
  ...originalCompetitions,
  ...januaryCompetitions,
  ...februaryCompetitions,
  ...marchCompetitions, 
  ...aprilCompetitions,
  ...mayCompetitions,
  ...smalandVeteranCompetitions,
  ...additionalSmalandCompetitions
];
