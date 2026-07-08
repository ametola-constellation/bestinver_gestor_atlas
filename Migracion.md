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

### 2.1. Alcance Real Detectado en el Repositorio

El análisis técnico del código fuente confirma que **Knockout no es una dependencia puntual**, sino la base de interacción del frontend del proyecto `BESTINVER.GestorAltas.Web.Public`.

Este proyecto es una aplicación **ASP.NET Core MVC** completa. Por tanto, contiene backend y frontend en el mismo proyecto:

* **Backend ASP.NET Core:** `Program.cs`, `Startup.cs`, `Controllers`, `Models`, `Services`, `Profiles`.
* **Vistas servidor Razor:** `Views/**/*.cshtml`.
* **Frontend cliente:** `wwwroot/js`, `wwwroot/css`, `bundleconfig.json`, `gulpfile.js`, `package.json`.

La migración solicitada de **Knockout a React** afecta principalmente a las vistas Razor y al JavaScript cliente del módulo público de altas. El backend ASP.NET Core podría mantenerse, aunque será necesario adaptar o normalizar varios endpoints para que React consuma contratos JSON más estables.

#### Superficie Knockout Detectada

| Métrica | Resultado |
| :--- | ---: |
| Vistas Razor totales en `BESTINVER.GestorAltas.Web.Public/Views` | 192 |
| Vistas Razor con `data-bind`, `<!-- ko -->` o `ko.applyBindings` | 168 |
| Ocurrencias de bindings Knockout en Razor | 4.660 |
| Archivos JavaScript con uso directo de `ko.` | 12 |
| Ocurrencias `ko.` en JavaScript | 3.059 |
| Líneas aproximadas en los JS principales vinculados a Knockout/modelos | 32.784 |

Distribución por área funcional:

| Área | Vistas totales | Vistas afectadas | Bindings detectados |
| :--- | ---: | ---: | ---: |
| `Register` | 47 | 47 | 1.364 |
| `Juridica` | 48 | 48 | 1.237 |
| `Extranjero` | 44 | 44 | 1.330 |
| `Remediacion` | 35 | 28 | 726 |
| `Home` | 2 | 1 | 3 |
| `Landing` | 1 | 0 | 0 |
| `Shared` | 12 | 0 | 0 |
| `Error` | 1 | 0 | 0 |

Esto implica que la sustitución de Knockout no se limita a reemplazar una librería npm. Requiere reimplementar el comportamiento de formularios, validaciones, navegación por pasos, serialización de datos, llamadas AJAX, gestión de estado, tests de conveniencia/conocimiento y firma documental.

### 2.2. Elementos a Retirar o Sustituir de Knockout

Para considerar completada la migración, habría que eliminar o sustituir los siguientes elementos:

| Elemento actual | Ubicación | Acción en React |
| :--- | :--- | :--- |
| Dependencia `knockout` | `BESTINVER.GestorAltas.Web.Public/package.json` | Eliminar dependencia y sustituir el modelo reactivo por estado React. |
| Plugin `knockout.validation.js` | `BESTINVER.GestorAltas.Web.Public/wwwroot/js/knockout.validation.js` | Sustituir por validación React/TypeScript, por ejemplo React Hook Form + Zod/Yup, o validaciones propias. |
| Bundle `bundle-knockoutjs.js/min.js` | `BESTINVER.GestorAltas.Web.Public/bundleconfig.json` | Eliminar del proceso Gulp cuando ya no haya vistas dependientes. |
| Referencias a `bundle-knockoutjs` | Layouts Razor en `Views/Shared` | Retirar scripts de los layouts al finalizar la migración. |
| `data-bind` | Vistas Razor `Views/Register`, `Views/Juridica`, `Views/Extranjero`, `Views/Remediacion` | Rehacer como componentes React controlados. |
| Comentarios virtuales `<!-- ko -->` | Vistas Razor | Sustituir por renderizado condicional React. |
| `ko.applyBindings` | Vistas principales de cada flujo | Sustituir por montaje de React (`createRoot`) o por rutas SPA. |
| `ko.observable`, `ko.observableArray`, `ko.computed`, `ko.pureComputed` | JS de `wwwroot/js` | Sustituir por `useState`, `useReducer`, stores o formularios controlados. |
| `ko.validation.group`, `extend(...)` | Modelos JS actuales | Sustituir por esquemas de validación reutilizables. |
| `ViewModelToJSON` | Modelos JS actuales | Sustituir por mappers TypeScript hacia DTOs de API. |
| ViewModels globales | `viewmodel.js`, `viewmodel-juridicas.js`, `viewmodel-extranjero.js`, `remediacion.js` | Reimplementar como módulos React/TypeScript por flujo. |
| Helpers acoplados a Knockout | `utils.js`, autocomplete, navigation, request scripts | Revisar uno a uno; algunos pueden conservarse temporalmente, otros deben migrarse. |

Archivos de mayor impacto:

