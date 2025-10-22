import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { useUserRole } from "@/hooks/useUserRole";
import { TrendingUp, Users, Gift, Bitcoin, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";

const Analytics = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsersThisMonth: 0,
    totalTrades: 0,
    tradesThisMonth: 0,
    totalVolume: 0,
    volumeThisMonth: 0,
    giftCardTrades: 0,
    bitcoinTrades: 0,
    pendingTrades: 0,
    completedTrades: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      navigate("/dashboard");
    }
  }, [isAdmin, roleLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchAnalytics();
    }
  }, [isAdmin]);

  const fetchAnalytics = async () => {
    try {
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      // Total users
      const { count: totalUsers } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // New users this month
      const { count: newUsers } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", firstDayOfMonth);

      // Gift card trades
      const { count: gcTotal } = await supabase
        .from("gift_card_trades")
        .select("*", { count: "exact", head: true });

      const { count: gcMonth } = await supabase
        .from("gift_card_trades")
        .select("*", { count: "exact", head: true })
        .gte("created_at", firstDayOfMonth);

      // Bitcoin trades
      const { count: btcTotal } = await supabase
        .from("bitcoin_trades")
        .select("*", { count: "exact", head: true });

      const { count: btcMonth } = await supabase
        .from("bitcoin_trades")
        .select("*", { count: "exact", head: true })
        .gte("created_at", firstDayOfMonth);

      // Pending and completed trades
      const { count: pendingGc } = await supabase
        .from("gift_card_trades")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      const { count: pendingBtc } = await supabase
        .from("bitcoin_trades")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      const { count: completedGc } = await supabase
        .from("gift_card_trades")
        .select("*", { count: "exact", head: true })
        .eq("status", "approved");

      const { count: completedBtc } = await supabase
        .from("bitcoin_trades")
        .select("*", { count: "exact", head: true })
        .eq("status", "approved");

      // Calculate volume (sum of payout amounts)
      const { data: gcPayouts } = await supabase
        .from("gift_card_trades")
        .select("payout_amount");

      const { data: btcPayouts } = await supabase
        .from("bitcoin_trades")
        .select("payout_amount");

      const totalVolume = [
        ...(gcPayouts || []),
        ...(btcPayouts || [])
      ].reduce((sum, trade) => sum + Number(trade.payout_amount), 0);

      setStats({
        totalUsers: totalUsers || 0,
        newUsersThisMonth: newUsers || 0,
        totalTrades: (gcTotal || 0) + (btcTotal || 0),
        tradesThisMonth: (gcMonth || 0) + (btcMonth || 0),
        totalVolume,
        volumeThisMonth: 0, // You can calculate this similarly if needed
        giftCardTrades: gcTotal || 0,
        bitcoinTrades: btcTotal || 0,
        pendingTrades: (pendingGc || 0) + (pendingBtc || 0),
        completedTrades: (completedGc || 0) + (completedBtc || 0),
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (roleLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        <h1 className="text-4xl font-bold mb-8 animate-fade-in">Analytics Dashboard</h1>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 neu neu-hover animate-fade-up">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center neu">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-success" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Total Users</p>
            <p className="text-3xl font-bold mb-2">{stats.totalUsers}</p>
            <p className="text-xs text-success">+{stats.newUsersThisMonth} this month</p>
          </Card>

          <Card className="p-6 neu neu-hover animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center neu">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-success" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Total Trades</p>
            <p className="text-3xl font-bold mb-2">{stats.totalTrades}</p>
            <p className="text-xs text-success">+{stats.tradesThisMonth} this month</p>
          </Card>

          <Card className="p-6 neu neu-hover animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center neu">
                <Wallet className="w-6 h-6 text-accent" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-success" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Total Volume</p>
            <p className="text-3xl font-bold mb-2">₦{stats.totalVolume.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">All time</p>
          </Card>

          <Card className="p-6 neu neu-hover animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center neu">
                <TrendingUp className="w-6 h-6 text-warning" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Pending Trades</p>
            <p className="text-3xl font-bold mb-2">{stats.pendingTrades}</p>
            <p className="text-xs text-warning">Requires attention</p>
          </Card>
        </div>

        {/* Trade Breakdown */}
        <h2 className="text-2xl font-bold mb-6">Trade Breakdown</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 neu neu-hover animate-scale-in">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center neu">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gift Cards</p>
                <p className="text-3xl font-bold text-primary">{stats.giftCardTrades}</p>
              </div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-secondary"
                style={{ width: `${(stats.giftCardTrades / stats.totalTrades) * 100}%` }}
              />
            </div>
          </Card>

          <Card className="p-6 neu neu-hover animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-warning to-accent flex items-center justify-center neu">
                <Bitcoin className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bitcoin</p>
                <p className="text-3xl font-bold text-warning">{stats.bitcoinTrades}</p>
              </div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-warning to-accent"
                style={{ width: `${(stats.bitcoinTrades / stats.totalTrades) * 100}%` }}
              />
            </div>
          </Card>

          <Card className="p-6 neu neu-hover animate-scale-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-success to-primary flex items-center justify-center neu">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-success">{stats.completedTrades}</p>
              </div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-success to-primary"
                style={{ width: `${(stats.completedTrades / stats.totalTrades) * 100}%` }}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;