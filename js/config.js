// Firebase 설정 유틸리티
class Config {
  constructor() {
    this.config = this.loadConfig();
  }

  loadConfig() {
    return {
      // Firebase 설정 - Firebase 콘솔에서 복사한 설정을 여기에 직접 입력
      firebase: {
        apiKey: "your_firebase_api_key_here",
        authDomain: "your_project.firebaseapp.com",
        projectId: "your_project_id_here",
        storageBucket: "your_project.appspot.com",
        messagingSenderId: "your_sender_id_here",
        appId: "your_app_id_here"
      },
      
      // EmailJS 설정 - EmailJS 콘솔에서 복사한 설정을 여기에 직접 입력
      emailjs: {
        publicKey: "your_emailjs_public_key_here",
        serviceId: "your_emailjs_service_id_here",
        templateId: "your_emailjs_template_id_here"
      }
    };
  }

  // Firebase 설정 가져오기
  getFirebaseConfig() {
    return this.config.firebase;
  }

  // EmailJS 설정 가져오기
  getEmailJSConfig() {
    return this.config.emailjs;
  }

  // 설정 유효성 검사
  validateConfig() {
    const errors = [];
    
    if (this.config.firebase.apiKey === "your_firebase_api_key_here") {
      errors.push('Firebase API Key가 설정되지 않았습니다. Firebase 콘솔에서 설정을 복사하여 입력하세요.');
    }
    
    if (this.config.firebase.projectId === "your_project_id_here") {
      errors.push('Firebase Project ID가 설정되지 않았습니다. Firebase 콘솔에서 설정을 복사하여 입력하세요.');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // 설정 정보 출력 (디버깅용)
  getConfigInfo() {
    return {
      firebase: {
        apiKey: this.config.firebase.apiKey !== "your_firebase_api_key_here" ? 'SET' : 'MISSING',
        projectId: this.config.firebase.projectId !== "your_project_id_here" ? 'SET' : 'MISSING',
        authDomain: this.config.firebase.authDomain !== "your_project.firebaseapp.com" ? 'SET' : 'MISSING'
      },
      emailjs: {
        publicKey: this.config.emailjs.publicKey !== "your_emailjs_public_key_here" ? 'SET' : 'MISSING',
        serviceId: this.config.emailjs.serviceId !== "your_emailjs_service_id_here" ? 'SET' : 'MISSING'
      }
    };
  }
}

// 전역 설정 인스턴스 생성
const config = new Config();

// 브라우저 환경에서 사용할 수 있도록 전역으로 노출
if (typeof window !== 'undefined') {
  window.appConfig = config;
}

export default config; 