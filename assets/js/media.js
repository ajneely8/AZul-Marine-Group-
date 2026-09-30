/* Media gallery: renders AMG_MEDIA (see media-data.js) into the page,
   with an accessible lightbox for YouTube, Vimeo, local video, and photos. */
(function () {
  'use strict';
  var data = window.AMG_MEDIA;
  var videoGrid = document.getElementById('video-grid');
  var photoGrid = document.getElementById('photo-grid');
  if (!data) { return; }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function ytId(src) {
    var m = String(src).match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/);
    return m ? m[1] : String(src).trim();
  }
  function vimeoId(src) {
    var m = String(src).match(/vimeo\.com\/(?:video\/)?(\d+)/);
    return m ? m[1] : String(src).trim();
  }
  function posterFor(v) {
    if (v.poster) { return v.poster; }
    if (v.type === 'youtube') { return 'https://img.youtube.com/vi/' + ytId(v.src) + '/hqdefault.jpg'; }
    return '';
  }

  var placeholderSvg = '<svg class="placeholder__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="5" width="18" height="14"/><path d="m10 9 5 3-5 3z"/></svg>';

  /* ---------- Videos ---------- */
  if (videoGrid && data.videos) {
    videoGrid.innerHTML = data.videos.map(function (v, i) {
      var ready = v.type && v.src;
      if (!ready) {
        return '<article class="vcard vcard--soon">' +
          '<div class="vcard__thumb" aria-hidden="true"><div class="placeholder">' +
          '<div>' + placeholderSvg + '<span class="placeholder__label">Video Coming Soon</span><p>This space is reserved for video the organization will provide.</p></div>' +
          '</div></div>' +
          '<div class="vcard__body"><span class="vcard__date">' + esc(v.date || 'Date to be confirmed') + '</span>' +
          '<h3>' + esc(v.title) + '</h3><p>' + esc(v.description) + '</p></div></article>';
      }
      var poster = posterFor(v);
      var thumb = poster
        ? '<img src="' + esc(poster) + '" alt="" loading="lazy">'
        : '<div class="placeholder" style="aspect-ratio:16/9;border:0"><div><span class="placeholder__label">No thumbnail</span></div></div>';
      return '<article class="vcard">' +
        '<button class="vcard__thumb" type="button" data-video="' + i + '" aria-label="Play video: ' + esc(v.title) + '">' + thumb +
        '<span class="vcard__play" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></span></button>' +
        '<div class="vcard__body"><span class="vcard__date">' + esc(v.date || '') + (v.event ? ' &middot; ' + esc(v.event) : '') + '</span>' +
        '<h3>' + esc(v.title) + '</h3><p>' + esc(v.description) + '</p></div></article>';
    }).join('');
  }

  /* ---------- Photos ---------- */
  if (photoGrid && data.photos) {
    photoGrid.innerHTML = data.photos.map(function (p, i) {
      var pic = p.webp
        ? '<picture><source srcset="' + esc(p.webp) + '" type="image/webp"><img src="' + esc(p.src) + '" alt="' + esc(p.alt) + '" loading="lazy"></picture>'
        : '<img src="' + esc(p.src) + '" alt="' + esc(p.alt) + '" loading="lazy">';
      return '<figure class="figure"><button type="button" data-photo="' + i + '" aria-label="View larger: ' + esc(p.alt) + '">' + pic + '</button>' +
        '<figcaption>' + esc(p.caption) + '</figcaption></figure>';
    }).join('');
  }

  /* ---------- Lightbox ---------- */
  var lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-labelledby', 'lightbox-title');
  lb.innerHTML = '<button class="lightbox__close" type="button" aria-label="Close">&times;</button>' +
    '<div class="lightbox__dialog"><div class="lightbox__stage" id="lightbox-stage"></div>' +
    '<div class="lightbox__meta"><div><h2 id="lightbox-title"></h2><p id="lightbox-desc"></p></div></div></div>';
  document.body.appendChild(lb);
  var stage = lb.querySelector('#lightbox-stage');
  var title = lb.querySelector('#lightbox-title');
  var desc = lb.querySelector('#lightbox-desc');
  var closeBtn = lb.querySelector('.lightbox__close');
  var lastFocus = null;

  function open(html, t, d, isPhoto) {
    lastFocus = document.activeElement;
    stage.innerHTML = html;
    stage.classList.toggle('lightbox__stage--photo', !!isPhoto);
    title.textContent = t || '';
    desc.textContent = d || '';
    lb.classList.add('is-open');
    document.body.classList.add('lightbox-open');
    closeBtn.focus();
  }
  function close() {
    lb.classList.remove('is-open');
    document.body.classList.remove('lightbox-open');
    stage.innerHTML = '';
    if (lastFocus && lastFocus.focus) { lastFocus.focus(); }
  }
  closeBtn.addEventListener('click', close);
  lb.addEventListener('click', function (e) { if (e.target === lb) { close(); } });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && lb.classList.contains('is-open')) { close(); } });

  document.addEventListener('click', function (e) {
    var vb = e.target.closest('[data-video]');
    var pb = e.target.closest('[data-photo]');
    if (vb) {
      var v = data.videos[+vb.getAttribute('data-video')];
      var html = '';
      if (v.type === 'youtube') {
        html = '<iframe src="https://www.youtube-nocookie.com/embed/' + esc(ytId(v.src)) + '?autoplay=1&rel=0" title="' + esc(v.title) + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
      } else if (v.type === 'vimeo') {
        html = '<iframe src="https://player.vimeo.com/video/' + esc(vimeoId(v.src)) + '?autoplay=1" title="' + esc(v.title) + '" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>';
      } else if (v.type === 'file') {
        html = '<video controls autoplay playsinline' + (v.poster ? ' poster="' + esc(v.poster) + '"' : '') + '><source src="' + esc(v.src) + '" type="video/mp4">Your browser does not support embedded video.</video>';
      }
      open(html, v.title, [v.date, v.event, v.description].filter(Boolean).join(' · '), false);
    } else if (pb) {
      var p = data.photos[+pb.getAttribute('data-photo')];
      open('<img src="' + esc(p.src) + '" alt="' + esc(p.alt) + '">', 'Photo', p.caption, true);
    }
  });

  /* ---------- Tabs (videos / photos) ---------- */
  var tabs = document.querySelectorAll('.media-tabs [role="tab"]');
  if (tabs.length) {
    Array.prototype.forEach.call(tabs, function (tab) {
      tab.addEventListener('click', function () {
        Array.prototype.forEach.call(tabs, function (t) {
          var on = t === tab;
          t.setAttribute('aria-selected', on ? 'true' : 'false');
          var panel = document.getElementById(t.getAttribute('aria-controls'));
          if (panel) { panel.hidden = !on; }
        });
      });
    });
  }
})();
