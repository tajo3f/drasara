(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const menuBtn = document.querySelector('.menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.textContent = open ? '×' : '☰';
      document.body.classList.toggle('menu-open', open);
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuBtn.setAttribute('aria-expanded','false');
      menuBtn.textContent = '☰';
      document.body.classList.remove('menu-open');
    }));
  }

  const revealEls = [...document.querySelectorAll('[data-reveal]')];
  if (!reduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = Number(entry.target.dataset.delay || 0);
          setTimeout(() => entry.target.classList.add('is-visible'), delay);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  const progress = document.querySelector('.scroll-progress span');
  const backTop = document.querySelector('.back-top');
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
    if (backTop) backTop.classList.toggle('show', scrollY > 700);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  backTop?.addEventListener('click', () => scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }));

  document.querySelectorAll('.faq-button').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  const lb = document.querySelector('.lightbox');
  if (lb) {
    const img = lb.querySelector('img');
    const close = () => { lb.classList.remove('open'); img.src = ''; document.body.style.overflow = ''; };
    document.querySelectorAll('[data-lightbox]').forEach(el => el.addEventListener('click', e => {
      e.preventDefault();
      img.src = el.getAttribute('href');
      img.alt = el.querySelector('img')?.alt || '';
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    }));
    lb.querySelector('button')?.addEventListener('click', close);
    lb.addEventListener('click', e => { if (e.target === lb) close(); });
    addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  const form = document.querySelector('#contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const data = new FormData(form);
      const msg = [
        'Olá! Vim pelo site da Dra. Sara e gostaria de solicitar uma avaliação.',
        '',
        `Nome: ${data.get('nome') || ''}`,
        `WhatsApp: ${data.get('whatsapp') || ''}`,
        `Assunto: ${data.get('assunto') || 'Avaliação'}`,
        '',
        `Mensagem: ${data.get('mensagem') || ''}`
      ].join('\n');
      window.open(`https://wa.me/5527996350848?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    });
  }
})();
