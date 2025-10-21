import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { useUserRole } from "@/hooks/useUserRole";
import {
  Users,
  Gift,
  Bitcoin,
  Wallet,
  TrendingUp,
  MessageSquare,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTrades: 0,
    pendingTrades: 0,
    totalVolume: 0,
    unreadMessages: 0,
  });

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      navigate("/dashboard");
    }
  }, [isAdmin, roleLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  const fetchStats = async () => {
    try {
      const { count: usersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      const { count: gcCount } = await supabase
        .from("gift_card_trades")
        .select("*", { count: "exact", head: true });

      const { count: btcCount } = await supabase
        .from("bitcoin_trades")
        .select("*", { count: "exact", head: true });

      const { count: pendingGc } = await supabase
        .from("gift_card_trades")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      const { count: pendingBtc } = await supabase
        .from("bitcoin_trades")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      const { count: unreadMsg } = await supabase
        .from("contact_messages")
        .select("*", { count: "exact", head: true })
        .eq("status", "unread");

      setStats({
        totalUsers: usersCount || 0,
        totalTrades: (gcCount || 0) + (btcCount || 0),
        pendingTrades: (pendingGc || 0) + (pendingBtc || 0),
        totalVolume: 0,
        unreadMessages: unreadMsg || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  if (roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 neu neu-hover">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center neu">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 neu neu-hover">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center neu">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Trades</p>
                <p className="text-2xl font-bold">{stats.totalTrades}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 neu neu-hover">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center neu">
                <Wallet className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Trades</p>
                <p className="text-2xl font-bold">{stats.pendingTrades}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 neu neu-hover">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center neu">
                <MessageSquare className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unread Messages</p>
                <p className="text-2xl font-bold">{stats.unreadMessages}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/admin/rates">
            <Card className="p-6 neu neu-hover cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center neu">
                  <Settings className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Manage Rates</h3>
                  <p className="text-sm text-muted-foreground">Update exchange rates</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link to="/admin/trades">
            <Card className="p-6 neu neu-hover cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center neu">
                  <Gift className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold">Manage Trades</h3>
                  <p className="text-sm text-muted-foreground">Review and approve trades</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link to="/admin/users">
            <Card className="p-6 neu neu-hover cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center neu">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">User Management</h3>
                  <p className="text-sm text-muted-foreground">View user profiles</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link to="/admin/messages">
            <Card className="p-6 neu neu-hover cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center neu">
                  <MessageSquare className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <h3 className="font-semibold">Messages</h3>
                  <p className="text-sm text-muted-foreground">View and respond to messages</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link to="/admin/analytics">
            <Card className="p-6 neu neu-hover cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center neu">
                  <TrendingUp className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold">Analytics</h3>
                  <p className="text-sm text-muted-foreground">View platform statistics</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link to="/admin/settings">
            <Card className="p-6 neu neu-hover cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center neu">
                  <Bitcoin className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <h3 className="font-semibold">Settings</h3>
                  <p className="text-sm text-muted-foreground">BTC wallet & more</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
