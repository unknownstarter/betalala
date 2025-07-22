-- Supabase Row Level Security (RLS) 정책 설정
-- 이 쿼리들을 Supabase SQL Editor에서 실행하세요

-- 1. core_tests 테이블 RLS 활성화
ALTER TABLE core_tests ENABLE ROW LEVEL SECURITY;

-- 2. core_tests 테이블 정책 설정
-- 사용자는 자신의 코어 테스트만 조회 가능
CREATE POLICY "Users can view their own core tests" ON core_tests
    FOR SELECT USING (auth.uid() = user_id);

-- 사용자는 자신의 코어 테스트만 생성 가능
CREATE POLICY "Users can insert their own core tests" ON core_tests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 코어 테스트만 수정 가능
CREATE POLICY "Users can update their own core tests" ON core_tests
    FOR UPDATE USING (auth.uid() = user_id);

-- 사용자는 자신의 코어 테스트만 삭제 가능
CREATE POLICY "Users can delete their own core tests" ON core_tests
    FOR DELETE USING (auth.uid() = user_id);

-- 3. daily_tests 테이블 RLS 활성화
ALTER TABLE daily_tests ENABLE ROW LEVEL SECURITY;

-- 4. daily_tests 테이블 정책 설정
-- 사용자는 자신의 데일리 테스트만 조회 가능
CREATE POLICY "Users can view their own daily tests" ON daily_tests
    FOR SELECT USING (auth.uid() = user_id);

-- 사용자는 자신의 데일리 테스트만 생성 가능
CREATE POLICY "Users can insert their own daily tests" ON daily_tests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 데일리 테스트만 수정 가능
CREATE POLICY "Users can update their own daily tests" ON daily_tests
    FOR UPDATE USING (auth.uid() = user_id);

-- 사용자는 자신의 데일리 테스트만 삭제 가능
CREATE POLICY "Users can delete their own daily tests" ON daily_tests
    FOR DELETE USING (auth.uid() = user_id);

-- 5. user_profiles 테이블 RLS 활성화 (이미 있을 수 있음)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 6. user_profiles 테이블 정책 설정
-- 사용자는 자신의 프로필만 조회 가능
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

-- 사용자는 자신의 프로필만 생성 가능
CREATE POLICY "Users can insert their own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 프로필만 수정 가능
CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- 관리자는 모든 사용자 프로필 조회 가능 (관리자 기능용)
CREATE POLICY "Admins can view all profiles" ON user_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- 7. Storage 버킷 정책 설정 (test-uploads 버킷)
-- 사용자는 자신의 파일만 업로드 가능
CREATE POLICY "Users can upload their own files" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'test-uploads' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- 사용자는 자신의 파일만 조회 가능
CREATE POLICY "Users can view their own files" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'test-uploads' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- 사용자는 자신의 파일만 삭제 가능
CREATE POLICY "Users can delete their own files" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'test-uploads' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- 관리자는 모든 파일 조회 가능
CREATE POLICY "Admins can view all files" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'test-uploads' AND
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- 8. 기존 정책 확인 (선택사항)
-- 현재 설정된 정책들을 확인하려면:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
-- FROM pg_policies 
-- WHERE tablename IN ('core_tests', 'daily_tests', 'user_profiles'); 