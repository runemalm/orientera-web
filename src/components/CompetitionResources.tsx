
import React from 'react';
import { CompetitionResource } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Link as LinkIcon, Calendar, ExternalLink } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface CompetitionResourcesProps {
  resources?: CompetitionResource[];
}

const CompetitionResources: React.FC<CompetitionResourcesProps> = ({ resources }) => {
  if (!resources || resources.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Resurser</CardTitle>
          <CardDescription>Inga resurser tillgängliga för denna tävling ännu.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Group resources by type
  const resourcesByType: Record<string, CompetitionResource[]> = {};
  resources.forEach(resource => {
    if (!resourcesByType[resource.type]) {
      resourcesByType[resource.type] = [];
    }
    resourcesByType[resource.type].push(resource);
  });

  const resourceTypes = Object.keys(resourcesByType);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tävlingsresurser</CardTitle>
        <CardDescription>Inbjudan, PM, startlistor och resultat</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={resourceTypes[0]} className="w-full">
          <TabsList className="mb-4 w-full flex justify-start overflow-x-auto">
            {resourceTypes.map(type => (
              <TabsTrigger key={type} value={type} className="flex-shrink-0">
                {type}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {resourceTypes.map(type => (
            <TabsContent key={type} value={type}>
              <div className="space-y-4">
                {resourcesByType[type].map((resource, index) => (
                  <div key={index} className="border rounded-md p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-3">
                      {resource.isFile ? (
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <LinkIcon className="h-5 w-5 text-muted-foreground" />
                      )}
                      <div>
                        <div className="font-medium">{resource.title}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>Tillagd {formatDate(resource.addedDate)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 items-center">
                      {resource.isFile && resource.fileType && (
                        <Badge variant="outline">{resource.fileType.toUpperCase()}</Badge>
                      )}
                      <Button variant="outline" size="sm" className="whitespace-nowrap" asChild>
                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                          Öppna {resource.isFile ? 'fil' : 'länk'}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CompetitionResources;
