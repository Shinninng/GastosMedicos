document.addEventListener('DOMContentLoaded', async function() {
  const resumenContainer = document.getElementById('resumen-container');

  async function cargarResumen() {
    try {
      const response = await fetch('TU_URL_APPS_SCRIPT');
      const gastos = await response.json();
      
      if (!Array.isArray(gastos)) {
        throw new Error('Formato de datos inválido');
      }
      
      generarResumen(gastos);
    } catch (error) {
      console.error('Error al cargar resumen:', error);
      resumenContainer.innerHTML = `<p class="error">${error.message}</p>`;
    }
  }

  function generarResumen(gastos) {
    const totalPorIntegrante = {};
    const totalPorMes = {};

    gastos.forEach(gasto => {
      // Cálculo por integrante
      totalPorIntegrante[gasto.integrante] = 
        (totalPorIntegrante[gasto.integrante] || 0) + gasto.monto;
      
      // Cálculo por mes
      totalPorMes[gasto.mes] = 
        (totalPorMes[gasto.mes] || 0) + gasto.monto;
    });

    resumenContainer.innerHTML = `
      <div class="resumen-section">
        <h3>Total por Integrante</h3>
        ${Object.entries(totalPorIntegrante).map(([integrante, total]) => `
          <p>${integrante}: $${total.toFixed(2)}</p>
        `).join('')}
      </div>
      <div class="resumen-section">
        <h3>Total por Mes</h3>
        ${Object.entries(totalPorMes).map(([mes, total]) => `
          <p>${mes}: $${total.toFixed(2)}</p>
        `).join('')}
      </div>
    `;
  }

  cargarResumen();
});