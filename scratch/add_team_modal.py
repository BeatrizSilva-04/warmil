
import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add Team Modal HTML
team_modal_html = r'''
                <!-- Team Photo Modal -->
                <div id="team-modal" class="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] hidden items-center justify-center p-4 transition-all duration-300">
                    <button onclick="closeTeamModal()" class="absolute top-8 right-8 text-white/50 hover:text-white transition-all transform hover:scale-110">
                        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                    <div class="max-w-5xl w-full animate-zoom-in">
                        <img id="team-modal-img" src="" class="w-full h-auto rounded-2xl shadow-2xl border border-white/10">
                        <h3 id="team-modal-title" class="font-montserrat font-black text-3xl text-white mt-6 text-center uppercase tracking-tighter"></h3>
                    </div>
                </div>
'''

if 'id="team-modal"' not in text:
    text = text.replace('</body>', team_modal_html + '\n</body>')

# 2. Add onclick to team cards
# Traquinas
text = text.replace('img/traquinas.jpg" alt="Equipa Traquinas"', 'img/traquinas.jpg" alt="Equipa Traquinas" onclick="openTeamModal(\'img/traquinas.jpg\', \'Traquinas\')" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 cursor-pointer"')
# Infantis
text = text.replace('img/infantis.jpg" alt="Equipa Infantis"', 'img/infantis.jpg" alt="Equipa Infantis" onclick="openTeamModal(\'img/infantis.jpg\', \'Infantis\')" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 cursor-pointer"')
# Juvenis
text = text.replace('img/juvenis.jpg" alt="Equipa Juvenis"', 'img/juvenis.jpg" alt="Equipa Juvenis" onclick="openTeamModal(\'img/juvenis.jpg\', \'Juvenis\')" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 cursor-pointer"')
# Séniores Futsal
text = text.replace('img/seniores_futsal.jpg" alt="Equipa Séniores Futsal"', 'img/seniores_futsal.jpg" alt="Equipa Séniores Futsal" onclick="openTeamModal(\'img/seniores_futsal.jpg\', \'Séniores Futsal\')" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 cursor-pointer"')
# Séniores Futebol
text = text.replace('img/sen_futebol.jpg" alt="Equipa Séniores Futebol"', 'img/sen_futebol.jpg" alt="Equipa Séniores Futebol" onclick="openTeamModal(\'img/sen_futebol.jpg\', \'Séniores Futebol\')" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 cursor-pointer"')
# Veteranos
text = text.replace('img/veteranos.jpg" alt="Equipa Veteranos"', 'img/veteranos.jpg" alt="Equipa Veteranos" onclick="openTeamModal(\'img/veteranos.jpg\', \'Veteranos\')" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 cursor-pointer"')

# 3. Add script functions
script_funcs = r'''
                function openTeamModal(imgSrc, teamName) {
                    const modal = document.getElementById('team-modal');
                    const modalImg = document.getElementById('team-modal-img');
                    const modalTitle = document.getElementById('team-modal-title');
                    if (modal && modalImg && modalTitle) {
                        modalImg.src = imgSrc;
                        modalTitle.textContent = teamName;
                        modal.classList.remove('hidden');
                        modal.classList.add('flex');
                        document.body.style.overflow = 'hidden';
                    }
                }
                function closeTeamModal() {
                    const modal = document.getElementById('team-modal');
                    if (modal) {
                        modal.classList.add('hidden');
                        modal.classList.remove('flex');
                        document.body.style.overflow = '';
                    }
                }
'''

if 'function openTeamModal' not in text:
    text = text.replace('function closeActivityModal() {', script_funcs + '\n                function closeActivityModal() {')

# 4. Add zoom-in animation CSS
zoom_anim = r'''
        @keyframes zoom-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-zoom-in { animation: zoom-in 0.3s ease-out; }
'''
if '@keyframes zoom-in' not in text:
    text = text.replace('/* Enhanced Animations */', '/* Enhanced Animations */' + zoom_anim)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
print('Team photo modal and click handlers added to index.html')
