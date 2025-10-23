-- Script tạo Super Admin và Admin users
-- Chạy: psql -h localhost -p 5432 -U p2a_user -d p2a_core -f create-admin-users.sql

-- Tạo enum type nếu chưa có
DO $$ BEGIN
    CREATE TYPE users_role_enum AS ENUM (
        'super_admin',
        'admin', 
        'university',
        'company',
        'student',
        'alumni',
        'researcher',
        'startup'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Tạo bảng users nếu chưa có
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role users_role_enum DEFAULT 'student',
    is_active BOOLEAN DEFAULT true,
    is_email_verified BOOLEAN DEFAULT false,
    email_verified_at TIMESTAMPTZ NULL,
    last_login_at TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng user_profiles nếu chưa có
CREATE TABLE IF NOT EXISTS user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT NULL,
    phone_number VARCHAR(50) NULL,
    country VARCHAR(100) NULL,
    city VARCHAR(100) NULL,
    bio TEXT NULL,
    date_of_birth DATE NULL,
    gender VARCHAR(10) NULL,
    linkedin_url TEXT NULL,
    website_url TEXT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Tạo Super Admin user
INSERT INTO users (
    email, 
    password_hash, 
    role, 
    is_active, 
    is_email_verified, 
    email_verified_at
) VALUES (
    'superadmin@p2a-asean.org',
    '$2b$12$3D2WHDMtXQ3krncXm0ciyewUIVDv/JPDpl9A9awp6IN23l/keU/SO', -- SuperAdmin@2025!
    'super_admin',
    true,
    true,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- Tạo Admin user
INSERT INTO users (
    email, 
    password_hash, 
    role, 
    is_active, 
    is_email_verified, 
    email_verified_at
) VALUES (
    'admin@p2a-asean.org',
    '$2b$12$3FPVTN4XLsdXNYzRCDHOc.rv7Nd8ydS/oa1skOY369NBLWwmDUWJu', -- Admin@2025!
    'admin',
    true,
    true,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- Tạo profiles cho Super Admin
INSERT INTO user_profiles (
    user_id,
    full_name,
    phone_number,
    country,
    city,
    bio,
    date_of_birth,
    gender,
    linkedin_url,
    website_url
) 
SELECT 
    u.id,
    'Super Administrator',
    '+84-xxx-xxx-xxxx',
    'ASEAN',
    'Regional',
    'Super Administrator của P2A ASEAN Platform',
    '1990-01-01'::date,
    'other',
    'https://linkedin.com/in/p2a-super-admin',
    'https://p2a-asean.org'
FROM users u 
WHERE u.email = 'superadmin@p2a-asean.org'
ON CONFLICT (user_id) DO NOTHING;

-- Tạo profiles cho Admin
INSERT INTO user_profiles (
    user_id,
    full_name,
    phone_number,
    country,
    city,
    bio,
    date_of_birth,
    gender,
    linkedin_url,
    website_url
) 
SELECT 
    u.id,
    'System Administrator',
    '+84-xxx-xxx-xxxx',
    'ASEAN',
    'Regional',
    'System Administrator của P2A ASEAN Platform',
    '1990-01-01'::date,
    'other',
    'https://linkedin.com/in/p2a-admin',
    'https://p2a-asean.org'
FROM users u 
WHERE u.email = 'admin@p2a-asean.org'
ON CONFLICT (user_id) DO NOTHING;

-- Hiển thị kết quả
SELECT 
    u.email,
    u.role,
    u.is_active,
    u.is_email_verified,
    up.full_name
FROM users u
LEFT JOIN user_profiles up ON u.id = up.user_id
WHERE u.role IN ('super_admin', 'admin')
ORDER BY u.role;
