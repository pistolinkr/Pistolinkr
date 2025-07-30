// 다국어 지원 모듈
class I18n {
    constructor() {
        this.currentLocale = 'en';
        this.fallbackLocale = 'en';
        this.translations = {};
        this.supportedLocales = ['en', 'ko', 'ja', 'zh', 'es', 'fr', 'de'];
        
        this.init();
    }

    init() {
        this.detectUserLocale();
        this.loadTranslations();
    }

    // 사용자 언어 감지
    detectUserLocale() {
        // 1. 저장된 언어 설정 확인
        const savedLocale = localStorage.getItem('userLocale');
        if (savedLocale && this.supportedLocales.includes(savedLocale)) {
            this.currentLocale = savedLocale;
            return;
        }

        // 2. 브라우저 언어 설정 확인
        const browserLocale = navigator.language || navigator.userLanguage;
        const primaryLocale = browserLocale.split('-')[0];
        
        if (this.supportedLocales.includes(primaryLocale)) {
            this.currentLocale = primaryLocale;
        } else {
            // 3. 위치 기반 언어 추정
            this.detectLocaleByLocation();
        }
    }

    // 위치 기반 언어 감지
    async detectLocaleByLocation() {
        try {
            // IP 기반 위치 감지 (무료 API 사용)
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            
            const countryToLocale = {
                'KR': 'ko',
                'JP': 'ja',
                'CN': 'zh',
                'TW': 'zh',
                'ES': 'es',
                'FR': 'fr',
                'DE': 'de',
                'US': 'en',
                'GB': 'en',
                'CA': 'en'
            };

            const detectedLocale = countryToLocale[data.country_code];
            if (detectedLocale && this.supportedLocales.includes(detectedLocale)) {
                this.currentLocale = detectedLocale;
            }
        } catch (error) {
            console.log('위치 기반 언어 감지 실패, 기본 언어 사용:', this.fallbackLocale);
        }
    }

