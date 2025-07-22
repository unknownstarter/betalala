# 테스터 인증 시스템

선정된 테슬라 유저 대상 테스터들이 **차량 연동부터 NFT 민팅까지의 실제 플로우를 인증/기록**할 수 있도록, **간단한 웹 페이지**를 통해 인증 자료(스크린샷 등)를 업로드하는 시스템입니다.

## 🎯 주요 기능

### 1. 로그인/회원 인증 (초대된 테스터 전용)
- 이메일/비밀번호 기반 로그인
- Supabase Auth 사용
- 회원가입은 미허용 (관리자만 등록)

### 2. 코어 테스트 인증 (1회 제출)
- 리사이클팜 앱 회원가입 및 전화번호 인증
- 테슬라 차량 연동 화면 인증
- EV 주행거리 업데이트 성공 화면
- 크레딧 획득 UI 인증
- NFT 민팅 성공 화면 인증

### 3. 데일리 테스트 인증 (반복 제출)
- 매일 수행할 주행거리 업데이트 및 크레딧 수집 결과 인증
- 입력 필드: 날짜, EV 업데이트 화면 스크린샷, 크레딧 수집 화면 인증
- 달력 형태 또는 리스트로 제출 내역 확인 가능

### 4. 대시보드
- 코어 테스트 진행률 시각화
- 데일리 테스트 통계
- 최근 인증 이력 조회

## 🏗️ 아키텍처

### 클린 아키텍처 기반 구조
```
src/
├── core/                    # 비즈니스 로직
│   ├── entities/           # 도메인 엔티티
│   ├── usecases/          # 유스케이스
│   └── interfaces/        # 인터페이스
├── features/              # 기능별 페이지
│   ├── auth/             # 인증
│   ├── core-tests/       # 코어 테스트
│   ├── daily-tests/      # 데일리 테스트
│   └── dashboard/        # 대시보드
├── shared/               # 공통 컴포넌트
│   ├── components/       # UI 컴포넌트
│   ├── hooks/           # 커스텀 훅
│   └── utils/           # 유틸리티
└── infrastructure/      # 인프라스트럭처
    ├── supabase/        # Supabase 관련
    └── services/        # 서비스 컨테이너
```

## 🛠️ 기술 스택

| 영역 | 스택 |
|------|------|
| 프론트엔드 | React, Tailwind CSS |
| 백엔드/DB | Supabase (Auth + DB + Storage) |
| 라우팅 | React Router DOM |
| 상태관리 | React Hooks |
| UI 라이브러리 | Headless UI, Heroicons |

## 🚀 시작하기

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 설정
Supabase 설정이 이미 완료되어 있습니다:
- URL: `https://lwdqeumtozjiqzygcmsi.supabase.co`
- Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3. 개발 서버 실행
```bash
npm start
```

### 4. 빌드
```bash
npm run build
```

## 📊 데이터베이스 스키마

### 1. `user_profiles` 테이블
사용자 기본 정보 및 테스트 시작일 관리

### 2. `core_tests` 테이블
기초 미션 5단계 완료 기록
- `user_id`: 사용자 ID
- `step`: 테스트 단계 (signup, ev_connect, update, credit, nft)
- `file_url`: 업로드된 이미지 파일 경로
- `status`: 상태 (pending, approved, rejected)
- `completed_at`: 완료 시간

### 3. `daily_tests` 테이블
데일리 미션 완료 기록 (매일 주행거리 + 크레딧 인증)
- `user_id`: 사용자 ID
- `date`: 테스트 날짜
- `mileage_update_image_url`: 주행거리 업데이트 이미지
- `credit_earned_image_url`: 크레딧 획득 이미지
- `status`: 상태 (pending, approved, rejected)
- `completed_at`: 완료 시간

### 4. `user_achievements` 테이블
사용자 성취 및 통계 정보

## 🚀 파일 업로드 시스템

### 구현된 기능
1. **파일 검증**: 크기, 형식, 필수 여부 검증
2. **이미지 압축**: 클라이언트 사이드 이미지 압축 (최대 1920px, 품질 80%)
3. **진행률 표시**: 실시간 업로드 진행률 표시
4. **에러 처리**: 상세한 에러 메시지 및 복구 방안
5. **보안**: 파일 타입 및 크기 제한

### 기술 스택
- **Storage**: Supabase Storage (`test-uploads` 버킷)
- **Edge Functions**: 파일 처리 및 검증
- **Database**: PostgreSQL (Supabase)
- **Client**: React + JavaScript

### 파일 업로드 플로우
1. 파일 선택 → 검증
2. 이미지 압축 (옵션)
3. Supabase Storage 업로드
4. Edge Function 호출 (메타데이터 처리)
5. Database 저장
6. UI 상태 업데이트

## 🔐 보안

- Row Level Security (RLS) 정책 적용
- 사용자는 자신의 데이터만 접근 가능
- Supabase Auth를 통한 인증 관리

## 📱 사용자 플로우

```
[테스터] 이메일 및 비밀번호 수령
     ↓
웹 로그인
     ↓
코어 테스트(1회성 인증) 단계 확인 → 단계별 인증 제출
     ↓
데일리 테스트(매일 인증) 단계 확인 → 매일 인증 제출
     ↓
전체 인증 이력 확인 가능 (내 이력 조회 기능)
```

## 🎨 UI/UX 특징

- 반응형 디자인 (모바일/데스크톱 지원)
- 직관적인 파일 업로드 (드래그 앤 드롭)
- 실시간 진행률 표시
- 에러 처리 및 로딩 상태 관리
- 한국어 지원

## 🔧 개발 가이드

### 새로운 기능 추가
1. `core/entities/`에 엔티티 정의
2. `core/usecases/`에 비즈니스 로직 구현
3. `infrastructure/supabase/`에 리포지토리 구현
4. `features/`에 UI 컴포넌트 생성

### 컴포넌트 작성 규칙
- 함수형 컴포넌트 사용
- 커스텀 훅으로 로직 분리
- Tailwind CSS로 스타일링
- 에러 상태 및 로딩 상태 처리

## 📝 라이선스

이 프로젝트는 내부 테스터 인증용으로 개발되었습니다.
