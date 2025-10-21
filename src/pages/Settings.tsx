import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { User, CreditCard, Settings as SettingsIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Settings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [bankAccount, setBankAccount] = useState({
    bank_name: "",
    account_number: "",
    account_name: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setUser(user);
    await fetchProfile(user.id);
    await fetchBankAccount(user.id);
    setLoading(false);
  };

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    
    if (data) setProfile(data);
  };

  const fetchBankAccount = async (userId: string) => {
    const { data } = await supabase
      .from("bank_accounts")
      .select("*")
      .eq("user_id", userId)
      .eq("is_default", true)
      .maybeSingle();
    
    if (data) {
      setBankAccount({
        bank_name: data.bank_name,
        account_number: data.account_number,
        account_name: data.account_name,
      });
    }
  };

  const updateProfile = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const saveBankAccount = async () => {
    try {
      const { data: existing } = await supabase
        .from("bank_accounts")
        .select("id")
        .eq("user_id", user.id)
        .eq("is_default", true)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("bank_accounts")
          .update({
            bank_name: bankAccount.bank_name,
            account_number: bankAccount.account_number,
            account_name: bankAccount.account_name,
          })
          .eq("id", existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("bank_accounts")
          .insert({
            user_id: user.id,
            bank_name: bankAccount.bank_name,
            account_number: bankAccount.account_number,
            account_name: bankAccount.account_name,
            is_default: true,
          });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Bank account saved successfully",
      });
    } catch (error) {
      console.error("Error saving bank account:", error);
      toast({
        title: "Error",
        description: "Failed to save bank account",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 pb-20 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        <h1 className="text-4xl font-bold mb-8">Settings</h1>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="neu mb-8">
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="banking" className="gap-2">
              <CreditCard className="w-4 h-4" />
              Banking
            </TabsTrigger>
            <TabsTrigger value="preferences" className="gap-2">
              <SettingsIcon className="w-4 h-4" />
              Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="p-8 neu">
              <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
              <div className="space-y-6">
                <div>
                  <Label>Full Name</Label>
                  <Input
                    value={profile?.full_name || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, full_name: e.target.value })
                    }
                    className="mt-2 neu-inset"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={user?.email || ""}
                    disabled
                    className="mt-2 neu-inset"
                  />
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input
                    value={profile?.phone || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                    className="mt-2 neu-inset"
                  />
                </div>
                <Button onClick={updateProfile} className="neu neu-hover">
                  Update Profile
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="banking">
            <Card className="p-8 neu">
              <h2 className="text-2xl font-bold mb-6">Bank Account Details</h2>
              <div className="space-y-6">
                <div>
                  <Label>Bank Name</Label>
                  <Input
                    value={bankAccount.bank_name}
                    onChange={(e) =>
                      setBankAccount({ ...bankAccount, bank_name: e.target.value })
                    }
                    className="mt-2 neu-inset"
                  />
                </div>
                <div>
                  <Label>Account Number</Label>
                  <Input
                    value={bankAccount.account_number}
                    onChange={(e) =>
                      setBankAccount({
                        ...bankAccount,
                        account_number: e.target.value,
                      })
                    }
                    className="mt-2 neu-inset"
                  />
                </div>
                <div>
                  <Label>Account Name</Label>
                  <Input
                    value={bankAccount.account_name}
                    onChange={(e) =>
                      setBankAccount({
                        ...bankAccount,
                        account_name: e.target.value,
                      })
                    }
                    className="mt-2 neu-inset"
                  />
                </div>
                <Button onClick={saveBankAccount} className="neu neu-hover">
                  Save Bank Account
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card className="p-8 neu">
              <h2 className="text-2xl font-bold mb-6">App Preferences</h2>
              <p className="text-muted-foreground">
                Additional preference settings coming soon...
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
