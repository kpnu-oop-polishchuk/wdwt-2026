const form = document.getElementById('donation-form');
const message = document.getElementById('donation-message');

const toggleButtons = document.querySelectorAll('[data-toggle-btn]');

toggleButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const panel = button.closest('[data-toggle-panel]');
    const body = panel?.querySelector('[data-toggle-body]');

    if (!panel || !body) {
      return;
    }

    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    button.textContent = expanded ? 'Показати' : 'Сховати';
    body.hidden = expanded;
  });
});

if (form && message) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    try {
      const formData = new FormData(form);
      const rawData = Object.fromEntries(
        [...formData.entries()].map(([key, value]) => [key, value.trim()])
      );
      const { name, email, amount, ...rest } = rawData;
      const donation = {
        name,
        email,
        amount: Number(amount),
        ...rest
      };

      if (!name) {
        throw new Error('Поле «Ім’я» не може бути порожнім.');
      }

      if (!email) {
        throw new Error('Поле «Email» не може бути порожнім.');
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Будь ласка, введіть коректний email.');
      }

      if (!amount || Number.isNaN(donation.amount) || donation.amount <= 0) {
        throw new Error('Сума внеску має бути позитивним числом.');
      }

      message.textContent = 'Надсилаємо пожертву...';
      message.style.color = '#42557d';

      fetch('/api/donate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(donation)
      })
        .then(async (response) => {
          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.message || 'Не вдалося надіслати пожертву.');
          }

          message.textContent = result.message;
          message.style.color = '#0b7a3a';
          form.reset();
        })
        .catch((error) => {
          message.textContent = error.message;
          message.style.color = '#a61b1b';
        });
    } catch (error) {
      message.textContent = error.message;
      message.style.color = '#a61b1b';
    }
  });
}