    // 번역 데이터 로드
    loadTranslations() {
        this.translations = {
            en: {
                // 로그인 화면
                login: {
                    title: 'GitHub Dashboard',
                    subtitle: 'Personal Project Management System',
                    name: 'Name',
                    password: 'Password',
                    namePlaceholder: 'Enter your name',
                    passwordPlaceholder: 'Enter your password',
                    loginButton: 'Login',
                    loginError: 'Invalid name or password.',
                    footer: 'Personal Dashboard - pistolinkr'
                },
                // 헤더
                header: {
                    title: 'GitHub Project Dashboard',
                    refresh: 'Refresh',
                    analytics: 'Analytics',
                    favorites: 'Favorites',
                    notifications: 'Notifications',
                    settings: 'Settings',
                    admin: 'Admin',
                    logout: 'Logout'
                },
                // 검색 및 필터
                search: {
                    placeholder: 'Search projects...',
                    languageFilter: 'All Languages',
                    sortFilter: 'Sort by',
                    sortOptions: {
                        name: 'Name',
                        updated: 'Last Updated',
                        created: 'Created Date',
                        stars: 'Stars',
                        forks: 'Forks'
                    }
                },
                // 뷰 옵션
                view: {
                    grid: 'Grid',
                    list: 'List',
                    compact: 'Compact'
                },
                // 프로젝트 카드
                project: {
                    stars: 'stars',
                    forks: 'forks',
                    issues: 'issues',
                    updated: 'Updated',
                    viewDetails: 'View Details',
                    liveSite: 'Live Site',
                    repository: 'Repository'
                },
                // 통계
                stats: {
                    totalProjects: 'Total Projects',
                    totalStars: 'Total Stars',
                    totalForks: 'Total Forks',
                    totalWatchers: 'Total Watchers',
                    languages: 'Languages'
                },
                // 설정
                settings: {
                    title: 'Settings',
                    autoRefresh: 'Auto Refresh',
                    refreshInterval: 'Refresh Interval',
                    theme: 'Theme',
                                    language: 'Language',
                languageHelp: 'Choose your preferred language for the interface',
                save: 'Save',
                cancel: 'Cancel'
                },
                // 관리자
                admin: {
                    title: 'Admin Panel',
                    projectSettings: 'Project Settings',
                    userManagement: 'User Management',
                    systemStatus: 'System Status'
                },
                // 알림
                notifications: {
                    title: 'Notifications',
                    markAllRead: 'Mark All as Read',
                    noNotifications: 'No notifications'
                },
                // 즐겨찾기
                favorites: {
                    title: 'Favorites',
                    noFavorites: 'No favorite projects'
                },
                // 푸터
                footer: {
                    title: 'GitHub Dashboard',
                    description: 'Personal project management system for developers',
                    quickLinks: 'Quick Links',
                    dashboard: 'Dashboard',
                    analytics: 'Analytics',
                    favorites: 'Favorites',
                    settings: 'Settings',
                    support: 'Support',
                    documentation: 'Documentation',
                    helpCenter: 'Help Center',
                    contact: 'Contact',
                    feedback: 'Feedback',
                    systemInfo: 'System Info',
                    version: 'Version:',
                    status: 'Status:',
                    online: 'Online',
                    lastUpdated: 'Last Updated:',
                    justNow: 'Just now',
                    copyright: '© 2024 GitHub Dashboard. Built with ❤️ by pistolinkr',
                    privacyPolicy: 'Privacy Policy',
                    termsOfService: 'Terms of Service',
                    cookiePolicy: 'Cookie Policy'
                },
                // 피드백
                feedback: {
                    title: 'Send Feedback',
                    name: 'Your Name',
                    namePlaceholder: 'Enter your name',
                    email: 'Your Email',
                    emailPlaceholder: 'Enter your email',
                    type: 'Feedback Type',
                    typeGeneral: 'General Feedback',
                    typeBug: 'Bug Report',
                    typeFeature: 'Feature Request',
                    typeImprovement: 'Improvement Suggestion',
                    subject: 'Subject',
                    subjectPlaceholder: 'Brief description of your feedback',
                    message: 'Message',
                    messagePlaceholder: 'Please provide detailed feedback...',
                    cancel: 'Cancel',
                    send: 'Send Feedback',
                    success: 'Feedback sent successfully!',
                    error: 'Failed to send feedback. Please try again.',
                    validationError: 'Please fill in all required fields.'
                }
            },
            ko: {
                // 로그인 화면
                login: {
                    title: 'GitHub 대시보드',
                    subtitle: '개인 프로젝트 관리 시스템',
                    name: '이름',
                    password: '비밀번호',
                    namePlaceholder: '이름을 입력하세요',
                    passwordPlaceholder: '비밀번호를 입력하세요',
                    loginButton: '로그인',
                    loginError: '잘못된 이름 또는 비밀번호입니다.',
                    footer: '개인 대시보드 - pistolinkr'
                },
                // 헤더
                header: {
                    title: 'GitHub 프로젝트 대시보드',
                    refresh: '새로고침',
                    analytics: '분석',
                    favorites: '즐겨찾기',
                    notifications: '알림',
                    settings: '설정',
                    admin: '관리자',
                    logout: '로그아웃'
                },
                // 검색 및 필터
                search: {
                    placeholder: '프로젝트 검색...',
                    languageFilter: '모든 언어',
                    sortFilter: '정렬 기준',
                    sortOptions: {
                        name: '이름',
                        updated: '최근 업데이트',
                        created: '생성일',
                        stars: '스타',
                        forks: '포크'
                    }
                },
                // 뷰 옵션
                view: {
                    grid: '그리드',
                    list: '목록',
                    compact: '간소'
                },
                // 프로젝트 카드
                project: {
                    stars: '스타',
                    forks: '포크',
                    issues: '이슈',
                    updated: '업데이트',
                    viewDetails: '상세보기',
                    liveSite: '라이브 사이트',
                    repository: '저장소'
                },
                // 통계
                stats: {
                    totalProjects: '전체 프로젝트',
                    totalStars: '전체 스타',
                    totalForks: '전체 포크',
                    totalWatchers: '전체 감시자',
                    languages: '언어'
                },
                // 설정
                settings: {
                    title: '설정',
                    autoRefresh: '자동 새로고침',
                    refreshInterval: '새로고침 간격',
                    theme: '테마',
                                    language: '언어',
                languageHelp: '인터페이스 언어를 선택하세요',
                save: '저장',
                cancel: '취소'
                },
                // 관리자
                admin: {
                    title: '관리자 패널',
                    projectSettings: '프로젝트 설정',
                    userManagement: '사용자 관리',
                    systemStatus: '시스템 상태'
                },
                // 알림
                notifications: {
                    title: '알림',
                    markAllRead: '모두 읽음으로 표시',
                    noNotifications: '알림이 없습니다'
                },
                // 즐겨찾기
                favorites: {
                    title: '즐겨찾기',
                    noFavorites: '즐겨찾기한 프로젝트가 없습니다'
                },
                // 푸터
                footer: {
                    title: 'GitHub 대시보드',
                    description: '개발자를 위한 개인 프로젝트 관리 시스템',
                    quickLinks: '빠른 링크',
                    dashboard: '대시보드',
                    analytics: '분석',
                    favorites: '즐겨찾기',
                    settings: '설정',
                    support: '지원',
                    documentation: '문서',
                    helpCenter: '도움말 센터',
                    contact: '연락처',
                    feedback: '피드백',
                    systemInfo: '시스템 정보',
                    version: '버전:',
                    status: '상태:',
                    online: '온라인',
                    lastUpdated: '마지막 업데이트:',
                    justNow: '방금 전',
                    copyright: '© 2024 GitHub 대시보드. pistolinkr이 ❤️로 제작',
                    privacyPolicy: '개인정보 처리방침',
                    termsOfService: '이용약관',
                    cookiePolicy: '쿠키 정책'
                },
                // 피드백
                feedback: {
                    title: '피드백 보내기',
                    name: '이름',
                    namePlaceholder: '이름을 입력하세요',
                    email: '이메일',
                    emailPlaceholder: '이메일을 입력하세요',
                    type: '피드백 유형',
                    typeGeneral: '일반 피드백',
                    typeBug: '버그 신고',
                    typeFeature: '기능 요청',
                    typeImprovement: '개선 제안',
                    subject: '제목',
                    subjectPlaceholder: '피드백에 대한 간단한 설명',
                    message: '메시지',
                    messagePlaceholder: '자세한 피드백을 작성해주세요...',
                    cancel: '취소',
                    send: '피드백 보내기',
                    success: '피드백이 성공적으로 전송되었습니다!',
                    error: '피드백 전송에 실패했습니다. 다시 시도해주세요.',
                    validationError: '모든 필수 항목을 입력해주세요.'
                }
            },
            ja: {
                // 로グイン画面
                login: {
                    title: 'GitHub ダッシュボード',
                    subtitle: '個人プロジェクト管理システム',
                    name: '名前',
                    password: 'パスワード',
                    namePlaceholder: '名前を入力してください',
                    passwordPlaceholder: 'パスワードを入力してください',
                    loginButton: 'ログイン',
                    loginError: '無効な名前またはパスワードです。',
                    footer: '個人ダッシュボード - pistolinkr'
                },
                // ヘッダー
                header: {
                    title: 'GitHub プロジェクトダッシュボード',
                    refresh: '更新',
                    analytics: '分析',
                    favorites: 'お気に入り',
                    notifications: '通知',
                    settings: '設定',
                    admin: '管理者',
                    logout: 'ログアウト'
                },
                // 検索・フィルター
                search: {
                    placeholder: 'プロジェクトを検索...',
                    languageFilter: 'すべての言語',
                    sortFilter: '並び替え',
                    sortOptions: {
                        name: '名前',
                        updated: '最終更新',
                        created: '作成日',
                        stars: 'スター',
                        forks: 'フォーク'
                    }
                },
                // ビューオプション
                view: {
                    grid: 'グリッド',
                    list: 'リスト',
                    compact: 'コンパクト'
                },
                // プロジェクトカード
                project: {
                    stars: 'スター',
                    forks: 'フォーク',
                    issues: 'イシュー',
                    updated: '更新',
                    viewDetails: '詳細を見る',
                    liveSite: 'ライブサイト',
                    repository: 'リポジトリ'
                },
                // 統計
                stats: {
                    totalProjects: 'プロジェクト総数',
                    totalStars: 'スター総数',
                    totalForks: 'フォーク総数',
                    totalWatchers: 'ウォッチャー総数',
                    languages: '言語'
                },
                // 設定
                settings: {
                    title: '設定',
                    autoRefresh: '自動更新',
                    refreshInterval: '更新間隔',
                    theme: 'テーマ',
                    language: '言語',
                    languageHelp: 'インターフェースの言語を選択してください',
                    save: '保存',
                    cancel: 'キャンセル'
                },
                // 管理者
                admin: {
                    title: '管理者パネル',
                    projectSettings: 'プロジェクト設定',
                    userManagement: 'ユーザー管理',
                    systemStatus: 'システム状態'
                },
                // 通知
                notifications: {
                    title: '通知',
                    markAllRead: 'すべて既読にする',
                    noNotifications: '通知がありません'
                },
                // お気に入り
                favorites: {
                    title: 'お気に入り',
                    noFavorites: 'お気に入りのプロジェクトがありません'
                }
            },
            zh: {
                // 登录界面
                login: {
                    title: 'GitHub 仪表板',
                    subtitle: '个人项目管理系统',
                    name: '姓名',
                    password: '密码',
                    namePlaceholder: '请输入姓名',
                    passwordPlaceholder: '请输入密码',
                    loginButton: '登录',
                    loginError: '无效的姓名或密码。',
                    footer: '个人仪表板 - pistolinkr'
                },
                // 头部
                header: {
                    title: 'GitHub 项目仪表板',
                    refresh: '刷新',
                    analytics: '分析',
                    favorites: '收藏',
                    notifications: '通知',
                    settings: '设置',
                    admin: '管理员',
                    logout: '登出'
                },
                // 搜索和筛选
                search: {
                    placeholder: '搜索项目...',
                    languageFilter: '所有语言',
                    sortFilter: '排序方式',
                    sortOptions: {
                        name: '名称',
                        updated: '最近更新',
                        created: '创建日期',
                        stars: '星标',
                        forks: '复刻'
                    }
                },
                // 视图选项
                view: {
                    grid: '网格',
                    list: '列表',
                    compact: '紧凑'
                },
                // 项目卡片
                project: {
                    stars: '星标',
                    forks: '复刻',
                    issues: '问题',
                    updated: '更新',
                    viewDetails: '查看详情',
                    liveSite: '在线站点',
                    repository: '仓库'
                },
                // 统计
                stats: {
                    totalProjects: '项目总数',
                    totalStars: '星标总数',
                    totalForks: '复刻总数',
                    totalWatchers: '关注者总数',
                    languages: '语言'
                },
                // 设置
                settings: {
                    title: '设置',
                    autoRefresh: '自动刷新',
                    refreshInterval: '刷新间隔',
                    theme: '主题',
                    language: '语言',
                    languageHelp: '选择您偏好的界面语言',
                    save: '保存',
                    cancel: '取消'
                },
                // 管理员
                admin: {
                    title: '管理员面板',
                    projectSettings: '项目设置',
                    userManagement: '用户管理',
                    systemStatus: '系统状态'
                },
                // 通知
                notifications: {
                    title: '通知',
                    markAllRead: '全部标记为已读',
                    noNotifications: '暂无通知'
                },
                // 收藏
                favorites: {
                    title: '收藏',
                    noFavorites: '暂无收藏项目'
                }
            },
            es: {
                // Pantalla de login
                login: {
                    title: 'Panel de GitHub',
                    subtitle: 'Sistema de Gestión de Proyectos Personales',
                    name: 'Nombre',
                    password: 'Contraseña',
                    namePlaceholder: 'Ingresa tu nombre',
                    passwordPlaceholder: 'Ingresa tu contraseña',
                    loginButton: 'Iniciar Sesión',
                    loginError: 'Nombre o contraseña inválidos.',
                    footer: 'Panel Personal - pistolinkr'
                },
                // Encabezado
                header: {
                    title: 'Panel de Proyectos GitHub',
                    refresh: 'Actualizar',
                    analytics: 'Análisis',
                    favorites: 'Favoritos',
                    notifications: 'Notificaciones',
                    settings: 'Configuración',
                    admin: 'Administrador',
                    logout: 'Cerrar Sesión'
                },
                // Búsqueda y filtros
                search: {
                    placeholder: 'Buscar proyectos...',
                    languageFilter: 'Todos los idiomas',
                    sortFilter: 'Ordenar por',
                    sortOptions: {
                        name: 'Nombre',
                        updated: 'Última actualización',
                        created: 'Fecha de creación',
                        stars: 'Estrellas',
                        forks: 'Forks'
                    }
                },
                // Opciones de vista
                view: {
                    grid: 'Cuadrícula',
                    list: 'Lista',
                    compact: 'Compacto'
                },
                // Tarjeta de proyecto
                project: {
                    stars: 'estrellas',
                    forks: 'forks',
                    issues: 'problemas',
                    updated: 'Actualizado',
                    viewDetails: 'Ver Detalles',
                    liveSite: 'Sitio en Vivo',
                    repository: 'Repositorio'
                },
                // Estadísticas
                stats: {
                    totalProjects: 'Total de Proyectos',
                    totalStars: 'Total de Estrellas',
                    totalForks: 'Total de Forks',
                    totalWatchers: 'Total de Observadores',
                    languages: 'Idiomas'
                },
                // Configuración
                settings: {
                    title: 'Configuración',
                    autoRefresh: 'Actualización Automática',
                    refreshInterval: 'Intervalo de Actualización',
                    theme: 'Tema',
                    language: 'Idioma',
                    languageHelp: 'Elige tu idioma preferido para la interfaz',
                    save: 'Guardar',
                    cancel: 'Cancelar'
                },
                // Administrador
                admin: {
                    title: 'Panel de Administrador',
                    projectSettings: 'Configuración de Proyectos',
                    userManagement: 'Gestión de Usuarios',
                    systemStatus: 'Estado del Sistema'
                },
                // Notificaciones
                notifications: {
                    title: 'Notificaciones',
                    markAllRead: 'Marcar Todo como Leído',
                    noNotifications: 'No hay notificaciones'
                },
                // Favoritos
                favorites: {
                    title: 'Favoritos',
                    noFavorites: 'No hay proyectos favoritos'
                }
            },
            fr: {
                // Écran de connexion
                login: {
                    title: 'Tableau de Bord GitHub',
                    subtitle: 'Système de Gestion de Projets Personnels',
                    name: 'Nom',
                    password: 'Mot de passe',
                    namePlaceholder: 'Entrez votre nom',
                    passwordPlaceholder: 'Entrez votre mot de passe',
                    loginButton: 'Se connecter',
                    loginError: 'Nom ou mot de passe invalide.',
                    footer: 'Tableau de Bord Personnel - pistolinkr'
                },
                // En-tête
                header: {
                    title: 'Tableau de Bord des Projets GitHub',
                    refresh: 'Actualiser',
                    analytics: 'Analyses',
                    favorites: 'Favoris',
                    notifications: 'Notifications',
                    settings: 'Paramètres',
                    admin: 'Administrateur',
                    logout: 'Se déconnecter'
                },
                // Recherche et filtres
                search: {
                    placeholder: 'Rechercher des projets...',
                    languageFilter: 'Toutes les langues',
                    sortFilter: 'Trier par',
                    sortOptions: {
                        name: 'Nom',
                        updated: 'Dernière mise à jour',
                        created: 'Date de création',
                        stars: 'Étoiles',
                        forks: 'Forks'
                    }
                },
                // Options d'affichage
                view: {
                    grid: 'Grille',
                    list: 'Liste',
                    compact: 'Compact'
                },
                // Carte de projet
                project: {
                    stars: 'étoiles',
                    forks: 'forks',
                    issues: 'problèmes',
                    updated: 'Mis à jour',
                    viewDetails: 'Voir les détails',
                    liveSite: 'Site en direct',
                    repository: 'Dépôt'
                },
                // Statistiques
                stats: {
                    totalProjects: 'Total des Projets',
                    totalStars: 'Total des Étoiles',
                    totalForks: 'Total des Forks',
                    totalWatchers: 'Total des Observateurs',
                    languages: 'Langues'
                },
                // Paramètres
                settings: {
                    title: 'Paramètres',
                    autoRefresh: 'Actualisation automatique',
                    refreshInterval: 'Intervalle d\'actualisation',
                    theme: 'Thème',
                    language: 'Langue',
                    languageHelp: 'Choisissez votre langue préférée pour l\'interface',
                    save: 'Enregistrer',
                    cancel: 'Annuler'
                },
                // Administrateur
                admin: {
                    title: 'Panneau d\'Administration',
                    projectSettings: 'Paramètres des Projets',
                    userManagement: 'Gestion des Utilisateurs',
                    systemStatus: 'État du Système'
                },
                // Notifications
                notifications: {
                    title: 'Notifications',
                    markAllRead: 'Marquer tout comme lu',
                    noNotifications: 'Aucune notification'
                },
                // Favoris
                favorites: {
                    title: 'Favoris',
                    noFavorites: 'Aucun projet favori'
                }
            },
            de: {
                // Anmeldebildschirm
                login: {
                    title: 'GitHub Dashboard',
                    subtitle: 'Persönliches Projektverwaltungssystem',
                    name: 'Name',
                    password: 'Passwort',
                    namePlaceholder: 'Geben Sie Ihren Namen ein',
                    passwordPlaceholder: 'Geben Sie Ihr Passwort ein',
                    loginButton: 'Anmelden',
                    loginError: 'Ungültiger Name oder Passwort.',
                    footer: 'Persönliches Dashboard - pistolinkr'
                },
                // Header
                header: {
                    title: 'GitHub Projekt Dashboard',
                    refresh: 'Aktualisieren',
                    analytics: 'Analysen',
                    favorites: 'Favoriten',
                    notifications: 'Benachrichtigungen',
                    settings: 'Einstellungen',
                    admin: 'Administrator',
                    logout: 'Abmelden'
                },
                // Suche und Filter
                search: {
                    placeholder: 'Projekte suchen...',
                    languageFilter: 'Alle Sprachen',
                    sortFilter: 'Sortieren nach',
                    sortOptions: {
                        name: 'Name',
                        updated: 'Zuletzt aktualisiert',
                        created: 'Erstellungsdatum',
                        stars: 'Sterne',
                        forks: 'Forks'
                    }
                },
                // Ansichtsoptionen
                view: {
                    grid: 'Raster',
                    list: 'Liste',
                    compact: 'Kompakt'
                },
                // Projektkarte
                project: {
                    stars: 'Sterne',
                    forks: 'Forks',
                    issues: 'Probleme',
                    updated: 'Aktualisiert',
                    viewDetails: 'Details anzeigen',
                    liveSite: 'Live-Website',
                    repository: 'Repository'
                },
                // Statistiken
                stats: {
                    totalProjects: 'Gesamtprojekte',
                    totalStars: 'Gesamtsterne',
                    totalForks: 'Gesamtforks',
                    totalWatchers: 'Gesamtbeobachter',
                    languages: 'Sprachen'
                },
                // Einstellungen
                settings: {
                    title: 'Einstellungen',
                    autoRefresh: 'Automatische Aktualisierung',
                    refreshInterval: 'Aktualisierungsintervall',
                    theme: 'Thema',
                    language: 'Sprache',
                    languageHelp: 'Wählen Sie Ihre bevorzugte Sprache für die Benutzeroberfläche',
                    save: 'Speichern',
                    cancel: 'Abbrechen'
                },
                // Administrator
                admin: {
                    title: 'Administrator-Panel',
                    projectSettings: 'Projekteinstellungen',
                    userManagement: 'Benutzerverwaltung',
                    systemStatus: 'Systemstatus'
                },
                // Benachrichtigungen
                notifications: {
                    title: 'Benachrichtigungen',
                    markAllRead: 'Alle als gelesen markieren',
                    noNotifications: 'Keine Benachrichtigungen'
                },
                // Favoriten
                favorites: {
                    title: 'Favoriten',
                    noFavorites: 'Keine Favoriten-Projekte'
                }
            }
        };
    }

