// GitHub 대시보드 애플리케이션
class GitHubDashboard {
    constructor() {
        this.repos = [];
        this.filteredRepos = [];
        this.settings = this.loadSettings();
        this.autoRefreshInterval = null;
        this.correctPassword = '0127942'; // 실제 비밀번호
        this.adminPassword = 'Parky096@QZ'; // 관리자 비밀번호
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

        // 관리자 이벤트
        document.getElementById('adminBtn').addEventListener('click', () => {
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

        // 설정 모달 이벤트
        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.openSettingsModal();
        });

        document.getElementById('saveSettings').addEventListener('click', () => {
            this.saveSettings();
        });

        document.getElementById('cancelSettings').addEventListener('click', () => {
            this.closeSettingsModal();
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
            this.loadProjectSettings();
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

    handleLogin() {
        const name = document.getElementById('loginName').value.trim();
        const password = document.getElementById('loginPassword').value;
        const loginError = document.getElementById('loginError');
        const allowedNames = ['성동영', '박상현'];
        if (!allowedNames.includes(name)) {
            loginError.style.display = 'flex';
            loginError.querySelector('span').textContent = '허용된 이름이 아닙니다.';
            document.getElementById('loginPassword').value = '';
            document.getElementById('loginPassword').blur();
            document.getElementById('loginName').focus();
            return;
        }
        // 기존 비밀번호 검증 로직
        if (password === this.adminPassword) {
            sessionStorage.setItem('githubDashboardLoggedIn', 'true');
            sessionStorage.setItem('githubDashboardAdmin', 'true');
            this.isLoggedIn = true;
            this.isAdmin = true;
            this.showDashboard();
            document.getElementById('loginPassword').value = '';
            loginError.style.display = 'none';
        } else if (password === this.correctPassword) {
            sessionStorage.setItem('githubDashboardLoggedIn', 'true');
            sessionStorage.setItem('githubDashboardAdmin', 'false');
            this.isLoggedIn = true;
            this.isAdmin = false;
            this.showDashboard();
            document.getElementById('loginPassword').value = '';
            loginError.style.display = 'none';
        } else {
            loginError.style.display = 'flex';
            loginError.querySelector('span').textContent = '잘못된 이름 또는 비밀번호입니다.';
            document.getElementById('loginPassword').value = '';
            document.getElementById('loginPassword').focus();
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
        
        // 관리자 버튼 표시/숨김
        const adminBtn = document.getElementById('adminBtn');
        if (this.isAdmin) {
            adminBtn.style.display = 'inline-flex';
        } else {
            adminBtn.style.display = 'none';
        }
        
        this.loadRepositories();
        this.setupAutoRefresh();
    }

    showLoginScreen() {
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('dashboardContent').style.display = 'none';
        document.getElementById('loginPassword').focus();
    }

    async loadRepositories() {
        // 항상 pistolinkr 계정 사용
        const username = 'pistolinkr';
        this.settings.githubUsername = username;
        // 이하 기존 코드 유지
        if (!username) {
            this.showSettingsModal();
            return;
        }
        this.showLoading(true);
        try {
            const headers = {};
            if (this.settings.githubToken) {
                headers['Authorization'] = `token ${this.settings.githubToken}`;
            }
            const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
                headers: headers
            });
            if (!response.ok) {
                throw new Error(`GitHub API 오류: ${response.status}`);
            }
            this.repos = await response.json();
            this.filteredRepos = [...this.repos];
            this.updateStatistics();
            this.updateLanguageFilter();
            this.renderProjects();
            this.showLoading(false);
        } catch (error) {
            console.error('프로젝트 로드 오류:', error);
            this.showError('프로젝트를 불러오는 중 오류가 발생했습니다. 설정을 확인해주세요.');
            this.showLoading(false);
        }
    }

    filterRepositories() {
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

        this.renderProjects();
    }

    updateStatistics() {
        // 도메인 URL이 설정된(개시된) 프로젝트만 통계에 포함
        const visibleRepos = this.repos.filter(repo => {
            const settings = this.loadProjectSettings(repo.name);
            return settings && settings.url;
        });

        const totalRepos = visibleRepos.length;
        const totalStars = visibleRepos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
        const totalForks = visibleRepos.reduce((sum, repo) => sum + repo.forks_count, 0);
        const totalWatchers = visibleRepos.reduce((sum, repo) => sum + repo.watchers_count, 0);

        document.getElementById('totalRepos').textContent = totalRepos.toLocaleString();
        document.getElementById('totalStars').textContent = totalStars.toLocaleString();
        document.getElementById('totalForks').textContent = totalForks.toLocaleString();
        document.getElementById('totalWatchers').textContent = totalWatchers.toLocaleString();
    }

    updateLanguageFilter() {
        const languageFilter = document.getElementById('languageFilter');
        // 도메인 URL이 설정된(개시된) 프로젝트만 언어 필터에 포함
        const visibleRepos = this.repos.filter(repo => {
            const settings = this.loadProjectSettings(repo.name);
            return settings && settings.url;
        });
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

    renderProjects() {
        const projectsGrid = document.getElementById('projectsGrid');
        projectsGrid.innerHTML = '';
        // 도메인 URL이 설정된(개시된) 프로젝트만 노출 + 숨김 필터 적용
        const filtered = this.filteredRepos.filter(repo => {
            const settings = this.loadProjectSettings(repo.name);
            if (!settings || !settings.url) return false;
            if (!this.isAdmin && settings.hiddenForUser) return false;
            return true;
        });
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
        filtered.forEach(repo => {
            const card = this.createProjectCard(repo);
            projectsGrid.appendChild(card);
        });
    }

    createProjectCard(repo) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.addEventListener('click', () => this.showProjectDetails(repo));

        const languages = repo.language ? [repo.language] : [];
        const updatedDate = new Date(repo.updated_at).toLocaleDateString('ko-KR');

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
            </div>
            <div class="project-description">
                ${repo.description || '설명이 없습니다.'}
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

    async showProjectDetails(repo) {
        const modal = document.getElementById('projectModal');
        const title = document.getElementById('projectModalTitle');
        const iframe = document.getElementById('projectIframe');
        const projectInfoTitle = document.getElementById('projectInfoTitle');
        const projectInfoDescription = document.getElementById('projectInfoDescription');
        const githubLink = document.getElementById('githubLink');
        const liveSiteLink = document.getElementById('liveSiteLink');
        const embedErrorMsgId = 'embedErrorMsg';

        title.textContent = repo.name;
        // 프로젝트 설정 불러오기
        const projectSettings = this.loadProjectSettings(repo.name);

        // 임베드 실패 안내 메시지 제거
        let embedErrorMsg = document.getElementById(embedErrorMsgId);
        if (embedErrorMsg) embedErrorMsg.remove();

        if (projectSettings && projectSettings.url) {
            iframe.src = projectSettings.url;
            projectInfoTitle.textContent = repo.name;
            projectInfoDescription.textContent = projectSettings.description || repo.description || '설명이 없습니다.';
            liveSiteLink.href = projectSettings.url;
            liveSiteLink.style.display = 'inline-flex';

            // 임베드 실패 감지 (timeout + onerror)
            let embedTimeout = setTimeout(() => {
                this.showEmbedError(liveSiteLink, iframe, embedErrorMsgId, projectSettings.url);
            }, 3000);
            iframe.onload = () => {
                clearTimeout(embedTimeout);
                // 일부 사이트는 onload가 떠도 X-Frame-Options로 차단될 수 있으니, 추가 안내 가능
            };
            iframe.onerror = () => {
                clearTimeout(embedTimeout);
                this.showEmbedError(liveSiteLink, iframe, embedErrorMsgId, projectSettings.url);
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
    openAdminModal() {
        this.loadProjectSelect();
        this.loadConfiguredProjects();
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

    loadProjectSettings(projectName) {
        const settings = localStorage.getItem('projectSettings');
        if (settings) {
            const projectSettings = JSON.parse(settings);
            return projectSettings[projectName];
        }
        return null;
    }

    saveProjectSettings() {
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
        const settings = localStorage.getItem('projectSettings');
        const projectSettings = settings ? JSON.parse(settings) : {};
        projectSettings[projectName] = {
            url: projectUrl,
            description: projectDescription,
            status: projectStatus,
            hiddenForUser: hiddenForUser,
            updatedAt: new Date().toISOString()
        };
        localStorage.setItem('projectSettings', JSON.stringify(projectSettings));
        alert('프로젝트 설정이 저장되었습니다.');
        this.loadConfiguredProjects();
    }

    deleteProjectSettings() {
        const projectName = document.getElementById('projectSelect').value;
        
        if (!projectName) {
            alert('삭제할 프로젝트를 선택해주세요.');
            return;
        }

        if (!confirm(`"${projectName}" 프로젝트의 설정을 삭제하시겠습니까?`)) {
            return;
        }

        const settings = localStorage.getItem('projectSettings');
        if (settings) {
            const projectSettings = JSON.parse(settings);
            delete projectSettings[projectName];
            localStorage.setItem('projectSettings', JSON.stringify(projectSettings));
        }

        alert('프로젝트 설정이 삭제되었습니다.');
        this.loadConfiguredProjects();
        this.clearProjectForm();
    }

    loadProjectSettings() {
        const projectName = document.getElementById('projectSelect').value;
        if (!projectName) {
            this.clearProjectForm();
            return;
        }
        const settings = this.loadProjectSettings(projectName);
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

    loadConfiguredProjects() {
        const container = document.getElementById('configuredProjects');
        const settings = localStorage.getItem('projectSettings');
        
        if (!settings) {
            container.innerHTML = '<p style="color: var(--text-muted); text-align: center;">설정된 프로젝트가 없습니다.</p>';
            return;
        }

        const projectSettings = JSON.parse(settings);
        container.innerHTML = '';

        Object.keys(projectSettings).forEach(projectName => {
            const setting = projectSettings[projectName];
            const projectItem = document.createElement('div');
            projectItem.className = 'configured-project-item';
            
            const hiddenBadge = setting.hiddenForUser ? 
                '<span class="hidden-badge" title="일반 사용자에게 숨김"><i class="fas fa-eye-slash"></i> 숨김</span>' : '';
            const statusBadge = setting.status ? 
                `<span class="status-badge status-${setting.status}" title="상태: ${setting.status}">${setting.status}</span>` : '';
            
            projectItem.innerHTML = `
                <div class="configured-project-info">
                    <h5>${projectName}</h5>
                    <p>${setting.url}</p>
                    <div class="project-badges">
                        ${hiddenBadge}
                        ${statusBadge}
                    </div>
                    ${setting.description ? `<p class="project-description">${setting.description}</p>` : ''}
                </div>
                <div class="configured-project-actions">
                    <button onclick="dashboard.editProjectSettings('${projectName}')" title="편집">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="dashboard.deleteProjectSettingsByName('${projectName}')" title="삭제">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            container.appendChild(projectItem);
        });
    }

    editProjectSettings(projectName) {
        document.getElementById('projectSelect').value = projectName;
        // 직접 값 세팅
        const settings = this.loadProjectSettings(projectName);
        if (settings) {
            document.getElementById('projectUrl').value = settings.url || '';
            document.getElementById('projectDescription').value = settings.description || '';
            document.getElementById('projectStatus').value = settings.status || 'active';
            document.getElementById('projectHiddenForUser').checked = !!settings.hiddenForUser;
        } else {
            this.clearProjectForm();
        }
    }

    deleteProjectSettingsByName(projectName) {
        if (!confirm(`"${projectName}" 프로젝트의 설정을 삭제하시겠습니까?`)) {
            return;
        }

        const settings = localStorage.getItem('projectSettings');
        if (settings) {
            const projectSettings = JSON.parse(settings);
            delete projectSettings[projectName];
            localStorage.setItem('projectSettings', JSON.stringify(projectSettings));
        }

        this.loadConfiguredProjects();
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