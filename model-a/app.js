// model-a/app.js - Lógica Interactiva y Temas para Modelo Scroll Continuo
document.addEventListener('DOMContentLoaded', () => {

  // --- 1. PRELOADER Y CARGA INICIAL ---
  const preloader = document.getElementById('preloader');
  
  window.addEventListener('load', () => {
    if (preloader) {
      preloader.classList.add('fade-out');
    }
  });

  // Respaldo de seguridad para quitar preloader
  setTimeout(() => {
    if (preloader && !preloader.classList.contains('fade-out')) {
      preloader.classList.add('fade-out');
    }
  }, 1000);


  // --- 2. GESTIÓN DE TEMA CLARO / OSCURO (LIGHT/DARK MODE) ---
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const mobileThemeToggleBtn = document.getElementById('mobileThemeToggleBtn');
  const body = document.body;
  const headerLogo = document.getElementById('headerLogo');

  function updateLogoForTheme(isDark) {
    if (headerLogo) {
      headerLogo.src = isDark ? '../assets/logo-light.svg' : '../assets/logo-dark.svg';
    }
  }

  function updateToggleIcons(isDark) {
    const iconClass = isDark ? 'fa-sun' : 'fa-moon';
    
    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = `<i class="fa-solid ${iconClass}"></i>`;
    }
    if (mobileThemeToggleBtn) {
      mobileThemeToggleBtn.innerHTML = `<i class="fa-solid ${iconClass}"></i> <span>Tema ${isDark ? 'Claro' : 'Oscuro'}</span>`;
    }
  }

  function setTheme(isDark) {
    if (isDark) {
      body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
    updateLogoForTheme(isDark);
    updateToggleIcons(isDark);
  }

  // Eventos de clic para cambiar tema
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isDark = body.classList.contains('dark-mode');
      setTheme(!isDark);
    });
  }

  if (mobileThemeToggleBtn) {
    mobileThemeToggleBtn.addEventListener('click', () => {
      const isDark = body.classList.contains('dark-mode');
      setTheme(!isDark);
    });
  }

  // Inicialización del tema basado en localStorage o preferencias del OS
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    setTheme(true);
  } else {
    setTheme(false);
  }


  // --- 3. MENÚ MÓVIL Y OVERLAY ---
  const menuToggle = document.getElementById('menuToggle');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileOverlay.classList.toggle('open');
    document.body.style.overflow = mobileOverlay.classList.contains('open') ? 'hidden' : 'auto';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      mobileOverlay.classList.remove('open');
      document.body.style.overflow = 'auto';
    });
  });


  // --- 4. HEADER SCROLL Y BARRA DE PROGRESO ---
  const mainHeader = document.getElementById('mainHeader');
  const scrollProgress = document.getElementById('scrollProgress');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    scrollProgress.style.width = `${scrollPercent}%`;

    if (scrollTop > 50) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }
  });


  // --- 5. NAVEGACIÓN ACTIVA EN SCROLL ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');

  function highlightNavigation() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  
  window.addEventListener('scroll', highlightNavigation);


  // --- 6. ANIMACIONES AL HACER SCROLL (INTERSECTION OBSERVER) ---
  const animateElements = document.querySelectorAll('.animate-on-scroll, .timeline-item');

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appear');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animateElements.forEach(element => {
    scrollObserver.observe(element);
  });


  // --- 7. PESTAÑAS CON DESLIZAMIENTO E INSTANT FEEDBACK ---
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      const targetPane = document.getElementById(targetTab);
      
      // Desactivar botones y remover clases activas/show
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => {
        p.classList.remove('active', 'show');
      });
      
      // Activar botón seleccionado
      btn.classList.add('active');
      
      // Activar panel
      targetPane.classList.add('active');
      
      // Forzar reflow para que el navegador registre la transición
      void targetPane.offsetHeight;
      
      // Agregar clase show para animar opacidad y transform
      targetPane.classList.add('show');
    });
  });


  // --- 8. VENTANA MODAL (POP-UP) PARA SERVICIOS ---
  const serviceCards = document.querySelectorAll('.service-card');
  const serviceModal = document.getElementById('serviceModal');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalCtaBtn = document.getElementById('modalCtaBtn');

  // Elementos de la modal
  const modalElements = {
    icon: document.querySelector('#modalIcon i'),
    tag: document.getElementById('modalTag'),
    title: document.getElementById('modalTitle'),
    desc: document.getElementById('modalDesc'),
    scope: document.getElementById('modalScope'),
    benefits: document.getElementById('modalBenefits')
  };

  function openServiceModal(card) {
    const template = card.querySelector('.modal-data');
    if (!template) return;

    const content = template.content;
    const iconClass = card.querySelector('.service-icon i').className;

    // Poblar modal
    modalElements.icon.className = iconClass;
    modalElements.tag.innerText = content.querySelector('.tag').innerText;
    modalElements.title.innerText = content.querySelector('.title').innerText;
    modalElements.desc.innerText = content.querySelector('.desc').innerText;
    modalElements.scope.innerHTML = content.querySelector('.scope').innerHTML;
    modalElements.benefits.innerText = content.querySelector('.benefits').innerText;

    // Mostrar modal
    serviceModal.classList.add('open');
    serviceModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeServiceModal() {
    serviceModal.classList.remove('open');
    serviceModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
  }

  serviceCards.forEach(card => {
    const btn = card.querySelector('.btn-toggle-service');
    btn.addEventListener('click', () => openServiceModal(card));
  });

  modalCloseBtn.addEventListener('click', closeServiceModal);
  modalOverlay.addEventListener('click', closeServiceModal);
  
  // Cerrar al hacer clic en el botón de solicitar presupuesto
  modalCtaBtn.addEventListener('click', closeServiceModal);

  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && serviceModal.classList.contains('open')) {
      closeServiceModal();
    }
  });


  // --- 9. VALIDACIÓN DE FORMULARIO DE CONTACTO ---
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const formError = document.getElementById('formError');

  const inputs = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    service: document.getElementById('service'),
    message: document.getElementById('message')
  };

  function validateField(field, condition) {
    const group = field.closest('.form-group');
    if (condition) {
      group.classList.remove('invalid');
      group.classList.add('valid');
      return true;
    } else {
      group.classList.remove('valid');
      group.classList.add('invalid');
      return false;
    }
  }

  inputs.name.addEventListener('blur', () => {
    const val = inputs.name.value.trim();
    validateField(inputs.name, val.length >= 3 && !/\d/.test(val));
  });

  inputs.email.addEventListener('blur', () => {
    const val = inputs.email.value.trim();
    validateField(inputs.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val));
  });

  inputs.phone.addEventListener('blur', () => {
    const val = inputs.phone.value.trim();
    if (val === '') {
      inputs.phone.closest('.form-group').classList.remove('invalid', 'valid');
      return;
    }
    validateField(inputs.phone, /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(val));
  });

  inputs.service.addEventListener('change', () => {
    validateField(inputs.service, inputs.service.value !== '');
  });

  inputs.message.addEventListener('blur', () => {
    const val = inputs.message.value.trim();
    validateField(inputs.message, val.length >= 15);
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nameVal = inputs.name.value.trim();
    const isNameOk = validateField(inputs.name, nameVal.length >= 3 && !/\d/.test(nameVal));

    const emailVal = inputs.email.value.trim();
    const isEmailOk = validateField(inputs.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal));

    const phoneVal = inputs.phone.value.trim();
    let isPhoneOk = true;
    if (phoneVal !== '') {
      isPhoneOk = validateField(inputs.phone, /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(phoneVal));
    }

    const isServiceOk = validateField(inputs.service, inputs.service.value !== '');

    const messageVal = inputs.message.value.trim();
    const isMessageOk = validateField(inputs.message, messageVal.length >= 15);

    if (isNameOk && isEmailOk && isPhoneOk && isServiceOk && isMessageOk) {
      formError.style.display = 'none';
      formSuccess.style.display = 'flex';
      
      const submitBtn = document.getElementById('submitBtn');
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Enviando... <i class="fa-solid fa-circle-notch fa-spin"></i>';
      
      setTimeout(() => {
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Enviar Consulta <i class="fa-solid fa-paper-plane"></i>';
        
        Object.values(inputs).forEach(input => {
          input.closest('.form-group').classList.remove('valid', 'invalid');
        });
        
        setTimeout(() => {
          formSuccess.style.display = 'none';
        }, 5000);
      }, 2000);
      
    } else {
      formSuccess.style.display = 'none';
      formError.style.display = 'flex';
      
      const firstInvalid = contactForm.querySelector('.form-group.invalid input, .form-group.invalid textarea, .form-group.invalid select');
      if (firstInvalid) firstInvalid.focus();
    }
  });

});
