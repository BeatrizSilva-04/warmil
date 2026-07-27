import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add "Fazer-me Sócio" button
about_para = '''                                    <p>
                                        Mais do que troféus, o nosso maior orgulho é a nossa comunidade. Somos uma
                                        família que
                                        preserva tradições enquanto olha para o futuro com ambição.
                                    </p>
                                </div>'''

socio_btn = '''                                    <p>
                                        Mais do que troféus, o nosso maior orgulho é a nossa comunidade. Somos uma
                                        família que
                                        preserva tradições enquanto olha para o futuro com ambição.
                                    </p>
                                </div>
                                <div class="mt-8">
                                    <button onclick="openSocioModal()" class="btn-primary-premium w-full sm:w-auto text-lg px-8 group">
                                        Fazer-me Sócio
                                        <svg class="w-5 h-5 inline-block ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                                        </svg>
                                    </button>
                                </div>'''

if 'Fazer-me Sócio' not in text:
    text = text.replace(about_para, socio_btn)

# 2. Add Socio Modal HTML
socio_modal = '''
            <!-- Socio Registration Modal -->
            <div id="socio-modal" class="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] hidden items-center justify-center p-4 transition-all duration-300 opacity-0">
                <div class="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-zoom-in">
                    <div class="bg-black text-white p-6 relative">
                        <button onclick="closeSocioModal()" class="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                        <h3 class="font-montserrat font-black text-2xl uppercase tracking-tighter">Tornar-me Sócio</h3>
                        <p class="text-gray-400 text-sm mt-1">Junta-te à família GCD Armil</p>
                    </div>
                    <div class="p-6">
                        <form id="socio-form" onsubmit="handleSocioSubmit(event)" class="space-y-4">
                            <div class="form-group">
                                <label class="form-label text-sm text-gray-600">Nome Completo</label>
                                <input type="text" id="socio-nome" class="form-input" required>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div class="form-group">
                                    <label class="form-label text-sm text-gray-600">Data Nasc.</label>
                                    <input type="date" id="socio-data" class="form-input" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label text-sm text-gray-600">Telemóvel</label>
                                    <input type="tel" id="socio-telefone" class="form-input" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label text-sm text-gray-600">Morada</label>
                                <input type="text" id="socio-morada" class="form-input" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label text-sm text-gray-600">Email</label>
                                <input type="email" id="socio-email" class="form-input" required>
                            </div>
                            <div id="socio-message" class="text-sm font-bold hidden rounded p-3 text-center"></div>
                            <button type="submit" id="socio-submit-btn" class="w-full bg-black text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all mt-4 flex justify-center items-center">
                                <span>Enviar Inscrição</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
'''
if 'id="socio-modal"' not in text:
    text = text.replace('<!-- Back to Top Button -->', socio_modal + '\n            <!-- Back to Top Button -->')

# 3. Add script for Socio logic
socio_js = '''
                // Socio Registration Logic
                function openSocioModal() {
                    const modal = document.getElementById('socio-modal');
                    modal.classList.remove('hidden');
                    modal.classList.add('flex');
                    // Small delay to allow display:flex to apply before changing opacity for transition
                    setTimeout(() => {
                        modal.classList.remove('opacity-0');
                    }, 10);
                    document.body.style.overflow = 'hidden';
                }

                function closeSocioModal() {
                    const modal = document.getElementById('socio-modal');
                    modal.classList.add('opacity-0');
                    setTimeout(() => {
                        modal.classList.add('hidden');
                        modal.classList.remove('flex');
                        document.body.style.overflow = '';
                        document.getElementById('socio-form').reset();
                        document.getElementById('socio-message').classList.add('hidden');
                    }, 300); // Wait for transition
                }

                async function handleSocioSubmit(e) {
                    e.preventDefault();
                    
                    const btn = document.getElementById('socio-submit-btn');
                    const msgDiv = document.getElementById('socio-message');
                    const form = document.getElementById('socio-form');
                    
                    const data = {
                        nome: document.getElementById('socio-nome').value,
                        dataNascimento: document.getElementById('socio-data').value,
                        telefone: document.getElementById('socio-telefone').value,
                        morada: document.getElementById('socio-morada').value,
                        email: document.getElementById('socio-email').value,
                        dataRegisto: new Date().toISOString()
                    };

                    btn.disabled = true;
                    btn.innerHTML = '<svg class="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> A processar...';

                    try {
                        // 1. Save to Firebase
                        await db.collection('socios').add(data);
                        
                        // 2. Send Emails using EmailJS
                        // Substitui 'YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID_CLUB', 'YOUR_TEMPLATE_ID_USER' depois
                        
                        const templateParams = {
                            nome: data.nome,
                            data_nascimento: data.dataNascimento,
                            telefone: data.telefone,
                            morada: data.morada,
                            email: data.email
                        };

                        // Envia para o Clube
                        await emailjs.send('default_service', 'template_clube', templateParams);
                        
                        // Envia para o Novo Sócio (Validação)
                        await emailjs.send('default_service', 'template_socio', templateParams);

                        msgDiv.textContent = 'Inscrição enviada com sucesso! Verifica o teu email.';
                        msgDiv.className = 'text-sm font-bold rounded p-3 text-center bg-green-100 text-green-800';
                        msgDiv.classList.remove('hidden');
                        
                        setTimeout(() => {
                            closeSocioModal();
                        }, 3000);

                    } catch (error) {
                        console.error('Erro ao registar sócio:', error);
                        msgDiv.textContent = 'Erro ao enviar a inscrição. Tenta novamente.';
                        msgDiv.className = 'text-sm font-bold rounded p-3 text-center bg-red-100 text-red-800';
                        msgDiv.classList.remove('hidden');
                        
                        btn.disabled = false;
                        btn.innerHTML = '<span>Enviar Inscrição</span>';
                    }
                }
'''
if 'function openSocioModal()' not in text:
    text = text.replace('function closeTeamModal() {', socio_js + '\n                function closeTeamModal() {')

