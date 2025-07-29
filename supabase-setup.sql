-- Supabase에서 프로젝트 설정 테이블 생성
-- Vercel 대시보드의 Supabase SQL 편집기에서 실행하세요

-- 프로젝트 설정 테이블 생성
CREATE TABLE IF NOT EXISTS project_settings (
  id SERIAL PRIMARY KEY,
  project_name VARCHAR(255) NOT NULL UNIQUE,
  url VARCHAR(500) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'active',
  hidden_for_user BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 샘플 데이터 삽입 (선택사항)
INSERT INTO project_settings (project_name, url, description, status, hidden_for_user)
VALUES 
  ('pistolinkr', 'https://pistolinkr.vercel.app', 'GitHub 대시보드 프로젝트', 'active', false),
  ('test-project', 'https://example.com', '테스트 프로젝트', 'active', false)
ON CONFLICT (project_name) DO NOTHING;

-- Row Level Security (RLS) 활성화
ALTER TABLE project_settings ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 정책 생성 (모든 사용자가 프로젝트 설정을 읽을 수 있음)
CREATE POLICY "public can read project_settings"
  ON public.project_settings
  FOR SELECT TO anon
  USING (true);

-- 인증된 사용자가 프로젝트 설정을 수정할 수 있도록 정책 생성
CREATE POLICY "authenticated users can manage project_settings"
  ON public.project_settings
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- 업데이트 트리거 함수 생성 (updated_at 자동 업데이트)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 업데이트 트리거 생성
CREATE TRIGGER update_project_settings_updated_at 
    BEFORE UPDATE ON project_settings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 대시보드 데이터 테이블 생성
CREATE TABLE IF NOT EXISTS dashboard_data (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  url VARCHAR(500),
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- dashboard_data 테이블에 RLS 활성화
ALTER TABLE dashboard_data ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 정책 생성
CREATE POLICY "public can read dashboard_data"
  ON public.dashboard_data
  FOR SELECT TO anon
  USING (true);

-- 인증된 사용자 관리 정책 생성
CREATE POLICY "authenticated users can manage dashboard_data"
  ON public.dashboard_data
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- 업데이트 트리거 생성
CREATE TRIGGER update_dashboard_data_updated_at 
    BEFORE UPDATE ON dashboard_data 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 사용자 테이블 생성
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 기본 사용자 데이터 삽입
INSERT INTO users (name, is_admin)
VALUES 
  ('성동영', false),
  ('박상현', false),
  ('조훈', false),
  ('Aventa R. Sevena', true)
ON CONFLICT (name) DO NOTHING;

-- users 테이블에 RLS 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 정책 생성 (모든 사용자가 사용자 목록을 읽을 수 있음)
CREATE POLICY "public can read users"
  ON public.users
  FOR SELECT TO anon
  USING (true);

-- 인증된 사용자가 사용자를 관리할 수 있도록 정책 생성
CREATE POLICY "authenticated users can manage users"
  ON public.users
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- 업데이트 트리거 생성
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 테이블 생성 확인
SELECT * FROM project_settings;
SELECT * FROM dashboard_data;
SELECT * FROM users; 