-- RLS 완전 비활성화 (테스트용)

-- 1. 모든 테이블의 RLS 비활성화
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE core_tests DISABLE ROW LEVEL SECURITY;
ALTER TABLE daily_tests DISABLE ROW LEVEL SECURITY;

-- 2. RLS 상태 확인
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename IN ('user_profiles', 'core_tests', 'daily_tests');

-- 3. 정책 삭제 (선택사항)
-- DROP POLICY IF EXISTS "temp_admin_all_access" ON user_profiles;
-- DROP POLICY IF EXISTS "temp_admin_all_access" ON core_tests;
-- DROP POLICY IF EXISTS "temp_admin_all_access" ON daily_tests; 