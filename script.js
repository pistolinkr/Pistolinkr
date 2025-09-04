// GitHub 대시보드 애플리케이션
class GitHubDashboard {
    constructor() {
        this.repos = [];
        this.filteredRepos = [];
        this.settings = this.loadSettings();
        this.autoRefreshInterval = null;
        this.firebaseDB = null;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupI18n();
        this.setupEmailJS();
        this.setupFirebase();
        this.showDashboard(); // 바로 대시보드 표시
    }

    setupFirebase() {
        // Firebase 데이터베이스 초기화
        if (window.firebaseDB) {
            this.firebaseDB = window.firebaseDB;
        } else {
            console.warn('Firebase 데이터베이스가 초기화되지 않았습니다.');
        }
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
        // EmailJS 설정 초기화
        if (window.EmailJSConfig) {
            const emailjsConfig = window.appConfig.getEmailJSConfig();
            if (emailjsConfig.publicKey !== 'your_emailjs_public_key') {
                window.EmailJSConfig.updateConfig(
                    emailjsConfig.publicKey,
                    emailjsConfig.serviceId,
                    emailjsConfig.templateId
                );
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
        // 이벤트 바인딩
        document.addEventListener('DOMContentLoaded', () => {
            this.bindDashboardEvents();
        });
    }

    bindDashboardEvents() {
        // 새로고침 버튼
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshData();
            });
        }

        // 검색 기능
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // 필터 기능
        const languageFilter = document.getElementById('languageFilter');
        if (languageFilter) {
            languageFilter.addEventListener('change', (e) => {
                this.handleLanguageFilter(e.target.value);
            });
        }

        const sortFilter = document.getElementById('sortFilter');
        if (sortFilter) {
            sortFilter.addEventListener('change', (e) => {
                this.handleSortFilter(e.target.value);
            });
        }

