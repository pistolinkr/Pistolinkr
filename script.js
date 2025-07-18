// GitHub 대시보드 애플리케이션
class GitHubDashboard {
    constructor() {
        this.repos = [];
        this.filteredRepos = [];
        this.settings = this.loadSettings();
        this.autoRefreshInterval = null;
        // 비밀번호는 서버 사이드에서만 검증 (클라이언트에서는 제거)
        this.isLoggedIn = false;
        this.isAdmin = false;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkLoginStatus();
    }

    bindEvents() {
        // 로그인 이벤트
        document.getElementById('loginBtn').addEventListener('click', () => {
            this.handleLogin();
        });

        document.getElementById('loginPassword').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleLogin();
            }
        });

        document.getElementById('togglePassword').addEventListener('click', () => {
            this.togglePasswordVisibility();
        });

        // 로그아웃 이벤트
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.handleLogout();
        });

        // 모바일 로그아웃 버튼
        document.getElementById('mobileLogoutBtn').addEventListener('click', () => {
            this.handleLogout();
        });

        // 관리자 이벤트
        document.getElementById('adminBtn').addEventListener('click', () => {
            this.openAdminModal();
        });

        // 모바일 관리자 버튼
        document.getElementById('mobileAdminBtn').addEventListener('click', () => {
            this.openAdminModal();
        });

        // 검색 및 필터 이벤트
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.filterRepositories();
        });

        document.getElementById('languageFilter').addEventListener('change', () => {
            this.filterRepositories();
        });

        document.getElementById('sortFilter').addEventListener('change', () => {
            this.filterRepositories();
        });

        // 뷰 토글 이벤트
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.toggleView(e.target.closest('.view-btn').dataset.view);
            });
        });

        // 새로고침 버튼
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.loadRepositories();
        });

        // 모바일 새로고침 버튼
        document.getElementById('mobileRefreshBtn').addEventListener('click', () => {
            this.loadRepositories();
        });

        // 설정 모달 이벤트
        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.openSettingsModal();
        });

        // 모바일 설정 버튼
        document.getElementById('mobileSettingsBtn').addEventListener('click', () => {
            this.openSettingsModal();
        });

        document.getElementById('saveSettings').addEventListener('click', () => {
            this.saveSettings();
        });

        document.getElementById('cancelSettings').addEventListener('click', () => {
            this.closeSettingsModal();
        });

        // 토큰 도움말 토글
        document.getElementById('showTokenHelp').addEventListener('click', () => {
            const helpContent = document.getElementById('tokenHelpContent');
            const button = document.getElementById('showTokenHelp');
            
            if (helpContent.style.display === 'none') {
                helpContent.style.display = 'block';
                button.textContent = '토큰 생성 방법 숨기기';
            } else {
                helpContent.style.display = 'none';
                button.textContent = '토큰 생성 방법 보기';
            }
        });

        // 모달 닫기 이벤트
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.closeModal(e.target.closest('.modal'));
            });
        });

        // 모달 외부 클릭 시 닫기
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });

        // 관리자 설정 이벤트
        document.getElementById('saveProjectSettings').addEventListener('click', () => {
            this.saveProjectSettings();
        });

        document.getElementById('deleteProjectSettings').addEventListener('click', () => {
            this.deleteProjectSettings();
        });

        document.getElementById('projectSelect').addEventListener('change', () => {
            this.loadProjectSettingsForForm();
        });

        // 일괄 관리 버튼들
        document.getElementById('bulkHideProjects').addEventListener('click', () => {
            this.bulkHideProjects();
        });

        document.getElementById('bulkShowProjects').addEventListener('click', () => {
            this.bulkShowProjects();
        });

        document.getElementById('refreshProjects').addEventListener('click', () => {
            this.loadRepositories();
            this.loadConfiguredProjects();
            this.updateSystemStatus();
        });

        // 사용자 관리 이벤트
        document.getElementById('addUser').addEventListener('click', () => {
            this.addUser();
        });
    }

    checkLoginStatus() {
        const isLoggedIn = sessionStorage.getItem('githubDashboardLoggedIn');
        const isAdmin = sessionStorage.getItem('githubDashboardAdmin');
        
        if (isLoggedIn === 'true') {
            this.isLoggedIn = true;
            this.isAdmin = isAdmin === 'true';
            this.showDashboard();
        } else {
            this.showLoginScreen();
        }
    }

    async handleLogin() {
        const name = document.getElementById('loginName').value.trim();
        const password = document.getElementById('loginPassword').value;
        const loginError = document.getElementById('loginError');
        const loginBtn = document.getElementById('loginBtn');
        
        // 로딩 상태 표시
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 로그인 중...';
        
        try {
            // 서버 사이드 인증 API 호출
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, password })
            });
            
            const result = await response.json();
            
            if (result.success) {
                // 로그인 성공
                sessionStorage.setItem('githubDashboardLoggedIn', 'true');
                sessionStorage.setItem('githubDashboardAdmin', result.isAdmin.toString());
                sessionStorage.setItem('githubDashboardToken', result.token);
                this.isLoggedIn = true;
                this.isAdmin = result.isAdmin;
                this.showDashboard();
                document.getElementById('loginPassword').value = '';
                loginError.style.display = 'none';
            } else {
                // 로그인 실패
                loginError.style.display = 'flex';
                loginError.querySelector('span').textContent = result.error || '로그인에 실패했습니다.';
                document.getElementById('loginPassword').value = '';
                document.getElementById('loginPassword').focus();
            }
        } catch (error) {
            console.error('Login error:', error);
            loginError.style.display = 'flex';
            loginError.querySelector('span').textContent = '서버 연결 오류가 발생했습니다.';
            document.getElementById('loginPassword').value = '';
            document.getElementById('loginPassword').focus();
        } finally {
            // 로딩 상태 해제
            loginBtn.disabled = false;
            loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i><span>로그인</span>';
        }
    }

    handleLogout() {
        sessionStorage.removeItem('githubDashboardLoggedIn');
        sessionStorage.removeItem('githubDashboardAdmin');
        this.isLoggedIn = false;
        this.isAdmin = false;
        this.showLoginScreen();
    }

    togglePasswordVisibility() {
        const passwordInput = document.getElementById('loginPassword');
        const toggleBtn = document.getElementById('togglePassword');
        const icon = toggleBtn.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.className = 'fas fa-eye-slash';
            toggleBtn.title = '비밀번호 숨기기';
        } else {
            passwordInput.type = 'password';
            icon.className = 'fas fa-eye';
            toggleBtn.title = '비밀번호 보기';
        }
    }

    showDashboard() {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('dashboardContent').style.display = 'block';
        document.body.classList.remove('login-active');
        
        // 관리자 버튼 표시/숨김
        const adminBtn = document.getElementById('adminBtn');
        const mobileAdminBtn = document.getElementById('mobileAdminBtn');
        if (this.isAdmin) {
            adminBtn.style.display = 'inline-flex';
            mobileAdminBtn.style.display = 'flex';
        } else {
            adminBtn.style.display = 'none';
            mobileAdminBtn.style.display = 'none';
        }
        
        this.loadRepositories();
        this.setupAutoRefresh();
    }

    showLoginScreen() {
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('dashboardContent').style.display = 'none';
        document.body.classList.add('login-active');
        document.getElementById('loginPassword').focus();
    }

    async loadRepositories() {
        // 항상 pistolinkr 계정 사용
        const username = 'pistolinkr';
        this.settings.githubUsername = username;
        
        if (!username) {
            this.showSettingsModal();
            return;
        }
        
        this.showLoading(true);
        
        try {
            const headers = {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'pistolinkr-dashboard'
            };
            
            if (this.settings.githubToken) {
                headers['Authorization'] = `token ${this.settings.githubToken}`;
            }
            
            console.log('GitHub API 호출 중:', `https://api.github.com/users/${username}/repos`);
            
            const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
                headers: headers
            });
            
            console.log('GitHub API 응답 상태:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('GitHub API 오류 응답:', errorText);
                
                if (response.status === 403) {
                    throw new Error('API 요청 제한에 도달했습니다. GitHub 토큰을 설정해주세요.');
                } else if (response.status === 404) {
                    throw new Error('사용자를 찾을 수 없습니다.');
                } else {
                    throw new Error(`GitHub API 오류: ${response.status} - ${errorText}`);
                }
            }
            
            this.repos = await response.json();
            console.log('로드된 저장소 수:', this.repos.length);
            
            this.filteredRepos = [...this.repos];
            await this.updateStatistics();
            await this.updateLanguageFilter();
            await this.renderProjects();
            this.showLoading(false);
            
        } catch (error) {
            console.error('프로젝트 로드 오류:', error);
            this.showError(`프로젝트를 불러오는 중 오류가 발생했습니다: ${error.message}`);
            this.showLoading(false);
        }
    }

    async filterRepositories() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const languageFilter = document.getElementById('languageFilter').value;
        const sortFilter = document.getElementById('sortFilter').value;

        this.filteredRepos = this.repos.filter(repo => {
            const matchesSearch = repo.name.toLowerCase().includes(searchTerm) ||
                                (repo.description && repo.description.toLowerCase().includes(searchTerm));
            const matchesLanguage = !languageFilter || repo.language === languageFilter;
            
            return matchesSearch && matchesLanguage;
        });

        // 정렬
        this.filteredRepos.sort((a, b) => {
            switch (sortFilter) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'created':
                    return new Date(b.created_at) - new Date(a.created_at);
                case 'stars':
                    return b.stargazers_count - a.stargazers_count;
                case 'updated':
                default:
                    return new Date(b.updated_at) - new Date(a.updated_at);
            }
        });

        await this.renderProjects();
    }

    async updateStatistics() {
        // 모든 프로젝트 설정을 한 번에 로드 (성능 최적화)
        let allProjectSettings = [];
        try {
            allProjectSettings = await window.projectSettingsAPI.getProjectSettings();
        } catch (error) {
            try {
                allProjectSettings = await window.edgeConfigAPI.getProjectSettings();
            } catch (edgeError) {
                console.log('프로젝트 설정 로드 실패:', edgeError);
                allProjectSettings = [];
            }
        }
        
        // 프로젝트 설정을 Map으로 변환
        const settingsMap = new Map();
        allProjectSettings.forEach(setting => {
            settingsMap.set(setting.project_name, setting);
        });
        
        // 도메인 URL이 설정된(개시된) 프로젝트만 통계에 포함
        const visibleRepos = [];
        for (const repo of this.repos) {
            const settings = settingsMap.get(repo.name);
            if (settings && settings.url) {
                visibleRepos.push(repo);
            }
        }

        const totalRepos = visibleRepos.length;
        const totalStars = visibleRepos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
        const totalForks = visibleRepos.reduce((sum, repo) => sum + repo.forks_count, 0);
        const totalWatchers = visibleRepos.reduce((sum, repo) => sum + repo.watchers_count, 0);

        document.getElementById('totalRepos').textContent = totalRepos.toLocaleString();
        document.getElementById('totalStars').textContent = totalStars.toLocaleString();
        document.getElementById('totalForks').textContent = totalForks.toLocaleString();
        document.getElementById('totalWatchers').textContent = totalWatchers.toLocaleString();
    }

    async updateLanguageFilter() {
        const languageFilter = document.getElementById('languageFilter');
        
        // 모든 프로젝트 설정을 한 번에 로드 (성능 최적화)
        let allProjectSettings = [];
        try {
            allProjectSettings = await window.projectSettingsAPI.getProjectSettings();
        } catch (error) {
            try {
                allProjectSettings = await window.edgeConfigAPI.getProjectSettings();
            } catch (edgeError) {
                console.log('프로젝트 설정 로드 실패:', edgeError);
                allProjectSettings = [];
            }
        }
        
        // 프로젝트 설정을 Map으로 변환
        const settingsMap = new Map();
        allProjectSettings.forEach(setting => {
            settingsMap.set(setting.project_name, setting);
        });
        
        // 도메인 URL이 설정된(개시된) 프로젝트만 언어 필터에 포함
        const visibleRepos = [];
        for (const repo of this.repos) {
            const settings = settingsMap.get(repo.name);
            if (settings && settings.url) {
                visibleRepos.push(repo);
            }
        }
        
        const languages = [...new Set(visibleRepos.map(repo => repo.language).filter(Boolean))].sort();
        // 기존 옵션 제거 (첫 번째 "모든 언어" 제외)
        while (languageFilter.children.length > 1) {
            languageFilter.removeChild(languageFilter.lastChild);
        }
        // 새 언어 옵션 추가
        languages.forEach(language => {
            const option = document.createElement('option');
            option.value = language;
            option.textContent = language;
            languageFilter.appendChild(option);
        });
    }

    async renderProjects() {
        const projectsGrid = document.getElementById('projectsGrid');
        projectsGrid.innerHTML = '';
        
        console.log('렌더링할 저장소 수:', this.filteredRepos.length);
        
        // 모든 프로젝트 설정을 한 번에 로드 (성능 최적화)
        let allProjectSettings = [];
        try {
            // Postgres에서 먼저 시도 (실제 저장소)
            allProjectSettings = await window.projectSettingsAPI.getProjectSettings();
            console.log('Postgres에서 로드된 프로젝트 설정:', allProjectSettings.length);
        } catch (error) {
            console.log('Postgres 로드 실패, Edge Config에서 시도:', error);
            try {
                allProjectSettings = await window.edgeConfigAPI.getProjectSettings();
                console.log('Edge Config에서 로드된 프로젝트 설정:', allProjectSettings.length);
            } catch (edgeError) {
                console.log('Edge Config 로드도 실패:', edgeError);
                allProjectSettings = [];
            }
        }
        
        // 프로젝트 설정을 Map으로 변환하여 빠른 검색 가능
        const settingsMap = new Map();
        allProjectSettings.forEach(setting => {
            settingsMap.set(setting.project_name, {
                url: setting.url,
                description: setting.description,
                status: setting.status,
                hiddenForUser: setting.hidden_for_user
            });
        });
        
        // 중복 제거를 위한 Set 사용
        const processedRepos = new Set();
        const filtered = [];
        
        for (const repo of this.filteredRepos) {
            // 중복 체크
            if (processedRepos.has(repo.name)) {
                console.log(`저장소 "${repo.name}" - 중복 제거됨`);
                continue;
            }
            processedRepos.add(repo.name);
            
            const settings = settingsMap.get(repo.name);
            console.log(`저장소 "${repo.name}" 설정:`, settings);
            
            // URL이 설정된 프로젝트만 표시
            if (!settings || !settings.url) {
                console.log(`저장소 "${repo.name}" - URL 없음, 건너뜀`);
                continue;
            }
            if (!this.isAdmin && settings.hiddenForUser) {
                console.log(`저장소 "${repo.name}" - 일반 사용자에게 숨김, 건너뜀`);
                continue;
            }
            console.log(`저장소 "${repo.name}" - 표시됨`);
            filtered.push({ repo, settings });
        }
        
        console.log('최종 필터링된 저장소 수:', filtered.length);
        
        if (filtered.length === 0) {
            projectsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                    <h3>프로젝트를 찾을 수 없습니다</h3>
                    <p>검색 조건을 변경해보세요.</p>
                </div>
            `;
            return;
        }
        
        // 프로젝트 카드 생성 및 렌더링
        filtered.forEach(({ repo, settings }) => {
            const card = this.createProjectCard(repo, settings);
            projectsGrid.appendChild(card);
        });
    }

    createProjectCard(repo, settings) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.addEventListener('click', () => this.showProjectDetails(repo, settings));

        const languages = repo.language ? [repo.language] : [];
        const updatedDate = new Date(repo.updated_at).toLocaleDateString('ko-KR');

        // 관리자 전용 버튼들
        const adminButtons = this.isAdmin ? `
            <div class="project-admin-actions" onclick="event.stopPropagation();">
                <button class="btn btn-sm btn-secondary admin-edit-btn" title="프로젝트 설정 편집" onclick="dashboard.editProjectSettings('${repo.name}')">
                    <i class="fas fa-cog"></i>
                </button>
                <button class="btn btn-sm btn-warning admin-toggle-btn" title="사용자에게 숨기기/보이기" onclick="dashboard.toggleProjectVisibility('${repo.name}')">
                    <i class="fas fa-eye-slash"></i>
                </button>
                <button class="btn btn-sm btn-danger admin-delete-btn" title="프로젝트 설정 삭제" onclick="dashboard.deleteProjectSettingsByName('${repo.name}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        ` : '';

        // 프로젝트 설명 (설정에서 가져온 설명 우선, 없으면 GitHub 설명 사용)
        const description = settings?.description || repo.description || '설명이 없습니다.';

        card.innerHTML = `
            <div class="project-header">
                <div>
                    <div class="project-title">
                        <a href="${repo.html_url}" target="_blank" onclick="event.stopPropagation();">
                            ${repo.name}
                        </a>
                    </div>
                    <span class="project-visibility ${repo.private ? 'private' : 'public'}">
                        ${repo.private ? 'Private' : 'Public'}
                    </span>
                </div>
                ${adminButtons}
            </div>
            <div class="project-description">
                ${description}
            </div>
            <div class="project-meta">
                <div class="project-meta-item">
                    <i class="fas fa-star"></i>
                    <span>${repo.stargazers_count.toLocaleString()}</span>
                </div>
                <div class="project-meta-item">
                    <i class="fas fa-code-branch"></i>
                    <span>${repo.forks_count.toLocaleString()}</span>
                </div>
                <div class="project-meta-item">
                    <i class="fas fa-eye"></i>
                    <span>${repo.watchers_count.toLocaleString()}</span>
                </div>
                <div class="project-meta-item">
                    <i class="fas fa-calendar"></i>
                    <span>${updatedDate}</span>
                </div>
            </div>
            ${languages.length > 0 ? `
                <div class="project-languages">
                    ${languages.map(lang => `<span class="language-tag">${lang}</span>`).join('')}
                </div>
            ` : ''}
        `;

        return card;
    }

    async showProjectDetails(repo, settings = null) {
        const modal = document.getElementById('projectModal');
        const title = document.getElementById('projectModalTitle');
        const iframe = document.getElementById('projectIframe');
        const projectInfoTitle = document.getElementById('projectInfoTitle');
        const projectInfoDescription = document.getElementById('projectInfoDescription');
        const githubLink = document.getElementById('githubLink');
        const liveSiteLink = document.getElementById('liveSiteLink');
        const embedErrorMsgId = 'embedErrorMsg';

        title.textContent = repo.name;
        // 프로젝트 설정이 전달되지 않은 경우에만 로드
        if (!settings) {
            settings = await this.loadProjectSettings(repo.name);
        }

        // 임베드 실패 안내 메시지 제거
        let embedErrorMsg = document.getElementById(embedErrorMsgId);
        if (embedErrorMsg) embedErrorMsg.remove();

        if (settings && settings.url) {
            iframe.src = settings.url;
            projectInfoTitle.textContent = repo.name;
            projectInfoDescription.textContent = settings.description || repo.description || '설명이 없습니다.';
            liveSiteLink.href = settings.url;
            liveSiteLink.style.display = 'inline-flex';

            // 임베드 실패 감지 (timeout + onerror)
            let embedTimeout = setTimeout(() => {
                this.showEmbedError(liveSiteLink, iframe, embedErrorMsgId, settings.url);
            }, 3000);
            iframe.onload = () => {
                clearTimeout(embedTimeout);
                // 일부 사이트는 onload가 떠도 X-Frame-Options로 차단될 수 있으니, 추가 안내 가능
            };
            iframe.onerror = () => {
                clearTimeout(embedTimeout);
                this.showEmbedError(liveSiteLink, iframe, embedErrorMsgId, settings.url);
            };
        } else {
            iframe.src = 'about:blank';
            projectInfoTitle.textContent = '프로젝트 정보';
            projectInfoDescription.textContent = '이 프로젝트는 아직 도메인 URL이 설정되지 않았습니다. 관리자 계정으로 로그인하여 URL을 설정하세요.';
            liveSiteLink.style.display = 'none';
        }
        githubLink.href = repo.html_url;
        this.openModal(modal);
    }

    showEmbedError(liveSiteLink, iframe, embedErrorMsgId, url) {
        // 안내 메시지 및 새 창에서 열기 버튼 강조
        let errorMsg = document.createElement('div');
        errorMsg.id = embedErrorMsgId;
        errorMsg.style = 'margin: 1rem 0; color: var(--danger-color); font-weight: bold; text-align: center;';
        errorMsg.innerHTML = `이 사이트는 보안 정책(X-Frame-Options/CSP)으로 인해 임베드할 수 없습니다.<br>\n` +
            `<a href="${url}" target="_blank" class="btn btn-primary" style="margin-top: 1rem; font-size: 1.1rem;">새 창에서 열기</a>`;
        iframe.parentNode.insertAdjacentElement('afterend', errorMsg);
    }

    formatSize(size) {
        if (size < 1024) return `${size} KB`;
        if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} MB`;
        return `${(size / (1024 * 1024)).toFixed(1)} GB`;
    }

    toggleView(view) {
        const projectsGrid = document.getElementById('projectsGrid');
        const viewBtns = document.querySelectorAll('.view-btn');

        viewBtns.forEach(btn => btn.classList.remove('active'));
        event.target.closest('.view-btn').classList.add('active');

        if (view === 'list') {
            projectsGrid.classList.add('list-view');
        } else {
            projectsGrid.classList.remove('list-view');
        }
    }

    showSettingsModal() {
        const modal = document.getElementById('settingsModal');
        document.getElementById('githubToken').value = this.settings.githubToken || '';
        document.getElementById('autoRefresh').checked = this.settings.autoRefresh || false;
        
        this.openModal(modal);
    }

    openSettingsModal() {
        this.showSettingsModal();
    }

    closeSettingsModal() {
        this.closeModal(document.getElementById('settingsModal'));
    }

    saveSettings() {
        // this.settings.githubUsername = document.getElementById('githubUsername').value.trim(); // 제거
        this.settings.githubToken = document.getElementById('githubToken').value.trim();
        this.settings.autoRefresh = document.getElementById('autoRefresh').checked;

        localStorage.setItem('githubDashboardSettings', JSON.stringify(this.settings));
        
        this.closeSettingsModal();
        this.setupAutoRefresh();
        
        if (this.settings.githubUsername) {
            this.loadRepositories();
        }
    }

    loadSettings() {
        const saved = localStorage.getItem('githubDashboardSettings');
        return saved ? JSON.parse(saved) : {
            githubToken: '',
            autoRefresh: false
        };
    }

    setupAutoRefresh() {
        if (this.autoRefreshInterval) {
            clearInterval(this.autoRefreshInterval);
        }

        if (this.settings.autoRefresh) {
            this.autoRefreshInterval = setInterval(() => {
                this.loadRepositories();
            }, 5 * 60 * 1000); // 5분
        }
    }

    showLoading(show) {
        const spinner = document.getElementById('loadingSpinner');
        const projectsGrid = document.getElementById('projectsGrid');
        
        if (show) {
            spinner.style.display = 'flex';
            projectsGrid.style.display = 'none';
        } else {
            spinner.style.display = 'none';
            projectsGrid.style.display = 'grid';
        }
    }

    showError(message) {
        const projectsGrid = document.getElementById('projectsGrid');
        projectsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--danger-color);">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                <h3>오류가 발생했습니다</h3>
                <p>${message}</p>
            </div>
        `;
    }

    openModal(modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // 관리자 모드: 임베드 테스트 버튼 추가
    async openAdminModal() {
        await this.loadProjectSelect();
        await this.loadConfiguredProjects();
        await this.loadRegisteredUsers();
        await this.updateSystemStatus();
        this.openModal(document.getElementById('adminModal'));
        // 임베드 테스트 버튼 동적 추가
        let testBtn = document.getElementById('embedTestBtn');
        if (!testBtn) {
            testBtn = document.createElement('button');
            testBtn.id = 'embedTestBtn';
            testBtn.className = 'btn btn-secondary';
            testBtn.innerHTML = '<i class="fas fa-eye"></i> 임베드 테스트';
            testBtn.style = 'margin-top:1rem;';
            testBtn.onclick = () => {
                const projectName = document.getElementById('projectSelect').value;
                if (projectName) {
                    const repo = this.repos.find(r => r.name === projectName);
                    if (repo) this.showProjectDetails(repo);
                } else {
                    alert('테스트할 프로젝트를 선택하세요.');
                }
            };
            document.querySelector('.project-url-settings').appendChild(testBtn);
        }
    }

    async updateSystemStatus() {
        try {
            // 데이터베이스 상태 확인
            const dbStatusElement = document.getElementById('dbStatus');
            try {
                const response = await fetch('/api/project-settings');
                if (response.ok) {
                    dbStatusElement.textContent = '정상';
                    dbStatusElement.className = 'status-value status-ok';
                } else {
                    dbStatusElement.textContent = '오류';
                    dbStatusElement.className = 'status-value status-error';
                }
            } catch (error) {
                dbStatusElement.textContent = '연결 실패';
                dbStatusElement.className = 'status-value status-error';
            }

            // 프로젝트 통계 업데이트
            const totalProjectsElement = document.getElementById('totalProjects');
            const hiddenProjectsElement = document.getElementById('hiddenProjects');
            
            try {
                const projectSettings = await window.projectSettingsAPI.getProjectSettings();
                const totalProjects = projectSettings ? projectSettings.length : 0;
                const hiddenProjects = projectSettings ? projectSettings.filter(p => p.hidden_for_user).length : 0;
                
                            totalProjectsElement.textContent = totalProjects;
            hiddenProjectsElement.textContent = hiddenProjects;
            
            // 사용자 통계 업데이트
            const totalUsersElement = document.getElementById('totalUsers');
            try {
                const response = await fetch('/api/users');
                const result = await response.json();
                if (result.success) {
                    totalUsersElement.textContent = result.data.length;
                } else {
                    totalUsersElement.textContent = '오류';
                }
            } catch (error) {
                totalUsersElement.textContent = '오류';
            }
        } catch (error) {
            totalProjectsElement.textContent = '오류';
            hiddenProjectsElement.textContent = '오류';
        }
        } catch (error) {
            console.error('시스템 상태 업데이트 오류:', error);
        }
    }

    loadProjectSelect() {
        const projectSelect = document.getElementById('projectSelect');
        projectSelect.innerHTML = '<option value="">프로젝트를 선택하세요</option>';
        
        this.repos.forEach(repo => {
            const option = document.createElement('option');
            option.value = repo.name;
            option.textContent = repo.name;
            projectSelect.appendChild(option);
        });
    }

    async loadProjectSettings(projectName) {
        try {
            // Postgres에서 먼저 시도 (실제 저장소)
            const postgresSettings = await window.projectSettingsAPI.getProjectSettings();
            const postgresSetting = postgresSettings.find(setting => setting.project_name === projectName);
            if (postgresSetting) {
                return {
                    url: postgresSetting.url,
                    description: postgresSetting.description,
                    status: postgresSetting.status,
                    hiddenForUser: postgresSetting.hidden_for_user
                };
            }
            
            // Postgres에 없으면 Edge Config에서 시도 (캐시)
            try {
                const edgeSettings = await window.edgeConfigAPI.getProjectSettings();
                const edgeSetting = edgeSettings.find(setting => setting.project_name === projectName);
                if (edgeSetting) {
                    return {
                        url: edgeSetting.url,
                        description: edgeSetting.description,
                        status: edgeSetting.status,
                        hiddenForUser: edgeSetting.hidden_for_user
                    };
                }
            } catch (edgeError) {
                console.log('Edge Config 로드 실패:', edgeError);
            }
            
            return null;
        } catch (error) {
            console.error('Failed to load project settings:', error);
            return null;
        }
    }

    async saveProjectSettings() {
        const projectName = document.getElementById('projectSelect').value;
        const projectUrl = document.getElementById('projectUrl').value;
        const projectDescription = document.getElementById('projectDescription').value;
        const projectStatus = document.getElementById('projectStatus').value;
        const hiddenForUser = document.getElementById('projectHiddenForUser').checked;
        
        if (!projectName) {
            alert('프로젝트를 선택해주세요.');
            return;
        }
        if (!projectUrl) {
            alert('도메인 URL을 입력해주세요.');
            return;
        }
        try {
            new URL(projectUrl);
        } catch {
            alert('올바른 URL을 입력해주세요.');
            return;
        }
        
        try {
            await window.projectSettingsAPI.saveProjectSettings(projectName, {
                url: projectUrl,
                description: projectDescription,
                status: projectStatus,
                hiddenForUser: hiddenForUser
            });
            alert('프로젝트 설정이 저장되었습니다.');
            await this.loadConfiguredProjects();
        } catch (error) {
            console.error('Failed to save project settings:', error);
            alert('프로젝트 설정 저장에 실패했습니다.');
        }
    }

    async deleteProjectSettings() {
        const projectName = document.getElementById('projectSelect').value;
        
        if (!projectName) {
            alert('삭제할 프로젝트를 선택해주세요.');
            return;
        }

        if (!confirm(`"${projectName}" 프로젝트의 설정을 삭제하시겠습니까?`)) {
            return;
        }

        try {
            await window.projectSettingsAPI.deleteProjectSettings(projectName);
            alert('프로젝트 설정이 삭제되었습니다.');
            await this.loadConfiguredProjects();
            this.clearProjectForm();
        } catch (error) {
            console.error('Failed to delete project settings:', error);
            alert('프로젝트 설정 삭제에 실패했습니다.');
        }
    }

    async loadProjectSettingsForForm() {
        const projectName = document.getElementById('projectSelect').value;
        if (!projectName) {
            this.clearProjectForm();
            return;
        }
        const settings = await this.loadProjectSettings(projectName);
        if (settings) {
            document.getElementById('projectUrl').value = settings.url || '';
            document.getElementById('projectDescription').value = settings.description || '';
            document.getElementById('projectStatus').value = settings.status || 'active';
            document.getElementById('projectHiddenForUser').checked = !!settings.hiddenForUser;
        } else {
            this.clearProjectForm();
        }
    }

    clearProjectForm() {
        document.getElementById('projectUrl').value = '';
        document.getElementById('projectDescription').value = '';
        document.getElementById('projectStatus').value = 'active';
        document.getElementById('projectHiddenForUser').checked = false;
    }

    async loadConfiguredProjects() {
        const container = document.getElementById('configuredProjects');
        
        try {
            console.log('설정된 프로젝트 로드 시작...');
            const projectSettings = await window.projectSettingsAPI.getProjectSettings();
            console.log('로드된 프로젝트 설정:', projectSettings);
            
            if (!projectSettings || projectSettings.length === 0) {
                console.log('설정된 프로젝트가 없음');
                container.innerHTML = '<p style="color: var(--text-muted); text-align: center;">설정된 프로젝트가 없습니다.</p>';
                return;
            }

            container.innerHTML = '';

            projectSettings.forEach(setting => {
                const projectItem = document.createElement('div');
                projectItem.className = 'configured-project-item';
                
                const hiddenBadge = setting.hidden_for_user ? 
                    '<span class="hidden-badge" title="일반 사용자에게 숨김"><i class="fas fa-eye-slash"></i> 숨김</span>' : '';
                const statusBadge = setting.status ? 
                    `<span class="status-badge status-${setting.status}" title="상태: ${setting.status}">${setting.status}</span>` : '';
                
                projectItem.innerHTML = `
                    <div class="configured-project-info">
                        <h5>${setting.project_name}</h5>
                        <p>${setting.url}</p>
                        <div class="project-badges">
                            ${hiddenBadge}
                            ${statusBadge}
                        </div>
                        ${setting.description ? `<p class="project-description">${setting.description}</p>` : ''}
                    </div>
                    <div class="configured-project-actions">
                        <button onclick="dashboard.editProjectSettings('${setting.project_name}')" title="편집">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="dashboard.deleteProjectSettingsByName('${setting.project_name}')" title="삭제">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                
                container.appendChild(projectItem);
            });
        } catch (error) {
            console.error('Failed to load configured projects:', error);
            container.innerHTML = '<p style="color: var(--danger-color); text-align: center;">프로젝트 설정을 불러오는데 실패했습니다.</p>';
        }
    }

    async editProjectSettings(projectName) {
        document.getElementById('projectSelect').value = projectName;
        // 직접 값 세팅
        const settings = await this.loadProjectSettings(projectName);
        if (settings) {
            document.getElementById('projectUrl').value = settings.url || '';
            document.getElementById('projectDescription').value = settings.description || '';
            document.getElementById('projectStatus').value = settings.status || 'active';
            document.getElementById('projectHiddenForUser').checked = !!settings.hiddenForUser;
        } else {
            this.clearProjectForm();
        }
    }

    async deleteProjectSettingsByName(projectName) {
        if (!confirm(`프로젝트 "${projectName}"의 설정을 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`)) {
            return;
        }

        try {
            await window.projectSettingsAPI.deleteProjectSettings(projectName);
            alert('프로젝트 설정이 삭제되었습니다.');
            await this.loadConfiguredProjects();
            this.loadRepositories(); // 프로젝트 목록 새로고침
        } catch (error) {
            console.error('Failed to delete project settings:', error);
            alert('프로젝트 설정 삭제에 실패했습니다.');
        }
    }

    async toggleProjectVisibility(projectName) {
        try {
            // 현재 프로젝트 설정 불러오기
            const currentSettings = await this.loadProjectSettings(projectName);
            
            if (!currentSettings) {
                alert('이 프로젝트는 아직 설정이 없습니다. 먼저 프로젝트 설정을 추가해주세요.');
                this.editProjectSettings(projectName);
                return;
            }

            const newHiddenState = !currentSettings.hiddenForUser;
            const action = newHiddenState ? '숨기기' : '보이기';
            
            if (!confirm(`프로젝트 "${projectName}"를 일반 사용자에게 ${action}하시겠습니까?`)) {
                return;
            }

            // 설정 업데이트
            const updatedSettings = {
                ...currentSettings,
                hiddenForUser: newHiddenState
            };

            await window.projectSettingsAPI.saveProjectSettings(projectName, updatedSettings);
            alert(`프로젝트가 일반 사용자에게 ${action}되었습니다.`);
            await this.loadConfiguredProjects();
            this.loadRepositories(); // 프로젝트 목록 새로고침
        } catch (error) {
            console.error('프로젝트 가시성 토글 오류:', error);
            alert('프로젝트 가시성 변경 중 오류가 발생했습니다.');
        }
    }

    async editProjectSettings(projectName) {
        try {
            // 프로젝트 선택 드롭다운에서 해당 프로젝트 선택
            const projectSelect = document.getElementById('projectSelect');
            projectSelect.value = projectName;
            
            // 프로젝트 설정 폼에 데이터 로드
            await this.loadProjectSettingsForForm();
            
            // 관리자 모달 열기
            this.openAdminModal();
            
            // 프로젝트 URL 설정 섹션으로 스크롤
            setTimeout(() => {
                const adminModal = document.getElementById('adminModal');
                const projectUrlSection = adminModal.querySelector('.admin-section');
                if (projectUrlSection) {
                    projectUrlSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        } catch (error) {
            console.error('프로젝트 설정 편집 오류:', error);
            alert('프로젝트 설정 편집 중 오류가 발생했습니다.');
        }
    }

    async bulkHideProjects() {
        const projectNames = prompt('숨길 프로젝트 이름들을 쉼표로 구분하여 입력하세요:');
        if (!projectNames) return;

        const projects = projectNames.split(',').map(name => name.trim()).filter(name => name);
        
        if (!confirm(`${projects.length}개의 프로젝트를 일반 사용자에게 숨기시겠습니까?`)) {
            return;
        }

        let successCount = 0;
        let errorCount = 0;

        for (const projectName of projects) {
            try {
                const currentSettings = await this.loadProjectSettings(projectName);
                if (currentSettings) {
                    const updatedSettings = {
                        ...currentSettings,
                        hiddenForUser: true
                    };

                    await window.projectSettingsAPI.saveProjectSettings(projectName, updatedSettings);
                    successCount++;
                } else {
                    errorCount++;
                }
            } catch (error) {
                errorCount++;
                console.error(`프로젝트 ${projectName} 숨기기 오류:`, error);
            }
        }

        alert(`작업 완료: ${successCount}개 성공, ${errorCount}개 실패`);
        await this.loadConfiguredProjects();
        this.loadRepositories();
    }

    async bulkShowProjects() {
        const projectNames = prompt('보일 프로젝트 이름들을 쉼표로 구분하여 입력하세요:');
        if (!projectNames) return;

        const projects = projectNames.split(',').map(name => name.trim()).filter(name => name);
        
        if (!confirm(`${projects.length}개의 프로젝트를 일반 사용자에게 보이게 하시겠습니까?`)) {
            return;
        }

        let successCount = 0;
        let errorCount = 0;

        for (const projectName of projects) {
            try {
                const currentSettings = await this.loadProjectSettings(projectName);
                if (currentSettings) {
                    const updatedSettings = {
                        ...currentSettings,
                        hiddenForUser: false
                    };

                    await window.projectSettingsAPI.saveProjectSettings(projectName, updatedSettings);
                    successCount++;
                } else {
                    errorCount++;
                }
            } catch (error) {
                errorCount++;
                console.error(`프로젝트 ${projectName} 보이기 오류:`, error);
            }
        }

        alert(`작업 완료: ${successCount}개 성공, ${errorCount}개 실패`);
        await this.loadConfiguredProjects();
        this.loadRepositories();
    }

    // 사용자 관리 메서드들
    async loadRegisteredUsers() {
        const container = document.getElementById('registeredUsers');
        
        try {
            const response = await fetch('/api/users');
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error);
            }
            
            container.innerHTML = '';
            
            if (result.data.length === 0) {
                container.innerHTML = '<p style="color: var(--text-secondary); text-align: center;">등록된 사용자가 없습니다.</p>';
                return;
            }
            
            result.data.forEach(user => {
                const userItem = document.createElement('div');
                userItem.className = 'user-item';
                userItem.innerHTML = `
                    <div class="user-info">
                        <span class="user-name">${user.name}</span>
                        <span class="user-badge ${user.is_admin ? 'admin' : 'user'}">
                            ${user.is_admin ? '관리자' : '사용자'}
                        </span>
                    </div>
                    <div class="user-actions">
                        <button class="user-action-btn toggle-admin" onclick="dashboard.toggleUserAdmin('${user.name}', ${!user.is_admin})">
                            ${user.is_admin ? '일반 사용자로 변경' : '관리자로 변경'}
                        </button>
                        <button class="user-action-btn delete" onclick="dashboard.deleteUser('${user.name}')">
                            삭제
                        </button>
                    </div>
                `;
                
                container.appendChild(userItem);
            });
        } catch (error) {
            console.error('Failed to load users:', error);
            container.innerHTML = '<p style="color: var(--danger-color); text-align: center;">사용자 목록을 불러오는데 실패했습니다.</p>';
        }
    }

    async addUser() {
        const userName = document.getElementById('newUserName').value.trim();
        const isAdmin = document.getElementById('newUserIsAdmin').checked;
        
        if (!userName) {
            alert('사용자 이름을 입력해주세요.');
            return;
        }
        
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: userName,
                    is_admin: isAdmin
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert('사용자가 추가되었습니다.');
                document.getElementById('newUserName').value = '';
                document.getElementById('newUserIsAdmin').checked = false;
                await this.loadRegisteredUsers();
                await this.updateSystemStatus();
            } else {
                alert(result.error || '사용자 추가에 실패했습니다.');
            }
        } catch (error) {
            console.error('Failed to add user:', error);
            alert('사용자 추가 중 오류가 발생했습니다.');
        }
    }

    async toggleUserAdmin(userName, isAdmin) {
        const action = isAdmin ? '관리자로 변경' : '일반 사용자로 변경';
        
        if (!confirm(`사용자 "${userName}"을(를) ${action}하시겠습니까?`)) {
            return;
        }
        
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: userName,
                    is_admin: isAdmin
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert(`사용자 권한이 변경되었습니다.`);
                await this.loadRegisteredUsers();
            } else {
                alert(result.error || '사용자 권한 변경에 실패했습니다.');
            }
        } catch (error) {
            console.error('Failed to toggle user admin:', error);
            alert('사용자 권한 변경 중 오류가 발생했습니다.');
        }
    }

    async deleteUser(userName) {
        if (!confirm(`사용자 "${userName}"을(를) 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`)) {
            return;
        }
        
        try {
            const response = await fetch(`/api/users?name=${encodeURIComponent(userName)}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert('사용자가 삭제되었습니다.');
                await this.loadRegisteredUsers();
                await this.updateSystemStatus();
            } else {
                alert(result.error || '사용자 삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('Failed to delete user:', error);
            alert('사용자 삭제 중 오류가 발생했습니다.');
        }
    }
}

// 애플리케이션 초기화
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new GitHubDashboard();
});

// 접근성 개선을 위한 키보드 이벤트
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal[style*="display: block"]');
        openModals.forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = 'auto';
    }
}); 