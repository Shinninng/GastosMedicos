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

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyEpKHnuP4oFrHTOUwkwfCMX5KUmfv70-QeVu-Rj3rDIsEv_5HgLvLtytjn8NqHFsiq/exec';

const elements = {
    monthFilter: document.getElementById('month-filter'),
    applyBtn: document.getElementById('apply-filter'),
    summaryContainer: document.getElementById('summary-container'),
    resetBtn: document.getElementById('reset-filters')
};

// Almacena los datos originales
let originalData = [];

document.addEventListener('DOMContentLoaded', () => {
    initMonthFilter(elements.monthFilter);
    loadData();
    
    elements.applyBtn.addEventListener('click', applyFilters);
    elements.resetBtn.addEventListener('click', resetFilters);
});

async function loadData() {
    try {
        elements.summaryContainer.innerHTML = '<div class="loading">Cargando datos...</div>';
        
        const timestamp = new Date().getTime();
        const response = await fetch(`${SCRIPT_URL}?action=getResumen&nocache=${timestamp}`);
        
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        
        const result = await response.json();
        
        if (result.error) throw new Error(result.error);
        if (!Array.isArray(result)) throw new Error('Formato de datos inválido');
        
        originalData = result;
        applyFilters();
        
    } catch (error) {
        console.error('Error:', error);
        showError(elements.summaryContainer, `Error al cargar datos: ${error.message}`);
    }
}

function applyFilters() {
    try {
        let filteredData = [...originalData];
        const selectedMonth = elements.monthFilter.value;
        
        if (selectedMonth) {
            filteredData = filteredData.filter(item => item.mes === selectedMonth);
        }
        
        const grouped = groupData(filteredData);
        const sorted = sortData(grouped);
        
        // Guarda los datos agrupados para los detalles
        window.groupedData = grouped;
        
        elements.summaryContainer.innerHTML = generateSummaryHTML(sorted);
        addDetailsEventListeners();
        
    } catch (error) {
        showError(elements.summaryContainer, error.message);
    }
}

function resetFilters() {
    elements.monthFilter.value = '';
    applyFilters();
}

function addDetailsEventListeners() {
    document.querySelectorAll('.details-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const key = this.getAttribute('data-key');
            if (window.groupedData && window.groupedData[key]) {
                showDetails(window.groupedData[key].detalles);
            }
        });
    });
}