#!/bin/bash

# 자동 배포 스크립트
# 사용법: ./scripts/deploy.sh [patch|minor|major]

set -e  # 오류 발생 시 스크립트 중단

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 로그 함수
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 버전 타입 확인
VERSION_TYPE=${1:-patch}

if [[ ! "$VERSION_TYPE" =~ ^(patch|minor|major)$ ]]; then
    log_error "Invalid version type. Use: patch, minor, or major"
    exit 1
fi

log_info "🚀 Starting deployment process..."
log_info "Version type: $VERSION_TYPE"

# 현재 브랜치 확인
CURRENT_BRANCH=$(git branch --show-current)
log_info "Current branch: $CURRENT_BRANCH"

# 변경사항 확인
if [[ -n $(git status --porcelain) ]]; then
    log_warning "Uncommitted changes detected. Stashing them..."
    git stash push -m "Auto-stash before deployment"
    STASHED=true
else
    STASHED=false
fi

# 최신 변경사항 가져오기
log_info "Pulling latest changes..."
git pull origin $CURRENT_BRANCH

# 버전 업데이트
log_info "Updating version..."
npm run version:$VERSION_TYPE

# 변경사항 커밋
log_info "Committing changes..."
git add .
git commit -m "$(node -e "console.log(require('./scripts/version-update.js').generateCommitMessage('$VERSION_TYPE', require('./package.json').version))")"

# 푸시
log_info "Pushing to remote repository..."
git push origin $CURRENT_BRANCH

# 스태시된 변경사항 복원
if [[ "$STASHED" == "true" ]]; then
    log_info "Restoring stashed changes..."
    git stash pop
fi

# 배포 완료
NEW_VERSION=$(node -e "console.log(require('./package.json').version)")
log_success "🎉 Deployment completed successfully!"
log_success "New version: $NEW_VERSION"
log_info "Deployed to: https://pistolinkr.vercel.app"

# Vercel 배포 상태 확인 (선택사항)
if command -v vercel &> /dev/null; then
    log_info "Checking Vercel deployment status..."
    vercel ls --limit=1
fi

echo ""
log_info "📊 Deployment Summary:"
echo "  • Version: $NEW_VERSION"
echo "  • Branch: $CURRENT_BRANCH"
echo "  • Type: $VERSION_TYPE"
echo "  • Timestamp: $(date '+%Y-%m-%d %H:%M:%S KST')" 