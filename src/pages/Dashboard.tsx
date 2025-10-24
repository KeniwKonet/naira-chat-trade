import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Gift, Bitcoin, Wallet, TrendingUp, Clock, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [recentTrades, setRecentTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUser(user);
      await fetchWalletData(user.id);
      await fetchRecentTrades(user.id);
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchWalletData = async (userId: string) => {
    const { data, error } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", userId)
      .eq("currency", "NGN")
      .single();

    if (error) {
      console.error("Error fetching wallet:", error);
      return;
    }
    setWallet(data);
  };

  const fetchRecentTrades = async (userId: string) => {
    const { data: giftCardTrades } = await supabase
      .from("gift_card_trades")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(3);

    const { data: btcTrades } = await supabase
      .from("bitcoin_trades")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(3);

    const combined = [...(giftCardTrades || []), ...(btcTrades || [])]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);

    setRecentTrades(combined);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground">Loading...</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold">Hi {user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'there'} 👋</h1>
            <p className="text-muted-foreground mt-2">Welcome back to your dashboard</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="neu neu-hover">Logout</Button>
        </div>

        {/* Wallet Balance */}
        <Card className="p-8 mb-8 bg-gradient-to-r from-secondary to-primary neu animate-scale-in">
          <div className="flex items-center gap-4 text-white">
            <Wallet className="w-12 h-12 animate-bounce-subtle" />
            <div>
              <p className="text-lg opacity-90">Wallet Balance</p>
              <p className="text-4xl font-bold">₦{wallet?.balance?.toLocaleString() || "0.00"}</p>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 neu neu-hover cursor-pointer animate-fade-up" onClick={() => navigate("/trade/giftcard")}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center neu">
                <Gift className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold">Trade Gift Cards</h3>
                <p className="text-sm text-muted-foreground">Sell your gift cards</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 neu neu-hover cursor-pointer animate-fade-up" style={{ animationDelay: '0.1s' }} onClick={() => navigate("/trade/bitcoin")}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center neu">
                <Bitcoin className="w-6 h-6 text-warning" />
              </div>
              <div>
                <h3 className="font-semibold">Trade Bitcoin</h3>
                <p className="text-sm text-muted-foreground">Sell BTC for Naira</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 neu neu-hover cursor-pointer animate-fade-up" style={{ animationDelay: '0.2s' }} onClick={() => navigate("/wallet")}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center neu">
                <Wallet className="w-6 h-6 text-success" />
              </div>
              <div>
                <h3 className="font-semibold">My Wallet</h3>
                <p className="text-sm text-muted-foreground">Manage your funds</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Trades */}
        <Card className="p-6 neu animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-2xl font-bold mb-6">Recent Trades</h2>
          {recentTrades.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No trades yet. Start trading now!</p>
          ) : (
            <div className="space-y-4">
              {recentTrades.map((trade) => (
                <div key={trade.id} className="flex items-center justify-between p-4 border rounded-lg neu-hover">
...
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
