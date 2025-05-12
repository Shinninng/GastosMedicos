(() => {
  const tablaResumen = document.getElementById('tablaResumen');
  const filtroForm = document.getElementById('filtroForm');
  const periodoSelect = document.getElementById('periodo');
  const mensajeError = document.getElementById('mensajeError');

  function getCurrentMonthIndex() {
    return new Date().getMonth();
  }

  function procesarDatos(data, filtroPeriodo) {
    const agrupado = {};
    const mesActual = MESES[getCurrentMonthIndex()];

    data.forEach((item) => {
      if (
        !item.integrante ||
        !item.mes ||
        !item.monto ||
        isNaN(parseFloat(item.monto))
      ) return;

      if (filtroPeriodo === 'mes' && item.mes !== mesActual) return;

      if (!agrupado[item.integrante]) {
        agrupado[item.integrante] = 0;
      }
      agrupado[item.integrante] += parseFloat(item.monto);
    });

    return agrupado;
  }

  function renderizarTabla(agrupado) {
    tablaResumen.innerHTML = '';
    const integrantes = Object.keys(agrupado).sort((a, b) =>
      a.localeCompare(b, 'es', { sensitivity: 'base' })
    );

    if (integrantes.length === 0) {
      tablaResumen.innerHTML = `
        <tr>
          <td colspan="2" class="text-center py-6 text-gray-400 italic">No hay datos para mostrar.</td>
        </tr>
      `;
      return;
    }

    integrantes.forEach((integrante) => {
      const monto = agrupado[integrante].toFixed(2);
      const tr = document.createElement('tr');
      tr.className = 'border-t border-indigo-200 hover:bg-indigo-50 transition';

      const tdIntegrante = document.createElement('td');
      tdIntegrante.className = 'py-3 px-4 border border-indigo-200 font-medium';
      tdIntegrante.textContent = integrante;

      const tdMonto = document.createElement('td');
      tdMonto.className = 'py-3 px-4 border border-indigo-200 font-semibold text-indigo-700';
      tdMonto.textContent = monto;

      tr.appendChild(tdIntegrante);
      tr.appendChild(tdMonto);
      tablaResumen.appendChild(tr);
    });
  }

  async function cargarResumen() {
    mensajeError.classList.add('hidden');
    tablaResumen.innerHTML = `
      <tr>
        <td colspan="2" class="text-center py-6 text-gray-400 italic">Cargando datos...</td>
      </tr>
    `;
    try {
      const datos = await obtenerDatos();
      const filtro = periodoSelect.value;
      const agrupado = procesarDatos(datos, filtro);
      renderizarTabla(agrupado);
    } catch (error) {
      tablaResumen.innerHTML = '';
      mensajeError.textContent = error.message || 'Error desconocido al cargar datos.';
      mensajeError.classList.remove('hidden');
    }
  }

  filtroForm.addEventListener('submit', (e) => {
    e.preventDefault();
    cargarResumen();
  });

  cargarResumen();
})();