// Sample data
const upcomingGames = [
  {
    date: "22 Agosto 2025",
    time: "15:00",
    homeTeam: "GCD Armil",
    awayTeam: "Vasco da Gama",
    competition: "Campeonato Distrital",
    venue: "Campo do Armil",
  },
  {
    date: "22 Dezembro 2024",
    time: "14:30",
    homeTeam: "SC Braga B",
    awayTeam: "GCD Armil",
    competition: "Taça Distrital",
    venue: " Municipal de Braga",
  },
  {
    date: "5 Janeiro 2025",
    time: "15:30",
    homeTeam: "GCD Armil",
    awayTeam: "AD Fafe",
    competition: "Campeonato Distrital",
    venue: "Campo Municipal de Armil",
  },
]

const resultsGames = [
  {
    date: "8 Dezembro 2024",
    homeTeam: "GCD Armil",
    awayTeam: "FC Famalicão B",
    homeScore: 2,
    awayScore: 1,
    competition: "Campeonato Distrital",
    venue: "Campo Municipal de Armil",
  },
  {
    date: "1 Dezembro 2024",
    homeTeam: "Moreirense FC B",
    awayTeam: "GCD Armil",
    homeScore: 0,
    awayScore: 3,
    competition: "Campeonato Distrital",
    venue: "Parque Desportivo Comendador Joaquim de Almeida Freitas",
  },
  {
    date: "24 Novembro 2024",
    homeTeam: "GCD Armil",
    awayTeam: "Vitória SC B",
    homeScore: 1,
    awayScore: 1,
    competition: "Taça Distrital",
    venue: "Campo Municipal de Armil",
  },
]

const teamsData = {
  senior: {
    name: "Equipa Sénior Futsal",
    category: "Sénior Masculino",
    description: "A nossa equipa de futsal que compete no campeonato regional de Fafe.",
    coach: "Miguel Dinis",
    assistantCoach: "Hugo",
    players: [
      { number: 1, name: "Tiago Cruz", position: "Guarda-Redes" },
      { number: 2, name: "Carlos Oliveira", position: "Defesa Direito" },
      { number: 3, name: "André Costa", position: "Defesa Central" },
      { number: 4, name: "Bruno Sousa", position: "Defesa Central" },
      { number: 5, name: "Rui Pereira", position: "Defesa Esquerdo" },
      { number: 6, name: "Tiago Rodrigues", position: "Médio Defensivo" },
      { number: 7, name: "João Martins", position: "Médio Ofensivo" },
      { number: 8, name: "Paulo Gomes", position: "Médio Centro" },
      { number: 9, name: "Ricardo Silva", position: "Avançado" },
      { number: 10, name: "Nuno Alves", position: "Extremo Direito" },
      { number: 11, name: "Diogo Santos", position: "Extremo Esquerdo" },
    ],
  },
  junior: {
    name: "Equipa Júnior",
    category: "Sub-19",
    description: "Os nossos jovens talentos em formação, preparando-se para o futebol sénior.",
    coach: "António Ribeiro",
    assistantCoach: "Luís Fernandes",
    players: [
      { number: 1, name: "Gonçalo Mendes", position: "Guarda-Redes" },
      { number: 2, name: "Fábio Lima", position: "Defesa Direito" },
      { number: 3, name: "Hugo Carvalho", position: "Defesa Central" },
      { number: 4, name: "Rafael Moreira", position: "Defesa Central" },
      { number: 5, name: "Tomás Barbosa", position: "Defesa Esquerdo" },
      { number: 6, name: "Daniel Pinto", position: "Médio Defensivo" },
      { number: 7, name: "Bernardo Lopes", position: "Médio Ofensivo" },
      { number: 8, name: "Francisco Dias", position: "Médio Centro" },
      { number: 9, name: "Gabriel Rocha", position: "Avançado" },
      { number: 10, name: "Rodrigo Cunha", position: "Extremo Direito" },
      { number: 11, name: "Simão Teixeira", position: "Extremo Esquerdo" },
    ],
  },
  youth: {
    name: "Equipa Juvenil",
    category: "Sub-15",
    description: "A base do nosso futuro desportivo, onde desenvolvemos os talentos de amanhã.",
    coach: "Manuel Costa",
    assistantCoach: "José Araújo",
    players: [
      { number: 1, name: "Afonso Neves", position: "Guarda-Redes" },
      { number: 2, name: "Martim Soares", position: "Defesa Direito" },
      { number: 3, name: "Vicente Correia", position: "Defesa Central" },
      { number: 4, name: "Lourenço Faria", position: "Defesa Central" },
      { number: 5, name: "Salvador Reis", position: "Defesa Esquerdo" },
      { number: 6, name: "Henrique Matos", position: "Médio Defensivo" },
      { number: 7, name: "Duarte Azevedo", position: "Médio Ofensivo" },
      { number: 8, name: "Guilherme Vieira", position: "Médio Centro" },
      { number: 9, name: "Mateus Castro", position: "Avançado" },
      { number: 10, name: "Santiago Monteiro", position: "Extremo Direito" },
      { number: 11, name: "Benjamim Cardoso", position: "Extremo Esquerdo" },
    ],
  },
}

// DOM Elements
const hamburger = document.querySelector(".hamburger")
const navMenu = document.querySelector(".nav-menu")
const navLinks = document.querySelectorAll(".nav-link")
const modal = document.getElementById("teamModal")
const contactForm = document.getElementById("contactForm")

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadGames("upcoming")
  setupEventListeners()
})

