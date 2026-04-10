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
   const servicesContainer = document.getElementById('servicesContainer');
  const addServiceBtn = document.getElementById('addServiceBtn');
  const form = document.getElementById('contactForm');
  const responseMsg = document.getElementById('formResponse');

  let serviceCount = 0;

  // Function to create a new service configuration block
  function createServiceItem() {
    serviceCount++;

    const serviceItem = document.createElement('div');
    serviceItem.className = 'service-item';

    serviceItem.innerHTML = `
      <div class="service-header">
        <h4>Service ${serviceCount}</h4>
        <button type="button" class="remove-service" title="Remove Service">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="form-grid">
        <select name="serviceType" required>
          <option value="">Select Service</option>
          <option value="Cloud Office Environment">Cloud Office Environment</option>
          <option value="Employee Monitoring">Employee Monitoring</option>
          <option value="App & Website Tracking">App & Website Tracking</option>
          <option value="Restriction & Control System">Restriction & Control System</option>
          <option value="Smart Reporting">Smart Reporting</option>
          <option value="Cybersecurity Suite">Cybersecurity Suite</option>
        </select>

        <input type="number" name="licenses" placeholder="Number of Licenses" min="1" required />
      </div>

      <textarea name="serviceNotes" rows="2" placeholder="Specific requirements for this service"></textarea>
    `;

    // Remove service functionality
    serviceItem.querySelector('.remove-service').addEventListener('click', () => {
      serviceItem.remove();
      updateServiceNumbers();
    });

    servicesContainer.appendChild(serviceItem);
  }

  // Update numbering after removal
  function updateServiceNumbers() {
    const items = servicesContainer.querySelectorAll('.service-item');
    items.forEach((item, index) => {
      const header = item.querySelector('h4');
      header.textContent = `Service ${index + 1}`;
    });
    serviceCount = items.length;
  }

  // Add first service by default
  if (servicesContainer) {
    createServiceItem();
  }

  // Add new service on button click
  if (addServiceBtn) {
    addServiceBtn.addEventListener('click', createServiceItem);
  }

  // Handle form submission
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Collect basic form data
      const formData = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        company: form.company.value.trim(),
        employees: form.employees ? form.employees.value : null,
        message: form.message.value.trim(),
        services: [],
      };

      // Collect configured services
      document.querySelectorAll('.service-item').forEach(item => {
        const type = item.querySelector('select[name=\"serviceType\"]').value;
        const licenses = item.querySelector('input[name=\"licenses\"]').value;
        const notes = item.querySelector('textarea[name=\"serviceNotes\"]').value;

        if (type) {
          formData.services.push({
            type,
            licenses,
            notes,
          });
        }
      });

      responseMsg.textContent = "Submitting...";
      responseMsg.style.color = "#555";

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (res.ok) {
          responseMsg.textContent = data.message || "Request submitted successfully!";
          responseMsg.style.color = "green";
          form.reset();
          servicesContainer.innerHTML = '';
          createServiceItem(); // Reinitialize with one service
        } else {
          responseMsg.textContent = data.message || "Submission failed.";
          responseMsg.style.color = "red";
        }
      } catch (error) {
        console.error('Submission error:', error);
        responseMsg.textContent = "Unable to submit. Please try again.";
        responseMsg.style.color = "red";
      }
    });
  }
});
