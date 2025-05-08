import { 
    MESES, 
    PERSONAS_ESPECIALES,
    groupData, 
    sortData, 
    generateSummaryHTML, 
    showDetails, 
    showError, 
    initMonthFilter 
} from './common.js';

// Configuración
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyEpKHnuP4oFrHTOUwkwfCMX5KUmfv70-QeVu-Rj3rDIsEv_5HgLvLtytjn8NqHFsiq/exec';

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

async function loadData() {
    try {
        console.log('Cargando datos...');
        const timestamp = new Date().getTime();
        const response = await fetch(`${SCRIPT_URL}?action=getResumen&nocache=${timestamp}`);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Datos recibidos:', result);
        
        if (result.error) {
            throw new Error(result.error);
        }
        
        if (!Array.isArray(result)) {
            throw new Error('Formato de datos inválido');
        }
        
        displaySummary(result);
        
    } catch (error) {
        console.error('Error:', error);
        showError(`Error al cargar datos: ${error.message}`);
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