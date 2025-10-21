import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { useUserRole } from "@/hooks/useUserRole";
import { Edit, Trash2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ManageRates = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [giftCardRates, setGiftCardRates] = useState<any[]>([]);
  const [bitcoinRate, setBitcoinRate] = useState<any>(null);
  const [editingRate, setEditingRate] = useState<any>(null);
  const [newRate, setNewRate] = useState({
    brand: "",
    country: "",
    rate: "",
  });
  const [newBtcRate, setNewBtcRate] = useState("");

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      navigate("/dashboard");
    }
  }, [isAdmin, roleLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchRates();
    }
  }, [isAdmin]);

  const fetchRates = async () => {
    const { data: gcRates } = await supabase
      .from("gift_card_rates")
      .select("*")
      .order("brand");

    const { data: btcRate } = await supabase
      .from("bitcoin_rates")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (gcRates) setGiftCardRates(gcRates);
    if (btcRate) setBitcoinRate(btcRate);
  };

  const updateGiftCardRate = async () => {
    if (!editingRate) return;

    const { error } = await supabase
      .from("gift_card_rates")
      .update({
        rate: parseFloat(editingRate.rate),
        is_active: editingRate.is_active,
      })
      .eq("id", editingRate.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update rate",
        variant: "destructive",
      });
    } else {
      toast({ title: "Success", description: "Rate updated" });
      fetchRates();
      setEditingRate(null);
    }
  };

  const addGiftCardRate = async () => {
    const { error } = await supabase.from("gift_card_rates").insert({
      brand: newRate.brand,
      country: newRate.country,
      rate: parseFloat(newRate.rate),
      is_active: true,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add rate",
        variant: "destructive",
      });
    } else {
      toast({ title: "Success", description: "Rate added" });
      fetchRates();
      setNewRate({ brand: "", country: "", rate: "" });
    }
  };

  const updateBitcoinRate = async () => {
    const { error } = await supabase.from("bitcoin_rates").insert({
      rate: parseFloat(newBtcRate),
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update Bitcoin rate",
        variant: "destructive",
      });
    } else {
      toast({ title: "Success", description: "Bitcoin rate updated" });
      fetchRates();
      setNewBtcRate("");
    }
  };

  const deleteRate = async (id: string) => {
    const { error } = await supabase
      .from("gift_card_rates")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete rate",
        variant: "destructive",
      });
    } else {
      toast({ title: "Success", description: "Rate deleted" });
      fetchRates();
    }
  };

  if (roleLoading) return <div>Loading...</div>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        <h1 className="text-4xl font-bold mb-8">Manage Exchange Rates</h1>

        {/* Bitcoin Rate */}
        <Card className="p-6 mb-8 neu">
          <h2 className="text-2xl font-bold mb-4">Bitcoin Rate</h2>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label>Current Rate: ₦{bitcoinRate?.rate.toLocaleString()}</Label>
              <Input
                type="number"
                placeholder="New rate"
                value={newBtcRate}
                onChange={(e) => setNewBtcRate(e.target.value)}
                className="mt-2 neu-inset"
              />
            </div>
            <Button onClick={updateBitcoinRate} className="neu neu-hover">
              Update BTC Rate
            </Button>
          </div>
        </Card>

        {/* Gift Card Rates */}
        <Card className="p-6 neu">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Gift Card Rates</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="neu neu-hover">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Rate
                </Button>
              </DialogTrigger>
              <DialogContent className="neu">
                <DialogHeader>
                  <DialogTitle>Add New Gift Card Rate</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Brand</Label>
                    <Input
                      value={newRate.brand}
                      onChange={(e) =>
                        setNewRate({ ...newRate, brand: e.target.value })
                      }
                      className="neu-inset"
                    />
                  </div>
                  <div>
                    <Label>Country</Label>
                    <Input
                      value={newRate.country}
                      onChange={(e) =>
                        setNewRate({ ...newRate, country: e.target.value })
                      }
                      className="neu-inset"
                    />
                  </div>
                  <div>
                    <Label>Rate (₦ per $1)</Label>
                    <Input
                      type="number"
                      value={newRate.rate}
                      onChange={(e) =>
                        setNewRate({ ...newRate, rate: e.target.value })
                      }
                      className="neu-inset"
                    />
                  </div>
                  <Button onClick={addGiftCardRate} className="w-full neu neu-hover">
                    Add Rate
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-lg overflow-hidden neu-inset">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Brand</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {giftCardRates.map((rate) => (
                  <TableRow key={rate.id}>
                    <TableCell>{rate.brand}</TableCell>
                    <TableCell>{rate.country}</TableCell>
                    <TableCell>₦{rate.rate}</TableCell>
                    <TableCell>
                      {rate.is_active ? "Active" : "Inactive"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingRate(rate)}
                              className="neu"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="neu">
                            <DialogHeader>
                              <DialogTitle>Edit Rate</DialogTitle>
                            </DialogHeader>
                            {editingRate && (
                              <div className="space-y-4">
                                <div>
                                  <Label>Rate (₦ per $1)</Label>
                                  <Input
                                    type="number"
                                    value={editingRate.rate}
                                    onChange={(e) =>
                                      setEditingRate({
                                        ...editingRate,
                                        rate: e.target.value,
                                      })
                                    }
                                    className="neu-inset"
                                  />
                                </div>
                                <Button
                                  onClick={updateGiftCardRate}
                                  className="w-full neu neu-hover"
                                >
                                  Update
                                </Button>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteRate(rate.id)}
                          className="neu"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ManageRates;
