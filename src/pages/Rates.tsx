import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { Gift, Bitcoin } from "lucide-react";

interface GiftCardRate {
  id: string;
  brand: string;
  country: string;
  rate: number;
  is_active: boolean;
}

interface BitcoinRate {
  id: string;
  rate: number;
  created_at: string;
}

const Rates = () => {
  const [giftCardRates, setGiftCardRates] = useState<GiftCardRate[]>([]);
  const [bitcoinRate, setBitcoinRate] = useState<BitcoinRate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      const { data: gcRates } = await supabase
        .from("gift_card_rates")
        .select("*")
        .eq("is_active", true)
        .order("brand");

      const { data: btcRate } = await supabase
        .from("bitcoin_rates")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (gcRates) setGiftCardRates(gcRates);
      if (btcRate) setBitcoinRate(btcRate);
    } catch (error) {
      console.error("Error fetching rates:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-20 flex items-center justify-center">
          <p className="text-muted-foreground">Loading rates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="text-center mb-12 animate-fade-up">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Live Exchange Rates</h1>
          <p className="text-xl text-muted-foreground">Real-time rates updated every minute</p>
        </div>

        {/* Bitcoin Rate */}
        {bitcoinRate && (
          <Card className="p-10 mb-12 neu neu-hover bg-gradient-to-br from-card to-muted/20 border-0 animate-scale-in group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-warning/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center gap-8 relative z-10">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-warning to-accent flex items-center justify-center neu animate-pulse-glow">
                <Bitcoin className="w-12 h-12 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-3 group-hover:text-primary transition-colors">Bitcoin (BTC)</h2>
                <p className="text-5xl font-bold bg-gradient-to-r from-warning to-accent bg-clip-text text-transparent mb-2">
                  ₦{bitcoinRate.rate.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">per BTC • Updated: {new Date(bitcoinRate.created_at).toLocaleTimeString()}</p>
              </div>
              <div className="text-right">
                <span className="inline-block px-4 py-2 rounded-full bg-success/20 text-success text-sm font-semibold neu-inset">Live Rate</span>
              </div>
            </div>
          </Card>
        )}

        {/* Gift Card Rates */}
        <div className="mb-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">Gift Card Rates</h2>
          <p className="text-muted-foreground">Trade 50+ popular gift card brands</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {giftCardRates.map((rate, index) => (
            <Card key={rate.id} className="p-8 neu neu-hover bg-gradient-to-br from-card to-muted/20 border-0 animate-fade-up group" style={{ animationDelay: `${0.3 + index * 0.05}s` }}>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center neu group-hover:scale-110 transition-transform">
                  <Gift className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{rate.brand}</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                    {rate.country}
                  </p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-1">
                    ₦{rate.rate.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">per $1 USD</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {giftCardRates.length === 0 && (
          <Card className="p-8 text-center neu">
            <p className="text-muted-foreground">No gift card rates available at the moment.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Rates;
