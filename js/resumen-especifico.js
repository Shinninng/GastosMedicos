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
    let datosOriginales = []; // Para mantener los datos originales y poder editar

    // Tu función renderizarTabla (no necesita cambios, usa MESES importado)
    function renderizarTabla(agrupado, integrante) {
        tablaResumen.innerHTML = '';
        const mesesConGasto = Object.entries(agrupado).filter(([_, monto]) => monto > 0);

        if (mesesConGasto.length === 0) {
          tablaResumen.innerHTML = `
            <tr>
              <td colspan="3" class="text-center py-6 text-gray-400 italic">No hay gastos registrados para este integrante.</td>
            </tr>
          `;
          return;
        }

        MESES.forEach((mes) => {
          const monto = agrupado[mes] || 0;
          if (monto > 0) {
            const tr = document.createElement('tr');
            tr.className = 'border-t border-indigo-200 hover:bg-indigo-50 transition';

            const tdMes = document.createElement('td');
            tdMes.className = 'py-3 px-4 border border-indigo-200 font-medium';
            tdMes.textContent = mes;

            const tdMonto = document.createElement('td');
            tdMonto.className = 'py-3 px-4 border border-indigo-200 font-semibold text-indigo-700';
            tdMonto.id = `monto-${mes}`;
            tdMonto.textContent = monto.toFixed(2);

            const tdAccion = document.createElement('td');
            tdAccion.className = 'py-3 px-4 border border-indigo-200 text-center';
            tdAccion.innerHTML = `
              <button class="text-indigo-600 hover:text-indigo-900 font-semibold" onclick="editarMonto('${mes}')">
                <i class="fas fa-edit"></i> Editar
              </button>
            `;

            tr.appendChild(tdMes);
            tr.appendChild(tdMonto);
            tr.appendChild(tdAccion);
            tablaResumen.appendChild(tr);
          }
        });
    }

    // Función global para editar
    window.editarMonto = function(mes) {
        const tdMonto = document.getElementById(`monto-${mes}`);
        const valorActual = tdMonto.textContent;
        tdMonto.innerHTML = `
          <input type="number" id="input-monto-${mes}" value="${valorActual}" class="border rounded px-2 py-1 w-24" min="0" step="0.01"/>
          <button onclick="guardarMonto('${mes}')" class="ml-2 text-green-600 hover:text-green-900 font-semibold"><i class="fas fa-check"></i></button>
          <button onclick="cancelarEdicion('${mes}', '${valorActual}')" class="ml-2 text-red-600 hover:text-red-900 font-semibold"><i class="fas fa-times"></i></button>
        `;
    };

    window.guardarMonto = function(mes) {
        const input = document.getElementById(`input-monto-${mes}`);
        const nuevoMonto = parseFloat(input.value).toFixed(2);

        // Actualiza el dato en datosOriginales (solo frontend)
        datosOriginales.forEach(item => {
            if(item.mes === mes && item.integrante === window.ultimoIntegranteSeleccionado) {
                item.monto = nuevoMonto;
            }
        });

        // Recalcula y renderiza
        const agrupado = procesarDatosPorIntegrante(datosOriginales, window.ultimoIntegranteSeleccionado);
        renderizarTabla(agrupado, window.ultimoIntegranteSeleccionado);
    };

    window.cancelarEdicion = function(mes, valorAnterior) {
        const tdMonto = document.getElementById(`monto-${mes}`);
        tdMonto.textContent = valorAnterior;
    };

    async function cargarResumenPorIntegrante(integrante) {
        mensajeError.classList.add('hidden');
        errorIntegrante.classList.add('hidden');
        tablaResumen.innerHTML = `
            <tr><td colspan="3" class="text-center py-6 text-gray-400 italic">Cargando datos...</td></tr>
        `;
        try {
            const datos = await obtenerDatosFirebase();
            datosOriginales = datos; // Guarda los datos originales para edición
            window.ultimoIntegranteSeleccionado = integrante; // Guarda el integrante seleccionado
            const agrupado = procesarDatosPorIntegrante(datos, integrante);
            renderizarTabla(agrupado, integrante);
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