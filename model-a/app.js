// model-a/app.js - Lógica Interactiva para Modelo Scroll Continuo
document.addEventListener('DOMContentLoaded', () => {

  // --- 1. MENÚ MÓVIL Y COLLAPSE ---
  const menuToggle = document.getElementById('menuToggle');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileOverlay.classList.toggle('open');
    // Prevenir scroll en el body cuando el menú está abierto
    document.body.style.overflow = mobileOverlay.classList.contains('open') ? 'hidden' : 'auto';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      mobileOverlay.classList.remove('open');
      document.body.style.overflow = 'auto';
    });
  });


  // --- 2. HEADER SCROLL Y BARRA DE PROGRESO ---
  const mainHeader = document.getElementById('mainHeader');
  const scrollProgress = document.getElementById('scrollProgress');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    // Ancho de la barra de progreso
    scrollProgress.style.width = `${scrollPercent}%`;

    // Compactar cabecera al hacer scroll
    if (scrollTop > 50) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }
  });


  // --- 3. NAVEGACIÓN ACTIVA SEGÚN SECCIÓN (SCROLL) ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');

  function highlightNavigation() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120; // Compensación de cabecera
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


  // --- 4. ANIMACIONES AL HACER SCROLL (INTERSECTION OBSERVER) ---
  const animateElements = document.querySelectorAll('.animate-on-scroll');

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appear');
        observer.unobserve(entry.target); // Dejar de observar una vez que aparece
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  animateElements.forEach(element => {
    scrollObserver.observe(element);
  });


  // --- 5. PESTAÑAS DE MISIÓN, VISIÓN Y VALORES ---
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      
      // Quitar clases activas
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));
      
      // Activar correspondiente
      btn.classList.add('active');
      document.getElementById(targetTab).classList.add('active');
    });
  });


  // --- 6. EXPANDIR DETALLE DE SERVICIOS ---
  const serviceCards = document.querySelectorAll('.service-card');
  
  serviceCards.forEach(card => {
    const toggleBtn = card.querySelector('.btn-toggle-service');
    
    toggleBtn.addEventListener('click', () => {
      const isExpanded = card.classList.contains('expanded');
      
      // Cerrar otros servicios abiertos para mantener orden
      serviceCards.forEach(c => {
        if (c !== card) {
          c.classList.remove('expanded');
          const btn = c.querySelector('.btn-toggle-service');
          btn.innerHTML = 'Ampliar Detalles <i class="fa-solid fa-chevron-down"></i>';
        }
      });

      if (isExpanded) {
        card.classList.remove('expanded');
        toggleBtn.innerHTML = 'Ampliar Detalles <i class="fa-solid fa-chevron-down"></i>';
      } else {
        card.classList.add('expanded');
        toggleBtn.innerHTML = 'Colapsar Detalles <i class="fa-solid fa-chevron-up"></i>';
      }
    });
  });


  // --- 7. VALIDACIÓN DE FORMULARIO DE CONTACTO ---
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const formError = document.getElementById('formError');

  // Elementos de entrada
  const inputs = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    service: document.getElementById('service'),
    message: document.getElementById('message')
  };

  // Validaciones individuales
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

  // Comportamiento al perder el foco (blur)
  inputs.name.addEventListener('blur', () => {
    const val = inputs.name.value.trim();
    const isOk = val.length >= 3 && !/\d/.test(val);
    validateField(inputs.name, isOk);
  });

  inputs.email.addEventListener('blur', () => {
    const val = inputs.email.value.trim();
    const isOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    validateField(inputs.email, isOk);
  });

  inputs.phone.addEventListener('blur', () => {
    const val = inputs.phone.value.trim();
    // Opcional, pero si tiene algo debe tener un formato válido
    if (val === '') {
      inputs.phone.closest('.form-group').classList.remove('invalid', 'valid');
      return;
    }
    const isOk = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(val);
    validateField(inputs.phone, isOk);
  });

  inputs.service.addEventListener('change', () => {
    validateField(inputs.service, inputs.service.value !== '');
  });

  inputs.message.addEventListener('blur', () => {
    const val = inputs.message.value.trim();
    validateField(inputs.message, val.length >= 15);
  });

  // Envío del Formulario
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Forzar validación en todos los campos antes de enviar
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
      // Éxito
      formError.style.display = 'none';
      formSuccess.style.display = 'flex';
      
      // Cambiar botón a estado cargando temporalmente
      const submitBtn = document.getElementById('submitBtn');
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Enviando... <i class="fa-solid fa-circle-notch fa-spin"></i>';
      
      setTimeout(() => {
        // Limpiar formulario
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Enviar Consulta <i class="fa-solid fa-paper-plane"></i>';
        
        // Quitar clases valid
        Object.values(inputs).forEach(input => {
          input.closest('.form-group').classList.remove('valid', 'invalid');
        });
        
        // Ocultar mensaje de éxito tras unos segundos
        setTimeout(() => {
          formSuccess.style.display = 'none';
        }, 5000);
      }, 2000);
      
    } else {
      // Error
      formSuccess.style.display = 'none';
      formError.style.display = 'flex';
      
      // Enfocar el primer campo inválido
      const firstInvalid = contactForm.querySelector('.form-group.invalid input, .form-group.invalid textarea, .form-group.invalid select');
      if (firstInvalid) firstInvalid.focus();
    }
  });

});
