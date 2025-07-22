-- 테이블 구조 확인

-- 1. core_tests 테이블 구조
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'core_tests'
ORDER BY ordinal_position;

-- 2. daily_tests 테이블 구조
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'daily_tests'
ORDER BY ordinal_position;

-- 3. user_profiles 테이블 구조
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles'
ORDER BY ordinal_position; 