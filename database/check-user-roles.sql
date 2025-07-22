-- 사용자들의 role 값 확인

-- 1. user_profiles 테이블의 모든 사용자와 role 확인
SELECT 
    user_id,
    email,
    role,
    created_at,
    updated_at
FROM user_profiles
ORDER BY created_at DESC;

-- 2. role별 사용자 수 집계
SELECT 
    role,
    COUNT(*) as user_count
FROM user_profiles
GROUP BY role;

-- 3. 어드민 사용자만 확인
SELECT 
    user_id,
    email,
    role
FROM user_profiles
WHERE role = 'admin';

-- 4. 일반 사용자만 확인
SELECT 
    user_id,
    email,
    role
FROM user_profiles
WHERE role = 'user'; 