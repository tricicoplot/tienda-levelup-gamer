# 🎮 Level-Up Gamer - Tienda Online

Sitio web interactivo y responsivo enfocado en la venta de productos para entusiastas de los videojuegos en Chile, ofreciendo un catálogo dinámico, un sistema de carrito de compras persistente y un panel de administración.

Este desarrollo corresponde a la **Evaluación N°2** de la asignatura **Programación Front End**.

🔗 **Visualización en vivo:** [https://tricicoplot.github.io/tienda-levelup-gamer/](https://tricicoplot.github.io/tienda-levelup-gamer/)

---

## 📋 Información Académica

* **Asignatura:** Programación Front End
* **Evaluación:** Evaluación 2 (35%)
* **Tema Asignado:** Forma B - Caso Tienda Level-Up Gamer
* **Estudiantes:** Cristian Plaza / Fabian Tapia
* **Sección:** 2026|O TI3V31|V-IEI-N3-P3-C1|V
* **Sede:** INACAP Sede La Granja IEI

---

## 🚀 Características Principales del Proyecto

### 🛒 Interfaz de Tienda (Cliente)
* **Catálogo de Productos Dinámico:** Renderizado en tiempo real que inyecta el listado de productos directamente desde un archivo `data.json` mediante la API Fetch.
* **Carrito de Compras Persistente:** Uso de `localStorage` para guardar productos, permitiendo modificar cantidades o eliminar ítems sin perder la información al recargar la página.
* **Lógica de Descuentos:** Sistema en la vista de pago que aplica matemáticamente un 20% de descuento al total al ingresar el cupón `DUOC` o `DUOC20`.
* **Selectores Anidados Dinámicos:** Carga y actualización automática de los menús desplegables de "Comuna" dependiendo de la "Región" seleccionada por el usuario.

### 🛡️ Seguridad y Validaciones (JavaScript Vanilla)
Las vistas interactivas cuentan con reglas de negocio estrictas programadas en el cliente:
* **Registro de Usuarios:** * Restricción exclusiva para mayores de 18 años (cálculo matemático de edad basado en el objeto `Date`).
  * Validación mediante Expresión Regular para exigir un RUN chileno estricto (entre 7 y 9 caracteres, terminación opcional en K, sin puntos ni guiones).
* **Autenticación (Login):** Filtro de acceso exclusivo para correos con dominios `@inacap.cl`, `@inacapmail.cl` o `@gmail.com`, y límite de longitud en contraseñas (4 a 10 caracteres).
* **Formulario de Contacto:** Filtro de envío para correos `@inacap.cl`, `@profesor.inacap.cl` o `@gmail.com`, con límite estricto de 500 caracteres en el mensaje.

### ⚙️ Panel de Administración (Mantenedores)
* **Gestión de Productos:** Vistas de creación y edición (`nuevo-producto.html`, `editar-producto.html`). Incluye bloqueos lógicos para impedir el ingreso de precios negativos o stock con valores decimales.
* **Gestión de Usuarios:** Formularios para el control de clientes, vendedores y administradores (`nuevo-usuario.html`, `editar-usuario.html`), reutilizando la lógica de asignación dinámica de regiones y comunas.

---

## 🛠️ Tecnologías Utilizadas

* **HTML5:** Marcado semántico y estructuración de contenidos.
* **CSS3:** Estilos unificados, variables corporativas y adaptabilidad móvil.
* **Bootstrap 5.3.3:** Framework base de apoyo para el sistema de grillas y estructura estandarizada.
* **JavaScript (ES6+):** Manipulación del DOM, eventos, Promesas (`fetch`), almacenamiento local y validación de formularios.
* **Git & GitHub:** Control de versiones y despliegue continuo mediante GitHub Pages.

---

## 📂 Estructura del Proyecto

```text
├── index.html                   # Portada principal (Home) de la tienda
├── data.json                    # Base de datos local de productos
├── regiones.json                # Base de datos local de regiones y comunas
├── README.md                    # Documentación del proyecto
├── src/                         
│   ├── components/              # Vistas secundarias y Panel de Administración
│   │   ├── admin.html           # Dashboard del administrador
│   │   ├── carrito.html         # Resumen de compra y cupones
│   │   ├── nuevo-producto.html  # Mantenedor de creación de productos
│   │   ├── nuevo-usuario.html   # Mantenedor de creación de usuarios
│   │   ├── editar-producto.html # Mantenedor de edición de productos
│   │   ├── editar-usuario.html  # Mantenedor de edición de usuarios
│   │   ├── ordenes.html         # Vista de órdenes para perfil vendedor
│   │   └── ...                  # Vistas de blogs, login, etc.
│   ├── css/
│   │   └── style.css            # Archivo único de estilos unificados
│   └── js/
│       └── app.js               # Lógica central (Catálogo, Carrito, Validaciones)
└── assets/                      # Recursos visuales (imágenes, logos)

💻 Ejecución en Entorno Local
Clonar el repositorio desde GitHub:
git clone [https://github.com/tricicoplot/tienda-levelup-gamer.git](https://github.com/tricicoplot/tienda-levelup-gamer.git)

Navegar a la carpeta del proyecto:
cd tienda-levelup-gamer

Visualizar el sitio:
Abre directamente el archivo index.html en tu navegador.

Nota: Para el correcto funcionamiento de la carga dinámica de productos (fetch al archivo data.json), se recomienda el uso de la extensión Live Server en Visual Studio Code para levantar el entorno local en http://127.0.0.1:5500 y evitar posibles bloqueos de CORS del navegador.

## 👨‍💻 Créditos
**Desarrolladores:** Cristian Plaza / Fabian Tapia (Según pauta de requerimiento de ambiente de aprendizaje de Inacap).

**Año:** 2026