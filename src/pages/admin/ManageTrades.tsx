import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import { useUserRole } from "@/hooks/useUserRole";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gift, Bitcoin, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ManageTrades = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [giftCardTrades, setGiftCardTrades] = useState<any[]>([]);
  const [bitcoinTrades, setBitcoinTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      navigate("/dashboard");
    }
  }, [isAdmin, roleLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchTrades();
    }
  }, [isAdmin]);

  const fetchTrades = async () => {
    try {
      const { data: gcTrades } = await supabase
        .from("gift_card_trades")
        .select(`
          *,
          profiles:user_id (full_name, phone)
        `)
        .order("created_at", { ascending: false });

      const { data: btcTrades } = await supabase
        .from("bitcoin_trades")
        .select(`
          *,
          profiles:user_id (full_name, phone)
        `)
        .order("created_at", { ascending: false });

      if (gcTrades) setGiftCardTrades(gcTrades);
      if (btcTrades) setBitcoinTrades(btcTrades);
    } catch (error) {
      console.error("Error fetching trades:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateGiftCardTradeStatus = async (tradeId: string, status: string, adminNotes: string) => {
    try {
      const { error } = await supabase
        .from("gift_card_trades")
        .update({ status, admin_notes: adminNotes })
        .eq("id", tradeId);

      if (error) throw error;

      // If approved, credit user wallet
      if (status === "approved") {
        const trade = giftCardTrades.find(t => t.id === tradeId);
        if (trade) {
          const { data: wallet } = await supabase
            .from("wallets")
            .select("balance")
            .eq("user_id", trade.user_id)
            .single();

          if (wallet) {
            await supabase
              .from("wallets")
              .update({ balance: Number(wallet.balance) + Number(trade.payout_amount) })
              .eq("user_id", trade.user_id);
          }
        }
      }

      toast({ title: "Success", description: "Trade updated successfully" });
      fetchTrades();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const updateBitcoinTradeStatus = async (tradeId: string, status: string, adminNotes: string, txHash?: string) => {
    try {
      const { error } = await supabase
        .from("bitcoin_trades")
        .update({ status, admin_notes: adminNotes, tx_hash: txHash })
        .eq("id", tradeId);

      if (error) throw error;

      // If approved, credit user wallet
      if (status === "approved") {
        const trade = bitcoinTrades.find(t => t.id === tradeId);
        if (trade) {
          const { data: wallet } = await supabase
            .from("wallets")
            .select("balance")
            .eq("user_id", trade.user_id)
            .single();

          if (wallet) {
            await supabase
              .from("wallets")
              .update({ balance: Number(wallet.balance) + Number(trade.payout_amount) })
              .eq("user_id", trade.user_id);
          }
        }
      }

      toast({ title: "Success", description: "Bitcoin trade updated successfully" });
      fetchTrades();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
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
        <h1 className="text-4xl font-bold mb-8 animate-fade-in">Manage Trades</h1>

        <Tabs defaultValue="gift-cards" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8 neu">
            <TabsTrigger value="gift-cards" className="flex items-center gap-2">
              <Gift className="w-4 h-4" />
              Gift Cards
            </TabsTrigger>
            <TabsTrigger value="bitcoin" className="flex items-center gap-2">
              <Bitcoin className="w-4 h-4" />
              Bitcoin
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gift-cards" className="space-y-4 animate-fade-up">
            {giftCardTrades.map((trade) => (
              <Card key={trade.id} className="p-6 neu">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-4">Trade Details</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-muted-foreground">User:</span> {trade.profiles?.full_name}</p>
                      <p><span className="text-muted-foreground">Phone:</span> {trade.profiles?.phone}</p>
                      <p><span className="text-muted-foreground">Brand:</span> {trade.brand}</p>
                      <p><span className="text-muted-foreground">Country:</span> {trade.country}</p>
                      <p><span className="text-muted-foreground">Value:</span> ${trade.card_value}</p>
                      <p><span className="text-muted-foreground">Rate:</span> ₦{trade.rate}</p>
                      <p><span className="text-muted-foreground">Payout:</span> ₦{Number(trade.payout_amount).toLocaleString()}</p>
                      <p><span className="text-muted-foreground">Status:</span> 
                        <span className={`ml-2 px-2 py-1 rounded text-xs ${
                          trade.status === 'approved' ? 'bg-success/20 text-success' :
                          trade.status === 'rejected' ? 'bg-destructive/20 text-destructive' :
                          'bg-warning/20 text-warning'
                        }`}>
                          {trade.status}
                        </span>
                      </p>
                      <p><span className="text-muted-foreground">Date:</span> {new Date(trade.created_at).toLocaleString()}</p>
                    </div>
                    
                    <a href={trade.image_url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-primary hover:underline">
                      <ExternalLink className="w-4 h-4" />
                      View Card Image
                    </a>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-4">Admin Action</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">Status</label>
                        <Select 
                          defaultValue={trade.status}
                          onValueChange={(value) => {
                            const notes = prompt("Enter admin notes (optional):");
                            updateGiftCardTradeStatus(trade.id, value, notes || "");
                          }}
                        >
                          <SelectTrigger className="neu">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-background z-50">
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {trade.admin_notes && (
                        <div>
                          <label className="text-sm text-muted-foreground mb-2 block">Admin Notes</label>
                          <p className="p-3 bg-muted/50 rounded text-sm">{trade.admin_notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {giftCardTrades.length === 0 && (
              <Card className="p-8 text-center neu">
                <p className="text-muted-foreground">No gift card trades found</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="bitcoin" className="space-y-4 animate-fade-up">
            {bitcoinTrades.map((trade) => (
              <Card key={trade.id} className="p-6 neu">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-4">Trade Details</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-muted-foreground">User:</span> {trade.profiles?.full_name}</p>
                      <p><span className="text-muted-foreground">Phone:</span> {trade.profiles?.phone}</p>
                      <p><span className="text-muted-foreground">BTC Amount:</span> {trade.btc_amount} BTC</p>
                      <p><span className="text-muted-foreground">User's BTC Address:</span> 
                        <code className="block mt-1 p-2 bg-muted/50 rounded text-xs break-all">{trade.btc_address}</code>
                      </p>
                      <p><span className="text-muted-foreground">Rate:</span> ₦{Number(trade.rate).toLocaleString()}</p>
                      <p><span className="text-muted-foreground">Payout:</span> ₦{Number(trade.payout_amount).toLocaleString()}</p>
                      <p><span className="text-muted-foreground">Status:</span> 
                        <span className={`ml-2 px-2 py-1 rounded text-xs ${
                          trade.status === 'approved' ? 'bg-success/20 text-success' :
                          trade.status === 'rejected' ? 'bg-destructive/20 text-destructive' :
                          'bg-warning/20 text-warning'
                        }`}>
                          {trade.status}
                        </span>
                      </p>
                      {trade.tx_hash && (
                        <p><span className="text-muted-foreground">TX Hash:</span> 
                          <code className="block mt-1 p-2 bg-muted/50 rounded text-xs break-all">{trade.tx_hash}</code>
                        </p>
                      )}
                      <p><span className="text-muted-foreground">Date:</span> {new Date(trade.created_at).toLocaleString()}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-4">Admin Action</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">Status</label>
                        <Select 
                          defaultValue={trade.status}
                          onValueChange={(value) => {
                            const notes = prompt("Enter admin notes (optional):");
                            const txHash = value === "approved" ? prompt("Enter transaction hash:") : undefined;
                            updateBitcoinTradeStatus(trade.id, value, notes || "", txHash || undefined);
                          }}
                        >
                          <SelectTrigger className="neu">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-background z-50">
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {trade.admin_notes && (
                        <div>
                          <label className="text-sm text-muted-foreground mb-2 block">Admin Notes</label>
                          <p className="p-3 bg-muted/50 rounded text-sm">{trade.admin_notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {bitcoinTrades.length === 0 && (
              <Card className="p-8 text-center neu">
                <p className="text-muted-foreground">No bitcoin trades found</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ManageTrades;