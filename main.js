// Loading screen
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

// Header scroll effect
window.addEventListener("scroll", () => {
  const header = document.querySelector("header")
  if (window.scrollY > 100) {
    header?.classList.add("backdrop-blur-sm")
  } else {
    header?.classList.remove("backdrop-blur-sm")
  }
})

