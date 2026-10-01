/* Service-area map on the home page (Leaflet + OpenStreetMap tiles). */
(function () {
  'use strict';
  var el = document.getElementById('service-map');
  if (!el || typeof window.L === 'undefined') { return; }
  var L = window.L;

  var isTouch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

  var map = L.map(el, {
    scrollWheelZoom: false,     // never hijack page scrolling
    dragging: !isTouch,         // on phones, one finger scrolls the page; use the + / - buttons to zoom
    tap: false,
    zoomControl: true,
    attributionControl: false   // credit is shown as text under the map instead
  });

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  /* Approximate service area: Sacramento, the San Joaquin Delta, and the Bay Area. */
  var area = L.polygon([
    [38.78, -121.58], [38.74, -121.22], [38.30, -121.12], [37.88, -121.08],
    [37.62, -121.38], [37.22, -121.72], [37.28, -122.24], [37.62, -122.52],
    [37.86, -122.56], [38.08, -122.66], [38.32, -122.46], [38.36, -122.02],
    [38.56, -121.86]
  ], {
    color: '#0b2545',
    weight: 2,
    dashArray: '6 6',
    fillColor: '#1f4b7f',
    fillOpacity: 0.12
  }).addTo(map);

  var pin = function (label, side) {
    return L.divIcon({
      className: 'map-pin' + (side === 'left' ? ' map-pin--left' : ''),
      html: '<span class="map-pin__dot"></span><span class="map-pin__label">' + label + '</span>',
      iconSize: [0, 0],
      iconAnchor: [7, 7]
    });
  };
  var home = L.divIcon({
    className: 'map-pin map-pin--home',
    html: '<span class="map-pin__dot"></span><span class="map-pin__label"><span class="map-pin__long">Stockton &middot; </span>Home port</span>',
    iconSize: [0, 0],
    iconAnchor: [9, 9]
  });

  var places = [
    { at: [37.9577, -121.2908], icon: home, text: '<strong>Stockton</strong><br>Home port of Fireboat Sea Wolf at J&amp;H Marine, and the organization\'s principal office.' },
    { at: [38.5816, -121.4944], icon: pin('Sacramento'), text: '<strong>Sacramento</strong><br>Sacramento River corridor.' },
    { at: [38.1558, -121.6913], icon: pin('Rio Vista'), text: '<strong>Rio Vista</strong><br>Sacramento River in the heart of the Delta.' },
    { at: [38.0049, -121.8058], icon: pin('Antioch'), text: '<strong>Antioch</strong><br>Western Delta and the San Joaquin River.' },
    { at: [37.7955, -122.2750], icon: pin('Oakland'), text: '<strong>Oakland</strong><br>Oakland Estuary, Sea Wolf\'s former home.' },
    { at: [37.8270, -122.4230], icon: pin('San Francisco Bay', 'left'), text: '<strong>San Francisco Bay</strong><br>Bay Area waterways.' }
  ];
  places.forEach(function (p) {
    L.marker(p.at, { icon: p.icon, keyboard: true, title: p.text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() })
      .addTo(map)
      .bindPopup(p.text);
  });

  map.fitBounds(area.getBounds(), { padding: [8, 8] });

  /* Leaflet measures its container on init; re-measure once the section has its final size. */
  window.addEventListener('load', function () { map.invalidateSize(); });
  if ('ResizeObserver' in window) {
    var t;
    new ResizeObserver(function () { clearTimeout(t); t = setTimeout(function () { map.invalidateSize(); }, 120); }).observe(el);
  }
})();
