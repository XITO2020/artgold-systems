-- migrations/add_bonus_slots.sql
/*
  # Add Bonus Slots System

  1. Changes
    - Add bonus slots tracking to users
    - Create bonus slots table
    - Add relationships between users, artworks, and bonus slots

  2. Features
    - Users can earn bonus slots after 12 artworks and 4000 TABZ/27000 AGT
    - Bonus slots can be transferred or sold
    - Maximum 7 bonus slots per user
*/

-- Add bonus slots fields to users
ALTER TABLE users ADD COLUMN bonus_slots INTEGER NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN max_artworks INTEGER NOT NULL DEFAULT 12;
ALTER TABLE users ADD COLUMN bonus_slot_tokens INTEGER NOT NULL DEFAULT 0;

-- Create bonus slots table
CREATE TABLE bonus_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  is_used BOOLEAN NOT NULL DEFAULT false,
  artwork_id UUID REFERENCES artworks(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  can_transfer BOOLEAN NOT NULL DEFAULT true,
  price DECIMAL(10,2),
  
  CONSTRAINT max_bonus_slots CHECK (
    (SELECT COUNT(*) FROM bonus_slots WHERE user_id = user_id) <= 7
  )
);

-- Add indexes
CREATE INDEX idx_bonus_slots_user ON bonus_slots(user_id);
CREATE INDEX idx_bonus_slots_artwork ON bonus_slots(artwork_id);

-- Enable RLS
ALTER TABLE bonus_slots ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Users can view their own bonus slots"
  ON bonus_slots FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own bonus slots"
  ON bonus_slots FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);
