-- 실제 사용자 ID로 테스트

-- 1. 실제 사용자 목록 확인
SELECT id, email FROM auth.users LIMIT 5;

-- 2. user_profiles 테이블의 사용자 확인
SELECT user_id, email FROM user_profiles LIMIT 5;

-- 3. 실제 사용자 ID로 테스트 INSERT (위에서 확인한 실제 user_id 사용)
-- 예시: 실제 user_id를 '실제_USER_ID' 부분에 넣어주세요
INSERT INTO core_tests (user_id, step, file_url)
VALUES (
    '실제_USER_ID', -- 여기에 실제 user_id를 넣어주세요
    'signup',
    'test/path.jpg'
);

-- 4. 테스트 후 삭제
DELETE FROM core_tests WHERE user_id = '실제_USER_ID';

-- 5. 또는 더 간단한 방법: RLS 임시 비활성화
-- ALTER TABLE core_tests DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE daily_tests DISABLE ROW LEVEL SECURITY; 