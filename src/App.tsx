import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Trips from "./pages/Trips";
import Camera from "./pages/Camera";
import BillBreakdown from "./pages/BillBreakdown";
import AssignItems from "./pages/AssignItems";
import FinalBreakdown from "./pages/FinalBreakdown";
import Users from "./pages/Users";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Navigation from "./components/Navigation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="relative">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/camera" element={<Camera />} />
            <Route path="/camera/billbreakdown" element={<BillBreakdown />} />
            <Route path="/camera/assign-items" element={<AssignItems />} />
            <Route path="/camera/final-breakdown" element={<FinalBreakdown />} />
            <Route path="/users" element={<Users />} />
            <Route path="/profile" element={<Profile />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Navigation />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