// Event Listeners
function setupEventListeners() {
  // Mobile menu toggle
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active")
    navMenu.classList.toggle("active")
  })

  // Close mobile menu when clicking on a link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active")
      navMenu.classList.remove("active")
    })
  })

  // Smooth scrolling for navigation
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const targetId = link.getAttribute("href").substring(1)
      scrollToSection(targetId)
      updateActiveNavLink(link)
    })
  })

  // Contact form submission
  contactForm.addEventListener("submit", handleContactForm)

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal()
    }
  })

  // Update active nav link on scroll
  window.addEventListener("scroll", updateNavOnScroll)
}

// Navigation functions
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId)
  if (section) {
    const offsetTop = section.offsetTop - 80
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    })
  }
}

function updateActiveNavLink(activeLink) {
  navLinks.forEach((link) => link.classList.remove("active"))
  activeLink.classList.add("active")
}

function updateNavOnScroll() {
  const sections = document.querySelectorAll("section")
  const scrollPos = window.scrollY + 100

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.offsetHeight
    const sectionId = section.getAttribute("id")

    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      navLinks.forEach((link) => {
        link.classList.remove("active")
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active")
        }
      })
    }
  })
}

// Games functions
function showGames(type) {
  const upcomingDiv = document.getElementById("upcoming-games")
  const resultsDiv = document.getElementById("results-games")
  const tabBtns = document.querySelectorAll(".tab-btn")

  // Update tab buttons
  tabBtns.forEach((btn) => btn.classList.remove("active"))
  event.target.classList.add("active")

  // Show/hide content
  if (type === "upcoming") {
    upcomingDiv.style.display = "grid"
    resultsDiv.style.display = "none"
    loadGames("upcoming")
  } else {
    upcomingDiv.style.display = "none"
    resultsDiv.style.display = "grid"
    loadGames("results")
  }
}

function loadGames(type) {
  const container =
    type === "upcoming" ? document.getElementById("upcoming-games") : document.getElementById("results-games")

  const games = type === "upcoming" ? upcomingGames : resultsGames

  container.innerHTML = games.map((game) => createGameCard(game, type)).join("")
}

function createGameCard(game, type) {
  if (type === "upcoming") {
    return `
            <div class="game-card">
                <div class="game-header">
                    <div class="game-date">${game.date} • ${game.time}</div>
                    <div class="game-competition">${game.competition}</div>
                </div>
                <div class="game-teams">
                    <div class="team">
                        <div class="team-logo">
                            <i class="fas fa-futbol"></i>
                        </div>
                        <div class="team-name">${game.homeTeam}</div>
                    </div>
                    <div class="vs">VS</div>
                    <div class="team">
                        <div class="team-logo">
                            <i class="fas fa-shield-alt"></i>
                        </div>
                        <div class="team-name">${game.awayTeam}</div>
                    </div>
                </div>
                <div class="game-info">
                    <i class="fas fa-map-marker-alt"></i> ${game.venue}
                </div>
            </div>
        `
  } else {
    return `
            <div class="game-card">
                <div class="game-header">
                    <div class="game-date">${game.date}</div>
                    <div class="game-competition">${game.competition}</div>
                </div>
                <div class="game-teams">
                    <div class="team">
                        <div class="team-logo">
                            <i class="fas fa-futbol"></i>
                        </div>
                        <div class="team-name">${game.homeTeam}</div>
                    </div>
                    <div class="vs">VS</div>
                    <div class="team">
                        <div class="team-logo">
                            <i class="fas fa-shield-alt"></i>
                        </div>
                        <div class="team-name">${game.awayTeam}</div>
                    </div>
                </div>
                <div class="game-score">${game.homeScore} - ${game.awayScore}</div>
                <div class="game-info">
                    <i class="fas fa-map-marker-alt"></i> ${game.venue}
                </div>
            </div>
        `
  }
}

// Team functions
function showTeamDetails(teamId) {
  const team = teamsData[teamId]
  if (!team) return

  const teamDetailsHTML = `
        <div class="team-details">
            <h2>${team.name}</h2>
            <p><strong>Categoria:</strong> ${team.category}</p>
            <p>${team.description}</p>
            
            <div style="margin: 2rem 0;">
                <h3>Equipa Técnica</h3>
                <p><strong>Treinador:</strong> ${team.coach}</p>
                <p><strong>Treinador Adjunto:</strong> ${team.assistantCoach}</p>
            </div>
            
            <h3>Plantel</h3>
            <div class="players-grid">
                ${team.players
                  .map(
                    (player) => `
                    <div class="player-card">
                        <div class="player-number">${player.number}</div>
                        <div class="player-name">${player.name}</div>
                        <div class="player-position">${player.position}</div>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        </div>
    `

  document.getElementById("teamDetails").innerHTML = teamDetailsHTML
  modal.style.display = "block"
  document.body.style.overflow = "hidden"
}

function closeModal() {
  modal.style.display = "none"
  document.body.style.overflow = "auto"
}

// Contact form
function handleContactForm(e) {
  e.preventDefault()

  const formData = new FormData(contactForm)
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  }

  // Simulate form submission
  alert("Mensagem enviada com sucesso! Entraremos em contacto brevemente.")
  contactForm.reset()
}

// Utility functions
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Add smooth scrolling behavior for better UX
document.documentElement.style.scrollBehavior = "smooth"
