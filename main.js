// General UI and Navigation Logic


window.addEventListener("load", () => {
  const criticalImages = document.querySelectorAll('img[src*="simboloarmil"]')
  let imagesLoaded = 0
  const totalImages = criticalImages.length

  function checkImagesLoaded() {
    imagesLoaded++
    if (imagesLoaded >= totalImages || totalImages === 0) {
      hideLoadingScreen()
    }
  }

  function hideLoadingScreen() {
    setTimeout(() => {
      const loadingScreen = document.getElementById("loading-screen")
      if (loadingScreen) {
        loadingScreen.classList.add("fade-out")
        setTimeout(() => {
          loadingScreen.style.display = "none"
        }, 500)
      }
    }, 800)
  }

  if (totalImages === 0) {
    hideLoadingScreen()
  } else {
    criticalImages.forEach((img) => {
      if (img.complete) {
        checkImagesLoaded()
      } else {
        img.addEventListener("load", checkImagesLoaded)
        img.addEventListener("error", function () {
          this.style.display = "none"
          checkImagesLoaded()
        })
      }
    })

    setTimeout(hideLoadingScreen, 3000)
  }
})

// Mobile menu
const mobileMenuButton = document.getElementById("mobile-menu-button")
const mobileMenu = document.getElementById("mobile-menu")
const closeMobileMenu = document.getElementById("close-mobile-menu")

if (mobileMenuButton) {
  mobileMenuButton.addEventListener("click", () => {
    mobileMenu.classList.add("open")
  })
}

if (closeMobileMenu) {
  closeMobileMenu.addEventListener("click", () => {
    mobileMenu.classList.remove("open")
  })
}

// Close mobile menu when clicking on a link
const mobileMenuLinks = mobileMenu?.querySelectorAll("a")
mobileMenuLinks?.forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("open")
  })
})

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Header, Scroll Progress and Back to Top scroll effect
window.addEventListener("scroll", () => {
  const header = document.querySelector("header")
  const scrollProgress = document.getElementById("scroll-progress")
  const backToTop = document.getElementById("back-to-top")

  // Header blur
  if (window.scrollY > 100) {
    header?.classList.add("backdrop-blur-sm")
  } else {
    header?.classList.remove("backdrop-blur-sm")
  }

  // Scroll Progress
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
  const scrolled = (window.scrollY / scrollHeight) * 100
  if (scrollProgress) {
    scrollProgress.style.width = scrolled + "%"
  }

  // Back to Top Visibility
  if (backToTop) {
    if (window.scrollY > 500) {
      backToTop.classList.remove("opacity-0", "translate-y-10", "pointer-events-none")
      backToTop.classList.add("opacity-100", "translate-y-0")
    } else {
      backToTop.classList.add("opacity-0", "translate-y-10", "pointer-events-none")
      backToTop.classList.remove("opacity-100", "translate-y-0")
    }
  }
})

