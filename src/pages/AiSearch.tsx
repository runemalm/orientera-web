
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AiSearchComponent from "@/components/AiSearch";

const AiSearchPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="py-12 md:py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold mb-6 text-center">Sök tävlingar enkelt</h1>
              <p className="text-center text-muted-foreground mb-8">
                Beskriv vad du söker med egna ord så hittar vi tävlingar som passar dig.
              </p>
              
              <AiSearchComponent className="mt-6" />
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AiSearchPage;
