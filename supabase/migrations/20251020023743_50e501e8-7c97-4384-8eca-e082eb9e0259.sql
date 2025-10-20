-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
  kyc_document_url TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wallets table for Naira balances
CREATE TABLE public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  balance DECIMAL(15, 2) DEFAULT 0.00,
  currency TEXT DEFAULT 'NGN',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, currency)
);

-- Create gift card rates table
CREATE TABLE public.gift_card_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand TEXT NOT NULL,
  country TEXT NOT NULL,
  rate DECIMAL(10, 2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(brand, country)
);

-- Create bitcoin rate table
CREATE TABLE public.bitcoin_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rate DECIMAL(15, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create gift card trades table
CREATE TABLE public.gift_card_trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  brand TEXT NOT NULL,
  country TEXT NOT NULL,
  card_value DECIMAL(10, 2) NOT NULL,
  rate DECIMAL(10, 2) NOT NULL,
  payout_amount DECIMAL(15, 2) NOT NULL,
  image_url TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verifying', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bitcoin trades table
CREATE TABLE public.bitcoin_trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  btc_amount DECIMAL(18, 8) NOT NULL,
  btc_address TEXT NOT NULL,
  rate DECIMAL(15, 2) NOT NULL,
  payout_amount DECIMAL(15, 2) NOT NULL,
  tx_hash TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirming', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'trade_credit', 'trade_debit')),
  amount DECIMAL(15, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  reference TEXT UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_card_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bitcoin_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_card_trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bitcoin_trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for wallets
CREATE POLICY "Users can view their own wallet" ON public.wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own wallet" ON public.wallets FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for gift card rates (public read)
CREATE POLICY "Anyone can view active gift card rates" ON public.gift_card_rates FOR SELECT USING (is_active = true);

-- RLS Policies for bitcoin rates (public read)
CREATE POLICY "Anyone can view bitcoin rates" ON public.bitcoin_rates FOR SELECT USING (true);

-- RLS Policies for gift card trades
CREATE POLICY "Users can view their own gift card trades" ON public.gift_card_trades FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own gift card trades" ON public.gift_card_trades FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for bitcoin trades
CREATE POLICY "Users can view their own bitcoin trades" ON public.bitcoin_trades FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own bitcoin trades" ON public.bitcoin_trades FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for transactions
CREATE POLICY "Users can view their own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  
  INSERT INTO public.wallets (user_id, balance, currency)
  VALUES (NEW.id, 0.00, 'NGN');
  
  RETURN NEW;
END;
$$;

-- Trigger to create profile and wallet on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON public.wallets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_gift_card_rates_updated_at BEFORE UPDATE ON public.gift_card_rates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_gift_card_trades_updated_at BEFORE UPDATE ON public.gift_card_trades FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bitcoin_trades_updated_at BEFORE UPDATE ON public.bitcoin_trades FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample gift card rates
INSERT INTO public.gift_card_rates (brand, country, rate) VALUES
('Amazon', 'US', 920.00),
('Amazon', 'UK', 1050.00),
('Steam', 'US', 880.00),
('Steam', 'UK', 950.00),
('Apple iTunes', 'US', 850.00),
('Apple iTunes', 'UK', 920.00),
('Google Play', 'US', 840.00),
('Google Play', 'UK', 900.00),
('eBay', 'US', 800.00),
('Walmart', 'US', 780.00),
('Sephora', 'US', 820.00),
('Nike', 'US', 810.00),
('Xbox', 'US', 860.00),
('PlayStation', 'US', 870.00),
('Visa', 'US', 900.00),
('Mastercard', 'US', 900.00),
('American Express', 'US', 890.00),
('Target', 'US', 790.00),
('Best Buy', 'US', 800.00),
('Nordstrom', 'US', 830.00);

-- Insert current bitcoin rate
INSERT INTO public.bitcoin_rates (rate) VALUES (45200000.00);