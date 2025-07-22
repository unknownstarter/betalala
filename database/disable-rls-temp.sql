-- 임시로 RLS 비활성화 (테스트용)

-- 1. RLS 비활성화
ALTER TABLE core_tests DISABLE ROW LEVEL SECURITY;
ALTER TABLE daily_tests DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- 2. 테스트용 INSERT (외래키 제약조건을 피하기 위해 실제 사용자 ID 사용)
-- 먼저 실제 사용자 ID 확인
SELECT id, email FROM auth.users LIMIT 1;

-- 3. 확인된 실제 사용자 ID로 테스트
-- (위 쿼리 결과의 id 값을 사용)
INSERT INTO core_tests (user_id, step, file_url)
VALUES (
    (SELECT id FROM auth.users LIMIT 1), -- 실제 사용자 ID
    'signup',
    'test/path.jpg'
);

-- 4. 테스트 후 삭제
DELETE FROM core_tests WHERE step = 'signup' AND file_url = 'test/path.jpg';

-- 5. 테스트 완료 후 RLS 다시 활성화 (선택사항)
-- ALTER TABLE core_tests ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE daily_tests ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY; 