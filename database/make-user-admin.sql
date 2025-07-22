-- 특정 사용자를 어드민으로 변경

-- 1. 현재 사용자 확인
SELECT 
    user_id,
    email,
    role
FROM user_profiles
ORDER BY created_at DESC;

-- 2. 첫 번째 사용자(5@5.com)를 어드민으로 변경
UPDATE user_profiles 
SET 
    role = 'admin',
    updated_at = NOW()
WHERE email = '5@5.com';

-- 3. 변경 결과 확인
SELECT 
    user_id,
    email,
    role,
    updated_at
FROM user_profiles
WHERE email = '5@5.com';

-- 4. 전체 사용자 role 확인
SELECT 
    role,
    COUNT(*) as user_count
FROM user_profiles
GROUP BY role; 