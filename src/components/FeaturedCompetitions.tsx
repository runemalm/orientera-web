
import { competitions } from "@/data/competitions";
import CompetitionCard from "./CompetitionCard";

const FeaturedCompetitions = () => {
  const featuredCompetitions = competitions.filter(comp => comp.featured);
  
  return (
    <section className="py-12 bg-muted/30">
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Populära tävlingar</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Här är några av de mest populära kommande orienteringstävlingarna runt om i landet.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCompetitions.map((competition) => (
            <CompetitionCard 
              key={competition.id} 
              competition={competition}
              featured={true}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCompetitions;
