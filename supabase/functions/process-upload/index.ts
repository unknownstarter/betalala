import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface UploadRequest {
  filePath: string
  fileType: string
  fileSize: number
  userId: string
  testType: 'core' | 'daily'
  step?: string
  date?: string
}

serve(async (req) => {
  // CORS 처리
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 요청 본문 파싱
    const { filePath, fileType, fileSize, userId, testType, step, date }: UploadRequest = await req.json()

    // 입력 검증
    if (!filePath || !fileType || !userId || !testType) {
      return new Response(
        JSON.stringify({ error: '필수 필드가 누락되었습니다.' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // 파일 크기 검증 (10MB 제한)
    const maxSize = 10 * 1024 * 1024
    if (fileSize > maxSize) {
      return new Response(
        JSON.stringify({ error: '파일 크기는 10MB를 초과할 수 없습니다.' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // 파일 타입 검증
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(fileType)) {
      return new Response(
        JSON.stringify({ error: '지원하지 않는 파일 형식입니다.' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Supabase 클라이언트 생성
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // 파일 정보를 데이터베이스에 저장
    let dbResult
    if (testType === 'core') {
      if (!step) {
        return new Response(
          JSON.stringify({ error: '코어 테스트의 경우 step이 필요합니다.' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      dbResult = await supabase
        .from('core_tests')
        .insert([{
          user_id: userId,
          step: step,
          file_url: filePath,
          status: 'pending',
          completed_at: new Date().toISOString()
        }])
        .select()
    } else if (testType === 'daily') {
      if (!date) {
        return new Response(
          JSON.stringify({ error: '데일리 테스트의 경우 date가 필요합니다.' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      // 기존 데일리 테스트가 있는지 확인
      const existingTest = await supabase
        .from('daily_tests')
        .select('*')
        .eq('user_id', userId)
        .eq('date', date)
        .single()

      if (existingTest.data) {
        return new Response(
          JSON.stringify({ error: '해당 날짜의 테스트가 이미 존재합니다.' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }

      dbResult = await supabase
        .from('daily_tests')
        .insert([{
          user_id: userId,
          date: date,
          mileage_update_image_url: filePath, // 임시로 하나만 저장
          credit_earned_image_url: filePath,  // 실제로는 두 개의 파일을 처리해야 함
          status: 'pending',
          completed_at: new Date().toISOString()
        }])
        .select()
    }

    if (dbResult.error) {
      console.error('Database error:', dbResult.error)
      return new Response(
        JSON.stringify({ error: '데이터베이스 저장에 실패했습니다.' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: dbResult.data[0],
        message: '파일 업로드가 성공적으로 처리되었습니다.'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: '서버 오류가 발생했습니다.' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}) 