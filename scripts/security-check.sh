#!/bin/bash

# 🔐 Security Check Script
# 이 스크립트는 민감한 파일들이 Git에 추적되지 않는지 확인합니다

echo "🔐 Security Check 시작..."
echo "================================"

# 1. .env 파일들이 Git에 추적되지 않는지 확인
echo "1. 환경 변수 파일 확인:"
if git ls-files | grep -E "\.env"; then
    echo "❌ 경고: .env 파일이 Git에 추적되고 있습니다!"
    echo "   다음 명령어로 제거하세요:"
    echo "   git rm --cached .env*"
    echo "   git commit -m 'Remove .env files from tracking'"
    echo ""
else
    echo "✅ .env 파일들이 Git에서 제외되어 있습니다."
fi

# 2. .gitignore에 환경 변수 파일들이 포함되어 있는지 확인
echo ""
echo "2. .gitignore 설정 확인:"
if grep -q "\.env" .gitignore; then
    echo "✅ .gitignore에 .env 파일들이 포함되어 있습니다."
else
    echo "❌ .gitignore에 .env 파일들이 포함되어 있지 않습니다!"
fi

# 3. 민감한 파일들 확인
echo ""
echo "3. 민감한 파일 확인:"
SENSITIVE_FILES=(".env.local" ".env.production" "firebase.json" ".firebaserc" "secrets.json" "config.json")
for file in "${SENSITIVE_FILES[@]}"; do
    if [ -f "$file" ]; then
        if git ls-files | grep -q "$file"; then
            echo "❌ $file이 Git에 추적되고 있습니다!"
        else
            echo "✅ $file이 Git에서 제외되어 있습니다."
        fi
    fi
done

# 4. 현재 Git 상태 확인
echo ""
echo "4. Git 상태 확인:"
echo "현재 추적 중인 파일들:"
git ls-files | head -10

# 5. 보안 권장사항
echo ""
echo "5. 보안 권장사항:"
echo "✅ .env.local 파일을 사용하여 로컬 환경 변수 관리"
echo "✅ .env.example 파일을 사용하여 필요한 환경 변수 문서화"
echo "✅ API 키는 정기적으로 로테이션"
echo "✅ 프로덕션과 개발 환경의 키를 분리"
echo "✅ Vercel Edge Config 사용 고려"

echo ""
echo "🔐 Security Check 완료!"