        // 설정 버튼
        const settingsBtn = document.getElementById('settingsBtn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                this.showSettings();
            });
        }

        // 분석 버튼
        const analyticsBtn = document.getElementById('analyticsBtn');
        if (analyticsBtn) {
            analyticsBtn.addEventListener('click', () => {
                this.showAnalytics();
            });
        }

        // 즐겨찾기 버튼
        const favoritesBtn = document.getElementById('favoritesBtn');
        if (favoritesBtn) {
            favoritesBtn.addEventListener('click', () => {
                this.showFavorites();
            });
        }

        // 알림 버튼
        const notificationsBtn = document.getElementById('notificationsBtn');
        if (notificationsBtn) {
            notificationsBtn.addEventListener('click', () => {
                this.showNotifications();
            });
        }
    }

    showDashboard() {
        // 로그인 화면 숨기고 대시보드 표시
        const loginScreen = document.getElementById('loginScreen');
        const dashboardContent = document.getElementById('dashboardContent');
        
        if (loginScreen) loginScreen.style.display = 'none';
        if (dashboardContent) dashboardContent.style.display = 'block';
        
        document.body.classList.remove('login-active');
        
        // 데이터 로드
        this.loadData();
    }

    async loadData() {
        try {
            // GitHub API에서 데이터 가져오기
            await this.fetchGitHubData();
            
            // Firebase에서 저장된 데이터 가져오기
            if (this.firebaseDB) {
                const result = await this.firebaseDB.getProjects();
                if (result.success) {
                    console.log('Firebase에서 프로젝트 데이터를 가져왔습니다:', result.data);
                }
            }
            
            this.renderDashboard();
        } catch (error) {
            console.error('데이터 로드 오류:', error);
            this.showError('데이터를 불러오는 중 오류가 발생했습니다.');
        }
    }

    async fetchGitHubData() {
        // GitHub API 토큰이 설정되어 있는지 확인
        if (!this.settings.githubToken) {
            console.warn('GitHub 토큰이 설정되지 않았습니다. 공개 저장소만 표시됩니다.');
            return;
        }

        try {
            const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
                headers: {
                    'Authorization': `token ${this.settings.githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                throw new Error(`GitHub API 오류: ${response.status}`);
            }

            this.repos = await response.json();
            this.filteredRepos = [...this.repos];
            
            console.log(`${this.repos.length}개의 저장소를 가져왔습니다.`);
        } catch (error) {
            console.error('GitHub 데이터 가져오기 오류:', error);
            // 오류가 발생해도 계속 진행
        }
    }

    renderDashboard() {
        this.renderRepositories();
        this.updateStats();
        this.setupAutoRefresh();
    }

    renderRepositories() {
        const container = document.getElementById('repositoriesContainer');
        if (!container) return;

        if (this.filteredRepos.length === 0) {
            container.innerHTML = `
                <div class="no-repos">
                    <i class="fas fa-folder-open"></i>
                    <h3>저장소가 없습니다</h3>
                    <p>GitHub에 저장소를 추가하거나 검색 조건을 변경해보세요.</p>
                </div>
            `;
            return;
        }

        const reposHTML = this.filteredRepos.map(repo => this.createRepoCard(repo)).join('');
        container.innerHTML = reposHTML;
    }

    createRepoCard(repo) {
        const language = repo.language || 'Unknown';
        const stars = repo.stargazers_count || 0;
        const forks = repo.forks_count || 0;
        const updated = new Date(repo.updated_at).toLocaleDateString();
        
        return `
            <div class="repo-card" data-repo="${repo.name}">
                <div class="repo-header">
                    <h3 class="repo-name">
                        <i class="fab fa-github"></i>
                        <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                    </h3>
                    <div class="repo-stats">
                        <span class="stars">
                            <i class="fas fa-star"></i>
                            ${stars}
                        </span>
                        <span class="forks">
                            <i class="fas fa-code-branch"></i>
                            ${forks}
                        </span>
                    </div>
                </div>
                <p class="repo-description">${repo.description || '설명 없음'}</p>
                <div class="repo-footer">
                    <span class="language">
                        <i class="fas fa-circle"></i>
                        ${language}
                    </span>
                    <span class="updated">
                        <i class="fas fa-clock"></i>
                        ${updated}
                    </span>
                </div>
            </div>
        `;
    }

    updateStats() {
        const totalRepos = this.repos.length;
        const totalStars = this.repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
        const totalForks = this.repos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0);
        
        // 통계 업데이트 (통계 요소가 있다면)
        const statsElements = document.querySelectorAll('.stats-item');
        statsElements.forEach(element => {
            const type = element.dataset.type;
            if (type === 'repos') element.textContent = totalRepos;
            else if (type === 'stars') element.textContent = totalStars;
            else if (type === 'forks') element.textContent = totalForks;
        });
    }

    handleSearch(query) {
        const filtered = this.repos.filter(repo => 
            repo.name.toLowerCase().includes(query.toLowerCase()) ||
            (repo.description && repo.description.toLowerCase().includes(query.toLowerCase()))
        );
        this.filteredRepos = filtered;
        this.renderRepositories();
    }

    handleLanguageFilter(language) {
        if (!language) {
            this.filteredRepos = [...this.repos];
        } else {
            this.filteredRepos = this.repos.filter(repo => repo.language === language);
        }
        this.renderRepositories();
    }

    handleSortFilter(sortBy) {
        const sorted = [...this.filteredRepos];
        switch (sortBy) {
            case 'updated':
                sorted.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
                break;
            case 'created':
                sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                break;
            case 'name':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'stars':
                sorted.sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0));
                break;
        }
        this.filteredRepos = sorted;
        this.renderRepositories();
    }

    refreshData() {
        this.loadData();
        this.showSuccess('데이터가 새로고침되었습니다.');
    }

    showSettings() {
        // 설정 모달 표시
        console.log('설정 모달을 표시합니다.');
    }

    showAnalytics() {
        // 분석 페이지 표시
        console.log('분석 페이지를 표시합니다.');
    }

    showFavorites() {
        // 즐겨찾기 페이지 표시
        console.log('즐겨찾기 페이지를 표시합니다.');
    }

    showNotifications() {
        // 알림 페이지 표시
        console.log('알림 페이지를 표시합니다.');
    }

    setupAutoRefresh() {
        // 자동 새로고침 설정
        if (this.autoRefreshInterval) {
            clearInterval(this.autoRefreshInterval);
        }
        
        if (this.settings.autoRefresh) {
            this.autoRefreshInterval = setInterval(() => {
                this.refreshData();
            }, this.settings.refreshInterval * 60 * 1000);
        }
    }

    loadSettings() {
        const defaultSettings = {
            githubToken: '',
            autoRefresh: false,
            refreshInterval: 30,
            theme: 'light',
            language: 'ko'
        };

        try {
            const saved = localStorage.getItem('dashboardSettings');
            return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
        } catch (error) {
            console.error('설정 로드 오류:', error);
            return defaultSettings;
        }
    }

    saveSettings(settings) {
        try {
            this.settings = { ...this.settings, ...settings };
            localStorage.setItem('dashboardSettings', JSON.stringify(this.settings));
            console.log('설정이 저장되었습니다.');
        } catch (error) {
            console.error('설정 저장 오류:', error);
        }
    }

    showSuccess(message) {
        // 성공 메시지 표시
        console.log('성공:', message);
    }

    showError(message) {
        // 오류 메시지 표시
        console.error('오류:', message);
    }
}

// 애플리케이션 초기화
document.addEventListener('DOMContentLoaded', () => {
    new GitHubDashboard();
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