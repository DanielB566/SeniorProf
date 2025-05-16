document.addEventListener('DOMContentLoaded', function () {
  // --- Canvas Particle Background Setup ---
  const canvas = document.getElementById('canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');

    function setCanvasSize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    setCanvasSize();

    const particles = [];
    const connectionDistance = 150;
    let mouseX = 0;
    let mouseY = 0;
    let mouseRadius = 250;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = Math.random() * 0.6 - 0.3;
        this.speedY = Math.random() * 0.6 - 0.3;
        this.baseSize = this.size;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

        const dx = this.x - mouseX;
        const dy = this.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseRadius) {
          this.size = this.baseSize + (1 - distance / mouseRadius) * 1.5;
        } else {
          this.size = this.baseSize;
        }
      }

      draw() {
        ctx.fillStyle = 'rgba(100, 181, 246, 0.9)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function initParticles() {
      particles.length = 0;
      const spacing = 70;
      const xCount = Math.ceil(canvas.width / spacing);
      const yCount = Math.ceil(canvas.height / spacing);

      for (let x = 0; x < xCount; x++) {
        for (let y = 0; y < yCount; y++) {
          const p = new Particle();
          p.x = x * spacing + (Math.random() * spacing * 0.8 - spacing * 0.4);
          p.y = y * spacing + (Math.random() * spacing * 0.8 - spacing * 0.4);
          particles.push(p);
        }
      }

      for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
      }
    }

    function connectParticles() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          const nearMouse =
            Math.sqrt((particles[i].x - mouseX) ** 2 + (particles[i].y - mouseY) ** 2) < mouseRadius ||
            Math.sqrt((particles[j].x - mouseX) ** 2 + (particles[j].y - mouseY) ** 2) < mouseRadius;

          if (distance < connectionDistance && nearMouse) {
            const opacity = 1 - distance / connectionDistance;
            ctx.strokeStyle = `rgba(100, 181, 246, ${opacity * 0.9})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (mouseX === 0 && mouseY === 0) {
        mouseX = canvas.width / 2 + Math.sin(Date.now() * 0.001) * 100;
        mouseY = canvas.height / 2 + Math.cos(Date.now() * 0.001) * 100;
      }

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      connectParticles();
      requestAnimationFrame(animateParticles);
    }

    window.addEventListener('resize', () => {
      setCanvasSize();
      initParticles();
    });

    canvas.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
        e.preventDefault();
      }
    });

    initParticles();
    animateParticles();
  }

  // --- About Section: Skill Bar Animation ---
  function isInViewport(element) {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 1.2 && 
      rect.bottom >= 0
    );
  }

  function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    progressBars.forEach(bar => {
      const level = bar.getAttribute('data-level');
      if (bar.closest('.skill-card').classList.contains('visible')) {
        setTimeout(() => {
          bar.style.width = level + '%';
        }, 300);
      }
    });
  }

  function makeAboutSectionVisible() {
    const sectionTitle = document.querySelector('.section-title');
    const aboutText = document.querySelector('.about-text');
    const skillCards = document.querySelectorAll('.skill-card');

    // Force show the section title
    if (sectionTitle) {
      sectionTitle.classList.add('visible');
    }

    // Force show the about text
    if (aboutText) {
      aboutText.classList.add('visible');
    }

    // Force show all skill cards
    skillCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('visible');
      }, 100 * index);
    });

    // Animate the progress bars
    setTimeout(animateProgressBars, 500);
  }

  function handleScrollAnimation() {
    const sectionTitle = document.querySelector('.section-title');
    const aboutText = document.querySelector('.about-text');
    const skillCards = document.querySelectorAll('.skill-card');

    if (sectionTitle && isInViewport(sectionTitle)) {
      sectionTitle.classList.add('visible');
    }

    if (aboutText && isInViewport(aboutText)) {
      setTimeout(() => {
        aboutText.classList.add('visible');
      }, 300);
    }

    skillCards.forEach(card => {
      if (isInViewport(card) && !card.classList.contains('visible')) {
        const delay = parseInt(card.getAttribute('data-delay')) || 0;
        setTimeout(() => {
          card.classList.add('visible');
        }, delay);
      }
    });

    // Check if all skill cards are visible and animate progress bars if they are
    const allCardsVisible = Array.from(skillCards).every(card => card.classList.contains('visible'));
    if (allCardsVisible) {
      animateProgressBars();
    }
  }

  // --- Navbar + Hero Animation ---
  $(document).ready(function () {
    $('.navbar').animate({ opacity: 1, top: '0' }, 1000, function () {
      $('.nav-item').each(function (index) {
        $(this).delay(index * 200).animate({ opacity: 1, top: '0' }, 800);
      });

      setTimeout(() => {
        $('.title-part').each(function () {
          $(this).animate({ opacity: 1 }, 1200);
        });
        $('.subtitle, .btn').animate({ opacity: 1 }, 1200);
      }, 1000);
    });

    // Force show the about section after a delay
    setTimeout(makeAboutSectionVisible, 1000);
  });

  // --- Smooth Scroll ---
  $('.navbar .nav-link, .btn').on('click', function (e) {
    if (this.hash !== '') {
      e.preventDefault();
      const hash = this.hash;
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 800, function () {
        window.location.hash = hash;
        
        // Force elements to be visible when they're scrolled to
        if (hash === '#about') {
          makeAboutSectionVisible();
        }
      });
    }
  });

  // Trigger animations on scroll and on page load
  window.addEventListener('scroll', handleScrollAnimation);
  
  // Add this to ensure elements are visible even without scrolling
  window.addEventListener('load', function() {
    handleScrollAnimation();
    // Force about section to be visible after a short delay
    setTimeout(makeAboutSectionVisible, 1000);
  });
});