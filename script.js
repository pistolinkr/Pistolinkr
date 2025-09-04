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
        this.setupI18n();
        this.setupEmailJS();
    }

    setupI18n() {
        // 언어 변경 이벤트 리스너
        document.addEventListener('localeChanged', () => {
            this.updatePageTranslations();
        });
        
        // 초기 번역 적용
        this.updatePageTranslations();
    }

    setupEmailJS() {
        // EmailJS 설정 초기화 (개발자가 미리 설정한 값 사용)
        if (window.EmailJSConfig) {
            // 환경 변수나 기본 설정에서 EmailJS 키 가져오기
            const publicKey = process.env.EMAILJS_PUBLIC_KEY || 'YOUR_EMAILJS_PUBLIC_KEY';
            const serviceId = process.env.EMAILJS_SERVICE_ID || 'YOUR_EMAILJS_SERVICE_ID';
            const templateId = process.env.EMAILJS_TEMPLATE_ID || 'YOUR_EMAILJS_TEMPLATE_ID';
            
            // 실제 키가 설정된 경우에만 초기화
            if (publicKey !== 'YOUR_EMAILJS_PUBLIC_KEY') {
                window.EmailJSConfig.updateConfig(publicKey, serviceId, templateId);
                console.log('EmailJS 설정이 초기화되었습니다.');
            } else {
                console.warn('EmailJS 설정이 완료되지 않았습니다. 피드백 기능이 작동하지 않을 수 있습니다.');
            }
        }
    }

    updatePageTranslations() {
        // data-i18n 속성이 있는 모든 요소 번역
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = window.i18n.t(key);
            if (translation && translation !== key) {
                element.textContent = translation;
            }
        });

        // data-i18n-placeholder 속성이 있는 모든 요소 번역
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = window.i18n.t(key);
            if (translation && translation !== key) {
                element.placeholder = translation;
            }
        });

        // 동적으로 생성된 요소들도 번역
        this.updateDynamicTranslations();
    }

    updateDynamicTranslations() {
        // 언어 필터 옵션 업데이트
        const languageFilter = document.getElementById('languageFilter');
        if (languageFilter) {
            const allLanguagesOption = languageFilter.querySelector('option[value=""]');
            if (allLanguagesOption) {
                allLanguagesOption.textContent = window.i18n.t('search.languageFilter');
            }
        }

        // 정렬 필터 옵션 업데이트
        const sortFilter = document.getElementById('sortFilter');
        if (sortFilter) {
            const options = sortFilter.querySelectorAll('option');
            options.forEach(option => {
                const value = option.value;
                if (value === 'updated') {
                    option.textContent = window.i18n.t('search.sortOptions.updated');
                } else if (value === 'created') {
                    option.textContent = window.i18n.t('search.sortOptions.created');
                } else if (value === 'name') {
                    option.textContent = window.i18n.t('search.sortOptions.name');
                } else if (value === 'stars') {
                    option.textContent = window.i18n.t('search.sortOptions.stars');
                }
            });
        }
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

        // 피드백 모달 이벤트
        document.getElementById('feedbackLink').addEventListener('click', (e) => {
            e.preventDefault();
            this.openFeedbackModal();
        });

        document.getElementById('cancelFeedback').addEventListener('click', () => {
            this.closeFeedbackModal();
        });

        document.getElementById('sendFeedback').addEventListener('click', () => {
            this.sendFeedback();
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

        // 사용자 관리 이벤트 - 지연 등록
        this.setupUserManagementEvents();

        // 새로운 네비게이션 버튼 이벤트
        document.getElementById('analyticsBtn').addEventListener('click', () => {
            this.openAnalyticsModal();
        });

        document.getElementById('mobileAnalyticsBtn').addEventListener('click', () => {
            this.openAnalyticsModal();
        });

        document.getElementById('favoritesBtn').addEventListener('click', () => {
            this.openFavoritesModal();
        });

        document.getElementById('mobileFavoritesBtn').addEventListener('click', () => {
            this.openFavoritesModal();
        });

        document.getElementById('notificationsBtn').addEventListener('click', () => {
            this.openNotificationsModal();
        });

        document.getElementById('mobileNotificationsBtn').addEventListener('click', () => {
            this.openNotificationsModal();
        });

        // 즐겨찾기 모달 이벤트
        document.getElementById('saveFavorites').addEventListener('click', () => {
            this.saveFavoritesSettings();
        });

        document.getElementById('cancelFavorites').addEventListener('click', () => {
            this.closeFavoritesModal();
        });

        // 알림 모달 이벤트
        document.getElementById('saveNotifications').addEventListener('click', () => {
            this.saveNotificationSettings();
        });

        document.getElementById('cancelNotifications').addEventListener('click', () => {
            this.closeNotificationsModal();
        });

        document.getElementById('markAllRead').addEventListener('click', () => {
            this.markAllNotificationsAsRead();
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
            
            console.log('Calling GitHub API:', `https://api.github.com/users/${username}/repos`);
            
            const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
                headers: headers
            });
            
            console.log('GitHub API response status:', response.status);
            
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
            console.log('Number of repositories loaded:', this.repos.length);
            
            this.filteredRepos = [...this.repos];
            await this.updateStatistics();
            await this.updateLanguageFilter();
            await this.renderProjects();
            this.showLoading(false);
            this.updateFooterLastUpdate();
            
        } catch (error) {
            console.error('프로젝트 로드 오류:', error);
            this.showError(`Error occurred while loading projects: ${error.message}`);
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
        
        console.log('Number of repositories to render:', this.filteredRepos.length);
        
        // 모든 프로젝트 설정을 한 번에 로드 (성능 최적화)
        let allProjectSettings = [];
        try {
            // Postgres에서 먼저 시도 (실제 저장소)
            allProjectSettings = await window.projectSettingsAPI.getProjectSettings();
            console.log('Project settings loaded from Postgres:', allProjectSettings.length);
        } catch (error) {
            console.log('Postgres load failed, trying Edge Config:', error);
            try {
                allProjectSettings = await window.edgeConfigAPI.getProjectSettings();
                console.log('Project settings loaded from Edge Config:', allProjectSettings.length);
            } catch (edgeError) {
                console.log('Edge Config load also failed:', edgeError);
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
                console.log(`Repository "${repo.name}" - duplicate removed`);
                continue;
            }
            processedRepos.add(repo.name);
            
            const settings = settingsMap.get(repo.name);
            console.log(`Repository "${repo.name}" settings:`, settings);
            
            // URL이 설정된 프로젝트만 표시
            if (!settings || !settings.url) {
                console.log(`Repository "${repo.name}" - no URL, skipping`);
                continue;
            }
            if (!this.isAdmin && settings.hiddenForUser) {
                console.log(`Repository "${repo.name}" - hidden from regular users, skipping`);
                continue;
            }
            console.log(`Repository "${repo.name}" - displayed`);
            filtered.push({ repo, settings });
        }
        
        console.log('Final filtered repository count:', filtered.length);
        
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
        
        // 현재 언어 설정 로드
        if (window.i18n) {
            const currentLocale = window.i18n.getCurrentLocale();
            const languageSelect = document.getElementById('languageSetting');
            if (languageSelect) {
                languageSelect.value = currentLocale;
            }
        }
        

        
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
        
        // 언어 설정 저장
        const languageSetting = document.getElementById('languageSetting').value;
        if (window.i18n && languageSetting !== window.i18n.getCurrentLocale()) {
            window.i18n.setLocale(languageSetting);
        }

        localStorage.setItem('githubDashboardSettings', JSON.stringify(this.settings));
        
        this.closeSettingsModal();
        this.setupAutoRefresh();
        this.updateFooterLastUpdate();
        
        if (this.settings.githubUsername) {
            this.loadRepositories();
        }
    }

    updateFooterLastUpdate() {
        const lastUpdateElement = document.getElementById('lastUpdateTime');
        if (lastUpdateElement) {
            const now = new Date();
            const timeString = now.toLocaleTimeString();
            lastUpdateElement.textContent = timeString;
        }
    }

    openFeedbackModal() {
        const modal = document.getElementById('feedbackModal');
        this.openModal(modal);
    }

    closeFeedbackModal() {
        const modal = document.getElementById('feedbackModal');
        this.closeModal(modal);
        this.clearFeedbackForm();
    }

    clearFeedbackForm() {
        document.getElementById('feedbackName').value = '';
        document.getElementById('feedbackEmail').value = '';
        document.getElementById('feedbackType').value = 'general';
        document.getElementById('feedbackSubject').value = '';
        document.getElementById('feedbackMessage').value = '';
    }

    async sendFeedback() {
        const name = document.getElementById('feedbackName').value.trim();
        const email = document.getElementById('feedbackEmail').value.trim();
        const type = document.getElementById('feedbackType').value;
        const subject = document.getElementById('feedbackSubject').value.trim();
        const message = document.getElementById('feedbackMessage').value.trim();

        // 유효성 검사
        if (!name || !email || !subject || !message) {
            this.showError(window.i18n.t('feedback.validationError'));
            return;
        }

        // 이메일 형식 검사
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showError('Please enter a valid email address.');
            return;
        }

        // 전송 버튼 비활성화 및 로딩 표시
        const sendButton = document.getElementById('sendFeedback');
        const originalText = sendButton.textContent;
        sendButton.disabled = true;
        sendButton.textContent = '전송 중...';

        try {
            // EmailJS 초기화
            if (window.EmailJSConfig) {
                window.EmailJSConfig.init();
            }

            // 피드백 유형 라벨
            const typeLabels = {
                general: window.i18n.t('feedback.typeGeneral'),
                bug: window.i18n.t('feedback.typeBug'),
                feature: window.i18n.t('feedback.typeFeature'),
                improvement: window.i18n.t('feedback.typeImprovement')
            };

            const typeLabel = typeLabels[type] || type;

            // 피드백 데이터 구성
            const feedbackData = {
                name,
                email,
                type: typeLabel,
                subject,
                message
            };

            // EmailJS 템플릿 파라미터 생성
            const templateParams = window.EmailJSConfig.createTemplateParams(feedbackData);

            // EmailJS를 사용하여 이메일 전송
            const response = await emailjs.send(
                window.EmailJSConfig.SERVICE_ID,
                window.EmailJSConfig.TEMPLATE_ID,
                templateParams
            );

            if (response.status === 200) {
                // 성공 메시지 표시
                this.showSuccess(window.i18n.t('feedback.success'));
                
                // 모달 닫기
                this.closeFeedbackModal();
            } else {
                // 오류 메시지 표시
                this.showError(window.i18n.t('feedback.error'));
            }
            
        } catch (error) {
            console.error('피드백 전송 오류:', error);
            this.showError(window.i18n.t('feedback.error'));
        } finally {
            // 버튼 상태 복원
            sendButton.disabled = false;
            sendButton.textContent = originalText;
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
        console.log('Opening admin modal...');
        
        await this.loadProjectSelect();
        await this.loadConfiguredProjects();
        await this.loadRegisteredUsers();
        await this.updateSystemStatus();
        
        const adminModal = document.getElementById('adminModal');
        if (!adminModal) {
            console.error('Admin modal not found');
            return;
        }
        
        this.openModal(adminModal);
        
        // 사용자 추가 폼 요소들 확인
        const userNameInput = document.getElementById('newUserName');
        const isAdminInput = document.getElementById('newUserIsAdmin');
        const addUserBtn = document.getElementById('addUser');
        
        console.log('User form elements:', {
            userNameInput: !!userNameInput,
            isAdminInput: !!isAdminInput,
            addUserBtn: !!addUserBtn
        });
        
        // 사용자 관리 이벤트 다시 설정
        this.setupUserManagementEvents();
        
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
                    alert('Please select a project to test.');
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
                console.log('Edge Config load failed:', edgeError);
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
            alert('Please select a project.');
            return;
        }
        if (!projectUrl) {
            alert('Please enter a domain URL.');
            return;
        }
        try {
            new URL(projectUrl);
        } catch {
            alert('Please enter a valid URL.');
            return;
        }
        
        try {
            await window.projectSettingsAPI.saveProjectSettings(projectName, {
                url: projectUrl,
                description: projectDescription,
                status: projectStatus,
                hiddenForUser: hiddenForUser
            });
            alert('Project settings have been saved.');
            await this.loadConfiguredProjects();
        } catch (error) {
            console.error('Failed to save project settings:', error);
            alert('Failed to save project settings.');
        }
    }

    async deleteProjectSettings() {
        const projectName = document.getElementById('projectSelect').value;
        
        if (!projectName) {
            alert('Please select a project to delete.');
            return;
        }

        if (!confirm(`"${projectName}" 프로젝트의 설정을 삭제하시겠습니까?`)) {
            return;
        }

        try {
            await window.projectSettingsAPI.deleteProjectSettings(projectName);
            alert('Project settings have been deleted.');
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
            alert('Project settings have been deleted.');
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
                alert('This project has no settings yet. Please add project settings first.');
                this.editProjectSettings(projectName);
                return;
            }

            const newHiddenState = !currentSettings.hiddenForUser;
            const action = newHiddenState ? 'hide' : 'show';
            
            if (!confirm(`Do you want to ${action} project "${projectName}" from regular users?`)) {
                return;
            }

            // 설정 업데이트
            const updatedSettings = {
                ...currentSettings,
                hiddenForUser: newHiddenState
            };

            await window.projectSettingsAPI.saveProjectSettings(projectName, updatedSettings);
            alert(`Project has been ${action}ed from regular users.`);
            await this.loadConfiguredProjects();
            this.loadRepositories(); // 프로젝트 목록 새로고침
        } catch (error) {
            console.error('프로젝트 가시성 토글 오류:', error);
            alert('An error occurred while changing project visibility.');
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
            alert('An error occurred while editing project settings.');
        }
    }

    async bulkHideProjects() {
        const projectNames = prompt('Enter project names to hide, separated by commas:');
        if (!projectNames) return;

        const projects = projectNames.split(',').map(name => name.trim()).filter(name => name);
        
        if (!confirm(`Do you want to hide ${projects.length} projects from regular users?`)) {
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
        const projectNames = prompt('Enter project names to show, separated by commas:');
        if (!projectNames) return;

        const projects = projectNames.split(',').map(name => name.trim()).filter(name => name);
        
        if (!confirm(`Do you want to show ${projects.length} projects to regular users?`)) {
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
            
            // 로컬 저장소에서도 사용자 목록을 가져와서 병합
            const localUsers = JSON.parse(localStorage.getItem('localUsers') || '[]');
            
            // 기본 사용자 목록 (API 실패 시 fallback)
            const defaultUsers = [
                { name: '성동영', is_admin: false },
                { name: '박상현', is_admin: false },
                { name: '조훈', is_admin: false },
                { name: '박지윤', is_admin: false },
                { name: 'Aventa R. Sevena', is_admin: true }
            ];
            
            const allUsers = [...result.data, ...localUsers, ...defaultUsers];
            
            // 중복 제거 (이름 기준)
            const uniqueUsers = allUsers.filter((user, index, self) => 
                index === self.findIndex(u => u.name === user.name)
            );
            
            if (uniqueUsers.length === 0) {
                container.innerHTML = '<p style="color: var(--text-secondary); text-align: center;">No registered users.</p>';
                return;
            }
            
            uniqueUsers.forEach(user => {
                const userItem = document.createElement('div');
                userItem.className = 'user-item';
                userItem.innerHTML = `
                    <div class="user-info">
                        <span class="user-name">${user.name}</span>
                        <span class="user-badge ${user.is_admin ? 'admin' : 'user'}">
                            ${user.is_admin ? 'Admin' : 'User'}
                        </span>
                    </div>
                    <div class="user-actions">
                        <button class="user-action-btn toggle-admin" onclick="dashboard.toggleUserAdmin('${user.name}', ${!user.is_admin})">
                            ${user.is_admin ? 'Change to Regular User' : 'Change to Admin'}
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
        console.log('addUser function called');
        
        const userNameInput = document.getElementById('newUserName');
        const isAdminInput = document.getElementById('newUserIsAdmin');
        
        if (!userNameInput) {
            console.error('newUserName input not found');
            this.showError('User name input field not found.');
            return;
        }
        
        if (!isAdminInput) {
            console.error('newUserIsAdmin checkbox not found');
            this.showError('관리자 권한 체크박스를 찾을 수 없습니다.');
            return;
        }
        
        const userName = userNameInput.value.trim();
        const isAdmin = isAdminInput.checked;
        
        console.log('User input values:', { userName, isAdmin });
        
        if (!userName) {
            console.log('User name is empty');
            this.showError('사용자 이름을 입력해주세요.');
            return;
        }
        
        try {
            console.log('Sending request to add user:', { userName, isAdmin });
            
            // API 엔드포인트 확인
            const apiUrl = '/api/users';
            console.log('API URL:', apiUrl);
            
            const requestBody = {
                name: userName,
                is_admin: isAdmin
            };
            console.log('Request body:', requestBody);
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });
            
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Response error text:', errorText);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }
            
            const result = await response.json();
            console.log('Response result:', result);
            
            if (result.success) {
                // API 응답에 message가 있으면 로컬 저장소에도 저장
                if (result.data && result.data.message) {
                    const localUsers = JSON.parse(localStorage.getItem('localUsers') || '[]');
                    const newUser = {
                        name: userName,
                        is_admin: isAdmin,
                        id: Date.now() // 임시 ID
                    };
                    localUsers.push(newUser);
                    localStorage.setItem('localUsers', JSON.stringify(localUsers));
                }
                
                this.showSuccess('사용자가 추가되었습니다.');
                userNameInput.value = '';
                isAdminInput.checked = false;
                
                // 사용자 목록 새로고침
                try {
                    await this.loadRegisteredUsers();
                    await this.updateSystemStatus();
                } catch (refreshError) {
                    console.error('Failed to refresh user list:', refreshError);
                }
            } else {
                this.showError(result.error || '사용자 추가에 실패했습니다.');
            }
        } catch (error) {
            console.error('Failed to add user:', error);
            this.showError(`사용자 추가 중 오류가 발생했습니다: ${error.message}`);
            
            // 네트워크 오류인 경우 로컬 저장소에 저장
            if (error.message.includes('fetch') || error.message.includes('network')) {
                console.log('Network error detected, saving to local storage');
                const localUsers = JSON.parse(localStorage.getItem('localUsers') || '[]');
                const newUser = {
                    name: userName,
                    is_admin: isAdmin,
                    id: Date.now()
                };
                localUsers.push(newUser);
                localStorage.setItem('localUsers', JSON.stringify(localUsers));
                this.showSuccess('네트워크 오류로 로컬에 저장되었습니다.');
                
                try {
                    await this.loadRegisteredUsers();
                } catch (refreshError) {
                    console.error('Failed to refresh user list after local save:', refreshError);
                }
            }
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

    // 분석 모달 메서드들
    async openAnalyticsModal() {
        await this.loadAnalyticsData();
        this.openModal(document.getElementById('analyticsModal'));
    }

    async loadAnalyticsData() {
        try {
            // 언어별 통계 계산
            const languageStats = this.calculateLanguageStats();
            this.updateLanguageChart(languageStats);
            
            // 활동 추이 계산
            const activityStats = this.calculateActivityStats();
            this.updateActivityChart(activityStats);
            
            // 인기 프로젝트 계산
            const popularProjects = this.getPopularProjects();
            this.updatePopularProjects(popularProjects);
            
            // 성과 지표 계산
            this.updateMetrics();
        } catch (error) {
            console.error('분석 데이터 로드 오류:', error);
        }
    }

    calculateLanguageStats() {
        const languageCount = {};
        this.repos.forEach(repo => {
            if (repo.language) {
                languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
            }
        });
        
        return Object.entries(languageCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([language, count]) => ({ language, count }));
    }

    calculateActivityStats() {
        const now = new Date();
        const last30Days = Array.from({length: 30}, (_, i) => {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            return date.toISOString().split('T')[0];
        }).reverse();

        return last30Days.map(date => ({
            date,
            count: Math.floor(Math.random() * 5) // 임시 데이터
        }));
    }

    getPopularProjects() {
        return this.repos
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 5);
    }

    updateLanguageChart(languageStats) {
        const container = document.getElementById('languageChart');
        container.innerHTML = `
            <div class="chart-placeholder">
                <h5>언어별 프로젝트 분포</h5>
                <div class="language-stats">
                    ${languageStats.map(stat => `
                        <div class="language-stat">
                            <span class="language-name">${stat.language}</span>
                            <span class="language-count">${stat.count}개</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    updateActivityChart(activityStats) {
        const container = document.getElementById('activityChart');
        container.innerHTML = `
            <div class="chart-placeholder">
                <h5>최근 30일 활동 추이</h5>
                <div class="activity-stats">
                    ${activityStats.map(stat => `
                        <div class="activity-bar" style="height: ${stat.count * 10}px" title="${stat.date}: ${stat.count}개 활동"></div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    updatePopularProjects(popularProjects) {
        const container = document.getElementById('popularProjects');
        container.innerHTML = popularProjects.map(project => `
            <div class="popular-project">
                <div class="project-info">
                    <h5>${project.name}</h5>
                    <p>${project.description || '설명 없음'}</p>
                </div>
                <div class="project-stats">
                    <span class="stat">⭐ ${project.stargazers_count}</span>
                    <span class="stat">🍴 ${project.forks_count}</span>
                </div>
            </div>
        `).join('');
    }

    updateMetrics() {
        const avgStars = this.repos.length > 0 
            ? Math.round(this.repos.reduce((sum, repo) => sum + repo.stargazers_count, 0) / this.repos.length)
            : 0;
        
        const avgForks = this.repos.length > 0
            ? Math.round(this.repos.reduce((sum, repo) => sum + repo.forks_count, 0) / this.repos.length)
            : 0;

        const languageStats = this.calculateLanguageStats();
        const topLanguage = languageStats.length > 0 ? languageStats[0].language : '-';

        document.getElementById('avgStars').textContent = avgStars;
        document.getElementById('avgForks').textContent = avgForks;
        document.getElementById('topLanguage').textContent = topLanguage;
        document.getElementById('recentActivity').textContent = '활성';
    }

    // 즐겨찾기 모달 메서드들
    openFavoritesModal() {
        this.loadFavorites();
        this.openModal(document.getElementById('favoritesModal'));
    }

    closeFavoritesModal() {
        this.closeModal(document.getElementById('favoritesModal'));
    }

    loadFavorites() {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const container = document.getElementById('favoritesList');
        
        if (favorites.length === 0) {
            container.innerHTML = '<p style="color: var(--text-secondary); text-align: center;">즐겨찾기한 프로젝트가 없습니다.</p>';
            return;
        }

        container.innerHTML = favorites.map(favorite => `
            <div class="favorite-item">
                <div class="favorite-info">
                    <h5>${favorite.name}</h5>
                    <p>${favorite.description || '설명 없음'}</p>
                </div>
                <div class="favorite-actions">
                    <button class="btn btn-sm btn-secondary" onclick="dashboard.openProject('${favorite.name}')">
                        <i class="fas fa-external-link-alt"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="dashboard.removeFavorite('${favorite.name}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    saveFavoritesSettings() {
        const autoFavoriteNew = document.getElementById('autoFavoriteNew').checked;
        const showFavoritesFirst = document.getElementById('showFavoritesFirst').checked;
        
        localStorage.setItem('favoritesSettings', JSON.stringify({
            autoFavoriteNew,
            showFavoritesFirst
        }));

        this.closeFavoritesModal();
        this.showSuccess('즐겨찾기 설정이 저장되었습니다.');
    }

    addToFavorites(projectName) {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const project = this.repos.find(repo => repo.name === projectName);
        
        if (project && !favorites.find(f => f.name === projectName)) {
            favorites.push({
                name: project.name,
                description: project.description,
                url: project.html_url
            });
            localStorage.setItem('favorites', JSON.stringify(favorites));
            this.showSuccess('즐겨찾기에 추가되었습니다.');
        }
    }

    removeFavorite(projectName) {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const updatedFavorites = favorites.filter(f => f.name !== projectName);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        this.loadFavorites();
        this.showSuccess('즐겨찾기에서 제거되었습니다.');
    }

    // 알림 모달 메서드들
    openNotificationsModal() {
        this.loadNotifications();
        this.openModal(document.getElementById('notificationsModal'));
    }

    closeNotificationsModal() {
        this.closeModal(document.getElementById('notificationsModal'));
    }

    loadNotifications() {
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        const container = document.getElementById('notificationsList');
        
        if (notifications.length === 0) {
            container.innerHTML = '<p style="color: var(--text-secondary); text-align: center;">알림이 없습니다.</p>';
            return;
        }

        container.innerHTML = notifications.map(notification => `
            <div class="notification-item ${notification.read ? '' : 'unread'}">
                <div class="notification-icon ${notification.type}">
                    <i class="fas ${this.getNotificationIcon(notification.type)}"></i>
                </div>
                <div class="notification-content">
                    <h5>${notification.title}</h5>
                    <p>${notification.message}</p>
                    <div class="notification-time">${this.formatTime(notification.timestamp)}</div>
                </div>
            </div>
        `).join('');
    }

    getNotificationIcon(type) {
        const icons = {
            info: 'fa-info',
            success: 'fa-check',
            warning: 'fa-exclamation-triangle',
            error: 'fa-times'
        };
        return icons[type] || 'fa-bell';
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return '방금 전';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}분 전`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}시간 전`;
        return date.toLocaleDateString();
    }

    saveNotificationSettings() {
        const notifyNewStars = document.getElementById('notifyNewStars').checked;
        const notifyNewForks = document.getElementById('notifyNewForks').checked;
        const notifyUpdates = document.getElementById('notifyUpdates').checked;
        const notifySystem = document.getElementById('notifySystem').checked;
        
        localStorage.setItem('notificationSettings', JSON.stringify({
            notifyNewStars,
            notifyNewForks,
            notifyUpdates,
            notifySystem
        }));

        this.closeNotificationsModal();
        this.showSuccess('알림 설정이 저장되었습니다.');
    }

    markAllNotificationsAsRead() {
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        const updatedNotifications = notifications.map(notification => ({
            ...notification,
            read: true
        }));
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
        this.loadNotifications();
        this.showSuccess('모든 알림을 읽음 처리했습니다.');
    }

    addNotification(title, message, type = 'info') {
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        notifications.unshift({
            id: Date.now(),
            title,
            message,
            type,
            timestamp: new Date().toISOString(),
            read: false
        });
        
        // 최대 50개까지만 유지
        if (notifications.length > 50) {
            notifications.splice(50);
        }
        
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }

    showSuccess(message) {
        this.addNotification('성공', message, 'success');
        // 간단한 토스트 메시지 표시
        const toast = document.createElement('div');
        toast.className = 'toast success';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    showError(message) {
        this.addNotification('오류', message, 'error');
        console.error(message);
        
        // 사용자에게 즉시 피드백 제공
        const toast = document.createElement('div');
        toast.className = 'toast error';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 5000);
    }

    setupUserManagementEvents() {
        console.log('Setting up user management events...');
        
        // 사용자 추가 버튼 이벤트
        const addUserBtn = document.getElementById('addUser');
        if (addUserBtn) {
            console.log('addUser button found, adding event listener');
            
            // 기존 이벤트 리스너 제거 (중복 방지)
            addUserBtn.removeEventListener('click', this.handleAddUserClick);
            
            // 새로운 이벤트 리스너 추가
            addUserBtn.addEventListener('click', this.handleAddUserClick);
        } else {
            console.error('addUser button not found');
        }
    }

    handleAddUserClick = (e) => {
        console.log('addUser button clicked', e);
        e.preventDefault();
        e.stopPropagation();
        
        // 간단한 테스트
        alert('사용자 추가 버튼이 클릭되었습니다!');
        
        // 비동기 함수 호출
        this.addUser().catch(error => {
            console.error('Error in addUser:', error);
            this.showError('사용자 추가 중 오류가 발생했습니다: ' + error.message);
        });
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