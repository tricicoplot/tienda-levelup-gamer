🎮 Level-Up Gamer - Tienda Online

Sitio web interactivo y responsivo enfocado en la venta de productos para entusiastas de los videojuegos en Chile. El proyecto ofrece un catálogo dinámico, sistema de carrito de compras persistente, validaciones de reglas de negocio y un panel de administración protegido.

Desarrollado como parte de la Evaluación N°2 de la asignatura Programación Front End.
🔗 Visualización en vivo: https://tricicoplot.github.io/tienda-levelup-gamer/

📋 Información Académica

•	Asignatura: Programación Front End
•	Evaluación: Evaluación 2 (35%) 
•	Tema Asignado: Forma B - Caso Tienda Level-Up Gamer 
•	Estudiantes: Cristian Plaza / Fabian Tapia
•	Sección: 2026|O TI3V31|V-IEI-N3-P3-C1|V
•	Sede: INACAP Sede La Granja IEI

🚀 Características Principales

🛒 Interfaz de Tienda (Pública)

•	Catálogo Dinámico: Inyección de productos mediante fetch desde data.json. 
•	Carrito Persistente: Implementación de lógica de carrito con persistencia en localStorage. 
•	Sistema de Descuento: Aplicación de un 20% de descuento mediante código promocional (DUOC o DUOC20). 
•	Filtros Dinámicos: Carga automática de comunas según la región seleccionada.

🛡️ Seguridad y Validaciones (JavaScript Vanilla)

•	Registro: Validación de edad (+18 años) y formato de RUN estricto sin puntos ni guiones. 
•	Login: Filtrado de acceso restringido a correos @inacap.cl, @inacapmail.cl o @gmail.com. 
•	Contacto: Validaciones de campos requeridos y control de dominios de correo permitidos. 

⚙️ Panel de Administración

•	Mantenedores: Gestión completa (CRUD) de productos y usuarios con validaciones de tipo de dato (precios decimales, stock entero). 
•	Control de Accesos: Rutas protegidas según el perfil de usuario (Administrador, Vendedor, Cliente). 

🔐 Acceso al Sistema Administrativo

Para la evaluación de las vistas restringidas, utiliza las siguientes credenciales:
•	Usuario: admin
•	Contraseña: admin123

🚀 Funcionalidades
* ...
* **Mapa de Eventos Gamer**: Visualización interactiva de eventos a nivel nacional para fomentar la participación presencial y la ganancia de puntos LevelUp.
* ...

🛠️ Tecnologías Utilizadas

Frontend: HTML5 (semántico), CSS3 (variables y diseño responsivo), Bootstrap 5.3.3.
Lógica: JavaScript ES6+ (Fetch API, DOM, Eventos, LocalStorage).
Control de Versiones: Git y GitHub Pages.

📂 Estructura del Proyecto

├── index.html                   # Página principal (Home, Catálogo, Mapa y Contacto)
├── data.json                    # Base de datos local de productos 
├── src/                         
│   ├── assets/                  # Logos, imágenes y recursos gráficos
│   ├── components/              # Vistas secundarias
│   │   ├── admin.html           # Dashboard del administrador 
│   │   ├── carrito.html         # Resumen del carrito de compras 
│   │   ├── detalle-blog1.html   # Detalle de noticia #1 
│   │   ├── detalle-blog2.html   # Detalle de noticia #2 
│   │   ├── detalle-producto.html# Vista de detalle de un producto 
│   │   ├── editar-producto.html # Mantenedor de edición 
│   │   ├── editar-usuario.html  # Mantenedor de edición 
│   │   ├── login.html           # Vista de inicio de sesión 
│   │   ├── mapas.html           # Mapa interactivo de eventos nacionales
│   │   ├── nuevo-producto.html  # Mantenedor de creación 
│   │   ├── nuevo-usuario.html   # Mantenedor de creación 
│   │   ├── productos.html       # Catálogo completo 
│   │   └── registro.html        # Registro de usuarios 
│   ├── css/
│   │   └── style.css            # Hoja de estilos única 
│   └── js/
│       ├── app.js               # Lógica del catálogo, carrito y mapa
│       └── formulario.js        # Validaciones JS 
└── README.md                    # Documentación del proyecto

💻 Ejecución Local

Clonar: git clone https://github.com/tricicoplot/tienda-levelup-gamer.git

Ejecutar: Se recomienda usar la extensión Live Server en VS Code para evitar bloqueos de CORS al cargar los archivos .json mediante fetch.

💡 Consideraciones de Desarrollo: Gestión de DescuentosDurante la fase de validación de reglas de negocio, se identificó una inconsistencia entre el requerimiento funcional de otorgar un 20% de descuento a usuarios Duoc y las restricciones técnicas de validación de dominios de correo (limitadas exclusivamente a @inacap.cl, @inacapmail.cl y @gmail.com).Para resolver esta discrepancia manteniendo la integridad del sistema, se tomaron las siguientes decisiones técnicas:Implementación mediante Código de Cupón: Se integró un campo de "Código de Descuento" en la vista del carrito. Los usuarios pueden aplicar el descuento ingresando los códigos DUOC o DUOC20.  Justificación Técnica: Esta solución permite cumplir con el beneficio comercial sin modificar las reglas de validación de correos establecidas en el proyecto, garantizando así la seguridad y la consistencia lógica de las validaciones solicitadas en el anexo de instrucciones.  Escalabilidad: El sistema de cupones es flexible y permite la incorporación de futuros beneficios sin necesidad de alterar las validaciones de acceso de los usuarios.  

👨‍💻 Créditos

Desarrolladores: Cristian Plaza / Fabian Tapia 
Año: 2026