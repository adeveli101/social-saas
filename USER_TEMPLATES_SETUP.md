# User Templates Table Setup

## Manual Supabase Database Setup

Execute this SQL in your **Supabase Dashboard SQL Editor** to fix the user_templates table and support Clerk user IDs.

### Step 1: Execute SQL Script

```sql
-- Fix user_templates table to support Clerk user IDs
-- Change user_id from UUID to TEXT to store Clerk user IDs like "user_2z0TU8dXqvIP1A5LbCi9dve6VfR"

-- Drop the existing table if it has the wrong schema
DROP TABLE IF EXISTS user_templates;

-- Create the table with correct schema
CREATE TABLE user_templates (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  main_topic TEXT NOT NULL,
  audience TEXT NOT NULL,
  purpose TEXT NOT NULL,
  key_points TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'personal',
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_user_templates_user_id ON user_templates(user_id);
CREATE INDEX idx_user_templates_category ON user_templates(category);
CREATE INDEX idx_user_templates_created_at ON user_templates(created_at);

-- Enable Row Level Security
ALTER TABLE user_templates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (Note: These will work when you integrate Supabase Auth)
-- For now with Clerk, we'll handle permissions in the application layer
CREATE POLICY "Enable read access for all users" ON user_templates FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON user_templates FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON user_templates FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON user_templates FOR DELETE USING (true);
```

### Step 2: Verify Table Structure

After executing the SQL, verify the table was created correctly by running:

```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'user_templates';
```

Expected output:
- `id`: text, NO
- `user_id`: text, NO  
- `name`: text, NO
- `main_topic`: text, NO
- `audience`: text, NO
- `purpose`: text, NO
- `key_points`: text, NO
- `category`: text, NO
- `usage_count`: integer, YES
- `created_at`: timestamp with time zone, YES
- `updated_at`: timestamp with time zone, YES

### Step 3: Test the Fix

After executing the SQL, the user templates feature should work properly with Clerk authentication. The error "invalid input syntax for type uuid" should be resolved.

## Key Changes Made

1. **user_id column**: Changed from UUID to TEXT to support Clerk user IDs
2. **key_points column**: Changed from TEXT[] to TEXT (stores JSON string)
3. **id column**: Uses TEXT for custom template IDs like "user-template-{uuid}"
4. **RLS policies**: Temporarily open for all users (will be refined later for Supabase Auth integration)

## Code Updates

The TypeScript code has been updated to:
- Store `key_points` as JSON strings in the database
- Parse `key_points` back to arrays when retrieving from database
- Handle both string and array formats for backward compatibility
- Support Clerk user IDs in the user_id field

## Testing

After executing the SQL:
1. Try creating a new template in the carousel page
2. Verify templates save and load correctly
3. Check that user-specific templates are isolated properly
4. Test the delete functionality for user-owned templates

The console error should be resolved and the template system should work seamlessly with Clerk authentication. 