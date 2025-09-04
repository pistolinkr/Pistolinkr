// Firebase Configuration Utility
class Config {
  constructor() {
    this.config = this.loadConfig();
  }

  loadConfig() {
    return {
      // Firebase Configuration - Copy settings from Firebase Console
      firebase: {
        apiKey: "your_firebase_api_key_here",
        authDomain: "your_project.firebaseapp.com",
        projectId: "your_project_id_here",
        storageBucket: "your_project.appspot.com",
        messagingSenderId: "your_sender_id_here",
        appId: "your_app_id_here"
      },
      
      // EmailJS Configuration - Copy settings from EmailJS Console
      emailjs: {
        publicKey: "your_emailjs_public_key_here",
        serviceId: "your_emailjs_service_id_here",
        templateId: "your_emailjs_template_id_here"
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
    
    if (this.config.firebase.apiKey === "your_firebase_api_key_here") {
      errors.push('Firebase API Key is not configured. Please copy settings from Firebase Console.');
    }
    
    if (this.config.firebase.projectId === "your_project_id_here") {
      errors.push('Firebase Project ID is not configured. Please copy settings from Firebase Console.');
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