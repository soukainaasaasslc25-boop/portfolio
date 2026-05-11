import * as THREE from 'three';

// Dark Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') body.classList.add('light-mode');
themeToggle.addEventListener('click', () => {
  body.classList.toggle('light-mode');
  localStorage.setItem('theme', body.classList.contains('light-mode') ? 'light' : 'dark');
});

// Mobile Navigation
const mobileBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
if (mobileBtn) {
  mobileBtn.addEventListener('click', () => navLinks.classList.toggle('active'));
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('active'));
  });
}

// Custom Cursor
const cursorDot = document.querySelector('[data-cursor-dot]');
const cursorOutline = document.querySelector('[data-cursor-outline]');
if (cursorDot && cursorOutline && window.innerWidth > 768) {
  window.addEventListener('mousemove', (e) => {
    cursorDot.style.transform = `translate(${e.clientX - 3}px, ${e.clientY - 3}px)`;
    cursorOutline.animate({ transform: `translate(${e.clientX - 16}px, ${e.clientY - 16}px)` }, { duration: 100, fill: 'forwards' });
  });
  document.querySelectorAll('a, button, .project-card, .exp-card, .skill-category, .social-card').forEach(el => {
    el.addEventListener('mouseenter', () => { cursorOutline.style.transform = 'scale(1.5)'; cursorOutline.style.borderColor = '#e07eff'; });
    el.addEventListener('mouseleave', () => { cursorOutline.style.transform = 'scale(1)'; cursorOutline.style.borderColor = '#d14fff'; });
  });
}

