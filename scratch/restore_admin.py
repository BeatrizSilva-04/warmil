
import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Define the new Admin Panel HTML (with Players tab)
admin_panel_html = r'''
    <div id="admin-panel-view" class="view">
        <div class="min-h-screen bg-gray-50">
            <header class="bg-black text-white shadow-xl sticky top-0 z-50">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div class="flex items-center">
                        <img src="img/simboloarmil.png" class="w-10 h-10 object-contain brightness-0 invert">
                        <h1 class="ml-3 font-montserrat font-bold text-xl uppercase tracking-tighter">Painel de Administração</h1>
                    </div>
                    <button onclick="handleLogout()" class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-bold transition-all shadow-lg">Sair</button>
                </div>
            </header>

            <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <!-- Admin Tabs -->
                <div class="flex flex-wrap gap-2 mb-10 border-b border-gray-200 pb-4">
                    <button onclick="showAdminTab('games')" id="tab-games" class="admin-tab-btn active px-6 py-2 rounded-full font-bold transition-all">Jogos</button>
                    <button onclick="showAdminTab('results')" id="tab-results" class="admin-tab-btn px-6 py-2 rounded-full font-bold transition-all">Resultados</button>
                    <button onclick="showAdminTab('activities')" id="tab-activities" class="admin-tab-btn px-6 py-2 rounded-full font-bold transition-all">Atividades</button>
                    <button onclick="showAdminTab('players')" id="tab-players" class="admin-tab-btn px-6 py-2 rounded-full font-bold transition-all">Jogadores</button>
                </div>

                <!-- Games Tab -->
                <div id="admin-tab-games" class="admin-tab">
                    <div class="grid lg:grid-cols-2 gap-8">
                        <div class="admin-card bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 class="font-montserrat font-bold text-2xl mb-6">Adicionar Jogo</h2>
                            <form onsubmit="handleAddGame(event)" class="space-y-4">
                                <input type="datetime-local" id="game-date" class="form-input" required>
                                <select id="game-team" class="form-select" required>
                                    <option value="">Escalão...</option>
                                    <option value="Traquinas">Traquinas</option>
                                    <option value="Benjamins">Benjamins</option>
                                    <option value="Infantis">Infantis</option>
                                    <option value="Juvenis">Juvenis</option>
                                    <option value="Séniores Futsal">Séniores Futsal</option>
                                    <option value="Séniores Futebol">Séniores Futebol</option>
                                    <option value="Veteranos">Veteranos</option>
                                </select>
                                <input type="text" id="game-home-team" placeholder="Equipa Casa" class="form-input" required>
                                <input type="text" id="game-away-team" placeholder="Equipa Fora" class="form-input" required>
                                <input type="text" id="game-location" placeholder="Local (Campo do Armil)" class="form-input" required>
                                <button type="submit" class="w-full bg-black text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all">Adicionar Jogo</button>
                            </form>
                        </div>
                        <div class="admin-card bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 class="font-montserrat font-bold text-2xl mb-6">Jogos Agendados</h2>
                            <div id="games-list" class="space-y-4"></div>
                        </div>
                    </div>
                </div>

                <!-- Results Tab -->
                <div id="admin-tab-results" class="admin-tab hidden">
                    <div class="grid lg:grid-cols-2 gap-8">
                        <div class="admin-card bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 class="font-montserrat font-bold text-2xl mb-6">Adicionar Resultado</h2>
                            <form onsubmit="handleAddResult(event)" class="space-y-4">
                                <input type="date" id="result-date" class="form-input" required>
                                <select id="result-team-select" class="form-select" required>
                                    <option value="">Escalão...</option>
                                    <option value="Traquinas">Traquinas</option>
                                    <option value="Benjamins">Benjamins</option>
                                    <option value="Infantis">Infantis</option>
                                    <option value="Juvenis">Juvenis</option>
                                    <option value="Séniores Futsal">Séniores Futsal</option>
                                    <option value="Séniores Futebol">Séniores Futebol</option>
                                    <option value="Veteranos">Veteranos</option>
                                </select>
                                <div class="grid grid-cols-2 gap-4">
                                    <input type="text" id="result-home-team" placeholder="Equipa Casa" class="form-input" required>
                                    <input type="number" id="result-home-score" placeholder="Golos" class="form-input" required>
                                </div>
                                <div class="grid grid-cols-2 gap-4">
                                    <input type="text" id="result-away-team" placeholder="Equipa Fora" class="form-input" required>
                                    <input type="number" id="result-away-score" placeholder="Golos" class="form-input" required>
                                </div>
                                <button type="submit" class="w-full bg-black text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all">Adicionar Resultado</button>
                            </form>
                        </div>
                        <div class="admin-card bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 class="font-montserrat font-bold text-2xl mb-6">Resultados Recentes</h2>
                            <div id="results-list" class="space-y-4"></div>
                        </div>
                    </div>
                </div>

                <!-- Activities Tab -->
                <div id="admin-tab-activities" class="admin-tab hidden">
                   <div class="grid lg:grid-cols-2 gap-8">
                        <div class="admin-card bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 class="font-montserrat font-bold text-2xl mb-6">Adicionar Atividade</h2>
                            <form onsubmit="handleAddActivity(event)" class="space-y-4">
                                <input type="text" id="activity-title-admin" placeholder="Título da Atividade" class="form-input" required>
                                <textarea id="activity-desc-admin" placeholder="Descrição..." class="form-input" rows="3" required></textarea>
                                <input type="url" id="activity-photo-url-admin" placeholder="URL da Foto Principal" class="form-input" required>
                                <button type="submit" class="w-full bg-black text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all">Criar Atividade</button>
                            </form>
                        </div>
                        <div class="admin-card bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 class="font-montserrat font-bold text-2xl mb-6">Atividades Listadas</h2>
                            <div id="admin-activities-list-inner" class="space-y-4"></div>
                        </div>
                    </div>
                </div>

                <!-- Players Tab -->
                <div id="admin-tab-players" class="admin-tab hidden">
                    <div class="grid lg:grid-cols-2 gap-8">
                        <div class="admin-card bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 class="font-montserrat font-bold text-2xl mb-6">Adicionar Jogador</h2>
                            <form onsubmit="handleAddPlayer(event)" class="space-y-4">
                                <input type="text" id="player-name" placeholder="Nome do Jogador" class="form-input" required>
                                <input type="number" id="player-number" placeholder="Número da Camisola" class="form-input" required>
                                <input type="text" id="player-position" placeholder="Posição (ex: Guarda-redes)" class="form-input" required>
                                <select id="player-team" class="form-select" required>
                                    <option value="">Escalão...</option>
                                    <option value="Traquinas">Traquinas</option>
                                    <option value="Benjamins">Benjamins</option>
                                    <option value="Infantis">Infantis</option>
                                    <option value="Juvenis">Juvenis</option>
                                    <option value="Séniores Futsal">Séniores Futsal</option>
                                    <option value="Séniores Futebol">Séniores Futebol</option>
                                    <option value="Veteranos">Veteranos</option>
                                </select>
                                <input type="url" id="player-photo" placeholder="URL da Foto" class="form-input">
                                <button type="submit" class="w-full bg-black text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all">Registar Jogador</button>
                            </form>
                        </div>
                        <div class="admin-card bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 class="font-montserrat font-bold text-2xl mb-6">Lista de Jogadores</h2>
                            <div id="players-list" class="space-y-4 max-h-[500px] overflow-y-auto pr-2"></div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
'''

