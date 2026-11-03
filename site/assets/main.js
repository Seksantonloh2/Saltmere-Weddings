/* Saltmere Weddings — interactions */
(function () {
  const doc = document.documentElement;
  doc.classList.add('js');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Buttons: duplicate label for the slide-up hover, thin line arrow */
  document.querySelectorAll('.btn').forEach((btn) => {
    if (btn.querySelector('.btn__label')) return;
    const text = btn.textContent.trim();
    btn.innerHTML = `<span class="btn__label" data-text="${text}"><span>${text}</span></span>`;
  });

  /* Slide-in titles: split into words, stagger 70ms */
  const wordEls = document.querySelectorAll('[data-words]');
  wordEls.forEach((el) => {
    let i = Number(el.dataset.delay || 0);
    const walk = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const w = document.createElement('span');
            w.className = 'w';
            w.textContent = part;
            w.style.transitionDelay = `${i * 70}ms`;
            i++;
            frag.appendChild(w);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1) {
          walk(child);
        }
      });
    };
    walk(el);
  });

  /* Page enter */
  const main = document.querySelector('main');
  if (main && !reduced) main.classList.add('page-enter');

  const showOnLoad = () => {
    document.querySelectorAll('[data-words], [data-slide]').forEach((el) => {
      if (el.closest('.reveal-on-scroll')) return;
      const d = Number(el.dataset.slideDelay || 0);
      setTimeout(() => el.classList.add('is-in'), d);
    });
  };
  requestAnimationFrame(() => requestAnimationFrame(showOnLoad));

  /* Scroll reveals (staggered within a group) */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const group = el.parentElement ? [...el.parentElement.children].filter((c) => c.classList.contains('reveal') || c.classList.contains('reveal-img')) : [];
      const idx = Math.max(0, group.indexOf(el));
      setTimeout(() => {
        el.classList.add('is-in');
        el.querySelectorAll('[data-words]').forEach((b) => b.classList.add('is-in'));
      }, reduced ? 0 : idx * 90);
      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
  document.querySelectorAll('.reveal, .reveal-img, .reveal-on-scroll').forEach((el) => io.observe(el));

  /* Count-up numbers */
  const fmt = (n, dec) => n.toLocaleString('en-AU', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      countIO.unobserve(el);
      const target = parseFloat(el.dataset.count);
      const dec = (el.dataset.count.split('.')[1] || '').length;
      const out = el.querySelector('.n');
      if (reduced) { out.textContent = fmt(target, dec); return; }
      const dur = 1600;
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        const e = 1 - Math.pow(1 - p, 3);
        out.textContent = fmt(target * e, dec);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach((el) => countIO.observe(el));

  /* Header border on scroll */
  const header = document.querySelector('.site-header');
  const onScroll = () => header && header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Mobile menu */
  const toggle = document.querySelector('.menu-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = doc.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  /* Hide fixed mobile CTA where a date-check CTA or the form is already on screen */
  const mobileCta = document.querySelector('.mobile-cta');
  const ctaTargets = document.querySelectorAll('.hero, .cta-band, .site-footer, #enquiry-form');
  if (mobileCta && ctaTargets.length) {
    const visible = new Set();
    const ctaIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      mobileCta.classList.toggle('is-hidden', visible.size > 0);
    });
    ctaTargets.forEach((t) => ctaIO.observe(t));
  }

  /* Page transitions: slide out on internal page links only */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    if ((a.getAttribute('href') || '').startsWith('#')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.hash) return; // in-page: smooth scroll only
    if (url.href === location.href) { e.preventDefault(); return; }
    if (reduced) return;
    e.preventDefault();
    doc.classList.add('is-leaving');
    setTimeout(() => { location.href = url.href; }, 420);
  });
  window.addEventListener('pageshow', (e) => { if (e.persisted) doc.classList.remove('is-leaving', 'menu-open'); });

  /* ---------- Real weddings: filters + story dialog ---------- */
  const IMG = (id, w = 1400) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;
  const WEDDINGS = {
    'hannah-josh': {
      names: 'Hannah & Josh', setting: 'Winery, Scenic Rim', month: 'April', guests: 120, pkg: 'Full planning',
      story: 'Hannah and Josh were living in Sydney when they got engaged, so we became their eyes and ears in the Scenic Rim for six months. We shortlisted three wineries over video calls, then hosted a single tasting weekend so they could lock in the venue, caterer and florist in one trip. On the day, 120 guests sat down to one long table among the vines just as the light turned gold.',
      photos: ['1779475504439-d5be4554ccf6', '1596287452759-7c86e9afc617', '1598284443743-a2ff1915f9e3', '1561593367-66c79c2294e6', '1738025276055-8f61f591074e', '1759054710581-c7745b02cb53', '1676027647672-1230463791a9', '1729607666981-2f69de7d2715'],
      credits: { Photographer: 'Wren & Field Photography', Florist: 'The Long Stem Co.', Venue: 'Ridgeline Estate, Scenic Rim' },
    },
    'mia-lachlan': {
      names: 'Mia & Lachlan', setting: 'Garden, Brisbane', month: 'September', guests: 80, pkg: 'Styling & design',
      story: 'Mia and Lachlan wanted their reception to feel like a backyard party at a friend’s place, only a little more beautiful. Sophie built the look around native wildflowers, washed linen and a lot of candlelight, sourcing mismatched vases from local op shops. We set up from 7am and packed down by midnight, so the couple never had to think about a single chair.',
      photos: ['1583939003579-730e3918a45a', '1641835598222-b8059c5f8e2b', '1563292749-0e070ca58b29', '1767050292710-8e5da59ec5d8', '1775126964899-ae7b573d77e9', '1764593821339-6be7cb85e7f6', '1647296020397-8ef9f36afe99', '1780291366648-19a8a3e6a2ff'],
      credits: { Photographer: 'Saltbush Studio', Florist: 'Wild Paddock Flowers', Venue: 'Private garden, Brisbane' },
    },
    'aisha-ben': {
      names: 'Aisha & Ben', setting: 'Hinterland lookout, Gold Coast', month: 'June', guests: 12, pkg: 'Elopement',
      story: 'Aisha and Ben wanted to say their vows at sunrise with only their parents there. We found a lookout with easy parking for Ben’s grandmother, booked a celebrant who was happy with a 6am start and had a picnic breakfast waiting under the trees. They were back home with coffee by ten, married and completely unrushed.',
      photos: ['1604017011826-d3b4c23f8914', '1532712938310-34cb3982ef74', '1608326670856-e3b41eecb106', '1769540209342-34d08f98a3b4', '1550713450-94c9b4fc9f25', '1502955422409-06e43fd3eff3'],
      credits: { Photographer: 'First Light Weddings', Florist: 'The Long Stem Co.', Venue: 'Hinterland lookout, Gold Coast' },
    },
    'chloe-sam': {
      names: 'Chloe & Sam', setting: 'Historic hall, Brisbane', month: 'November', guests: 140, pkg: 'On-the-day coordination',
      story: 'Chloe and Sam had planned everything themselves and brought us in six weeks out to run the day. When a storm rolled in an hour before the ceremony, Jade put the written wet-weather plan into action and moved 140 guests inside in under 20 minutes. Most of them only found out there had been a plan B at the reception.',
      photos: ['1524824267900-2fa9cbf7a506', '1723832348140-a2d9eb1753b1', '1665607438186-7755c7f4dd30', '1676734628558-624737d3e094', '1527529482837-4698179dc6ce', '1620315118895-4f3ed831d14d', '1439539698758-ba2680ecadb9', '1763429338698-439aa108e7fb'],
      credits: { Photographer: 'Wren & Field Photography', Florist: 'Petal & Pine', Venue: 'Heritage hall, Brisbane' },
    },
    'priya-tom': {
      names: 'Priya & Tom', setting: 'Beach, Gold Coast', month: 'March', guests: 90, pkg: 'Partial planning',
      story: 'Priya and Tom had the venue and photographer booked, then realised there were forty more decisions waiting. We took over three months out, sorted the beach permit, the hire and a surf club long lunch, and wrote a run sheet that worked around the tide. The ceremony started barefoot on the sand at exactly 3:30pm.',
      photos: ['1600270237614-d20aef1c8b14', '1629744418692-345355518e78', '1769540209420-f137f98194e8', '1659616363297-7b981cb854ab', '1700304096367-dae5ae5e5401', '1606490194859-07c18c9f0968', '1635341108990-9201f2f48625'],
      credits: { Photographer: 'Saltbush Studio', Florist: 'Petal & Pine', Venue: 'Beachfront & surf club, Gold Coast' },
    },
    'grace-oliver': {
      names: 'Grace & Oliver', setting: 'Garden, Scenic Rim', month: 'October', guests: 60, pkg: 'Full planning',
      story: 'Grace and Oliver both work long hours in hospitals, so they asked us to handle everything and send them one email a week. We built the plan in their shared portal, toured venues on their behalf and narrowed every decision to two good options. Their garden ceremony ran to the minute and the only thing they planned on the day was the first dance.',
      photos: ['1758810411905-04fb6f9396e1', '1759954644836-a57275881ded', '1469371670807-013ccf25f16a', '1529636798458-92182e662485', '1674965381554-955d6a573354', '1774660811515-9a23d15a8bee', '1529636600939-9edeb1f9719f'],
      credits: { Photographer: 'First Light Weddings', Florist: 'Wild Paddock Flowers', Venue: 'Garden estate, Scenic Rim' },
    },
  };

  const dialog = document.getElementById('story');
  if (dialog) {
    const body = dialog.querySelector('.story__inner');
    const open = (key) => {
      const w = WEDDINGS[key];
      if (!w) return;
      body.innerHTML = `
        <header class="story__head">
          <p class="eyebrow">${w.setting} · ${w.month}</p>
          <h2 class="title-sec" id="story-title">${w.names}</h2>
          <div class="wcard__facts"><span>${w.guests} guests</span><span>${w.pkg}</span></div>
          <p class="story__text">${w.story}</p>
        </header>
        <div class="story__photos rem-${(w.photos.length - 2) % 3}">${w.photos.map((id, i) => `<img src="${IMG(id, i < 2 ? 1400 : 900)}" alt="${w.names}’s wedding, photo ${i + 1} of ${w.photos.length}" loading="lazy">`).join('')}</div>
        <footer class="story__foot">
          <dl class="credits">${Object.entries(w.credits).map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>
          <a class="btn" href="/enquire/">Plan yours with us</a>
        </footer>`;
      const btn = body.querySelector('.btn');
      btn.innerHTML = `<span class="btn__label" data-text="Plan yours with us"><span>Plan yours with us</span></span>`;
      dialog.showModal();
      dialog.scrollTop = 0;
      if (location.hash !== `#${key}`) history.replaceState(null, '', `#${key}`);
    };
    document.querySelectorAll('[data-story]').forEach((el) => el.addEventListener('click', () => open(el.dataset.story)));
    dialog.querySelector('.story__close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => history.replaceState(null, '', location.pathname + location.search));
    const fromHash = location.hash.slice(1);
    if (WEDDINGS[fromHash]) open(fromHash);
  }

  const chips = document.querySelectorAll('.chip');
  const wgrid = document.querySelector('.wgrid');
  chips.forEach((chip) => chip.addEventListener('click', () => {
    const f = chip.dataset.filter;
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    wgrid.classList.toggle('is-filtered', f !== 'all');
    wgrid.querySelectorAll('.wcard').forEach((card) => {
      const show = f === 'all' || card.dataset.tags.split(' ').includes(f);
      card.hidden = !show;
      if (show && !reduced) {
        card.classList.remove('is-in');
        requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add('is-in')));
      }
    });
  }));

  /* ---------- Enquiry form ---------- */
  const form = document.getElementById('enquiry-form');
  if (form) {
    const pkg = new URLSearchParams(location.search).get('package');
    if (pkg && form.package.querySelector(`option[value="${pkg}"]`)) form.package.value = pkg;

    const date = form.date;
    const notSet = form['date-not-set'];
    const today = new Date();
    date.min = today.toISOString().slice(0, 10);
    notSet.addEventListener('change', () => {
      date.disabled = notSet.checked;
      if (notSet.checked) { date.value = ''; date.closest('.field').classList.remove('has-error'); }
    });

    const rules = {
      names: (v) => v.trim().length > 1 || 'Please tell us both your names.',
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Please enter a valid email address.',
      phone: (v) => v.replace(/\D/g, '').length >= 8 || 'Please enter a phone number we can call.',
      date: (v) => notSet.checked || !!v || 'Pick your date, or tick “Not set yet”.',
      area: (v) => !!v || 'Please choose an area.',
      guests: (v) => !!v || 'Please choose a guest count.',
    };
    const check = (name) => {
      const input = form[name];
      const res = rules[name](input.value);
      const field = input.closest('.field');
      field.classList.toggle('has-error', res !== true);
      field.querySelector('.field__error').textContent = res === true ? '' : res;
      input.setAttribute('aria-invalid', String(res !== true));
      return res === true;
    };
    Object.keys(rules).forEach((name) => {
      form[name].addEventListener('blur', () => { if (form[name].value) check(name); });
      form[name].addEventListener('change', () => check(name));
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const ok = Object.keys(rules).map(check).every(Boolean);
      if (!ok) {
        const first = form.querySelector('.has-error .input');
        if (first) first.focus();
        return;
      }
      const wrap = form.closest('.form-wrap');
      wrap.classList.add('is-sent');
      wrap.querySelector('.form-success').focus();
    });
  }
})();
