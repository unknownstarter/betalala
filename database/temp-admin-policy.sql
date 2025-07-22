-- 임시 어드민 정책 (간단한 버전)

-- 1. 기존 정책 모두 삭제
DROP POLICY IF EXISTS "Admin can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admin can view all core tests" ON core_tests;
DROP POLICY IF EXISTS "Admin can view all daily tests" ON daily_tests;

-- 2. 간단한 어드민 정책 생성 (service_role 또는 어드민 역할 허용)
CREATE POLICY "temp_admin_all_access" ON user_profiles
    FOR ALL USING (
        auth.role() = 'service_role' OR 
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.user_id = auth.uid() AND up.role = 'admin'
        )
    );

CREATE POLICY "temp_admin_all_access" ON core_tests
    FOR ALL USING (
        auth.role() = 'service_role' OR 
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.user_id = auth.uid() AND up.role = 'admin'
        )
    );

CREATE POLICY "temp_admin_all_access" ON daily_tests
    FOR ALL USING (
        auth.role() = 'service_role' OR 
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.user_id = auth.uid() AND up.role = 'admin'
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