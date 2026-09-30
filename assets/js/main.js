/* Azul Marine Group: site behaviour. No dependencies. */
(function () {
  'use strict';
  var doc = document;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     Header: compact after scrolling
     ------------------------------------------------------------------ */
  var header = doc.getElementById('site-header');
  if (header) {
    var compact = false;
    var onScroll = function () {
      var y = window.scrollY || doc.documentElement.scrollTop;
      if (y > 80 && !compact) { compact = true; header.classList.add('is-compact'); }
      else if (y < 24 && compact) { compact = false; header.classList.remove('is-compact'); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ------------------------------------------------------------------
     Mobile navigation
     ------------------------------------------------------------------ */
  var toggle = doc.querySelector('.menu-toggle');
  var nav = doc.getElementById('primary-nav');
  if (toggle && nav) {
    var backdrop = doc.createElement('div');
    backdrop.className = 'nav-backdrop';
    doc.body.appendChild(backdrop);

    var setOpen = function (open) {
      if (open && header) { nav.style.top = Math.max(0, header.getBoundingClientRect().bottom) + 'px'; }
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      nav.classList.toggle('is-open', open);
      doc.body.classList.toggle('nav-open', open);
      toggle.querySelector('.menu-toggle__label').textContent = open ? 'Close' : 'Menu';
      if (open) {
        var first = nav.querySelector('a');
        if (first) { first.focus(); }
      }
    };
    toggle.addEventListener('click', function () { setOpen(toggle.getAttribute('aria-expanded') !== 'true'); });
    backdrop.addEventListener('click', function () { setOpen(false); });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); toggle.focus(); }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 940 && nav.classList.contains('is-open')) { setOpen(false); }
    });
  }

  /* ------------------------------------------------------------------
     Home slideshow (photo + solid headline card). Auto-advances,
     pauses on hover, focus, and hidden tab; respects reduced motion.
     ------------------------------------------------------------------ */
  var show = doc.querySelector('[data-slideshow]');
  if (show) {
    var slides = show.querySelectorAll('.slide');
    var dots = show.querySelectorAll('.slideshow__dot');
    var prev = show.querySelector('.slideshow__prev');
    var next = show.querySelector('.slideshow__next');
    var current = 0;
    var timer = null;
    var interval = parseInt(show.getAttribute('data-interval'), 10) || 7000;

    var go = function (n, focusDot) {
      current = (n + slides.length) % slides.length;
      Array.prototype.forEach.call(slides, function (s, i) {
        var on = i === current;
        s.classList.toggle('is-active', on);
        s.setAttribute('aria-hidden', on ? 'false' : 'true');
        Array.prototype.forEach.call(s.querySelectorAll('a, button'), function (el) { el.tabIndex = on ? 0 : -1; });
      });
      Array.prototype.forEach.call(dots, function (d, i) {
        d.setAttribute('aria-current', i === current ? 'true' : 'false');
        if (focusDot && i === current) { d.focus(); }
      });
    };
    var stop = function () { if (timer) { window.clearInterval(timer); timer = null; } };
    var start = function () {
      if (reduceMotion || slides.length < 2 || timer) { return; }
      timer = window.setInterval(function () { go(current + 1); }, interval);
    };
    var restart = function () { stop(); start(); };

    Array.prototype.forEach.call(dots, function (d, i) {
      d.addEventListener('click', function () { go(i); restart(); });
    });
    if (prev) { prev.addEventListener('click', function () { go(current - 1); restart(); }); }
    if (next) { next.addEventListener('click', function () { go(current + 1); restart(); }); }
    show.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { go(current - 1, true); restart(); }
      if (e.key === 'ArrowRight') { go(current + 1, true); restart(); }
    });
    show.addEventListener('mouseenter', stop);
    show.addEventListener('mouseleave', start);
    show.addEventListener('focusin', stop);
    show.addEventListener('focusout', start);
    doc.addEventListener('visibilitychange', function () { if (doc.hidden) { stop(); } else { start(); } });

    go(0);
    start();
  }

  /* ------------------------------------------------------------------
     Scroll reveal. Applied by script so pages without JavaScript show
     everything immediately. Disabled for reduced-motion visitors.
     ------------------------------------------------------------------ */
  (function startReveal() {
    if (reduceMotion || !('IntersectionObserver' in window)) { return; }
    var selector = [
      '.tile', '.section__head', '.band__media', '.band__body', '.news-card', '.serve', '.pcard', '.figure', '.vcard',
      '.involve__item', '.news-item', '.program__body', '.program__media', '.panel', '.contact-block', '.form',
      '.notice', '.leader', '.prose > h2', '.prose > p', '.prose > ul', '.cta-band__inner > *', '.video-grid > *', '.photo-grid > *',
      '.give-option'
    ].join(',');
    var main = doc.getElementById('main');
    if (!main) { return; }
    var els = main.querySelectorAll(selector);
    var groups = new Map();
    Array.prototype.forEach.call(els, function (el) {
      if (el.closest('.reveal') && el.closest('.reveal') !== el) { return; }
      if (el.closest('.slideshow')) { return; }
      var rect = el.getBoundingClientRect();
      if (rect.bottom < 0) { return; }
      var parent = el.parentNode;
      var n = groups.get(parent) || 0;
      groups.set(parent, n + 1);
      el.classList.add('reveal');
      el.style.transitionDelay = Math.min(n, 5) * 90 + 'ms';
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    Array.prototype.forEach.call(main.querySelectorAll('.reveal'), function (el) { io.observe(el); });
    var mo = new MutationObserver(function () {
      Array.prototype.forEach.call(main.querySelectorAll('.video-grid > *:not(.reveal), .photo-grid > *:not(.reveal)'), function (el, i) {
        el.classList.add('reveal');
        el.style.transitionDelay = Math.min(i % 3, 5) * 90 + 'ms';
        io.observe(el);
      });
    });
    mo.observe(main, { childList: true, subtree: true });
  })();

  /* ------------------------------------------------------------------
     Contact / volunteer forms.
     Works with a Web3Forms access key (data-access-key on the form).
     Without a key, it falls back to opening the visitor's mail app.
     ------------------------------------------------------------------ */
  var forms = doc.querySelectorAll('form[data-form]');
  Array.prototype.forEach.call(forms, function (form) {
    var status = form.querySelector('.form__status');
    var key = form.getAttribute('data-access-key') || '';
    var to = form.getAttribute('data-to') || '';

    var showStatus = function (msg, isError) {
      if (!status) { return; }
      status.textContent = msg;
      status.classList.add('is-visible');
      status.classList.toggle('is-error', !!isError);
      status.setAttribute('role', isError ? 'alert' : 'status');
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var data = new FormData(form);
      if (data.get('botcheck')) { return; }

      if (!key) {
        var subject = form.getAttribute('data-subject') || 'Website message';
        var lines = [];
        data.forEach(function (v, k) {
          if (k === 'botcheck' || k === 'access_key') { return; }
          lines.push(k.replace(/_/g, ' ') + ': ' + v);
        });
        window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
        showStatus('Your email app should open with the message ready to send. If it did not, email ' + to + ' directly.');
        return;
      }

      data.append('access_key', key);
      var btn = form.querySelector('[type="submit"]');
      if (btn) { btn.disabled = true; }
      fetch('https://api.web3forms.com/submit', { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res && res.success) { form.reset(); showStatus('Thank you. Your message has been sent. We will respond as soon as we can.'); }
          else { showStatus('The message could not be sent. Please email ' + to + ' directly.', true); }
        })
        .catch(function () { showStatus('The message could not be sent. Please email ' + to + ' directly.', true); })
        .then(function () { if (btn) { btn.disabled = false; } });
    });
  });
})();
