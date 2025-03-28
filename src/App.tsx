
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Search from "./pages/Search";
import CompetitionDetails from "./pages/CompetitionDetails";
import NotFound from "./pages/NotFound";
import AboutUs from "./pages/AboutUs";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import { useScrollToTop } from "./hooks/useScrollToTop";

const queryClient = new QueryClient();

// ScrollToTop component that uses our custom hook
const ScrollToTop = () => {
  useScrollToTop();
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/search" element={<Search />} />
          <Route path="/competition/:id" element={<CompetitionDetails />} />
          <Route path="/om-oss" element={<AboutUs />} />
          <Route path="/profil" element={<Profile />} />
          <Route path="/kontakt" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
