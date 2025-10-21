-- Create storage bucket for gift card images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gift-cards', 'gift-cards', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for gift-cards bucket
CREATE POLICY "Users can upload their own gift card images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'gift-cards' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own gift card images"
ON storage.objects FOR SELECT
USING (bucket_id = 'gift-cards' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Public can view gift card images"
ON storage.objects FOR SELECT
USING (bucket_id = 'gift-cards');