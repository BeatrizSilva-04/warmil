// Check authentication
function checkAuth() {
  auth.onAuthStateChanged(user => {
    if (!user) {
      window.location.href = "admin-login.html";
    } else {
      initializeAdmin();
    }
  });
}

// Initialize
checkAuth();

function initializeAdmin() {
  // Logout button
  document.getElementById("logout-btn").addEventListener("click", async () => {
    try {
      await auth.signOut();
      window.location.href = "admin-login.html";
    } catch (error) {
      console.error("Logout error:", error);
    }
  });

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

  // Initialize data listeners (Real-time)
  loadGames()
  loadResults()
  loadActivities()

  // Form submissions
  document.getElementById("add-game-form").addEventListener("submit", handleAddGame)
  document.getElementById("add-result-form").addEventListener("submit", handleAddResult)
  document.getElementById("add-activity-form").addEventListener("submit", handleAddActivity)
}

// Games Management
async function handleAddGame(e) {
  e.preventDefault()

  const game = {
    date: document.getElementById("game-datetime").value,
    team: document.getElementById("game-team").value,
    opponent: document.getElementById("game-opponent").value,
    opponentLogo: document.getElementById("game-opponent-logo").value || "img/sporting.png",
    location: document.getElementById("game-location").value,
    homeAway: document.getElementById("game-home-away").value,
    homeTeam: document.getElementById("game-home-away").value === "home" ? "GCD Armil" : document.getElementById("game-opponent").value,
    awayTeam: document.getElementById("game-home-away").value === "home" ? document.getElementById("game-opponent").value : "GCD Armil",
    homeLogo: document.getElementById("game-home-away").value === "home" ? "img/simboloarmil.png" : (document.getElementById("game-opponent-logo").value || "img/sporting.png"),
    awayLogo: document.getElementById("game-home-away").value === "home" ? (document.getElementById("game-opponent-logo").value || "img/sporting.png") : "img/simboloarmil.png",
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }

  try {
    await db.collection('games').add(game)
    e.target.reset()
    alert("Jogo adicionado com sucesso!")
  } catch (error) {
    console.error("Error adding game:", error)
    alert("Erro ao adicionar jogo: " + error.message)
  }
}

