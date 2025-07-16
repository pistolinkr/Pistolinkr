// 환경 변수 설정 유틸리티
class Config {
  constructor() {
    this.config = this.loadConfig();
  }

  loadConfig() {
    return {
      // Supabase 설정
      supabase: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
        serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      },
      
      // Edge Config 설정
      edgeConfig: {
        id: process.env.EDGE_CONFIG_ID
      },
      
      // 기존 Postgres 설정 (호환성을 위해)
      postgres: {
        url: process.env.POSTGRES_URL,
        user: process.env.POSTGRES_USER,
        host: process.env.POSTGRES_HOST,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DATABASE
      }
    };
  }

  // Supabase URL 가져오기
  getSupabaseUrl() {
    return this.config.supabase.url;
  }

  // Supabase 서비스 키 가져오기
  getSupabaseServiceKey() {
    return this.config.supabase.serviceKey;
  }

  // Supabase 익명 키 가져오기
  getSupabaseAnonKey() {
    return this.config.supabase.anonKey;
  }

  // Edge Config ID 가져오기
  getEdgeConfigId() {
    return this.config.edgeConfig.id;
  }

  // 환경 변수 유효성 검사
  validateConfig() {
    const errors = [];
    
    if (!this.config.supabase.url) {
      errors.push('NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL is missing');
    }
    
    if (!this.config.supabase.serviceKey) {
      errors.push('SUPABASE_SERVICE_ROLE_KEY is missing');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // 설정 정보 출력 (디버깅용)
  getConfigInfo() {
    return {
      supabase: {
        url: this.config.supabase.url ? 'SET' : 'MISSING',
        serviceKey: this.config.supabase.serviceKey ? 'SET' : 'MISSING',
        anonKey: this.config.supabase.anonKey ? 'SET' : 'MISSING'
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