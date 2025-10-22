import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { useUserRole } from "@/hooks/useUserRole";
import { Bitcoin, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AdminSettings = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [btcWallet, setBtcWallet] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      navigate("/dashboard");
    }
  }, [isAdmin, roleLoading, navigate]);

  const handleSaveBtcWallet = async () => {
    setLoading(true);
    try {
      // Here you would typically save to a settings table
      // For now, we'll use localStorage as a simple solution
      localStorage.setItem("platform_btc_wallet", btcWallet);
      toast({ title: "Success", description: "BTC wallet address updated successfully" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load saved BTC wallet
    const saved = localStorage.getItem("platform_btc_wallet");
    if (saved) setBtcWallet(saved);
  }, []);

  if (roleLoading) {
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
      
      <div className="container mx-auto px-4 pt-32 pb-20 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8 animate-fade-in">Admin Settings</h1>

        <Card className="p-8 neu animate-fade-up">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-warning to-accent flex items-center justify-center neu">
              <Bitcoin className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Bitcoin Wallet Settings</h2>
              <p className="text-sm text-muted-foreground">
                Configure the platform's Bitcoin receiving address
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="btc-wallet">Platform BTC Wallet Address</Label>
              <Input
                id="btc-wallet"
                placeholder="Enter BTC wallet address"
                value={btcWallet}
                onChange={(e) => setBtcWallet(e.target.value)}
                className="neu-inset mt-2"
              />
              <p className="text-xs text-muted-foreground mt-2">
                This address will be displayed to users when they trade Bitcoin
              </p>
            </div>

            <Button 
              onClick={handleSaveBtcWallet} 
              disabled={loading || !btcWallet}
              className="w-full"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </Card>

        <Card className="p-6 mt-6 neu border-warning/50">
          <h3 className="font-semibold mb-2 text-warning">⚠️ Important Security Notes</h3>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
            <li>Always verify the wallet address before saving</li>
            <li>Use a secure, dedicated wallet for platform transactions</li>
            <li>Keep backup copies of wallet credentials in a secure location</li>
            <li>Monitor incoming transactions regularly</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;