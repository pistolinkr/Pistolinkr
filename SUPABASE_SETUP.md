# Supabase 설정 가이드

## 1. 환경 변수 설정

### 방법 1: .env.local 파일 사용 (로컬 개발용)
프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://kwdxnvxjpacrjmamuern.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3ZHhudnhqcGFjcmptYW11ZXJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjY0MDI0NCwiZXhwIjoyMDY4MjE2MjQ0fQ.0r-DxVSPQMQKthai6LGUDABDhQgQWSS86JcVwJJOvYc
SUPABASE_URL=https://kwdxnvxjpacrjmamuern.supabase.co

# Edge Config 설정 (선택사항)
EDGE_CONFIG_ID=your-edge-config-id

# 기존 Vercel Postgres 설정 (선택사항)
POSTGRES_URL=postgres://postgres.kwdxnvxjpacrjmamuern:gkhZQnEKTNKvUy0y@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x
POSTGRES_USER=postgres
POSTGRES_HOST=db.kwdxnvxjpacrjmamuern.supabase.co
POSTGRES_PASSWORD=gkhZQnEKTNKvUy0y
POSTGRES_DATABASE=postgres
```

### 방법 2: Vercel 환경 변수 설정 (배포용)
Vercel 대시보드에서 다음 환경 변수들을 추가하세요:

**필수 환경 변수:**
```
NEXT_PUBLIC_SUPABASE_URL=https://kwdxnvxjpacrjmamuern.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3ZHhudnhqcGFjcmptYW11ZXJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjY0MDI0NCwiZXhwIjoyMDY4MjE2MjQ0fQ.0r-DxVSPQMQKthai6LGUDABDhQgQWSS86JcVwJJOvYc
```

**선택적 환경 변수:**
```
POSTGRES_URL=postgres://postgres.kwdxnvxjpacrjmamuern:gkhZQnEKTNKvUy0y@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x
POSTGRES_USER=postgres
POSTGRES_HOST=db.kwdxnvxjpacrjmamuern.supabase.co
POSTGRES_PASSWORD=gkhZQnEKTNKvUy0y
POSTGRES_DATABASE=postgres
```

## 2. Supabase 테이블 생성

1. Vercel 대시보드에서 "Storage" 탭으로 이동
2. "Open in Supabase" 버튼 클릭
3. Supabase 대시보드에서 "SQL Editor"로 이동
4. `supabase-setup.sql` 파일의 내용을 복사하여 SQL 편집기에 붙여넣기
5. "Run" 버튼 클릭하여 테이블 생성

**또는 수동으로 테이블 생성:**

### project_settings 테이블:
```sql
CREATE TABLE project_settings (
  id SERIAL PRIMARY KEY,
  project_name VARCHAR(255) NOT NULL UNIQUE,
  url VARCHAR(500) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'active',
  hidden_for_user BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### dashboard_data 테이블:
```sql
CREATE TABLE dashboard_data (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  url VARCHAR(500),
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 3. 테이블 구조 확인

생성된 테이블 구조:
```sql
CREATE TABLE project_settings (
  id SERIAL PRIMARY KEY,
  project_name VARCHAR(255) NOT NULL UNIQUE,
  url VARCHAR(500) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'active',
  hidden_for_user BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 4. Row Level Security (RLS) 정책

테이블에 다음 RLS 정책이 자동으로 생성됩니다:
- **공개 읽기**: 모든 사용자가 프로젝트 설정을 읽을 수 있음
- **인증된 사용자 관리**: 인증된 사용자가 프로젝트 설정을 수정할 수 있음

## 5. 테스트

1. `test-db-connection.html` 페이지를 열어서 연결 테스트
2. "Postgres 연결 테스트" 버튼 클릭
3. "프로젝트 설정 로드 테스트" 버튼 클릭
4. "테스트 프로젝트 추가"로 실제 프로젝트 추가

## 6. 문제 해결

### 테이블이 존재하지 않는 경우:
- Supabase SQL 편집기에서 `supabase-setup.sql` 스크립트 실행
- 환경 변수가 올바르게 설정되었는지 확인

### 연결 오류:
- Vercel 환경 변수 확인
- Supabase 프로젝트 URL과 키 확인
- 네트워크 연결 확인

### 권한 오류:
- RLS 정책이 올바르게 설정되었는지 확인
- Supabase 대시보드에서 테이블 권한 확인

## 7. 배포

환경 변수를 설정한 후 Vercel에 다시 배포하세요:
```bash
vercel --prod
```

또는 GitHub에 푸시하면 자동으로 배포됩니다. 