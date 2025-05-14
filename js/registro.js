// registro.js
import { db } from './firebase-config.js';
import { ref, push, set } from "firebase/database";
import { getCurrentMonthName } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registroForm');
    const integranteSelect = document.getElementById('integrante');
    const montoInput = document.getElementById('monto');
    const descripcionInput = document.getElementById('descripcion');

    const errorIntegrante = document.getElementById('errorIntegrante');
    const errorMonto = document.getElementById('errorMonto');
    const errorDescripcion = document.getElementById('errorDescripcion');
    const formMessage = document.getElementById('formMessage');

    function validate() {
        let valid = true;

        if (!integranteSelect.value) {
            errorIntegrante.classList.remove('hidden');
            valid = false;
        } else {
            errorIntegrante.classList.add('hidden');
        }

        const montoVal = parseFloat(montoInput.value);
        if (isNaN(montoVal) || montoVal <= 0) {
            errorMonto.classList.remove('hidden');
            valid = false;
        } else {
            errorMonto.classList.add('hidden');
        }

        if (!descripcionInput.value.trim()) {
            errorDescripcion.classList.remove('hidden');
            valid = false;
        } else {
            errorDescripcion.classList.add('hidden');
        }

        return valid;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        formMessage.textContent = '';
        formMessage.classList.remove('text-green-600', 'text-red-600');

        if (!validate()) {
            return;
        }

        const data = {
            mes: getCurrentMonthName(),
            integrante: integranteSelect.value,
            monto: parseFloat(montoInput.value),
            descripcion: descripcionInput.value.trim(),
            fecha: new Date().toISOString() // Agregar timestamp para mejor ordenamiento
        };

        try {
            const gastosRef = ref(db, 'gastos');
            const newGastoRef = push(gastosRef);
            await set(newGastoRef, data);

            formMessage.textContent = 'Gasto registrado correctamente.';
            formMessage.classList.add('text-green-600');
            form.reset();
            integranteSelect.selectedIndex = 0;
        } catch (error) {
            console.error("Error al guardar el gasto:", error);
            formMessage.textContent = error.message || 'Error al guardar el gasto.';
            formMessage.classList.add('text-red-600');
        }
    });
});