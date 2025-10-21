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
        <h1 className="text-4xl font-bold mb-8 text-center">Current Exchange Rates</h1>

        {/* Bitcoin Rate */}
        {bitcoinRate && (
          <Card className="p-8 mb-12 neu">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-warning to-accent flex items-center justify-center neu">
                <Bitcoin className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Bitcoin (BTC)</h2>
                <p className="text-4xl font-bold text-primary">
                  ₦{bitcoinRate.rate.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground mt-1">per BTC</p>
              </div>
            </div>
          </Card>
        )}

        {/* Gift Card Rates */}
        <h2 className="text-3xl font-bold mb-6">Gift Card Rates</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {giftCardRates.map((rate) => (
            <Card key={rate.id} className="p-6 neu neu-hover">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center neu">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1">{rate.brand}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{rate.country}</p>
                  <p className="text-2xl font-bold text-primary">
                    ₦{rate.rate.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">per $1</p>
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
