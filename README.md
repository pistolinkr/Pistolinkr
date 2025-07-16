# https://pistolinkr.com

## 🚀 주요 기능

### 📊 통계 대시보드
- 총 프로젝트 수
- 총 스타 수
- 총 포크 수
- 총 관찰자 수

### 🔍 검색 및 필터링
- 프로젝트명 및 설명 검색
- 프로그래밍 언어별 필터링
- 정렬 옵션 (최근 업데이트, 생성일, 이름순, 스타순)

### 📱 반응형 디자인
- 모바일, 태블릿, 데스크톱 최적화
- 그리드/리스트 뷰 전환
- 접근성 고려

### ⚙️ 설정 기능
- GitHub 사용자명 설정
- 개인 액세스 토큰 설정 (선택사항)
- 자동 새로고침 설정

### 🗄️ 데이터베이스 연동
- Vercel Postgres 데이터베이스 연동
- Vercel Blob 파일 저장소 연동
- 실시간 데이터 동기화

## 🛠️ 설치 및 사용법

### 1. 파일 다운로드
프로젝트 파일들을 다운로드하여 웹 서버에 업로드하거나 로컬에서 실행합니다.

### 2. 웹 서버 실행
```bash
# Python 3 사용
python -m http.server 8000

# 또는 Node.js 사용
npx http-server

# 또는 PHP 사용
php -S localhost:8000
```

### 3. 브라우저에서 접속
```
http://localhost:8000
```

### 4. 설정
1. "설정" 버튼 클릭
2. GitHub 사용자명 입력
3. (선택사항) GitHub 개인 액세스 토큰 입력
4. 설정 저장

### 5. 데이터베이스 설정 (Vercel 배포 시)
1. Vercel 대시보드에서 Postgres 데이터베이스 생성
2. 환경 변수 설정:
   ```
   POSTGRES_URL="your_postgres_connection_string"
   POSTGRES_HOST="your_postgres_host"
   POSTGRES_DATABASE="your_database_name"
   POSTGRES_USERNAME="your_username"
   POSTGRES_PASSWORD="your_password"
   BLOB_READ_WRITE_TOKEN="your_blob_token"
   ```
3. 프로젝트 재배포

## 🔐 GitHub 개인 액세스 토큰 설정

더 많은 API 요청을 위해 GitHub 개인 액세스 토큰을 사용하는 것을 권장합니다.

### 토큰 생성 방법:
1. GitHub.com에 로그인
2. Settings → Developer settings → Personal access tokens → Tokens (classic)
3. "Generate new token" 클릭
4. 토큰 이름 입력
5. 권한 설정:
   - `public_repo` (공개 저장소 접근)
   - `repo` (비공개 저장소 접근, 필요한 경우)
6. 토큰 생성 및 복사

## 🎨 디자인 특징

### 색상 팔레트
- **주요 색상**: #1a1a1a (진한 회색)
- **보조 색상**: #2d2d2d (중간 회색)
- **강조 색상**: #007acc (파란색)
- **텍스트**: #ffffff (흰색), #b0b0b0 (연한 회색)

### 보안 고려사항
- HTTPS 권장
- 토큰은 로컬 스토리지에 암호화 저장
- API 요청 제한 고려

## 📱 반응형 지원

- **데스크톱**: 1200px 이상
- **태블릿**: 768px - 1199px
- **모바일**: 767px 이하

## 🔧 기술 스택

- **HTML5**: 시맨틱 마크업
- **CSS3**: Flexbox, Grid, 변수, 애니메이션
- **JavaScript (ES6+)**: 클래스, async/await, 모듈 패턴
- **GitHub API v3**: RESTful API
- **Font Awesome**: 아이콘
- **Inter Font**: 타이포그래피

## 🚨 주의사항

1. **API 제한**: GitHub API는 시간당 60회 요청 제한이 있습니다.
2. **토큰 보안**: 개인 액세스 토큰은 안전하게 보관하세요.
3. **브라우저 지원**: 최신 브라우저 사용을 권장합니다.

## 🐛 문제 해결

### 프로젝트가 로드되지 않는 경우:
1. GitHub 사용자명이 올바른지 확인
2. 인터넷 연결 상태 확인
3. 브라우저 개발자 도구에서 오류 메시지 확인

### API 제한에 도달한 경우:
1. GitHub 개인 액세스 토큰 사용
2. 잠시 후 다시 시도

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🤝 기여

버그 리포트나 기능 제안은 언제든 환영합니다!

---

**GitHub 프로젝트 대시보드** - 철통보안, 높은 가독성의 정석 대시보드 
