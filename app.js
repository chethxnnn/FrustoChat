// FrustroChat Application - Revolutionary Social Platform with Enhanced Scroll Behavior
class FrustroChatApp {
    constructor() {
        this.state = {
            currentUser: null,
            topics: [],
            replies: [],
            users: new Map(),
            theme: 'dark',
            nextUserId: 1,
            nextTopicId: 1,
            nextReplyId: 1,
            interactions: {
                likes: new Map(),
                follows: new Map(),
                reposts: new Map()
            },
            animations: {
                isAnimating: false,
                staggerDelay: 100
            },
            scroll: {
                lastScrollY: 0,
                isScrollingUp: false,
                currentSection: 'home'
            }
        };

        // Enhanced word lists for anonymous usernames
        this.wordLists = {
            adjectives: [
                "Brave", "Clever", "Creative", "Curious", "Daring", "Dynamic", "Fierce", "Free",
                "Gentle", "Bold", "Honest", "Kind", "Lucky", "Mighty", "Noble", "Quick",
                "Sharp", "Smart", "Swift", "Wise", "Witty", "Zen", "Epic", "Wild",
                "Calm", "Cool", "Fresh", "Happy", "Hungry", "Tall", "Young", "Zesty",
                "Silent", "Golden", "Silver", "Crystal", "Mystic", "Cosmic", "Stellar", "Luna"
            ],
            nouns: [
                "Phoenix", "Dragon", "Tiger", "Eagle", "Wolf", "Bear", "Lion", "Fox",
                "Hawk", "Shark", "Whale", "Raven", "Falcon", "Panther", "Leopard", "Cheetah",
                "Dolphin", "Orca", "Stallion", "Mustang", "Thunder", "Lightning", "Storm", "Blaze",
                "River", "Mountain", "Ocean", "Star", "Comet", "Galaxy", "Nebula", "Cosmos",
                "Nova", "Meteor", "Aurora", "Eclipse", "Prism", "Vertex", "Cipher", "Vortex"
            ]
        };

        // Sample topics with enhanced data
        this.sampleTopics = [
            {
                id: 1,
                title: "Work Burnout is Consuming Me",
                content: "I'm drowning in endless meetings, impossible deadlines, and a boss who thinks 'work-life balance' is a myth. Every morning I wake up with dread, knowing I have to pretend everything is fine while I'm slowly falling apart inside. The worst part? Everyone around me seems to have it figured out, and I'm just trying to survive each day without having a complete breakdown.",
                authorId: 1,
                authorUsername: "Guest_Exhausted_Phoenix_1847",
                createdAt: "2025-01-15T10:30:00Z",
                likes: 89,
                replies: 34,
                reposts: 12,
                followers: 28,
                mood: "frustrated"
            },
            {
                id: 2,
                title: "Social Media Makes Me Feel Invisible",
                content: "I post something I'm genuinely proud of and get 3 likes. Meanwhile, someone posts a blurry selfie and gets hundreds of hearts. I know it shouldn't matter, but it does. It makes me question my worth, my creativity, my entire existence. When did validation become so tied to algorithms and double-taps?",
                authorId: 2,
                authorUsername: "Guest_Melancholy_Raven_9472",
                createdAt: "2025-01-15T08:45:00Z",
                likes: 156,
                replies: 67,
                reposts: 23,
                followers: 45,
                mood: "melancholy"
            },
            {
                id: 3,
                title: "Imposter Syndrome is My Shadow",
                content: "Got promoted last month and everyone's congratulating me, but I feel like I'm about to be exposed as a fraud. Every meeting feels like a test I'm failing. I Google basic concepts I should know by heart. I'm terrified someone will ask me a question that reveals I have no idea what I'm doing. How do people seem so confident when I'm constantly questioning everything?",
                authorId: 3,
                authorUsername: "Guest_Anxious_Wolf_3291",
                createdAt: "2025-01-15T07:15:00Z",
                likes: 203,
                replies: 89,
                reposts: 34,
                followers: 67,
                mood: "anxious"
            }
        ];

        this.moodColors = {
            frustrated: '#ff4757',
            melancholy: '#5352ed', 
            anxious: '#ffa502',
            angry: '#ff3838',
            sad: '#747d8c',
            hopeful: '#2ed573',
            excited: '#ff6348'
        };

        // Scroll behavior configuration
        this.scrollConfig = {
            navbarTransitionPoint: 100,
            scrollToTopThreshold: 300,
            mainInputBarOffset: 200,
            footerObserverMargin: 120, // Distance from footer to hide floating bar
            sectionOffsets: {
                hero: 0,
                topics: 0
            }
        };
    }

    // Initialize the application
    init() {
        console.log('🚀 Initializing FrustroChat...');
        this.initializeTheme();
        this.loadSampleData();
        this.setupEventListeners();
        this.setupScrollBehavior();
        this.setupAnimations();
        this.render();
        this.showWelcomeAnimation();
    }

