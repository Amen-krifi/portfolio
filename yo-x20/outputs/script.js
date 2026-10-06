const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

window.addEventListener('load', () => {
  window.setTimeout(() => document.querySelector('.page-loader').classList.add('done'), 650);
  window.setTimeout(() => document.querySelector('.page-loader').remove(), 1550);
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
document.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));

const glow = document.querySelector('.cursor-glow');
const label = document.querySelector('.cursor-label');
let pointerX = innerWidth / 2;
let pointerY = innerHeight / 2;
let currentX = pointerX;
let currentY = pointerY;

if (!prefersReducedMotion && matchMedia('(pointer:fine)').matches) {
  window.addEventListener('pointermove', (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    glow.style.opacity = '1';
  });

  const animatePointer = () => {
    currentX += (pointerX - currentX) * 0.12;
    currentY += (pointerY - currentY) * 0.12;
    glow.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
    label.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%) scale(${label.dataset.visible === 'true' ? 1 : .5})`;
    requestAnimationFrame(animatePointer);
  };
  animatePointer();

  document.querySelectorAll('[data-cursor]').forEach((card) => {
    card.addEventListener('mouseenter', () => {
      label.textContent = card.dataset.cursor;
      label.dataset.visible = 'true';
      label.style.opacity = '1';
    });
    card.addEventListener('mouseleave', () => {
      label.dataset.visible = 'false';
      label.style.opacity = '0';
    });
  });

  document.querySelectorAll('.tilt-card').forEach((card) => {
    const art = card.querySelector('.project-art');
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      art.style.transform = `perspective(800px) rotateX(${y * -4}deg) rotateY(${x * 4}deg) scale(1.025)`;
    });
    card.addEventListener('pointerleave', () => { art.style.transform = ''; });
  });

  document.querySelectorAll('.magnetic').forEach((button) => {
    button.addEventListener('pointermove', (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      button.style.transform = `translate(${x * .16}px, ${y * .16}px)`;
    });
    button.addEventListener('pointerleave', () => { button.style.transform = ''; });
  });
}

const canvas = document.getElementById('starfield');
const context = canvas.getContext('2d');
let stars = [];

function resizeStars() {
  const ratio = Math.min(devicePixelRatio || 1, 2);
  canvas.width = innerWidth * ratio;
  canvas.height = innerHeight * ratio;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  const count = Math.round((innerWidth * innerHeight) / 18000);
  stars = Array.from({ length: Math.min(105, Math.max(40, count)) }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    size: Math.random() * 1.5 + .25,
    speed: Math.random() * .08 + .015,
    alpha: Math.random() * .6 + .12,
  }));
}

function drawStars() {
  context.clearRect(0, 0, innerWidth, innerHeight);
  const offset = window.scrollY * .06;
  stars.forEach((star) => {
    const y = (star.y - offset * star.speed + innerHeight) % innerHeight;
    context.beginPath();
    context.fillStyle = `rgba(240,238,231,${star.alpha})`;
    context.arc(star.x, y, star.size, 0, Math.PI * 2);
    context.fill();
  });
  if (!prefersReducedMotion) requestAnimationFrame(drawStars);
}

resizeStars();
drawStars();
window.addEventListener('resize', resizeStars);
