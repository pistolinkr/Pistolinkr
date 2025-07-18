import { createClient } from '@supabase/supabase-js';

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

      // 허용된 이름 목록
      const allowedNames = ['성동영', '박상현', 'Aventa R. Sevena'];
      
      if (!allowedNames.includes(name)) {
        return res.status(401).json({
          success: false,
          error: '허용된 이름이 아닙니다.'
        });
      }

      // 비밀번호 검증 (서버 사이드에서만 수행)
      let isAdmin = false;
      let isValid = false;

      // Aventa R. Sevena는 관리자 비밀번호만 사용 가능
      if (name === 'Aventa R. Sevena') {
        if (password === ADMIN_PASSWORD) {
          isAdmin = true;
          isValid = true;
        } else {
          isValid = false;
        }
      } else {
        // 다른 사용자들은 일반 비밀번호 또는 관리자 비밀번호 사용 가능
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