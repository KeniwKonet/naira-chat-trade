import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Menu, X, Wallet } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useUserRole } from "@/hooks/useUserRole";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAdmin } = useUserRole();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border neu animate-fade-in">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent flex items-center gap-2 hover:scale-105 transition-transform">
            <Wallet className="w-8 h-8 text-primary" />
            CryptoTrade
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/rates" className="hover:text-primary transition-all hover:scale-105">Rates</Link>
            <Link to="/contact" className="hover:text-primary transition-all hover:scale-105">Contact</Link>
            {user && isAdmin && (
              <Link to="/admin" className="hover:text-accent transition-all hover:scale-105 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                Admin
              </Link>
            )}
            <ThemeToggle />
            {user ? (
              <>
                <Link to="/dashboard" className="hover:text-primary transition-all hover:scale-105">Dashboard</Link>
                <Button onClick={handleSignOut} variant="outline" className="neu neu-hover">Sign Out</Button>
              </>
            ) : (
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-transform neu">Get Started</Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden neu neu-hover p-2 rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 animate-fade-up neu-inset rounded-lg p-4 mt-2 mb-4">
            <Link to="/rates" className="block hover:text-primary transition-all hover:translate-x-2" onClick={() => setMobileMenuOpen(false)}>Rates</Link>
            <Link to="/contact" className="block hover:text-primary transition-all hover:translate-x-2" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            {user && isAdmin && (
              <Link to="/admin" className="block hover:text-accent transition-all hover:translate-x-2 font-semibold flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                Admin Dashboard
              </Link>
            )}
            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <span className="text-sm">Theme:</span>
              <ThemeToggle />
            </div>
            {user ? (
              <>
                <Link to="/dashboard" className="block hover:text-primary transition-all hover:translate-x-2" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                <Button onClick={handleSignOut} variant="outline" className="w-full neu neu-hover mt-2">Sign Out</Button>
              </>
            ) : (
              <Link to="/auth" className="block">
                <Button className="w-full bg-gradient-to-r from-primary to-secondary neu mt-2">Get Started</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
