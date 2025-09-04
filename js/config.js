// Firebase Configuration Utility
class Config {
  constructor() {
    this.config = this.loadConfig();
  }

  loadConfig() {
    return {
      // Firebase Configuration - Load from environment variables
      firebase: {
        apiKey: process.env.FIREBASE_API_KEY || "your_firebase_api_key_here",
        authDomain: process.env.FIREBASE_AUTH_DOMAIN || "your_project.firebaseapp.com",
        projectId: process.env.FIREBASE_PROJECT_ID || "your_project_id_here",
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "your_project.appspot.com",
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "your_sender_id_here",
        appId: process.env.FIREBASE_APP_ID || "your_app_id_here"
      },
      
      // EmailJS Configuration - Load from environment variables
      emailjs: {
        publicKey: process.env.EMAILJS_PUBLIC_KEY || "your_emailjs_public_key_here",
        serviceId: process.env.EMAILJS_SERVICE_ID || "your_emailjs_service_id_here",
        templateId: process.env.EMAILJS_TEMPLATE_ID || "your_emailjs_template_id_here"
      }
    };
  }

  // Get Firebase configuration
  getFirebaseConfig() {
    return this.config.firebase;
  }

  // Get EmailJS configuration
  getEmailJSConfig() {
    return this.config.emailjs;
  }

  // Validate configuration
  validateConfig() {
    const errors = [];
    
    if (!this.config.firebase.apiKey || this.config.firebase.apiKey === "your_firebase_api_key_here") {
      errors.push('Firebase API Key is not configured. Please check your .env file.');
    }
    
    if (!this.config.firebase.projectId || this.config.firebase.projectId === "your_project_id_here") {
      errors.push('Firebase Project ID is not configured. Please check your .env file.');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Get configuration info (for debugging)
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

// Create global configuration instance
const config = new Config();

// Expose to global scope for browser environment
if (typeof window !== 'undefined') {
  window.appConfig = config;
}

export default config; 