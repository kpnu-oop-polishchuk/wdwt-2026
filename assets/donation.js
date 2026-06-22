const form = document.getElementById('donation-form');
const message = document.getElementById('donation-message');

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

      message.textContent = `Дякуємо, ${donation.name}! Ми отримали ваш внесок у розмірі ${donation.amount} ${donation.currency}.`;
      message.style.color = '#0b7a3a';
      form.reset();
    } catch (error) {
      message.textContent = error.message;
      message.style.color = '#a61b1b';
    }
  });
}