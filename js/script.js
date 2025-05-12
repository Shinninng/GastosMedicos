(() => {
  const form = document.getElementById('registroForm');
  const integranteSelect = document.getElementById('integrante');
  const montoInput = document.getElementById('monto');
  const descripcionInput = document.getElementById('descripcion');

  const errorIntegrante = document.getElementById('errorIntegrante');
  const errorMonto = document.getElementById('errorMonto');
  const errorDescripcion = document.getElementById('errorDescripcion');
  const formMessage = document.getElementById('formMessage');

  function getCurrentMonthName() {
    const meses = MESES;
    const now = new Date();
    return meses[now.getMonth()];
  }

  function validate() {
    let valid = true;

    if (!integranteSelect.value) {
      errorIntegrante.classList.remove('hidden');
      valid = false;
    } else {
      errorIntegrante.classList.add('hidden');
    }

    if (!esMontoValido(montoInput.value)) {
      errorMonto.classList.remove('hidden');
      valid = false;
    } else {
      errorMonto.classList.add('hidden');
    }

    if (!descripcionInput.value.trim()) {
      errorDescripcion.classList.remove('hidden');
      valid = false;
    } else {
      errorDescripcion.classList.add('hidden');
    }

    return valid;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    formMessage.textContent = '';
    formMessage.classList.remove('text-green-600', 'text-red-600');

    if (!validate()) {
      return;
    }

    const data = {
      mes: getCurrentMonthName(),
      integrante: integranteSelect.value,
      monto: parseFloat(montoInput.value).toFixed(2),
      descripcion: descripcionInput.value.trim(),
    };

    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbzurDUDwPm1H6iBUeT4eSfLTbshYWebsaXBPQMkbLXVZyeAcjPSpc5dm1OYuqAolO0J_w/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error en la comunicación con el servidor');
      }

      const result = await response.json();

      if (result.success) {
        formMessage.textContent = 'Gasto registrado correctamente.';
        formMessage.classList.add('text-green-600');
        form.reset();
        integranteSelect.selectedIndex = 0;
      } else {
        throw new Error(result.message || 'Error al guardar el gasto');
      }
    } catch (error) {
      formMessage.textContent = error.message;
      formMessage.classList.add('text-red-600');
    }
  });
})();