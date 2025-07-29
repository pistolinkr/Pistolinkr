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

// 환경 변수에서 관리자 비밀번호 가져오기 (서버 사이드에서만 접근 가능)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Parky096@QZ';
const USER_PASSWORD = process.env.USER_PASSWORD || '0127942';

// 디버깅용 로그 (배포 후 제거)
console.log('Environment variables check:', {
  ADMIN_PASSWORD: ADMIN_PASSWORD ? 'SET' : 'MISSING',
  USER_PASSWORD: USER_PASSWORD ? 'SET' : 'MISSING',
  hasAdminPassword: !!ADMIN_PASSWORD,
  hasUserPassword: !!USER_PASSWORD
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { name, password } = req.body;

      // 디버깅용 로그 (배포 후 제거)
      console.log('Login attempt:', {
        name,
        passwordLength: password ? password.length : 0,
        adminPasswordSet: !!ADMIN_PASSWORD,
        userPasswordSet: !!USER_PASSWORD
      });

      // 데이터베이스에서 사용자 목록 가져오기
      let users = [];
      try {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('name, is_admin')
          .order('name');
        
        if (userError) {
          // 테이블이 없는 경우 기본 사용자 목록 사용
          if (userError.code === '42P01') {
            console.log('users table does not exist. Using default users.');
            users = [
              { name: '성동영', is_admin: false },
              { name: '박상현', is_admin: false },
              { name: '조훈', is_admin: false },
              { name: '박지윤', is_admin: false },
              { name: 'Aventa R. Sevena', is_admin: true }
            ];
          } else {
            throw userError;
          }
        } else {
          users = userData || [];
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
        // 오류 발생 시 기본 사용자 목록 사용
        users = [
          { name: '성동영', is_admin: false },
          { name: '박상현', is_admin: false },
          { name: '조훈', is_admin: false },
          { name: '박지윤', is_admin: false },
          { name: 'Aventa R. Sevena', is_admin: true }
        ];
      }
      
      // 사용자 이름 확인
      console.log('Available users:', users.map(u => u.name));
      console.log('Login attempt for user:', name);
      
      const user = users.find(u => u.name === name);
      if (!user) {
        console.log('User not found:', name);
        return res.status(401).json({
          success: false,
          error: '허용된 이름이 아닙니다.'
        });
      }
      
      console.log('User found:', user);

      // 비밀번호 검증 (서버 사이드에서만 수행)
      let isAdmin = false;
      let isValid = false;

      // 사용자가 관리자인지 확인
      const userIsAdmin = user.is_admin;

      // 관리자 사용자는 관리자 비밀번호만 사용 가능
      if (userIsAdmin) {
        if (password === ADMIN_PASSWORD) {
          isAdmin = true;
          isValid = true;
        } else {
          isValid = false;
        }
      } else {
        // 일반 사용자들은 일반 비밀번호 또는 관리자 비밀번호 사용 가능
        if (password === ADMIN_PASSWORD) {
          isAdmin = true;
          isValid = true;
        } else if (password === USER_PASSWORD) {
          isAdmin = false;
          isValid = true;
        }
      }

      if (!isValid) {
        return res.status(401).json({
          success: false,
          error: '잘못된 비밀번호입니다.'
        });
      }

      // JWT 토큰 생성 (선택사항)
      const token = Buffer.from(`${name}:${isAdmin}:${Date.now()}`).toString('base64');

      res.status(200).json({
        success: true,
        isAdmin,
        token,
        message: '로그인 성공'
      });

    } catch (error) {
      console.error('Authentication error:', error);
      res.status(500).json({
        success: false,
        error: '인증 서버 오류'
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 