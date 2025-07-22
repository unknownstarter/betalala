-- user_profiles 테이블에 어드민 정책 추가

-- 1. user_profiles 테이블에 임시 어드민 정책 생성
CREATE POLICY "temp_admin_all_access" ON user_profiles
    FOR ALL USING (
        auth.role() = 'service_role' OR 
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.user_id = auth.uid() AND up.role = 'admin'
        )
    );

-- 2. daily_tests 테이블에도 정책 추가 (혹시 빠졌다면)
CREATE POLICY "temp_admin_all_access" ON daily_tests
    FOR ALL USING (
        auth.role() = 'service_role' OR 
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM user_profiles up 
            WHERE up.user_id = auth.uid() AND up.role = 'admin'
        )
    );

-- 3. 모든 정책 확인
SELECT 
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename IN ('user_profiles', 'core_tests', 'daily_tests')
ORDER BY tablename, policyname; 