import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameSidebar } from "./components/GameSidebar";

// Auth Pages
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AvatarCreation from "./pages/AvatarCreation";

// Main Pages
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import Players from "./pages/Players";
import FoodRecommendations from "./pages/FoodRecommendations";
import HealthSuggestions from "./pages/HealthSuggestions";
import RivalsMode from "./pages/RivalsMode";
import Profile from "./pages/Profile";
import JungleStore from "./pages/JungleStore";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Layout component for authenticated pages
const GameLayout = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full bg-background">
      <GameSidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-12 flex items-center border-b border-primary/20 bg-card px-4">
          <SidebarTrigger className="text-primary hover:text-primary-glow" />
          <div className="ml-4 font-pixel text-sm text-primary">PIXEL DASH</div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  </SidebarProvider>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route path="/" element={<SignIn />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/avatar-creation" element={<AvatarCreation />} />
          
          {/* Main App Routes */}
          <Route path="/" element={<GameLayout><JungleStore /></GameLayout>} />
          <Route path="/dashboard" element={<GameLayout><Dashboard /></GameLayout>} />
          <Route path="/leaderboard" element={<GameLayout><Leaderboard /></GameLayout>} />
          <Route path="/players" element={<GameLayout><Players /></GameLayout>} />
          <Route path="/food" element={<GameLayout><FoodRecommendations /></GameLayout>} />
          <Route path="/health" element={<GameLayout><HealthSuggestions /></GameLayout>} />
          <Route path="/rivals" element={<GameLayout><RivalsMode /></GameLayout>} />
          <Route path="/profile" element={<GameLayout><Profile /></GameLayout>} />
          <Route path="/profile/:id" element={<GameLayout><Profile /></GameLayout>} />
          <Route path="/jungle-store" element={<GameLayout><JungleStore /></GameLayout>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;