    // 번역 가져오기
    t(key, params = {}) {
        const keys = key.split('.');
        let value = this.translations[this.currentLocale];
        
        for (const k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                // 번역이 없으면 영어로 폴백
                value = this.translations[this.fallbackLocale];
                for (const fallbackKey of keys) {
                    if (value && value[fallbackKey]) {
                        value = value[fallbackKey];
                    } else {
                        return key; // 번역 키 자체를 반환
                    }
                }
                break;
            }
        }

        // 매개변수 치환
        if (typeof value === 'string') {
            Object.keys(params).forEach(param => {
                value = value.replace(`{${param}}`, params[param]);
            });
        }

        return value;
    }

    // 언어 변경
    setLocale(locale) {
        if (this.supportedLocales.includes(locale)) {
            this.currentLocale = locale;
            localStorage.setItem('userLocale', locale);
            this.updatePageLanguage();
            return true;
        }
        return false;
    }

    // 현재 언어 가져오기
    getCurrentLocale() {
        return this.currentLocale;
    }

    // 지원하는 언어 목록 가져오기
    getSupportedLocales() {
        return this.supportedLocales.map(locale => ({
            code: locale,
            name: this.getLocaleName(locale)
        }));
    }

    // 언어 이름 가져오기
    getLocaleName(locale) {
        const localeNames = {
            en: 'English',
            ko: '한국어',
            ja: '日本語',
            zh: '中文',
            es: 'Español',
            fr: 'Français',
            de: 'Deutsch'
        };
        return localeNames[locale] || locale;
    }

    // 페이지 언어 업데이트
    updatePageLanguage() {
        document.documentElement.lang = this.currentLocale;
        document.documentElement.setAttribute('data-locale', this.currentLocale);
        
        // 언어 변경 이벤트 발생
        const event = new CustomEvent('localeChanged', {
            detail: { locale: this.currentLocale }
        });
        document.dispatchEvent(event);
    }


}

// 전역 i18n 인스턴스 생성
window.i18n = new I18n(); 