function loadGames() {
  db.collection('games').orderBy('date', 'asc').onSnapshot(snapshot => {
    const games = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    const gamesList = document.getElementById("games-list")
    if (!gamesList) return

    if (games.length === 0) {
      gamesList.innerHTML = '<p class="text-muted-foreground text-center py-8">Nenhum jogo agendado</p>'
      updateResultGameSelect([])
      return
    }

    gamesList.innerHTML = games
      .map((game) => {
        const date = new Date(game.date)
        const formattedDate = date.toLocaleDateString("pt-PT", { day: "numeric", month: "long", year: "numeric" })
        const formattedTime = date.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })

        return `
              <div class="bg-muted rounded-lg p-4 border-l-4 border-primary">
                  <div class="flex justify-between items-start mb-2">
                      <div>
                          <p class="font-semibold text-foreground">${game.team}</p>
                          <p class="text-sm text-muted-foreground">${formattedDate} às ${formattedTime}</p>
                      </div>
                      <button onclick="deleteGame('${game.id}')" class="text-destructive hover:text-destructive/80">
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

    updateResultGameSelect(games)
  })
}

async function deleteGame(id) {
  if (!confirm("Tem a certeza que deseja eliminar este jogo?")) return
  try {
    await db.collection('games').doc(id).delete()
  } catch (error) {
    console.error("Error deleting game:", error)
  }
}

// Results Management
async function handleAddResult(e) {
  e.preventDefault()

  const gameId = document.getElementById("result-game").value
  const gameSelect = document.getElementById("result-game")
  const gameText = gameSelect.options[gameSelect.selectedIndex].text

  const result = {
    gameId: gameId,
    gameText: gameText,
    homeScore: Number.parseInt(document.getElementById("result-home-score").value),
    awayScore: Number.parseInt(document.getElementById("result-away-score").value),
    photo: document.getElementById("result-photo").value,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }

  try {
    await db.collection('results').add(result)
    // Optional: delete game after result added
    // await db.collection('games').doc(gameId).delete() 
    e.target.reset()
    alert("Resultado adicionado com sucesso!")
  } catch (error) {
    console.error("Error adding result:", error)
  }
}

function loadResults() {
  db.collection('results').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
    const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    const resultsList = document.getElementById("results-list")
    if (!resultsList) return

    if (results.length === 0) {
      resultsList.innerHTML = '<p class="text-muted-foreground text-center py-8">Nenhum resultado registado</p>'
      return
    }

    resultsList.innerHTML = results
      .map((result) => {
        const isWin = result.homeScore > result.awayScore
        const isDraw = result.homeScore === result.awayScore
        const resultClass = isWin ? "text-green-600" : isDraw ? "text-yellow-600" : "text-red-600"

        return `
              <div class="bg-muted rounded-lg p-4 border-l-4 border-primary">
                  <div class="flex justify-between items-start mb-2">
                      <div>
                          <p class="font-semibold text-foreground">${result.gameText}</p>
                      </div>
                      <button onclick="deleteResult('${result.id}')" class="text-destructive hover:text-destructive/80">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                      </button>
                  </div>
                  <p class="text-lg font-bold ${resultClass}">
                      Resultado: ${result.homeScore} - ${result.awayScore}
                  </p>
                  ${result.photo ? `<img src="${result.photo}" alt="Foto do jogo" class="mt-2 rounded-lg w-full h-32 object-cover">` : ""}
              </div>
          `
      })
      .join("")
  })
}

async function deleteResult(id) {
  if (!confirm("Tem a certeza que deseja eliminar este resultado?")) return
  try {
    await db.collection('results').doc(id).delete()
  } catch (error) {
    console.error("Error deleting result:", error)
  }
}

function updateResultGameSelect(games) {
  const select = document.getElementById("result-game")
  if (!select) return

  select.innerHTML =
    '<option value="">Selecione um jogo</option>' +
    games
      .map((game) => {
        const date = new Date(game.date)
        const formattedDate = date.toLocaleDateString("pt-PT", { day: "numeric", month: "short" })
        return `<option value="${game.id}">${game.team} vs ${game.opponent} - ${formattedDate}</option>`
      })
      .join("")
}

// Activities Management
async function handleAddActivity(e) {
  e.preventDefault()

  const photoFile = document.getElementById('activity-photo-file').files[0];
  const photoUrl = document.getElementById('activity-photo').value;
  const galleryFiles = document.getElementById('activity-gallery-files').files;

  if (!photoFile && !photoUrl) {
    alert('Por favor, adicione uma foto principal.');
    return;
  }

  const photoPromise = photoFile ? compressImage(photoFile) : Promise.resolve(photoUrl);
  const galleryPromises = Array.from(galleryFiles).map(file => compressImage(file));

  try {
    const [finalPhoto, finalGallery] = await Promise.all([photoPromise, Promise.all(galleryPromises)]);

    const activity = {
      title: document.getElementById("activity-title").value,
      description: document.getElementById("activity-desc").value,
      photo: finalPhoto,
      gallery: finalGallery,
      order: Date.now()
    }

    await db.collection('activities').add(activity)
    e.target.reset()
    document.getElementById('activity-photo-preview').classList.add('hidden');
    document.getElementById('activity-gallery-preview').innerHTML = '';
    alert("Atividade adicionada com sucesso!")
  } catch (error) {
    console.error("Error adding activity:", error)
    alert("Erro ao adicionar atividade.")
  }
}

function loadActivities() {
  db.collection('activities').orderBy('order', 'asc').onSnapshot(snapshot => {
    const activities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    const list = document.getElementById("admin-activities-list")
    if (!list) return

    if (activities.length === 0) {
      list.innerHTML = '<p class="text-muted-foreground text-center py-8">Nenhuma atividade registada</p>'
      return
    }

    list.innerHTML = activities
      .map((activity) => `
              <div class="bg-muted rounded-lg p-4 border-l-4 border-primary">
                  <div class="flex justify-between items-start mb-2">
                      <h4 class="font-bold text-foreground">${activity.title}</h4>
                      <button onclick="deleteActivity('${activity.id}')" class="text-destructive hover:text-destructive/80">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                      </button>
                  </div>
                  <p class="text-sm line-clamp-2">${activity.description}</p>
                  <img src="${activity.photo}" class="mt-2 rounded-lg w-full h-24 object-cover" onerror="this.src='https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80'">
              </div>
          `)
      .join("")
  })
}

async function deleteActivity(id) {
  if (!confirm("Tem a certeza que deseja eliminar esta atividade?")) return
  try {
    await db.collection('activities').doc(id).delete()
  } catch (error) {
    console.error("Error deleting activity:", error)
  }
}

// Make functions global
window.deleteGame = deleteGame
window.deleteResult = deleteResult
window.deleteActivity = deleteActivity
window.previewImage = previewImage
window.previewMultipleImages = previewMultipleImages

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