// Team players data
const teamPlayers = {
  traquinas: [
    { name: "João Silva", position: "Avançado", number: 9, photo: "img/players/joao-silva.jpg" },
    { name: "Pedro Santos", position: "Médio", number: 10, photo: "img/players/pedro-santos.jpg" },
    { name: "Miguel Costa", position: "Defesa", number: 4, photo: "img/players/miguel-costa.jpg" },
    { name: "Tiago Oliveira", position: "Guarda-Redes", number: 1, photo: "img/players/tiago-oliveira.jpg" },
    { name: "André Ferreira", position: "Extremo", number: 7, photo: "img/players/andre-ferreira.jpg" },
    { name: "Bruno Almeida", position: "Defesa", number: 3, photo: "img/players/bruno-almeida.jpg" },
  ],
  benjamins: [],
  infantis: [
    { name: "Francisco Dias", position: "Avançado", number: 10, photo: "img/players/francisco-dias.jpg" },
    { name: "Gonçalo Ribeiro", position: "Médio", number: 8, photo: "img/players/goncalo-ribeiro.jpg" },
    { name: "Tomás Carvalho", position: "Defesa", number: 4, photo: "img/players/tomas-carvalho.jpg" },
    { name: "Afonso Pinto", position: "Guarda-Redes", number: 1, photo: "img/players/afonso-pinto.jpg" },
    { name: "Bernardo Lima", position: "Extremo", number: 11, photo: "img/players/bernardo-lima.jpg" },
    { name: "Rodrigo Neves", position: "Defesa", number: 3, photo: "img/players/rodrigo-neves.jpg" },
  ],
  juvenis: [
    { name: "Tiago Pereira", position: "Guarda-Redes", number: 9, photo: "img/tiagogr.jpg" },
    { name: "Lucas Silva", position: "Médio", number: 10, photo: "img/lucas.jpg" },
    { name: "Tomás Sousa", position: "Defesa", number: 3, photo: "img/tomas.jpg" },
    { name: "Afonso Cardoso", position: "Guarda-Redes", number: 1, photo: "img/afonso.jpg" },
    { name: "David Pinto", position: "Extremo", number: 11, photo: "img/pinto.jpg" },
    { name: "Rui", position: "Médio", number: 6, photo: "img/rui.jpg" },
    { name: "Henrique Alves", position: "Médio", number: 6, photo: "img/henrique.jpg" },
    { name: "Tomás Vieira", position: "Médio", number: 6, photo: "img/tomasv.jpg" },
    { name: "Alexandre Peixoto", position: "Médio", number: 6, photo: "img/alex.jpg" },
    { name: "Afonso Pião", position: "Médio", number: 6, photo: "img/piao.jpg" },
    { name: "Gonçalo", position: "Médio", number: 6, photo: "img/goncalo.jpg" },
    { name: "Ricardo Cunha", position: "Médio", number: 6, photo: "img/ricardo.jpg" },
    { name: "David Ferreira", position: "Médio", number: 6, photo: "img/ferreira.jpg" },
    { name: "Bruno", position: "Médio", number: 6, photo: "img/bruno.jpg" },
    { name: "João Sampaio", position: "Médio", number: 6, photo: "img/sampaio.jpg" },
    {
      name: "Equipa Técnica",
      role: "Equipa Técnica",
      nameList: ["Paulo Gonçalves", "Paulo Cardoso", "Joel Pião", "Duarte Ferreira"],
      photo: "img/eq.tecnicaa.png",
    },
  ],
  "seniores-futsal": [
    { name: "Tiago Cruz", position: "Guarda-Redes", number: 9, photo: "img/cruz.jpg" },
    { name: "Sebastian Tedesco", position: "Ala", number: 7, photo: "img/tedesco.jpg" },
    { name: "Cláudio Carneiro", position: "Fixo", number: 4, photo: "img/claudio.jpg" },
    { name: "Jorge Lameiras", position: "Ala", number: 1, photo: "img/ginho.jpg" },
    { name: "Francisco Liz", position: "Ala", number: 11, photo: "img/liz.jpg" },
    { name: "Samuel Castro", position: "Ala", number: 9, photo: "img/samu.jpg" },
    { name: "Diogo José", position: "Ala", number: 9, photo: "img/ribeiro.jpg" },
    { name: "João Lemmos", position: "Ala", number: 9, photo: "img/ribeiro.jpg" },
    { name: "João Ribeiro", position: "Ala", number: 9, photo: "img/ribeiro.jpg" },
    { name: "Pedro", position: "Ala", number: 8, photo: "img/players/pedro-machado.jpg" },
  ],
  "seniores-futebol": [
    { name: "Francisco Ferreira", position: "Guarda Redes", number: 99, photo: "img/jdiogo.jpg" },
    { name: "Bruno Salgado", position: "Guarda Redes", number: 21, photo: "img/rato.jpg" },
    { name: "Moisés Quintino", position: "Extremo", number: 66, photo: "img/moises.jpg" },
    { name: "Pedro Lemos", position: "Médio", number: 18, photo: "img/pedro_lemos.jpg" },
    { name: "Nivaldo Cá", position: "Médio", number: 11, photo: "img/nivaldo.jpg" },
    { name: "Luís Sousa", position: "Médio", number: 8, photo: "img/luis_sousa.jpg" },
    { name: "Suleimane Baio", position: "Médio", number: 4, photo: "img/suleimane.jpg" },
    { name: "Tiago Rodrigues", position: "Defesa", number: 13, photo: "img/tiago.jpg" },
    { name: "José Castro", position: "Guarda-Redes", number: 22, photo: "img/zé.jpg" },
    { name: "Eugénio Insumbo", position: "Extremo", number: 3, photo: "img/eugénio.jpg" },
    { name: "Rubén Durães", position: "Extremo", number: 7, photo: "img/ruben.jpg" },
    { name: "Alexandre Gonçalves", position: "Extremo", number: 7, photo: "img/fininho.jpg" },
    { name: "Micael Pinto", position: "Extremo", number: 27, photo: "img/mica.jpg" },
    { name: "Ricardo Sampaio", position: "Extremo", number: 7, photo: "img/cajuz.jpg" },
    { name: "Aprizio Cá", position: "Extremo", number: 7, photo: "img/aprizio.jpg" },
    { name: "Alex", position: "Médio", number: 9, photo: "img/players/ricardo-pires.jpg" },
    { name: "Jorge Teixeira", role: "Treinador", photo: "img/jorge.jpg" },
    { name: "Mariana Teixeira", role: "Fisioterapeuta", photo: "img/mariana.jpg" },
  ],
  veteranos: [
    { name: "Manuel Soares", position: "Avançado", number: 9, photo: "img/players/manuel-soares.jpg" },
    { name: "António Vieira", position: "Médio", number: 8, photo: "img/players/antonio-vieira.jpg" },
    { name: "José Reis", position: "Defesa", number: 5, photo: "img/players/jose-reis.jpg" },
    { name: "Carlos Matos", position: "Guarda-Redes", number: 1, photo: "img/players/carlos-matos.jpg" },
    { name: "Fernando Costa", position: "Extremo", number: 11, photo: "img/players/fernando-costa.jpg" },
    { name: "Joaquim Leal", position: "Defesa", number: 3, photo: "img/players/joaquim-leal.jpg" },
  ],
}

