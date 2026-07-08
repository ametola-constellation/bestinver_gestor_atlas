# Propuesta Técnica y Plan de Migración: Proceso de Alta (BESTINVER)
## Migración a React y Adecuación de Accesibilidad (WCAG 2.2 AA - Ley 11/2023)

---

## 1. Introducción y Contexto

El Proceso de Alta actual de BESTINVER presenta limitaciones tanto tecnológicas como de cumplimiento normativo. A nivel técnico, el uso de **Knockout.js** supone trabajar con una tecnología obsoleta que dificulta el mantenimiento, la escalabilidad y la retención de talento. A nivel normativo, la auditoría realizada con la herramienta **EyeAble** ha detectado múltiples fallos que impiden cumplir con la **Directiva Europea de Accesibilidad (UE) 2019/882** y su transposición en España mediante la **Ley 11/2023**.

Para garantizar la conformidad con el estándar **WCAG 2.2 AA**, se propone un **enfoque de borrón y cuenta nueva (Greenfield)**: reconstruir por completo el flujo de Altas utilizando una versión moderna de **React**. Esto no solo resolverá de raíz los problemas de contraste y diseño, sino también los fallos estructurales internos (como los atributos ARIA duplicados).

---

## 2. Alcance del Proyecto

El proyecto se dividirá en dos grandes bloques que se ejecutarán de forma simultánea:

1. **Migración Tecnológica:** Sustitución completa de Knockout.js por **React (v18+)** + TypeScript.
2. **Rediseño UI y Accesibilidad:** Aplicación estricta de las correcciones de diseño visual y semántica HTML exigidas por la auditoría.

---

## 3. Plan de Acción de Accesibilidad (UI/UX)

Se implementarán de manera sistemática los siguientes cambios de diseño detallados en el informe:

### 3.1. Normalización de la Paleta Cromática y Contrastes
* **Textos Generales y Descripciones:** Todo texto informativo o secundario que actualmente no supere el ratio de contraste pasará al gris accesible **#6E6E6E**.
* **Elementos de Acción y Énfasis (Dorado):** Los botones principales (`CONTINUAR`, `GUARDAR COTITULAR`), números de pasos del *stepper* y círculos activos adoptarán el color **#BA853B**.
* **Enlaces, Alertas y Navegación Secundaria (Rojo):** Los botones y enlaces como `ATRÁS`, `RESUMEN`, `EDITAR`, `CANCELAR`, `ADJUNTAR DOCUMENTOS`, los links a documentos PDF y el enlace de la política de privacidad se unificarán en el color rojo **#9A0C0C**.

### 3.2. Cambios Estructurales en Vistas Clave
* **Cabecera Global:** Se elimina el fondo dorado actual. Pasará a tener un **fondo blanco con una fina línea gris inferior**, mimetizando el diseño actual del área de cliente. El texto *"HAZTE INVERSOR"* irá en negro y los textos/iconos de soporte de la derecha en **#6E6E6E**.
* **Selector de Productos:** Se elimina el comportamiento de "cajita deshabilitada/grisada". Todas las tarjetas de producto mantendrán visualmente el mismo tono de gris y negro. La selección se indicará **exclusivamente** mediante un borde dorado y un icono de *check* en color **#BA853B**.
* **Formularios y Textos de Soporte:** Los textos de ayuda (ej. *"Ejemplos NIF: 12345678Z"*), casillas de verificación de privacidad y textos de error se adaptarán a **#6E6E6E**.
* **Aumento de Tipografía:** Se incrementará en **2 puntos (2pt / 2px equivalentes)** el tamaño de los textos críticos identificados (etiquetas de inputs, campos del resumen lateral, etc.) de forma fluida y proporcional según los distintos *breakpoints* de pantalla.

---

## 4. Arquitectura Técnica (La Solución React)

Rehacer el flujo desde cero con React nos permite asegurar el cumplimiento del estándar WCAG sin los parches que requeriría la plataforma actual:

* **Semántica HTML5 Nativa:** Sustitución de la lógica de bindings complejos de Knockout por elementos nativos de React estructurados con etiquetas semánticas (`<main>`, `<section>`, `<nav>`, `<fieldset>`, `<label>`).
* **Saneamiento de IDs y Atributos ARIA:** Corrección inmediata de errores críticos detectados por la auditoría (como *"El valor del atributo ARIA ID debe ser único"*). React gestionará de forma dinámica la unicidad de los IDs en el renderizado de componentes reutilizables.
* **Componentes Aislados y Reutilizables:** Creación de una librería interna de componentes (Inputs, Buttons, Cards, Steppers) con accesibilidad nativa ya integrada de serie utilizando estándares como *Radix UI* o *React Aria* si fuera necesario.

---

## 5. Estimación y Fases del Proyecto

Al tratarse de un flujo crítico ("Digital Sales") con un número considerable de vistas, validaciones lógicas complejas, tests de conveniencia/conocimiento y flujos de firma digital (SMS/Manual), el proyecto se categoriza como de **Complejidad Alta**. 

Se propone un desarrollo estructurado en **4 fases**:

| Fase | Descripción | Entregables principales |
| :--- | :--- | :--- |
| **Fase 1: Auditoría Técnica y Setup** | Análisis de las APIs actuales que consumía Knockout y configuración del nuevo entorno React. | Documento de integración de APIs y repositorio base. |
| **Fase 2: Maquetación y Componentes (UI)** | Desarrollo de la librería de componentes accesibles con la nueva paleta de colores. | *Storybook* o catálogo de componentes accesibles. |
| **Fase 3: Lógica de Negocio y Flujos** | Implementación de las pantallas de Datos Personales, Selección de Inversión, Tests y Firma. | Flujo de alta completamente funcional en entorno de desarrollo. |
| **Fase 4: QA de Accesibilidad y Despliegue** | Pruebas exhaustivas con lectores de pantalla, navegación por teclado y validación final con EyeAble. | Certificado de conformidad WCAG 2.2 AA y paso a producción. |

---

## 6. Conclusión y Valoración Comercial (Para el Cliente)

Tirar la interfaz actual de Knockout a la basura y rehacerla en React puede parecer un esfuerzo drástico, pero es **la única inversión financieramente viable a medio plazo** por tres motivos:

1. **Blindaje Legal:** Modificar el código actual en Knockout para cumplir con la Ley 11/2023 requiere una cantidad de horas de desarrollo similar o superior, con el riesgo latente de no superar una auditoría legal estricta.
2. **Mejora en Conversión:** Un flujo de alta accesible, con textos más grandes (+2pt), contrastes limpios y sin elementos que confundan (como el gris de las tarjetas de producto), reducirá drásticamente la tasa de abandono en el funnel de ventas.
3. **Mantenimiento Operativo:** El coste de añadir nuevas características al flujo en el futuro se reducirá a una fracción si se utiliza un ecosistema moderno como React.