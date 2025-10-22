import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import { toast } from "@/hooks/use-toast";
import { Wallet as WalletIcon, ArrowDown, ArrowUp, Clock } from "lucide-react";

const Wallet = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUser(user);
      await fetchWalletData(user.id);
      await fetchTransactions(user.id);
    };
    checkUser();
  }, [navigate]);

  const fetchWalletData = async (userId: string) => {
    const { data } = await supabase
      .from("wallets")
      .select("*")
      .eq("user_id", userId)
      .eq("currency", "NGN")
      .single();

    setWallet(data);
  };

  const fetchTransactions = async (userId: string) => {
    const { data } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);

    setTransactions(data || []);
  };

  const handleDeposit = async () => {
    if (!amount || Number(amount) <= 0) {
      toast({ title: "Error", description: "Please enter a valid amount", variant: "destructive" });
      return;
    }

    toast({ title: "Info", description: "Payment integration coming soon! This is a demo." });
  };

  const handleWithdraw = async () => {
    if (!amount || Number(amount) <= 0) {
      toast({ title: "Error", description: "Please enter a valid amount", variant: "destructive" });
      return;
    }

    if (Number(amount) > wallet?.balance) {
      toast({ title: "Error", description: "Insufficient balance", variant: "destructive" });
      return;
    }

    toast({ title: "Info", description: "Withdrawal feature coming soon! This is a demo." });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-20 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 animate-fade-in">My Wallet</h1>

        <Card className="p-8 mb-8 bg-gradient-to-r from-secondary to-primary neu animate-scale-in">
          <div className="flex items-center gap-4 text-white">
            <WalletIcon className="w-12 h-12 animate-bounce-subtle" />
            <div>
              <p className="text-lg opacity-90">Available Balance</p>
              <p className="text-5xl font-bold">₦{wallet?.balance?.toLocaleString() || "0.00"}</p>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="deposit" className="mb-8 animate-fade-up">
          <TabsList className="grid w-full grid-cols-2 neu">
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          </TabsList>

          <TabsContent value="deposit">
            <Card className="p-6 neu">
              <div className="space-y-4">
                <div>
                  <Label>Amount (₦)</Label>
                  <Input
                    type="number"
                    placeholder="Enter amount to deposit"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="100"
                  />
                </div>
                <Button onClick={handleDeposit} className="w-full bg-gradient-to-r from-secondary to-primary hover:scale-105 transition-transform neu">
                  <ArrowDown className="w-4 h-4 mr-2" />
                  Deposit Funds
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  Minimum deposit: ₦100
                </p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="withdraw">
            <Card className="p-6 neu">
              <div className="space-y-4">
                <div>
                  <Label>Amount (₦)</Label>
                  <Input
                    type="number"
                    placeholder="Enter amount to withdraw"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="1000"
                  />
                </div>
                <Button onClick={handleWithdraw} className="w-full bg-gradient-to-r from-warning to-accent hover:scale-105 transition-transform neu">
                  <ArrowUp className="w-4 h-4 mr-2" />
                  Withdraw Funds
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  Minimum withdrawal: ₦1,000
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="p-6 neu animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-2xl font-bold mb-6">Transaction History</h2>
          {transactions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No transactions yet</p>
          ) : (
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg neu-hover">
                  <div className="flex items-center gap-4">
                    {tx.type.includes("deposit") || tx.type.includes("credit") ? (
                      <ArrowDown className="w-6 h-6 text-success" />
                    ) : (
                      <ArrowUp className="w-6 h-6 text-destructive" />
                    )}
                    <div>
                      <p className="font-semibold capitalize">{tx.type.replace("_", " ")}</p>
                      <p className="text-sm text-muted-foreground">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₦{tx.amount?.toLocaleString()}</p>
                    <p className="text-sm capitalize flex items-center gap-1">
                      {tx.status === "pending" && <Clock className="w-3 h-3" />}
                      {tx.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Wallet;
