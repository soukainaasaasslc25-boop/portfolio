// Import Three.js
import * as THREE from 'three';

// ----------------------------------------------
// DARK MODE TOGGLE
// ----------------------------------------------
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  body.classList.add('light-mode');
}

themeToggle.addEventListener('click', () => {
  body.classList.toggle('light-mode');
  const isLight = body.classList.contains('light-mode');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

// ----------------------------------------------
// Mobile Navigation
// ----------------------------------------------
const mobileBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileBtn) {
  mobileBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileBtn.classList.toggle('active');
  });
}

// Close mobile menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });
});

// ----------------------------------------------
// Custom Cursor (desktop only)
// ----------------------------------------------
const cursorDot = document.querySelector('[data-cursor-dot]');
const cursorOutline = document.querySelector('[data-cursor-outline]');

if (cursorDot && cursorOutline && window.innerWidth > 768) {
  window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;
    
    cursorDot.style.transform = `translate(${posX - 3}px, ${posY - 3}px)`;
    
    cursorOutline.animate({
      transform: `translate(${posX - 16}px, ${posY - 16}px)`
    }, { duration: 100, fill: 'forwards' });
  });
  
  // Hover effect on interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .project-card, .exp-card, .skill-category');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorOutline.style.transform = `scale(1.5)`;
      cursorOutline.style.borderColor = '#e07eff';
    });
    el.addEventListener('mouseleave', () => {
      cursorOutline.style.transform = `scale(1)`;
      cursorOutline.style.borderColor = '#d14fff';
    });
  });
}

// ----------------------------------------------
// Scroll Reveal Animation
// ----------------------------------------------
const revealElements = document.querySelectorAll('.section-header, .timeline-item, .exp-card, .skill-category, .project-card, .contact-grid > *');

const revealOnScroll = () => {
  revealElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    if (rect.top < windowHeight - 100) {
      el.classList.add('reveal');
    }
  });
};

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// Also trigger timeline items individually
const timelineItems = document.querySelectorAll('.timeline-item');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 });

timelineItems.forEach(item => observer.observe(item));

