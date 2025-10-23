import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { Mail, Phone, MapPin, MessageCircle, Clock, Sparkles } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase.from("contact_messages").insert({
        user_id: user?.id || null,
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });

      if (error) throw error;

      toast({
        title: "Message Sent Successfully! ✉️",
        description: "We'll get back to you within 24 hours.",
      });

      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 animate-fade-up">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-accent animate-bounce-subtle" />
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Get In Touch</h1>
            <p className="text-xl text-muted-foreground">
              Have questions? We're here to help 24/7!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card className="p-8 neu neu-hover bg-gradient-to-br from-card to-muted/20 border-0 animate-scale-in">
              <MessageCircle className="w-10 h-10 text-primary mb-4 animate-bounce-subtle" />
              <h2 className="text-3xl font-bold mb-2">Send us a Message</h2>
              <p className="text-muted-foreground mb-6">We typically respond within 2 hours</p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Input
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="neu-inset"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    className="neu-inset"
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                    rows={6}
                    className="neu-inset"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-transform neu text-lg"
                >
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Card>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="p-8 neu neu-hover bg-gradient-to-br from-card to-muted/20 border-0 animate-fade-up group" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center neu group-hover:scale-110 transition-transform">
                    <Mail className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">Email Us</h3>
                    <p className="text-muted-foreground">support@cryptotrade.ng</p>
                    <p className="text-sm text-muted-foreground mt-1">24/7 email support</p>
                  </div>
                </div>
              </Card>

              <Card className="p-8 neu neu-hover bg-gradient-to-br from-card to-muted/20 border-0 animate-fade-up group" style={{ animationDelay: '0.2s' }}>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center neu group-hover:scale-110 transition-transform">
                    <Phone className="w-7 h-7 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1 group-hover:text-accent transition-colors">Call Us</h3>
                    <p className="text-muted-foreground">+234 123 456 7890</p>
                    <p className="text-sm text-muted-foreground mt-1">Mon-Fri 9AM-6PM WAT</p>
                  </div>
                </div>
              </Card>

              <Card className="p-8 neu neu-hover bg-gradient-to-br from-card to-muted/20 border-0 animate-fade-up group" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-success/20 to-success/10 flex items-center justify-center neu group-hover:scale-110 transition-transform">
                    <MapPin className="w-7 h-7 text-success" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1 group-hover:text-success transition-colors">Visit Us</h3>
                    <p className="text-muted-foreground">
                      123 Exchange Street<br />
                      Victoria Island, Lagos<br />
                      Nigeria
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-8 bg-gradient-to-br from-secondary via-success to-secondary/80 neu neu-hover text-white animate-fade-up relative overflow-hidden group" style={{ animationDelay: '0.4s' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <Clock className="w-10 h-10 mb-3 animate-bounce-subtle" />
                  <h3 className="text-2xl font-bold mb-2">24/7 Support</h3>
                  <p className="opacity-95 leading-relaxed">
                    Our AI chatbot is always available to assist you instantly. Live agent support available during business hours.
                  </p>
                </div>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 animate-fade-up" style={{ animationDelay: '0.5s' }}>
            <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 neu neu-hover bg-gradient-to-br from-card to-muted/20 border-0">
                <h3 className="font-bold text-lg mb-2">How long does it take to process trades?</h3>
                <p className="text-muted-foreground">Gift card trades are verified within 5-15 minutes. Bitcoin transactions are processed immediately after blockchain confirmation.</p>
              </Card>
              <Card className="p-6 neu neu-hover bg-gradient-to-br from-card to-muted/20 border-0">
                <h3 className="font-bold text-lg mb-2">What payment methods do you support?</h3>
                <p className="text-muted-foreground">We support direct bank transfers to all Nigerian banks. Payments are instant once your trade is approved.</p>
              </Card>
              <Card className="p-6 neu neu-hover bg-gradient-to-br from-card to-muted/20 border-0">
                <h3 className="font-bold text-lg mb-2">Is KYC verification required?</h3>
                <p className="text-muted-foreground">Yes, KYC is required for security and compliance. The process takes less than 5 minutes to complete.</p>
              </Card>
              <Card className="p-6 neu neu-hover bg-gradient-to-br from-card to-muted/20 border-0">
                <h3 className="font-bold text-lg mb-2">What are your trading hours?</h3>
                <p className="text-muted-foreground">Our platform is available 24/7. Trades are processed round the clock with instant automated verification.</p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
