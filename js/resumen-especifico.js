// resumen-especifico.js
import { MESES, obtenerDatosFirebase } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
    const tablaResumen = document.getElementById('tablaResumen');
    const filtroForm = document.getElementById('filtroForm');
    const integranteSelect = document.getElementById('integrante');
    const mensajeError = document.getElementById('mensajeError');
    const errorIntegrante = document.getElementById('errorIntegrante');

    // Tu función procesarDatosPorIntegrante (no necesita cambios si la lógica es la misma, usa MESES importado)
    function procesarDatosPorIntegrante(data, integrante) {
        const agrupado = {};
        MESES.forEach((mes) => { // MESES ahora viene de la importación
            agrupado[mes] = 0;
        });

        data.forEach((item) => {
            if (
                item.integrante === integrante &&
                item.mes &&
                !isNaN(parseFloat(item.monto)) // Mantén validación
            ) {
                agrupado[item.mes] = (agrupado[item.mes] || 0) + parseFloat(item.monto);
            }
        });
        return agrupado;
    }
    // Tu función renderizarTabla (no necesita cambios, usa MESES importado)
    function renderizarTabla(agrupado) {
        // ... tu código actual
        tablaResumen.innerHTML = '';
        const mesesConGasto = Object.entries(agrupado).filter(([_, monto]) => monto > 0);

        if (mesesConGasto.length === 0) {
          tablaResumen.innerHTML = `
            <tr>
              <td colspan="2" class="text-center py-6 text-gray-400 italic">No hay gastos registrados para este integrante.</td>
            </tr>
          `;
          return;
        }

        MESES.forEach((mes) => { // MESES ahora viene de la importación
          const monto = agrupado[mes] || 0;
          if (monto > 0) {
            const tr = document.createElement('tr');
            tr.className = 'border-t border-indigo-200 hover:bg-indigo-50 transition';

            const tdMes = document.createElement('td');
            tdMes.className = 'py-3 px-4 border border-indigo-200 font-medium';
            tdMes.textContent = mes;

            const tdMonto = document.createElement('td');
            tdMonto.className = 'py-3 px-4 border border-indigo-200 font-semibold text-indigo-700';
            tdMonto.textContent = monto.toFixed(2);

            tr.appendChild(tdMes);
            tr.appendChild(tdMonto);
            tablaResumen.appendChild(tr);
          }
        });
    }


    async function cargarResumenPorIntegrante(integrante) {
        mensajeError.classList.add('hidden');
        errorIntegrante.classList.add('hidden');
        tablaResumen.innerHTML = `
            <tr><td colspan="2" class="text-center py-6 text-gray-400 italic">Cargando datos...</td></tr>
        `;
        try {
            const datos = await obtenerDatosFirebase(); // Usa la nueva función de common.js
            const agrupado = procesarDatosPorIntegrante(datos, integrante);
            renderizarTabla(agrupado);
        } catch (error) {
            tablaResumen.innerHTML = '';
            mensajeError.textContent = error.message || 'Error desconocido al cargar datos.';
            mensajeError.classList.remove('hidden');
            console.error("Error al cargar resumen específico:", error);
        }
    }

    filtroForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const integrante = integranteSelect.value;
        if (!integrante) {
            errorIntegrante.classList.remove('hidden');
            tablaResumen.innerHTML = `
                <tr><td colspan="2" class="text-center py-6 text-gray-400 italic">Seleccione un integrante para ver el resumen.</td></tr>
            `;
            return;
        }
        errorIntegrante.classList.add('hidden');
        cargarResumenPorIntegrante(integrante);
    });
    // No hay carga inicial automática aquí, se dispara al seleccionar un integrante
});