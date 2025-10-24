import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import { toast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

const GIFT_CARD_BRANDS = [
  "Amazon", "Steam", "Apple iTunes", "Google Play", "eBay", "Walmart", 
  "Sephora", "Nike", "Xbox", "PlayStation", "Visa", "Mastercard", 
  "American Express", "Target", "Best Buy", "Nordstrom"
];

const COUNTRIES = ["US", "UK"];

const TradeGiftCard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [brand, setBrand] = useState("");
  const [country, setCountry] = useState("");
  const [value, setValue] = useState("");
  const [image, setImage] = useState<File | null>(null);
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
  }, [navigate]);

  useEffect(() => {
    const fetchRate = async () => {
      if (!brand || !country) return;
      
      const { data } = await supabase
        .from("gift_card_rates")
        .select("rate")
        .eq("brand", brand)
        .eq("country", country)
        .eq("is_active", true)
        .single();

      if (data) {
        setRate(Number(data.rate));
      }
    };

    fetchRate();
  }, [brand, country]);

  useEffect(() => {
    if (value && rate) {
      setPayout(Number(value) * rate);
    } else {
      setPayout(0);
    }
  }, [value, rate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !image || !brand || !country || !value) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      // Upload image
      const fileExt = image.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("gift-cards")
        .upload(fileName, image);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("gift-cards")
        .getPublicUrl(fileName);

      // Create trade
      const { error: tradeError } = await supabase
        .from("gift_card_trades")
        .insert({
          user_id: user.id,
          brand,
          country,
          card_value: Number(value),
          rate,
          payout_amount: payout,
          image_url: publicUrl,
          status: "pending"
        });

      if (tradeError) throw tradeError;

      // Create transaction record
      await supabase
        .from("transactions")
        .insert({
          user_id: user.id,
          type: "gift_card_trade",
          amount: payout,
          status: "pending",
          description: `${brand} ${country} Gift Card - $${value}`
        });

      toast({ title: "Success", description: "Trade submitted successfully! Awaiting verification." });
      navigate("/dashboard");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-20 max-w-2xl">
        <h1 className="text-4xl font-bold mb-8 animate-fade-in">Trade Gift Card</h1>

        <Card className="p-8 neu animate-scale-in">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>Gift Card Brand</Label>
              <Select value={brand} onValueChange={setBrand}>
                <SelectTrigger>
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  {GIFT_CARD_BRANDS.map((b) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Country</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Card Value ($)</Label>
              <Input
                type="number"
                placeholder="Enter card value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                min="1"
                step="0.01"
              />
            </div>

            {rate > 0 && (
              <div className="p-4 bg-success/10 rounded-lg neu-inset animate-fade-in">
                <p className="text-sm text-muted-foreground">Current Rate</p>
                <p className="text-2xl font-bold text-success">₦{rate} per $1</p>
                {payout > 0 && (
                  <>
                    <p className="text-sm text-muted-foreground mt-2">You will receive</p>
                    <p className="text-3xl font-bold text-secondary animate-pulse-glow">₦{payout.toLocaleString()}</p>
                  </>
                )}
              </div>
            )}

            <div>
              <Label>Upload Card Image</Label>
              <div className="mt-2 flex items-center gap-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-accent">
                    <Upload className="w-5 h-5" />
                    <span>{image ? image.name : "Choose file"}</span>
                  </div>
                </label>
              </div>
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-secondary to-accent hover:scale-105 transition-transform neu" disabled={loading || !image || !brand || !country || !value}>
              {loading ? "Submitting..." : "Submit Trade"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default TradeGiftCard;
