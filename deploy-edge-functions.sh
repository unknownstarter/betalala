#!/bin/bash

# Supabase Edge Functions 배포 스크립트

echo "🚀 Supabase Edge Functions 배포를 시작합니다..."

# Supabase CLI가 설치되어 있는지 확인
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI가 설치되어 있지 않습니다."
    echo "설치 방법: npm install -g supabase"
    exit 1
fi

# 프로젝트 연결 확인
echo "📋 프로젝트 상태 확인 중..."
supabase status

# Edge Functions 배포
echo "📦 Edge Functions 배포 중..."
supabase functions deploy process-upload

echo "✅ 배포가 완료되었습니다!"
echo "🔗 함수 URL: https://lwdqeumtozjiqzygcmsi.supabase.co/functions/v1/process-upload" 