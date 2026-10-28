(() => {
  'use strict';
  const config = window.SITE_CONTENT;
  const list = document.getElementById('service-list');
  const price = new Intl.NumberFormat('ru-RU');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    for (const entry of entries) if(entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  }, {threshold: 0.08, rootMargin: '0px 0px -20px 0px'}) : null;
  function reveal(element, index = 0) {
    if(!revealObserver || reducedMotion.matches) return;
    element.classList.add('reveal');
    element.style.setProperty('--reveal-delay', `${Math.min(index, 3) * 70}ms`);
    revealObserver.observe(element);
  }
  function renderServices(category) {
    if(revealObserver) for(const oldCard of list.children) revealObserver.unobserve(oldCard);
    list.replaceChildren();
    const selected = config.services.filter(service => service.category === category);
    document.getElementById('category-description').textContent = config.categories[category];
    for (const [index, service] of selected.entries()) {
      const card = document.createElement('article'); card.className = 'service-card';
      const meta = document.createElement('div'); meta.className = 'service-meta';
      const time = document.createElement('span'); time.textContent = service.duration;
      const number = document.createElement('span'); number.className = 'service-number'; number.textContent = String(index + 1).padStart(2, '0'); meta.append(time, number);
      const heading = document.createElement('h3'); heading.textContent = service.name;
      const subtitle = document.createElement('div'); subtitle.className = 'service-subtitle'; subtitle.textContent = service.subtitle || '';
      const scope = document.createElement('p'); scope.textContent = service.scope;
      const bottom = document.createElement('div'); bottom.className = 'service-bottom';
      const cost = document.createElement('span'); cost.className = 'service-price'; cost.textContent = price.format(service.price) + ' ₽';
      const book = document.createElement('a'); book.href = config.links.booking; book.textContent = 'Записаться ↗'; book.setAttribute('aria-label', `Записаться: ${service.name}, ${price.format(service.price)} рублей`);
      bottom.append(cost, book); card.append(meta, heading); if(service.subtitle) card.append(subtitle); card.append(scope, bottom); list.append(card); reveal(card, index);
    }
  }
  for (const button of document.querySelectorAll('[data-filter]')) {
    button.addEventListener('click', () => {
      for (const sibling of document.querySelectorAll('[data-filter]')) sibling.setAttribute('aria-pressed', String(sibling === button));
      renderServices(button.dataset.filter);
    });
  }
  renderServices('local');
  for (const element of document.querySelectorAll('[data-link="booking"]')) element.href = config.links.booking;
  const options = document.getElementById('messenger-options');
  for(const contact of config.contacts) {
    if(!contact.url) continue;
    const link = document.createElement('a'); link.className='book-option'; link.href=contact.url;
    const icon=document.createElement('span'); icon.className='option-icon'; icon.setAttribute('aria-hidden','true');
    const logo=document.createElement('img');logo.src=contact.logo;logo.alt='';logo.width=38;logo.height=38;icon.append(logo);
    const text=document.createElement('span'); const name=document.createElement('strong'); name.textContent=contact.label;
    const sub=document.createElement('small'); sub.textContent=contact.description; text.append(name,sub);
    const arrow=document.createElement('span'); arrow.textContent='↗'; arrow.setAttribute('aria-hidden','true'); link.append(icon,text,arrow); options.append(link);
  }
  const dialog = document.getElementById('photo-dialog');
  let lastPhotoButton;
  for(const button of document.querySelectorAll('[data-photo]')) button.addEventListener('click',()=>{
    lastPhotoButton=button; document.getElementById('dialog-image').src=button.dataset.photo; document.getElementById('dialog-image').alt=button.dataset.caption;
    document.getElementById('dialog-caption').textContent=button.dataset.caption;dialog.showModal();
  });
  dialog.querySelector('button').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog && (event.clientX<dialog.getBoundingClientRect().left || event.clientX>dialog.getBoundingClientRect().right || event.clientY<dialog.getBoundingClientRect().top || event.clientY>dialog.getBoundingClientRect().bottom)) dialog.close();});
  dialog.addEventListener('close',()=>lastPhotoButton?.focus());
  for(const element of document.querySelectorAll('.section-top, .photo-grid figure, .comfort-grid>div, .navigation-grid>*, .review-section>*, .booking-panel')) reveal(element);
  const progress = document.createElement('div'); progress.className='reading-progress'; progress.setAttribute('aria-hidden','true'); document.body.append(progress);
  let framePending = false;
  function updateScroll() {
    const height = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${height > 0 ? Math.min(1, Math.max(0, window.scrollY / height)) : 0})`;
    framePending = false;
  }
  window.addEventListener('scroll',()=>{if(!framePending){framePending=true;requestAnimationFrame(updateScroll);}}, {passive:true});
  window.addEventListener('resize',updateScroll);updateScroll();
})();
