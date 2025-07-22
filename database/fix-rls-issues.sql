-- RLS 문제 해결을 위한 단계별 쿼리

-- 1단계: 기존 정책 삭제 (충돌 방지)
DROP POLICY IF EXISTS "Users can view their own core tests" ON core_tests;
DROP POLICY IF EXISTS "Users can insert their own core tests" ON core_tests;
DROP POLICY IF EXISTS "Users can update their own core tests" ON core_tests;
DROP POLICY IF EXISTS "Users can delete their own core tests" ON core_tests;

DROP POLICY IF EXISTS "Users can view their own daily tests" ON daily_tests;
DROP POLICY IF EXISTS "Users can insert their own daily tests" ON daily_tests;
DROP POLICY IF EXISTS "Users can update their own daily tests" ON daily_tests;
DROP POLICY IF EXISTS "Users can delete their own daily tests" ON daily_tests;

DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;

-- Storage 정책도 삭제
DROP POLICY IF EXISTS "Users can upload their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all files" ON storage.objects;

-- 2단계: RLS 활성화 확인
ALTER TABLE core_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 3단계: 새로운 정책 생성 (더 간단한 버전)
-- core_tests 테이블
CREATE POLICY "Enable all for core_tests" ON core_tests
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- daily_tests 테이블
CREATE POLICY "Enable all for daily_tests" ON daily_tests
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- user_profiles 테이블
CREATE POLICY "Enable all for user_profiles" ON user_profiles
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 4단계: Storage 정책 (더 간단한 버전)
CREATE POLICY "Enable storage for authenticated users" ON storage.objects
    FOR ALL USING (
        bucket_id = 'test-uploads' AND 
        auth.role() = 'authenticated'
    )
    WITH CHECK (
        bucket_id = 'test-uploads' AND 
        auth.role() = 'authenticated'
    );

-- 5단계: 테이블 구조 확인 (user_id 컬럼이 있는지)
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('core_tests', 'daily_tests', 'user_profiles')
AND column_name = 'user_id'
ORDER BY table_name; 