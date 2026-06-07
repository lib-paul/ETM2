// portal.js - Interactividad del Portal de Selección
document.addEventListener('DOMContentLoaded', () => {
  console.log('ETCONSULTORES Portal Inicializado.');
  
  // Agregar un retraso de salida fluido al hacer clic en las tarjetas
  const cards = document.querySelectorAll('.model-card');
  
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const targetUrl = card.getAttribute('href');
      
      // Aplicar animación de salida al contenedor principal
      const container = document.querySelector('.portal-container');
      container.style.transition = 'all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)';
      container.style.opacity = '0';
      container.style.transform = 'scale(0.95)';
      
      // Redirigir después de completar la animación
      setTimeout(() => {
        window.location.href = targetUrl;
      }, 450);
    });
  });
});
