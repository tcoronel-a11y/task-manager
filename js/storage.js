
const CLAVE_TAREAS = "taskManager_tareas";

// Recuperar las tareas guardadas
export function obtenerTareas() {
    try {
        const datos = localStorage.getItem(CLAVE_TAREAS);

        if (datos === null) {
            return null;
        }

        const tareas = JSON.parse(datos);

        return Array.isArray(tareas) ? tareas : null;

    } catch (error) {
        console.error("Error al recuperar las tareas:", error);
        return null;
    }
}

// Guardar las tareas en el navegador
export function guardarTareas(tareas) {
    try {
        localStorage.setItem(
            CLAVE_TAREAS,
            JSON.stringify(tareas)
        );

        return true;

    } catch (error) {
        console.error("Error al guardar las tareas:", error);
        return false;
    }
}

// Comprobar si ya existen tareas guardadas
export function existenTareasGuardadas() {
    return localStorage.getItem(CLAVE_TAREAS) !== null;
}
