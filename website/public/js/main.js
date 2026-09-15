(function () {
  'use strict';

  // Footer year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile menu toggle
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('is-open');
      hamburger.classList.toggle('is-open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('is-open');
        hamburger.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Header shadow on scroll
  var header = document.getElementById('header');
  if (header) {
    var onScroll = function () {
      header.style.boxShadow = window.scrollY > 8 ? '0 4px 20px rgba(10,22,40,0.08)' : 'none';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // FAQ accordion
  document.querySelectorAll('.faq__item').forEach(function (item) {
    var q = item.querySelector('.faq__q');
    q.addEventListener('click', function () {
      var wasOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq__item').forEach(function (i) {
        i.classList.remove('is-open');
      });
      if (!wasOpen) item.classList.add('is-open');
    });
  });

  // Quote form submission
  var form = document.getElementById('quote-form');
  var statusEl = document.getElementById('form-status');
  var submitBtn = document.getElementById('quote-submit');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      statusEl.textContent = '';
      statusEl.className = 'form-note';

      var data = {
        name: form.name.value.trim(),
        phone: form.phone.value.trim(),
        email: form.email.value.trim(),
        service: form.service.value,
        address: form.address.value.trim(),
        message: form.message.value.trim()
      };

      if (!data.name || !data.phone || !data.email || !data.service) {
        statusEl.textContent = 'Please fill in your name, phone, email and service.';
        statusEl.className = 'form-note error';
        return;
      }

      submitBtn.disabled = true;
      var originalLabel = submitBtn.querySelector('.btn__label').textContent;
      submitBtn.querySelector('.btn__label').textContent = 'Sending...';

      fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (res) {
          return res.json().then(function (body) {
            return { ok: res.ok, body: body };
          });
        })
        .then(function (result) {
          if (result.ok) {
            statusEl.textContent = "Thanks! We've received your request and will be in touch shortly.";
            statusEl.className = 'form-note success';
            form.reset();
          } else {
            statusEl.textContent = result.body.error || 'Something went wrong. Please call us instead.';
            statusEl.className = 'form-note error';
          }
        })
        .catch(function () {
          statusEl.textContent = 'Network error. Please call us at 647.281.1454.';
          statusEl.className = 'form-note error';
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.querySelector('.btn__label').textContent = originalLabel;
        });
    });
  }
})();
