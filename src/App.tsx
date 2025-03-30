
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Index from "./pages/Index";
import Search from "./pages/Search";
import CompetitionDetails from "./pages/CompetitionDetails";
import NotFound from "./pages/NotFound";
import AboutUs from "./pages/AboutUs";
import Profile from "./pages/Profile";

const App = () => {
  // Create QueryClient instance inside the component using useState
  // This ensures it's properly managed within React's lifecycle
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/search" element={<Search />} />
            <Route path="/competition/:id" element={<CompetitionDetails />} />
            <Route path="/om-oss" element={<AboutUs />} />
            <Route path="/profil" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