// ----------------------------------------------
// HERO SECTION - 3D Particles & Rotating Rings
// ----------------------------------------------
const heroCanvas = document.getElementById('hero-canvas');
if (heroCanvas) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;
  
  const renderer = new THREE.WebGLRenderer({ canvas: heroCanvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  
  // Floating particles around name
  const particleCount = 800;
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesPositions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    particlesPositions[i * 3] = (Math.random() - 0.5) * 60;
    particlesPositions[i * 3 + 1] = (Math.random() - 0.5) * 40;
    particlesPositions[i * 3 + 2] = (Math.random() - 0.5) * 40 - 20;
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPositions, 3));
  
  const particlesMaterial = new THREE.PointsMaterial({
    color: 0xd14fff,
    size: 0.15,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });
  
  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);
  
  // Rotating rings
  const ringGeometry = new THREE.TorusGeometry(5, 0.08, 64, 200);
  const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xd14fff, transparent: true, opacity: 0.4 });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  scene.add(ring);
  
  const ring2Geometry = new THREE.TorusGeometry(7, 0.06, 64, 200);
  const ring2Material = new THREE.MeshBasicMaterial({ color: 0xe07eff, transparent: true, opacity: 0.3 });
  const ring2 = new THREE.Mesh(ring2Geometry, ring2Material);
  ring2.rotation.x = Math.PI / 2;
  ring2.rotation.z = Math.PI / 3;
  scene.add(ring2);
  
  const ring3Geometry = new THREE.TorusGeometry(9, 0.05, 64, 200);
  const ring3Material = new THREE.MeshBasicMaterial({ color: 0xd14fff, transparent: true, opacity: 0.2 });
  const ring3 = new THREE.Mesh(ring3Geometry, ring3Material);
  ring3.rotation.x = Math.PI / 4;
  ring3.rotation.z = Math.PI / 6;
  scene.add(ring3);
  
  // Small floating orbs
  const orbCount = 150;
  const orbGeometry = new THREE.SphereGeometry(0.08, 6, 6);
  const orbs = [];
  for (let i = 0; i < orbCount; i++) {
    const orb = new THREE.Mesh(orbGeometry, new THREE.MeshStandardMaterial({ color: 0xe07eff, emissive: 0xd14fff, emissiveIntensity: 0.3 }));
    orb.userData = {
      radius: Math.random() * 12 + 3,
      speed: 0.002 + Math.random() * 0.003,
      angle: Math.random() * Math.PI * 2,
      yOffset: (Math.random() - 0.5) * 15
    };
    scene.add(orb);
    orbs.push(orb);
  }
  
  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  const pointLight = new THREE.PointLight(0xd14fff, 0.8);
  pointLight.position.set(10, 10, 10);
  scene.add(pointLight);
  
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 0.5;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.3;
  });
  
  let time = 0;
  
  function animateHero() {
    requestAnimationFrame(animateHero);
    time += 0.008;
    
    // Rotate particles slowly
    particles.rotation.y = time * 0.1;
    particles.rotation.x = Math.sin(time * 0.2) * 0.2;
    
    // Rotate rings
    ring.rotation.z += 0.005;
    ring.rotation.x += 0.003;
    ring2.rotation.y += 0.004;
    ring2.rotation.x += 0.002;
    ring3.rotation.z += 0.006;
    ring3.rotation.y += 0.003;
    
    // Animate orbiting orbs
    orbs.forEach(orb => {
      orb.userData.angle += orb.userData.speed;
      const x = Math.cos(orb.userData.angle) * orb.userData.radius;
      const z = Math.sin(orb.userData.angle) * orb.userData.radius;
      orb.position.set(x, orb.userData.yOffset + Math.sin(time * 2 + orb.userData.radius) * 1, z);
    });
    
    // Subtle camera following mouse
    camera.position.x += (mouseX * 3 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 2 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
    
    renderer.render(scene, camera);
  }
  
  animateHero();
  
  // Handle resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// ----------------------------------------------
// ABOUT SECTION - Rotating dots around image
// ----------------------------------------------
const aboutCanvas = document.getElementById('about-canvas');
if (aboutCanvas) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 4.5;
  
  const renderer = new THREE.WebGLRenderer({ canvas: aboutCanvas, alpha: true, antialias: true });
  
  function resizeAboutCanvas() {
    const parent = aboutCanvas.parentElement;
    const width = parent.clientWidth;
    const height = parent.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  
  resizeAboutCanvas();
  window.addEventListener('resize', resizeAboutCanvas);
  
  // Create sphere of dots rotating around image
  const dotCount = 350;
  const dotsGeometry = new THREE.BufferGeometry();
  const dotsPositions = new Float32Array(dotCount * 3);
  
  for (let i = 0; i < dotCount; i++) {
    const radius = 2.2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    dotsPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    dotsPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    dotsPositions[i * 3 + 2] = radius * Math.cos(phi);
  }
  
  dotsGeometry.setAttribute('position', new THREE.BufferAttribute(dotsPositions, 3));
  
  const dotsMaterial = new THREE.PointsMaterial({
    color: 0xd14fff,
    size: 0.05,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending
  });
  
  const dots = new THREE.Points(dotsGeometry, dotsMaterial);
  scene.add(dots);
  
  // Second outer ring of particles
  const outerCount = 200;
  const outerGeometry = new THREE.BufferGeometry();
  const outerPositions = new Float32Array(outerCount * 3);
  
  for (let i = 0; i < outerCount; i++) {
    const radius = 2.8;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    outerPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    outerPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    outerPositions[i * 3 + 2] = radius * Math.cos(phi);
  }
  
  outerGeometry.setAttribute('position', new THREE.BufferAttribute(outerPositions, 3));
  const outerMaterial = new THREE.PointsMaterial({ color: 0xe07eff, size: 0.04, transparent: true, opacity: 0.5 });
  const outerDots = new THREE.Points(outerGeometry, outerMaterial);
  scene.add(outerDots);
  
  // Single glowing orb that rotates around
  const orbGeometry = new THREE.SphereGeometry(0.09, 16, 16);
  const orbMaterial = new THREE.MeshStandardMaterial({ color: 0xd14fff, emissive: 0xd14fff, emissiveIntensity: 0.6 });
  const orbLight = new THREE.Mesh(orbGeometry, orbMaterial);
  scene.add(orbLight);
  
  const light = new THREE.PointLight(0xd14fff, 0.5, 8);
  orbLight.add(light);
  
  let angle = 0;
  
  function animateAbout() {
    requestAnimationFrame(animateAbout);
    
    dots.rotation.y += 0.005;
    dots.rotation.x += 0.003;
    outerDots.rotation.y -= 0.004;
    outerDots.rotation.z += 0.002;
    
    angle += 0.012;
    const radiusOrb = 2.5;
    orbLight.position.x = Math.cos(angle) * radiusOrb;
    orbLight.position.z = Math.sin(angle) * radiusOrb;
    orbLight.position.y = Math.sin(angle * 1.5) * 1.2;
    
    renderer.render(scene, camera);
  }
  
  animateAbout();
}

// ----------------------------------------------
// Contact Form Handler
// ----------------------------------------------
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    if (name && email && message) {
      formStatus.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
      formStatus.style.color = '#d14fff';
      contactForm.reset();
      
      setTimeout(() => {
        formStatus.textContent = '';
      }, 5000);
    } else {
      formStatus.textContent = '✗ Please fill in all fields.';
      formStatus.style.color = '#ff6b6b';
    }
  });
}

// ----------------------------------------------
// Smooth anchor scroll
// ----------------------------------------------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === "#" || href === "") return;
    
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Preloader / initial reveal
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  revealOnScroll();
});


// =============================================
// PROJECTS IMAGE SLIDERS
// =============================================
function initProjectSliders() {
  const sliders = document.querySelectorAll('.project-image-slider');
  
  sliders.forEach(slider => {
    const images = slider.querySelectorAll('.slider-img');
    const dotsContainer = slider.querySelector('.slider-dots');
    let currentIndex = 0;
    let interval;

    // Create dots
    dotsContainer.innerHTML = '';
    images.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        goToSlide(index);
      });
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.dot');

    function goToSlide(index) {
      images.forEach(img => img.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      
      images[index].classList.add('active');
      dots[index].classList.add('active');
      currentIndex = index;
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % images.length;
      goToSlide(currentIndex);
    }

    // Auto slide
    function startAutoSlide() {
      interval = setInterval(nextSlide, 4000);
    }

    function stopAutoSlide() {
      clearInterval(interval);
    }

    // Start
    startAutoSlide();

    // Pause on hover
    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);
  });
}

// Initialize after page load
window.addEventListener('load', initProjectSliders);