# 2. Add New Styles for Admin Tabs
styles = r'''
        .admin-tab-btn {
            background: #f3f4f6;
            color: #4b5563;
        }
        .admin-tab-btn.active {
            background: #000;
            color: #fff;
        }
'''

# 3. Inject Styles
if '        .admin-tab-btn {' not in text:
    text = text.replace('        .btn-danger {', styles + '\n        .btn-danger {')

# 4. Replace Admin Sections
text = re.sub(r'<div id="admin-panel-view"[\s\S]*?(?=<script>)', admin_panel_html, text)

# 5. Update Script with Player Logic
player_script = r'''
        function showAdminPanel() { 
            showView('admin-panel-view'); 
            loadAdminGames();
            loadAdminResults();
            loadAdminActivities();
            loadAdminPlayers();
        }

        function showAdminTab(tab) {
            document.querySelectorAll('.admin-tab').forEach(t => t.classList.add('hidden'));
            document.getElementById('admin-tab-' + tab).classList.remove('hidden');

            document.querySelectorAll('.admin-tab-btn').forEach(btn => btn.classList.remove('active'));
            document.getElementById('tab-' + tab).classList.add('active');
        }

        async function handleAddPlayer(e) {
            e.preventDefault();
            const player = {
                name: document.getElementById('player-name').value,
                number: document.getElementById('player-number').value,
                position: document.getElementById('player-position').value,
                team: document.getElementById('player-team').value,
                photo: document.getElementById('player-photo').value || 'img/simboloarmil.png'
            };
            await db.collection('players').add(player);
            e.target.reset();
            alert('Jogador adicionado!');
        }

        function loadAdminPlayers() {
            db.collection('players').orderBy('name').onSnapshot(snap => {
                const list = document.getElementById('players-list');
                if (!list) return;
                list.innerHTML = snap.docs.map(doc => {
                    const p = doc.data();
                    return `
                        <div class="match-item flex justify-between items-center">
                            <div class="flex items-center">
                                <img src="${p.photo}" class="w-10 h-10 rounded-full object-cover mr-3">
                                <div>
                                    <p class="font-bold">${p.name} (${p.number})</p>
                                    <p class="text-xs">${p.team} - ${p.position}</p>
                                </div>
                            </div>
                            <button onclick="deletePlayer('${doc.id}')" class="bg-red-600 text-white px-2 py-1 rounded text-xs">Remover</button>
                        </div>
                    `;
                }).join('');
            });
        }

        async function deletePlayer(id) {
            if(confirm('Remover este jogador?')) await db.collection('players').doc(id).delete();
        }

        async function handleAddGame(e) {
            e.preventDefault();
            const game = {
                date: document.getElementById('game-date').value,
                team: document.getElementById('game-team').value,
                homeTeam: document.getElementById('game-home-team').value,
                awayTeam: document.getElementById('game-away-team').value,
                location: document.getElementById('game-location').value
            };
            await db.collection('games').add(game);
            e.target.reset();
        }

        async function handleAddResult(e) {
            e.preventDefault();
            const result = {
                date: document.getElementById('result-date').value,
                team: document.getElementById('result-team-select').value,
                homeTeam: document.getElementById('result-home-team').value,
                homeScore: document.getElementById('result-home-score').value,
                awayTeam: document.getElementById('result-away-team').value,
                awayScore: document.getElementById('result-away-score').value
            };
            await db.collection('results').add(result);
            e.target.reset();
        }

        async function handleAddActivity(e) {
            e.preventDefault();
            const activity = {
                title: document.getElementById('activity-title-admin').value,
                description: document.getElementById('activity-desc-admin').value,
                photo: document.getElementById('activity-photo-url-admin').value,
                order: Date.now()
            };
            await db.collection('activities').add(activity);
            e.target.reset();
        }
'''

# Replace the functions in the script
text = re.sub(r'function showAdminPanel\(\) \{[\s\S]*?(?=async function handleLogin)', player_script, text)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
print('Full Admin Panel (with Players) restored in index.html')
