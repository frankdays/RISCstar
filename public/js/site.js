/* Replaces the jQuery / Elementor front-end scripts from the WordPress site:
   mega menu, entrance animations, and contact forms (now Formspree). */
(function () {
  'use strict';

  /* ---------- Mega menu (Elementor n-menu) ---------- */
  var TABLET_MAX = 1024;
  document.querySelectorAll('.e-n-menu').forEach(function (nav) {
    var toggle = nav.querySelector('.e-n-menu-toggle');
    function layout() {
      nav.setAttribute('data-layout', window.innerWidth <= TABLET_MAX ? 'dropdown' : 'horizontal');
    }
    layout();
    window.addEventListener('resize', layout);
    if (toggle) toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
    });
    nav.querySelectorAll('.e-n-menu-item').forEach(function (item) {
      var btn = item.querySelector('.e-n-menu-dropdown-icon');
      var content = item.querySelector('.e-n-menu-content');
      if (!btn || !content) return;
      function set(open) {
        btn.setAttribute('aria-expanded', String(open));
        content.classList.toggle('e-active', open);
        var inner = content.querySelector(':scope > .e-con');
        if (inner) inner.classList.toggle('e-active', open);
        item.querySelector('.e-n-menu-title').classList.toggle('e-active', open);
      }
      item.addEventListener('mouseenter', function () { if (nav.getAttribute('data-layout') !== 'dropdown') set(true); });
      item.addEventListener('mouseleave', function () { if (nav.getAttribute('data-layout') !== 'dropdown') set(false); });
      btn.addEventListener('click', function (e) { e.preventDefault(); set(btn.getAttribute('aria-expanded') !== 'true'); });
    });
  });

  /* ---------- Background videos (Elementor "background_video_link") ---------- */
  document.querySelectorAll('[data-settings*="background_video_link"]').forEach(function (el) {
    var s; try { s = JSON.parse(el.getAttribute('data-settings')); } catch (e) { return; }
    var video = el.querySelector(':scope > .elementor-background-video-container video, :scope > .e-con-inner > .elementor-background-video-container video')
      || el.querySelector('.elementor-background-video-container video');
    if (!video || !s.background_video_link) return;
    var src = s.background_video_link.replace(/^https?:\/\/riscstar\.com/, '');
    if (s.background_video_start) src += '#t=' + s.background_video_start + (s.background_video_end ? ',' + s.background_video_end : '');
    video.src = src;
    video.muted = true;
    if (s.background_play_once === 'yes') video.loop = false;
    if (s.background_video_start && video.loop) {
      // restart from the configured start point instead of 0
      video.addEventListener('ended', function () { video.currentTime = Number(s.background_video_start); video.play(); });
      video.loop = false;
    }
    var p = video.play(); if (p && p.catch) p.catch(function () {});
  });

  /* ---------- Scroll-down arrow: fade out once the page scrolls ---------- */
  var arrow = document.getElementById('ep-arrow');
  if (arrow) {
    var onScroll = function () {
      if (window.scrollY > 0) {
        arrow.style.transition = 'opacity 1s'; arrow.style.opacity = '0';
        setTimeout(function () { arrow.style.display = 'none'; }, 1000);
        window.removeEventListener('scroll', onScroll);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Archive thumbnails: crop to the card ratio (Elementor "fitImages") ---------- */
  function fitThumbs() {
    document.querySelectorAll('.elementor-has-item-ratio .elementor-post__thumbnail').forEach(function (t) {
      var img = t.querySelector('img');
      if (!img || !img.naturalWidth) return;
      var boxRatio = t.offsetHeight / t.offsetWidth;
      var imgRatio = img.naturalHeight / img.naturalWidth;
      t.classList.toggle('elementor-fit-height', imgRatio < boxRatio);
    });
  }
  document.querySelectorAll('.elementor-has-item-ratio .elementor-post__thumbnail img').forEach(function (img) {
    if (!img.complete) img.addEventListener('load', fitThumbs);
  });
  fitThumbs();
  window.addEventListener('resize', fitThumbs);

  /* ---------- Stacked "case study" cards (aavatto-kit case-study widget) ---------- */
  var sticky = document.querySelector('.our-projects-sticky');
  if (sticky) {
    var inner = sticky.closest('.e-con-inner');
    var heading = inner && inner.querySelector(':scope > div:first-child');
    if (heading) { heading.style.position = 'sticky'; heading.style.top = '50px'; heading.style.transition = 'opacity 0.4s ease'; }
    var items = Array.prototype.slice.call(document.querySelectorAll('.our-project-item'));
    // content-box height, like jQuery's .height()
    var maxH = Math.max.apply(null, items.map(function (el) {
      var cs = getComputedStyle(el);
      return el.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    }));
    document.querySelectorAll('.our-projects-container').forEach(function (c) { c.style.paddingBottom = '0px'; });
    items.forEach(function (el, i) {
      el.style.top = (50 + i * 20) + 'px';
      el.style.minHeight = maxH + 'px';
      el.style.marginBottom = ((items.length - i) * 10) + 'px';
    });
    window.addEventListener('scroll', function () {
      items.forEach(function (el, i) {
        var top = el.getBoundingClientRect().top;
        if (top < 300 + i * 10) {
          items.forEach(function (el2, i2) { el2.style.transform = 'scale(' + Math.min(1, 1 - (i - i2 + 1) * 0.05) + ')'; });
        } else {
          items.forEach(function (el2, i2) { if (i2 >= i) el2.style.transform = 'scale(1)'; });
        }
        if (top < 250 && heading && i !== items.length - 1) heading.style.opacity = 1;
      });
    }, { passive: true });
  }

  /* ---------- Entrance animations ---------- */
  function settings(el) {
    try { return JSON.parse(el.getAttribute('data-settings') || '{}'); } catch (e) { return {}; }
  }
  var hidden = document.querySelectorAll('.elementor-invisible');
  function reveal(el) {
    var s = settings(el);
    var name = s._animation || s.animation;
    var delay = Number(s._animation_delay || s.animation_delay || 0);
    setTimeout(function () {
      el.classList.remove('elementor-invisible');
      if (name && name !== 'none') el.classList.add('animated', name);
    }, delay);
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { io.unobserve(en.target); reveal(en.target); } });
    });
    hidden.forEach(function (el) { io.observe(el); });
  } else {
    hidden.forEach(reveal);
  }

  /* ---------- Forms (Formspree, styled like Contact Form 7) ---------- */
  var NO_DIGITS = ['first-name', 'last-name', 'company', 'title'];
  document.querySelectorAll('form[data-formspree]').forEach(function (form) {
    var out = form.querySelector('.wpcf7-response-output, .comment-form-status');
    var submit = form.querySelector('[type=submit]');
    var accept = form.querySelector('input[name=tandc]');

    NO_DIGITS.forEach(function (n) {
      var f = form.querySelector('input[name="' + n + '"]');
      if (f) f.addEventListener('input', function () { f.value = f.value.replace(/\d/g, ''); });
    });
    if (accept && submit) {
      var sync = function () { submit.disabled = !accept.checked; };
      accept.addEventListener('change', sync); sync();
    }

    function status(state, msg) {
      form.classList.remove('init', 'sent', 'invalid', 'failed', 'submitting');
      form.classList.add(state);
      form.setAttribute('data-status', state);
      if (out && msg) {
        out.textContent = msg;
        out.style.display = 'block';
        clearTimeout(form._hide);
        form._hide = setTimeout(function () { out.style.display = 'none'; out.textContent = ''; }, 3000);
      }
    }

    function validate() {
      var ok = true;
      form.querySelectorAll('.wpcf7-not-valid-tip').forEach(function (t) { t.remove(); });
      form.querySelectorAll('[aria-required="true"], [required]').forEach(function (f) {
        var v = (f.value || '').trim();
        var bad = f.type === 'checkbox' ? !f.checked : !v;
        var msg = 'Please fill out this field.';
        if (!bad && f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { bad = true; msg = 'Please enter an email address.'; }
        f.classList.toggle('wpcf7-not-valid', bad);
        f.setAttribute('aria-invalid', String(bad));
        if (bad) {
          ok = false;
          var tip = document.createElement('span');
          tip.className = 'wpcf7-not-valid-tip';
          tip.setAttribute('aria-hidden', 'true');
          tip.textContent = msg;
          (f.closest('.wpcf7-form-control-wrap') || f.parentNode).appendChild(tip);
        }
      });
      return ok;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) { status('invalid', 'One or more fields have an error. Please check and try again.'); return; }
      status('submitting');
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (r.ok) {
            form.reset(); if (accept && submit) submit.disabled = true;
            status('sent', form.id === 'commentform' ? 'Thank you! Your comment has been submitted for review.' : 'Thank you for your message. It has been sent.');
          }
          else { status('failed', 'There was an error trying to send your message. Please try again later.'); }
        })
        .catch(function () { status('failed', 'There was an error trying to send your message. Please try again later.'); });
    });
  });
})();
