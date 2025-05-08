// Configuración
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyMM0BG0h-PacePHrM0QQO-5oy1px8ptV7qghS9oYEj4i9e_nSh6X-h7n_AFTarg8FI/exec';
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
               'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

// Elementos del DOM
const elements = {
    monthFilter: document.getElementById('month-filter'),
    applyBtn: document.getElementById('apply-filter'),
    summaryContainer: document.getElementById('summary-container')
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initMonthFilter();
    loadData();
    elements.applyBtn.addEventListener('click', loadData);
});

// Funciones principales
function initMonthFilter() {
    elements.monthFilter.innerHTML = MESES.reduce((html, mes) => {
        return html + `<option value="${mes}">${mes}</option>`;
    }, '<option value="">Todos los meses</option>');
}

async function loadData() {
    try {
        const response = await fetch(`${SCRIPT_URL}?action=getResumen`);
        const data = await response.json();
        displaySummary(filterData(data));
    } catch (error) {
        console.error('Error:', error);
        showError('Error al cargar los datos. Intenta nuevamente.');
    }
}

function filterData(data) {
    const selectedMonth = elements.monthFilter.value;
    return selectedMonth 
        ? data.filter(item => item.mes === selectedMonth)
        : data;
}

function displaySummary(data) {
    const grouped = groupData(data);
    const sorted = sortData(grouped);
    
    elements.summaryContainer.innerHTML = generateSummaryHTML(sorted);
    addDetailsEventListeners();
}

// Funciones auxiliares
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

function addDetailsEventListeners() {
    document.querySelectorAll('.details-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const key = this.getAttribute('data-key');
            showDetails(window.groupedData[key].detalles);
        });
    });
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
    
    // Usar un modal en lugar de alert
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

function showError(message) {
    elements.summaryContainer.innerHTML = `
        <div class="error-message">${message}</div>
    `;
}

// Hacer accesible los datos agrupados para los detalles
window.groupedData = {};