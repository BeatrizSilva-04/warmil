// Navigation functionality
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger")
  const navMenu = document.querySelector(".nav-menu")
  const navLinks = document.querySelectorAll(".nav-link")

  // Toggle mobile menu
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active")
    hamburger.classList.toggle("active")
  })

  // Close mobile menu when clicking on a link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active")
      hamburger.classList.remove("active")
    })
  })

  // Update active nav link on scroll
  window.addEventListener("scroll", () => {
    let current = ""
    const sections = document.querySelectorAll("section")

    sections.forEach((section) => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.clientHeight
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

  // Load initial games
  loadJogos()
})

// Smooth scrolling function
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId)
  if (section) {
    section.scrollIntoView({ behavior: "smooth" })
  }
}

// Games management
let jogos = JSON.parse(localStorage.getItem("jogos")) || [
  {
    id: 1,
    equipa: "Seniores",
    adversario: "FC Exemplo",
    data: "2024-01-15",
    hora: "15:00",
    local: "Campo Municipal de Antime",
    tipo: "Casa",
  },
  {
    id: 2,
    equipa: "Juniores",
    adversario: "Sporting Jovem",
    data: "2024-01-17",
    hora: "14:30",
    local: "Campo do Adversário",
    tipo: "Fora",
  },
  {
    id: 3,
    equipa: "Futsal",
    adversario: "Futsal Unidos",
    data: "2024-01-19",
    hora: "20:00",
    local: "Pavilhão de Antime",
    tipo: "Casa",
  },
]

function loadJogos() {
  const jogosGrid = document.getElementById("jogosGrid")

  if (jogos.length === 0) {
    jogosGrid.innerHTML = `
            <div class="loading">
                <p>Nenhum jogo agendado para esta semana</p>
            </div>
        `
    return
  }

  // Sort games by date
  jogos.sort((a, b) => new Date(a.data + " " + a.hora) - new Date(b.data + " " + b.hora))

  jogosGrid.innerHTML = jogos
    .map(
      (jogo) => `
        <div class="jogo-card">
            <div class="jogo-header">
                <div class="jogo-equipa">${jogo.equipa}</div>
                <div class="jogo-tipo ${jogo.tipo.toLowerCase()}">${jogo.tipo}</div>
            </div>
            <div class="jogo-adversario">vs ${jogo.adversario}</div>
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
            <button class="btn btn-secondary" style="margin-top: 1rem; font-size: 0.9rem;" onclick="removeJogo(${jogo.id})">
                <i class="fas fa-trash"></i> Remover
            </button>
        </div>
    `,
    )
    .join("")
}

function formatDate(dateString) {
  const date = new Date(dateString)
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }
  return date.toLocaleDateString("pt-PT", options)
}

function openAddGameModal() {
  document.getElementById("addGameModal").style.display = "block"
}

function closeAddGameModal() {
  document.getElementById("addGameModal").style.display = "none"
  document.getElementById("addGameForm").reset()
}

// Close modal when clicking outside
window.addEventListener("click", (event) => {
  const modal = document.getElementById("addGameModal")
  if (event.target === modal) {
    closeAddGameModal()
  }
})

// Add game form submission
document.getElementById("addGameForm").addEventListener("submit", (e) => {
  e.preventDefault()

  const formData = new FormData(e.target)
  const novoJogo = {
    id: Date.now(),
    equipa: document.getElementById("equipa").value,
    adversario: document.getElementById("adversario").value,
    data: document.getElementById("data").value,
    hora: document.getElementById("hora").value,
    local: document.getElementById("local").value,
    tipo: document.getElementById("tipo").value,
  }

  jogos.push(novoJogo)
  localStorage.setItem("jogos", JSON.stringify(jogos))
  loadJogos()
  closeAddGameModal()

  // Show success message
  showNotification("Jogo adicionado com sucesso!", "success")
})

function removeJogo(id) {
  if (confirm("Tem certeza que deseja remover este jogo?")) {
    jogos = jogos.filter((jogo) => jogo.id !== id)
    localStorage.setItem("jogos", JSON.stringify(jogos))
    loadJogos()
    showNotification("Jogo removido com sucesso!", "success")
  }
}

function showNotification(message, type) {
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `

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

// Add CSS for notifications
const style = document.createElement("style")
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`
document.head.appendChild(style)

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.animation = "fadeInUp 0.6s ease forwards"
    }
  })
}, observerOptions)

// Observe elements for animation
document.addEventListener("DOMContentLoaded", () => {
  const animateElements = document.querySelectorAll(".equipa-card, .contacto-card, .timeline-item")
  animateElements.forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px)"
    observer.observe(el)
  })
})
