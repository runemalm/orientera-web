
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UserRound, Settings, Mail, Medal, MapPin, Calendar, Clock, Shield } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const formSchema = z.object({
  name: z.string().min(2, { message: "Namn måste vara minst 2 tecken." }),
  email: z.string().email({ message: "Ogiltig e-postadress." }),
  club: z.string().optional(),
  phone: z.string().optional(),
  notifications: z.boolean().default(true),
  emailUpdates: z.boolean().default(true),
});

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "Anna Svensson",
      email: "anna.svensson@example.com",
      club: "Göteborgs Orienteringsklubb",
      phone: "070-123 45 67",
      notifications: true,
      emailUpdates: true,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Här skulle vi vanligtvis skicka data till en backend
    console.log(values);
    setIsEditing(false);
    toast.success("Profil uppdaterad", {
      description: "Dina profiluppgifter har sparats.",
    });
  }

  const upcomingCompetitions = [
    { id: 1, name: "Hallands 3-dagars", date: "18 juni 2024", location: "Halmstad" },
    { id: 2, name: "O-Ringen Åre", date: "22-28 juli 2024", location: "Åre" },
    { id: 3, name: "Göteborgs Höst-OL", date: "14 september 2024", location: "Göteborg" },
  ];

  const pastCompetitions = [
    { id: 4, name: "Vårsprinten", date: "12 april 2024", location: "Stockholm", result: "15:e plats" },
    { id: 5, name: "Medeldistans Cup", date: "3 mars 2024", location: "Uppsala", result: "8:e plats" },
    { id: 6, name: "Nattugglan", date: "18 februari 2024", location: "Linköping", result: "DNF" },
  ];

  return (
    <>
      <Header />
      <main className="container py-8">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 md:h-20 md:w-20">
                <AvatarImage src="https://randomuser.me/api/portraits/women/32.jpg" alt="Anna Svensson" />
                <AvatarFallback>AS</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Anna Svensson</h1>
                <div className="flex items-center text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>Göteborg</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-green-50">H21</Badge>
              <Badge variant="outline" className="bg-blue-50">Göteborgs OK</Badge>
              <Badge variant="outline" className="bg-amber-50">SOFT-ID: 12345678</Badge>
            </div>
          </div>

          <Tabs defaultValue="oversikt" className="w-full">
            <TabsList className="w-full md:w-auto justify-start overflow-auto">
              <TabsTrigger value="oversikt">Översikt</TabsTrigger>
              <TabsTrigger value="tavlingar">Tävlingar</TabsTrigger>
              <TabsTrigger value="installningar">Inställningar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="oversikt" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <UserRound className="mr-2 h-5 w-5" />
                      Personuppgifter
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Namn</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>E-post</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="club"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Klubb</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Telefon</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" type="button" onClick={() => setIsEditing(false)}>
                              Avbryt
                            </Button>
                            <Button type="submit">Spara ändringar</Button>
                          </div>
                        </form>
                      </Form>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                          <div>
                            <Label className="text-muted-foreground">Namn</Label>
                            <p>Anna Svensson</p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">E-post</Label>
                            <p>anna.svensson@example.com</p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">Klubb</Label>
                            <p>Göteborgs Orienteringsklubb</p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">Telefon</Label>
                            <p>070-123 45 67</p>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button onClick={() => setIsEditing(true)}>Redigera profil</Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Medal className="mr-2 h-5 w-5" />
                        Statistik
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tävlingar 2024</span>
                          <span className="font-medium">8</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Träningstillfällen</span>
                          <span className="font-medium">23</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Topplaceringar</span>
                          <span className="font-medium">2</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Calendar className="mr-2 h-5 w-5" />
                        Kommande tävlingar
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y">
                        {upcomingCompetitions.map(comp => (
                          <div key={comp.id} className="p-4 hover:bg-muted/50">
                            <h4 className="font-medium">{comp.name}</h4>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{comp.date}</span>
                              <MapPin className="h-3 w-3 ml-2 mr-1" />
                              <span>{comp.location}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t px-4 py-3">
                      <Button variant="ghost" size="sm" className="w-full">
                        Visa alla tävlingar
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="tavlingar" className="mt-6">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Anmälda tävlingar</CardTitle>
                    <CardDescription>
                      Tävlingar du har anmält dig till
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingCompetitions.length > 0 ? (
                        upcomingCompetitions.map(comp => (
                          <div key={comp.id} className="flex justify-between items-center border-b pb-4">
                            <div>
                              <h4 className="font-medium">{comp.name}</h4>
                              <div className="flex items-center text-sm text-muted-foreground mt-1">
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>{comp.date}</span>
                                <MapPin className="h-3 w-3 ml-2 mr-1" />
                                <span>{comp.location}</span>
                              </div>
                            </div>
                            <div>
                              <Button variant="outline" size="sm">Visa detaljer</Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 text-muted-foreground">
                          <p>Du har inga kommande anmälningar</p>
                          <Button variant="outline" className="mt-2">Sök tävlingar</Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Tidigare tävlingar</CardTitle>
                    <CardDescription>
                      Tävlingar du har deltagit i
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pastCompetitions.map(comp => (
                        <div key={comp.id} className="flex justify-between items-center border-b pb-4">
                          <div>
                            <h4 className="font-medium">{comp.name}</h4>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{comp.date}</span>
                              <MapPin className="h-3 w-3 ml-2 mr-1" />
                              <span>{comp.location}</span>
                            </div>
                            <Badge variant="outline" className="mt-2">Resultat: {comp.result}</Badge>
                          </div>
                          <div>
                            <Button variant="outline" size="sm">Visa detaljer</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="installningar" className="mt-6">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="mr-2 h-5 w-5" />
                      Inställningar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-4">Notifikationer</h3>
                          <div className="space-y-4">
                            <FormField
                              control={form.control}
                              name="notifications"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>App-notifikationer</FormLabel>
                                    <FormDescription>
                                      Få påminnelser om kommande tävlingar och anmälningsdeadlines
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="emailUpdates"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel>E-postmeddelanden</FormLabel>
                                    <FormDescription>
                                      Ta emot e-post om nya tävlingar, tävlingsuppdateringar och resultat
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-lg font-medium mb-4">Säkerhet</h3>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="current-password">Nuvarande lösenord</Label>
                              <Input id="current-password" type="password" />
                            </div>
                            <div>
                              <Label htmlFor="new-password">Nytt lösenord</Label>
                              <Input id="new-password" type="password" />
                            </div>
                            <div>
                              <Label htmlFor="confirm-password">Bekräfta nytt lösenord</Label>
                              <Input id="confirm-password" type="password" />
                            </div>
                            <Button className="w-full md:w-auto">Uppdatera lösenord</Button>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-lg font-medium mb-4">Datadelning</h3>
                          <Alert className="mb-4">
                            <Shield className="h-4 w-4" />
                            <AlertTitle>Dataskyddsinformation</AlertTitle>
                            <AlertDescription>
                              Vi delar din information med Svenska Orienteringsförbundet för att hantera dina tävlingsanmälningar och resultat. 
                              Du kan när som helst begära att få dina uppgifter raderade.
                            </AlertDescription>
                          </Alert>
                          <Button variant="outline" className="w-full md:w-auto">Ladda ner min data</Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProfilePage;
