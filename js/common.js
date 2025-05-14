// common.js
import { ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { db } from './firebase-config.js';

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

async function obtenerDatosFirebase() {
  try {
    const gastosRef = ref(db, 'gastos');
    const snapshot = await get(gastosRef); // Ahora get está correctamente importada
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Object.keys(data).map(key => ({ id: key, ...data[key] }));
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error al obtener datos de Firebase:", error);
    throw error;
  }
}

function esMontoValido(monto) {
  const num = parseFloat(monto);
  return !isNaN(num) && num > 0;
}

function getCurrentMonthName() {
    return MESES[new Date().getMonth()];
}

export { MESES, obtenerDatosFirebase, esMontoValido, getCurrentMonthName };
