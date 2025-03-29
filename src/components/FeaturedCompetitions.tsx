
import { competitions } from "@/data/competitions";
import CompetitionCard from "./CompetitionCard";
import { useEffect, useMemo } from "react";

const FeaturedCompetitions = () => {
  // Get current date to calculate upcoming competitions
  const today = useMemo(() => new Date(), []);
  
  // Select featured competitions that are upcoming (not in the past)
  // Limit to max 4 competitions that are most relevant
  const upcomingFeaturedCompetitions = useMemo(() => {
    return competitions
      .filter(comp => {
        const compDate = new Date(comp.date);
        return compDate >= today && comp.featured;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 4);
  }, [today]);
  
  // If we don't have enough featured upcoming competitions, add some popular non-featured ones
  const displayedCompetitions = useMemo(() => {
    if (upcomingFeaturedCompetitions.length >= 3) {
      return upcomingFeaturedCompetitions;
    }
    
    // We need more competitions - find popular upcoming ones based on level
    const popularLevels = ['Internationell', 'Nationell'];
    const remainingSlots = 4 - upcomingFeaturedCompetitions.length;
    
    const additionalCompetitions = competitions
      .filter(comp => {
        const compDate = new Date(comp.date);
        return compDate >= today && 
               !comp.featured && 
               popularLevels.includes(comp.level);
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, remainingSlots);
    
    return [...upcomingFeaturedCompetitions, ...additionalCompetitions];
  }, [upcomingFeaturedCompetitions, today]);
  
  useEffect(() => {
    console.log(`Displaying ${displayedCompetitions.length} competitions on home page`);
  }, [displayedCompetitions.length]);
  
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
          {displayedCompetitions.map((competition) => (
            <CompetitionCard 
              key={competition.id} 
              competition={competition}
              featured={competition.featured}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCompetitions;