function toggleTeamPlayers(teamId) {
  const playersSection = document.getElementById("team-players")
  const teamTitle = document.getElementById("team-title")
  const playersGrid = document.getElementById("players-grid")

  const teamNames = {
    traquinas: "Traquinas",
    benjamins: "Benjamins",
    infantis: "Infantis",
    juvenis: "Juvenis",
    "seniores-futsal": "Séniores Futsal",
    "seniores-futebol": "Séniores Futebol",
    veteranos: "Veteranos",
  }

  teamTitle.textContent = `Equipa - ${teamNames[teamId]}`
  playersGrid.innerHTML = ""

  const players = teamPlayers[teamId] || []
  players.forEach((player) => {
    const playerCard = document.createElement("div")
    playerCard.className = "bg-muted rounded-lg p-4 text-center"

    if (player.role && player.nameList) {
      const namesHtml = player.nameList.map((n) => `<div>${n}</div>`).join("")
      playerCard.innerHTML = `
                <div class="w-20 h-20 mx-auto mb-3">
                    <img src="${player.photo}" alt="Equipa Técnica" class="w-full h-full rounded-full object-cover border-2 border-primary">
                </div>
                <h4 class="font-bold text-lg text-foreground">${player.role}</h4>
                <div class="text-muted-foreground mt-1">${namesHtml}</div>
            `
    } else if (player.role) {
      playerCard.innerHTML = `
                <div class="w-20 h-20 mx-auto mb-3">
                    <img src="${player.photo}" alt="${player.name}" class="w-full h-full rounded-full object-cover border-2 border-primary">
                </div>
                <h4 class="font-bold text-lg text-foreground">${player.name}</h4>
                <p class="text-muted-foreground">${player.role}</p>
            `
    } else {
      playerCard.innerHTML = `
                <div class="w-20 h-20 mx-auto mb-3 relative">
                    <img src="${player.photo}" alt="${player.name}" class="w-full h-full rounded-full object-cover border-2 border-primary" 
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div class="w-full h-full bg-primary rounded-full flex items-center justify-center 
                                text-primary-foreground font-bold text-xl absolute top-0 left-0" style="display: none;">
                        ${player.number}
                    </div>
                </div>
                <h4 class="font-bold text-lg text-foreground">${player.name}</h4>
                <p class="text-muted-foreground">Nº ${player.number}</p>
            `
    }

    playersGrid.appendChild(playerCard)
  })

  playersSection.classList.remove("hidden")
  playersSection.scrollIntoView({ behavior: "smooth" })
}

function hideTeamPlayers() {
  document.getElementById("team-players")?.classList.add("hidden")
}

// Search Functionality
function toggleSearch() {
  const overlay = document.getElementById('search-overlay');
  const input = document.getElementById('search-input');

  if (overlay.classList.contains('hidden')) {
    overlay.classList.remove('hidden');
    // small delay to allow display:flex to apply before opacity transition
    setTimeout(() => {
      overlay.classList.remove('opacity-0');
      overlay.classList.add('flex');
      input.focus();
    }, 10);
    document.body.style.overflow = 'hidden';
  } else {
    overlay.classList.add('opacity-0');
    setTimeout(() => {
      overlay.classList.add('hidden');
      overlay.classList.remove('flex');
    }, 300);
    document.body.style.overflow = '';
  }
}