    // Enhanced Scroll Behavior Setup
    setupScrollBehavior() {
        console.log('📜 Setting up scroll behavior...');
        
        // Calculate section offsets after DOM is ready
        setTimeout(() => {
            this.calculateSectionOffsets();
        }, 500);
        
        // Main scroll event listener with throttling for performance
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScrollEvent();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Setup navigation click handlers
        this.setupNavigationHandlers();
        
        // Setup scroll to top button
        this.setupScrollToTopButton();
        
        // Setup logo click handler
        this.setupLogoHandler();
        
        // Setup footer home link handler
        this.setupFooterHomeLink();
        
        // Setup bottom input bar with footer observer
        this.setupBottomInputBarWithFooterObserver();
    }

    calculateSectionOffsets() {
        const heroSection = document.getElementById('hero');
        const topicsSection = document.getElementById('topics');
        
        if (heroSection) {
            this.scrollConfig.sectionOffsets.hero = heroSection.offsetTop;
        }
        if (topicsSection) {
            this.scrollConfig.sectionOffsets.topics = topicsSection.offsetTop;
        }
        
        console.log('📐 Section offsets calculated:', this.scrollConfig.sectionOffsets);
    }

    handleScrollEvent() {
        const scrollY = window.scrollY;
        const isScrollingUp = scrollY < this.state.scroll.lastScrollY;
        
        // Update scroll state
        this.state.scroll.lastScrollY = scrollY;
        this.state.scroll.isScrollingUp = isScrollingUp;
        
        // Handle navbar transformation
        this.handleNavbarScroll(scrollY);
        
        // Handle scroll to top button
        this.handleScrollToTopButton(scrollY);
        
        // Update active navigation section
        this.updateActiveNavSection();
    }

    handleNavbarScroll(scrollY) {
        const navbar = document.getElementById('main-navbar');
        if (!navbar) return;
        
        if (scrollY > this.scrollConfig.navbarTransitionPoint) {
            if (!navbar.classList.contains('navbar-scrolled')) {
                navbar.classList.add('navbar-scrolled');
                console.log('📜 Navbar transformed to sticky state');
            }
        } else {
            if (navbar.classList.contains('navbar-scrolled')) {
                navbar.classList.remove('navbar-scrolled');
                console.log('📜 Navbar returned to floating state');
            }
        }
    }

