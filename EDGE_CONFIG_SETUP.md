# Edge Config 설정 가이드

## 🔗 Edge Config 연결 정보

### 제공된 정보:
- **ID**: `ecfg_vjfdgz2uoorvzhgjohctawosge8s`
- **Digest**: `5bf6b008a9ec05f6870c476d10b53211797aa000f95aae344ae60f9b422286da`
- **Token**: `8b0e6a74-505c-4631-b65c-2eb173ee92d6`

## 📋 설정 단계

### 1. Vercel 대시보드에서 Edge Config 연결

1. **Vercel 대시보드** 접속
2. **pistolinkr** 프로젝트 선택
3. **Storage** 탭 클릭
4. **"Connect Database"** 버튼 클릭
5. **"pistolinkr-store"** 선택
6. **환경 설정**:
   - ✅ Development
   - ✅ Preview  
   - ✅ Production
7. **고급 옵션**:
   - **Environment Variable**: `EDGE_CONFIG`
   - **Token Label**: `pistolinkr-token`
8. **"Connect"** 버튼 클릭

### 2. 환경 변수 설정

Vercel 대시보드 → Settings → Environment Variables에서 다음 추가:

```
EDGE_CONFIG=ecfg_vjfdgz2uoorvzhgjohctawosge8s
```

### 3. Edge Config 데이터 설정

Vercel 대시보드 → Storage → Edge Config에서 다음 JSON 데이터 추가:

```json
{
  "projectSettings": [
    {
      "project_name": "Ekman-Transport",
      "url": "https://ekmantransport.store",
      "description": "===text===",
      "status": "active",
      "hidden_for_user": false,
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## 🚀 사용 방법

### Edge Config 우선 사용
- 프로젝트 설정은 **Edge Config**에서 먼저 조회
- Edge Config에 없으면 **Postgres**에서 조회
- 빠른 읽기 성능 제공

### API 엔드포인트
- **GET** `/api/edge-config` - 프로젝트 설정 조회
- **POST** `/api/edge-config` - 프로젝트 설정 저장 (읽기 전용)
- **DELETE** `/api/edge-config` - 프로젝트 설정 삭제 (읽기 전용)

## ⚠️ 주의사항

### Edge Config 제한사항
- **읽기 전용**: API를 통한 직접 수정 불가
- **수동 업데이트**: Vercel 대시보드에서만 수정 가능
- **캐싱**: 빠른 읽기 성능, 전역 캐싱

### 권장 사용법
1. **자주 변경되지 않는 설정** → Edge Config
2. **동적 데이터** → Postgres
3. **파일 저장** → Blob Storage

## 🔧 문제 해결

### 연결 실패 시
1. 환경 변수 확인
2. 프로젝트 재배포
3. Edge Config 데이터 형식 확인

### 데이터 동기화 문제
1. Vercel 대시보드에서 Edge Config 데이터 확인
2. 브라우저 캐시 삭제
3. 강제 새로고침 (Ctrl+F5)

## 📊 성능 비교

| 저장소 | 읽기 속도 | 쓰기 속도 | 용량 | 비용 |
|--------|-----------|-----------|------|------|
| Edge Config | ⚡ 매우 빠름 | ❌ 읽기 전용 | 8KB | 무료 |
| Postgres | 🚀 빠름 | ✅ 가능 | 256MB | 무료 |
| Blob | 🐌 보통 | ✅ 가능 | 1GB | 무료 | 