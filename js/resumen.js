import { 
    MESES, 
    groupData, 
    sortData, 
    generateSummaryHTML, 
    showDetails, 
    showError, 
    initMonthFilter 
} from './common.js';

// Configuración
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzF2TsmFc6PiHw_pJzsc6auvzE7pXBoD8baWyXkl_nrAG4GxH2eDAnruY-AKxmNozbz/exec';

// Elementos del DOM
const elements = {
    monthFilter: document.getElementById('month-filter'),
    applyBtn: document.getElementById('apply-filter'),
    summaryContainer: document.getElementById('summary-container'),
    filterMJCarolina: document.getElementById('filter-mj-carolina'),
    resetBtn: document.getElementById('reset-filters')
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initMonthFilter(elements.monthFilter);
    loadData();
    
    elements.applyBtn.addEventListener('click', loadData);
    elements.filterMJCarolina.addEventListener('click', filterBySpecialPersons);
    elements.resetBtn.addEventListener('click', resetFilters);
});

// Funciones específicas de resumen
async function loadData() {
    try {
        const response = await fetch(`${SCRIPT_URL}?action=getResumen`);
        const data = await response.json();
        displaySummary(filterData(data));
    } catch (error) {
        console.error('Error:', error);
        showError(elements.summaryContainer, 'Error al cargar los datos. Intenta nuevamente.');
    }
}

function filterData(data) {
    let filtered = data;
    const selectedMonth = elements.monthFilter.value;
    
    if (selectedMonth) {
        filtered = filtered.filter(item => item.mes === selectedMonth);
    }
    
    return filtered;
}

function displaySummary(data) {
    const grouped = groupData(data);
    const sorted = sortData(grouped);
    
    elements.summaryContainer.innerHTML = generateSummaryHTML(sorted);
    addDetailsEventListeners();
}

function filterBySpecialPersons() {
    fetch(`${SCRIPT_URL}?action=getResumen`)
        .then(response => response.json())
        .then(data => {
            const filtered = data.filter(item => 
                PERSONAS_ESPECIALES.includes(item.familiar)
            );
            displaySummary(filtered);
            elements.monthFilter.value = ''; 
        })
        .catch(error => showError(elements.summaryContainer, error.message));
}

function resetFilters() {
    elements.monthFilter.value = '';
    loadData();
}

function addDetailsEventListeners() {
    document.querySelectorAll('.details-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const key = this.getAttribute('data-key');
            showDetails(window.groupedData[key].detalles);
        });
    });
}

// Hacer accesible los datos agrupados para los detalles
window.groupedData = {};
