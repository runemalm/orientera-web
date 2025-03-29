
import { useState } from "react";
import { Link } from "react-router-dom";
import { Compass, Sparkles, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeaturedCompetitions from "@/components/FeaturedCompetitions";
import WaitlistDialog from "@/components/WaitlistDialog";
import AiSearch from "@/components/AiSearch";

const Index = () => {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  
  const showWaitlist = () => {
    setWaitlistOpen(true);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 map-background">
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <Compass className="h-16 w-16 text-orienteering-green" />
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-orienteering-dark">
                Hitta och anmäl dig till orienteringstävlingar
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-muted-foreground">
                Den enkla vägen att upptäcka, planera och anmäla dig till orienteringstävlingar i hela Sverige.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-md">
                  <Link to="/search"><Search className="mr-2 h-4 w-4" /> Sök tävlingar</Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-md"
                  asChild
                >
                  <Link to="/ai-search"><Sparkles className="mr-2 h-4 w-4" /> Sök med AI</Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-md"
                  onClick={showWaitlist}
                >
                  För arrangörer
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* AI Search Section */}
        <section className="py-16 bg-orienteering-green/5">
          <div className="container">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Sök med naturligt språk</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Beskriv vad du letar efter med dina egna ord, så hjälper vår AI dig att hitta rätt tävlingar.
              </p>
            </div>
            
            <div className="text-center">
              <Button asChild size="lg" className="mx-auto">
                <Link to="/ai-search"><Sparkles className="mr-2 h-4 w-4" /> Prova AI-sökning</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Featured Competitions */}
        <FeaturedCompetitions />
        
        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Smidigt och enkelt</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Orientera.com gör det enklare än någonsin att hitta och delta i orienteringstävlingar som passar just dig.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card rounded-lg p-6 text-center shadow-sm">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-orienteering-green/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-orienteering-green">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Sök & filtrera</h3>
                <p className="text-muted-foreground">
                  Hitta tävlingar nära dig, filtrera efter län, distrikt, disciplin eller nivå.
                </p>
              </div>
              
              <div className="bg-card rounded-lg p-6 text-center shadow-sm">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-orienteering-brown/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-orienteering-brown">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Anmäl dig</h3>
                <p className="text-muted-foreground">
                  Enkel anmälan till tävlingar med alla dina personuppgifter på ett ställe.
                </p>
              </div>
              
              <div className="bg-card rounded-lg p-6 text-center shadow-sm">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-orienteering-orange/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-orienteering-orange">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Planera säsongen</h3>
                <p className="text-muted-foreground">
                  Håll koll på kommande tävlingar och bygg din personliga tävlingskalender.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-orienteering-green/10">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Redo att börja?</h2>
              <p className="text-muted-foreground mb-8">
                Hitta din nästa orienteringstävling nu och ta del av Sveriges bästa plattform för orienterare.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/search"><Search className="mr-2 h-4 w-4" /> Sök tävlingar</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/ai-search"><Sparkles className="mr-2 h-4 w-4" /> Sök med AI</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <WaitlistDialog open={waitlistOpen} setOpen={setWaitlistOpen} />
    </div>
  );
};

export default Index;
