// 환경 변수 설정 유틸리티
class Config {
  constructor() {
    this.config = this.loadConfig();
  }

  loadConfig() {
    return {
      // Firebase 설정
      firebase: {
        apiKey: process.env.FIREBASE_API_KEY || 'your_firebase_api_key',
        authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'your_project.firebaseapp.com',
        projectId: process.env.FIREBASE_PROJECT_ID || 'your_project_id',
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'your_project.appspot.com',
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || 'your_sender_id',
        appId: process.env.FIREBASE_APP_ID || 'your_app_id'
      },
      
      // EmailJS 설정
      emailjs: {
        publicKey: process.env.EMAILJS_PUBLIC_KEY || 'your_emailjs_public_key',
        serviceId: process.env.EMAILJS_SERVICE_ID || 'your_service_id',
        templateId: process.env.EMAILJS_TEMPLATE_ID || 'your_template_id'
      },
      
      // Edge Config 설정
      edgeConfig: {
        id: process.env.EDGE_CONFIG_ID
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

  // Edge Config ID 가져오기
  getEdgeConfigId() {
    return this.config.edgeConfig.id;
  }

  // 환경 변수 유효성 검사
  validateConfig() {
    const errors = [];
    
    if (!this.config.firebase.apiKey || this.config.firebase.apiKey === 'your_firebase_api_key') {
      errors.push('FIREBASE_API_KEY is missing or not configured');
    }
    
    if (!this.config.firebase.projectId || this.config.firebase.projectId === 'your_project_id') {
      errors.push('FIREBASE_PROJECT_ID is missing or not configured');
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
        apiKey: this.config.firebase.apiKey !== 'your_firebase_api_key' ? 'SET' : 'MISSING',
        projectId: this.config.firebase.projectId !== 'your_project_id' ? 'SET' : 'MISSING',
        authDomain: this.config.firebase.authDomain !== 'your_project.firebaseapp.com' ? 'SET' : 'MISSING'
      },
      emailjs: {
        publicKey: this.config.emailjs.publicKey !== 'your_emailjs_public_key' ? 'SET' : 'MISSING',
        serviceId: this.config.emailjs.serviceId !== 'your_service_id' ? 'SET' : 'MISSING'
      },
      edgeConfig: {
        id: this.config.edgeConfig.id ? 'SET' : 'MISSING'
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