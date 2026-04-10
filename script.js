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
  //popup window
   const modal = document.getElementById("planModal");
  const closeModalBtn = document.getElementById("closeModal");
  const selectedPlanText = document.getElementById("selectedPlan");
  const planInput = document.getElementById("planInput");
  const planForm = document.getElementById("planForm");
  const responseMsgp = document.getElementById("planFormResponse");

  // Open modal when clicking "Choose Plan"
  document.querySelectorAll(".choose-plan-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const plan = button.getAttribute("data-plan");
      selectedPlanText.textContent = plan;
      planInput.value = plan;
      modal.classList.add("show");
    });
  });

  // Close modal
  function closeModal() {
    modal.classList.remove("show");
    planForm.reset();
    responseMsgp.textContent = "";
  }

  closeModalBtn.addEventListener("click", closeModal);

  // Close when clicking outside the modal
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close with ESC key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  });

  // Submit form to Formspree
  planForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    responseMsgp.textContent = "Sending...";
    responseMsgp.style.color = "#555";

    const formData = new FormData(planForm);

    try {
      const response = await fetch("https://formspree.io/f/xojporpg", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        responseMsgp.textContent =
          "Thank you! We will contact you shortly.";
        responseMsgp.style.color = "green";
        setTimeout(closeModal, 2000);
      } else {
        responseMsgp.textContent =
          "Something went wrong. Please try again.";
        responseMsgp.style.color = "red";
      }
    } catch (error) {
      responseMsgp.textContent =
        "Network error. Please try again.";
      responseMsgp.style.color = "red";
    }
  });

  // Contact Form Submission
   const servicesContainer = document.getElementById('servicesContainer');
  const addServiceBtn = document.getElementById('addServiceBtn');
  const form = document.getElementById('contactForm');
  const responseMsg = document.getElementById('formResponse');
  const servicesField = document.getElementById("servicesField");

  if (!servicesContainer || !addServiceBtn) return;

  let serviceCount = 0;

  // Function to create a new service configuration block
  function createServiceItem() {
    serviceCount++;

    const serviceItem = document.createElement('div');
    serviceItem.className = 'service-item';

    serviceItem.innerHTML = `
      <div class="service-header">
        <h4>Service ${serviceCount}</h4>
        <button type="button" class="remove-service" aria-label="Remove Service">
         &times;
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
      item.querySelector('h4').textContent = `Service ${index + 1}`;
    });
    serviceCount = items.length;
  }

  // Add first service by default
  
  createServiceItem();

  // Add service on button click
  addServiceBtn.addEventListener("click", createServiceItem);

   // Handle both click and touch events for mobile

  const handleAddService = (e) => {
    e.preventDefault();
    createServiceItem();
  };

  // Add new service on button click
 addServiceBtn.addEventListener('click', handleAddService);
  addServiceBtn.addEventListener('touchstart', handleAddService, { passive: false });
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

       // Store services as JSON string
      servicesField.value = JSON.stringify(formData.services, null, 2);

      responseMsg.textContent = "Submitting...";
      responseMsg.style.color = "#555";

      try {
        const res = await fetch("https://formspree.io/f/xojporpg", {
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
