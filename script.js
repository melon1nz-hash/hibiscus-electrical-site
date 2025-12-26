document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  // Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (mobileMenu.classList.contains('active')) {
        icon.setAttribute('data-lucide', 'x');
      } else {
        icon.setAttribute('data-lucide', 'menu');
      }
      lucide.createIcons();
    });
  }

  // Close mobile menu on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      const icon = mobileToggle.querySelector('i');
      icon.setAttribute('data-lucide', 'menu');
      lucide.createIcons();
    });
  });

  // Header Scroll Effect
  const header = document.querySelector('header');
  const logoText = document.querySelector('.logo');
  const navLinks = document.querySelectorAll('.nav-link');
  const toggleIcon = document.querySelector('.mobile-toggle');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Intersection Observer for Animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.service-card, .project-card, .fade-in-up').forEach(el => {
    el.classList.add('fade-in-up');
    observer.observe(el);
  });

  // Contact Form Handling (Static)
  const contactForm = document.querySelector('.contact-form form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.innerText;
      
      btn.innerText = 'Sent!';
      btn.style.backgroundColor = '#10b981';
      
      setTimeout(() => {
        btn.innerText = originalText;
        btn.style.backgroundColor = '';
        contactForm.reset();
        alert('Thank you! We will be in touch shortly.');
      }, 2000);
    });
  }
});
// CMS Content Loader
async function loadCMSContent() {
  try {
    const response = await fetch('content.json');
    if (!response.ok) {
      console.log('No CMS content found, using default content');
      return;
    }
    
    const data = await response.json();
    
    // Update Hero Section
    if (data.hero) {
      const hero = data.hero;
      const heroSection = document.querySelector('.hero');
      
      if (hero.headline) {
        const h1 = heroSection.querySelector('h1');
        h1.innerHTML = hero.headline.replace('Hibiscus Coast', '<span class="text-accent">Hibiscus Coast</span>');
      }
      
      if (hero.subheadline) {
        const p = heroSection.querySelector('p');
        p.textContent = hero.subheadline;
      }
      
      if (hero.button_text) {
        const primaryBtn = heroSection.querySelector('.btn-primary');
        primaryBtn.textContent = hero.button_text;
      }
      if (hero.button_text_secondary) {
        const secondaryBtn = heroSection.querySelector('.btn-outline');
        if (secondaryBtn) {
          secondaryBtn.textContent = hero.button_text_secondary;
        }
      }
      
      if (hero.button_link_secondary) {
        const secondaryBtn = heroSection.querySelector('.btn-outline');
        if (secondaryBtn) {
          secondaryBtn.href = hero.button_link_secondary;
        }
      }
      
      if (hero.image) {
        const img = heroSection.querySelector('.hero-bg img');
        img.src = hero.image;
      }
    }
    
    // Update Services Section
    if (data.services && data.services.length > 0) {
      const servicesGrid = document.querySelector('.services-grid');
      servicesGrid.innerHTML = '';
      
      data.services.forEach(service => {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'service-card fade-in-up';
        serviceCard.innerHTML = `
          <div class="service-icon">
            <i data-lucide="zap"></i>
          </div>
          <h3>${service.title || ''}</h3>
          <p>${service.description || ''}</p>
        `;
        servicesGrid.appendChild(serviceCard);
      });
      
      lucide.createIcons();
    }
    
    // Update About Section
    if (data.about) {
      const aboutSection = document.querySelector('.about-section');
      const about = data.about;
      
      if (about.heading) {
        const h2 = aboutSection.querySelector('h2');
        h2.textContent = about.heading;
      }
      
      if (about.content) {
        const aboutText = aboutSection.querySelector('.about-text');
        const paragraphs = aboutText.querySelectorAll('p');
        
        // Simple markdown to HTML conversion
        const contentParts = about.content.split('\n\n');
        contentParts.forEach((part, index) => {
          if (paragraphs[index]) {
            paragraphs[index].textContent = part;
          }
        });
      }
      
      if (about.image) {
        const img = aboutSection.querySelector('.about-image img');
        img.src = about.image;
      }
    }
    
    // Update Portfolio Section
    if (data.portfolio && data.portfolio.length > 0) {
      const portfolioGrid = document.querySelector('.projects-grid');
      if (portfolioGrid) {
        portfolioGrid.innerHTML = '';
        
        data.portfolio.forEach(project => {
          const projectCard = document.createElement('div');
          projectCard.className = 'project-card fade-in-up';
          projectCard.innerHTML = `
            <img src="${project.image || 'assets/placeholder.jpg'}" alt="${project.title || 'Project'}">
            <div class="project-overlay">
              <h3>${project.title || ''}</h3>
              <p>${project.description || ''}</p>
              ${project.link ? `<a href="${project.link}" class="btn btn-outline btn-sm">View Details</a>` : ''}
            </div>
          `;
          portfolioGrid.appendChild(projectCard);
        });
      }
    }
    
    // Update Testimonials Section
    if (data.testimonials && data.testimonials.length > 0) {
      const testimonialsGrid = document.querySelector('.testimonials-grid');
      if (testimonialsGrid) {
        testimonialsGrid.innerHTML = '';
        
        data.testimonials.forEach(testimonial => {
          const card = document.createElement('div');
          card.className = 'testimonial-card fade-in-up';
          card.innerHTML = `
            <div class="stars">★★★★★</div>
            <p class="quote">"${testimonial.quote || ''}"</p>
            <div class="testimonial-author">
              ${testimonial.photo ? `<img src="${testimonial.photo}" alt="${testimonial.name}">` : ''}
              <div>
                <div class="author-name">${testimonial.name || ''}</div>
                <div class="author-title">${testimonial.title || ''}</div>
              </div>
            </div>
          `;
          testimonialsGrid.appendChild(card);
        });
      }
    }
    
    // Update Contact Section
    if (data.contact) {
      const contactSection = document.querySelector('#contact');
      if (contactSection) {
        const contact = data.contact;
        
        if (contact.heading) {
          const h2 = contactSection.querySelector('h2');
          if (h2) h2.textContent = contact.heading;
        }
        
        if (contact.email) {
          const emailLink = contactSection.querySelector('a[href^="mailto:"]');
          if (emailLink) {
            emailLink.href = `mailto:${contact.email}`;
            emailLink.textContent = contact.email;
          }
        }
        
        if (contact.phone) {
          const phoneLink = contactSection.querySelector('a[href^="tel:"]');
          if (phoneLink) {
            phoneLink.href = `tel:${contact.phone}`;
            phoneLink.textContent = contact.phone;
          }
        }
      }
    }
    
    // Re-initialize animations for new elements
    document.querySelectorAll('.fade-in-up').forEach(el => {
      observer.observe(el);
    });
    
    console.log('CMS content loaded successfully');
    
  } catch (error) {
    console.error('Error loading CMS content:', error);
  }
}

// Load CMS content when page loads
loadCMSContent();