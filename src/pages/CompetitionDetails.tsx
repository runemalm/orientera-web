
import { useParams, Link } from "react-router-dom";
import { Calendar, MapPin, Flag, Star, Users, Globe, ArrowUp } from "lucide-react";
import { competitions } from "@/data/competitions";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CompetitionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const competition = competitions.find(comp => comp.id === id);

  if (!competition) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container py-8">
          <div className="bg-card rounded-lg border p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Tävling hittades inte</h1>
            <p className="mb-6">Tävlingen du söker finns inte eller har tagits bort.</p>
            <Button asChild>
              <Link to="/search">Tillbaka till sökning</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="bg-orienteering-green/5 py-12">
          <div className="container">
            <Link to="/search" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
              ← Tillbaka till sökning
            </Link>
            
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {competition.featured && (
                    <div className="bg-accent/10 text-accent rounded-full px-3 py-1 text-sm font-medium inline-flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      Populär tävling
                    </div>
                  )}
                  <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium">
                    {competition.discipline}
                  </div>
                  <div className="bg-secondary/10 text-secondary rounded-full px-3 py-1 text-sm font-medium">
                    {competition.level}
                  </div>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{competition.name}</h1>
                
                <div className="flex flex-col md:flex-row gap-4 md:gap-6 text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    {formatDate(competition.date)}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    {competition.location}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    {competition.organizer}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-3 md:min-w-[200px]">
                <Button size="lg" className="w-full">Anmäl dig</Button>
                {competition.website && (
                  <Button variant="outline" size="lg" asChild className="w-full">
                    <a href={competition.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center">
                      <Globe className="mr-2 h-4 w-4" />
                      Tävlingens hemsida
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-xl font-bold mb-4">Om tävlingen</h2>
                <p className="whitespace-pre-line">{competition.description}</p>
              </div>
              
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-xl font-bold mb-4">Tävlingsinformation</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-muted-foreground mb-1">Arrangör</h3>
                    <p>{competition.organizer}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground mb-1">Datum</h3>
                    <p>{formatDate(competition.date)}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground mb-1">Plats</h3>
                    <p>{competition.location}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground mb-1">Disciplin</h3>
                    <p>{competition.discipline}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground mb-1">Nivå</h3>
                    <p>{competition.level}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground mb-1">Sista anmälningsdag</h3>
                    <p>{formatDate(competition.registrationDeadline)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-card rounded-lg border p-6 sticky top-20">
                <h2 className="text-xl font-bold mb-4">Plats</h2>
                <div className="aspect-square bg-muted rounded-lg mb-4 overflow-hidden">
                  {/* Placeholder for map - would use actual map integration in production */}
                  <div className="w-full h-full bg-orienteering-green/20 flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-orienteering-green" />
                  </div>
                </div>
                <p className="font-medium">{competition.location}</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Koordinater: {competition.coordinates.lat.toFixed(6)}, {competition.coordinates.lng.toFixed(6)}
                </p>
                <Button variant="outline" className="w-full">
                  <MapPin className="mr-2 h-4 w-4" />
                  Visa vägbeskrivning
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container py-8">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-bold mb-6">Liknande tävlingar</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {competitions
                .filter(comp => 
                  comp.id !== competition.id && 
                  (comp.discipline === competition.discipline || comp.region === competition.region)
                )
                .slice(0, 3)
                .map(comp => (
                  <div key={comp.id} className="border rounded-lg p-4 hover:border-primary transition-colors">
                    <h3 className="font-medium mb-2">
                      <Link to={`/competition/${comp.id}`} className="hover:text-primary transition-colors">
                        {comp.name}
                      </Link>
                    </h3>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(comp.date)}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      {comp.location}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        
        <div className="container flex justify-center py-8">
          <Button variant="outline" asChild>
            <Link to="/search" className="inline-flex items-center">
              <ArrowUp className="mr-2 h-4 w-4" />
              Tillbaka till toppen
            </Link>
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CompetitionDetails;
