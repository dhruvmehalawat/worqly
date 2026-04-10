document.addEventListener('DOMContentLoaded', () => {
  AOS.init({ duration: 1000, once: true });

  // GSAP Animations
  gsap.from('.hero-text', { opacity: 0, y: 50, duration: 1 });
  gsap.from('.hero-image', { opacity: 0, x: 50, duration: 1, delay: 0.3 });

  // Mobile Menu Toggle
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  // Dark Mode Toggle with Persistence
  const toggleBtn = document.getElementById('themeToggle');
  const icon = toggleBtn.querySelector('i');

  // Load saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    icon.classList.replace('fa-moon', 'fa-sun');
  }

  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');

    if (document.body.classList.contains('dark')) {
      localStorage.setItem('theme', 'dark');
      icon.classList.replace('fa-moon', 'fa-sun');
    } else {
      localStorage.setItem('theme', 'light');
      icon.classList.replace('fa-sun', 'fa-moon');
    }
  });

  // FAQ Toggle
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
    });
  });

   // Testimonials Slider
  let index = 0;
  const testimonials = document.querySelectorAll('.testimonial');
  if (testimonials.length > 0) {
    testimonials[0].classList.add('active');
    setInterval(() => {
      testimonials[index].classList.remove('active');
      index = (index + 1) % testimonials.length;
      testimonials[index].classList.add('active');
    }, 4000);
  }

  // Contact Form Submission
  const form = document.getElementById('contactForm');
  const responseMsg = document.getElementById('formResponse');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = Object.fromEntries(new FormData(form));

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        responseMsg.textContent = data.message;
        form.reset();
      } catch (error) {
        responseMsg.textContent = 'Something went wrong. Please try again.';
      }
    });
  }
});
