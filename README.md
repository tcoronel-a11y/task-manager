
# TaskManager

Aplicación web para organizar y administrar tareas de forma sencilla, desarrollada como proyecto académico utilizando JavaScript Vanilla ES6+.

## Objetivo

Desarrollar una aplicación interactiva que permita gestionar tareas mediante operaciones CRUD, filtros, búsqueda, ordenamiento y almacenamiento persistente en el navegador.

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript Vanilla ES6+
- API REST JSONPlaceholder
- Fetch API y async/await
- LocalStorage
- Git y GitHub

## Funcionalidades

### Gestión de tareas (CRUD)
- Crear nuevas tareas.
- Editar títulos y descripciones.
- Eliminar tareas.
- Marcar tareas como completadas o pendientes.
- Validar que los campos obligatorios no estén vacíos.

### Filtros y búsqueda
- Visualizar todas las tareas.
- Filtrar tareas pendientes.
- Filtrar tareas completadas.
- Buscar tareas por título en tiempo real.

### Ordenamiento
- Ordenar por fecha de creación.
- Ordenar por prioridad: Alta, Media y Baja.

### Dashboard
- Mostrar el número total de tareas.
- Mostrar las tareas pendientes.
- Mostrar las tareas completadas.
- Actualizar las métricas dinámicamente.

### API REST y almacenamiento
- Consultar tareas iniciales desde JSONPlaceholder.
- Utilizar fetch y async/await.
- Importar tareas cuando no existen datos locales.
- Guardar los cambios en LocalStorage.
- Recuperar las tareas al recargar la aplicación.
- Permitir la gestión de tareas sin conexión una vez cargada la aplicación.

## Arquitectura del proyecto

```text
task-manager/
│
├── index.html
├── styles.css
├── README.md
├── AI_DECLARATION.md
│
└── js/
    ├── app.js
    ├── api.js
    └── storage.js
```

### Descripción de los módulos

- **app.js:** administra la interfaz, los eventos del DOM, las operaciones CRUD, los filtros, la búsqueda, el ordenamiento y el dashboard.
- **api.js:** gestiona la consulta a JSONPlaceholder, la importación inicial y el tratamiento de errores.
- **storage.js:** administra la lectura y escritura de tareas en LocalStorage.

La aplicación utiliza módulos ES6 mediante `import` y `export` para separar responsabilidades.

## API utilizada

JSONPlaceholder:
https://jsonplaceholder.typicode.com/todos

Se utiliza esta API para obtener datos de prueba y realizar la importación inicial de tareas.

## Instalación y ejecución

1. Descargar o clonar el repositorio.
2. Abrir la carpeta del proyecto en Visual Studio Code.
3. Iniciar un servidor local desde la terminal:

```bash
python3 -m http.server 5500
```

4. Abrir en el navegador:

http://localhost:5500

Se recomienda utilizar un servidor local porque el proyecto utiliza módulos JavaScript ES6.

## Persistencia de datos

Las tareas se almacenan en LocalStorage bajo la clave:

`taskManager_tareas`

Los datos se convierten a JSON mediante `JSON.stringify()` y se recuperan mediante `JSON.parse()`.

## Autor

Proyecto académico desarrollado para la asignatura de Programación de Sistemas Web.
