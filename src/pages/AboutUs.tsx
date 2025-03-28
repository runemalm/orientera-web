import { MapPin, Users, Trophy, Calendar, Heart } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AboutUs = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-orienteering-green/10">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-orienteering-dark">
                  Om Orientera.com
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Vi gör det enkelt att hitta och anmäla sig till orienteringstävlingar i hela Sverige.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:gap-16 md:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-orienteering-dark">Vår historia</h2>
                <p className="text-muted-foreground">
                  Orientera.com grundades 2023 av en grupp passionerade orienterare som ville förenkla processen att hitta och delta i tävlingar. 
                  Vår plattform startade som ett litet projekt men har snabbt växt till att bli Sveriges mest omfattande resurs för orienteringstävlingar.
                </p>
                <p className="text-muted-foreground">
                  Med en användarbas som spänner över hela landet, från nybörjare till elitnivå, fortsätter vi att utvecklas med målet att göra orientering 
                  mer tillgängligt för alla.
                </p>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-orienteering-dark">Vår vision</h2>
                <p className="text-muted-foreground">
                  Vi tror på att orientering är en sport för alla, oavsett ålder eller erfarenhetsnivå. Vår vision är att skapa en plattform 
                  som inte bara samlar alla tävlingar på ett ställe, utan också hjälper till att bygga community och främja sporten.
                </p>
                <p className="text-muted-foreground">
                  Genom att förenkla processen att hitta och anmäla sig till tävlingar hoppas vi kunna locka fler människor till denna 
                  fantastiska sport och stärka den svenska orienteringskulturen.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <Separator />
        
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center mb-10">
              <h2 className="text-3xl font-bold text-orienteering-dark">Våra värderingar</h2>
              <p className="text-muted-foreground md:text-lg max-w-[800px]">
                På Orientera.com drivs vi av några grundläggande värderingar som genomsyrar allt vi gör.
              </p>
            </div>
            
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 transition-all hover:bg-accent">
                <MapPin className="h-10 w-10 text-orienteering-green mb-2" />
                <h3 className="text-xl font-bold">Tillgänglighet</h3>
                <p className="text-center text-muted-foreground">
                  Vi sträver efter att göra orientering tillgängligt för alla, oavsett erfarenhetsnivå eller geografisk plats.
                </p>
              </div>
              
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 transition-all hover:bg-accent">
                <Users className="h-10 w-10 text-orienteering-green mb-2" />
                <h3 className="text-xl font-bold">Gemenskap</h3>
                <p className="text-center text-muted-foreground">
                  Vi tror på kraften i gemenskap och arbetar för att stärka banden mellan orienterare över hela Sverige.
                </p>
              </div>
              
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 transition-all hover:bg-accent">
                <Calendar className="h-10 w-10 text-orienteering-green mb-2" />
                <h3 className="text-xl font-bold">Enkelhet</h3>
                <p className="text-center text-muted-foreground">
                  Vi förenklar processen att hitta och anmäla sig till tävlingar för att spara tid för det som verkligen betyder något - själva orienteringen.
                </p>
              </div>
              
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 transition-all hover:bg-accent">
                <Trophy className="h-10 w-10 text-orienteering-green mb-2" />
                <h3 className="text-xl font-bold">Excellens</h3>
                <p className="text-center text-muted-foreground">
                  Vi sträver efter att erbjuda den bästa möjliga upplevelsen för våra användare genom konstant innovation och förbättring.
                </p>
              </div>
              
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 transition-all hover:bg-accent">
                <Heart className="h-10 w-10 text-orienteering-green mb-2" />
                <h3 className="text-xl font-bold">Passion</h3>
                <p className="text-center text-muted-foreground">
                  Vi drivs av vår passion för orientering och älskar att se sporten växa och utvecklas.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section id="kontakt" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:gap-16 md:grid-cols-2 items-center">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-orienteering-dark">Kontakta oss</h2>
                <p className="text-muted-foreground">
                  Har du frågor, förslag eller feedback? Vi vill gärna höra från dig! Kontakta oss via:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="font-medium mr-2">E-post:</span> 
                    <a href="mailto:info@orientera.com" className="text-orienteering-green hover:underline">
                      info@orientera.com
                    </a>
                  </li>
                  <li className="flex items-center">
                    <span className="font-medium mr-2">Telefon:</span> 
                    <a href="tel:+46701234567" className="text-orienteering-green hover:underline">
                      070-123 45 67
                    </a>
                  </li>
                </ul>
                <p className="text-muted-foreground pt-4">
                  Vi sträver efter att svara på alla förfrågningar inom 48 timmar.
                </p>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-orienteering-dark">Följ oss</h2>
                <p className="text-muted-foreground">
                  Häng med oss på sociala medier för de senaste uppdateringarna, tips och nyheter från orienteringsvärlden.
                </p>
                <div className="flex space-x-4 pt-2">
                  <a href="#" className="p-2 border rounded-full hover:bg-accent">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orienteering-green">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </a>
                  <a href="#" className="p-2 border rounded-full hover:bg-accent">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orienteering-green">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </a>
                  <a href="#" className="p-2 border rounded-full hover:bg-accent">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orienteering-green">
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;
