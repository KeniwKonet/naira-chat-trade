import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import { useUserRole } from "@/hooks/useUserRole";
import { Search, User, Wallet, TrendingUp } from "lucide-react";

interface UserProfile {
  id: string;
  full_name: string;
  phone: string;
  kyc_status: string;
  created_at: string;
  wallet_balance?: number;
  total_trades?: number;
}

const ManageUsers = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      navigate("/dashboard");
    }
  }, [isAdmin, roleLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profiles) {
        // Fetch wallet balances and trade counts for each user
        const usersWithData = await Promise.all(
          profiles.map(async (profile) => {
            const { data: wallet } = await supabase
              .from("wallets")
              .select("balance")
              .eq("user_id", profile.id)
              .single();

            const { count: gcCount } = await supabase
              .from("gift_card_trades")
              .select("*", { count: "exact", head: true })
              .eq("user_id", profile.id);

            const { count: btcCount } = await supabase
              .from("bitcoin_trades")
              .select("*", { count: "exact", head: true })
              .eq("user_id", profile.id);

            return {
              ...profile,
              wallet_balance: wallet?.balance || 0,
              total_trades: (gcCount || 0) + (btcCount || 0)
            };
          })
        );

        setUsers(usersWithData);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.includes(searchTerm)
  );

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
        <h1 className="text-4xl font-bold mb-8 animate-fade-in">Manage Users</h1>

        <Card className="p-6 mb-8 neu">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 neu-inset"
            />
          </div>
        </Card>

        <div className="grid gap-6">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="p-6 neu neu-hover animate-fade-up">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center neu">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{user.full_name}</h3>
                      <p className="text-sm text-muted-foreground">{user.phone}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">KYC Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${
                        user.kyc_status === 'verified' ? 'bg-success/20 text-success' :
                        user.kyc_status === 'rejected' ? 'bg-destructive/20 text-destructive' :
                        'bg-warning/20 text-warning'
                      }`}>
                        {user.kyc_status}
                      </span>
                    </p>
                    <p><span className="text-muted-foreground">Member Since:</span> {new Date(user.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto rounded-full bg-success/10 flex items-center justify-center neu mb-3">
                      <Wallet className="w-8 h-8 text-success" />
                    </div>
                    <p className="text-sm text-muted-foreground">Wallet Balance</p>
                    <p className="text-2xl font-bold text-success">₦{Number(user.wallet_balance).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center neu mb-3">
                      <TrendingUp className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">Total Trades</p>
                    <p className="text-2xl font-bold text-primary">{user.total_trades}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {filteredUsers.length === 0 && (
            <Card className="p-8 text-center neu">
              <p className="text-muted-foreground">No users found</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;