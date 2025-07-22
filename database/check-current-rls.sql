-- 현재 RLS 정책 상태 확인

-- 1. RLS 활성화 상태 확인
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename IN ('user_profiles', 'core_tests', 'daily_tests');

-- 2. user_profiles 테이블의 RLS 정책 확인
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- 3. core_tests 테이블의 RLS 정책 확인
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'core_tests';

-- 4. daily_tests 테이블의 RLS 정책 확인
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'daily_tests';

-- 5. 현재 인증된 사용자 정보 확인
SELECT 
    auth.uid() as current_user_id,
    auth.role() as current_role,
    auth.email() as current_email; 