// Firebase integration script to replace localStorage with Firestore

// Import Firebase
import { firebase } from 'firebase/app';
import 'firebase/firestore';

// Global variables
let isAdminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
let editingGameId = null;
let resultGameId = null;
let jogos = [];

const ADMIN_PASSWORD = "armil2024";

// Initialize Firebase connection
const db = firebase.firestore();

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando aplicação com Firebase...');
    initializeApp();
    loadJogosFromFirestore(); // Load from Firestore instead of localStorage
});

function initializeApp() {
    updateAdminStatus();
    initializeNavigation();
    initializeAnimations();
    console.log('✅ Aplicação inicializada');
}

// Firebase Firestore functions
async function loadJogosFromFirestore() {
    const jogosGrid = document.getElementById("jogosGrid");
    jogosGrid.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
            <p>Carregando jogos...</p>
        </div>
    `;

    try {
        const snapshot = await db.collection("jogos").orderBy("data", "asc").get();
        jogos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        console.log('📁 Jogos carregados do Firestore:', jogos.length);
        renderJogos();
        
        // Set up real-time listener for live updates
        setupRealtimeListener();
    } catch (error) {
        console.error("Erro ao carregar jogos:", error);
        jogosGrid.innerHTML = `
            <div class="loading">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem; display: block; color: var(--danger-color);"></i>
                <p>Erro ao carregar jogos</p>
                <small style="opacity: 0.7; margin-top: 1rem; display: block;">
                    Verifique a sua ligação à internet
                </small>
            </div>
        `;
    }
}

function setupRealtimeListener() {
    // Listen for real-time updates
    db.collection("jogos").orderBy("data", "asc").onSnapshot((snapshot) => {
        jogos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderJogos();
        console.log('🔄 Jogos atualizados em tempo real');
    }, (error) => {
        console.error("Erro no listener em tempo real:", error);
    });
}

async function addJogoToFirestore(jogoData) {
    try {
        const docRef = await db.collection("jogos").add({
            ...jogoData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log("Jogo adicionado com ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Erro ao adicionar jogo:", error);
        throw error;
    }
}

async function updateJogoInFirestore(id, jogoData) {
    try {
        await db.collection("jogos").doc(id).update({
            ...jogoData,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log("Jogo atualizado:", id);
    } catch (error) {
        console.error("Erro ao atualizar jogo:", error);
        throw error;
    }
}

async function deleteJogoFromFirestore(id) {
    try {
        await db.collection("jogos").doc(id).delete();
        console.log("Jogo removido:", id);
    } catch (error) {
        console.error("Erro ao remover jogo:", error);
        throw error;
    }
}

function renderJogos() {
    const jogosGrid = document.getElementById("jogosGrid");

    if (jogos.length === 0) {
        jogosGrid.innerHTML = `
            <div class="loading">
                <i class="fas fa-calendar-times" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                <p>Nenhum jogo agendado</p>
                <small style="opacity: 0.7; margin-top: 1rem; display: block;">
                    ${isAdminLoggedIn ? 'Clique em "Adicionar Jogo" para começar!' : 'Aguarde novos jogos serem adicionados.'}
                </small>
            </div>
        `;
        return;
    }

    // Sort games by date
    jogos.sort((a, b) => new Date(a.data + " " + a.hora) - new Date(b.data + " " + b.hora));

    jogosGrid.innerHTML = jogos
        .map((jogo) => {
            const resultadoStatus = getResultadoStatus(jogo);
            const cardClass = jogo.finalizado ? 'jogo-card finalizado' : 'jogo-card';
            
            let resultadoHtml = '';
            if (jogo.finalizado) {
                const resultadoClass = `jogo-resultado ${resultadoStatus}`;
                resultadoHtml = `
                  <div class="${resultadoClass}">
                    <div class="resultado-placar">
                      <span class="resultado-casa">${jogo.golosCasa}</span>
                      <span class="resultado-separador">-</span>
                      <span class="resultado-fora">${jogo.golosFora}</span>
                    </div>
                  </div>
                `;
            }

            const statusBadge = jogo.finalizado 
                ? '<span class="jogo-status finalizado">Finalizado</span>'
                : '<span class="jogo-status agendado">Agendado</span>';

            return `
                <div class="${cardClass}">
                    <div class="jogo-header">
                        <div class="jogo-equipa">${jogo.equipa}</div>
                        <div style="display: flex; align-items: center;">
                            <div class="jogo-tipo ${jogo.tipo.toLowerCase()}">${jogo.tipo}</div>
                            ${statusBadge}
                        </div>
                    </div>
                    <div class="jogo-adversario">vs ${jogo.adversario}</div>
                    ${resultadoHtml}
                    <div class="jogo-info">
                        <div class="jogo-data">
                            <i class="fas fa-calendar"></i>
                            ${formatDate(jogo.data)} às ${jogo.hora}
                        </div>
                        <div class="jogo-local">
                            <i class="fas fa-map-marker-alt"></i>
                            ${jogo.local}
                        </div>
                    </div>
                    <div class="jogo-actions admin-only">
                        <button class="btn btn-edit" onclick="editJogo('${jogo.id}')" title="Editar jogo">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        ${!jogo.finalizado ? `
                            <button class="btn btn-success" onclick="openResultModal('${jogo.id}')" title="Adicionar resultado">
                                <i class="fas fa-trophy"></i> Resultado
                            </button>
                        ` : `
                            <button class="btn btn-edit" onclick="openResultModal('${jogo.id}')" title="Editar resultado">
                                <i class="fas fa-edit"></i> Editar Resultado
                            </button>
                        `}
                        <button class="btn btn-danger" onclick="removeJogo('${jogo.id}')" title="Remover jogo">
                            <i class="fas fa-trash"></i> Remover
                        </button>
                    </div>
                </div>
            `;
        })
        .join("");
}

function getResultadoStatus(jogo) {
    if (!jogo.finalizado) return null;
    
    const golosCasa = jogo.tipo === 'Casa' ? jogo.golosCasa : jogo.golosFora;
    const golosFora = jogo.tipo === 'Casa' ? jogo.golosFora : jogo.golosCasa;
    
    if (golosCasa > golosFora) return 'vitoria';
    if (golosCasa < golosFora) return 'derrota';
    return 'empate';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    return date.toLocaleDateString("pt-PT", options);
}

// Admin functions
function updateAdminStatus() {
    const adminStatus = document.getElementById('adminStatus');
    const adminBtn = document.getElementById('adminBtn');
    const body = document.body;

    if (isAdminLoggedIn) {
        adminStatus.innerHTML = '<i class="fas fa-shield-alt"></i><span>Administrador</span>';
        adminStatus.className = 'admin-status logged-in';
        adminBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Sair';
        adminBtn.className = 'btn-admin btn-logout';
        body.classList.add('admin-logged-in');
    } else {
        adminStatus.innerHTML = '<i class="fas fa-user"></i><span>Visitante</span>';
        adminStatus.className = 'admin-status logged-out';
        adminBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Admin';
        adminBtn.className = 'btn-admin btn-login';
        body.classList.remove('admin-logged-in');
    }
}

function toggleAdmin() {
    if (isAdminLoggedIn) {
        logout();
    } else {
        openLoginModal();
    }
}

function openLoginModal() {
    document.getElementById("loginModal").style.display = "block";
    document.body.style.overflow = "hidden";
    setTimeout(() => {
        document.getElementById("adminPassword").focus();
    }, 100);
}

function closeLoginModal() {
    document.getElementById("loginModal").style.display = "none";
    document.getElementById("loginForm").reset();
    document.body.style.overflow = "auto";
}

function login(password) {
    if (password === ADMIN_PASSWORD) {
        isAdminLoggedIn = true;
        localStorage.setItem('adminLoggedIn', 'true');
        updateAdminStatus();
        closeLoginModal();
        showNotification("🔥 Login realizado com sucesso! Bem-vindo, Administrador.", "success");
        return true;
    } else {
        showNotification("❌ Palavra-passe incorreta!", "error");
        return false;
    }
}

function logout() {
    isAdminLoggedIn = false;
    localStorage.setItem('adminLoggedIn', 'false');
    updateAdminStatus();
    showNotification("👋 Logout realizado com sucesso!", "success");
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('adminPassword');
    const passwordIcon = document.getElementById('passwordIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwordIcon.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        passwordIcon.className = 'fas fa-eye';
    }
}

// Login form submission
document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const password = document.getElementById("adminPassword").value;
    login(password);
});

// Smooth scrolling function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: "smooth" });
    }
}

// Progress bar functionality
function updateProgressBar() {
    const fields = ['equipa', 'adversario', 'data', 'hora', 'local', 'tipo'];
    const steps = ['step1', 'step2', 'step3', 'step4'];
    let filledFields = 0;
    
    // Count filled fields
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && field.value.trim() !== '') {
            filledFields++;
        }
    });
    
    // Calculate progress percentage
    const progressPercentage = Math.round((filledFields / fields.length) * 100);
    const progressBar = document.getElementById('progressBar');
    const progressPercentageEl = document.getElementById('progressPercentage');
    
    if (progressBar) {
        progressBar.style.width = progressPercentage + '%';
    }
    if (progressPercentageEl) {
        progressPercentageEl.textContent = progressPercentage + '%';
    }
    
    // Update step indicators
    steps.forEach((stepId, index) => {
        const step = document.getElementById(stepId);
        if (step) {
            step.classList.remove('active', 'completed');
            
            const fieldsPerStep = Math.ceil(fields.length / steps.length);
            const stepProgress = Math.floor(filledFields / fieldsPerStep);
            
            if (index < stepProgress) {
                step.classList.add('completed');
            } else if (index === stepProgress) {
                step.classList.add('active');
            }
        }
    });
}

// Add event listeners to form fields for progress tracking
function initializeProgressTracking() {
    const fields = ['equipa', 'adversario', 'data', 'hora', 'local', 'tipo'];
    
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', updateProgressBar);
            field.addEventListener('change', updateProgressBar);
        }
    });
}

// Modal functions
function openAddGameModal() {
    if (!isAdminLoggedIn) {
        showNotification("🔒 Acesso negado! Faça login como administrador.", "error");
        return;
    }
    document.getElementById("addGameModal").style.display = "block";
    document.body.style.overflow = "hidden";
    
    // Initialize progress tracking
    setTimeout(() => {
        initializeProgressTracking();
        updateProgressBar();
    }, 100);
}

function closeAddGameModal() {
    document.getElementById("addGameModal").style.display = "none";
    document.getElementById("addGameForm").reset();
    document.body.style.overflow = "auto";
    editingGameId = null;
    
    // Reset modal title
    document.getElementById("gameModalTitle").textContent = "Adicionar Novo Jogo";
}

function openResultModal(gameId) {
    if (!isAdminLoggedIn) {
        showNotification("🔒 Acesso negado! Faça login como administrador.", "error");
        return;
    }

    const jogo = jogos.find(j => j.id === gameId);
    if (!jogo) return;

    resultGameId = gameId;
    
    // Preencher informações do jogo
    const gameInfo = document.getElementById("resultGameInfo");
    gameInfo.innerHTML = `
        <strong>${jogo.equipa}</strong> vs <strong>${jogo.adversario}</strong><br>
        <small><i class="fas fa-calendar"></i> ${formatDate(jogo.data)} às ${jogo.hora}</small><br>
        <small><i class="fas fa-map-marker-alt"></i> ${jogo.local}</small>
    `;

    // Preencher resultado se já existir
    if (jogo.finalizado) {
        document.getElementById("golosCasa").value = jogo.golosCasa || 0;
        document.getElementById("golosFora").value = jogo.golosFora || 0;
    } else {
        document.getElementById("golosCasa").value = "";
        document.getElementById("golosFora").value = "";
    }

    document.getElementById("resultModal").style.display = "block";
    document.body.style.overflow = "hidden";
}

function closeResultModal() {
    document.getElementById("resultModal").style.display = "none";
    document.getElementById("resultForm").reset();
    document.body.style.overflow = "auto";
    resultGameId = null;
}

// Close modal when clicking outside
window.addEventListener("click", (event) => {
    const addGameModal = document.getElementById("addGameModal");
    const loginModal = document.getElementById("loginModal");
    const resultModal = document.getElementById("resultModal");
    
    if (event.target === addGameModal) {
        closeAddGameModal();
    }
    if (event.target === loginModal) {
        closeLoginModal();
    }
    if (event.target === resultModal) {
        closeResultModal();
    }
});

// Add game form submission
document.getElementById("addGameForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!isAdminLoggedIn) {
        showNotification("🔒 Acesso negado! Faça login como administrador.", "error");
        return;
    }

    const jogoData = {
        equipa: document.getElementById("equipa").value,
        adversario: document.getElementById("adversario").value,
        data: document.getElementById("data").value,
        hora: document.getElementById("hora").value,
        local: document.getElementById("local").value,
        tipo: document.getElementById("tipo").value,
        finalizado: false
    };

    try {
        if (editingGameId) {
            // Editar jogo existente
            await updateJogoInFirestore(editingGameId, jogoData);
            showNotification("✅ Jogo editado com sucesso!", "success");
        } else {
            // Adicionar novo jogo
            await addJogoToFirestore(jogoData);
            showNotification("🎉 Jogo adicionado com sucesso! Todos podem ver agora.", "success");
        }
        closeAddGameModal();
    } catch (error) {
        console.error("Erro ao salvar jogo:", error);
        showNotification("❌ Erro ao salvar jogo. Tente novamente.", "error");
    }
});

// Result form submission
document.getElementById("resultForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!isAdminLoggedIn) {
        showNotification("🔒 Acesso negado! Faça login como administrador.", "error");
        return;
    }

    if (!resultGameId) return;

    const golosCasa = parseInt(document.getElementById("golosCasa").value);
    const golosFora = parseInt(document.getElementById("golosFora").value);

    try {
        await updateJogoInFirestore(resultGameId, {
            golosCasa: golosCasa,
            golosFora: golosFora,
            finalizado: true
        });

        closeResultModal();

        const jogo = jogos.find(j => j.id === resultGameId);
        if (jogo) {
            const resultado = getResultadoStatus({...jogo, golosCasa, golosFora});
            let mensagem = "📊 Resultado adicionado com sucesso!";
            if (resultado === 'vitoria') mensagem += " 🎉 Vitória!";
            else if (resultado === 'empate') mensagem += " ⚖️ Empate!";
            else mensagem += " 😔 Derrota...";

            showNotification(mensagem, "success");
        }
    } catch (error) {
        console.error("Erro ao salvar resultado:", error);
        showNotification("❌ Erro ao salvar resultado. Tente novamente.", "error");
    }
});

async function editJogo(id) {
    if (!isAdminLoggedIn) {
        showNotification("🔒 Acesso negado! Faça login como administrador.", "error");
        return;
    }

    const jogo = jogos.find(j => j.id === id);
    if (jogo) {
        editingGameId = id;
        document.getElementById("gameModalTitle").textContent = "Editar Jogo";
        
        document.getElementById("equipa").value = jogo.equipa;
        document.getElementById("adversario").value = jogo.adversario;
        document.getElementById("data").value = jogo.data;
        document.getElementById("hora").value = jogo.hora;
        document.getElementById("local").value = jogo.local;
        document.getElementById("tipo").value = jogo.tipo;
        
        openAddGameModal();
    }
}

async function removeJogo(id, showConfirm = true) {
    if (!isAdminLoggedIn) {
        showNotification("🔒 Acesso negado! Faça login como administrador.", "error");
        return;
    }

    if (!showConfirm || confirm("⚠️ Tem certeza que deseja remover este jogo?")) {
        try {
            await deleteJogoFromFirestore(id);
            showNotification("🗑️ Jogo removido com sucesso!", "success");
        } catch (error) {
            console.error("Erro ao remover jogo:", error);
            showNotification("❌ Erro ao remover jogo. Tente novamente.", "error");
        }
    }
}

function showNotification(message, type) {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle';
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = "slideOutRight 0.4s ease";
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 400);
    }, 4000);
}

function initializeNavigation() {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    // Toggle mobile menu
    hamburger.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        hamburger.classList.toggle("active");
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
            hamburger.classList.remove("active");
        });
    });

    // Update active nav link on scroll
    window.addEventListener("scroll", () => {
        let current = "";
        const sections = document.querySelectorAll("section");

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === "#" + current) {
                link.classList.add("active");
            }
        });
    });
}

function initializeAnimations() {
    // Animate timeline items on scroll
    const timelineItems = document.querySelectorAll('.timeline-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });

    timelineItems.forEach(item => {
        observer.observe(item);
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAddGameModal();
        closeLoginModal();
        closeResultModal();
    }
});

// Auto-logout after 1 hour of inactivity
let inactivityTimer;
function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    if (isAdminLoggedIn) {
        inactivityTimer = setTimeout(() => {
            logout();
            showNotification("⏰ Sessão expirada por inatividade.", "error");
        }, 3600000); // 1 hour
    }
}

// Reset timer on user activity
document.addEventListener('click', resetInactivityTimer);
document.addEventListener('keypress', resetInactivityTimer);
document.addEventListener('scroll', resetInactivityTimer);

// Make functions globally available
window.scrollToSection = scrollToSection;
window.toggleAdmin = toggleAdmin;
window.openAddGameModal = openAddGameModal;
window.closeAddGameModal = closeAddGameModal;
window.openResultModal = openResultModal;
window.closeResultModal = closeResultModal;
window.closeLoginModal = closeLoginModal;
window.togglePasswordVisibility = togglePasswordVisibility;
window.editJogo = editJogo;
window.removeJogo = removeJogo;
