// Validación del formulario de contacto (Bootstrap 5 + HTML5).
// Si falta algo, frena el envío y muestra los mensajes; si está todo, Netlify Forms recibe el POST.
(() => {
  const form = document.querySelector('form[name="contacto"]');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    if (!form.checkValidity()) {
      e.preventDefault();
      e.stopPropagation();
      const primero = form.querySelector(':invalid');
      if (primero) primero.focus();
    }
    form.classList.add('was-validated');
  });
})();
