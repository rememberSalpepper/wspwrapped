-- Tabla para almacenar suscripciones de usuarios
-- Ejecuta este SQL en tu Supabase SQL Editor

CREATE TABLE IF NOT EXISTS user_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider TEXT NOT NULL CHECK (provider IN ('paypal', 'mercadopago', 'stripe')),
    status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'pending')),
    plan TEXT NOT NULL CHECK (plan IN ('pro-month', 'pro-annual')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Índice para búsqueda rápida por user_id
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);

-- Índice para búsqueda rápida por status
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);

-- Habilitar Row Level Security (RLS)
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver solo su propia suscripción
CREATE POLICY "Users can view own subscription" 
ON user_subscriptions 
FOR SELECT 
USING (auth.uid() = user_id);

-- Política: Solo el servicio (backend) puede insertar/actualizar
CREATE POLICY "Service role can manage subscriptions" 
ON user_subscriptions 
FOR ALL 
USING (auth.role() = 'service_role');

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at
CREATE TRIGGER update_user_subscriptions_updated_at 
BEFORE UPDATE ON user_subscriptions 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comentarios para documentación
COMMENT ON TABLE user_subscriptions IS 'Almacena el estado de suscripciones de usuarios para PayPal, MercadoPago, Stripe, etc.';
COMMENT ON COLUMN user_subscriptions.user_id IS 'ID del usuario de Supabase Auth';
COMMENT ON COLUMN user_subscriptions.provider IS 'Proveedor de pago: paypal, mercadopago, stripe';
COMMENT ON COLUMN user_subscriptions.status IS 'Estado de la suscripción: active, canceled, past_due, pending';
COMMENT ON COLUMN user_subscriptions.plan IS 'Plan contratado: pro-month, pro-annual';
