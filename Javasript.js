    /* 1. SEAMLESS TYPEWRITER EFFECT */
const profileParagraphs = [
  "I am a student at the University of Dar es Salaam, where I am pursuing a degree in Computer Science.",
  "I am passionate about programming, coordination, and creativity. I enjoy solving real-world problems through technology and working with others to bring ideas to life.",
  "I believe that technology, when built with purpose, has the power to transform communities. My goal is to contribute meaningfully to the tech space in Tanzania and beyond."
];

let currentPara = 0;
let currentChar = 0;
const typewriterContainer = document.getElementById("typewriter-text");

function runTypewriter() {
  if (currentPara < profileParagraphs.length) {
    if (currentChar === 0) {
      const p = document.createElement("p");
      p.id = "para-" + currentPara;
      typewriterContainer.appendChild(p);
    }

    const targetP = document.getElementById("para-" + currentPara);
    
    if (currentChar < profileParagraphs[currentPara].length) {
      targetP.innerHTML += profileParagraphs[currentPara].charAt(currentChar);
      currentChar++;
      setTimeout(runTypewriter, 15);
    } else {
      currentPara++;
      currentChar = 0;
      setTimeout(runTypewriter, 300);
    }
  }
}

/* 2. THEME TOGGLE */
function initThemeEngine() {
  const toggleBtn = document.getElementById("themeToggleBtn");
  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    toggleBtn.innerText = document.body.classList.contains("dark-mode") ? "Light Mode" : "Dark Mode";
  });
}

/* 3. TABLE SORTING ENGINE */
let isAscending = true;
function initTableSort() {
  const sortBtn = document.getElementById("sortEduBtn");
  const tableBody = document.getElementById("eduTableBody");
  
  sortBtn.addEventListener("click", () => {
    const rows = Array.from(tableBody.querySelectorAll("tr"));
    rows.sort((rowA, rowB) => {
      const yearA = parseInt(rowA.cells[2].innerText.match(/\d{4}/)[0]);
      const yearB = parseInt(rowB.cells[2].innerText.match(/\d{4}/)[0]);
      return isAscending ? yearA - yearB : yearB - yearA;
    });
    
    rows.forEach(row => tableBody.appendChild(row));
    isAscending = !isAscending;
    sortBtn.innerText = isAscending ? "Sort by Year (Asc)" : "Sort by Year (Desc)";
  });
}

/* 4. ACCORDION CONTROL */
function initAccordion() {
  const headers = document.querySelectorAll(".accordion-header");
  headers.forEach(header => {
    header.addEventListener("click", () => {
      const item = header.parentElement;
      const isActive = item.classList.contains("active");
      
      document.querySelectorAll(".accordion-item").forEach(i => {
        i.classList.remove("active");
        i.querySelector(".icon").innerText = "+";
      });

      if (!isActive) {
        item.classList.add("active");
        header.querySelector(".icon").innerText = "−";
      }
    });
  });
}

/* 5. GALLERY LIGHTBOX */
function initLightbox() {
  const lightbox = document.getElementById("modalLightbox");
  const lbImage = document.getElementById("lightboxImage");
  const lbText = document.getElementById("lightboxText");
  const closeBtn = document.getElementById("closeLightboxBtn");
  const images = document.querySelectorAll(".gallery-img");

  images.forEach(img => {
    img.addEventListener("click", () => {
      lbImage.src = img.src;
      lbText.innerText = img.alt;
      lightbox.classList.add("show");
    });
  });

  closeBtn.addEventListener("click", () => lightbox.classList.remove("show"));
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) lightbox.classList.remove("show");
  });
}

/* 6. BACK TO TOP BUTTON CONTROL */
function initBackToTop() {
  const backToTopBtn = document.getElementById("backToTopBtn");

  // Show button when scrolled past 200px
  window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
      backToTopBtn.classList.add("visible");
    } else {
      backToTopBtn.classList.remove("visible");
    }
  });

  // Smooth scroll execution
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

/* SINGLE DOM LOAD INITIALIZATION */
window.addEventListener("DOMContentLoaded", () => {
  runTypewriter();
  initThemeEngine();
  initTableSort();
  initAccordion();
  initLightbox();
  initBackToTop();
});