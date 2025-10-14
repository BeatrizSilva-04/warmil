// Check authentication
function checkAuth() {
  const isAuthenticated = localStorage.getItem("adminAuthenticated")
  const loginTime = localStorage.getItem("adminLoginTime")

  // Session expires after 24 hours
  const sessionDuration = 24 * 60 * 60 * 1000
  const currentTime = Date.now()

  if (!isAuthenticated || !loginTime || currentTime - Number.parseInt(loginTime) > sessionDuration) {
    window.location.href = "admin-login.html"
    return false
  }

  return true
}

// Initialize
if (!checkAuth()) {
  // Will redirect to login
} else {
  initializeAdmin()
}

function initializeAdmin() {
  // Logout button
  document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("adminAuthenticated")
    localStorage.removeItem("adminLoginTime")
    window.location.href = "admin-login.html"
  })

  // Tab switching
  const tabButtons = document.querySelectorAll(".tab-button")
  const tabContents = document.querySelectorAll(".tab-content")

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tabName = button.getAttribute("data-tab")

      tabButtons.forEach((btn) => btn.classList.remove("active"))
      button.classList.add("active")

      tabContents.forEach((content) => content.classList.add("hidden"))
      document.getElementById(`${tabName}-tab`).classList.remove("hidden")
    })
  })

  // Initialize data
  loadGames()
  loadResults()
  updateResultGameSelect()

  // Form submissions
  document.getElementById("add-game-form").addEventListener("submit", handleAddGame)
  document.getElementById("add-result-form").addEventListener("submit", handleAddResult)
}

// Games Management
function handleAddGame(e) {
  e.preventDefault()

  const game = {
    id: Date.now(),
    datetime: document.getElementById("game-datetime").value,
    team: document.getElementById("game-team").value,
    opponent: document.getElementById("game-opponent").value,
    opponentLogo: document.getElementById("game-opponent-logo").value || "img/sporting.png",
    location: document.getElementById("game-location").value,
    homeAway: document.getElementById("game-home-away").value,
  }

  const games = getGames()
  games.push(game)
  localStorage.setItem("gcdArmilGames", JSON.stringify(games))

  e.target.reset()
  loadGames()
  updateResultGameSelect()

  alert("Jogo adicionado com sucesso!")
}

function getGames() {
  return JSON.parse(localStorage.getItem("gcdArmilGames") || "[]")
}

function loadGames() {
  const games = getGames()
  const gamesList = document.getElementById("games-list")

  if (games.length === 0) {
    gamesList.innerHTML = '<p class="text-muted-foreground text-center py-8">Nenhum jogo agendado</p>'
    return
  }

  gamesList.innerHTML = games
    .map((game) => {
      const date = new Date(game.datetime)
      const formattedDate = date.toLocaleDateString("pt-PT", { day: "numeric", month: "long", year: "numeric" })
      const formattedTime = date.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })

      return `
            <div class="bg-muted rounded-lg p-4 border-l-4 border-primary">
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <p class="font-semibold text-foreground">${game.team}</p>
                        <p class="text-sm text-muted-foreground">${formattedDate} Ã s ${formattedTime}</p>
                    </div>
                    <button onclick="deleteGame(${game.id})" class="text-destructive hover:text-destructive/80">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
                <p class="text-sm"><strong>VS:</strong> ${game.opponent}</p>
                <p class="text-sm"><strong>Local:</strong> ${game.location}</p>
                <p class="text-sm"><strong>Tipo:</strong> ${game.homeAway === "home" ? "Casa" : "Fora"}</p>
            </div>
        `
    })
    .join("")
}

function deleteGame(id) {
  if (!confirm("Tem a certeza que deseja eliminar este jogo?")) return

  const games = getGames().filter((game) => game.id !== id)
  localStorage.setItem("gcdArmilGames", JSON.stringify(games))
  loadGames()
  updateResultGameSelect()
}

// Results Management
function handleAddResult(e) {
  e.preventDefault()

  const gameId = Number.parseInt(document.getElementById("result-game").value)
  const game = getGames().find((g) => g.id === gameId)

  if (!game) {
    alert("Jogo nÃ£o encontrado!")
    return
  }

  const result = {
    id: Date.now(),
    gameId: gameId,
    game: game,
    homeScore: Number.parseInt(document.getElementById("result-home-score").value),
    awayScore: Number.parseInt(document.getElementById("result-away-score").value),
    photo: document.getElementById("result-photo").value,
  }

  const results = getResults()
  results.push(result)
  localStorage.setItem("gcdArmilResults", JSON.stringify(results))

  // Remove game from games list
  deleteGame(gameId)

  e.target.reset()
  loadResults()
  updateResultGameSelect()

  alert("Resultado adicionado com sucesso!")
}

function getResults() {
  return JSON.parse(localStorage.getItem("gcdArmilResults") || "[]")
}

function loadResults() {
  const results = getResults()
  const resultsList = document.getElementById("results-list")

  if (results.length === 0) {
    resultsList.innerHTML = '<p class="text-muted-foreground text-center py-8">Nenhum resultado registado</p>'
    return
  }

  resultsList.innerHTML = results
    .map((result) => {
      const date = new Date(result.game.datetime)
      const formattedDate = date.toLocaleDateString("pt-PT", { day: "numeric", month: "long", year: "numeric" })

      const isWin = result.homeScore > result.awayScore
      const isDraw = result.homeScore === result.awayScore
      const resultClass = isWin ? "text-green-600" : isDraw ? "text-yellow-600" : "text-red-600"

      return `
            <div class="bg-muted rounded-lg p-4 border-l-4 border-primary">
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <p class="font-semibold text-foreground">${result.game.team}</p>
                        <p class="text-sm text-muted-foreground">${formattedDate}</p>
                    </div>
                    <button onclick="deleteResult(${result.id})" class="text-destructive hover:text-destructive/80">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
                <p class="text-lg font-bold ${resultClass}">
                    GCD Armil ${result.homeScore} - ${result.awayScore} ${result.game.opponent}
                </p>
                <p class="text-sm"><strong>Local:</strong> ${result.game.location}</p>
                ${result.photo ? `<img src="${result.photo}" alt="Foto do jogo" class="mt-2 rounded-lg w-full h-32 object-cover">` : ""}
            </div>
        `
    })
    .join("")
}

function deleteResult(id) {
  if (!confirm("Tem a certeza que deseja eliminar este resultado?")) return

  const results = getResults().filter((result) => result.id !== id)
  localStorage.setItem("gcdArmilResults", JSON.stringify(results))
  loadResults()
}

function updateResultGameSelect() {
  const games = getGames()
  const select = document.getElementById("result-game")

  select.innerHTML =
    '<option value="">Selecione um jogo</option>' +
    games
      .map((game) => {
        const date = new Date(game.datetime)
        const formattedDate = date.toLocaleDateString("pt-PT", { day: "numeric", month: "short" })
        return `<option value="${game.id}">${game.team} vs ${game.opponent} - ${formattedDate}</option>`
      })
      .join("")
}

// Make functions global
window.deleteGame = deleteGame
window.deleteResult = deleteResult