# 📧 EmailJS 설정 가이드 (개발자용)

이 문서는 피드백 시스템을 위한 EmailJS 설정 방법을 설명합니다.

## 🚀 빠른 설정

### 1단계: EmailJS 계정 생성
1. [EmailJS.com](https://www.emailjs.com/)에 가입
2. 무료 계정으로 시작 (월 200건 이메일)

### 2단계: 이메일 서비스 설정
1. **Email Services** → **Add New Service**
2. **Gmail** 또는 **Outlook** 선택
3. 이메일 계정 연결
4. **Service ID** 복사 (예: `service_abc123`)

### 3단계: 이메일 템플릿 생성
1. **Email Templates** → **Create New Template**
2. 템플릿 설정:
   ```
   To: {{to_email}}
   From: {{from_name}} <{{from_email}}>
   Subject: [GitHub Dashboard Feedback] {{subject}}
   
   안녕하세요,
   
   GitHub Dashboard에 대한 피드백이 도착했습니다.
   
   📋 피드백 정보:
   • 이름: {{from_name}}
   • 이메일: {{from_email}}
   • 피드백 유형: {{feedback_type}}
   • 제목: {{subject}}
   
   💬 메시지:
   {{message}}
   
   ---
   GitHub Dashboard (pistolinkr.com)에서 전송됨
   ```
3. **Template ID** 복사 (예: `template_xyz789`)

### 4단계: Public Key 확인
1. **Account** → **API Keys**
2. **Public Key** 복사 (예: `user_def456`)

### 5단계: 코드에 설정 적용
1. `js/emailjs-config.js` 파일 열기
2. 다음 값들을 실제 키로 교체:
   ```javascript
   PUBLIC_KEY: 'user_def456',      // 실제 Public Key
   SERVICE_ID: 'service_abc123',   // 실제 Service ID
   TEMPLATE_ID: 'template_xyz789'  // 실제 Template ID
   ```
3. 파일 저장 후 배포

## 🔧 환경 변수 설정 (선택사항)

환경 변수를 사용하여 설정할 수도 있습니다:

```bash
# .env 파일 또는 환경 변수에 설정
EMAILJS_PUBLIC_KEY=your_emailjs_public_key_here
EMAILJS_SERVICE_ID=your_emailjs_service_id_here
EMAILJS_TEMPLATE_ID=your_emailjs_template_id_here
```

## 🧪 테스트

설정 완료 후 다음 방법으로 테스트할 수 있습니다:

1. **메인 앱에서**: 푸터의 '피드백' 클릭 → 모달에서 테스트
2. **독립 테스트**: `test-feedback.html` 페이지에서 테스트
3. **콘솔 확인**: 브라우저 개발자 도구에서 전송 로그 확인

## 🔒 보안 고려사항

- **EmailJS Public Key**: 클라이언트 사이드에서 사용되므로 공개되어도 안전
- **Service ID**: 공개되어도 괜찮음
- **Template ID**: 공개되어도 괜찮음
- **실제 이메일 서비스 인증**: EmailJS 서버에서 처리됨

## 🚨 문제 해결

### 피드백이 전송되지 않는 경우:
1. EmailJS 키가 올바르게 설정되었는지 확인
2. 브라우저 콘솔에서 오류 메시지 확인
3. EmailJS 대시보드에서 서비스 상태 확인
4. 이메일 템플릿이 올바르게 설정되었는지 확인

### 이메일이 수신되지 않는 경우:
1. 스팸 폴더 확인
2. EmailJS 대시보드에서 전송 로그 확인
3. 이메일 서비스 연결 상태 확인

## 📞 지원

문제가 발생하면:
1. EmailJS 공식 문서 확인
2. 브라우저 개발자 도구에서 오류 로그 확인
3. EmailJS 대시보드에서 서비스 상태 확인

---

**참고**: 이 설정은 개발자가 한 번만 하면 되며, 일반 사용자는 별도 설정 없이 피드백 기능을 사용할 수 있습니다. 