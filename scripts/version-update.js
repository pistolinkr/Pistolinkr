#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 버전 업데이트 함수
function updateVersion(type = 'patch') {
    const packagePath = path.join(__dirname, '..', 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    const currentVersion = packageJson.version;
    const [major, minor, patch] = currentVersion.split('.').map(Number);
    
    let newVersion;
    switch (type) {
        case 'major':
            newVersion = `${major + 1}.0.0`;
            break;
        case 'minor':
            newVersion = `${major}.${minor + 1}.0`;
            break;
        case 'patch':
        default:
            newVersion = `${major}.${minor}.${patch + 1}`;
            break;
    }
    
    packageJson.version = newVersion;
    
    // package.json 업데이트
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
    
    // 버전 정보를 HTML 파일에도 업데이트
    updateVersionInHTML(newVersion);
    
    console.log(`✅ Version updated: ${currentVersion} → ${newVersion}`);
    return newVersion;
}

// HTML 파일의 버전 정보 업데이트
function updateVersionInHTML(version) {
    const htmlPath = path.join(__dirname, '..', 'index.html');
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // 버전 정보가 있는 곳을 찾아서 업데이트
    // 예: data-version="1.0.0" 또는 version="1.0.0"
    const versionRegex = /(data-version|version)=["'](\d+\.\d+\.\d+)["']/g;
    htmlContent = htmlContent.replace(versionRegex, `$1="${version}"`);
    
    // 메타 태그에 버전 정보 추가/업데이트
    if (!htmlContent.includes('name="version"')) {
        htmlContent = htmlContent.replace(
            /<meta charset="UTF-8">/,
            `<meta charset="UTF-8">\n    <meta name="version" content="${version}">`
        );
    } else {
        htmlContent = htmlContent.replace(
            /<meta name="version" content="[^"]*">/,
            `<meta name="version" content="${version}">`
        );
    }
    
    fs.writeFileSync(htmlPath, htmlContent);
    console.log(`✅ HTML version updated to ${version}`);
}

// 커밋 메시지 생성
function generateCommitMessage(type, version) {
    const date = new Date().toISOString().split('T')[0];
    const time = new Date().toLocaleTimeString('ko-KR', { 
        hour12: false, 
        timeZone: 'Asia/Seoul' 
    });
    
    const typeMessages = {
        'major': '🚀 Major version update',
        'minor': '✨ New features added',
        'patch': '🐛 Bug fixes and improvements'
    };
    
    return `${typeMessages[type] || '📝 Update'} - v${version} (${date} ${time})`;
}

// 메인 실행
if (require.main === module) {
    const type = process.argv[2] || 'patch';
    
    if (!['major', 'minor', 'patch'].includes(type)) {
        console.error('❌ Invalid version type. Use: major, minor, or patch');
        process.exit(1);
    }
    
    try {
        const newVersion = updateVersion(type);
        const commitMessage = generateCommitMessage(type, newVersion);
        
        console.log(`\n📝 Suggested commit message:`);
        console.log(`git add . && git commit -m "${commitMessage}" && git push`);
        
        // 자동으로 git add 실행
        const { execSync } = require('child_process');
        execSync('git add .', { stdio: 'inherit' });
        console.log(`\n✅ Files staged for commit`);
        
    } catch (error) {
        console.error('❌ Error updating version:', error.message);
        process.exit(1);
    }
}

module.exports = { updateVersion, generateCommitMessage }; 