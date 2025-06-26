// Firebase compat já deve estar carregado no HTML
const db = firebase.firestore()

let jogos = []
let isAdminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true'

document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger")
  const navMenu = document.querySelector(".nav-menu")
  const navLinks = document.querySelectorAll(".nav-link")

  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active")
    hamburger.classList.toggle("active")
  })

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active")
      hamburger.classList.remove("active")
    })
  })

  window.addEventListener("scroll", () => {
    let current = ""
    const sections = document.querySelectorAll("section")

    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      if (scrollY >= sectionTop - 200) {
        current = section.getAttribute("id")
      }
    })

    navLinks.forEach((link) => {
      link.classList.remove("active")
      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("active")
      }
    })
  })

  updateAdminStatus()
  loadJogos()
})

// Smooth scroll
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId)
  if (section) {
    section.scrollIntoView({ behavior: "smooth" })
  }
}

// =====================
// Firebase + Jogos
// =====================

async function loadJogos() {
  const jogosGrid = document.getElementById("jogosGrid")
  jogosGrid.innerHTML = `<p>A carregar jogos...</p>`

  const snapshot = await db.collection("jogos").get()
  jogos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

  if (jogos.length === 0) {
    jogosGrid.innerHTML = `<div class="loading"><p>Nenhum jogo agendado para esta semana</p></div>`
    return
  }

  jogos.sort((a, b) => new Date(a.data + " " + a.hora) - new Date(b.data + " " + b.hora))

  jogosGrid.innerHTML = jogos.map(jogo => `
    <div class="jogo-card">
      <div class="jogo-header">
        <div class="jogo-equipa">${jogo.equipa}</div>
        <div class="jogo-tipo ${jogo.tipo.toLowerCase()}">${jogo.tipo}</div>
      </div>
      <div class="jogo-adversario">vs ${jogo.adversario}</div>
      <div class="jogo-info">
        <div class="jogo-data"><i class="fas fa-calendar"></i> ${formatDate(jogo.data)} às ${jogo.hora}</div>
        <div class="jogo-local"><i class="fas fa-map-marker-alt"></i> ${jogo.local}</div>
      </div>
      ${isAdminLoggedIn ? `<button class="btn btn-secondary" onclick="removeJogo('${jogo.id}')"><i class="fas fa-trash"></i> Remover</button>` : ""}
    </div>`).join("")
}

function formatDate(dateString) {
  const date = new Date(dateString)
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
  return date.toLocaleDateString("pt-PT", options)
}

function openAddGameModal() {
  if (!isAdminLoggedIn) return
  document.getElementById("addGameModal").style.display = "block"
}

function closeAddGameModal() {
  document.getElementById("addGameModal").style.display = "none"
  document.getElementById("addGameForm").reset()
}

window.addEventListener("click", (event) => {
  const modal = document.getElementById("addGameModal")
  if (event.target === modal) {
    closeAddGameModal()
  }
})

document.getElementById("addGameForm").addEventListener("submit", async (e) => {
  e.preventDefault()

  const novoJogo = {
    equipa: document.getElementById("equipa").value,
    adversario: document.getElementById("adversario").value,
    data: document.getElementById("data").value,
    hora: document.getElementById("hora").value,
    local: document.getElementById("local").value,
    tipo: document.getElementById("tipo").value,
  }

  try {
    await db.collection("jogos").add(novoJogo)
    showNotification("Jogo adicionado com sucesso!", "success")
    closeAddGameModal()
    loadJogos()
  } catch (error) {
    showNotification("Erro ao adicionar jogo.", "error")
  }
})

async function removeJogo(id) {
  if (!isAdminLoggedIn) return
  if (!confirm("Tem certeza que deseja remover este jogo?")) return

  try {
    await db.collection("jogos").doc(id).delete()
    showNotification("Jogo removido com sucesso!", "success")
    loadJogos()
  } catch (error) {
    showNotification("Erro ao remover jogo.", "error")
  }
}

// =====================
// Admin Login
// =====================

const ADMIN_PASSWORD = "armil2024"

function updateAdminStatus() {
  const adminStatus = document.getElementById("adminStatus")
  const adminBtn = document.getElementById("adminBtn")
  const body = document.body

  if (isAdminLoggedIn) {
    adminStatus.innerHTML = '<i class="fas fa-shield-alt"></i><span>Administrador</span>'
    adminStatus.className = 'admin-status logged-in'
    adminBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Sair'
    adminBtn.className = 'btn-admin btn-logout'
    body.classList.add('admin-logged-in')
  } else {
    adminStatus.innerHTML = '<i class="fas fa-user"></i><span>Visitante</span>'
    adminStatus.className = 'admin-status logged-out'
    adminBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Admin'
    adminBtn.className = 'btn-admin btn-login'
    body.classList.remove('admin-logged-in')
  }
}

function toggleAdmin() {
  if (isAdminLoggedIn) {
    isAdminLoggedIn = false
    localStorage.setItem('adminLoggedIn', 'false')
    updateAdminStatus()
    loadJogos()
  } else {
    openLoginModal()
  }
}

function openLoginModal() {
  document.getElementById("loginModal").style.display = "block"
  document.body.style.overflow = "hidden"
}

function closeLoginModal() {
  document.getElementById("loginModal").style.display = "none"
  document.getElementById("loginForm").reset()
  document.body.style.overflow = "auto"
}

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault()
  const pass = document.getElementById("adminPassword").value
  if (pass === ADMIN_PASSWORD) {
    isAdminLoggedIn = true
    localStorage.setItem('adminLoggedIn', 'true')
    updateAdminStatus()
    closeLoginModal()
    showNotification("Bem-vindo, Administrador!", "success")
    loadJogos()
  } else {
    showNotification("Palavra-passe incorreta!", "error")
  }
})

// Mostrar/esconder palavra-passe
function togglePasswordVisibility() {
  const input = document.getElementById("adminPassword")
  const icon = document.getElementById("passwordIcon")
  if (input.type === "password") {
    input.type = "text"
    icon.classList.remove("fa-eye")
    icon.classList.add("fa-eye-slash")
  } else {
    input.type = "password"
    icon.classList.remove("fa-eye-slash")
    icon.classList.add("fa-eye")
  }
}

// =====================
// Notificações
// =====================

function showNotification(message, type) {
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.innerHTML = `<i class="fas fa-${type === "success" ? "check-circle" : "exclamation-triangle"}"></i><span>${message}</span>`

  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: var(--accent-color);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: var(--shadow-lg);
    z-index: 3000;
    display: flex;
    align-items: center;
    gap: 10px;
    animation: slideInRight 0.3s ease;
  `

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease"
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 3000)
}

const style = document.createElement("style")
style.textContent = `
  @keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  @keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`
document.head.appendChild(style)