# 4. Add EmailJS to HEAD
email_js_tag = '''
    <!-- EmailJS SDK -->
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
    <script type="text/javascript">
        (function() {
            // Inicializa o EmailJS. Substitui pela tua Public Key mais tarde
            emailjs.init("SUA_PUBLIC_KEY_AQUI");
        })();
    </script>
'''
if 'EmailJS SDK' not in text:
    text = text.replace('</head>', email_js_tag + '</head>')

# 5. Add "Sócios" Tab in Admin Panel
admin_tab_btn = '''<button onclick="showAdminTab('players')" id="tab-players"
                                class="admin-tab-btn px-6 py-2 rounded-full font-bold transition-all">Jogadores</button>
                            <button onclick="showAdminTab('socios')" id="tab-socios"
                                class="admin-tab-btn px-6 py-2 rounded-full font-bold transition-all">Sócios</button>'''

text = text.replace('''<button onclick="showAdminTab('players')" id="tab-players"
                                class="admin-tab-btn px-6 py-2 rounded-full font-bold transition-all">Jogadores</button>''', admin_tab_btn)

# 6. Add "Sócios" Panel HTML
admin_tab_content = '''
                        <!-- Socios Tab -->
                        <div id="admin-tab-socios" class="admin-tab hidden">
                            <div class="admin-card bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                <div class="flex justify-between items-center mb-6">
                                    <h2 class="font-montserrat font-bold text-2xl">Sócios Registados</h2>
                                    <span class="bg-primary text-white text-xs px-3 py-1 rounded-full font-bold uppercase tracking-widest">Base de Dados</span>
                                </div>
                                <div id="socios-list" class="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                                    <p class="text-center text-gray-500 py-8">A carregar sócios...</p>
                                </div>
                            </div>
                        </div>
'''
if 'id="admin-tab-socios"' not in text:
    text = text.replace('</main>', admin_tab_content + '\n                    </main>')

# 7. Load Socios Logic in Admin
load_socios_func = '''
                function loadAdminSocios() {
                    db.collection('socios').orderBy('dataRegisto', 'desc').onSnapshot(snap => {
                        const list = document.getElementById('socios-list');
                        if (!list) return;
                        const socios = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                        
                        if(socios.length === 0) {
                            list.innerHTML = '<p class="text-center text-gray-500 py-8">Ainda não há sócios registados.</p>';
                            return;
                        }

                        list.innerHTML = socios.map(s => {
                            const date = new Date(s.dataRegisto).toLocaleDateString('pt-PT');
                            return `
                                <div class="p-4 border border-gray-100 rounded-xl bg-gray-50 flex flex-col md:flex-row justify-between gap-4">
                                    <div>
                                        <p class="font-bold text-lg text-foreground">${s.nome}</p>
                                        <div class="grid grid-cols-2 gap-x-8 gap-y-1 mt-2 text-sm text-gray-600">
                                            <p><span class="font-semibold text-gray-400">Telemóvel:</span> ${s.telefone}</p>
                                            <p><span class="font-semibold text-gray-400">Email:</span> ${s.email}</p>
                                            <p><span class="font-semibold text-gray-400">Data Nasc.:</span> ${new Date(s.dataNascimento).toLocaleDateString('pt-PT')}</p>
                                            <p><span class="font-semibold text-gray-400">Morada:</span> ${s.morada}</p>
                                        </div>
                                    </div>
                                    <div class="flex flex-col items-end justify-between">
                                        <span class="text-xs text-gray-400">${date}</span>
                                        <button onclick="deleteSocio('${s.id}')" class="text-red-500 hover:text-red-700 text-sm font-semibold transition-colors">Remover</button>
                                    </div>
                                </div>
                            `;
                        }).join('');
                    });
                }
                
                async function deleteSocio(id) {
                    if (confirm('Tem a certeza que deseja eliminar este registo de sócio?')) {
                        await db.collection('socios').doc(id).delete();
                    }
                }
'''
if 'function loadAdminSocios()' not in text:
    text = text.replace('function loadAdminActivities() {', load_socios_func + '\n                function loadAdminActivities() {')

text = text.replace('loadAdminActivities();', 'loadAdminActivities();\n                        loadAdminSocios();')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('Socio UI, Firebase logic, Admin Panel and EmailJS skeleton added to index.html')