* `BESTINVER.GestorAltas.Web.Public/wwwroot/js/viewmodel.js`
* `BESTINVER.GestorAltas.Web.Public/wwwroot/js/models.js`
* `BESTINVER.GestorAltas.Web.Public/wwwroot/js/request.js`
* `BESTINVER.GestorAltas.Web.Public/wwwroot/js/juridica/viewmodel-juridicas.js`
* `BESTINVER.GestorAltas.Web.Public/wwwroot/js/juridica/models-juridicas.js`
* `BESTINVER.GestorAltas.Web.Public/wwwroot/js/juridica/request-juridicas.js`
* `BESTINVER.GestorAltas.Web.Public/wwwroot/js/extranjero/viewmodel-extranjero.js`
* `BESTINVER.GestorAltas.Web.Public/wwwroot/js/extranjero/model-extranjero.js`
* `BESTINVER.GestorAltas.Web.Public/wwwroot/js/extranjero/request-extranjero.js`
* `BESTINVER.GestorAltas.Web.Public/wwwroot/js/remediacion/remediacion.js`
* `BESTINVER.GestorAltas.Web.Public/Views/Register/**/*.cshtml`
* `BESTINVER.GestorAltas.Web.Public/Views/Juridica/**/*.cshtml`
* `BESTINVER.GestorAltas.Web.Public/Views/Extranjero/**/*.cshtml`
* `BESTINVER.GestorAltas.Web.Public/Views/Remediacion/**/*.cshtml`

El proyecto `BESTINVER.GestorAltas.Web.Management` no presenta uso relevante de Knockout en el análisis realizado. La migración debe centrarse en `BESTINVER.GestorAltas.Web.Public`.

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

### 5.1. Estimación de Esfuerzo

La estimación se basa en una migración completa del frontend público afectado por Knockout, manteniendo el backend ASP.NET Core como base de integración. Es una estimación preliminar y debe validarse con acceso a entorno, APIs, datos de prueba, credenciales y criterios funcionales definitivos.

| Bloque | Esfuerzo estimado |
| :--- | ---: |
| Auditoría funcional, contratos de API y plan de migración detallado | 10 - 15 jornadas |
| Setup React + TypeScript, build, integración con ASP.NET Core y CI/CD | 10 - 15 jornadas |
| Sistema de diseño accesible: formularios, botones, stepper, errores, modales | 20 - 30 jornadas |
| Migración flujo selección producto y alta física (`Register`) | 35 - 50 jornadas |
| Migración flujo persona jurídica (`Juridica`) | 35 - 55 jornadas |
| Migración flujo extranjero (`Extranjero`) | 30 - 45 jornadas |
| Migración flujo remediación (`Remediacion`) | 30 - 45 jornadas |
| Firma digital, documentos, recuperación/envío y componentes externos | 20 - 35 jornadas |
| Adaptación backend/API, DTOs, antiforgery, sesión y compatibilidad | 20 - 35 jornadas |
| QA funcional, regresión, accesibilidad WCAG 2.2 AA y soporte UAT | 35 - 55 jornadas |
| Gestión técnica, coordinación, documentación y despliegue | 15 - 25 jornadas |

**Rango total recomendado:** entre **260 y 410 jornadas**.

Este rango contempla incertidumbre técnica por:

* Dependencia de microservicios externos y datos de prueba.
* Falta de una separación clara entre frontend y backend en las vistas Razor actuales.
* Validaciones de negocio repartidas entre Razor, JavaScript y controladores.
* Integraciones sensibles: firma digital, documentos, DNI, remediación, Identity/LDAP y sesión.
* Necesidad de superar una auditoría de accesibilidad, no solo de replicar pantallas visuales.

### 5.2. Estimación Económica Orientativa

Para una propuesta comercial, se recomienda trabajar con una **tarifa media ponderada de 500 € - 650 € por jornada**, mezclando perfiles de arquitectura/frontend senior, backend .NET, QA/accesibilidad y gestión técnica.

| Escenario | Alcance | Jornadas | Coste orientativo |
| :--- | :--- | ---: | ---: |
| **MVP limitado** | Solo un flujo acotado, por ejemplo selección + alta física básica. No elimina Knockout del módulo completo. | 80 - 130 | 40.000 € - 84.500 € |
| **Migración funcional completa** | Migración de los flujos públicos principales a React, manteniendo backend ASP.NET Core. | 260 - 410 | 130.000 € - 266.500 € |
| **Migración completa + hardening alto** | Incluye margen reforzado para accesibilidad, UAT extendido, documentación, soporte a despliegue y estabilización. | 350 - 500 | 175.000 € - 325.000 € |

**Recomendación comercial:** presentar al cliente un rango de **150.000 € - 250.000 €** para la migración completa razonable, dejando fuera cambios no identificados de backend, rediseño de negocio, nuevas integraciones o reconstrucción completa de APIs.

Si se quiere reducir riesgo, se puede presupuestar una primera fase cerrada de **auditoría técnica y prototipo React** de **15.000 € - 25.000 €**. Esa fase debería entregar:

* Mapa definitivo de flujos y pantallas.
* Contratos API necesarios para React.
* Prototipo navegable de un flujo representativo.
* Estimación cerrada por fases para el resto del proyecto.
* Lista de riesgos bloqueantes antes de comprometer precio cerrado.

---

## 6. Conclusión y Valoración Comercial (Para el Cliente)

Tirar la interfaz actual de Knockout a la basura y rehacerla en React puede parecer un esfuerzo drástico, pero es **la única inversión financieramente viable a medio plazo** por tres motivos:

1. **Blindaje Legal:** Modificar el código actual en Knockout para cumplir con la Ley 11/2023 requiere una cantidad de horas de desarrollo similar o superior, con el riesgo latente de no superar una auditoría legal estricta.
2. **Mejora en Conversión:** Un flujo de alta accesible, con textos más grandes (+2pt), contrastes limpios y sin elementos que confundan (como el gris de las tarjetas de producto), reducirá drásticamente la tasa de abandono en el funnel de ventas.
3. **Mantenimiento Operativo:** El coste de añadir nuevas características al flujo en el futuro se reducirá a una fracción si se utiliza un ecosistema moderno como React.
