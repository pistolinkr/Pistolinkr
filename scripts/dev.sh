#!/bin/bash

# 개발 서버 시작
echo "🚀 GitHub Dashboard 개발 서버를 시작합니다..."
echo "📍 접속 주소: http://localhost:4994"
echo "🔐 보안 강화: 비밀번호는 환경 변수에서 관리됩니다"
echo ""
echo "📝 유용한 명령어:"
echo "  - npm run deploy  : 변경사항을 GitHub에 업로드"
echo "  - npm run status  : Git 상태 확인"
echo "  - npm run log     : 최근 커밋 기록 확인"
echo ""
echo "🛑 서버를 중지하려면 Ctrl+C를 누르세요"
echo ""

python3 -m http.server 4994