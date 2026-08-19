document.addEventListener('DOMContentLoaded', function () {
  var params = new URLSearchParams(window.location.search);
  var item = params.get('item');
  var itemSelect = document.getElementById('item-type');

  if (item && itemSelect) {
    for (var i = 0; i < itemSelect.options.length; i++) {
      if (itemSelect.options[i].value.toLowerCase() === item.toLowerCase()) {
        itemSelect.value = itemSelect.options[i].value;
        break;
      }
    }
  }

  var dateInput = document.getElementById('needed-by');
  if (dateInput) {
    dateInput.min = new Date().toISOString().split('T')[0];
  }

  var form = document.getElementById('order-form');
  var statusEl = document.getElementById('order-form-status');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    statusEl.textContent = 'Sending your order...';
    statusEl.className = 'form-status';

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
      .then(function (response) {
        if (response.ok) {
          form.reset();
          statusEl.textContent = "Thanks! Your order request has been sent — we'll be in touch soon to confirm details.";
          statusEl.className = 'form-status success';
        } else {
          return response.json().then(function (data) {
            var message = (data && data.errors)
              ? data.errors.map(function (err) { return err.message; }).join(', ')
              : 'Something went wrong.';
            throw new Error(message);
          });
        }
      })
      .catch(function () {
        statusEl.textContent = 'Sorry, something went wrong sending your order. Please email us directly at JsMADSweets@gmail.com.';
        statusEl.className = 'form-status error';
      })
      .finally(function () {
        submitBtn.disabled = false;
      });
  });
});