function handleSearch(e) {
  const query = e.target.value.toLowerCase();
  const resultsContainer = document.getElementById('search-results');
  resultsContainer.innerHTML = '';

  if (query.length < 2) {
    // Show Quick Links / suggestions
    resultsContainer.innerHTML = `
        <div class="text-center py-8">
            <h5 class="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Sugestões de Pesquisa</h5>
            <div class="flex flex-wrap justify-center gap-3">
                <button onclick="document.getElementById('search-input').value='Séniores'; handleSearch({target: {value:'Séniores'}})" class="px-4 py-2 bg-gray-100 rounded-full hover:bg-primary/10 hover:text-primary transition-colors text-sm font-semibold">Séniores</button>
                <button onclick="document.getElementById('search-input').value='Traquinas'; handleSearch({target: {value:'Traquinas'}})" class="px-4 py-2 bg-gray-100 rounded-full hover:bg-primary/10 hover:text-primary transition-colors text-sm font-semibold">Traquinas</button>
                <button onclick="document.getElementById('search-input').value='Atividades'; handleSearch({target: {value:'Atividades'}})" class="px-4 py-2 bg-gray-100 rounded-full hover:bg-primary/10 hover:text-primary transition-colors text-sm font-semibold">Atividades</button>
                <button onclick="document.getElementById('search-input').value='Próximos Jogos'; handleSearch({target: {value:'Jogos'}})" class="px-4 py-2 bg-gray-100 rounded-full hover:bg-primary/10 hover:text-primary transition-colors text-sm font-semibold">Próximos Jogos</button>
            </div>
        </div>
      `;
    return;
  }

  const results = [];

  // Search in players
  const teamNames = {
    traquinas: "Traquinas",
    benjamins: "Benjamins",
    infantis: "Infantis",
    juvenis: "Juvenis",
    "seniores-futsal": "Séniores Futsal",
    "seniores-futebol": "Séniores Futebol",
    veteranos: "Veteranos",
  }

  Object.keys(teamPlayers).forEach(teamKey => {
    const players = teamPlayers[teamKey];
    if (players) {
      players.forEach(player => {
        const pName = player.name || (player.nameList ? player.nameList.join(', ') : 'Desconhecido');
        if (pName.toLowerCase().includes(query)) {
          results.push({
            type: 'player',
            title: pName,
            subtitle: `${player.position || player.role || ''} - ${teamNames[teamKey]}`,
            image: player.photo,
            action: `toggleTeamPlayers('${teamKey}'); toggleSearch();`
          });
        }
      });
    }
  });

  // Search in sections
  const sections = [
    { id: 'home', title: 'Início' },
    { id: 'teams', title: 'Equipas' },
    { id: 'activities', title: 'Atividades' },
    { id: 'about', title: 'Sobre Nós' },
    { id: 'matches', title: 'Jogos e Resultados' }
  ];

  sections.forEach(sec => {
    if (sec.title.toLowerCase().includes(query)) {
      results.push({
        type: 'section',
        title: sec.title,
        subtitle: 'Secção',
        image: null,
        action: `window.location.href='#${sec.id}'; toggleSearch();`
      });
    }
  });

  // Render results
  if (results.length === 0) {
    resultsContainer.innerHTML = '<p class="text-center text-muted-foreground font-open-sans">Sem resultados encontrados.</p>';
    return;
  }

  results.forEach(res => {
    const el = document.createElement('div');
    el.className = 'flex items-center p-4 bg-gray-50 rounded-xl hover:bg-white hover:shadow-md cursor-pointer transition-all border border-gray-100 group';
    el.onclick = () => { eval(res.action); };

    let imgHtml = '';
    if (res.image) {
      imgHtml = `<img src="${res.image}" class="w-12 h-12 rounded-full object-cover mr-4 shadow-sm border border-gray-200">`;
    } else {
      imgHtml = `<div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4 text-primary font-bold shadow-sm">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                      </div>`;
    }

    el.innerHTML = `
        ${imgHtml}
        <div>
            <h4 class="font-bold text-lg text-foreground group-hover:text-primary transition-colors">${res.title}</h4>
            <p class="text-sm text-muted-foreground">${res.subtitle}</p>
        </div>
      `;
    resultsContainer.appendChild(el);
  });
}

// Close search on ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const overlay = document.getElementById('search-overlay');
    if (!overlay.classList.contains('hidden')) {
      toggleSearch();
    }
  }
});

// Spotlight Effect
document.addEventListener('mousemove', e => {
  document.querySelectorAll('.premium-card').forEach(card => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});

// Reveal on Scroll Observer
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, { threshold: 0.1 });

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.premium-card, .section-title, .match-item').forEach(el => {
    el.classList.add('reveal-on-scroll');
    revealObserver.observe(el);
  });
});
