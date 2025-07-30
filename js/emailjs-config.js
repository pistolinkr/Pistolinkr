// EmailJS 설정
// ⚠️ 개발자 전용 설정 - 실제 키로 교체하세요!
const EmailJSConfig = {
    // EmailJS 공개 키 (https://www.emailjs.com/에서 확인)
    // 예: 'user_abc123def456'
    PUBLIC_KEY: 'YOUR_EMAILJS_PUBLIC_KEY',
    
    // EmailJS 서비스 ID (EmailJS 대시보드에서 확인)
    // 예: 'service_xyz789'
    SERVICE_ID: 'YOUR_EMAILJS_SERVICE_ID',
    
    // EmailJS 템플릿 ID (EmailJS 대시보드에서 확인)
    // 예: 'template_def456'
    TEMPLATE_ID: 'YOUR_EMAILJS_TEMPLATE_ID',
    
    // 수신자 이메일
    TO_EMAIL: 'pistolinkr@icloud.com',
    
    // 초기화 함수
    init() {
        if (typeof emailjs !== 'undefined') {
            emailjs.init(this.PUBLIC_KEY);
            console.log('EmailJS 초기화 완료');
        } else {
            console.error('EmailJS가 로드되지 않았습니다.');
        }
    },
    
    // 설정 업데이트 함수
    updateConfig(publicKey, serviceId, templateId) {
        this.PUBLIC_KEY = publicKey;
        this.SERVICE_ID = serviceId;
        this.TEMPLATE_ID = templateId;
        
        if (typeof emailjs !== 'undefined') {
            emailjs.init(this.PUBLIC_KEY);
        }
    },
    
    // 템플릿 파라미터 생성 함수
    createTemplateParams(feedbackData) {
        return {
            to_email: this.TO_EMAIL,
            from_name: feedbackData.name,
            from_email: feedbackData.email,
            feedback_type: feedbackData.type,
            subject: feedbackData.subject,
            message: feedbackData.message,
            reply_to: feedbackData.email
        };
    }
};

// 전역 객체로 노출
window.EmailJSConfig = EmailJSConfig; 