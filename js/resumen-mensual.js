// resumen-mensual.js
import { MESES, obtenerDatosFirebase } from './common.js'; // common.js ya importa db

document.addEventListener('DOMContentLoaded', () => {
    const tablaResumen = document.getElementById('tablaResumen');
    const filtroForm = document.getElementById('filtroForm');
    const periodoSelect = document.getElementById('periodo');
    const mensajeError = document.getElementById('mensajeError');

    function getCurrentMonthNameInternal() { // Renombrada para evitar conflicto si MESES también se importa
        return MESES[new Date().getMonth()];
    }

    // Tu función procesarDatos (no necesita cambios si la lógica es la misma)
    function procesarDatos(data, filtroPeriodo) {
        const agrupado = {};
        const mesActual = getCurrentMonthNameInternal();

        data.forEach((item) => {
            if (
                !item.integrante ||
                !item.mes ||
                !item.monto || // Firebase guardará como número, parseFloat no es estrictamente necesario aquí si ya es número
                isNaN(parseFloat(item.monto)) // Mantén la validación por si acaso
            ) return;

            if (filtroPeriodo === 'mes' && item.mes !== mesActual) return;

            if (!agrupado[item.integrante]) {
                agrupado[item.integrante] = 0;
            }
            agrupado[item.integrante] += parseFloat(item.monto);
        });
        return agrupado;
    }

    // Tu función renderizarTabla (no necesita cambios)
    function renderizarTabla(agrupado) {
        // ... tu código actual
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
            <tr><td colspan="2" class="text-center py-6 text-gray-400 italic">Cargando datos...</td></tr>
        `;
        try {
            const datos = await obtenerDatosFirebase(); // Usa la nueva función de common.js
            const filtro = periodoSelect.value;
            const agrupado = procesarDatos(datos, filtro);
            renderizarTabla(agrupado);
        } catch (error) {
            tablaResumen.innerHTML = ''; // Limpia la tabla en caso de error
            mensajeError.textContent = error.message || 'Error desconocido al cargar datos.';
            mensajeError.classList.remove('hidden');
            console.error("Error al cargar resumen mensual:", error);
        }
    }

    filtroForm.addEventListener('submit', (e) => {
        e.preventDefault();
        cargarResumen();
    });

    // Carga inicial
    cargarResumen();
});