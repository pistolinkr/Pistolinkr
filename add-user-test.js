// 조훈 사용자 추가 테스트 스크립트
async function addJoHoonUser() {
    try {
        console.log('조훈 사용자 추가 시작...');
        
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: '조훈',
                is_admin: false
            })
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Response result:', result);
        
        if (result.success) {
            console.log('✅ 조훈 사용자가 성공적으로 추가되었습니다!');
            console.log('추가된 사용자 정보:', result.data);
        } else {
            console.error('❌ 사용자 추가 실패:', result.error);
        }
    } catch (error) {
        console.error('❌ 오류 발생:', error);
    }
}

// 스크립트 실행
addJoHoonUser(); 