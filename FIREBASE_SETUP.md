# Firebase 설정 가이드

## 🔥 Firebase 프로젝트 설정

### 1. Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/)에 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름 입력 (예: `pistolinkr-dashboard`)
4. Google Analytics 활성화 (선택사항)
5. 프로젝트 생성 완료

### 2. 웹 앱 추가

1. 프로젝트 대시보드에서 "웹" 아이콘 클릭
2. 앱 닉네임 입력 (예: `dashboard-web`)
3. "Firebase 호스팅 설정" 체크 해제
4. "앱 등록" 클릭

### 3. Firebase 설정 정보 복사

앱 등록 후 제공되는 설정 정보를 복사:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 4. Firestore 데이터베이스 설정

1. 왼쪽 메뉴에서 "Firestore Database" 클릭
2. "데이터베이스 만들기" 클릭
3. 보안 규칙 선택: "테스트 모드에서 시작" (개발용)
4. 위치 선택: `asia-northeast3 (서울)`
5. "완료" 클릭

### 5. 보안 규칙 설정

Firestore 보안 규칙을 다음과 같이 설정:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 모든 사용자가 읽기 가능
    match /{document=**} {
      allow read: if true;
      allow write: if true; // 프로덕션에서는 더 엄격한 규칙 필요
    }
  }
}
```

## 🔧 환경 변수 설정

### 1. .env.local 파일 생성

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가:

```env
# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# EmailJS Configuration (선택사항)
EMAILJS_PUBLIC_KEY=your_emailjs_public_key
EMAILJS_SERVICE_ID=your_emailjs_service_id
EMAILJS_TEMPLATE_ID=your_emailjs_template_id
```

### 2. 실제 값으로 교체

Firebase 콘솔에서 복사한 설정 정보로 placeholder를 교체:

```env
FIREBASE_API_KEY=AIzaSyC1234567890abcdefghijklmnopqrstuvwxyz
FIREBASE_AUTH_DOMAIN=pistolinkr-dashboard.firebaseapp.com
FIREBASE_PROJECT_ID=pistolinkr-dashboard
FIREBASE_STORAGE_BUCKET=pistolinkr-dashboard.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789012
FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

## 📊 데이터 구조

### Firestore 컬렉션 구조

```
firestore/
├── projects/          # 프로젝트 데이터
│   ├── {projectId}/
│   │   ├── name: string
│   │   ├── description: string
│   │   ├── url: string
│   │   ├── language: string
│   │   ├── stars: number
│   │   ├── forks: number
│   │   ├── createdAt: timestamp
│   │   └── updatedAt: timestamp
├── userSettings/      # 사용자 설정
│   └── default/
│       ├── githubToken: string
│       ├── autoRefresh: boolean
│       ├── refreshInterval: number
│       └── updatedAt: timestamp
├── feedback/          # 피드백 데이터
│   ├── {feedbackId}/
│   │   ├── name: string
│   │   ├── email: string
│   │   ├── subject: string
│   │   ├── message: string
│   │   └── createdAt: timestamp
└── analytics/         # 통계 데이터
    ├── {analyticsId}/
    │   ├── type: string
    │   ├── data: object
    │   └── timestamp: timestamp
```

## 🚀 배포 설정

### 1. Vercel 배포

1. Vercel 대시보드에서 프로젝트 설정
2. Environment Variables 섹션에서 Firebase 설정 추가
3. 모든 Firebase 환경 변수를 Vercel에 설정

### 2. 도메인 제한 설정

Firebase 콘솔에서:
1. Authentication → Settings → Authorized domains
2. 배포 도메인 추가 (예: `your-app.vercel.app`)

## 🔒 보안 설정

### 1. API 키 보안

- Firebase API 키는 공개적으로 사용 가능하지만 도메인 제한 설정 권장
- Firebase 콘솔에서 프로젝트 설정 → 일반 → 웹 API 키 → 도메인 제한 설정

### 2. Firestore 보안 규칙

프로덕션 환경에서는 더 엄격한 보안 규칙 사용:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 인증된 사용자만 쓰기 가능
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 📱 기능 설명

### 1. 실시간 데이터 동기화

Firebase Firestore의 실시간 리스너를 사용하여 데이터 자동 업데이트:

```javascript
// 실시간 구독
const unsubscribe = firebaseDB.subscribeToProjects((projects) => {
  console.log('프로젝트 업데이트:', projects);
});

// 구독 해제
unsubscribe();
```

### 2. 오프라인 지원

Firebase는 기본적으로 오프라인 지원을 제공합니다.

### 3. 자동 백업

Firebase는 자동으로 데이터를 백업합니다.

## 🛠️ 문제 해결

### 1. Firebase 초기화 오류

```javascript
// Firebase가 로드되지 않은 경우
if (!window.firebase) {
  console.error('Firebase SDK가 로드되지 않았습니다.');
}
```

### 2. 권한 오류

Firestore 보안 규칙을 확인하고 필요시 수정:

```javascript
// 테스트 모드에서 시작
allow read, write: if true;
```

### 3. 네트워크 오류

Firebase는 자동으로 재연결을 시도합니다.

## 📈 모니터링

### 1. Firebase 콘솔 모니터링

- 사용량 및 청구
- 성능 모니터링
- 오류 로그
- 실시간 데이터베이스 사용량

### 2. 알림 설정

Firebase 콘솔에서 알림 설정:
- 오류 알림
- 사용량 알림
- 성능 알림

## 🔄 마이그레이션

### Supabase에서 Firebase로 마이그레이션

1. 기존 데이터 내보내기
2. Firebase로 데이터 가져오기
3. 코드 수정
4. 테스트 및 검증

## 📞 지원

Firebase 관련 문제가 있으시면:
1. [Firebase 문서](https://firebase.google.com/docs)
2. [Firebase 커뮤니티](https://firebase.google.com/community)
3. [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase)

## ✅ 체크리스트

- [ ] Firebase 프로젝트 생성
- [ ] 웹 앱 등록
- [ ] Firestore 데이터베이스 생성
- [ ] 보안 규칙 설정
- [ ] 환경 변수 설정
- [ ] 도메인 제한 설정
- [ ] 배포 환경 설정
- [ ] 테스트 완료
