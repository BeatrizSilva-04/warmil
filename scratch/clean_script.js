
    <script>
        // Admin credentials
        const ADMIN_EMAIL = 'gcdarmil78@gmail.com';
        const ADMIN_PASSWORD = 'armil2024';

        // App State
        window.publicActivities = [];

        // Global initialization
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOM fully loaded and parsed');
            
            // Failsafe to hide loading screen
            setTimeout(hideLoadingScreen, 2000);
            
            // Initial data loads
            checkAuth();
            loadGames();
            loadResults();
            loadPublicActivities();

            // Set up UI interactions
            setupUI();
        });

        function setupUI() {
            // Mobile menu
            const menuBtn = document.getElementById('mobile-menu-button');
            const closeBtn = document.getElementById('close-mobile-menu');
            const mobileMenu = document.getElementById('mobile-menu');
            
            if (menuBtn && mobileMenu) {
                menuBtn.onclick = () => {
                    mobileMenu.classList.add('open');
                    document.body.style.overflow = 'hidden';
                };
            }
            if (closeBtn && mobileMenu) {
                closeBtn.onclick = () => {
                    mobileMenu.classList.remove('open');
                    document.body.style.overflow = '';
                };
            }

            // Close mobile menu on link click
            document.querySelectorAll('#mobile-menu a').forEach(link => {
                link.onclick = () => {
                    mobileMenu.classList.remove('open');
                    document.body.style.overflow = '';
                };
            });

            // Smooth scrolling for anchors
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.onclick = function(e) {
                    const targetId = this.getAttribute('href');
                    if (targetId === '#') return;
                    e.preventDefault();
                    const target = document.querySelector(targetId);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                };
            });
        }

        function hideLoadingScreen() {
            const ls = document.getElementById('loading-screen');
            if (ls && !ls.classList.contains('fade-out')) {
                ls.classList.add('fade-out');
                setTimeout(() => { if(ls) ls.style.display = 'none'; }, 500);
            }
        }

        function showView(viewId) {
            console.log('Showing view:', viewId);
            document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
            const target = document.getElementById(viewId);
            if (target) {
                target.classList.add('active');
                window.scrollTo(0, 0);
            } else {
                console.error('View not found:', viewId);
            }
        }

        function showHome() { showView('home-view'); }
        function showAdminLogin() { 
            showView('admin-login-view'); 
            const pwInput = document.getElementById('admin-password');
            if (pwInput) pwInput.value = '';
            const errDiv = document.getElementById('login-error');
            if (errDiv) errDiv.classList.add('hidden');
        }
        function showAdminPanel() { 
            showView('admin-panel-view'); 
            loadAdminGames();
            loadAdminResults();
            loadAdminActivities();
        }

        function checkAuth() {
            if (!auth) return;
            auth.onAuthStateChanged(user => {
                if (user && user.email === ADMIN_EMAIL) {
                    const loginView = document.getElementById('admin-login-view');
                    if (loginView && loginView.classList.contains('active')) {
                        showAdminPanel();
                    }
                }
            });
        }

        async function handleLogin(e) {
            e.preventDefault();
            const emailInput = document.getElementById('admin-email');
            const passwordInput = document.getElementById('admin-password');
            if (!emailInput || !passwordInput) return;
            
            const email = emailInput.value;
            const password = passwordInput.value;
            const errorDiv = document.getElementById('login-error');
            try {
                await auth.signInWithEmailAndPassword(email, password);
                showAdminPanel();
            } catch (error) {
                console.error('Login error:', error);
                if (errorDiv) {
                    errorDiv.textContent = 'Email ou palavra-passe incorretos!';
                    errorDiv.classList.remove('hidden');
                }
            }
        }

        async function handleLogout() {
            await auth.signOut();
            showHome();
        }

        function showAdminTab(tab) {
            document.querySelectorAll('.admin-tab').forEach(t => t.classList.add('hidden'));
            const targetTab = document.getElementById('admin-tab-' + tab);
            if (targetTab) targetTab.classList.remove('hidden');

            document.querySelectorAll('[id^="tab-"]').forEach(btn => {
                btn.classList.remove('border-primary', 'text-primary');
                btn.classList.add('border-transparent', 'text-gray-600');
            });
            const activeBtn = document.getElementById('tab-' + tab);
            if (activeBtn) {
                activeBtn.classList.add('border-primary', 'text-primary');
                activeBtn.classList.remove('border-transparent', 'text-gray-600');
            }
        }

        // Data Loading
        function loadGames() {
            db.collection('games').orderBy('date', 'asc').onSnapshot(snap => {
                const games = snap.docs.map(doc => ({id: doc.id, ...doc.data()}));
                updatePublicMatches(games);
            });
        }
        function loadResults() {
            db.collection('results').orderBy('date', 'desc').onSnapshot(snap => {
                const results = snap.docs.map(doc => ({id: doc.id, ...doc.data()}));
                updatePublicResults(results);
            });
        }
        function loadPublicActivities() {
            db.collection('activities').orderBy('order', 'asc').onSnapshot(snap => {
                const activities = snap.docs.map(doc => ({id: doc.id, ...doc.data()}));
                window.publicActivities = activities;
                updatePublicActivitiesView(activities);
            });
        }

        function updatePublicMatches(games) {
            const container = document.getElementById('upcoming-matches-list');
            if (!container) return;
            const now = new Date();
            now.setHours(0,0,0,0);
            const filtered = games.filter(g => new Date(g.date) >= now).slice(0, 6);
            if (filtered.length === 0) {
                container.innerHTML = '<p class="text-muted-foreground text-center py-12">Nenhum jogo agendado.</p>';
                return;
            }
            container.innerHTML = filtered.map(game => {
                const d = new Date(game.date);
                const day = d.toLocaleDateString('pt-PT', {day: '2-digit', month: '2-digit'});
                const time = d.toLocaleTimeString('pt-PT', {hour: '2-digit', minute: '2-digit'});
                return `
                    <div class="match-card-premium group !p-0 overflow-hidden flex flex-col border-none shadow-md">
                        <div class="bg-gray-50/80 px-4 py-2 flex justify-between items-center">
                            <span class="bg-primary/10 text-primary px-2 py-0.5 rounded text-[8px] font-black uppercase">${game.team}</span>
                            <span class="text-gray-900 font-black text-[10px]">${day}</span>
                        </div>
                        <div class="p-5 flex items-center justify-between gap-4">
                            <div class="flex flex-col items-center flex-1">
                                <img src="img/simboloarmil.png" class="w-10 h-10 object-contain filter brightness-0">
                                <span class="font-black text-[10px] uppercase mt-2">${game.homeTeam}</span>
                            </div>
                            <div class="bg-gray-900 text-white px-2 py-1 rounded">${time}</div>
                            <div class="flex flex-col items-center flex-1">
                                <img src="${game.awayLogo || 'img/simboloarmil.png'}" class="w-10 h-10 object-contain" onerror="this.src='img/simboloarmil.png'">
                                <span class="font-black text-[10px] uppercase mt-2">${game.awayTeam}</span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        function updatePublicResults(results) {
            const container = document.getElementById('recent-results-list');
            if (!container) return;
            container.innerHTML = results.slice(0, 6).map(res => `
                <div class="match-card-premium !p-0 overflow-hidden shadow-md flex flex-col">
                    <div class="bg-gray-50 px-4 py-2 flex justify-between">
                        <span class="text-[8px] font-black uppercase">${res.team}</span>
                        <span class="text-[10px] font-black">${new Date(res.date).toLocaleDateString()}</span>
                    </div>
                    <div class="p-5 flex items-center justify-between">
                        <span class="font-black text-[11px] flex-1 text-center">${res.homeTeam}</span>
                        <div class="bg-black text-white px-3 py-1 rounded-lg font-black">${res.homeScore} - ${res.awayScore}</div>
                        <span class="font-black text-[11px] flex-1 text-center">${res.awayTeam}</span>
                    </div>
                </div>
            `).join('');
        }

        function updatePublicActivitiesView(list) {
            const container = document.getElementById('activities-container');
            if (!container) return;
            if (list.length === 0) {
                container.innerHTML = '<p class="text-center py-12">Brevemente.</p>';
                return;
            }
            container.innerHTML = list.map(act => `
                <div class="premium-card group cursor-pointer" onclick="openActivityModal('${act.id}')">
                    <div class="relative h-64">
                        <img src="${act.photo}" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80'">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/80 flex items-end p-6">
                            <h3 class="text-white font-black text-2xl">${act.title}</h3>
                        </div>
                    </div>
                    <div class="p-6">
                        <p class="text-muted-foreground line-clamp-3">${act.description}</p>
                    </div>
                </div>
            `).join('');
        }

        // Admin Loading
        function loadAdminGames() {
            db.collection('games').orderBy('date', 'desc').onSnapshot(snap => {
                const list = document.getElementById('games-list');
                if (!list) return;
                const games = snap.docs.map(doc => ({id: doc.id, ...doc.data()}));
                list.innerHTML = games.map(g => `
                    <div class="match-item flex justify-between">
                        <div>
                            <p class="font-bold">${g.team} - ${new Date(g.date).toLocaleString()}</p>
                            <p>${g.homeTeam} vs ${g.awayTeam}</p>
                        </div>
                        <button onclick="deleteGame('${g.id}')" class="bg-red-600 text-white px-2 py-1 rounded">X</button>
                    </div>
                `).join('');
            });
        }
        function loadAdminResults() {
            db.collection('results').orderBy('date', 'desc').onSnapshot(snap => {
                const list = document.getElementById('results-list');
                if (!list) return;
                const results = snap.docs.map(doc => ({id: doc.id, ...doc.data()}));
                list.innerHTML = results.map(r => `
                    <div class="match-item flex justify-between">
                        <div>
                            <p class="font-bold">${r.team} - ${r.homeTeam} ${r.homeScore}-${r.awayScore} ${r.awayTeam}</p>
                        </div>
                        <button onclick="deleteResult('${r.id}')" class="bg-red-600 text-white px-2 py-1 rounded">X</button>
                    </div>
                `).join('');
            });
        }
        function loadAdminActivities() {
            db.collection('activities').orderBy('order', 'desc').onSnapshot(snap => {
                const list = document.getElementById('admin-activities-list-inner');
                if (!list) return;
                const activities = snap.docs.map(doc => ({id: doc.id, ...doc.data()}));
                list.innerHTML = activities.map(a => `
                    <div class="match-item flex justify-between">
                        <span>${a.title}</span>
                        <button onclick="deleteActivity('${a.id}')" class="bg-red-600 text-white px-2 py-1 rounded">X</button>
                    </div>
                `).join('');
            });
        }

        // Deletion
        async function deleteGame(id) { if(confirm('Eliminar jogo?')) await db.collection('games').doc(id).delete(); }
        async function deleteResult(id) { if(confirm('Eliminar resultado?')) await db.collection('results').doc(id).delete(); }
        async function deleteActivity(id) { if(confirm('Eliminar atividade?')) await db.collection('activities').doc(id).delete(); }

        // Modal etc
        let currentActivityImages = [];
        let currentImageIndex = 0;
        function openActivityModal(id) {
            const act = window.publicActivities.find(a => a.id === id);
            if (!act) return;
            currentActivityImages = [act.photo, ...(act.gallery || [])].filter(u => !!u);
            currentImageIndex = 0;
            document.getElementById('modal-title').textContent = act.title;
            document.getElementById('modal-main-img').src = act.photo;
            document.getElementById('modal-description').textContent = act.description;
            document.getElementById('activity-modal').classList.remove('hidden');
            document.getElementById('activity-modal').classList.add('flex');
        }
        function closeActivityModal() {
            document.getElementById('activity-modal').classList.add('hidden');
            document.getElementById('activity-modal').classList.remove('flex');
        }
    </script>
