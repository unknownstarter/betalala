-- 서비스 역할도 허용하는 RLS 정책 설정

-- 1. 기존 정책 삭제
DROP POLICY IF EXISTS "Enable all for core_tests" ON core_tests;
DROP POLICY IF EXISTS "Enable all for daily_tests" ON daily_tests;
DROP POLICY IF EXISTS "Enable all for user_profiles" ON user_profiles;
DROP POLICY IF EXISTS "Enable storage for authenticated users" ON storage.objects;

-- 2. 새로운 정책 생성 (서비스 역할 포함)
-- core_tests 테이블
CREATE POLICY "core_tests_policy" ON core_tests
    FOR ALL USING (
        auth.uid() = user_id OR 
        auth.role() = 'service_role'
    )
    WITH CHECK (
        auth.uid() = user_id OR 
        auth.role() = 'service_role'
    );

-- daily_tests 테이블
CREATE POLICY "daily_tests_policy" ON daily_tests
    FOR ALL USING (
        auth.uid() = user_id OR 
        auth.role() = 'service_role'
    )
    WITH CHECK (
        auth.uid() = user_id OR 
        auth.role() = 'service_role'
    );

-- user_profiles 테이블
CREATE POLICY "user_profiles_policy" ON user_profiles
    FOR ALL USING (
        auth.uid() = user_id OR 
        auth.role() = 'service_role'
    )
    WITH CHECK (
        auth.uid() = user_id OR 
        auth.role() = 'service_role'
    );

-- 3. Storage 정책 (서비스 역할 포함)
CREATE POLICY "storage_policy" ON storage.objects
    FOR ALL USING (
        bucket_id = 'test-uploads' AND 
        (auth.role() = 'authenticated' OR auth.role() = 'service_role')
    )
    WITH CHECK (
        bucket_id = 'test-uploads' AND 
        (auth.role() = 'authenticated' OR auth.role() = 'service_role')
    );

-- 4. 테스트용 INSERT 쿼리 (서비스 역할로 실행)
INSERT INTO core_tests (user_id, step, file_url, status, completed_at)
VALUES (
    '00000000-0000-0000-0000-000000000000', -- 테스트용 UUID
    'signup',
    'test/path.jpg',
    'pending',
    NOW()
);

-- 5. 테스트 후 삭제
DELETE FROM core_tests WHERE user_id = '00000000-0000-0000-0000-000000000000'; 