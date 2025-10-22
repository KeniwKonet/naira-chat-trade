import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Gift, Bitcoin, Wallet, Shield, Zap, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import fintechHero from "@/assets/fintech-hero.jpg";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: `url(${fintechHero})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-fade-up">
              Trade Gift Cards & Bitcoin for Naira
            </h1>
            <p className="text-xl text-muted-foreground animate-fade-up" style={{ animationDelay: '0.2s' }}>
              Fast, secure, and reliable trading platform. Get instant Naira payments for your digital assets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: '0.4s' }}>
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-to-r from-secondary to-accent hover:scale-105 transition-transform text-lg px-8 neu">
                  Start Trading Now
                </Button>
              </Link>
              <Link to="/rates">
                <Button size="lg" variant="outline" className="text-lg px-8 neu neu-hover">
                  View Current Rates
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Current Rates Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate-fade-up">
            Today's Rates
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="p-6 text-center neu neu-hover animate-scale-in">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-warning to-accent flex items-center justify-center neu animate-bounce-subtle">
                <Bitcoin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Bitcoin</h3>
              <p className="text-3xl font-bold text-warning mb-2">₦45,200,000</p>
              <p className="text-sm text-muted-foreground">per BTC</p>
            </Card>
            
            <Card className="p-6 text-center neu neu-hover animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-secondary to-primary flex items-center justify-center neu animate-bounce-subtle">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Amazon Card</h3>
              <p className="text-3xl font-bold text-secondary mb-2">₦920</p>
              <p className="text-sm text-muted-foreground">per $1</p>
            </Card>
            
            <Card className="p-6 text-center neu neu-hover animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center neu animate-bounce-subtle">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Steam Card</h3>
              <p className="text-3xl font-bold text-primary mb-2">₦880</p>
              <p className="text-sm text-muted-foreground">per $1</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate-fade-up">
            Why Choose Horja Smith Exchange?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center space-y-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 mx-auto rounded-full bg-success/10 flex items-center justify-center neu">
                <Zap className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold">Instant Payments</h3>
              <p className="text-muted-foreground">
                Get your Naira instantly credited to your wallet after trade verification
              </p>
            </div>
            
            <div className="text-center space-y-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center neu">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Secure Trading</h3>
              <p className="text-muted-foreground">
                KYC verification and encrypted transactions ensure your safety
              </p>
            </div>
            
            <div className="text-center space-y-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <div className="w-16 h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center neu">
                <MessageCircle className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">24/7 Support</h3>
              <p className="text-muted-foreground">
                AI chatbot and live support always available to help you
              </p>
            </div>
            
            <div className="text-center space-y-4 animate-fade-up" style={{ animationDelay: '0.4s' }}>
              <div className="w-16 h-16 mx-auto rounded-full bg-secondary/10 flex items-center justify-center neu">
                <Wallet className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold">Naira Wallet</h3>
              <p className="text-muted-foreground">
                Manage your funds easily with deposits and withdrawals
              </p>
            </div>
            
            <div className="text-center space-y-4 animate-fade-up" style={{ animationDelay: '0.5s' }}>
              <div className="w-16 h-16 mx-auto rounded-full bg-warning/10 flex items-center justify-center neu">
                <Gift className="w-8 h-8 text-warning" />
              </div>
              <h3 className="text-xl font-semibold">Multiple Gift Cards</h3>
              <p className="text-muted-foreground">
                Trade Amazon, Steam, Apple, iTunes, and many more
              </p>
            </div>
            
            <div className="text-center space-y-4 animate-fade-up" style={{ animationDelay: '0.6s' }}>
              <div className="w-16 h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center neu">
                <Bitcoin className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Bitcoin Trading</h3>
              <p className="text-muted-foreground">
                Sell BTC at competitive rates with automatic confirmation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-secondary via-primary to-accent relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="container mx-auto text-center space-y-6 relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white animate-fade-up">
            Ready to Start Trading?
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Join thousands of satisfied traders. Create your free account and start trading today.
          </p>
          <Link to="/auth">
            <Button size="lg" className="text-lg px-8 bg-white text-primary hover:scale-105 transition-transform neu animate-fade-up" style={{ animationDelay: '0.4s' }}>
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-muted/30">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            © 2025 Horja Smith Exchange. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
