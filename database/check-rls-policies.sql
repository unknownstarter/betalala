-- 현재 RLS 정책 상태 확인 쿼리

-- 1. 테이블별 RLS 활성화 상태 확인
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('core_tests', 'daily_tests', 'user_profiles')
ORDER BY tablename;

-- 2. 현재 설정된 정책들 확인
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('core_tests', 'daily_tests', 'user_profiles')
ORDER BY tablename, cmd;

-- 3. Storage 버킷 정책 확인
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage'
ORDER BY cmd;

-- 4. 현재 사용자 정보 확인 (실행 시점의 auth.uid() 값)
SELECT 
    auth.uid() as current_user_id,
    auth.role() as current_role;

-- 5. test-uploads 버킷 존재 확인
SELECT * FROM storage.buckets WHERE id = 'test-uploads'; 