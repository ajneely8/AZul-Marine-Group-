/* Azul Marine Group: site behaviour. No dependencies. */
(function () {
  'use strict';
  var doc = document;
  var root = doc.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     Logo entrance. Plays once per browser session, is skippable, and
     is removed entirely for visitors who prefer reduced motion.
     ------------------------------------------------------------------ */
  var intro = doc.getElementById('intro');

  function endIntro() {
    if (!intro) { root.classList.remove('intro-pending'); return; }
    if (intro.classList.contains('is-done')) { return; }
    intro.classList.add('is-done');
    startReveal();
    root.classList.remove('intro-pending');
    window.setTimeout(function () { if (intro.parentNode) { intro.parentNode.removeChild(intro); } }, 600);
  }

  if (intro) {
    if (reduceMotion || !root.classList.contains('intro-pending')) {
      intro.parentNode.removeChild(intro);
      intro = null;
      root.classList.remove('intro-pending');
    } else {
      try { window.sessionStorage.setItem('amg-intro', '1'); } catch (e) { /* ignore */ }
      var path = doc.querySelector('#amg-logo path');
      if (path && path.getTotalLength) {
        try {
          var len = Math.ceil(path.getTotalLength());
          path.style.setProperty('--len', String(len));
        } catch (e) { /* keep CSS fallback */ }
      }
      window.setTimeout(endIntro, 1500);
      window.setTimeout(startReveal, 1400);
      intro.addEventListener('click', endIntro);
      doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') { endIntro(); } }, { once: true });
    }
  } else {
    root.classList.remove('intro-pending');
  }

  /* ------------------------------------------------------------------
     Header logo: replays the logo animation as a loading screen, then
     goes to the home page. Skipped for reduced-motion visitors.
     ------------------------------------------------------------------ */
  var homeLinks = doc.querySelectorAll('.site-header .brand, .primary-nav__list a[href="index.html"]');
  Array.prototype.forEach.call(homeLinks, function (brand) {
    if (reduceMotion) { return; }
    brand.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) { return; }
      if (doc.getElementById('intro') || doc.querySelector('.intro--loading')) { return; }
      e.preventDefault();
      var target = brand.getAttribute('href') || 'index.html';
      var openToggle = doc.querySelector('.menu-toggle[aria-expanded="true"]');
      if (openToggle) { openToggle.click(); }
      var onHome = /(^|\/)(index\.html)?$/.test(window.location.pathname) && !window.location.search;

      var overlay = doc.createElement('div');
      overlay.className = 'intro intro--loading';
      overlay.setAttribute('role', 'status');
      overlay.setAttribute('aria-label', 'Loading');
      overlay.innerHTML =
        '<div class="intro__inner">' +
        '<svg class="intro__logo" viewBox="0 0 720 722" aria-hidden="true" focusable="false"><use class="intro__path" href="#amg-logo"/></svg>' +
        '<p class="intro__name"><span>Azul Marine Group</span><span class="intro__sub">Discovery Bay, California</span></p>' +
        '</div>';
      doc.body.appendChild(overlay);
      doc.body.classList.add('nav-open');
      var symbolPath = doc.querySelector('#amg-logo path');
      if (symbolPath && symbolPath.getTotalLength) {
        try { symbolPath.style.setProperty('--len', String(Math.ceil(symbolPath.getTotalLength()))); } catch (err) { /* fallback */ }
      }
      try { window.sessionStorage.setItem('amg-intro', '1'); } catch (err) { /* ignore */ }

      window.setTimeout(function () {
        if (onHome) {
          window.scrollTo(0, 0);
          overlay.classList.add('is-done');
          doc.body.classList.remove('nav-open');
          window.setTimeout(function () { if (overlay.parentNode) { overlay.parentNode.removeChild(overlay); } }, 600);
        } else {
          window.location.href = target;
        }
      }, 1400);
    });
  });

  /* ------------------------------------------------------------------
     Scroll reveal. Blocks fade and rise slightly as they enter the
     viewport. Applied by script so pages without JavaScript show
     everything immediately. Disabled for reduced-motion visitors.
     ------------------------------------------------------------------ */
  var revealStarted = false;
  function startReveal() {
    if (revealStarted) { return; }
    revealStarted = true;
    if (reduceMotion || !('IntersectionObserver' in window)) { return; }
    var selector = [
      '.hero__content', '.hero__media', '.facts__list li', '.section__head', '.mission > *', '.serve', '.pcard',
      '.figure', '.vcard', '.involve__item', '.news-item', '.program__body', '.program__media', '.panel',
      '.activity__list li', '.activity__note', '.contact-block', '.form', '.record-wrap', '.notice',
      '.prose > h2', '.prose > p', '.prose > ul', '.cta-band__inner > *', '.video-grid > *', '.photo-grid > *'
    ].join(',');
    var main = doc.getElementById('main');
    if (!main) { return; }
    var els = main.querySelectorAll(selector);
    var groups = new Map();
    Array.prototype.forEach.call(els, function (el) {
      if (el.closest('.reveal') && el.closest('.reveal') !== el) { return; } /* no nested reveals */
      var rect = el.getBoundingClientRect();
      if (rect.bottom < 0) { return; } /* already scrolled past */
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
    /* dynamically rendered galleries */
    var mo = new MutationObserver(function () {
      Array.prototype.forEach.call(main.querySelectorAll('.video-grid > *:not(.reveal), .photo-grid > *:not(.reveal)'), function (el, i) {
        el.classList.add('reveal');
        el.style.transitionDelay = Math.min(i % 3, 5) * 90 + 'ms';
        io.observe(el);
      });
    });
    mo.observe(main, { childList: true, subtree: true });
  }
  if (!doc.getElementById('intro')) { startReveal(); }

  /* ------------------------------------------------------------------
     Hero background video. Loads only on wide screens, without
     reduced-motion or data-saver, and only if the file exists.
     ------------------------------------------------------------------ */
  var heroVideo = doc.querySelector('.hero__video');
  if (heroVideo) {
    var heroToggle = doc.querySelector('.hero__toggle');
    var conn = navigator.connection || {};
    var allowVideo = !reduceMotion && !conn.saveData && window.innerWidth >= 768 &&
      (heroVideo.getAttribute('data-src-mp4') || heroVideo.getAttribute('data-src-webm'));
    if (!allowVideo) {
      heroVideo.parentNode.removeChild(heroVideo);
    } else {
      var addSource = function (src, type) {
        if (!src) { return null; }
        var s = doc.createElement('source');
        s.src = src; s.type = type;
        heroVideo.appendChild(s);
        return s;
      };
      var videoFailed = function () {
        if (heroVideo.parentNode) { heroVideo.parentNode.removeChild(heroVideo); }
        if (heroToggle) { heroToggle.hidden = true; }
      };
      heroVideo.addEventListener('error', videoFailed);
      heroVideo.addEventListener('playing', function () {
        heroVideo.classList.add('is-playing');
        if (heroToggle) { heroToggle.hidden = false; }
      });
      var setVideoLabel = function (paused) {
        if (!heroToggle) { return; }
        heroToggle.setAttribute('aria-pressed', paused ? 'true' : 'false');
        heroToggle.querySelector('.hero__toggle-label').textContent = paused ? 'Play video' : 'Pause video';
      };
      if (heroToggle) {
        heroToggle.addEventListener('click', function () {
          if (heroVideo.paused) { heroVideo.play(); setVideoLabel(false); }
          else { heroVideo.pause(); setVideoLabel(true); }
        });
      }
      doc.addEventListener('visibilitychange', function () {
        if (doc.hidden) { heroVideo.pause(); }
        else if (heroToggle && heroToggle.getAttribute('aria-pressed') !== 'true') { heroVideo.play().catch(function () {}); }
      });
      /* One quiet check that a file exists before asking the browser to load media */
      var probe = heroVideo.getAttribute('data-src-mp4') || heroVideo.getAttribute('data-src-webm');
      fetch(probe, { method: 'HEAD' }).then(function (r) {
        if (!r.ok) { videoFailed(); return; }
        addSource(heroVideo.getAttribute('data-src-webm'), 'video/webm');
        var lastSource = addSource(heroVideo.getAttribute('data-src-mp4'), 'video/mp4') || heroVideo.lastElementChild;
        if (lastSource) { lastSource.addEventListener('error', videoFailed); }
        heroVideo.preload = 'auto';
        heroVideo.load();
        var playPromise = heroVideo.play();
        if (playPromise && playPromise.catch) { playPromise.catch(function () { /* autoplay blocked: poster stays */ }); }
      }).catch(videoFailed);
    }
  }

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
     Contact / volunteer forms.
     Works with a Web3Forms access key (data-access-key on the form).
     Without a key, it falls back to opening the visitor's mail app.
     ------------------------------------------------------------------ */
  var forms = doc.querySelectorAll('form[data-form]');
  Array.prototype.forEach.call(forms, function (form) {
    var status = form.querySelector('.form__status');
    var key = form.getAttribute('data-access-key') || '';
    var to = form.getAttribute('data-to') || '';

    var show = function (msg, isError) {
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
        show('Your email app should open with the message ready to send. If it did not, email ' + to + ' directly.');
        return;
      }

      data.append('access_key', key);
      var btn = form.querySelector('[type="submit"]');
      if (btn) { btn.disabled = true; }
      fetch('https://api.web3forms.com/submit', { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res && res.success) { form.reset(); show('Thank you. Your message has been sent. We will respond as soon as we can.'); }
          else { show('The message could not be sent. Please email ' + to + ' directly.', true); }
        })
        .catch(function () { show('The message could not be sent. Please email ' + to + ' directly.', true); })
        .then(function () { if (btn) { btn.disabled = false; } });
    });
  });
})();
