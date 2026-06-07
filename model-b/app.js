// model-b/app.js - Lógica Interactiva para Modelo de Paneles Deslizantes
document.addEventListener('DOMContentLoaded', () => {

  const panels = document.querySelectorAll('.panel-section');
  const sidebarButtons = document.querySelectorAll('.sidebar-nav-btn');
  const mobileButtons = document.querySelectorAll('.mobile-nav-btn');
  const allNavTriggers = document.querySelectorAll('[data-target]');
  
  let currentPanelIndex = 0;
  let isTransitioning = false;

  // --- 1. GESTIÓN DE NAVEGACIÓN ENTRE PANELES ---
  function changePanel(targetIndex) {
    if (targetIndex === currentPanelIndex || isTransitioning) return;
    if (targetIndex < 0 || targetIndex >= panels.length) return;

    isTransitioning = true;
    const currentPanel = panels[currentPanelIndex];
    const targetPanel = panels[targetIndex];

    // Detallar clases para transiciones fluidas de slide
    if (targetIndex > currentPanelIndex) {
      // Avanzar (el actual sube, el nuevo entra desde abajo)
      currentPanel.className = 'panel-section prev';
      targetPanel.className = 'panel-section next'; // Reset posición inicial
      setTimeout(() => {
        targetPanel.className = 'panel-section active';
      }, 50);
    } else {
      // Retroceder (el actual baja, el nuevo entra desde arriba)
      currentPanel.className = 'panel-section next';
      targetPanel.className = 'panel-section prev'; // Reset posición inicial
      setTimeout(() => {
        targetPanel.className = 'panel-section active';
      }, 50);
    }

    // Actualizar botones de navegación activos
    updateNavButtons(targetIndex);

    // Reiniciar scroll del panel al que ingresamos
    const scrollContainer = targetPanel.querySelector('.panel-content-scroll');
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
    }

    currentPanelIndex = targetIndex;

    // Disparar animación de contadores si entramos al Inicio (index 0)
    if (currentPanelIndex === 0) {
      startCounterAnimation();
    }

    // Quitar flag de transición tras finalizar animación CSS
    setTimeout(() => {
      isTransitioning = false;
    }, 600);
  }

  function updateNavButtons(activeIndex) {
    // Desktop Nav
    sidebarButtons.forEach(btn => {
      const target = parseInt(btn.getAttribute('data-target'));
      btn.classList.toggle('active', target === activeIndex);
    });

    // Mobile Nav
    mobileButtons.forEach(btn => {
      const target = parseInt(btn.getAttribute('data-target'));
      btn.classList.toggle('active', target === activeIndex);
    });
  }

  // Asignar eventos a todos los botones con [data-target]
  allNavTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const target = parseInt(trigger.getAttribute('data-target'));
      changePanel(target);
    });
  });


  // --- 2. CONTADORES DE ESTADÍSTICAS ---
  let countersAnimated = false;

  function startCounterAnimation() {
    const counterElements = document.querySelectorAll('.metric-num');
    
    counterElements.forEach(element => {
      const targetVal = parseInt(element.getAttribute('data-count'));
      let currentVal = 0;
      const duration = 1200; // ms
      const stepTime = Math.max(Math.floor(duration / targetVal), 10);
      
      element.innerText = '0';
      
      const timer = setInterval(() => {
        currentVal += Math.ceil(targetVal / (duration / stepTime));
        if (currentVal >= targetVal) {
          element.innerText = targetVal;
          clearInterval(timer);
        } else {
          element.innerText = currentVal;
        }
      }, stepTime);
    });
  }

  // Animación inicial en carga
  setTimeout(() => {
    startCounterAnimation();
  }, 300);


  // --- 3. ACCORDIÓN DE SERVICIOS ---
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    
    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Cerrar todos los demás accordions
      accordionItems.forEach(acc => {
        acc.classList.remove('active');
      });

      // Abrir el clickeado si estaba cerrado
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });


  // --- 4. SOPORTE DE GESTOS TÁCTILES (SWIPE HASTA EL SIGUIENTE PANEL) ---
  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartY = 0;
  let touchEndY = 0;

  const panelsContainer = document.getElementById('panelsContainer');

  panelsContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  panelsContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipeGesture();
  }, { passive: true });

  function handleSwipeGesture() {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    // Solo cambiar de panel si el gesto es mayormente horizontal y supera el umbral
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 80) {
      if (diffX < 0) {
        // Swipe izquierda -> Siguiente panel
        changePanel(currentPanelIndex + 1);
      } else {
        // Swipe derecha -> Panel anterior
        changePanel(currentPanelIndex - 1);
      }
    }
  }


  // --- 5. VALIDACIÓN DEL FORMULARIO DE CONTACTO (GLASSMOPHIC) ---
  const pForm = document.getElementById('panelContactForm');
  const pSuccess = document.getElementById('pSuccess');
  const pError = document.getElementById('pError');

  const pInputs = {
    name: document.getElementById('pName'),
    email: document.getElementById('pEmail'),
    service: document.getElementById('pService'),
    message: document.getElementById('pMessage')
  };

  function validatePanelField(field, condition) {
    const group = field.closest('.form-group-glass');
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

  pInputs.name.addEventListener('blur', () => {
    const val = pInputs.name.value.trim();
    validatePanelField(pInputs.name, val.length >= 3 && !/\d/.test(val));
  });

  pInputs.email.addEventListener('blur', () => {
    const val = pInputs.email.value.trim();
    validatePanelField(pInputs.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val));
  });

  pInputs.service.addEventListener('change', () => {
    validatePanelField(pInputs.service, pInputs.service.value !== '');
  });

  pInputs.message.addEventListener('blur', () => {
    const val = pInputs.message.value.trim();
    validatePanelField(pInputs.message, val.length >= 15);
  });

  pForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameVal = pInputs.name.value.trim();
    const isNameOk = validatePanelField(pInputs.name, nameVal.length >= 3 && !/\d/.test(nameVal));

    const emailVal = pInputs.email.value.trim();
    const isEmailOk = validatePanelField(pInputs.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal));

    const isServiceOk = validatePanelField(pInputs.service, pInputs.service.value !== '');

    const messageVal = pInputs.message.value.trim();
    const isMessageOk = validatePanelField(pInputs.message, messageVal.length >= 15);

    if (isNameOk && isEmailOk && isServiceOk && isMessageOk) {
      pError.style.display = 'none';
      pSuccess.style.display = 'flex';

      const btn = pForm.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.innerHTML = 'Enviando... <i class="fa-solid fa-circle-notch fa-spin"></i>';

      setTimeout(() => {
        pForm.reset();
        btn.disabled = false;
        btn.innerHTML = 'Enviar Mensaje <i class="fa-solid fa-paper-plane"></i>';

        Object.values(pInputs).forEach(input => {
          input.closest('.form-group-glass').classList.remove('valid', 'invalid');
        });

        setTimeout(() => {
          pSuccess.style.display = 'none';
        }, 5000);
      }, 2000);

    } else {
      pSuccess.style.display = 'none';
      pError.style.display = 'flex';

      const firstInvalid = pForm.querySelector('.form-group-glass.invalid input, .form-group-glass.invalid textarea, .form-group-glass.invalid select');
      if (firstInvalid) firstInvalid.focus();
    }
  });

});