    // Enhanced bottom input bar with footer-based visibility
    setupBottomInputBarWithFooterObserver() {
        console.log('📝 Setting up bottom input bar with footer observer...');
        
        const bottomBar = document.getElementById('bottom-input-bar');
        const shareBar = document.getElementById('share-bar');
        const footer = document.querySelector('.site-footer');
        
        if (!bottomBar || !shareBar || !footer) return;

        // Intersection Observer for footer proximity
        const footerObserver = new IntersectionObserver((entries) => {
            const footerEntry = entries[0];
            
            if (footerEntry.isIntersecting) {
                // Footer is visible, hide the floating bar
                if (bottomBar.classList.contains('show')) {
                    bottomBar.classList.remove('show');
                    console.log('📜 Bottom input bar hidden (footer visible)');
                }
            } else {
                // Footer is not visible, check if share bar is visible
                const shareBarRect = shareBar.getBoundingClientRect();
                const isShareBarVisible = shareBarRect.bottom > 0 && shareBarRect.top < window.innerHeight;
                
                if (!isShareBarVisible && window.scrollY > this.scrollConfig.mainInputBarOffset) {
                    if (!bottomBar.classList.contains('show')) {
                        bottomBar.classList.add('show');
                        console.log('📜 Bottom input bar shown (share bar not visible, footer not in view)');
                    }
                } else {
                    if (bottomBar.classList.contains('show')) {
                        bottomBar.classList.remove('show');
                        console.log('📜 Bottom input bar hidden (share bar visible)');
                    }
                }
            }
        }, {
            rootMargin: `${this.scrollConfig.footerObserverMargin}px 0px 0px 0px`
        });

        footerObserver.observe(footer);

        // Setup bottom create button click handler
        const bottomCreateBtn = document.getElementById('bottom-create-btn');
        if (bottomCreateBtn) {
            bottomCreateBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openTopicModal();
            });
        }
    }

    handleScrollToTopButton(scrollY) {
        const scrollTopBtn = document.getElementById('scroll-top-btn');
        if (!scrollTopBtn) return;
        
        if (scrollY > this.scrollConfig.scrollToTopThreshold) {
            if (!scrollTopBtn.classList.contains('show')) {
                scrollTopBtn.classList.add('show');
            }
        } else {
            if (scrollTopBtn.classList.contains('show')) {
                scrollTopBtn.classList.remove('show');
            }
        }
    }

    updateActiveNavSection() {
        const navLinks = document.querySelectorAll('.nav-link');
        const scrollY = window.scrollY + 150; // Offset for better UX
        
        let activeSection = 'home';
        
        // Determine which section we're in based on scroll position
        if (scrollY >= this.scrollConfig.sectionOffsets.topics - 100) {
            activeSection = 'topics';
        } else {
            activeSection = 'home'; // Hero is "home"
        }
        
        if (activeSection !== this.state.scroll.currentSection) {
            this.state.scroll.currentSection = activeSection;
            
            // Update nav link active states
            navLinks.forEach(link => {
                const section = link.getAttribute('data-section');
                if (section === activeSection) {
                    if (!link.classList.contains('active')) {
                        link.classList.add('active');
                        console.log(`🎯 Navigation: ${section} is now active`);
                    }
                } else {
                    link.classList.remove('active');
                }
            });
        }
    }

    setupNavigationHandlers() {
        console.log('🧭 Setting up navigation handlers...');
        
        // Wait a bit for DOM to settle, then setup navigation
        setTimeout(() => {
            const navLinks = document.querySelectorAll('.nav-link');
            console.log(`Found ${navLinks.length} navigation links`);
            
            navLinks.forEach((link, index) => {
                const section = link.getAttribute('data-section');
                console.log(`Setting up navigation for: ${section}`);
                
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(`🎯 Navigation clicked: ${section}`);
                    this.scrollToSection(section);
                });
            });
        }, 100);
    }

    scrollToSection(sectionName) {
        console.log(`🎯 Scrolling to section: ${sectionName}`);
        
        let targetOffset = 0;
        
        if (sectionName === 'home') {
            targetOffset = 0; // Go to very top for home
        } else if (sectionName === 'topics') {
            // Ensure we have the latest offset
            this.calculateSectionOffsets();
            targetOffset = Math.max(0, this.scrollConfig.sectionOffsets.topics - 120); // Account for navbar height
        }
        
        console.log(`📍 Scrolling to offset: ${targetOffset}`);
        
        window.scrollTo({
            top: targetOffset,
            behavior: 'smooth'
        });
        
        // Add visual feedback
        this.showNotification(`📍 Navigated to ${sectionName}`);
        
        // Force update the active section after a delay
        setTimeout(() => {
            this.updateActiveNavSection();
        }, 500);
    }

    setupScrollToTopButton() {
        console.log('⬆️ Setting up scroll to top button...');
        
        const scrollTopBtn = document.getElementById('scroll-top-btn');
        if (scrollTopBtn) {
            scrollTopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToTop();
            });
        }
    }

    scrollToTop() {
        console.log('⬆️ Scrolling to top');
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        this.showNotification('🏠 Back to top!');
        
        // Add visual feedback to button
        const scrollTopBtn = document.getElementById('scroll-top-btn');
        if (scrollTopBtn) {
            scrollTopBtn.style.transform = 'scale(1.2)';
            setTimeout(() => {
                scrollTopBtn.style.transform = '';
            }, 150);
        }
    }

    setupLogoHandler() {
        console.log('🏷️ Setting up logo click handler...');
        
        const brandLogo = document.getElementById('corner-brand-logo');
        if (brandLogo) {
            brandLogo.addEventListener('click', (e) => {
                e.preventDefault();
                this.scrollToTop();
            });
        }
    }

    setupFooterHomeLink() {
        console.log('🔗 Setting up footer home link...');
        
        const footerHomeLink = document.getElementById('footer-home-link');
        if (footerHomeLink) {
            footerHomeLink.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🏠 Footer home link clicked');
                this.scrollToTop();
                this.showNotification('🏠 Welcome back home!');
            });
        }
    }

    // Welcome animation sequence
    showWelcomeAnimation() {
        setTimeout(() => {
            this.showNotification('🌟 Welcome to the future of anonymous sharing');
        }, 500);

        // Generate anonymous user with celebration
        setTimeout(() => {
            this.createAnonymousUser();
        }, 1000);
    }

    // Enhanced user management
    generateRandomUsername() {
        const adjective = this.wordLists.adjectives[Math.floor(Math.random() * this.wordLists.adjectives.length)];
        const noun = this.wordLists.nouns[Math.floor(Math.random() * this.wordLists.nouns.length)];
        const number = Math.floor(1000 + Math.random() * 9000);
        return `Guest_${adjective}_${noun}_${number}`;
    }

    createAnonymousUser() {
        const user = {
            id: this.state.nextUserId++,
            username: this.generateRandomUsername(),
            isAnonymous: true,
            createdAt: new Date().toISOString(),
            mood: 'curious'
        };
        
        this.state.users.set(user.id, user);
        this.state.currentUser = user;
        this.updateUsernameDisplay();
        this.showUserRevealAnimation();
        return user;
    }

    showUserRevealAnimation() {
        const usernameEl = document.getElementById('corner-username-display');
        if (usernameEl) {
            usernameEl.style.transform = 'scale(1.2)';
            usernameEl.style.background = 'var(--fc-gradient-primary)';
            usernameEl.style.color = 'white';
            
            setTimeout(() => {
                usernameEl.style.transform = 'scale(1)';
                usernameEl.style.background = 'var(--fc-bg-elevated)';
                usernameEl.style.color = 'var(--fc-text-secondary)';
                
                this.showNotification(`🎭 You are now @${this.state.currentUser.username}`);
            }, 600);
        }
    }

    updateUsernameDisplay() {
        const usernameEl = document.getElementById('corner-username-display');
        if (usernameEl && this.state.currentUser) {
            usernameEl.textContent = `@${this.state.currentUser.username}`;
        }
    }

    // Enhanced theme management
    initializeTheme() {
        this.state.theme = 'dark';
        document.body.setAttribute('data-theme', this.state.theme);
        this.updateThemeIcon();
    }

    toggleTheme() {
        console.log('🎨 Toggling theme from', this.state.theme);
        this.state.theme = this.state.theme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', this.state.theme);
        this.updateThemeIcon();
        this.applyThemeTransition();
        
        const modeText = this.state.theme === 'dark' ? '🌙 Dark mode' : '☀️ Light mode';
        this.showNotification(`${modeText} activated`);
    }

    updateThemeIcon() {
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = this.state.theme === 'dark' ? '☀️' : '🌙';
        }
    }

    applyThemeTransition() {
        document.body.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 800);
    }

    // Data management
    loadSampleData() {
        // Create sample users
        this.sampleTopics.forEach((topic, index) => {
            const user = {
                id: topic.authorId,
                username: topic.authorUsername,
                isAnonymous: true,
                createdAt: topic.createdAt,
                mood: topic.mood
            };
            this.state.users.set(user.id, user);
        });

        // Load sample topics with proper state structure
        this.state.topics = this.sampleTopics.map(topic => ({
            ...topic,
            likedBy: new Set(),
            followedBy: new Set(),
            repostedBy: new Set()
        }));

        this.state.nextTopicId = Math.max(...this.state.topics.map(t => t.id)) + 1;
        this.state.nextUserId = Math.max(...Array.from(this.state.users.keys())) + 1;
    }

    // Enhanced topic management
    createTopic(title, content, mood = 'frustrated') {
        if (!this.state.currentUser) {
            this.createAnonymousUser();
        }

        const topic = {
            id: this.state.nextTopicId++,
            title: title.trim(),
            content: content.trim(),
            authorId: this.state.currentUser.id,
            authorUsername: this.state.currentUser.username,
            createdAt: new Date().toISOString(),
            likes: 0,
            replies: 0,
            reposts: 0,
            followers: 0,
            mood: mood,
            likedBy: new Set(),
            followedBy: new Set(),
            repostedBy: new Set()
        };

        this.state.topics.unshift(topic);
        this.render();
        this.showNotification('✨ Your story has been shared with the world', 'success');
        this.triggerTopicCreatedAnimation();
        return topic;
    }

    triggerTopicCreatedAnimation() {
        // Add celebration animation
        const container = document.getElementById('topics-container');
        if (container && container.firstChild) {
            container.firstChild.style.animation = 'none';
            container.firstChild.offsetHeight; // Trigger reflow
            container.firstChild.style.animation = 'slideInUp 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) both';
        }
    }

    // Enhanced interaction methods
    likeTopic(topicId) {
        if (!this.state.currentUser) {
            this.createAnonymousUser();
        }

        const topic = this.state.topics.find(t => t.id === topicId);
        if (!topic) return;

        const userId = this.state.currentUser.id;
        let isLiked;
        
        if (topic.likedBy.has(userId)) {
            topic.likedBy.delete(userId);
            topic.likes--;
            isLiked = false;
            this.showNotification('💔 Like removed');
        } else {
            topic.likedBy.add(userId);
            topic.likes++;
            isLiked = true;
            this.showNotification('❤️ Liked!');
            this.triggerHeartAnimation(topicId);
        }

        this.render();
        return isLiked;
    }

    triggerHeartAnimation(topicId) {
        const btn = document.querySelector(`[data-topic-id="${topicId}"][data-action="like"]`);
        if (btn) {
            btn.classList.add('animate-pulse');
            setTimeout(() => btn.classList.remove('animate-pulse'), 600);
        }
    }

    followTopic(topicId) {
        if (!this.state.currentUser) {
            this.createAnonymousUser();
        }

        const topic = this.state.topics.find(t => t.id === topicId);
        if (!topic) return;

        const userId = this.state.currentUser.id;
        let isFollowing;
        
        if (topic.followedBy.has(userId)) {
            topic.followedBy.delete(userId);
            topic.followers--;
            isFollowing = false;
            this.showNotification('👋 Unfollowed topic');
        } else {
            topic.followedBy.add(userId);
            topic.followers++;
            isFollowing = true;
            this.showNotification('🔔 Following topic!');
        }

        this.render();
        return isFollowing;
    }

    repostTopic(topicId) {
        if (!this.state.currentUser) {
            this.createAnonymousUser();
        }

        const topic = this.state.topics.find(t => t.id === topicId);
        if (!topic) return;

        const userId = this.state.currentUser.id;
        let isReposted;
        
        if (topic.repostedBy.has(userId)) {
            topic.repostedBy.delete(userId);
            topic.reposts--;
            isReposted = false;
            this.showNotification('🔄 Repost removed');
        } else {
            topic.repostedBy.add(userId);
            topic.reposts++;
            isReposted = true;
            this.showNotification('🔄 Reposted!');
            this.triggerRepostAnimation(topicId);
        }

        this.render();
        return isReposted;
    }

    triggerRepostAnimation(topicId) {
        const btn = document.querySelector(`[data-topic-id="${topicId}"][data-action="repost"]`);
        if (btn) {
            const icon = btn.querySelector('.refresh-icon') || btn;
            icon.style.transform = 'rotate(360deg)';
            setTimeout(() => icon.style.transform = '', 500);
        }
    }

    replyToTopic(topicId, content) {
        if (!this.state.currentUser) {
            this.createAnonymousUser();
        }

        const reply = {
            id: this.state.nextReplyId++,
            topicId: topicId,
            content: content.trim(),
            authorId: this.state.currentUser.id,
            authorUsername: this.state.currentUser.username,
            createdAt: new Date().toISOString(),
            likes: 0,
            likedBy: new Set()
        };

        this.state.replies.push(reply);

        // Update topic reply count
        const topic = this.state.topics.find(t => t.id === topicId);
        if (topic) {
            topic.replies++;
        }

        this.render();
        this.showNotification('💬 Reply posted successfully!', 'success');
        return reply;
    }

    // Enhanced rendering system
    render() {
        this.renderTopics();
        this.updateStats();
        // Re-setup interactions after render
        setTimeout(() => this.setupTopicInteractions(), 100);
        // Recalculate section offsets after render
        setTimeout(() => this.calculateSectionOffsets(), 300);
    }

    renderTopics() {
        const container = document.getElementById('topics-container');
        if (!container) return;

        if (this.state.topics.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-content">
                        <h3>✨ No stories yet</h3>
                        <p>Be the first to share your authentic experience</p>
                    </div>
                </div>
            `;
            return;
        }

        // Sort topics by engagement and recency
        const sortedTopics = [...this.state.topics].sort((a, b) => {
            const engagementA = a.likes + a.replies + a.reposts + a.followers;
            const engagementB = b.likes + b.replies + b.reposts + b.followers;
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            
            if (Math.abs(engagementB - engagementA) < 10) {
                return dateB.getTime() - dateA.getTime();
            }
            return engagementB - engagementA;
        });

        container.innerHTML = sortedTopics.map((topic, index) => 
            this.renderTopicCard(topic, index)
        ).join('');

        // Apply staggered animation
        this.applyStaggeredAnimation();
    }

    renderTopicCard(topic, index) {
        const isLiked = this.state.currentUser && topic.likedBy.has(this.state.currentUser.id);
        const isFollowing = this.state.currentUser && topic.followedBy.has(this.state.currentUser.id);
        const isReposted = this.state.currentUser && topic.repostedBy.has(this.state.currentUser.id);
        const moodColor = this.moodColors[topic.mood] || '#666';

        return `
            <article class="topic-card" data-topic-id="${topic.id}" style="animation-delay: ${index * 50}ms;">
                <div class="topic-header">
                    <div class="topic-info">
                        <h3>${this.escapeHtml(topic.title)}</h3>
                        <div class="topic-meta">
                            <div class="mood-indicator" style="background: ${moodColor};"></div>
                            <span>@${this.escapeHtml(topic.authorUsername)}</span>
                            <span>•</span>
                            <span>${this.formatTimeAgo(topic.createdAt)}</span>
                        </div>
                    </div>
                    <div class="topic-stats">
                        <div>${topic.replies} replies</div>
                        <div>${topic.followers} followers</div>
                    </div>
                </div>
                
                <div class="topic-content">${this.escapeHtml(topic.content)}</div>
                
                <div class="topic-actions">
                    <div class="action-buttons">
                        <button class="action-btn ${isLiked ? 'liked' : ''}" data-action="like" data-topic-id="${topic.id}">
                            ❤️ ${topic.likes}
                        </button>
                        <button class="action-btn" data-action="reply" data-topic-id="${topic.id}">
                            💬 Reply
                        </button>
                        <button class="action-btn ${isReposted ? 'active' : ''}" data-action="repost" data-topic-id="${topic.id}">
                            🔄 ${topic.reposts}
                        </button>
                        <button class="action-btn ${isFollowing ? 'following' : ''}" data-action="follow" data-topic-id="${topic.id}">
                            ${isFollowing ? '⭐ Following' : '⭐ Follow'}
                        </button>
                    </div>
                </div>
            </article>
        `;
    }

    applyStaggeredAnimation() {
        const cards = document.querySelectorAll('.topic-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * this.state.animations.staggerDelay}ms`;
        });
    }

    setupTopicInteractions() {
        console.log('🔧 Setting up topic interactions...');
        document.querySelectorAll('.action-btn').forEach(btn => {
            // Remove existing listeners
            btn.replaceWith(btn.cloneNode(true));
        });

        // Re-select and add fresh listeners
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const action = e.currentTarget.getAttribute('data-action');
                const topicId = parseInt(e.currentTarget.getAttribute('data-topic-id'));
                
                console.log(`🎯 Action: ${action} on topic ${topicId}`);
                
                // Add interaction feedback
                e.currentTarget.style.transform = 'scale(1.1)';
                setTimeout(() => e.currentTarget.style.transform = '', 150);
                
                switch (action) {
                    case 'like':
                        this.likeTopic(topicId);
                        break;
                    case 'reply':
                        this.openReplyModal(topicId);
                        break;
                    case 'repost':
                        this.repostTopic(topicId);
                        break;
                    case 'follow':
                        this.followTopic(topicId);
                        break;
                }
            });
        });
    }

    updateStats() {
        const totalTopicsEl = document.getElementById('total-topics');
        const totalUsersEl = document.getElementById('total-users');
        const totalInteractionsEl = document.getElementById('total-interactions');

        if (totalTopicsEl) {
            this.animateCounter(totalTopicsEl, this.state.topics.length);
        }

        if (totalUsersEl) {
            this.animateCounter(totalUsersEl, this.state.users.size);
        }

        if (totalInteractionsEl) {
            const totalInteractions = this.state.topics.reduce((sum, topic) => 
                sum + topic.likes + topic.replies + topic.reposts, 0
            );
            this.animateCounter(totalInteractionsEl, totalInteractions);
        }
    }

    animateCounter(element, targetValue) {
        const currentValue = parseInt(element.textContent) || 0;
        if (currentValue === targetValue) return;

        const duration = 800;
        const steps = 30;
        const stepValue = (targetValue - currentValue) / steps;
        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;
            const newValue = Math.round(currentValue + (stepValue * currentStep));
            element.textContent = newValue;

            if (currentStep >= steps) {
                clearInterval(timer);
                element.textContent = targetValue;
            }
        }, duration / steps);
    }

    // Enhanced modal management
    openTopicModal() {
        console.log('📝 Opening topic modal...');
        if (!this.state.currentUser) {
            this.createAnonymousUser();
        }

        const modal = document.getElementById('topic-modal');
        if (modal) {
            modal.classList.remove('hidden');
            setTimeout(() => modal.classList.add('show'), 10);
            
            const titleInput = document.getElementById('topic-title');
            if (titleInput) {
                titleInput.focus();
            }
        }
    }

    closeTopicModal() {
        console.log('❌ Closing topic modal...');
        const modal = document.getElementById('topic-modal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.classList.add('hidden');
                this.clearTopicForm();
            }, 300);
        }
    }

    openReplyModal(topicId) {
        console.log('💬 Opening reply modal for topic', topicId);
        const topic = this.state.topics.find(t => t.id === topicId);
        if (!topic) return;

        if (!this.state.currentUser) {
            this.createAnonymousUser();
        }

        const modal = document.getElementById('reply-modal');
        const preview = document.getElementById('reply-topic-preview');
        
        if (preview) {
            const moodColor = this.moodColors[topic.mood] || '#666';
            preview.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <div class="mood-indicator" style="background: ${moodColor};"></div>
                    <strong style="color: var(--fc-text-primary);">${this.escapeHtml(topic.title)}</strong>
                </div>
                <p style="color: var(--fc-text-secondary); margin: 0;">
                    ${this.escapeHtml(topic.content.substring(0, 150))}${topic.content.length > 150 ? '...' : ''}
                </p>
            `;
        }
        
        if (modal) {
            modal.setAttribute('data-topic-id', topicId);
            modal.classList.remove('hidden');
            setTimeout(() => modal.classList.add('show'), 10);
            
            const replyInput = document.getElementById('reply-content');
            if (replyInput) {
                replyInput.focus();
            }
        }
    }

    closeReplyModal() {
        console.log('❌ Closing reply modal...');
        const modal = document.getElementById('reply-modal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.classList.add('hidden');
                this.clearReplyForm();
            }, 300);
        }
    }

    clearTopicForm() {
        const titleInput = document.getElementById('topic-title');
        const contentInput = document.getElementById('topic-content');
        if (titleInput) titleInput.value = '';
        if (contentInput) contentInput.value = '';
        this.updateCharCount('topic-title', 'title-count', 200);
        this.updateCharCount('topic-content', 'content-count', 2000);
    }

    clearReplyForm() {
        const replyInput = document.getElementById('reply-content');
        if (replyInput) replyInput.value = '';
        this.updateCharCount('reply-content', 'reply-count', 1000);
        
        const modal = document.getElementById('reply-modal');
        if (modal) {
            modal.removeAttribute('data-topic-id');
        }
    }

    // Enhanced event listeners
    setupEventListeners() {
        console.log('🎧 Setting up event listeners...');
        
        // Wait for DOM to be fully ready before setting up listeners
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupAllEventListeners();
            });
        } else {
            this.setupAllEventListeners();
        }
    }

    setupAllEventListeners() {
        // Theme toggle - corner button
        const themeToggle = document.getElementById('corner-theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🎨 Theme toggle clicked');
                this.toggleTheme();
            });
        }

        // Create topic trigger - share bar (FIXED)
        const shareBar = document.getElementById('share-bar');
        if (shareBar) {
            shareBar.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('📝 Share bar clicked');
                this.openTopicModal();
            });
        }

        // Refresh feed
        const refreshBtn = document.getElementById('refresh-feed');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🔄 Refresh button clicked');
                this.render();
                this.showNotification('✨ Feed refreshed!');
            });
        }

        // Modal events
        this.setupModalEvents();
        this.setupFormValidation();
        this.setupKeyboardShortcuts();
    }

    setupModalEvents() {
        console.log('🪟 Setting up modal events...');
        
        // Topic modal close buttons
        const closeTopicBtn = document.getElementById('close-topic-modal');
        const cancelTopicBtn = document.getElementById('cancel-topic');
        
        if (closeTopicBtn) {
            closeTopicBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('❌ Close topic modal X button clicked');
                this.closeTopicModal();
            });
        }
        
        if (cancelTopicBtn) {
            cancelTopicBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('❌ Cancel topic button clicked');
                this.closeTopicModal();
            });
        }

        // Reply modal close buttons
        const closeReplyBtn = document.getElementById('close-reply-modal');
        const cancelReplyBtn = document.getElementById('cancel-reply');
        
        if (closeReplyBtn) {
            closeReplyBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('❌ Close reply modal X button clicked');
                this.closeReplyModal();
            });
        }
        
        if (cancelReplyBtn) {
            cancelReplyBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('❌ Cancel reply button clicked');
                this.closeReplyModal();
            });
        }
        
        // Modal backdrop clicks
        const topicModal = document.getElementById('topic-modal');
        const replyModal = document.getElementById('reply-modal');
        
        if (topicModal) {
            topicModal.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal-backdrop')) {
                    console.log('❌ Topic modal backdrop clicked');
                    this.closeTopicModal();
                }
            });
        }
        
        if (replyModal) {
            replyModal.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal-backdrop')) {
                    console.log('❌ Reply modal backdrop clicked');
                    this.closeReplyModal();
                }
            });
        }

        // Form submissions
        const topicForm = document.getElementById('topic-form');
        const replyForm = document.getElementById('reply-form');
        
        if (topicForm) {
            topicForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('📤 Topic form submitted');
                this.handleTopicSubmit();
            });
        }
        
        if (replyForm) {
            replyForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('📤 Reply form submitted');
                this.handleReplySubmit();
            });
        }
    }

    setupFormValidation() {
        // Character counters
        const inputs = [
            { id: 'topic-title', counter: 'title-count', max: 200 },
            { id: 'topic-content', counter: 'content-count', max: 2000 },
            { id: 'reply-content', counter: 'reply-count', max: 1000 }
        ];

        inputs.forEach(({ id, counter, max }) => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', () => {
                    this.updateCharCount(id, counter, max);
                });
            }
        });
    }

    updateCharCount(inputId, counterId, maxLength) {
        const input = document.getElementById(inputId);
        const counter = document.getElementById(counterId);
        
        if (input && counter) {
            const length = input.value.length;
            counter.textContent = length;
            
            // Color coding based on usage
            if (length > maxLength * 0.95) {
                counter.style.color = '#ff4757';
            } else if (length > maxLength * 0.8) {
                counter.style.color = '#ffa502';
            } else {
                counter.style.color = 'var(--fc-text-muted)';
            }
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Escape key closes modals
            if (e.key === 'Escape') {
                this.closeTopicModal();
                this.closeReplyModal();
            }
            
            // Ctrl/Cmd + Enter submits forms
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                const activeModal = document.querySelector('.modal-overlay.show');
                if (activeModal) {
                    if (activeModal.id === 'topic-modal') {
                        this.handleTopicSubmit();
                    } else if (activeModal.id === 'reply-modal') {
                        this.handleReplySubmit();
                    }
                }
            }

            // Quick actions
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.openTopicModal();
            }
        });
    }

    setupAnimations() {
        // Intersection Observer for staggered animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        // Observe topic cards as they're added
        const observeCards = () => {
            document.querySelectorAll('.topic-card').forEach(card => {
                observer.observe(card);
            });
        };

        // Call initially and on updates
        setTimeout(observeCards, 100);
    }

    // Form handlers with fixed loading states
    handleTopicSubmit() {
        console.log('📤 Handling topic submit...');
        const titleInput = document.getElementById('topic-title');
        const contentInput = document.getElementById('topic-content');
        const submitBtn = document.getElementById('submit-topic');
        
        if (titleInput && contentInput && submitBtn) {
            const title = titleInput.value.trim();
            const content = contentInput.value.trim();
            
            if (!title || !content) {
                this.showNotification('⚠️ Please fill in both title and content', 'error');
                return;
            }
            
            if (title.length > 200 || content.length > 2000) {
                this.showNotification('⚠️ Content exceeds character limit', 'error');
                return;
            }
            
            // Show loading state
            this.setButtonLoading(submitBtn, true);
            
            // Simulate posting delay for better UX
            setTimeout(() => {
                try {
                    this.createTopic(title, content);
                    this.closeTopicModal();
                } catch (error) {
                    console.error('Error creating topic:', error);
                    this.showNotification('❌ Error creating topic. Please try again.', 'error');
                } finally {
                    // Always reset loading state
                    this.setButtonLoading(submitBtn, false);
                }
            }, 800);
        }
    }

    handleReplySubmit() {
        console.log('📤 Handling reply submit...');
        const modal = document.getElementById('reply-modal');
        const replyInput = document.getElementById('reply-content');
        const submitBtn = document.getElementById('submit-reply');
        
        if (modal && replyInput && submitBtn) {
            const topicId = parseInt(modal.getAttribute('data-topic-id'));
            const content = replyInput.value.trim();
            
            if (!content) {
                this.showNotification('⚠️ Please enter a reply', 'error');
                return;
            }
            
            if (content.length > 1000) {
                this.showNotification('⚠️ Reply exceeds character limit', 'error');
                return;
            }
            
            // Show loading state
            this.setButtonLoading(submitBtn, true);
            
            setTimeout(() => {
                try {
                    this.replyToTopic(topicId, content);
                    this.closeReplyModal();
                } catch (error) {
                    console.error('Error creating reply:', error);
                    this.showNotification('❌ Error posting reply. Please try again.', 'error');
                } finally {
                    // Always reset loading state
                    this.setButtonLoading(submitBtn, false);
                }
            }, 600);
        }
    }

    setButtonLoading(button, isLoading) {
        if (!button) return;
        
        const textSpan = button.querySelector('.btn-text');
        const loadingSpan = button.querySelector('.btn-loader');
        
        if (textSpan && loadingSpan) {
            if (isLoading) {
                textSpan.classList.add('hidden');
                loadingSpan.classList.remove('hidden');
                button.disabled = true;
                console.log('🔄 Button loading state: ON');
            } else {
                textSpan.classList.remove('hidden');
                loadingSpan.classList.add('hidden');
                button.disabled = false;
                console.log('✅ Button loading state: OFF');
            }
        }
    }

    // Enhanced notification system
    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        const textEl = notification.querySelector('.notification-text');
        
        if (notification && textEl) {
            textEl.textContent = message;
            
            // Add type-specific styling
            notification.className = `notification show ${type}`;
            
            // Auto-hide after 4 seconds
            setTimeout(() => {
                notification.classList.remove('show');
            }, 4000);
        }
    }

    // Utility functions
    formatTimeAgo(dateString) {
        const now = new Date();
        const date = new Date(dateString);
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        return `${Math.floor(diffInSeconds / 604800)}w ago`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the application
let app;

function initializeApp() {
    console.log('🚀 Starting FrustroChat initialization...');
    app = new FrustroChatApp();
    app.init();
    
    // Add global error handling
    window.addEventListener('error', (e) => {
        console.error('Application error:', e.error);
    });
    
    // Add performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`🚀 FrustroChat loaded in ${loadTime}ms`);
        });
    }
}

// DOM ready check
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Export for potential future use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FrustroChatApp;
}