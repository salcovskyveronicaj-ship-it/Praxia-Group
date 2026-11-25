document.addEventListener('DOMContentLoaded', () => {
  /* ------------------------------------------------------------------------
     1. Menú móvil
     ------------------------------------------------------------------------ */
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ------------------------------------------------------------------------
     2. Síntomas ("¿Te pasa alguna de estas cosas?") -> scroll + highlight + preselect
     ------------------------------------------------------------------------ */
  const problemaSelect = document.getElementById('problema');
  let highlightTimer = null;

  function preselectProblem(value) {
    if (!problemaSelect || !value) return;
    const optionExists = Array.from(problemaSelect.options).some(
      (opt) => opt.value === value
    );
    if (optionExists) {
      problemaSelect.value = value;
    }
  }

  document.querySelectorAll('.symptom-card').forEach((card) => {
    card.addEventListener('click', () => {
      const targetId = card.dataset.target;
      const problemVal = card.dataset.problem;

      preselectProblem(problemVal);

      if (targetId) {
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          document
            .querySelectorAll('.solution-card.is-highlighted')
            .forEach((el) => el.classList.remove('is-highlighted'));

          targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          targetEl.classList.add('is-highlighted');

          clearTimeout(highlightTimer);
          highlightTimer = setTimeout(() => {
            targetEl.classList.remove('is-highlighted');
          }, 2600);
        }
      }
    });
  });

  document.querySelectorAll('.solution-link[data-preselect]').forEach((link) => {
    link.addEventListener('click', () => {
      preselectProblem(link.dataset.preselect);
    });
  });

  /* ------------------------------------------------------------------------
     3. Preguntas frecuentes (Acordeón)
     ------------------------------------------------------------------------ */
  document.querySelectorAll('.faq-question').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('is-open');

      // Cerrar los demás para mantener el foco limpio
      document.querySelectorAll('.faq-item.is-open').forEach((openItem) => {
        if (openItem !== item) {
          openItem.classList.remove('is-open');
          const openBtn = openItem.querySelector('.faq-question');
          if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('is-open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* ------------------------------------------------------------------------
     4. Modales (Casos de éxito y Política de privacidad)
     ------------------------------------------------------------------------ */
  const CASES_DATA = {
    'caso-1': {
      tag: 'Industria · Producción',
      title: 'Industrialización y escalado de capacidad productiva',
      metric: '400 → 1.800 unidades por mes',
      situation:
        'La planta trabajaba con cuellos de botella constantes, planificación reactiva y falta de estándares entre turnos, lo que frenaba el crecimiento comercial.',
      actions: [
        'Mapeo completo del flujo productivo y balanceo de puestos críticos.',
        'Implementación de planificación semanal con indicadores visibles en planta.',
        'Estandarización de procesos clave y capacitación de encargados para sostener el ritmo.',
      ],
    },
    'caso-2': {
      tag: 'Stock y Depósito',
      title: 'Orden de depósito y reducción de compras de urgencia',
      metric: '-35% de faltantes críticos',
      situation:
        'Existía capital inmovilizado en materiales de baja rotación mientras faltaban insumos clave para entregar pedidos a tiempo.',
      actions: [
        'Clasificación ABC de artículos y reordenamiento físico con ubicaciones claras.',
        'Definición de stocks mínimos, puntos de pedido y alertas automáticas.',
        'Rutina semanal de control entre compras, depósito y producción.',
      ],
    },
    'caso-3': {
      tag: 'Obras y Ampliaciones',
      title: 'Control técnico y económico de ampliación industrial',
      metric: '100% obras con informe semanal',
      situation:
        'El dueño no tenía tiempo para seguir el día a día de contratistas y proveedores, con riesgo alto de desvíos de plazo y sobrecostos.',
      actions: [
        'Representación técnica en obra frente a contratistas y proveedores.',
        'Control semanal de cronograma, certificados de avance y desvíos.',
        'Entrega de informe ejecutivo semanal con registro fotográfico hasta la puesta en marcha.',
      ],
    },
  };

  const caseModal = document.getElementById('case-modal');
  const privacyModal = document.getElementById('privacy-modal');
  let lastFocusedEl = null;

  function openModal(modal) {
    if (!modal) return;
    lastFocusedEl = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal(modal) {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') {
      lastFocusedEl.focus();
    }
  }

  document.querySelectorAll('.case-btn[data-case]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const data = CASES_DATA[btn.dataset.case];
      if (!data || !caseModal) return;

      document.getElementById('case-modal-tag').textContent = data.tag;
      document.getElementById('case-modal-title').textContent = data.title;
      document.getElementById('case-modal-metric').textContent = data.metric;
      document.getElementById('case-modal-situation').textContent = data.situation;

      const actionsList = document.getElementById('case-modal-actions');
      actionsList.innerHTML = '';
      data.actions.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        actionsList.appendChild(li);
      });

      openModal(caseModal);
    });
  });

  const openPrivacyBtn = document.getElementById('open-privacy');
  if (openPrivacyBtn && privacyModal) {
    openPrivacyBtn.addEventListener('click', () => openModal(privacyModal));
  }

  document.querySelectorAll('[data-close-modal]').forEach((el) => {
    el.addEventListener('click', () => {
      const modal = el.closest('.modal');
      closeModal(modal);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(caseModal);
      closeModal(privacyModal);
    }
  });

  /* ------------------------------------------------------------------------
     5. Formulario de contacto (Netlify Forms + confirmación + enlace WhatsApp)
     ------------------------------------------------------------------------ */
  const mapeoForm = document.getElementById('mapeo-form');
  const formSuccess = document.getElementById('form-success');
  const successWaBtn = document.getElementById('success-wa-btn');

  if (mapeoForm && formSuccess) {
    mapeoForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(mapeoForm);
      const nombre = formData.get('nombre') || '';
      const empresa = formData.get('empresa') || '';
      const rubro = formData.get('rubro') || '';
      const problemaEl = document.getElementById('problema');
      const problemaTexto =
        problemaEl && problemaEl.selectedIndex > 0
          ? problemaEl.options[problemaEl.selectedIndex].text
          : '';

      // Envío compatible con Netlify Forms cuando está desplegado en HTTP/HTTPS
      if (window.location.protocol !== 'file:') {
        try {
          await fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(formData).toString(),
          });
        } catch (err) {
          // En preview local sin backend, continuamos mostrando la confirmación
        }
      }

      if (successWaBtn) {
        const msg = `Hola Praxia Group, soy ${nombre} de ${empresa} (${rubro}). Acabo de pedir el Mapeo Inicial por: ${problemaTexto}.`;
        successWaBtn.href = `https://wa.me/5491100000000?text=${encodeURIComponent(msg)}`;
      }

      mapeoForm.hidden = true;
      formSuccess.hidden = false;
    });
  }
});
