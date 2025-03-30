import React, { useEffect } from "react";
import { Competition } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, List } from "lucide-react";
import CompetitionListView from "@/components/CompetitionListView";
import { groupCompetitionsByMonth } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface CompetitionCalendarViewProps {
  competitions: Competition[];
}

const CompetitionCalendarView: React.FC<CompetitionCalendarViewProps> = ({ 
  competitions 
}) => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = React.useState("list");
  const groupedCompetitions = groupCompetitionsByMonth(competitions);

  const handleCompetitionClick = (competitionId: string) => {
    // Save current scroll position to sessionStorage before navigation
    sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    navigate(`/competition/${competitionId}`);
  };

  return (
    <Tabs defaultValue="list" value={activeView} onValueChange={setActiveView}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Kommande tävlingar</h2>
        <TabsList>
          <TabsTrigger value="list" className="flex items-center">
            <List className="h-4 w-4 mr-2" />
            Lista
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Kalender
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="list" className="mt-0">
        <CompetitionListView competitions={competitions} />
      </TabsContent>

      <TabsContent value="calendar" className="mt-0">
        <div className="space-y-8">
          {Object.entries(groupedCompetitions).map(([month, monthCompetitions]) => (
            <div key={month}>
              <h3 className="text-lg font-medium mb-4 sticky top-0 bg-background py-2 z-10">
                {month}
              </h3>
              <ScrollArea className="h-[calc(100vh-300px)] pr-4">
                <CompetitionListView competitions={monthCompetitions} />
              </ScrollArea>
            </div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default CompetitionCalendarView;