// Scroll Reveal
const revealElements = document.querySelectorAll('.section-header, .timeline-item, .exp-card, .skill-category, .project-card, .contact-grid > *');
const revealOnScroll = () => revealElements.forEach(el => { if (el.getBoundingClientRect().top < window.innerHeight - 100) el.classList.add('reveal'); });
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// Timeline Observer
const timelineItems = document.querySelectorAll('.timeline-item');
new IntersectionObserver((entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')), { threshold: 0.2 })
  .observeEach = (items) => items.forEach(item => this.observe(item));
timelineItems.forEach(item => new IntersectionObserver(([e]) => e.isIntersecting && e.target.classList.add('visible'), { threshold: 0.2 }).observe(item));

// Typing Animation for Hero Name
const typedNameEl = document.querySelector('.typed-name');
const nameText = 'Soukayna Asaas';
let i = 0;
function typeWriter() {
  if (i < nameText.length) {
    typedNameEl.textContent += nameText.charAt(i);
    i++;
    setTimeout(typeWriter, 100);
  }
}
typeWriter();

// Hero Particles Canvas (Right Side - Simple Circular Particles)
const heroParticlesCanvas = document.getElementById('hero-particles-canvas');
if (heroParticlesCanvas) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
  camera.position.z = 15;
  const renderer = new THREE.WebGLRenderer({ canvas: heroParticlesCanvas, alpha: true, antialias: true });
  
  function resizeParticles() {
    const container = heroParticlesCanvas.parentElement;
    const w = container.clientWidth, h = container.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resizeParticles();
  window.addEventListener('resize', resizeParticles);
  
  // Simple rotating particles ring
  const particleCount = 200;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2;
    const radius = 5;
    positions[i*3] = Math.cos(angle) * radius;
    positions[i*3+1] = Math.sin(angle) * radius * 0.6;
    positions[i*3+2] = (Math.random() - 0.5) * 3;
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({ color: 0xd14fff, size: 0.12, transparent: true, blending: THREE.AdditiveBlending });
  const particlesRing = new THREE.Points(geometry, material);
  scene.add(particlesRing);
  
  // Inner rotating circle
  const geometry2 = new THREE.BufferGeometry();
  const positions2 = new Float32Array(100 * 3);
  for (let i = 0; i < 100; i++) {
    const angle = (i / 100) * Math.PI * 2;
    const radius = 3.2;
    positions2[i*3] = Math.cos(angle) * radius;
    positions2[i*3+1] = Math.sin(angle) * radius * 0.6;
    positions2[i*3+2] = 0;
  }
  geometry2.setAttribute('position', new THREE.BufferAttribute(positions2, 3));
  const material2 = new THREE.PointsMaterial({ color: 0xe07eff, size: 0.1, transparent: true });
  const innerRing = new THREE.Points(geometry2, material2);
  scene.add(innerRing);
  
  let time = 0;
  function animateParticles() {
    requestAnimationFrame(animateParticles);
    time += 0.01;
    particlesRing.rotation.z = time * 0.5;
    innerRing.rotation.z = -time * 0.8;
    renderer.render(scene, camera);
  }
  animateParticles();
}

// About Canvas - Single Orb Rotating Around Image
const aboutCanvas = document.getElementById('about-canvas');
if (aboutCanvas) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 5;
  const renderer = new THREE.WebGLRenderer({ canvas: aboutCanvas, alpha: true, antialias: true });
  
  function resizeAbout() {
    const parent = aboutCanvas.parentElement;
    const w = parent.clientWidth, h = parent.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resizeAbout();
  window.addEventListener('resize', resizeAbout);
  
  // Single glowing orb
  const orbGeometry = new THREE.SphereGeometry(0.15, 32, 32);
  const orbMaterial = new THREE.MeshStandardMaterial({ color: 0xd14fff, emissive: 0xd14fff, emissiveIntensity: 0.8 });
  const orb = new THREE.Mesh(orbGeometry, orbMaterial);
  scene.add(orb);
  
  // Add a small trail effect (tiny particles around orb)
  const trailCount = 12;
  const trailGeometry = new THREE.BufferGeometry();
  const trailPositions = new Float32Array(trailCount * 3);
  for (let i = 0; i < trailCount; i++) trailPositions[i*3] = trailPositions[i*3+1] = trailPositions[i*3+2] = 0;
  trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
  const trailMaterial = new THREE.PointsMaterial({ color: 0xe07eff, size: 0.05, transparent: true });
  const trail = new THREE.Points(trailGeometry, trailMaterial);
  scene.add(trail);
  
  const light = new THREE.PointLight(0xd14fff, 0.5, 6);
  orb.add(light);
  
  let angle = 0;
  const orbitRadius = 2.4;
  let trailPositionsArray = [];
  
  function animateAbout() {
    requestAnimationFrame(animateAbout);
    angle += 0.015;
    const x = Math.cos(angle) * orbitRadius;
    const z = Math.sin(angle) * orbitRadius;
    const y = Math.sin(angle * 1.8) * 1.2;
    orb.position.set(x, y, z);
    
    // Update trail
    trailPositionsArray.unshift({ x, y, z });
    if (trailPositionsArray.length > trailCount) trailPositionsArray.pop();
    const positionsAttr = trail.geometry.attributes.position.array;
    for (let i = 0; i < trailPositionsArray.length; i++) {
      positionsAttr[i*3] = trailPositionsArray[i].x;
      positionsAttr[i*3+1] = trailPositionsArray[i].y;
      positionsAttr[i*3+2] = trailPositionsArray[i].z;
    }
    trail.geometry.attributes.position.needsUpdate = true;
    
    renderer.render(scene, camera);
  }
  animateAbout();
}

// Project Image Sliders
document.querySelectorAll('.project-img-slider').forEach(slider => {
  const imgs = slider.querySelectorAll('.project-img');
  const prevBtn = slider.querySelector('.slider-prev');
  const nextBtn = slider.querySelector('.slider-next');
  let currentIndex = 0;
  const total = imgs.length;
  
  function showImage(index) {
    imgs.forEach((img, i) => img.classList.toggle('active', i === index));
  }
  
  prevBtn?.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + total) % total;
    showImage(currentIndex);
  });
  nextBtn?.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % total;
    showImage(currentIndex);
  });
});

// Contact Form
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    if (name && email && message) {
      formStatus.textContent = '✓ Message sent successfully!';
      formStatus.style.color = '#d14fff';
      contactForm.reset();
      setTimeout(() => formStatus.textContent = '', 5000);
    } else {
      formStatus.textContent = '✗ Please fill in all fields.';
      formStatus.style.color = '#ff6b6b';
    }
  });
}

// Smooth Anchor Scroll
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