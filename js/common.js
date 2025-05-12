// Funciones comunes para resúmenes

// Obtener meses en español
const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// Función para obtener todos los datos desde Google Apps Script
async function obtenerDatos() {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbzurDUDwPm1H6iBUeT4eSfLTbshYWebsaXBPQMkbLXVZyeAcjPSpc5dm1OYuqAolO0J_w/exec');
    if (!response.ok) throw new Error('Error al obtener datos del servidor');
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

// Validar que un monto sea número positivo
function esMontoValido(monto) {
  const num = parseFloat(monto);
  return !isNaN(num) && num > 0;
}