# Level-Up Gamer - Tienda Online

Sitio web interactivo y responsivo enfocado en la venta de productos para entusiastas de los videojuegos en Chile, ofreciendo un catálogo dinámico y un sistema de carrito de compras funcional.

Este desarrollo corresponde a la **Evaluación N°2** de la asignatura **Programación Front End**.

---

## 📋 Información Académica

* **Asignatura:** Programación Front End
* **Evaluación:** Evaluación 2 (35%)
* **Tema Asignado:** Forma B - Caso Tienda Level-Up Gamer
* **Estudiante:** Cristian Plaza
* **Sección:** 2026|O TI3V31|V-IEI-N3-P3-C1|V
* **Sede:** INACAP Sede La Granja IEI

---

## 🚀 Características Principales del Proyecto

* **Catálogo de Productos Dinámico:** Integración de un sistema de renderizado en tiempo real que inyecta el listado de productos directamente desde una estructura de datos JSON, permitiendo actualizaciones rápidas del inventario.
* **Carrito de Compras Persistente:** Sistema de compra integrado que utiliza el almacenamiento local (`localStorage`) del navegador para que los clientes no pierdan sus productos seleccionados al recargar o cambiar de página.
* **Sistema de Filtros Inteligente:** Navegación por categorías de productos optimizada mediante JavaScript nativo, mejorando la experiencia de búsqueda del usuario.
* **Validación de Formularios Segura:** Implementación de reglas estrictas en tiempo real para asegurar el ingreso de datos válidos (como dominios de correo específicos) en los módulos de contacto y autenticación.
* **Diseño Inmersivo y Responsivo:** Interfaz gráfica adaptable a cualquier dispositivo móvil o de escritorio, construida con una paleta de colores de alto contraste (Dark/Neon Mode) que refleja la identidad visual del ecosistema gamer.

---

## 🛠️ Tecnologías Utilizadas

* **HTML5:** Marcado semántico y estructuración de contenidos.
* **CSS3:** Estilos unificados, variables corporativas y adaptabilidad móvil.
* **Bootstrap 5.3.3:** Framework base de apoyo para el sistema de grillas y estructura estandarizada.
* **JavaScript (Vanilla JS):** Lógica nativa e independiente para el renderizado del catálogo, almacenamiento local y validación de formularios.

---

## 📂 Estructura del Proyecto

```text
├── index.html               # Portada principal (Home) con secciones requeridas
├── data.json                # Base de datos local de productos
├── README.md                # Documentación del proyecto
├── style.css                # Archivo único de estilos unificados y variables
├── productos.js             # Lógica nativa para inyectar productos y carrito
└── src/                     # Carpeta contenedora de recursos
    └── assets/              # Recursos visuales (logo.svg y favicon.svg vectorizados)

Ejecución en Entorno Local
Clonar el repositorio desde GitHub:
git clone https://github.com/tricicoplot/tienda-levelup-gamer.git

Navegar a la carpeta del proyecto:
cd tienda-levelup-gamer

Visualizar el sitio:

Abre directamente el archivo index.html en tu navegador.

Se recomienda el uso de la extensión Live Server en Visual Studio Code para levantar el entorno local en http://127.0.0.1:5500 y evitar posibles bloqueos de CORS al leer el archivo data.json.

Créditos
Desarrolladores: Cristian Plaza / Fabian Tapia (Según pauta de requerimiento de ambiente de aprendizaje de Inacap)

Año: 2026