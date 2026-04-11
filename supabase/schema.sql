-- 121Call Database Schema
-- Run this in Supabase SQL Editor

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- User profiles
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    business_name VARCHAR(200),
    plan VARCHAR(50) DEFAULT 'free',
    monthly_sms_limit INT DEFAULT 200,
    monthly_sms_used INT DEFAULT 0,
    timezone VARCHAR(100) DEFAULT 'America/New_York',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gateway devices (Android phones)
CREATE TABLE gateway_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    phone_number VARCHAR(20) NOT NULL,
    label VARCHAR(100),
    httpsms_phone_id VARCHAR(100),
    last_seen_at TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'active',
    rate_limit_per_min INT DEFAULT 3,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contacts
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    phone VARCHAR(20) NOT NULL,
    name VARCHAR(200),
    email VARCHAR(320),
    tags TEXT[] DEFAULT '{}',
    notes TEXT,
    opted_out BOOLEAN DEFAULT FALSE,
    opted_out_at TIMESTAMPTZ,
    opted_out_source VARCHAR(50),
    lifetime_value DECIMAL(10,2) DEFAULT 0,
    source VARCHAR(50),
    external_id VARCHAR(200),
    last_contacted_at TIMESTAMPTZ,
    confidence VARCHAR(20) DEFAULT 'high',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    UNIQUE (user_id, phone)
);

CREATE INDEX idx_contacts_user_id ON contacts(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_contacts_phone ON contacts(phone);
CREATE INDEX idx_contacts_tags ON contacts USING GIN(tags);
CREATE INDEX idx_contacts_opted_out ON contacts(user_id, opted_out);

-- Campaigns
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    device_id UUID REFERENCES gateway_devices(id),
    name VARCHAR(200) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft',
    ai_personalized BOOLEAN DEFAULT FALSE,
    message_template TEXT NOT NULL,
    scheduled_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    rate_limit_per_min INT DEFAULT 3,
    contact_filter JSONB,
    total_recipients INT DEFAULT 0,
    sent_count INT DEFAULT 0,
    delivered_count INT DEFAULT 0,
    failed_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaign messages
CREATE TABLE campaign_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contacts(id),
    phone VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    ai_generated BOOLEAN DEFAULT FALSE,
    httpsms_message_id VARCHAR(200),
    status VARCHAR(50) DEFAULT 'pending',
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ,
    failure_reason TEXT,
    scheduled_for TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_campaign_messages_campaign ON campaign_messages(campaign_id);
CREATE INDEX idx_campaign_messages_status ON campaign_messages(campaign_id, status);

-- Compliance events (immutable audit log)
CREATE TABLE compliance_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_profiles(id),
    phone VARCHAR(20) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    source VARCHAR(50),
    raw_message TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_compliance_phone ON compliance_events(phone);
CREATE INDEX idx_compliance_user ON compliance_events(user_id);

-- Import jobs
CREATE TABLE import_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    source VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    file_name VARCHAR(300),
    file_size_bytes INT,
    total_rows INT,
    processed_rows INT DEFAULT 0,
    imported_count INT DEFAULT 0,
    skipped_invalid INT DEFAULT 0,
    skipped_duplicate INT DEFAULT 0,
    error_details JSONB,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Messages queue (for worker)
CREATE TABLE messages_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(id),
    target_phone VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    owner_phone VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    scheduled_for TIMESTAMPTZ,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_queue_status ON messages_queue(status, scheduled_for);

-- RLS Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE gateway_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages_queue ENABLE ROW LEVEL SECURITY;

-- User profiles: users can only access their own
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Gateway devices: users can only access their own
CREATE POLICY "Users can view own devices" ON gateway_devices
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own devices" ON gateway_devices
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own devices" ON gateway_devices
    FOR UPDATE USING (auth.uid() = user_id);

-- Contacts: users can only access their own
CREATE POLICY "Users can view own contacts" ON contacts
    FOR SELECT USING (auth.uid() = user_id AND deleted_at IS NULL);

CREATE POLICY "Users can insert own contacts" ON contacts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own contacts" ON contacts
    FOR UPDATE USING (auth.uid() = user_id);

-- Campaigns: users can only access their own
CREATE POLICY "Users can view own campaigns" ON campaigns
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own campaigns" ON campaigns
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own campaigns" ON campaigns
    FOR UPDATE USING (auth.uid() = user_id);

-- Campaign messages: users can only access their own
CREATE POLICY "Users can view own campaign messages" ON campaign_messages
    FOR SELECT USING (
        auth.uid() = (SELECT user_id FROM campaigns WHERE id = campaign_id)
    );

-- Compliance events: users can only view their own
CREATE POLICY "Users can view own compliance" ON compliance_events
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert compliance" ON compliance_events
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Import jobs: users can only access their own
CREATE POLICY "Users can view own imports" ON import_jobs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own imports" ON import_jobs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Messages queue: owner only
CREATE POLICY "Users can view own queue" ON messages_queue
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own queue" ON messages_queue
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, business_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'business_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto-creating profile
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();