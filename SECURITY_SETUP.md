# Security Setup Guide

## Environment Variables Security

### Critical Security Measures

1. **NEVER commit .env files to version control**
   - `.env.local` 파일은 절대 GitHub에 올리지 마세요
   - 모든 환경 변수 파일이 `.gitignore`에 포함되어 있는지 확인하세요

2. **Environment File Structure**
   ```
   .env.local          # 로컬 개발용 (Git에 추가되지 않음)
   .env.example         # 예시 파일 (Git에 추가됨)
   ```

3. **Required Environment Variables**
   ```bash
   # Firebase Configuration
   FIREBASE_API_KEY=your_firebase_api_key
   FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   FIREBASE_APP_ID=your_app_id

   # Supabase Configuration
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # Email Configuration
   EMAILJS_PUBLIC_KEY=your_emailjs_public_key
   EMAILJS_PRIVATE_KEY=your_emailjs_private_key
   EMAILJS_SERVICE_ID=your_service_id
   EMAILJS_TEMPLATE_ID=your_template_id

   # Vercel Configuration
   VERCEL_EDGE_CONFIG=your_edge_config
   ```

### If .env.local was accidentally committed:

1. **Immediate Actions:**
   ```bash
   # Remove from Git tracking (but keep local file)
   git rm --cached .env.local
   
   # Commit the removal
   git commit -m "Remove .env.local from tracking"
   
   # Force push to remove from remote repository
   git push --force
   ```

2. **Rotate all exposed credentials:**
   - Firebase API keys 재생성
   - Supabase keys 재생성
   - EmailJS keys 재생성
   - 기타 모든 API 키 재생성

3. **Check for exposed secrets:**
   - GitHub repository의 commit history 확인
   - 모든 브랜치에서 .env 파일 제거
   - 필요시 repository 전체 삭제 후 재생성

### Best Practices

1. **Use .env.example for documentation:**
   ```bash
   # .env.example 파일에 실제 값 대신 placeholder 사용
   FIREBASE_API_KEY=your_firebase_api_key_here
   SUPABASE_URL=your_supabase_url_here
   ```

2. **Environment-specific files:**
   - `.env.development` - 개발 환경
   - `.env.production` - 프로덕션 환경
   - `.env.test` - 테스트 환경

3. **Secret Management:**
   - Vercel Edge Config 사용
   - 환경별로 다른 키 사용
   - 정기적으로 키 로테이션

### Verification Steps

1. **Check .gitignore:**
   ```bash
   cat .gitignore | grep env
   ```

2. **Verify no env files are tracked:**
   ```bash
   git ls-files | grep env
   ```

3. **Test environment loading:**
   ```bash
   # .env.local 파일이 제대로 로드되는지 확인
   node -e "console.log(process.env.FIREBASE_API_KEY ? 'Loaded' : 'Not loaded')"
   ```

### Emergency Response

만약 API 키가 노출되었다면:

1. **즉시 모든 키 재생성**
2. **GitHub repository에서 파일 제거**
3. **새로운 키로 .env.local 업데이트**
4. **애플리케이션 재배포**

### Additional Security Measures

1. **API Key Restrictions:**
   - Firebase: 도메인 제한 설정
   - Supabase: RLS (Row Level Security) 활성화
   - EmailJS: 사용량 제한 설정

2. **Monitoring:**
   - API 사용량 모니터링
   - 비정상적인 접근 패턴 감지
   - 로그 분석

3. **Backup Security:**
   - 환경 변수 백업 시 암호화
   - 안전한 위치에 백업 저장
   - 접근 권한 제한

## Database Security

### Supabase Security

1. **Row Level Security (RLS) 활성화**
2. **사용자별 권한 설정**
3. **API 키 보안 관리**

### Firebase Security

1. **Firestore Security Rules 설정**
2. **Authentication 설정**
3. **Storage 보안 규칙**

## Deployment Security

### Vercel Deployment

1. **Environment Variables 설정**
2. **Edge Config 사용**
3. **도메인 보안 설정**

### Production Checklist

- [ ] 모든 API 키가 환경 변수로 설정됨
- [ ] .env 파일이 Git에 포함되지 않음
- [ ] 프로덕션 키가 개발 키와 다름
- [ ] 보안 규칙이 활성화됨
- [ ] 모니터링이 설정됨

## Troubleshooting

### Common Issues

1. **Environment variables not loading:**
   - 파일 경로 확인
   - 파일 권한 확인
   - 변수명 확인

2. **API key errors:**
   - 키 유효성 확인
   - 도메인 제한 확인
   - 사용량 한도 확인

3. **Security warnings:**
   - .gitignore 확인
   - commit history 확인
   - 키 로테이션 필요성 확인 