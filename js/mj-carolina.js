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
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxbb7sLk49iVIIBQ3As7egMQYQHmJuFm0fNC-OoX5aymNam1tWCVVJLv_YvU722GUcb/exec';

// Elementos del DOM
const elements = {
    monthFilter: document.getElementById('month-filter'),
    applyBtn: document.getElementById('apply-filter'),
    summaryContainer: document.getElementById('summary-container'),
    resetBtn: document.getElementById('reset-filters')
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initMonthFilter(elements.monthFilter);
    loadSpecialData();
    
    elements.applyBtn.addEventListener('click', loadSpecialData);
    elements.resetBtn.addEventListener('click', resetFilters);
});

// Funciones específicas para MJ y Carolina
async function loadSpecialData() {
    try {
        const response = await fetch(`${SCRIPT_URL}?action=getResumen`);
        const data = await response.json();
        
        // Filtrar solo las personas especiales
        const filtered = data.filter(item => 
            PERSONAS_ESPECIALES.includes(item.familiar)
        );
        
        // Aplicar filtro de mes si existe
        const selectedMonth = elements.monthFilter.value;
        const finalData = selectedMonth 
            ? filtered.filter(item => item.mes === selectedMonth)
            : filtered;
        
        displaySummary(finalData);
    } catch (error) {
        console.error('Error:', error);
        showError(elements.summaryContainer, 'Error al cargar los datos. Intenta nuevamente.');
    }
}

function displaySummary(data) {
    const grouped = groupData(data);
    const sorted = sortData(grouped);
    
    elements.summaryContainer.innerHTML = generateSummaryHTML(sorted);
    addDetailsEventListeners();
}

function resetFilters() {
    elements.monthFilter.value = '';
    loadSpecialData();
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