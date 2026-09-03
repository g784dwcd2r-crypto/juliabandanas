/* ==========================================================================
   Julia Bandanas — theme behaviour
   Vanilla, no dependencies. Everything degrades to working HTML without it.
   ========================================================================== */
(function () {
  'use strict';

  var JM = window.JM || {};
  var $  = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---------- Money ---------- */
  function formatMoney(cents) {
    var fmt = JM.moneyFormat || '${{amount}}';
    var value = (cents / 100);
    return fmt.replace(/\{\{\s*(\w+)\s*\}\}/g, function (_, name) {
      switch (name) {
        case 'amount':                 return value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        case 'amount_no_decimals':     return Math.round(value).toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,');
        case 'amount_with_comma_separator':
          return value.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+,)/g, '$1.');
        case 'amount_no_decimals_with_comma_separator':
          return Math.round(value).toString().replace(/(\d)(?=(\d{3})+$)/g, '$1.');
        default:                       return value.toFixed(2);
      }
    });
  }

  /* ======================================================================
     Focus trap + scroll lock, shared by every drawer
     ====================================================================== */
  var scrollY = 0;
  var openCount = 0;

  function lockScroll() {
    if (openCount++ > 0) return;
    scrollY = window.scrollY;
    document.body.style.top = '-' + scrollY + 'px';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.classList.add('is-locked');
  }
  function unlockScroll() {
    if (--openCount > 0) return;
    openCount = 0;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.classList.remove('is-locked');
    window.scrollTo(0, scrollY);
  }

  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function Drawer(el) {
    this.el = el;
    this.panel = $('.drawer__panel', el);
    this.opener = null;
    var self = this;

    $$('[data-drawer-close]', el).forEach(function (btn) {
      btn.addEventListener('click', function () { self.close(); });
    });
    var scrim = $('.drawer__scrim', el);
    if (scrim) scrim.addEventListener('click', function () { self.close(); });

    el.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.stopPropagation(); self.close(); return; }
      if (e.key !== 'Tab') return;
      var items = $$(FOCUSABLE, self.panel).filter(function (n) { return n.offsetParent !== null; });
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }
  Drawer.prototype.open = function (opener) {
    this.opener = opener || document.activeElement;
    this.el.classList.add('is-open');
    this.el.setAttribute('aria-hidden', 'false');
    if (this.opener && this.opener.setAttribute) this.opener.setAttribute('aria-expanded', 'true');
    lockScroll();
    var self = this;
    // wait for the transition to start so focus doesn't fight the animation
    window.setTimeout(function () {
      var target = $('[data-drawer-focus]', self.panel) || $(FOCUSABLE, self.panel);
      if (target) target.focus();
    }, 60);
  };
  Drawer.prototype.close = function () {
    if (!this.el.classList.contains('is-open')) return;
    this.el.classList.remove('is-open');
    this.el.setAttribute('aria-hidden', 'true');
    if (this.opener && this.opener.setAttribute) {
      this.opener.setAttribute('aria-expanded', 'false');
      if (document.body.contains(this.opener)) this.opener.focus();
    }
    unlockScroll();
  };

  var drawers = {};
  function initDrawers() {
    $$('.drawer[id]').forEach(function (el) { drawers[el.id] = new Drawer(el); });
    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('[data-drawer-open]');
      if (!trigger) return;
      var id = trigger.getAttribute('data-drawer-open');
      if (!drawers[id]) return;
      e.preventDefault();
      drawers[id].open(trigger);
    });
  }
  function openCart(opener) { if (drawers['cart-drawer']) drawers['cart-drawer'].open(opener); }

  /* ======================================================================
     Header — hide on scroll down, show on scroll up (gives phones back
     the full viewport while browsing, without losing the nav)
     ====================================================================== */
  function initHeader() {
    var header = $('.header');
    if (!header) return;
    var last = window.scrollY;
    var ticking = false;

    function update() {
      var y = window.scrollY;
      header.classList.toggle('is-stuck', y > 4);
      // never hide while a drawer is open or near the very top
      if (!document.body.classList.contains('is-locked') && y > 220) {
        header.classList.toggle('is-hidden', y > last + 6);
      } else {
        header.classList.remove('is-hidden');
      }
      last = y;
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ======================================================================
     Scroll reveal
     ====================================================================== */
  function initReveal() {
    var items = $$('.reveal');
    if (!items.length) return;
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (n) { n.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = parseInt(el.getAttribute('data-reveal-delay') || '0', 10);
        window.setTimeout(function () { el.classList.add('is-in'); }, delay);
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    items.forEach(function (n) { io.observe(n); });
  }

  /* ======================================================================
     Product gallery — swipe rail with dots (mobile)
     ====================================================================== */
  function initGallery() {
    $$('[data-gallery]').forEach(function (gallery) {
      var rail  = $('.gallery__rail', gallery);
      var dots  = $$('.gallery__dot', gallery);
      var count = $('[data-gallery-current]', gallery);
      if (!rail) return;

      function sync() {
        var i = Math.round(rail.scrollLeft / rail.clientWidth);
        dots.forEach(function (d, di) { d.classList.toggle('is-active', di === i); });
        if (count) count.textContent = i + 1;
      }
      var t;
      rail.addEventListener('scroll', function () {
        window.clearTimeout(t);
        t = window.setTimeout(sync, 60);
      }, { passive: true });

      dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
          rail.scrollTo({ left: rail.clientWidth * i, behavior: 'smooth' });
        });
      });
      sync();
    });
  }

  /* ======================================================================
     Quantity steppers
     ====================================================================== */
  function initQty() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-qty]');
      if (!btn) return;
      var wrap = btn.closest('.qty');
      var input = $('input', wrap);
      if (!input) return;
      var min = parseInt(input.getAttribute('min') || '1', 10);
      var step = btn.getAttribute('data-qty') === 'up' ? 1 : -1;
      var next = Math.max(min, (parseInt(input.value, 10) || min) + step);
      input.value = next;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  /* Normalise a typed Instagram handle on the contact form */
  function initIgField() {
    $$('[data-ig-field]').forEach(function (input) {
      input.addEventListener('blur', function () {
        var v = input.value.trim();
        if (!v) return;
        v = v.replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
             .replace(/\/+$/, '')
             .replace(/^@+/, '');
        if (v) input.value = '@' + v;
      });
    });
  }

  /* ======================================================================
     Cart
     ====================================================================== */
  function updateCartCount(count) {
    $$('[data-cart-count]').forEach(function (el) {
      el.textContent = count;
      var btn = el.closest('.cart-btn');
      if (btn) btn.setAttribute('data-count', count);
    });
  }

  function refreshCartDrawer() {
    return fetch(JM.routes.cart_url + '?section_id=cart-drawer-contents', { headers: { 'Accept': 'text/html' } })
      .then(function (r) { return r.text(); })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var fresh = $('[data-cart-drawer-contents]', doc);
        var target = $('[data-cart-drawer-contents]');
        if (fresh && target) target.innerHTML = fresh.innerHTML;
      });
  }

  function syncCart() {
    return fetch(JM.routes.cart_url + '.js', { headers: { 'Accept': 'application/json' } })
      .then(function (r) { return r.json(); })
      .then(function (cart) { updateCartCount(cart.item_count); return cart; });
  }

  function initProductForms() {
    $$('[data-product-form]').forEach(function (form) {
      var btn = $('[data-add-to-cart]', form);
      var errorEl = $('[data-form-error]', form);

      form.addEventListener('submit', function (e) {
        if (!window.fetch || !JM.cartDrawer) return; // let it post normally

        e.preventDefault();
        if (errorEl) { errorEl.textContent = ''; errorEl.hidden = true; }
        var label = btn ? btn.textContent : '';
        if (btn) { btn.setAttribute('aria-disabled', 'true'); btn.textContent = '…'; }

        var body = new FormData(form);
        body.append('sections', 'cart-drawer-contents');

        fetch(JM.routes.cart_add_url, {
          method: 'POST',
          headers: { 'Accept': 'application/javascript', 'X-Requested-With': 'XMLHttpRequest' },
          body: body
        })
          .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
          .then(function (res) {
            if (!res.ok) throw new Error(res.data.description || res.data.message || JM.strings.error);
            return refreshCartDrawer().then(syncCart).then(function () { openCart(btn); });
          })
          .catch(function (err) {
            if (errorEl) { errorEl.textContent = err.message || JM.strings.error; errorEl.hidden = false; }
          })
          .then(function () {
            if (btn) { btn.removeAttribute('aria-disabled'); btn.textContent = label; }
          });
      });
    });
  }

  /* Quantity changes + removals, in the drawer and on the cart page */
  function changeLine(key, quantity, scope) {
    var body = { id: key, quantity: quantity, sections: 'cart-drawer-contents' };
    if (scope) scope.setAttribute('aria-busy', 'true');
    return fetch(JM.routes.cart_change_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(function (r) { return r.json(); })
      .then(function (cart) {
        updateCartCount(cart.item_count);
        // The cart page has totals and line prices everywhere — a reload is
        // both simpler and more correct than patching a dozen nodes.
        if (document.body.classList.contains('template--cart')) { window.location.reload(); return; }
        return refreshCartDrawer();
      })
      .catch(function () { window.location.reload(); });
  }

  function initCartActions() {
    document.addEventListener('click', function (e) {
      var remove = e.target.closest('[data-cart-remove]');
      if (remove) {
        e.preventDefault();
        changeLine(remove.getAttribute('data-cart-remove'), 0, remove.closest('.cart-line, .mini-line'));
        return;
      }
      var step = e.target.closest('[data-cart-qty]');
      if (step) {
        e.preventDefault();
        var line = step.closest('[data-line-key]');
        if (!line) return;
        var current = parseInt(line.getAttribute('data-line-qty') || '1', 10);
        var next = step.getAttribute('data-cart-qty') === 'up' ? current + 1 : current - 1;
        changeLine(line.getAttribute('data-line-key'), Math.max(0, next), line);
      }
    });

    document.addEventListener('change', function (e) {
      var input = e.target.closest('[data-cart-qty-input]');
      if (!input) return;
      var line = input.closest('[data-line-key]');
      if (!line) return;
      changeLine(line.getAttribute('data-line-key'), Math.max(0, parseInt(input.value, 10) || 0), line);
    });
  }

  /* ======================================================================
     Sticky buy bar — appears once the real add-to-cart button scrolls away
     ====================================================================== */
  function initBuyBar() {
    var bar = $('[data-buybar]');
    var anchor = $('[data-buybar-anchor]');
    if (!bar || !anchor || !('IntersectionObserver' in window)) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        // show it only after the user has scrolled past the button, never before
        var passed = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        bar.classList.toggle('is-shown', passed);
      });
    }, { threshold: 0 });
    io.observe(anchor);

    var jump = $('[data-buybar-submit]', bar);
    if (jump) {
      jump.addEventListener('click', function () {
        var form = $('[data-product-form]');
        var realBtn = form && $('[data-add-to-cart]', form);
        if (realBtn) realBtn.click();
      });
    }
  }

  /* ======================================================================
     Variant picker
     ====================================================================== */
  function initVariants() {
    $$('[data-variant-picker]').forEach(function (picker) {
      var form = picker.closest('[data-product-form]') || $('[data-product-form]');
      var dataEl = $('[data-variant-json]', picker);
      if (!dataEl || !form) return;

      var variants = JSON.parse(dataEl.textContent);
      var idInput = $('[data-variant-id]', form);
      var priceEl = $('[data-product-price]');
      var btn = $('[data-add-to-cart]', form);
      var barPrice = $('[data-buybar-price]');

      function currentOptions() {
        return $$('fieldset', picker).map(function (fs) {
          // Options with a lot of values fall back to a <select>
          var select = $('select', fs);
          if (select) return select.value;
          var checked = $('input:checked', fs);
          return checked ? checked.value : null;
        });
      }

      function update() {
        var opts = currentOptions();
        var match = variants.filter(function (v) {
          return v.options.every(function (o, i) { return o === opts[i]; });
        })[0];

        $$('.variant__value', picker).forEach(function (el, i) { el.textContent = opts[i] || ''; });

        if (!match) {
          if (btn) { btn.setAttribute('aria-disabled', 'true'); btn.textContent = JM.strings.unavailable; }
          return;
        }
        if (idInput) idInput.value = match.id;
        if (priceEl) priceEl.innerHTML = formatMoney(match.price);
        if (barPrice) barPrice.innerHTML = formatMoney(match.price);
        if (btn) {
          if (match.available) { btn.removeAttribute('aria-disabled'); btn.textContent = JM.strings.addToCart; }
          else { btn.setAttribute('aria-disabled', 'true'); btn.textContent = JM.strings.soldOut; }
        }
        if (window.history.replaceState) {
          var url = new URL(window.location.href);
          url.searchParams.set('variant', match.id);
          window.history.replaceState({}, '', url.toString());
        }
      }

      picker.addEventListener('change', update);
      update();
    });
  }

  /* ======================================================================
     Newsletter / contact forms — keep the user on the page
     ====================================================================== */
  function initFormFeedback() {
    // Shopify posts back with ?contact_posted=true / ?customer_posted=true
    var params = new URLSearchParams(window.location.search);
    if (params.get('contact_posted') === 'true' || params.get('customer_posted') === 'true') {
      var status = $('.form-status--ok');
      if (status) status.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  /* ======================================================================
     Reading progress bar on articles
     ====================================================================== */
  function initProgress() {
    var bar = $('[data-progress]');
    var article = $('[data-article-body]');
    if (!bar || !article) return;
    var ticking = false;

    function update() {
      var rect = article.getBoundingClientRect();
      var total = rect.height - window.innerHeight;
      var done = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      bar.style.width = (done * 100).toFixed(1) + '%';
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  }

  /* ======================================================================
     Collection sort — submit on change, no extra button to tap
     ====================================================================== */
  function initSort() {
    var sort = $('[data-sort]');
    if (!sort) return;
    sort.addEventListener('change', function () {
      var url = new URL(window.location.href);
      url.searchParams.set('sort_by', sort.value);
      url.searchParams.delete('page');
      window.location.href = url.toString();
    });
  }

  /* ---------- Boot ---------- */
  function init() {
    initDrawers();
    initHeader();
    initReveal();
    initGallery();
    initQty();
    initIgField();
    initProductForms();
    initCartActions();
    initBuyBar();
    initVariants();
    initFormFeedback();
    initProgress();
    initSort();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Shopify theme editor: re-run everything when a section is re-rendered
  document.addEventListener('shopify:section:load', init);
})();
