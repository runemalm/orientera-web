
import { useState } from "react";
import { MapPin, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success("Meddelandet har skickats!", {
        description: "Vi kommer att kontakta dig så snart som möjligt."
      });
      
      // Reset form
      setName("");
      setEmail("");
      setMessage("");
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-orienteering-green/10">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-orienteering-dark">
                  Kontakta oss
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Har du frågor eller funderingar? Vi finns här för att hjälpa dig.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:gap-16 md:grid-cols-2">
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-orienteering-dark mb-4">Vår kontaktinformation</h2>
                  <p className="text-muted-foreground mb-6">
                    Här kan du nå oss via mail, telefon eller besöka vårt kontor.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <Mail className="h-6 w-6 text-orienteering-green mt-0.5" />
                      <div>
                        <h3 className="font-medium">E-post</h3>
                        <a href="mailto:info@orientera.com" className="text-orienteering-green hover:underline">
                          info@orientera.com
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <Phone className="h-6 w-6 text-orienteering-green mt-0.5" />
                      <div>
                        <h3 className="font-medium">Telefon</h3>
                        <a href="tel:+46701234567" className="text-orienteering-green hover:underline">
                          070-123 45 67
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <MapPin className="h-6 w-6 text-orienteering-green mt-0.5" />
                      <div>
                        <h3 className="font-medium">Adress</h3>
                        <p className="text-muted-foreground">
                          Orienteringsvägen 1<br />
                          123 45 Stockholm
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-orienteering-dark mb-4">Följ oss</h2>
                  <p className="text-muted-foreground mb-4">
                    Häng med oss på sociala medier för de senaste uppdateringarna.
                  </p>
                  <div className="flex space-x-4">
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
              
              <div>
                <form onSubmit={handleSubmit} className="space-y-6 bg-muted/30 p-6 rounded-lg">
                  <h2 className="text-2xl font-bold text-orienteering-dark">Skicka ett meddelande</h2>
                  <p className="text-muted-foreground">
                    Fyll i formuläret nedan så återkommer vi till dig inom 48 timmar.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Ditt namn
                      </label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Förnamn Efternamn"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        E-postadress
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="din@email.se"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Meddelande
                      </label>
                      <Textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Skriv ditt meddelande här..."
                        rows={5}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={submitting}
                  >
                    {submitting ? "Skickar..." : "Skicka meddelande"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
