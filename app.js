(() => {
  'use strict';
  const content=window.SITE_CONTENT;
  const list=document.getElementById('service-list');
  const price=new Intl.NumberFormat('ru-RU');
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
  const observer='IntersectionObserver' in window ? new IntersectionObserver(entries=>{
    for(const entry of entries) if(entry.isIntersecting){entry.target.classList.add('is-revealed');observer.unobserve(entry.target);}
  },{threshold:.08,rootMargin:'0px 0px -15px 0px'}):null;
  const reveal=(element,index=0)=>{if(!observer||reduce.matches)return;element.classList.add('reveal');element.style.setProperty('--delay',`${Math.min(index,3)*75}ms`);observer.observe(element);};
  const node=(tag,className,text)=>{const e=document.createElement(tag);if(className)e.className=className;if(text)e.textContent=text;return e;};
  const icon=(name)=>{const s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('aria-hidden','true');const u=document.createElementNS(s.namespaceURI,'use');u.setAttribute('href','#i-'+name);s.append(u);return s;};
  let group='general',kind='wellness';
  const categories={wellness:['Общий оздоровительный массаж тела','4 программы · от 1 до 2,5 часов'],relax:['Общий расслабляющий массаж тела','4 программы · от 1 до 2,5 часов'],local:['Массаж отдельных зон','7 программ · от 20 до 50 минут'],complex:['Комплексы массажа','4 программы · 1 час']};
  function detailsBlock(parent,title,paragraphs){if(!paragraphs.length)return;parent.append(node('h5','',title));for(const p of paragraphs)parent.append(node('p','',p));}
  function sourceBlocks(parent,title,blocks){if(!blocks.length)return;parent.append(node('h5','',title));for(const b of blocks)parent.append(node('p',b.tag==='h3'?'detail-subheading':'',b.text));}
  function render(){
    if(observer)for(const card of list.children)observer.unobserve(card);
    list.replaceChildren();
    const category=group==='general'?kind:group;
    document.getElementById('category-title').textContent=categories[category][0];
    document.getElementById('category-note').textContent=categories[category][1];
    document.getElementById('body-tabs').hidden=group!=='general';
    document.querySelectorAll('[data-group]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.group===group)));
    document.querySelectorAll('[data-kind]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.kind===kind)));
    content.services.filter(s=>s.category===category).forEach((s,i)=>{
      const card=node('article','service-card');card.dataset.program=s.program;
      const meta=node('div','service-meta'),time=node('span','service-time');time.append(icon('clock'),document.createTextNode(s.duration));meta.append(time,node('span','service-index',String(i+1).padStart(2,'0')));
      const type=node('p','service-type',s.type),name=node('h4','',`«${s.program}»`),intro=node('p','service-intro',s.intro);
      const bottom=node('div','service-bottom'),cost=node('span','service-price',price.format(s.price)+' ₽'),book=node('a','service-book','Записаться');book.href=content.links.booking;book.setAttribute('aria-label',`Записаться на программу «${s.program}», ${price.format(s.price)} рублей`);book.append(icon('up'));bottom.append(cost,book);
      const details=node('details','service-details'),summary=node('summary','','Описание программы'),body=node('div','service-detail-content');
      sourceBlocks(body,'Что входит в сеанс',s.coverageBlocks);
      sourceBlocks(body,'О программе',s.descriptionBlocks.filter(b=>b.text!==s.intro));
      detailsBlock(body,'Как проходит сеанс',s.session);
      details.append(summary,body);card.append(meta,type,name,intro,bottom,details);list.append(card);reveal(card,i%2);
    });
  }
  document.querySelectorAll('[data-group]').forEach(b=>b.addEventListener('click',()=>{group=b.dataset.group;render();}));
  document.querySelectorAll('[data-kind]').forEach(b=>b.addEventListener('click',()=>{kind=b.dataset.kind;render();}));
  document.querySelectorAll('[data-category]').forEach(a=>a.addEventListener('click',()=>{group=a.dataset.category;render();}));
  document.querySelectorAll('[data-link="booking"]').forEach(a=>a.href=content.links.booking);
  render();
  const contacts=document.getElementById('messenger-options');
  for(const c of content.contacts){if(!c.url)continue;const a=node('a','messenger');a.href=c.url;const image=node('img');image.src=c.logo;image.alt='';image.width=37;image.height=37;a.append(image,node('span','',c.label),icon('up'));contacts.append(a);}
  const menu=document.querySelector('.menu-toggle'),menuPanel=document.getElementById('mobile-menu');
  function closeMenu(){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Открыть меню');menuPanel.hidden=true;}
  menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');menuPanel.hidden=!open;});
  menuPanel.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!menuPanel.hidden){closeMenu();menu.focus();}});
  const dialog=document.getElementById('photo-dialog');let lastPhoto;
  document.querySelectorAll('[data-photo]').forEach(button=>button.addEventListener('click',()=>{lastPhoto=button;const image=document.getElementById('dialog-image');image.src=button.dataset.photo;image.alt=button.dataset.caption;document.getElementById('dialog-caption').textContent=button.dataset.caption;dialog.showModal();document.body.classList.add('has-dialog');}));
  dialog.querySelector('button').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
  dialog.addEventListener('close',()=>{document.body.classList.remove('has-dialog');lastPhoto?.focus({preventScroll:true});});
  document.querySelectorAll('.section-head,.category-card,.catalog-top,.gallery figure,.comfort-grid article,.address-data,.first-visit,.route-gallery figure,.reviews-card,.review-copy,.booking-copy,.booking-options').forEach((e,i)=>reveal(e,i%3));
  const progress=document.querySelector('.reading-progress');let pending=false;
  function update(){const height=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${height>0?Math.min(1,Math.max(0,scrollY/height)):0})`;pending=false;}
  addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(update);}},{passive:true});addEventListener('resize',update);update();
  if('IntersectionObserver' in window){const navObserver=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){const id=e.target.id==='catalog'?'services':e.target.id;document.querySelectorAll('.bottom-nav a').forEach(a=>{const active=a.getAttribute('href')==='#'+id;a.classList.toggle('is-active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}},{rootMargin:'-20% 0px -65% 0px'});document.querySelectorAll('#services,#catalog,#cabinet,#address,#booking').forEach(e=>navObserver.observe(e));}
})();
