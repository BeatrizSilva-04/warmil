
        // Admin credentials
        const ADMIN_EMAIL = 'gcdarmil78@gmail.com';
        const ADMIN_PASSWORD = 'armil2024';

        // Initialize
        window.addEventListener('load', function () {
            hideLoadingScreen();
            checkAuth();
            loadGames();
            loadResults();
            loadPublicActivities();
        });

        // Initialize default activities if empty
        if (!localStorage.getItem('gcdArmilActivities')) {
            const defaultActivities = [
                { id: 1, title: 'Reis', description: 'CelebraÃ§Ã£o tradicional de Reis com a comunidade.', photo: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80' },
                { id: 2, title: 'Torneio Armil Cup', description: 'O nosso grande torneio anual que reÃºne equipas de toda a regiÃ£o.', photo: 'img/armilcup.jpg' },
                { id: 3, title: 'Magusto', description: 'Pista de castanhas e convÃvio tradicional de SÃ£o Martinho.', photo: 'https://images.unsplash.com/photo-1541854615901-93c354197834?auto=format&fit=crop&w=800&q=80' },
                { id: 4, title: 'Caminhadas', description: 'Atividades ao ar livre promovendo a saÃºde e o contacto com a natureza.', photo: 'https://images.unsplash.com/photo-1551632432-c7288d7439a7?auto=format&fit=crop&w=800&q=80' },
                { id: 5, title: 'Capoeira', description: 'Aulas de capoeira integrando cultura e desporto para todas as idades.', photo: 'https://images.unsplash.com/photo-1574676403204-61c0d8328224?auto=format&fit=crop&w=800&q=80' }
            ];
            localStorage.setItem('gcdArmilActivities', JSON.stringify(defaultActivities));
        }

        function loadPublicActivities() {
            db.collection('activities').orderBy('order', 'asc').onSnapshot(snapshot => {
                const activities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Store activities globally for modal access
                window.publicActivities = activities;

                // Update public view
                const container = document.getElementById('activities-container');
                if (container) {
                    if (activities.length === 0) {
                        container.innerHTML = '<p class="text-muted-foreground col-span-full text-center py-12">Brevemente teremos novidades.</p>';
                    } else {
                        container.innerHTML = activities.map(activity => `
                            <div class="premium-card overflow-hidden group cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all" onclick="openActivityModal('${activity.id}')">
                                <div class="relative h-64 overflow-hidden">
                                    <img src="${activity.photo}" alt="${activity.title}" 
                                         class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                         onerror="this.src='https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80'">
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
                                        <h3 class="font-montserrat font-black text-3xl text-white uppercase tracking-tighter">${activity.title}</h3>
                                    </div>
                                    <div class="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
                                        </svg>
                                    </div>
                                </div>
                                <div class="p-8">
                                    <p class="font-open-sans text-muted-foreground text-lg leading-relaxed line-clamp-3">${activity.description}</p>
                                    <div class="mt-4 flex items-center text-primary font-bold text-sm uppercase tracking-wider group-hover:translate-x-2 transition-transform">
                                        Ver mais detalhes
                                        <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        `).join('');
                    }
                }

                // Update admin list
                const adminList = document.getElementById('admin-activities-list-inner');
                if (adminList) {
                    if (activities.length === 0) {
                        adminList.innerHTML = '<p class="text-muted-foreground">Nenhuma atividade registada.</p>';
                    } else {
                        adminList.innerHTML = activities.map(activity => `
                            <div class="match-item">
                                <div class="flex justify-between items-start">
                                    <div class="flex-1">
                                        <p class="font-bold text-lg">${activity.title}</p>
                                        <p class="text-sm text-gray-600 line-clamp-2">${activity.description}</p>
                                    </div>
                                    <button onclick="deleteActivity('${activity.id}')" class="btn btn-danger btn-sm">Eliminar</button>
                                </div>
                            </div>
                        `).join('');
                    }
                }
            });
        }

        async function handleAddActivity(event) {
            event.preventDefault();

            const photoFile = document.getElementById('activity-photo-file-admin').files[0];
            const photoUrl = document.getElementById('activity-photo-url-admin').value;
            const galleryFiles = document.getElementById('activity-gallery-files-admin').files;

            if (!photoFile && !photoUrl) {
                alert('Por favor, adicione uma foto principal.');
                return;
            }

            const photoPromise = photoFile ? compressImage(photoFile) : Promise.resolve(photoUrl);
            const galleryPromises = Array.from(galleryFiles).map(file => compressImage(file));

            Promise.all([photoPromise, Promise.all(galleryPromises)]).then(async ([finalPhoto, finalGallery]) => {
                const activity = {
                    title: document.getElementById('activity-title-admin').value,
                    description: document.getElementById('activity-desc-admin').value,
                    photo: finalPhoto,
                    gallery: finalGallery, // Store multiple images in an array
                    order: Date.now(),
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                };

                try {
                    await db.collection('activities').add(activity);
                    document.getElementById('add-activity-form').reset();
                    document.getElementById('activity-photo-preview-admin').classList.add('hidden');
                    document.getElementById('activity-gallery-preview-admin').innerHTML = '';
                    alert('Atividade adicionada com sucesso!');
                } catch (error) {
                    console.error("Error adding activity: ", error);
                    alert('Erro ao adicionar atividade: ' + error.message);
                }
            });
        }

        async function deleteActivity(id) {
            if (confirm('Tem a certeza que deseja eliminar esta atividade?')) {
                try {
                    await db.collection('activities').doc(id).delete();
                } catch (error) {
                    console.error("Error deleting activity: ", error);
                }
            }
        }

        // Failsafe: hide loading screen after 3 seconds even if load fails
        setTimeout(hideLoadingScreen, 3000);

        function hideLoadingScreen() {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen && loadingScreen.style.display !== 'none') {
                loadingScreen.classList.add('fade-out');
                setTimeout(function () {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
        }

        // View switching
        function showView(viewId) {
            document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
            document.getElementById(viewId).classList.add('active');
            window.scrollTo(0, 0);
        }

        function showHome() {
            showView('home-view');
        }

        function showAdminLogin() {
            showView('admin-login-view');
            document.getElementById('admin-password').value = '';
            document.getElementById('login-error').classList.add('hidden');
        }

        function showAdminPanel() {
            showView('admin-panel-view');
            loadGames();
            loadResults();
        }

        // Authentication
        function checkAuth() {
            auth.onAuthStateChanged(user => {
                if (user && user.email === ADMIN_EMAIL) {
                    // Logged in as admin
                    if (document.getElementById('admin-login-view').classList.contains('active')) {
                        showAdminPanel();
                    }
                }
            });
        }

        async function handleLogin(event) {
            event.preventDefault();
            const email = document.getElementById('admin-email').value;
            const password = document.getElementById('admin-password').value;
            const errorDiv = document.getElementById('login-error');

            try {
                await auth.signInWithEmailAndPassword(email, password);
                showAdminPanel();
            } catch (error) {
                console.error("Login error:", error);
                errorDiv.textContent = "Email ou palavra-passe incorretos!";
                errorDiv.classList.remove('hidden');
            }
        }

        async function handleLogout() {
            try {
                await auth.signOut();
                showHome();
            } catch (error) {
                console.error("Logout error:", error);
            }
        }

        // Admin tabs
        function showAdminTab(tab) {
            document.querySelectorAll('.admin-tab').forEach(t => t.classList.add('hidden'));
            document.getElementById('admin-tab-' + tab).classList.remove('hidden');

            document.querySelectorAll('[id^="tab-"]').forEach(btn => {
                btn.classList.remove('border-primary', 'text-primary');
                btn.classList.add('border-transparent', 'text-gray-600');
            });

            const activeBtn = document.getElementById('tab-' + tab);
            activeBtn.classList.add('border-primary', 'text-primary');
            activeBtn.classList.remove('border-transparent', 'text-gray-600');
        }

        // Games management
        async function handleAddGame(event) {
            event.preventDefault();

            // Get file inputs
            const homeLogoFile = document.getElementById('game-home-logo-file').files[0];
            const awayLogoFile = document.getElementById('game-away-logo-file').files[0];

            // Convert files to base64 with compression
            const homeLogo = homeLogoFile ? compressImage(homeLogoFile, 400) : Promise.resolve(document.getElementById('game-home-logo').value);
            const awayLogo = awayLogoFile ? compressImage(awayLogoFile, 400) : Promise.resolve(document.getElementById('game-away-logo').value);

            Promise.all([homeLogo, awayLogo]).then(async ([finalHomeLogo, finalAwayLogo]) => {
                const game = {
                    date: document.getElementById('game-date').value,
                    team: document.getElementById('game-team').value,
                    homeTeam: document.getElementById('game-home-team').value,
                    awayTeam: document.getElementById('game-away-team').value,
                    location: document.getElementById('game-location').value,
                    homeLogo: finalHomeLogo,
                    awayLogo: finalAwayLogo,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                };

                try {
                    await db.collection('games').add(game);
                    document.getElementById('add-game-form').reset();
                    document.getElementById('game-home-logo-preview').classList.add('hidden');
                    document.getElementById('game-away-logo-preview').classList.add('hidden');
                    alert('Jogo adicionado com sucesso!');
                } catch (error) {
                    console.error("Error adding game: ", error);
                    alert('Erro ao adicionar jogo: ' + error.message);
                }
            });
        }

        function loadGames() {
            db.collection('games').orderBy('date', 'asc').onSnapshot(snapshot => {
                const games = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const container = document.getElementById('games-list');
                if (!container) return;

                if (games.length === 0) {
                    container.innerHTML = '<p class="text-muted-foreground">Nenhum jogo agendado.</p>';
                    return;
                }

                container.innerHTML = games.map(game => `
                    <div class="match-item">
                        <div class="flex justify-between items-start">
                            <div class="flex-1">
                                <p class="font-bold">${new Date(game.date).toLocaleString('pt-PT')}</p>
                                <p class="text-sm text-gray-600">${game.team}</p>
                                <p class="mt-2">${game.homeTeam} vs ${game.awayTeam}</p>
                                <p class="text-sm text-gray-600">${game.location}</p>
                            </div>
                            <button onclick="deleteGame('${game.id}')" class="btn btn-danger btn-sm">Eliminar</button>
                        </div>
                    </div>
                `).join('');

                // Also update the public view
                updatePublicMatches(games);
            });
        }

        async function deleteGame(id) {
            if (confirm('Tem a certeza que deseja eliminar este jogo?')) {
                try {
                    await db.collection('games').doc(id).delete();
                } catch (error) {
                    console.error("Error deleting game: ", error);
                }
            }
        }

        // Results management
        async function handleAddResult(event) {
            event.preventDefault();

            const homeLogoFile = document.getElementById('result-home-logo-file').files[0];
            const awayLogoFile = document.getElementById('result-away-logo-file').files[0];
            const photoFile = document.getElementById('result-photo-file').files[0];

            const homeLogo = homeLogoFile ? compressImage(homeLogoFile, 400) : Promise.resolve(document.getElementById('result-home-logo').value);
            const awayLogo = awayLogoFile ? compressImage(awayLogoFile, 400) : Promise.resolve(document.getElementById('result-away-logo').value);
            const photo = photoFile ? compressImage(photoFile) : Promise.resolve(document.getElementById('result-photo').value);

            Promise.all([homeLogo, awayLogo, photo]).then(async ([finalHomeLogo, finalAwayLogo, finalPhoto]) => {
                const result = {
                    date: document.getElementById('result-date').value,
                    team: document.getElementById('result-team').value,
                    homeTeam: document.getElementById('result-home-team').value,
                    homeScore: document.getElementById('result-home-score').value,
                    awayTeam: document.getElementById('result-away-team').value,
                    awayScore: document.getElementById('result-away-score').value,
                    location: document.getElementById('result-location').value,
                    homeLogo: finalHomeLogo,
                    awayLogo: finalAwayLogo,
                    photo: finalPhoto,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                };

                try {
                    await db.collection('results').add(result);
                    document.getElementById('add-result-form').reset();
                    document.getElementById('result-home-logo-preview').classList.add('hidden');
                    document.getElementById('result-away-logo-preview').classList.add('hidden');
                    document.getElementById('result-photo-preview').classList.add('hidden');
                    alert('Resultado adicionado com sucesso!');
                } catch (error) {
                    console.error("Error adding result: ", error);
                }
            });
        }

        function loadResults() {
            db.collection('results').orderBy('date', 'desc').onSnapshot(snapshot => {
                const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const container = document.getElementById('results-list');
                if (!container) return;

                if (results.length === 0) {
                    container.innerHTML = '<p class="text-muted-foreground">Nenhum resultado registado.</p>';
                    return;
                }

                container.innerHTML = results.map(result => `
                    <div class="match-item">
                        <div class="flex justify-between items-start">
                            <div class="flex-1">
                                <p class="font-bold">${new Date(result.date).toLocaleDateString('pt-PT')}</p>
                                <p class="text-sm text-gray-600">${result.team}</p>
                                <p class="mt-2 text-lg">${result.homeTeam} <span class="font-bold">${result.homeScore} - ${result.awayScore}</span> ${result.awayTeam}</p>
                                <p class="text-sm text-gray-600">${result.location}</p>
                                ${result.photo ? `<img src="${result.photo}" alt="Foto do jogo" class="mt-2">` : ''}
                            </div>
                            <button onclick="deleteResult('${result.id}')" class="btn btn-danger btn-sm">Eliminar</button>
                        </div>
                    </div>
                `).join('');

                updatePublicResults(results);
            });
        }

        async function deleteResult(id) {
            if (confirm('Tem a certeza que deseja eliminar este resultado?')) {
                try {
                    await db.collection('results').doc(id).delete();
                } catch (error) {
                    console.error("Error deleting result: ", error);
                }
            }
        }

        

        function updatePublicMatches(games) {
            const container = document.getElementById('upcoming-matches-list');
            if (!container) return;

            const now = new Date();
            now.setHours(0, 0, 0, 0); // Start of today
            const upcomingGames = games
                .filter(game => new Date(game.date) >= now)
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .slice(0, 6);

            if (upcomingGames.length === 0) {
                container.innerHTML = '<p class="text-muted-foreground col-span-full text-center py-12">Nenhum jogo agendado no momento.</p>';
                return;
            }

            container.innerHTML = upcomingGames.map(game => {
                const gameDate = new Date(game.date);
                const day = gameDate.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' });
                const time = gameDate.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
                const weekday = gameDate.toLocaleDateString('pt-PT', { weekday: 'short' });

                return `
                <div class="match-card-premium group !p-0 overflow-hidden flex flex-col border-none shadow-md hover:shadow-2xl transition-all duration-500">
                    <!-- Card Top Info -->
                    <div class="bg-gray-50/80 px-4 py-2 flex justify-between items-center border-b border-gray-100/50">
                        <span class="bg-primary/10 text-primary px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest">${game.team}</span>
                        <div class="flex items-center gap-2">
                            <span class="text-gray-400 font-bold text-[9px] uppercase">${weekday}</span>
                            <span class="text-gray-900 font-black text-[10px]">${day}</span>
                        </div>
                    </div>

                    <!-- Main Match Area -->
                    <div class="p-5 flex items-center justify-between gap-4 bg-white relative">
                        <!-- Home Team -->
                        <div class="flex flex-col items-center flex-1 min-w-0">
                            <div class="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center p-2 mb-3 shadow-inner group-hover:scale-105 transition-transform duration-500 border border-gray-100">
                                <img src="img/simboloarmil.png" class="w-full h-full object-contain filter brightness-0">
                            </div>
                            <span class="font-black text-[10px] uppercase text-center leading-tight h-7 flex items-center px-1">${game.homeTeam}</span>
                        </div>

                        <!-- VS Divider -->
                        <div class="flex flex-col items-center gap-2 shrink-0">
                            <div class="bg-gray-900 text-white w-12 h-8 rounded-lg flex items-center justify-center shadow-lg transform group-hover:rotate-3 transition-transform">
                                <span class="font-black text-xs font-montserrat">${time}</span>
                            </div>
                            <span class="text-[8px] font-black text-gray-200 tracking-[0.2em] uppercase">VS</span>
                        </div>

                        <!-- Away Team -->
                        <div class="flex flex-col items-center flex-1 min-w-0">
                            <div class="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center p-2 mb-3 shadow-inner group-hover:scale-105 transition-transform duration-500 border border-gray-100">
                                <img src="${game.awayLogo || 'img/simboloarmil.png'}" class="w-full h-full object-contain" onerror="this.src='img/simboloarmil.png'">
                            </div>
                            <span class="font-black text-[10px] uppercase text-center leading-tight h-7 flex items-center px-1">${game.awayTeam}</span>
                        </div>
                    </div>

                    <!-- Footer Info -->
                    <div class="bg-gray-50/30 px-4 py-2 border-t border-gray-100/50 flex justify-center items-center gap-2">
                        <svg class="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        <span class="text-[9px] font-bold text-gray-400 uppercase tracking-wider text-center">${game.location}</span>
                    </div>
                </div>
            `;
            }).join('');
        }

        function updatePublicResults(results) {
            const container = document.getElementById('recent-results-list');
            if (!container) return;

            if (results.length === 0) {
                container.innerHTML = '<p class="text-muted-foreground col-span-full text-center py-12">Nenhum resultado registado.</p>';
                return;
            }

            container.innerHTML = results.slice(0, 6).map(result => {
                const isWin = parseInt(result.homeScore) > parseInt(result.awayScore);
                const isDraw = parseInt(result.homeScore) === parseInt(result.awayScore);
                const statusColor = isWin ? 'text-green-600' : (isDraw ? 'text-yellow-600' : 'text-red-600');
                const statusBg = isWin ? 'bg-green-50' : (isDraw ? 'bg-yellow-50' : 'bg-red-50');
                const statusText = isWin ? 'Vitória' : (isDraw ? 'Empate' : 'Derrota');
                const gameDate = new Date(result.date);
                const day = gameDate.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' });

                return `
                <div class="match-card-premium group !p-0 overflow-hidden flex flex-col border-none shadow-md hover:shadow-2xl transition-all duration-500">
                    <!-- Result Status Header -->
                    <div class="${statusBg} px-4 py-2 flex justify-between items-center border-b border-gray-100/50">
                        <span class="${statusColor} text-[8px] font-black uppercase tracking-[0.2em]">${statusText}</span>
                        <div class="flex items-center gap-2">
                             <span class="text-gray-400 font-bold text-[9px] uppercase">${result.team}</span>
                             <span class="text-gray-900 font-black text-[10px] ml-2">${day}</span>
                        </div>
                    </div>

                    <!-- Main Result Area -->
                    <div class="p-5 flex items-center justify-between gap-4 bg-white relative">
                        <!-- Home Team -->
                        <div class="flex flex-col items-center flex-1 min-w-0">
                            <div class="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center p-2 mb-3 shadow-inner group-hover:scale-105 transition-transform duration-500 border border-gray-100">
                                <img src="img/simboloarmil.png" class="w-full h-full object-contain filter brightness-0">
                            </div>
                            <span class="font-black text-[10px] uppercase text-center leading-tight h-7 flex items-center px-1">${result.homeTeam}</span>
                        </div>

                        <!-- Score Badge -->
                        <div class="flex flex-col items-center gap-2 shrink-0">
                            <div class="bg-gray-900 text-white px-4 py-2 rounded-xl shadow-xl flex items-center gap-3 border border-gray-800 transform group-hover:scale-110 transition-transform">
                                <span class="text-xl font-black font-montserrat tabular-nums">${result.homeScore}</span>
                                <span class="w-px h-4 bg-white/20"></span>
                                <span class="text-xl font-black font-montserrat tabular-nums">${result.awayScore}</span>
                            </div>
                            <span class="text-[8px] font-black text-gray-300 tracking-[0.3em] uppercase">FINAL</span>
                        </div>

                        <!-- Away Team -->
                        <div class="flex flex-col items-center flex-1 min-w-0">
                            <div class="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center p-2 mb-3 shadow-inner group-hover:scale-105 transition-transform duration-500 border border-gray-100">
                                <img src="${result.awayLogo || 'img/simboloarmil.png'}" class="w-full h-full object-contain" onerror="this.src='img/simboloarmil.png'">
                            </div>
                            <span class="font-black text-[10px] uppercase text-center leading-tight h-7 flex items-center px-1">${result.awayTeam}</span>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="bg-gray-50/30 px-4 py-2 border-t border-gray-100/50 flex justify-center items-center">
                        <span class="text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center">${result.location}</span>
                    </div>
                </div>`;
            }).join('');
        }

        // Team players functions
        

        // Mobile menu
        document.getElementById('mobile-menu-button').addEventListener('click', () => {
            document.getElementById('mobile-menu').classList.add('open');
        });

        document.getElementById('close-mobile-menu').addEventListener('click', () => {
            document.getElementById('mobile-menu').classList.remove('open');
        });

        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        function compressImage(file, maxWidth = 1200, quality = 0.7) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = event => {
                    const img = new Image();
                    img.src = event.target.result;
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        let width = img.width;
                        let height = img.height;

                        if (width > height) {
                            if (width > maxWidth) {
                                height *= maxWidth / width;
                                width = maxWidth;
                            }
                        } else {
                            if (height > maxWidth) {
                                width *= maxWidth / height;
                                height = maxWidth;
                            }
                        }

                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);

                        // Convert to JPEG with compression
                        const dataUrl = canvas.toDataURL('image/jpeg', quality);
                        resolve(dataUrl);
                    };
                    img.onerror = reject;
                };
                reader.onerror = reject;
            });
        }

        function previewImage(input, previewId) {
            const preview = document.getElementById(previewId);
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    preview.src = e.target.result;
                    preview.classList.remove('hidden');
                };
                reader.readAsDataURL(input.files[0]);
            }
        }

        function previewMultipleImages(input, previewContainerId) {
            const container = document.getElementById(previewContainerId);
            container.innerHTML = '';
            if (input.files) {
                Array.from(input.files).forEach(file => {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.className = 'w-full h-16 object-cover rounded-lg border border-gray-200';
                        container.appendChild(img);
                    };
                    reader.readAsDataURL(file);
                });
            }
        }

        // === MODERN VISUAL ENHANCEMENTS ===

        // Parallax effect on hero
        let ticking = false;
        window.addEventListener('scroll', function () {
            const heroSection = document.querySelector('#home');
            if (!heroSection) return;

            if (!ticking) {
                window.requestAnimationFrame(function () {
                    const scrolled = window.pageYOffset;
                    const heroImage = heroSection.querySelector('.absolute.inset-0');
                    if (heroImage && scrolled < heroSection.offsetHeight) {
                        heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Intersection Observer for fade-in animations
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observerCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        // Observe elements for animation
        document.addEventListener('DOMContentLoaded', () => {
            const animateElements = document.querySelectorAll('.premium-card, .match-item, section h2, section h3');
            animateElements.forEach(el => observer.observe(el));
        });

        // Enhanced mobile menu with backdrop
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const closeMobileMenu = document.getElementById('close-mobile-menu');

        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.add('open');
                document.body.style.overflow = 'hidden';
            });
        }

        if (closeMobileMenu && mobileMenu) {
            closeMobileMenu.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
            });

            // Close on backdrop click
            mobileMenu.addEventListener('click', (e) => {
                if (e.target === mobileMenu) {
                    mobileMenu.classList.remove('open');
                    document.body.style.overflow = '';
                }
            });

            // Close menu when clicking a link
            const mobileLinks = mobileMenu.querySelectorAll('a');
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    setTimeout(() => {
                        mobileMenu.classList.remove('open');
                        document.body.style.overflow = '';
                    }, 300);
                });
            });
        }

        // Smooth reveal for cards with stagger
        function revealCards() {
            const cards = document.querySelectorAll('.premium-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(30px)';
                    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                }, index * 100);
            });
        }

        // Call reveal after content loads
        window.addEventListener('load', () => {
            setTimeout(revealCards, 500);
        });

        // Add hover sound effect simulation (visual feedback)
        document.querySelectorAll('.btn-premium, .btn-primary-premium').forEach(button => {
            button.addEventListener('mouseenter', function () {
                this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            });
        });

        // Performance optimization: Throttle scroll events
        function throttle(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        // Update header on scroll
        let lastScrollTop = 0;
        const header = document.querySelector('header');

        window.addEventListener('scroll', throttle(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > 100) {
                header.style.backdropFilter = 'blur(20px) saturate(180%)';
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
            } else {
                header.style.backdropFilter = 'blur(12px)';
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.75)';
                header.style.boxShadow = '';
            }

            lastScrollTop = scrollTop;
        }, 100));

        // Add touch ripple effect to buttons
        document.querySelectorAll('button, .btn-premium, .btn-primary-premium').forEach(button => {
            button.addEventListener('click', function (e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');

                this.appendChild(ripple);

                setTimeout(() => ripple.remove(), 600);
            });
        });

        // Add ripple CSS dynamically
        const style = document.createElement('style');
        style.textContent = `
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple-animation 0.6s ease-out;
                pointer-events: none;
            }
            
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
            opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        let currentActivityImages = [];
        let currentImageIndex = 0;

        function openActivityModal(id) {
            const activity = window.publicActivities.find(a => a.id === id);
            if (!activity) return;

            const modal = document.getElementById('activity-modal');
            const title = document.getElementById('modal-title');
            const mainImg = document.getElementById('modal-main-img');
            const desc = document.getElementById('modal-description');
            const gallery = document.getElementById('modal-gallery');
            const galleryGrid = document.getElementById('modal-gallery-grid');
            const prevBtn = document.getElementById('modal-prev');
            const nextBtn = document.getElementById('modal-next');
            const counter = document.getElementById('modal-counter');

            // Combine main photo and gallery for the carousel
            currentActivityImages = [activity.photo, ...(activity.gallery || [])].filter(url => !!url);
            currentImageIndex = 0;

            // Populate static content
            title.textContent = activity.title;
            desc.innerHTML = activity.description ? activity.description.replace(/\n/g, '<br>') : 'Sem descrição disponível.';

            updateModalImage();

            // Handle navigation buttons
            if (currentActivityImages.length > 1) {
                prevBtn.classList.remove('hidden');
                nextBtn.classList.remove('hidden');
                counter.classList.remove('hidden');
                gallery.classList.remove('hidden');
            } else {
                prevBtn.classList.add('hidden');
                nextBtn.classList.add('hidden');
                counter.classList.add('hidden');
                gallery.classList.add('hidden');
            }

            // Populate Gallery Grid
            galleryGrid.innerHTML = '';
            currentActivityImages.forEach((photoUrl, index) => {
                const imgDiv = document.createElement('div');
                imgDiv.className = `h-24 md:h-32 rounded-lg overflow-hidden cursor-pointer transition-all border-4 ${index === 0 ? 'border-primary blur-0' : 'border-transparent hover:border-primary/50'}`;
                imgDiv.innerHTML = `<img src="${photoUrl}" class="w-full h-full object-cover">`;
                imgDiv.onclick = () => {
                    currentImageIndex = index;
                    updateModalImage();
                };
                galleryGrid.appendChild(imgDiv);
            });

            // Show modal
            modal.classList.remove('hidden');
            modal.classList.add('flex', 'animate-fade-in');
            document.body.style.overflow = 'hidden';

            // Navigation event listeners (one-time setup if needed, or simple reassignment)
            prevBtn.onclick = (e) => { e.stopPropagation(); prevImage(); };
            nextBtn.onclick = (e) => { e.stopPropagation(); nextImage(); };
        }

        function updateModalImage() {
            const mainImg = document.getElementById('modal-main-img');
            const counter = document.getElementById('modal-counter');
            const galleryGrid = document.getElementById('modal-gallery-grid');

            mainImg.style.opacity = '0';
            setTimeout(() => {
                mainImg.src = currentActivityImages[currentImageIndex];
                mainImg.style.opacity = '1';
                counter.textContent = `${currentImageIndex + 1} / ${currentActivityImages.length}`;

                // Update active thumbnail
                Array.from(galleryGrid.children).forEach((child, idx) => {
                    if (idx === currentImageIndex) {
                        child.classList.add('border-primary');
                        child.classList.remove('border-transparent');
                    } else {
                        child.classList.remove('border-primary');
                        child.classList.add('border-transparent');
                    }
                });
            }, 150);
        }

        function prevImage() {
            currentImageIndex = (currentImageIndex - 1 + currentActivityImages.length) % currentActivityImages.length;
            updateModalImage();
        }

        function nextImage() {
            currentImageIndex = (currentImageIndex + 1) % currentActivityImages.length;
            updateModalImage();
        }

        function closeActivityModal() {
            const modal = document.getElementById('activity-modal');
            modal.classList.add('hidden');
            modal.classList.remove('flex', 'animate-fade-in');
            document.body.style.overflow = ''; // Restore scrolling
        }

        // Close modal on outside click
        document.getElementById('activity-modal').addEventListener('click', (e) => {
            if (e.target.id === 'activity-modal') {
                closeActivityModal();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !document.getElementById('activity-modal').classList.contains('hidden')) {
                closeActivityModal();
            }
        });
    