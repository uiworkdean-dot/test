/**
 * Dutyfreeupgrade - Main JavaScript
 */

(function () {
  'use strict';

  /* Product Auto-Scroll */
  function initProductScroll() {
    var track = document.querySelector('.dfu-products__track');
    if (!track) return;

    var items = track.querySelectorAll('.dfu-product-item');
    if (items.length === 0) return;

    items.forEach(function (item) {
      var clone = item.cloneNode(true);
      track.appendChild(clone);
    });
  }

  /* FAQ Accordion */
  function initFaqCards() {
    var cards = document.querySelectorAll('.dfu-faq-card');
    cards.forEach(function (card) {
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-expanded', 'false');

      function toggleExpand() {
        var isExpanded = card.getAttribute('aria-expanded') === 'true';
        card.setAttribute('aria-expanded', String(!isExpanded));
        var answer = card.querySelector('.dfu-faq-card__answer');
        if (answer) {
          answer.style.webkitLineClamp = isExpanded ? '3' : 'unset';
          answer.style.overflow = isExpanded ? 'hidden' : 'visible';
        }
      }

      card.addEventListener('click', toggleExpand);
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleExpand();
        }
      });
    });
  }

  /* Scroll-Reveal Animation */
  function initScrollReveal() {
    var targets = document.querySelectorAll(
      '.dfu-benefit-card, .dfu-promo-card, .dfu-article-box, .dfu-location-card, .dfu-faq-card'
    );

    if (!targets.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('dfu-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
      );

      targets.forEach(function (el, i) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease ' + (i % 4) * 0.08 + 's, transform 0.5s ease ' + (i % 4) * 0.08 + 's';
        observer.observe(el);
      });
    } else {
      targets.forEach(function (el) {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }
  }

  document.addEventListener('animationend', function () { }, false);

  var styleEl = document.createElement('style');
  styleEl.textContent = '.dfu-visible { opacity: 1 !important; transform: translateY(0) !important; }';
  document.head.appendChild(styleEl);

  /* Product Links */
  function initProductLinks() {
    var items = document.querySelectorAll('.dfu-product-item');
    items.forEach(function (item) {
      if (item.tagName === 'A') {
        item.setAttribute('target', '_blank');
        item.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }

  /* Shared Modal */
  function initModals() {
    var triggers = document.querySelectorAll('[data-modal]');
    var activeModal = null;
    var lastFocusedElement = null;

    if (!triggers.length) return;

    function getFocusableElements(modal) {
      return Array.prototype.slice.call(
        modal.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
      );
    }

    function openModal(modalId, trigger) {
      var modal = document.getElementById(modalId);
      if (!modal) return;

      activeModal = modal;
      lastFocusedElement = trigger || document.activeElement;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('dfu-modal-open');

      var closeButton = modal.querySelector('.dfu-modal-close');
      if (closeButton) closeButton.focus();
    }

    function closeModal(modal) {
      if (!modal) return;

      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('dfu-modal-open');
      activeModal = null;

      if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
      }
    }

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function (event) {
        event.preventDefault();
        openModal(trigger.getAttribute('data-modal'), trigger);
      });
    });

    document.querySelectorAll('.dfu-modal').forEach(function (modal) {
      modal.querySelectorAll('[data-modal-close]').forEach(function (control) {
        control.addEventListener('click', function (event) {
          if (event.target === control || control.tagName === 'BUTTON') {
            closeModal(modal);
          }
        });
      });

      var card = modal.querySelector('.dfu-modal-card');
      if (card) {
        card.addEventListener('click', function (event) {
          event.stopPropagation();
        });
      }
    });

    document.addEventListener('keydown', function (event) {
      if (!activeModal) return;

      if (event.key === 'Escape') {
        closeModal(activeModal);
        return;
      }

      if (event.key === 'Tab') {
        var focusable = getFocusableElements(activeModal);
        if (!focusable.length) return;

        var first = focusable[0];
        var last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  }

  /* Init */
  function init() {
    initProductScroll();
    initFaqCards();
    initScrollReveal();
    initProductLinks();
    initModals();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* Sidenav + ToTop */
(function () {
  'use strict';

  var toggleBtn = document.getElementById('dfu-toggle-btn');
  var sidebar = document.getElementById('dfu-sidebar');

  function isMobile() { return window.innerWidth <= 768; }

  /* sidebar 與 btn 同步開合 */
  function setOpen(open) {
    if (open) {
      sidebar.classList.add('is-open');
      toggleBtn.classList.add('is-open');
    } else {
      sidebar.classList.remove('is-open');
      toggleBtn.classList.remove('is-open');
    }
    toggleBtn.setAttribute('aria-expanded', String(open));

    if (isMobile()) {
      toggleBtn.querySelector('span').textContent = open ? '收合導覽' : '展開導覽';
    } else {
      toggleBtn.querySelector('span').textContent = open ? '關閉導覽' : '開啟導覽';
    }
  }

  /* 初始化：手機版預設展開，桌機版預設收合 */
  function initState() {
    setOpen(isMobile());
  }

  if (toggleBtn && sidebar) {

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initState);
    } else {
      initState();
    }

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(initState, 150);
    }, { passive: true });

    toggleBtn.addEventListener('click', function () {
      setOpen(!sidebar.classList.contains('is-open'));
    });

    sidebar.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var target = document.getElementById(link.getAttribute('href').slice(1));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        if (!isMobile()) setOpen(false);
      });
    });

    document.addEventListener('click', function (e) {
      if (isMobile()) return;
      if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
        setOpen(false);
      }
    });
  }

  var toTopBtn = document.getElementById('dfu-BackTop');
  if (toTopBtn) {
    window.addEventListener('scroll', function () {
      toTopBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
    }, { passive: true });
    toTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();