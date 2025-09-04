// Firebase 데이터베이스 유틸리티
class FirebaseDatabase {
    constructor() {
        this.db = null;
        this.init();
    }

    async init() {
        try {
            // Firebase SDK 로드
            await this.loadFirebaseSDK();
            
            // Firebase 초기화
            const firebaseConfig = window.appConfig.getFirebaseConfig();
            firebase.initializeApp(firebaseConfig);
            
            // Firestore 데이터베이스 초기화
            this.db = firebase.firestore();
            
            console.log('Firebase 데이터베이스가 초기화되었습니다.');
        } catch (error) {
            console.error('Firebase 초기화 오류:', error);
        }
    }

    async loadFirebaseSDK() {
        return new Promise((resolve, reject) => {
            // Firebase SDK가 이미 로드되어 있는지 확인
            if (window.firebase) {
                resolve();
                return;
            }

            // Firebase SDK 로드
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

    // 프로젝트 데이터 저장
    async saveProject(projectData) {
        try {
            const docRef = await this.db.collection('projects').add({
                ...projectData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error('프로젝트 저장 오류:', error);
            return { success: false, error: error.message };
        }
    }

    // 프로젝트 목록 가져오기
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
            console.error('프로젝트 목록 가져오기 오류:', error);
            return { success: false, error: error.message };
        }
    }

    // 프로젝트 업데이트
    async updateProject(projectId, updateData) {
        try {
            await this.db.collection('projects').doc(projectId).update({
                ...updateData,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { success: true };
        } catch (error) {
            console.error('프로젝트 업데이트 오류:', error);
            return { success: false, error: error.message };
        }
    }

    // 프로젝트 삭제
    async deleteProject(projectId) {
        try {
            await this.db.collection('projects').doc(projectId).delete();
            return { success: true };
        } catch (error) {
            console.error('프로젝트 삭제 오류:', error);
            return { success: false, error: error.message };
        }
    }

    // 사용자 설정 저장
    async saveUserSettings(settings) {
        try {
            await this.db.collection('userSettings').doc('default').set({
                ...settings,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { success: true };
        } catch (error) {
            console.error('사용자 설정 저장 오류:', error);
            return { success: false, error: error.message };
        }
    }

    // 사용자 설정 가져오기
    async getUserSettings() {
        try {
            const doc = await this.db.collection('userSettings').doc('default').get();
            if (doc.exists) {
                return { success: true, data: doc.data() };
            } else {
                return { success: true, data: {} };
            }
        } catch (error) {
            console.error('사용자 설정 가져오기 오류:', error);
            return { success: false, error: error.message };
        }
    }

    // 피드백 저장
    async saveFeedback(feedbackData) {
        try {
            const docRef = await this.db.collection('feedback').add({
                ...feedbackData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error('피드백 저장 오류:', error);
            return { success: false, error: error.message };
        }
    }

    // 통계 데이터 저장
    async saveAnalytics(analyticsData) {
        try {
            const docRef = await this.db.collection('analytics').add({
                ...analyticsData,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error('통계 데이터 저장 오류:', error);
            return { success: false, error: error.message };
        }
    }

    // 실시간 데이터 구독
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

    // 구독 해제
    unsubscribe(listener) {
        if (listener) {
            listener();
        }
    }
}

// 전역 데이터베이스 인스턴스 생성
const firebaseDB = new FirebaseDatabase();

// 브라우저 환경에서 사용할 수 있도록 전역으로 노출
if (typeof window !== 'undefined') {
    window.firebaseDB = firebaseDB;
}

export default firebaseDB; 