**[🇰🇷 한국어](#-한국어-korean)** | **[🇺🇸 English](#-English-영어)** 

### 🇰🇷 한국어 korean
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

### 🌍 다국어 지원
- 7개 언어 지원 (영어, 한국어, 일본어, 중국어, 스페인어, 프랑스어, 독일어)
- 브라우저 언어 설정 자동 감지
- IP 기반 위치 감지로 언어 추정
- 실시간 언어 변경 기능

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

## 🌍 다국어 지원

### 지원 언어
- **English (en)**: 영어
- **한국어 (ko)**: 한국어
- **日本語 (ja)**: 일본어
- **中文 (zh)**: 중국어
- **Español (es)**: 스페인어
- **Français (fr)**: 프랑스어
- **Deutsch (de)**: 독일어

### 언어 감지 우선순위
1. **저장된 언어 설정**: 사용자가 이전에 선택한 언어
2. **브라우저 언어 설정**: `navigator.language` 값
3. **위치 기반 감지**: IP 주소를 통한 국가별 언어 추정
4. **기본 언어**: 영어 (en)

### 언어 변경 방법
- 헤더의 언어 선택 드롭다운에서 원하는 언어 선택
- 설정이 자동으로 저장되어 다음 방문 시에도 유지

### 번역 범위
- 로그인 화면
- 헤더 및 네비게이션
- 검색 및 필터 옵션
- 프로젝트 카드 정보
- 통계 및 메트릭
- 설정 및 관리자 패널
- 알림 및 메시지
- 피드백 모달

## 📧 피드백 시스템 (EmailJS)

사용자가 직접 피드백을 전송할 수 있는 시스템이 EmailJS를 사용하여 구현되어 있습니다.

### 기능
- **피드백 모달**: 푸터의 '피드백' 링크 클릭 시 열림
- **구조화된 양식**: 이름, 이메일, 피드백 유형, 제목, 메시지
- **자동 전송**: 사용자의 메일 앱 없이도 직접 전송
- **다국어 지원**: 모든 피드백 UI 텍스트 번역
- **EmailJS 통합**: 클라이언트 사이드 이메일 전송

### 피드백 유형
- 일반 피드백
- 버그 신고
- 기능 요청
- 개선 제안

### EmailJS 설정 방법

#### 1. EmailJS 계정 생성
1. [EmailJS.com](https://www.emailjs.com/)에 가입
2. 무료 계정으로 시작 (월 200건 이메일)

#### 2. 이메일 서비스 설정
1. **Email Services** → **Add New Service**
2. **Gmail** 또는 **Outlook** 선택
3. 이메일 계정 연결
4. **Service ID** 복사 (예: `service_abc123`)

#### 3. 이메일 템플릿 생성
1. **Email Templates** → **Create New Template**
2. 템플릿 설정:
   ```
   To: {{to_email}}
   From: {{from_name}} <{{from_email}}>
   Subject: [GitHub Dashboard Feedback] {{subject}}
   
   안녕하세요,
   
   GitHub Dashboard에 대한 피드백이 도착했습니다.
   
   📋 피드백 정보:
   • 이름: {{from_name}}
   • 이메일: {{from_email}}
   • 피드백 유형: {{feedback_type}}
   • 제목: {{subject}}
   
   💬 메시지:
   {{message}}
   
   ---
   GitHub Dashboard (pistolinkr.com)에서 전송됨
   ```
3. **Template ID** 복사 (예: `template_xyz789`)

#### 4. Public Key 확인
1. **Account** → **API Keys**
2. **Public Key** 복사 (예: `user_def456`)

#### 5. 개발자 설정 (필수)
1. `js/emailjs-config.js` 파일 열기
2. 다음 값들을 실제 키로 교체:
   ```javascript
   PUBLIC_KEY: 'user_def456',      // 실제 Public Key
   SERVICE_ID: 'service_abc123',   // 실제 Service ID
   TEMPLATE_ID: 'template_xyz789'  // 실제 Template ID
   ```
3. 파일 저장 후 배포

### 환경 변수 설정 (선택사항)
```bash
# EmailJS 설정 (js/emailjs-config.js 대신 사용 가능)
EMAILJS_PUBLIC_KEY=your_emailjs_public_key_here
EMAILJS_SERVICE_ID=your_emailjs_service_id_here
EMAILJS_TEMPLATE_ID=your_emailjs_template_id_here
```

### 보안 고려사항
- EmailJS Public Key는 클라이언트 사이드에서 사용되므로 공개되어도 안전합니다
- Service ID와 Template ID도 공개되어도 괜찮습니다
- 실제 이메일 서비스 인증은 EmailJS 서버에서 처리됩니다

### 장점
- **서버 없이 작동**: 클라이언트 사이드에서 직접 이메일 전송
- **간편한 설정**: EmailJS 대시보드에서 쉽게 설정
- **무료 티어**: 월 200건까지 무료
- **실시간 전송**: 즉시 이메일 전송 확인

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


---
### 🇺🇸 English 영어
# https://pistolinkr.com

## 🚀 Key Features

### 📊 Statistics Dashboard
- Total number of projects
- Total number of stars
- Total number of forks
- Total number of watchers

### 🔍 Search and Filtering
- Search by project name and description
- Filter by programming language
- Sorting options (last updated, creation date, name, stars)

### 🌍 Multilingual Support
- Supports 7 languages (English, Korean, Japanese, Chinese, Spanish, French, German)
- Automatic detection of browser language settings
- Language estimation based on IP location
- Real-time language change feature

### 📱 Responsive Design
- Optimized for mobile, tablet, and desktop
- Grid/List view switching
- Accessibility considered

### ⚙️ Settings
- Set GitHub username
- Set personal access token (optional)
- Auto-refresh settings

### 🗄️ Database Integration
- Vercel Postgres database integration
- Vercel Blob file storage integration
- Real-time data synchronization

## 🛠️ Installation and Usage

### 1. Download Files
Download the project files and upload them to a web server or run them locally.

### 2. Run Web Server
```bash
# Using Python 3
python -m http.server 8000

# Or using Node.js
npx http-server

# Or using PHP
php -S localhost:8000
```

### 3. Access in Browser
```
http://localhost:8000
```

### 4. Configuration
1. Click the "Settings" button
2. Enter your GitHub username
3. (Optional) Enter your GitHub Personal Access Token
4. Save settings

### 5. Database Setup (When deploying on Vercel)
1. Create a Postgres database in the Vercel dashboard
2. Set environment variables:
   ```
   POSTGRES_URL="your_postgres_connection_string"
   POSTGRES_HOST="your_postgres_host"
   POSTGRES_DATABASE="your_database_name"
   POSTGRES_USERNAME="your_username"
   POSTGRES_PASSWORD="your_password"
   BLOB_READ_WRITE_TOKEN="your_blob_token"
   ```
3. Redeploy the project

## 🔐 GitHub Personal Access Token Setup

It is recommended to use a GitHub Personal Access Token for more API requests.

### How to create a token:
1. Log in to GitHub.com
2. Go to Settings → Developer settings → Personal access tokens → Tokens (classic)
3. Click "Generate new token"
4. Enter a token name
5. Set permissions:
   - `public_repo` (access to public repositories)
   - `repo` (access to private repositories, if needed)
6. Generate and copy the token

## 🌍 Multilingual Support

### Supported Languages
- **English (en)**: English
- **한국어 (ko)**: Korean
- **日本語 (ja)**: Japanese
- **中文 (zh)**: Chinese
- **Español (es)**: Spanish
- **Français (fr)**: French
- **Deutsch (de)**: German

### Language Detection Priority
1. **Saved Language Setting**: The language previously selected by the user
2. **Browser Language Setting**: The `navigator.language` value
3. **Location-based Detection**: Language estimation by country via IP address
4. **Default Language**: English (en)

### How to Change Language
- Select the desired language from the language dropdown in the header
- The setting is automatically saved and maintained for the next visit

### Translation Scope
- Header and navigation
- Search and filter options
- Project card information
- Statistics and metrics
- Settings panel
- Notifications and messages
- Feedback modal

## 📧 Feedback System (EmailJS)

A system allowing users to send feedback directly has been implemented using EmailJS.

### Features
- **Feedback Modal**: Opens when the 'Feedback' link in the footer is clicked
- **Structured Form**: Name, email, feedback type, subject, message
- **Direct Sending**: Sends directly without the user's mail app
- **Multilingual Support**: All feedback UI text is translated
- **EmailJS Integration**: Client-side email sending

### Feedback Types
- General Feedback
- Bug Report
- Feature Request
- Improvement Suggestion

### How to Set Up EmailJS

#### 1. Create an EmailJS Account
1. Sign up at [EmailJS.com](https://www.emailjs.com/)
2. Start with a free account (200 emails/month)

#### 2. Set Up Email Service
1. Go to **Email Services** → **Add New Service**
2. Select **Gmail** or **Outlook**
3. Connect your email account
4. Copy the **Service ID** (e.g., `service_abc123`)

#### 3. Create an Email Template
1. Go to **Email Templates** → **Create New Template**
2. Configure the template:
   ```
   To: {{to_email}}
   From: {{from_name}} <{{from_email}}>
   Subject: [GitHub Dashboard Feedback] {{subject}}
   
   Hello,
   
   You have received feedback regarding the GitHub Dashboard.
   
   📋 Feedback Information:
   • Name: {{from_name}}
   • Email: {{from_email}}
   • Feedback Type: {{feedback_type}}
   • Subject: {{subject}}
   
   💬 Message:
   {{message}}
   
   ---
   Sent from GitHub Dashboard (pistolinkr.com)
   ```
3. Copy the **Template ID** (e.g., `template_xyz789`)

#### 4. Check Public Key
1. Go to **Account** → **API Keys**
2. Copy the **Public Key** (e.g., `user_def456`)

#### 5. Developer Settings (Required)
1. Open the `js/emailjs-config.js` file
2. Replace the following values with your actual keys:
   ```javascript
   PUBLIC_KEY: 'user_def456',      // Your actual Public Key
   SERVICE_ID: 'service_abc123',   // Your actual Service ID
   TEMPLATE_ID: 'template_xyz789'  // Your actual Template ID
   ```
3. Save the file and deploy

### Environment Variable Setup (Optional)
```bash
# EmailJS settings (can be used instead of js/emailjs-config.js)
EMAILJS_PUBLIC_KEY=your_emailjs_public_key_here
EMAILJS_SERVICE_ID=your_emailjs_service_id_here
EMAILJS_TEMPLATE_ID=your_emailjs_template_id_here
```

### Security Considerations
- The EmailJS Public Key is safe to be exposed as it is used on the client-side
- The Service ID and Template ID are also safe to be public
- Actual email service authentication is handled by EmailJS servers

### Advantages
- **Works without a server**: Sends emails directly from the client-side
- **Easy setup**: Easily configured from the EmailJS dashboard
- **Free tier**: Up to 200 emails per month for free
- **Real-time sending**: Instantly confirm email delivery

## 🎨 Design Features

### Color Palette
- **Primary Color**: #1a1a1a (dark gray)
- **Secondary Color**: #2d2d2d (medium gray)
- **Accent Color**: #007acc (blue)
- **Text**: #ffffff (white), #b0b0b0 (light gray)

### Security Considerations
- HTTPS recommended
- Tokens are stored encrypted in local storage
- Consider API rate limits

## 📱 Responsive Support

- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: 767px and below

## 🔧 Tech Stack

- **HTML5**: Semantic markup
- **CSS3**: Flexbox, Grid, Variables, Animations
- **JavaScript (ES6+)**: Classes, async/await, Module Pattern
- **GitHub API v3**: RESTful API
- **Font Awesome**: Icons
- **Inter Font**: Typography

## 🚨 Cautions

1. **API Limit**: The GitHub API has a rate limit of 60 requests per hour.
2. **Token Security**: Keep your personal access token secure.
3. **Browser Support**: Use of modern browsers is recommended.

## 🐛 Troubleshooting

### If projects do not load:
1. Check if the GitHub username is correct
2. Check your internet connection
3. Check for error messages in the browser's developer tools

### If you reach the API limit:
1. Use a GitHub Personal Access Token
2. Try again after a while

## 📄 License

This project is distributed under the MIT License.

## 🤝 Contributing

Bug reports and feature suggestions are always welcome!

---

**GitHub Project Dashboard** - The standard for dashboards with robust
