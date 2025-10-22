import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import { useUserRole } from "@/hooks/useUserRole";
import { MessageSquare, Mail, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  admin_response: string | null;
  created_at: string;
  user_id: string | null;
}

const ManageMessages = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      navigate("/dashboard");
    }
  }, [isAdmin, roleLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchMessages();
    }
  }, [isAdmin]);

  const fetchMessages = async () => {
    try {
      const { data } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        setMessages(data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (messageId: string, status: string, response?: string) => {
    try {
      const updateData: any = { status };
      if (response !== undefined) {
        updateData.admin_response = response;
      }

      const { error } = await supabase
        .from("contact_messages")
        .update(updateData)
        .eq("id", messageId);

      if (error) throw error;

      toast({ title: "Success", description: "Message updated successfully" });
      fetchMessages();
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
        <h1 className="text-4xl font-bold mb-8 animate-fade-in">Manage Messages</h1>

        <div className="space-y-6">
          {messages.map((msg) => (
            <Card key={msg.id} className="p-6 neu neu-hover animate-fade-up">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center neu">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{msg.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        {msg.email}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Message</label>
                      <p className="p-3 bg-muted/50 rounded text-sm">{msg.message}</p>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {new Date(msg.created_at).toLocaleString()}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        msg.status === 'responded' ? 'bg-success/20 text-success' :
                        msg.status === 'read' ? 'bg-primary/20 text-primary' :
                        'bg-warning/20 text-warning'
                      }`}>
                        {msg.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-4">Admin Response</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">Status</label>
                      <Select 
                        value={msg.status}
                        onValueChange={(value) => updateMessageStatus(msg.id, value)}
                      >
                        <SelectTrigger className="neu">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-background z-50">
                          <SelectItem value="unread">Unread</SelectItem>
                          <SelectItem value="read">Read</SelectItem>
                          <SelectItem value="responded">Responded</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">Response</label>
                      <Textarea
                        placeholder="Type your response here..."
                        defaultValue={msg.admin_response || ""}
                        className="neu-inset min-h-[150px]"
                        id={`response-${msg.id}`}
                      />
                      <Button
                        className="mt-3 w-full"
                        onClick={() => {
                          const textarea = document.getElementById(`response-${msg.id}`) as HTMLTextAreaElement;
                          updateMessageStatus(msg.id, "responded", textarea.value);
                        }}
                      >
                        Save Response
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {messages.length === 0 && (
            <Card className="p-8 text-center neu">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No messages found</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageMessages;