import { createClient } from '@supabase/supabase-js';

// 로컬 개발 환경에서 .env.local 파일 로드
if (process.env.NODE_ENV !== 'production') {
  try {
    const fs = require('fs');
    const path = require('path');
    const envPath = path.join(process.cwd(), '.env.local');
    
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const envVars = envContent.split('\n').reduce((acc, line) => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim();
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = value;
          }
        }
        return acc;
      }, {});
      console.log('Loaded .env.local file');
    }
  } catch (error) {
    console.log('Could not load .env.local:', error.message);
  }
}

// Supabase 클라이언트 생성
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  console.log('Users API called:', req.method, req.url);
  console.log('Environment check:', {
    supabaseUrl: !!supabaseUrl,
    supabaseServiceKey: !!supabaseServiceKey,
    nodeEnv: process.env.NODE_ENV
  });
  
  // Supabase 연결 확인 - 연결이 없으면 로컬 모드로 전환
  if (!supabaseUrl || !supabaseServiceKey) {
    console.log('Supabase configuration missing, using local mode');
    
          if (req.method === 'GET') {
        // 로컬 저장소에서 사용자 목록 반환 (실제로는 서버에서 localStorage에 접근할 수 없으므로 기본 목록 반환)
        return res.status(200).json({
          success: true,
          data: [
            { name: '성동영', is_admin: false },
            { name: '박상현', is_admin: false },
            { name: '조훈', is_admin: false },
            { name: '박지윤', is_admin: false },
            { name: 'Aventa R. Sevena', is_admin: true }
          ]
        });
    } else if (req.method === 'POST') {
      const { name, is_admin } = req.body;
      console.log('Local mode: Adding user:', { name, is_admin });
      
      return res.status(200).json({
        success: true,
        data: {
          name,
          is_admin: is_admin || false,
          message: '로컬 모드로 저장되었습니다. 브라우저 새로고침 시 사라질 수 있습니다.'
        }
      });
    }
  }

  if (req.method === 'GET') {
    try {
      // 모든 사용자 이름 조회
      const { data, error } = await supabase
        .from('users')
        .select('name, is_admin')
        .order('name');
      
      if (error) {
        // 테이블이 없는 경우 기본 사용자 목록 반환
        if (error.code === '42P01') {
          console.log('users table does not exist. Using default users.');
          res.status(200).json({
            success: true,
            data: [
              { name: '성동영', is_admin: false },
              { name: '박상현', is_admin: false },
              { name: '조훈', is_admin: false },
              { name: 'Aventa R. Sevena', is_admin: true }
            ]
          });
          return;
        }
        throw error;
      }
      
      res.status(200).json({
        success: true,
        data: data || []
      });
    } catch (error) {
      console.error('Users fetch error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch users',
        details: error.message
      });
    }
  } else if (req.method === 'POST') {
    try {
      const { name, is_admin } = req.body;
      console.log('POST request body:', { name, is_admin });
      
      if (!name) {
        return res.status(400).json({
          success: false,
          error: '사용자 이름은 필수입니다.'
        });
      }
      
      // 기존 사용자가 있는지 확인
      const { data: existing, error: existingError } = await supabase
        .from('users')
        .select('id')
        .eq('name', name)
        .single();
      
      console.log('Existing user check:', { existing, existingError });
      
      let result;
      if (existing) {
        // 기존 사용자 업데이트
        const { data, error } = await supabase
          .from('users')
          .update({
            is_admin: is_admin || false,
            updated_at: new Date().toISOString()
          })
          .eq('name', name)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      } else {
        // 새 사용자 추가
        const { data, error } = await supabase
          .from('users')
          .insert({
            name,
            is_admin: is_admin || false
          })
          .select();
        
        console.log('Insert result:', { data, error });
        
        if (error) {
          console.error('Insert error details:', error);
          
          // 테이블이 없는 경우 fallback 처리
          if (error.code === '42P01') {
            console.log('users table does not exist. Creating fallback response.');
            res.status(200).json({
              success: true,
              data: {
                name,
                is_admin: is_admin || false,
                message: '테이블이 없어 로컬에서 처리됩니다.'
              }
            });
            return;
          }
          
          throw error;
        }
        result = data[0];
      }
      
      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('User save error:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      
      res.status(500).json({
        success: false,
        error: 'Failed to save user',
        details: error.message,
        code: error.code,
        hint: error.hint
      });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { name } = req.query;
      
      if (!name) {
        return res.status(400).json({
          success: false,
          error: '삭제할 사용자 이름이 필요합니다.'
        });
      }
      
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('name', name);
      
      if (error) throw error;
      
      res.status(200).json({
        success: true,
        message: `사용자 "${name}"이(가) 삭제되었습니다.`
      });
    } catch (error) {
      console.error('User delete error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete user',
        details: error.message
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 