// CONSTANTES COMPARTIDAS
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
               'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const PERSONAS_ESPECIALES = ['Maria Jose', 'Carolina'];

// FUNCIONES UTILITARIAS
function groupData(data) {
    return data.reduce((acc, item) => {
        const key = `${item.familiar}-${item.mes}`;
        if (!acc[key]) {
            acc[key] = {
                familiar: item.familiar,
                mes: item.mes,
                total: 0,
                detalles: []
            };
        }
        acc[key].total += parseFloat(item.monto);
        acc[key].detalles.push(item);
        return acc;
    }, {});
}

function sortData(groupedData) {
    return Object.values(groupedData).sort((a, b) => 
        a.familiar.localeCompare(b.familiar) || 
        MESES.indexOf(a.mes) - MESES.indexOf(b.mes)
    );
}

function generateSummaryHTML(data) {
    return data.map(item => `
        <div class="summary-card">
            <div class="summary-header">
                <span class="person-name">${item.familiar}</span>
                <span class="month">${item.mes}</span>
            </div>
            <div class="amount">Total: $${item.total.toFixed(2)}</div>
            <button class="details-btn" data-key="${item.familiar}-${item.mes}">
                Ver Detalles
            </button>
        </div>
    `).join('');
}

function showDetails(details) {
    const detailsHTML = `
        <h3>Detalles de Gastos</h3>
        <table class="details-table">
            <tr>
                <th>Fecha</th>
                <th>Descripción</th>
                <th>Monto</th>
            </tr>
            ${details.map(d => `
                <tr>
                    <td>${d.fecha}</td>
                    <td>${d.descripcion || 'Sin descripción'}</td>
                    <td>$${parseFloat(d.monto).toFixed(2)}</td>
                </tr>
            `).join('')}
        </table>
    `;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            ${detailsHTML}
            <button class="close-btn">Cerrar</button>
        </div>
    `;
    
    modal.querySelector('.close-btn').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    document.body.appendChild(modal);
}

function showError(container, message) {
    container.innerHTML = `
        <div class="error-message">${message}</div>
    `;
}

function initMonthFilter(selectElement) {
    selectElement.innerHTML = MESES.reduce((html, mes) => {
        return html + `<option value="${mes}">${mes}</option>`;
    }, '<option value="">Todos los meses</option>');
}