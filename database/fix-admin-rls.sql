-- 어드민 접근을 위한 RLS 정책 수정

-- 1. 기존 RLS 정책 삭제
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON user_profiles;

DROP POLICY IF EXISTS "Users can view own core tests" ON core_tests;
DROP POLICY IF EXISTS "Users can insert own core tests" ON core_tests;
DROP POLICY IF EXISTS "Users can update own core tests" ON core_tests;
DROP POLICY IF EXISTS "Users can delete own core tests" ON core_tests;

DROP POLICY IF EXISTS "Users can view own daily tests" ON daily_tests;
DROP POLICY IF EXISTS "Users can insert own daily tests" ON daily_tests;
DROP POLICY IF EXISTS "Users can update own daily tests" ON daily_tests;
DROP POLICY IF EXISTS "Users can delete own daily tests" ON daily_tests;

-- 2. 어드민 접근을 허용하는 새로운 RLS 정책 생성

-- user_profiles 테이블
CREATE POLICY "Admin can view all profiles" ON user_profiles
    FOR ALL USING (
        auth.role() = 'service_role' OR 
        (auth.uid() = user_id) OR
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- core_tests 테이블
CREATE POLICY "Admin can view all core tests" ON core_tests
    FOR ALL USING (
        auth.role() = 'service_role' OR 
        (auth.uid() = user_id) OR
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- daily_tests 테이블
CREATE POLICY "Admin can view all daily tests" ON daily_tests
    FOR ALL USING (
        auth.role() = 'service_role' OR 
        (auth.uid() = user_id) OR
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- 3. 정책 확인
SELECT 
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename IN ('user_profiles', 'core_tests', 'daily_tests')
ORDER BY tablename, policyname; 