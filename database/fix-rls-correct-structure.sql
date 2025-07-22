-- 실제 테이블 구조에 맞는 RLS 정책 설정

-- 1. 기존 정책 삭제
DROP POLICY IF EXISTS "core_tests_policy" ON core_tests;
DROP POLICY IF EXISTS "daily_tests_policy" ON daily_tests;
DROP POLICY IF EXISTS "user_profiles_policy" ON user_profiles;
DROP POLICY IF EXISTS "storage_policy" ON storage.objects;

-- 2. 새로운 정책 생성 (실제 컬럼에 맞춤)
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

-- 3. Storage 정책
CREATE POLICY "storage_policy" ON storage.objects
    FOR ALL USING (
        bucket_id = 'test-uploads' AND 
        (auth.role() = 'authenticated' OR auth.role() = 'service_role')
    )
    WITH CHECK (
        bucket_id = 'test-uploads' AND 
        (auth.role() = 'authenticated' OR auth.role() = 'service_role')
    );

-- 4. 테스트용 INSERT 쿼리 (실제 컬럼에 맞춤)
-- 먼저 테이블 구조를 확인한 후 적절한 컬럼만 사용
INSERT INTO core_tests (user_id, step, file_url)
VALUES (
    '00000000-0000-0000-0000-000000000000', -- 테스트용 UUID
    'signup',
    'test/path.jpg'
);

-- 5. 테스트 후 삭제
DELETE FROM core_tests WHERE user_id = '00000000-0000-0000-0000-000000000000'; 