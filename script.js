document.addEventListener('DOMContentLoaded', function() {
  // Initialize variables
  let currentSection = 0;
  let currentAlbumPage = 0;
  let openedNote = null;
  const totalSections = 4;
  const totalAlbumPages = 4;
  
  // Elements
  const sections = document.querySelectorAll('.section');
  const prevButton = document.getElementById('prev-section');
  const nextButton = document.getElementById('next-section');
  const notesContainer = document.getElementById('notes-container');
  const memoryContent = document.getElementById('memory-content');
  const closeMemoryButton = document.getElementById('close-memory');
  const prevPageButton = document.getElementById('prev-page');
  const nextPageButton = document.getElementById('next-page');
  const currentPageIndicator = document.getElementById('current-page');
  const albumPhotos = document.getElementById('album-photos');
  const musicToggle = document.getElementById('music-toggle');
  const birthdayMusic = document.getElementById('birthday-music');
  
  // Photo data - using the direct URLs provided
  const photos = [
    [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-04-01%20at%2016.36.46_01b4577e.jpg-VUC4SwPMhGxYuajhxSSpFhyJC3DyVR.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-04-01%20at%2016.36.47_0af0a674.jpg-DOX2hZeS9JHo5E4PtQslmnYwvRPZ33.jpeg"
    ],
    [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-04-01%20at%2016.36.47_5a633b2c.jpg-M27jsSru9vGh8TwiPHfpgfuM1HGcdY.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-04-01%20at%2016.36.48_c07a7fb2.jpg-fioRpCo4MUQMc44DkvbAv2BkSrs1fP.jpeg"
    ],
    [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-04-01%20at%2016.36.49_3ba531df.jpg-M7fSeih8StvfKEE9sBzonmAEDqwG8w.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-04-01%20at%2016.36.49_8af1e7b1.jpg-Bye2YiSvMbCfL0e0MMvtZLqnkUOMiM.jpeg"
    ],
    [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-04-01%20at%2016.36.49_cdb37838.jpg-W9kbbKFi5qaGIoThD670JsLv0Ahld4.jpeg",
      "https://v0.dev/placeholder.svg"
    ]
  ];
  
  // Initialize confetti
  const duration = 10 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    
    // since particles fall down, start a bit higher than random
    confetti(Object.assign({}, defaults, { 
      particleCount, 
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } 
    }));
    confetti(Object.assign({}, defaults, { 
      particleCount, 
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } 
    }));
  }, 250);
  
  // Initialize Vanilla Tilt
  VanillaTilt.init(document.getElementById("message-card"), {
    max: 15,
    speed: 400,
    glare: true,
    "max-glare": 0.5,
  });
  
  // Music controls
  musicToggle.addEventListener('click', function() {
    if (birthdayMusic.paused) {
      birthdayMusic.play();
      musicToggle.querySelector('.music-icon').textContent = '🔊';
    } else {
      birthdayMusic.pause();
      musicToggle.querySelector('.music-icon').textContent = '🔇';
    }
  });
  
  // Try to autoplay music (may be blocked by browser)
  birthdayMusic.volume = 0.5;
  const playPromise = birthdayMusic.play();
  
  if (playPromise !== undefined) {
    playPromise.then(_ => {
      // Autoplay started
      musicToggle.querySelector('.music-icon').textContent = '🔊';
    }).catch(error => {
      // Autoplay prevented
      musicToggle.querySelector('.music-icon').textContent = '🔇';
    });
  }
  
  // Navigation functions
  function showSection(index) {
    sections.forEach((section, i) => {
      if (i === index) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });
    
    prevButton.disabled = index === 0;
    nextButton.disabled = index === totalSections - 1;
    
    currentSection = index;
  }
  
  function updateAlbumPage(index) {
    const leftPhoto = photos[index][0];
    const rightPhoto = photos[index][1];
    
    albumPhotos.innerHTML = `
      <div class="photo-frame left-photo">
        <img src="${leftPhoto}" alt="Photo ${index * 2 + 1}" class="album-photo">
      </div>
      <div class="photo-frame right-photo">
        <img src="${rightPhoto}" alt="Photo ${index * 2 + 2}" class="album-photo">
      </div>
    `;
    
    currentPageIndicator.textContent = index + 1;
    prevPageButton.disabled = index === 0;
    nextPageButton.disabled = index === totalAlbumPages - 1;
    
    currentAlbumPage = index;
  }
  
  // Event listeners
  prevButton.addEventListener('click', function() {
    if (currentSection > 0) {
      showSection(currentSection - 1);
    }
  });
  
  nextButton.addEventListener('click', function() {
    if (currentSection < totalSections - 1) {
      showSection(currentSection + 1);
    }
  });
  
  notesContainer.addEventListener('click', function(e) {
    const note = e.target.closest('.memory-note');
    if (note) {
      const index = note.dataset.index;
      openedNote = index;
      notesContainer.style.display = 'none';
      memoryContent.classList.add('active');
    }
  });
  
  closeMemoryButton.addEventListener('click', function() {
    memoryContent.classList.remove('active');
    notesContainer.style.display = 'grid';
    openedNote = null;
  });
  
  prevPageButton.addEventListener('click', function() {
    if (currentAlbumPage > 0) {
      updateAlbumPage(currentAlbumPage - 1);
    }
  });
  
  nextPageButton.addEventListener('click', function() {
    if (currentAlbumPage < totalAlbumPages - 1) {
      updateAlbumPage(currentAlbumPage + 1);
    }
  });
  
  // Initialize the page
  showSection(0);
  updateAlbumPage(0);
});
