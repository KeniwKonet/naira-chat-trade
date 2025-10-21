import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { toast } from "@/hooks/use-toast";
import { Bitcoin } from "lucide-react";

const TradeBitcoin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [btcAmount, setBtcAmount] = useState("");
  const [btcAddress, setBtcAddress] = useState("");
  const [rate, setRate] = useState<number>(0);
  const [payout, setPayout] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUser(user);
    };
    checkUser();

    const fetchRate = async () => {
      const { data } = await supabase
        .from("bitcoin_rates")
        .select("rate")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setRate(Number(data.rate));
      }
    };

    fetchRate();
  }, [navigate]);

  useEffect(() => {
    if (btcAmount && rate) {
      setPayout(Number(btcAmount) * rate);
    } else {
      setPayout(0);
    }
  }, [btcAmount, rate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !btcAmount || !btcAddress) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from("bitcoin_trades")
        .insert({
          user_id: user.id,
          btc_amount: Number(btcAmount),
          btc_address: btcAddress,
          rate,
          payout_amount: payout,
          status: "pending"
        });

      if (error) throw error;

      toast({ title: "Success", description: "Bitcoin trade submitted! Send BTC to the provided address." });
      navigate("/dashboard");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const platformAddress = "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-20 max-w-2xl">
        <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
          <Bitcoin className="w-10 h-10" />
          Trade Bitcoin
        </h1>

        <Card className="p-8 mb-6 bg-warning/10">
          <h3 className="font-semibold mb-2">Send BTC to this address:</h3>
          <code className="block p-3 bg-background rounded text-sm break-all">{platformAddress}</code>
          <p className="text-sm text-muted-foreground mt-2">
            After submitting, send your Bitcoin to this address. We'll verify and credit your wallet.
          </p>
        </Card>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>BTC Amount</Label>
              <Input
                type="number"
                placeholder="Enter BTC amount"
                value={btcAmount}
                onChange={(e) => setBtcAmount(e.target.value)}
                min="0.0001"
                step="0.00000001"
              />
            </div>

            <div>
              <Label>Your BTC Wallet Address (for refunds)</Label>
              <Input
                type="text"
                placeholder="Enter your BTC address"
                value={btcAddress}
                onChange={(e) => setBtcAddress(e.target.value)}
              />
            </div>

            {rate > 0 && (
              <div className="p-4 bg-success/10 rounded-lg">
                <p className="text-sm text-muted-foreground">Current Rate</p>
                <p className="text-2xl font-bold text-success">₦{rate.toLocaleString()} per BTC</p>
                {payout > 0 && (
                  <>
                    <p className="text-sm text-muted-foreground mt-2">You will receive</p>
                    <p className="text-3xl font-bold text-primary">₦{payout.toLocaleString()}</p>
                  </>
                )}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading || !btcAmount || !btcAddress}>
              {loading ? "Submitting..." : "Submit Trade"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default TradeBitcoin;
