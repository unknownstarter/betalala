-- RLS 정책 설정 확인

-- 1. 현재 RLS 활성화 상태
SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('core_tests', 'daily_tests', 'user_profiles');

-- 2. 현재 설정된 정책들
SELECT 
    tablename,
    policyname,
    cmd,
    permissive
FROM pg_policies 
WHERE tablename IN ('core_tests', 'daily_tests', 'user_profiles')
ORDER BY tablename, cmd;

-- 3. Storage 정책 확인
SELECT 
    policyname,
    cmd,
    permissive
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';

-- 4. 현재 인증된 사용자 정보 (웹에서 실행 시)
SELECT 
    auth.uid() as current_user_id,
    auth.role() as current_role,
    auth.email() as current_email; 