import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Zap, Clock, Gift, Bitcoin, TrendingUp, Sparkles, CheckCircle } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

const Landing = () => {
  const features = [
    { icon: Shield, title: "Secure Trading", description: "Bank-level security with end-to-end encryption" },
    { icon: Zap, title: "Instant Processing", description: "Lightning-fast transaction confirmations in seconds" },
    { icon: Clock, title: "24/7 Support", description: "Round-the-clock customer assistance & live chat" },
    { icon: TrendingUp, title: "Best Rates", description: "Most competitive rates in the market" },
  ];

  const benefits = [
    "Trade 50+ gift card brands",
    "Convert BTC to Naira instantly",
    "Zero hidden fees",
    "Verified KYC in minutes",
    "Direct bank transfers",
    "Real-time rate updates"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-up">
              <div className="flex items-center gap-2 mb-4 animate-bounce-subtle">
                <Sparkles className="w-6 h-6 text-accent" />
                <span className="text-accent font-semibold">Trusted by 10,000+ Traders</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Trade <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Gift Cards</span> & <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Bitcoin</span> Instantly
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                Nigeria's #1 platform for converting gift cards and Bitcoin to cash. Get the best rates, instant payments, and 24/7 support.
              </p>
              
              {/* Benefits list */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 animate-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-sm md:text-base">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <Link to="/auth">
                  <Button size="lg" className="bg-gradient-to-r from-primary via-secondary to-accent hover:scale-105 transition-all neu text-lg px-8 py-6 shadow-lg hover:shadow-2xl">
                    Start Trading Now <ArrowRight className="ml-2 animate-bounce-subtle" />
                  </Button>
                </Link>
                <Link to="/rates">
                  <Button size="lg" variant="outline" className="neu neu-hover text-lg px-8 py-6">
                    View Live Rates
                  </Button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-6 mt-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>100% Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-accent" />
                  <span>Instant Payout</span>
                </div>
              </div>
            </div>
            
            <div className="animate-scale-in relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary via-secondary to-accent rounded-2xl blur-2xl opacity-20 animate-pulse-glow"></div>
              <img 
                src={heroImage} 
                alt="Crypto Trading Platform" 
                className="rounded-2xl neu relative z-10 shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-muted/30 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Traders Choose Us</h2>
            <p className="text-xl text-muted-foreground">Experience the future of crypto trading</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-8 neu neu-hover animate-fade-up bg-gradient-to-br from-card to-muted/20 border-0 group" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 neu group-hover:scale-110 transition-transform">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Sections */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-12 bg-gradient-to-br from-secondary via-success to-secondary/80 neu neu-hover animate-scale-in text-white relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mb-6 neu backdrop-blur-sm">
                  <Gift className="w-10 h-10" />
                </div>
                <h3 className="text-4xl font-bold mb-4">Trade Gift Cards</h3>
                <p className="mb-6 text-lg opacity-95 leading-relaxed">Convert your unused gift cards to cash instantly. Support for 50+ popular brands including Amazon, iTunes, Steam, and more.</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Instant verification</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Best market rates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Same-day payout</span>
                  </li>
                </ul>
                <Link to="/trade/giftcard">
                  <Button size="lg" className="bg-white text-secondary hover:scale-105 transition-all shadow-lg">
                    Trade Gift Cards <ArrowRight className="ml-2" />
                  </Button>
                </Link>
              </div>
            </Card>

            <Card className="p-12 bg-gradient-to-br from-accent via-warning to-accent/80 neu neu-hover animate-scale-in text-white relative overflow-hidden group" style={{ animationDelay: '0.2s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mb-6 neu backdrop-blur-sm">
                  <Bitcoin className="w-10 h-10" />
                </div>
                <h3 className="text-4xl font-bold mb-4">Trade Bitcoin</h3>
                <p className="mb-6 text-lg opacity-95 leading-relaxed">Sell your Bitcoin for Naira at the best rates. Fast, secure, and reliable with instant bank transfers.</p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Competitive rates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Secure transactions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Instant settlement</span>
                  </li>
                </ul>
                <Link to="/trade/bitcoin">
                  <Button size="lg" className="bg-white text-accent hover:scale-105 transition-all shadow-lg">
                    Trade Bitcoin <ArrowRight className="ml-2" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-4 bg-gradient-to-br from-primary via-secondary to-accent text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-3xl mx-auto animate-fade-up">
            <Sparkles className="w-16 h-16 mx-auto mb-6 animate-bounce-subtle" />
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">Ready to Start Trading?</h2>
            <p className="text-2xl mb-12 opacity-95 leading-relaxed">Join 10,000+ satisfied traders and experience the fastest way to convert your assets to cash</p>
            <Link to="/auth">
              <Button size="lg" className="bg-white text-primary hover:scale-110 transition-all text-xl px-12 py-7 shadow-2xl hover:shadow-white/50 neu">
                Create Free Account <ArrowRight className="ml-3 animate-bounce-subtle" />
              </Button>
            </Link>
            <p className="mt-6 text-sm opacity-75">No credit card required • Free forever • Start trading in minutes</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-muted/30 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 CryptoTrade. All rights reserved. Built with ❤️ in Nigeria</p>
          <div className="flex justify-center gap-6 mt-4">
            <Link to="/rates" className="hover:text-primary transition-colors">Rates</Link>
            <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
            <Link to="/auth" className="hover:text-primary transition-colors">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
