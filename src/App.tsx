import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import TradeGiftCard from "./pages/TradeGiftCard";
import TradeBitcoin from "./pages/TradeBitcoin";
import Wallet from "./pages/Wallet";
import Rates from "./pages/Rates";
import Contact from "./pages/Contact";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/admin/Dashboard";
import ManageRates from "./pages/admin/ManageRates";
import ManageTrades from "./pages/admin/ManageTrades";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageMessages from "./pages/admin/ManageMessages";
import Analytics from "./pages/admin/Analytics";
import AdminSettings from "./pages/admin/AdminSettings";
import NotFound from "./pages/NotFound";
import Chatbot from "./components/Chatbot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/trade/giftcard" element={<TradeGiftCard />} />
            <Route path="/trade/bitcoin" element={<TradeBitcoin />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/rates" element={<Rates />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/rates" element={<ManageRates />} />
            <Route path="/admin/trades" element={<ManageTrades />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/messages" element={<ManageMessages />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Chatbot />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
