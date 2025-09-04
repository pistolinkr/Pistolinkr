// Firebase Database Utility
class FirebaseDatabase {
    constructor() {
        this.db = null;
        this.init();
    }

    async init() {
        try {
            // Load Firebase SDK
            await this.loadFirebaseSDK();
            
            // Initialize Firebase
            const firebaseConfig = window.appConfig.getFirebaseConfig();
            firebase.initializeApp(firebaseConfig);
            
            // Initialize Firestore database
            this.db = firebase.firestore();
            
            console.log('Firebase database initialized successfully.');
        } catch (error) {
            console.error('Firebase initialization error:', error);
        }
    }

    async loadFirebaseSDK() {
        return new Promise((resolve, reject) => {
            // Check if Firebase SDK is already loaded
            if (window.firebase) {
                resolve();
                return;
            }

            // Load Firebase SDK
            const script = document.createElement('script');
            script.src = 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
            script.onload = () => {
                const firestoreScript = document.createElement('script');
                firestoreScript.src = 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
                firestoreScript.onload = resolve;
                firestoreScript.onerror = reject;
                document.head.appendChild(firestoreScript);
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Save project data
    async saveProject(projectData) {
        try {
            const docRef = await this.db.collection('projects').add({
                ...projectData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error('Project save error:', error);
            return { success: false, error: error.message };
        }
    }

    // Get project list
    async getProjects() {
        try {
            const snapshot = await this.db.collection('projects')
                .orderBy('updatedAt', 'desc')
                .get();
            
            const projects = [];
            snapshot.forEach(doc => {
                projects.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            return { success: true, data: projects };
        } catch (error) {
            console.error('Project list fetch error:', error);
            return { success: false, error: error.message };
        }
    }

    // Update project
    async updateProject(projectId, updateData) {
        try {
            await this.db.collection('projects').doc(projectId).update({
                ...updateData,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { success: true };
        } catch (error) {
            console.error('Project update error:', error);
            return { success: false, error: error.message };
        }
    }

    // Delete project
    async deleteProject(projectId) {
        try {
            await this.db.collection('projects').doc(projectId).delete();
            return { success: true };
        } catch (error) {
            console.error('Project delete error:', error);
            return { success: false, error: error.message };
        }
    }

    // Save user settings
    async saveUserSettings(settings) {
        try {
            await this.db.collection('userSettings').doc('default').set({
                ...settings,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { success: true };
        } catch (error) {
            console.error('User settings save error:', error);
            return { success: false, error: error.message };
        }
    }

    // Get user settings
    async getUserSettings() {
        try {
            const doc = await this.db.collection('userSettings').doc('default').get();
            if (doc.exists) {
                return { success: true, data: doc.data() };
            } else {
                return { success: true, data: {} };
            }
        } catch (error) {
            console.error('User settings fetch error:', error);
            return { success: false, error: error.message };
        }
    }

    // Save feedback
    async saveFeedback(feedbackData) {
        try {
            const docRef = await this.db.collection('feedback').add({
                ...feedbackData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error('Feedback save error:', error);
            return { success: false, error: error.message };
        }
    }

    // Save analytics data
    async saveAnalytics(analyticsData) {
        try {
            const docRef = await this.db.collection('analytics').add({
                ...analyticsData,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error('Analytics save error:', error);
            return { success: false, error: error.message };
        }
    }

    // Subscribe to real-time data
    subscribeToProjects(callback) {
        return this.db.collection('projects')
            .orderBy('updatedAt', 'desc')
            .onSnapshot(snapshot => {
                const projects = [];
                snapshot.forEach(doc => {
                    projects.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                callback(projects);
            });
    }

    // Unsubscribe from real-time updates
    unsubscribe(listener) {
        if (listener) {
            listener();
        }
    }
}

// Create global database instance
const firebaseDB = new FirebaseDatabase();

// Expose to global scope for browser environment
if (typeof window !== 'undefined') {
    window.firebaseDB = firebaseDB;
}

export default firebaseDB; 