document.addEventListener('DOMContentLoaded', function() {
  // Canvas setup
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  
  // Set canvas dimensions to window size
  function setCanvasSize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
  }
  
  setCanvasSize(); // Set initial size
  
  // Variables
  const particleCount = 200;
  const particles = [];
  const connectionDistance = 150;  // Increased connection distance
  let mouseX = 0;
  let mouseY = 0;
  let mouseRadius = 250;  // Increased mouse radius
  
  // Particle class
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
      
      // Boundary check
      if (this.x < 0 || this.x > canvas.width) {
        this.speedX *= -1;
      }
      
      if (this.y < 0 || this.y > canvas.height) {
        this.speedY *= -1;
      }
      
      // Increase size when near mouse
      const mouseDistance = Math.sqrt(
        (this.x - mouseX) * (this.x - mouseX) +
        (this.y - mouseY) * (this.y - mouseY)
      );
      
      if (mouseDistance < mouseRadius) {
        this.size = this.baseSize + (1 - mouseDistance / mouseRadius) * 1.5;
      } else {
        this.size = this.baseSize;
      }
    }
    
    draw() {
      ctx.fillStyle = 'rgba(100, 181, 246, 0.9)';  // Increased opacity
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // Initialize particles
  function init() {
    particles.length = 0; // Clear existing particles
    
    // Create a grid of particles to ensure better coverage
    const spacing = 70;
    const xCount = Math.ceil(canvas.width / spacing);
    const yCount = Math.ceil(canvas.height / spacing);
    
    // Add grid-based particles with small random offset
    for (let x = 0; x < xCount; x++) {
      for (let y = 0; y < yCount; y++) {
        const particle = new Particle();
        particle.x = x * spacing + (Math.random() * spacing * 0.8 - spacing * 0.4);
        particle.y = y * spacing + (Math.random() * spacing * 0.8 - spacing * 0.4);
        particles.push(particle);
      }
    }
    
    // Add some additional random particles
    for (let i = 0; i < 50; i++) {
      particles.push(new Particle());
    }
  }
  
  // Connect particles
  function connect() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Check if particle is within mouse radius
        const mouseDistI = Math.sqrt(
          (particles[i].x - mouseX) * (particles[i].x - mouseX) +
          (particles[i].y - mouseY) * (particles[i].y - mouseY)
        );
        
        const mouseDistJ = Math.sqrt(
          (particles[j].x - mouseX) * (particles[j].x - mouseX) +
          (particles[j].y - mouseY) * (particles[j].y - mouseY)
        );
        
        if (distance < connectionDistance && 
            (mouseDistI < mouseRadius || mouseDistJ < mouseRadius)) {
          const opacity = 1 - (distance / connectionDistance);
          ctx.strokeStyle = `rgba(100, 181, 246, ${opacity * 0.9})`;  // Increased opacity
          ctx.lineWidth = 0.8;  // Thicker lines
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }
  
  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Automatically move mouse position for initial animation
    if (mouseX === 0 && mouseY === 0) {
      mouseX = canvas.width / 2 + Math.sin(Date.now() * 0.001) * 100;
      mouseY = canvas.height / 2 + Math.cos(Date.now() * 0.001) * 100;
    }
    
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    
    connect();
    requestAnimationFrame(animate);
  }
  
  // Handle resize
  window.addEventListener('resize', function() {
    setCanvasSize();
    init(); // Recreate particles to fill new screen size
  });
  
  // Handle mouse movement
  canvas.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  // Handle touch on mobile
  canvas.addEventListener('touchmove', function(e) {
    if (e.touches.length > 0) {
      mouseX = e.touches[0].clientX;
      mouseY = e.touches[0].clientY;
      e.preventDefault(); // Prevent scrolling on touch
    }
  });
  
  // Animation sequence with jQuery
  $(document).ready(function() {
    // First, animate the navbar
    $('.navbar').animate({
      opacity: 1,
      top: '0'
    }, 1000, function() {
      // After navbar animation, animate the navbar items one by one
      $('.nav-item').each(function(index) {
        $(this).delay(index * 200).animate({
          opacity: 1,
          top: '0'
        }, 800);
      });
      
      // After a delay, start the main content animations
      setTimeout(() => {
        // Fade in title parts
        $('.title-part').each(function(index) {
          $(this).animate({
            opacity: 1
          }, 1200);
        });
        
        // Fade in subtitle
        $('.subtitle').animate({
          opacity: 1
        }, 1200);
        
        // Fade in button
        $('.btn').animate({
          opacity: 1
        }, 1200);
      }, 1000); // Start main content animation 1 second after navbar completes
    });
  });
  
  init();
  animate();
});