# Plan Jira y timeline - Migracion Web.Public de Knockout a React

## 1. Objetivo

Este documento baja a tareas el alcance de migrar la parte Knockout del proyecto `BESTINVER.GestorAltas.Web.Public` a React.

La migracion no es solo cambiar una libreria JavaScript por otra. En este proyecto Knockout esta mezclado con:

- Vistas Razor (`.cshtml`) que renderizan HTML y bindings `data-bind`.
- ViewModels JavaScript grandes en `wwwroot/js`.
- Llamadas AJAX a controladores ASP.NET Core.
- Flujos de firma, documentos, tests de conveniencia/conocimiento y validaciones de formularios.
- Layouts Razor que cargan scripts y exponen datos iniciales desde servidor.

Por tanto, la unidad real de trabajo para Jira no debe ser "quitar Knockout", sino migrar flujo por flujo y dejar cada flujo probado.

## 2. Lectura del timeline

La estimacion anterior de cientos de jornadas debe leerse como jornadas/persona, no como calendario lineal.

| Escenario | Equipo efectivo | Calendario orientativo | Comentario |
| --- | ---: | ---: | --- |
| MVP solo flujo `Register` | 3-4 FTE | 8-12 semanas | Sirve para validar arquitectura, accesibilidad, integracion con backend y estrategia de convivencia Razor/React. |
| Migracion completa con alcance controlado | 4-5 FTE | 5-8 meses | Escenario razonable si el cliente facilita entornos, datos de prueba, criterios funcionales y validacion semanal. |
| Migracion completa con redescubrimiento funcional alto | 3-4 FTE | 7-10 meses | Riesgo alto si no hay documentacion funcional, datos reales de prueba ni propietarios de negocio disponibles. |

Equipo minimo recomendado:

- 1 Tech Lead / Arquitecto frontend.
- 2 Frontend React.
- 1 Backend .NET para contratos, endpoints, autenticacion, datos iniciales y despliegue.
- 1 QA funcional/accesibilidad, idealmente desde el inicio.
- Soporte puntual DevOps para Docker, pipelines y entornos.

## 3. Alcance medido en codigo

Medicion realizada sobre `BESTINVER.GestorAltas.Web.Public`. La ultima columna cuenta lineas Razor donde aparece `data-bind`, `ko.` o comentarios virtuales `<!-- ko -->`; es una medida de complejidad relativa, no un conteo exacto de componentes.

| Area | Vistas Razor totales | Vistas con Knockout | Lineas KO/data-bind aprox. |
| --- | ---: | ---: | ---: |
| `Register` | 47 | 47 | 1606 |
| `Juridica` | 48 | 48 | 1388 |
| `Extranjero` | 44 | 44 | 1564 |
| `Remediacion` | 35 | 28 | 820 |
| `Home` | 2 | 1 | 3 |
| `Landing` | 1 | 0 | 0 |
| `Shared` | 12 | 0 | 0 |
| `Error` | 1 | 0 | 0 |
| **Total** | **192** | **168** | **5381** |

JavaScript Knockout localizado:

| Archivo | Lineas aprox. | Rol |
| --- | ---: | --- |
| `wwwroot/js/viewmodel.js` | 4299 | ViewModels principales de persona fisica / registro. |
| `wwwroot/js/models.js` | 4953 | Modelos de dominio del flujo de registro. |
| `wwwroot/js/juridica/viewmodel-juridicas.js` | 2779 | ViewModels principales del flujo juridico. |
| `wwwroot/js/juridica/models-juridicas.js` | 6084 | Modelos de dominio del flujo juridico. |
| `wwwroot/js/extranjero/viewmodel-extranjero.js` | 3976 | ViewModels principales del flujo extranjero. |
| `wwwroot/js/extranjero/model-extranjero.js` | 4895 | Modelos de dominio del flujo extranjero. |
| `wwwroot/js/remediacion/remediacion.js` | 5798 | ViewModel y modelos del flujo de remediacion. |
| `wwwroot/js/request.js` | 588 | Cliente AJAX registro. |
| `wwwroot/js/juridica/request-juridicas.js` | 418 | Cliente AJAX juridicas. |
| `wwwroot/js/extranjero/request-extranjero.js` | 588 | Cliente AJAX extranjero. |

## 4. Entrypoints Knockout actuales

Estos puntos montan Knockout con `ko.applyBindings` y son los primeros candidatos para crear hosts React equivalentes.

| Flujo | Vista | ViewModel actual | Accion |
| --- | --- | --- | --- |
| Register | `Views/Register/Index.cshtml` | `SelectProductViewModel` | Sustituir selector de producto por componente React o pantalla React completa. |
| Register | `Views/Register/PersonalDataView.cshtml` | `ViewModel` | Crear host React para alta completa de persona fisica. |
| Register | `Views/Register/RecoverySignature.cshtml` | `RecoverySignatureViewModel` | Migrar recuperacion de firma. |
| Register | `Views/Register/SendDocument.cshtml` | `SendDocumentViewModel` | Migrar envio/subida de documento. |
| Juridica | `Views/Juridica/Index.cshtml` | `SelectProductViewModel` | Sustituir selector de producto juridico. |
| Juridica | `Views/Juridica/PersonalDataView.cshtml` | `ViewModel` | Crear host React para alta juridica completa. |
| Juridica | `Views/Juridica/RecoverySignature.cshtml` | `RecoverySignatureViewModel` | Migrar recuperacion de firma juridica. |
| Extranjero | `Views/Extranjero/Index.cshtml` | `SelectProductViewModel` | Sustituir selector de producto extranjero. |
| Extranjero | `Views/Extranjero/PersonalDataView.cshtml` | `ViewModel` | Crear host React para alta extranjero completa. |
| Extranjero | `Views/Extranjero/RecoverySignature.cshtml` | `RecoverySignatureViewModel` | Migrar recuperacion de firma extranjero. |
| Remediacion | `Views/Remediacion/RemediacionView.cshtml` | `remediacionViewModel` | Crear host React para remediacion. |

Nota de revision: existe `SendDocumentViewModel` en `wwwroot/js/extranjero/viewmodel-extranjero.js`, pero no se ha encontrado `Views/Extranjero/SendDocument.cshtml` ni `ko.applyBindings` asociado. Hay que validarlo en descubrimiento porque puede ser codigo muerto, una pantalla eliminada o una funcionalidad invocada por otra ruta.

## 5. Estructura recomendada de Jira

| Epic | Nombre | Objetivo | Esfuerzo orientativo |
| --- | --- | --- | ---: |
| EP00 | Descubrimiento funcional y tecnico | Cerrar flujos, datos de prueba, entornos, contratos y riesgos. | 10-15 jp |
| EP01 | Plataforma React en Web.Public | Introducir build React, TypeScript, lint, tests y estrategia de montaje en Razor. | 10-15 jp |
| EP02 | Sistema UI y accesibilidad | Componentes base accesibles para formularios, modales, errores y navegacion. | 20-30 jp |
| EP03 | Capa de dominio frontend | Rehacer modelos Knockout como estado React, validadores y cliente API tipado. | 20-35 jp |
| EP04 | Flujo Register | Migrar alta persona fisica. | 45-70 jp |
| EP05 | Flujo Juridica | Migrar alta persona juridica y titulares reales. | 45-70 jp |
| EP06 | Flujo Extranjero | Migrar alta extranjero y sus variantes de tests/documentacion. | 40-65 jp |
| EP07 | Flujo Remediacion | Migrar pantallas de remediacion fisica/juridica. | 35-55 jp |
| EP08 | Firma y documentos | Migrar subida, descarga, validacion y firma. | 25-40 jp |
| EP09 | Backend y contratos | Adaptar endpoints, DTOs, errores, bootstrap de datos y compatibilidad durante la convivencia. | 20-35 jp |
| EP10 | QA, regresion y accesibilidad | Pruebas funcionales, visuales, E2E, WCAG y UAT. | 35-60 jp |
| EP11 | Release, despliegue y retirada KO | Feature flags, despliegue progresivo, retirada de scripts y limpieza final. | 10-20 jp |

Rango agregado orientativo: **260-510 jornadas/persona**.

La parte alta aplica si se exige equivalencia funcional completa, accesibilidad real, pruebas automatizadas, despliegue seguro y soporte a todos los flujos sin documentacion previa.

## 6. Tareas base para Jira

### EP00 - Descubrimiento funcional y tecnico

| Tarea | Descripcion | Entregable |
| --- | --- | --- |
| EP00-T01 | Levantar mapa funcional de `Register`, `Juridica`, `Extranjero` y `Remediacion`. | Diagrama de flujos validado. |
| EP00-T02 | Conseguir datos de prueba por tipo de alta, producto, test, documento y firma. | Dataset de QA. |
| EP00-T03 | Documentar dependencias externas: APIs internas, WordPress, firma, emails, documentos y sesion. | Matriz de dependencias. |
| EP00-T04 | Ejecutar proyecto en local o entorno compartido y capturar pantallas actuales. | Baseline funcional/visual. |
| EP00-T05 | Definir estrategia de convivencia: React por pantalla completa o por islas dentro de Razor. | Decision tecnica. |

### EP01 - Plataforma React en Web.Public

| Tarea | Descripcion | Entregable |
| --- | --- | --- |
| EP01-T01 | Introducir estructura frontend React/TypeScript dentro de `BESTINVER.GestorAltas.Web.Public`. | Carpeta frontend compilable. |
| EP01-T02 | Integrar build con ASP.NET Core: assets versionados, dev server local y build de produccion. | Build reproducible. |
| EP01-T03 | Crear helper Razor para montar apps React con datos iniciales seguros. | Host React reutilizable. |
| EP01-T04 | Configurar lint, format, unit tests y test runner. | Pipeline frontend minimo. |
| EP01-T05 | Definir alias, estructura de modulos y convenciones de estado/formularios. | Guia tecnica corta. |

### EP02 - Sistema UI y accesibilidad

| Tarea | Descripcion | Entregable |
| --- | --- | --- |
| EP02-T01 | Inventariar componentes actuales: inputs, selects, radios, checkboxes, modales, tooltips, tabs y errores. | Inventario UI. |
| EP02-T02 | Crear componentes React accesibles para formularios y mensajes de error. | Libreria UI base. |
| EP02-T03 | Crear patrones de navegacion por pasos y resumen. | Stepper/layout funcional. |
| EP02-T04 | Crear componentes para tests de conocimiento/conveniencia. | Motor visual de cuestionarios. |
| EP02-T05 | Validar WCAG: foco, teclado, labels, contraste, mensajes y modales. | Checklist accesibilidad. |

### EP03 - Capa de dominio frontend

| Tarea | Descripcion | Entregable |
| --- | --- | --- |
| EP03-T01 | Extraer contratos de datos desde `models.js`, `models-juridicas.js`, `model-extranjero.js` y `remediacion.js`. | Tipos TypeScript/DTOs. |
| EP03-T02 | Rehacer observables/computed Knockout como estado React y selectores. | Store/capa de estado. |
| EP03-T03 | Rehacer validaciones de campos, tests y reglas condicionales. | Validadores testeados. |
| EP03-T04 | Rehacer clientes AJAX de `request*.js`. | Cliente API tipado. |
| EP03-T05 | Normalizar errores de API y mensajes visibles. | Gestion de errores comun. |

### EP04 - Flujo Register

| Tarea | Descripcion | Vistas principales |
| --- | --- | --- |
| EP04-T01 | Migrar selector de producto de persona fisica. | `Views/Register/Index.cshtml`, `Views/Register/Product/*` |
| EP04-T02 | Migrar datos personales, contacto y domicilio. | `Views/Register/PersonalDataView.cshtml`, `Views/Register/_PersonalDataView.cshtml`, `Views/Register/_BasicDataView.cshtml`, `Views/Register/_AddressView.cshtml`, `Views/Register/_ContactView.cshtml` |
| EP04-T03 | Migrar datos bancarios, operativa, IBAN e inversion CRI. | `Views/Register/Operation/*` |
| EP04-T04 | Migrar tests de conveniencia y conocimiento. | `Views/Register/_TestView.cshtml`, `Views/Register/Test/*` |
| EP04-T05 | Migrar intervinientes/otros solicitantes. | `Views/Register/_OtherApplicantView.cshtml`, `Views/Register/OtherApplicant/*` |
| EP04-T06 | Migrar documentos y firma. | `Views/Register/Documents/*` |
| EP04-T07 | Migrar resumen, confirmacion, error y recuperacion de firma. | `Views/Register/_Resume.cshtml`, `Views/Register/_SuccessView.cshtml`, `Views/Register/_ErrorView.cshtml`, `Views/Register/RecoverySignature.cshtml` |

### EP05 - Flujo Juridica

| Tarea | Descripcion | Vistas principales |
| --- | --- | --- |
| EP05-T01 | Migrar selector de producto juridico. | `Views/Juridica/Index.cshtml`, `Views/Juridica/Product/*` |
| EP05-T02 | Migrar datos de sociedad, contacto y direccion. | `Views/Juridica/PersonalDataView.cshtml`, `Views/Juridica/LegalEntity/*`, `Views/Juridica/_PersonalDataView.cshtml`, `Views/Juridica/_BasicDataView.cshtml`, `Views/Juridica/_AddressView.cshtml`, `Views/Juridica/_ContactView.cshtml` |
| EP05-T03 | Migrar titulares reales y representantes. | `Views/Juridica/_OtherApplicantView.cshtml`, `Views/Juridica/OtherApplicant/*`, `Views/Juridica/Test/TestTypes/_OwnerView.cshtml` |
| EP05-T04 | Migrar operativa y datos de inversion. | `Views/Juridica/Operation/*` |
| EP05-T05 | Migrar tests juridicos, representante e infraestructura. | `Views/Juridica/_TestView.cshtml`, `Views/Juridica/Test/*` |
| EP05-T06 | Migrar documentos y firma juridica. | `Views/Juridica/Documents/*`, `Views/Juridica/RecoverySignature.cshtml` |

### EP06 - Flujo Extranjero

| Tarea | Descripcion | Vistas principales |
| --- | --- | --- |
| EP06-T01 | Migrar selector de producto extranjero. | `Views/Extranjero/Index.cshtml`, `Views/Extranjero/Product/*` |
| EP06-T02 | Migrar datos personales, contacto, domicilio y residencia fiscal. | `Views/Extranjero/PersonalDataView.cshtml`, `Views/Extranjero/_PersonalDataView.cshtml`, `Views/Extranjero/_BasicDataView.cshtml`, `Views/Extranjero/_AddressView.cshtml`, `Views/Extranjero/_ContactView.cshtml` |
| EP06-T03 | Migrar operativa extranjero y CRI. | `Views/Extranjero/Operation/*` |
| EP06-T04 | Migrar tests extranjero y variantes especiales. | `Views/Extranjero/_TestView.cshtml`, `Views/Extranjero/Test/*` |
| EP06-T05 | Migrar otros solicitantes. | `Views/Extranjero/_OtherApplicantView.cshtml`, `Views/Extranjero/OtherApplicant/*` |
| EP06-T06 | Migrar documentos, firma y recuperacion de firma. | `Views/Extranjero/Documents/*`, `Views/Extranjero/RecoverySignature.cshtml` |

### EP07 - Flujo Remediacion

| Tarea | Descripcion | Vistas principales |
| --- | --- | --- |
| EP07-T01 | Migrar pantalla principal de remediacion. | `Views/Remediacion/RemediacionView.cshtml`, `Views/Remediacion/_RemediacionHeader.cshtml`, `Views/Remediacion/Shared/_Header.cshtml` |
| EP07-T02 | Migrar validacion de usuario, DNI y datos personales. | `Views/Remediacion/_UserValidation.cshtml`, `Views/Remediacion/_PersonalDataView.cshtml`, `Views/Remediacion/_AddressView.cshtml` |
| EP07-T03 | Migrar tests de remediacion fisica y juridica. | `Views/Remediacion/_TestView.cshtml`, `Views/Remediacion/Test/*` |
| EP07-T04 | Migrar titular real y documentacion. | `Views/Remediacion/Test/TestTypes/_OwnerView.cshtml`, `Views/Remediacion/Test/TestTypes/_OwnerPercentageView.cshtml`, `Views/Remediacion/Documents/*` |
| EP07-T05 | Migrar firma y cierre de proceso. | `Views/Remediacion/Documents/_Signature*.cshtml`, endpoints de `RemediacionController` |

### EP08 - Firma y documentos

| Tarea | Descripcion | Entregable |
| --- | --- | --- |
| EP08-T01 | Inventariar estados de documento: requerido, subido, validado, firmado, error. | Matriz documental. |
| EP08-T02 | Migrar componentes de subida/descarga/visualizacion. | Componentes React. |
| EP08-T03 | Migrar flujos de firma para fisica, juridica, extranjero y remediacion. | Firma React integrada. |
| EP08-T04 | Validar compatibilidad con backend y proveedor de firma. | Prueba extremo a extremo. |

### EP09 - Backend y contratos

| Tarea | Descripcion | Entregable |
| --- | --- | --- |
| EP09-T01 | Documentar endpoints usados por `request.js`, `request-juridicas.js`, `request-extranjero.js` y `remediacion.js`. | Catalogo API. |
| EP09-T02 | Normalizar payloads iniciales que Razor inyecta en las vistas. | DTO bootstrap. |
| EP09-T03 | Revisar controladores `RegisterController`, `JuridicaController`, `ExtranjeroController`, `RemediacionController` y `MasterController`. | Contratos estables. |
| EP09-T04 | Adaptar errores para consumo frontend moderno. | Respuestas consistentes. |
| EP09-T05 | Mantener compatibilidad durante migracion por feature flag o rutas separadas. | Plan de convivencia. |

### EP10 - QA, regresion y accesibilidad

| Tarea | Descripcion | Entregable |
| --- | --- | --- |
| EP10-T01 | Crear matriz de casos por flujo, producto, perfil y resultado. | Plan de pruebas. |
| EP10-T02 | Automatizar smoke tests de rutas criticas. | Suite E2E minima. |
| EP10-T03 | Crear pruebas de componentes para formularios y tests. | Test suite frontend. |
| EP10-T04 | Validar accesibilidad WCAG con teclado y lector. | Informe de accesibilidad. |
| EP10-T05 | Ejecutar UAT con negocio por entregas parciales. | Actas de validacion. |

### EP11 - Release, despliegue y retirada KO

| Tarea | Descripcion | Entregable |
| --- | --- | --- |
| EP11-T01 | Definir despliegue progresivo por entorno y flujo. | Plan de release. |
| EP11-T02 | Revisar Docker/pipelines para incluir build frontend. | Pipeline actualizado. |
| EP11-T03 | Monitorizar errores frontend/backend tras despliegue. | Dashboard o logs acordados. |
| EP11-T04 | Retirar `knockout.js`, viewmodels antiguos y scripts no usados. | Limpieza final. |
| EP11-T05 | Actualizar README y documentacion de operacion. | Documentacion final. |

## 7. Inventario por vista y accion

Las siguientes tablas listan las vistas donde Knockout esta integrado directamente. La columna `Lineas KO` cuenta lineas afectadas por `data-bind`, `ko.` o comentarios virtuales `<!-- ko -->`; sirve para priorizar, no para estimar de forma mecanica.

### 7.1 Register

| Vista | Lineas KO | Jira / accion sugerida |
| --- | ---: | --- |
| `Views/Register/Documents/_DocumentSubView.cshtml` | 30 | EP04-T06 / EP08: migrar subvista de documento. |
| `Views/Register/Documents/_DocumentView.cshtml` | 17 | EP04-T06 / EP08: migrar contenedor de documentos. |
| `Views/Register/Documents/_MinorDocumentSubView.cshtml` | 14 | EP04-T06 / EP08: migrar documento de menor. |
| `Views/Register/Documents/_SignatureConfirmPhone.cshtml` | 12 | EP04-T06 / EP08: migrar confirmacion por telefono. |
| `Views/Register/Documents/_SignatureDocumentDownloadView.cshtml` | 17 | EP04-T06 / EP08: migrar descarga de documento de firma. |
| `Views/Register/Documents/_SignatureDocumentPostView.cshtml` | 1 | EP04-T06 / EP08: migrar postfirma o validar si puede retirarse. |
| `Views/Register/Documents/_SignatureDocumentSignedSubView.cshtml` | 7 | EP04-T06 / EP08: migrar documento firmado. |
| `Views/Register/Documents/_SignatureDocumentSubView.cshtml` | 32 | EP04-T06 / EP08: migrar subvista de documento de firma. |
| `Views/Register/Documents/_SignatureDocumentView.cshtml` | 3 | EP04-T06 / EP08: migrar contenedor de documentos de firma. |
| `Views/Register/Documents/_SignatureView.cshtml` | 25 | EP04-T06 / EP08: migrar pantalla de firma. |
| `Views/Register/Index.cshtml` | 5 | EP04-T01: crear host React del selector y retirar `ko.applyBindings`. |
| `Views/Register/Operation/_CriiConfigureInvestmentView.cshtml` | 4 | EP04-T03: migrar configuracion de inversion CRI. |
| `Views/Register/Operation/_CriiOperationView.cshtml` | 40 | EP04-T03: migrar operativa CRI. |
| `Views/Register/Operation/_CriiProductNoOperationView.cshtml` | 12 | EP04-T03: migrar producto CRI sin operacion. |
| `Views/Register/Operation/_OperationIbanSubView.cshtml` | 10 | EP04-T03: migrar subvista de IBAN. |
| `Views/Register/Operation/_OperationIbanView.cshtml` | 10 | EP04-T03: migrar IBAN de operacion. |
| `Views/Register/Operation/_OperationListView.cshtml` | 6 | EP04-T03: migrar listado de operaciones. |
| `Views/Register/Operation/_OperationSubView.cshtml` | 107 | EP04-T03: migrar subformulario principal de operacion. |
| `Views/Register/Operation/_OperationView.cshtml` | 3 | EP04-T03: migrar contenedor de operacion. |
| `Views/Register/OtherApplicant/_OtherApplicantListView.cshtml` | 9 | EP04-T05: migrar listado de otros solicitantes. |
| `Views/Register/OtherApplicant/_OtherApplicantSubView.cshtml` | 55 | EP04-T05: migrar formulario de otro solicitante. |
| `Views/Register/PersonalDataView.cshtml` | 35 | EP04-T02: crear host React del flujo principal de alta. |
| `Views/Register/Product/_ProductListView.cshtml` | 7 | EP04-T01: migrar listado de productos. |
| `Views/Register/Product/_ProductSelectView.cshtml` | 38 | EP04-T01: migrar selector de producto. |
| `Views/Register/RecoverySignature.cshtml` | 9 | EP04-T07 / EP08: migrar recuperacion de firma. |
| `Views/Register/SendDocument.cshtml` | 5 | EP04-T06 / EP08: migrar envio documental independiente. |
| `Views/Register/Test/TestTypes/_ConvenienceComplexTest.cshtml` | 32 | EP04-T04: migrar test de conveniencia complejo. |
| `Views/Register/Test/TestTypes/_ConvenienceNoComplexTest.cshtml` | 23 | EP04-T04: migrar test de conveniencia no complejo. |
| `Views/Register/Test/TestTypes/_ConvenienceTest.cshtml` | 136 | EP04-T04: migrar motor de conveniencia. |
| `Views/Register/Test/TestTypes/_ConvenienceTestInfra.cshtml` | 130 | EP04-T04: migrar variante infraestructura. |
| `Views/Register/Test/TestTypes/_knowledgeTest.cshtml` | 166 | EP04-T04: migrar test de conocimientos principal. |
| `Views/Register/Test/TestTypes/_knowledgeTestEspecialApplicant.cshtml` | 101 | EP04-T04: migrar test de conocimientos solicitante especial. |
| `Views/Register/Test/TestTypes/_knowledgeTestRepresentative.cshtml` | 101 | EP04-T04: migrar test de conocimientos representante. |
| `Views/Register/Test/TestTypes/_knowledgeTestTutor.cshtml` | 141 | EP04-T04: migrar test de conocimientos tutor. |
| `Views/Register/Test/_ApplicantListView.cshtml` | 13 | EP04-T04: migrar listado de solicitantes con test. |
| `Views/Register/Test/_ApplicantTestView.cshtml` | 20 | EP04-T04: migrar contenedor de test por solicitante. |
| `Views/Register/_AddressView.cshtml` | 23 | EP04-T02: migrar domicilio. |
| `Views/Register/_BasicDataView.cshtml` | 37 | EP04-T02: migrar datos basicos. |
| `Views/Register/_ContactView.cshtml` | 14 | EP04-T02: migrar contacto. |
| `Views/Register/_ErrorView.cshtml` | 1 | EP04-T07: migrar estado de error o dejar Razor sin KO. |
| `Views/Register/_OtherApplicantView.cshtml` | 49 | EP04-T05: migrar composicion de otros solicitantes. |
| `Views/Register/_PersonalDataView.cshtml` | 37 | EP04-T02: migrar composicion de datos personales. |
| `Views/Register/_RecoverySuccessView.cshtml` | 4 | EP04-T07 / EP08: migrar exito de recuperacion de firma. |
| `Views/Register/_RegistrationHeader.cshtml` | 1 | EP04-T07 / EP11: adaptar cabecera de registro. |
| `Views/Register/_Resume.cshtml` | 18 | EP04-T07: migrar resumen. |
| `Views/Register/_SuccessView.cshtml` | 4 | EP04-T07: migrar estado de exito o dejar Razor sin KO. |
| `Views/Register/_TestView.cshtml` | 42 | EP04-T04: migrar composicion de tests. |

### 7.2 Juridica

| Vista | Lineas KO | Jira / accion sugerida |
| --- | ---: | --- |
| `Views/Juridica/Documents/_DocumentSubView.cshtml` | 24 | EP05-T06 / EP08: migrar subvista de documento. |
| `Views/Juridica/Documents/_DocumentView.cshtml` | 5 | EP05-T06 / EP08: migrar contenedor de documentos. |
| `Views/Juridica/Documents/_IEDocumentSubView.cshtml` | 22 | EP05-T06 / EP08: migrar documento IE. |
| `Views/Juridica/Documents/_MinorDocumentSubView.cshtml` | 9 | EP05-T06 / EP08: migrar documento de menor. |
| `Views/Juridica/Documents/_OtherOptionsDocumentView.cshtml` | 9 | EP05-T06 / EP08: migrar otras opciones documentales. |
| `Views/Juridica/Documents/_ScanDocumentView.cshtml` | 4 | EP05-T06 / EP08: migrar escaneo/subida documental. |
| `Views/Juridica/Documents/_SignatureConfirmPhone.cshtml` | 12 | EP05-T06 / EP08: migrar confirmacion por telefono. |
| `Views/Juridica/Documents/_SignatureDocumentDownloadView.cshtml` | 13 | EP05-T06 / EP08: migrar descarga de documentos de firma. |
| `Views/Juridica/Documents/_SignatureDocumentPostView.cshtml` | 1 | EP05-T06 / EP08: migrar postfirma o validar si puede retirarse. |
| `Views/Juridica/Documents/_SignatureDocumentSignedSubView.cshtml` | 7 | EP05-T06 / EP08: migrar documento firmado. |
| `Views/Juridica/Documents/_SignatureDocumentSubView.cshtml` | 11 | EP05-T06 / EP08: migrar subvista de documento de firma. |
| `Views/Juridica/Documents/_SignatureDocumentView.cshtml` | 3 | EP05-T06 / EP08: migrar contenedor de documentos de firma. |
| `Views/Juridica/Documents/_SignatureView.cshtml` | 19 | EP05-T06 / EP08: migrar pantalla de firma juridica. |
| `Views/Juridica/Index.cshtml` | 5 | EP05-T01: crear host React del selector y retirar `ko.applyBindings`. |
| `Views/Juridica/LegalEntity/_BasicDataView.cshtml` | 7 | EP05-T02: migrar datos basicos de entidad legal. |
| `Views/Juridica/Operation/_CriiOperationView.cshtml` | 30 | EP05-T04: migrar operativa CRI juridica. |
| `Views/Juridica/Operation/_OperationIbanSubView.cshtml` | 10 | EP05-T04: migrar subvista de IBAN. |
| `Views/Juridica/Operation/_OperationIbanView.cshtml` | 10 | EP05-T04: migrar IBAN de operacion. |
| `Views/Juridica/Operation/_OperationListView.cshtml` | 6 | EP05-T04: migrar listado de operaciones. |
| `Views/Juridica/Operation/_OperationSubView.cshtml` | 105 | EP05-T04: migrar subformulario principal de operacion. |
| `Views/Juridica/Operation/_OperationView.cshtml` | 3 | EP05-T04: migrar contenedor de operacion. |
| `Views/Juridica/OtherApplicant/_OtherApplicantListView.cshtml` | 8 | EP05-T03: migrar listado de intervinientes. |
| `Views/Juridica/OtherApplicant/_OtherApplicantSubView.cshtml` | 56 | EP05-T03: migrar formulario de interviniente/representante. |
| `Views/Juridica/PersonalDataView.cshtml` | 17 | EP05-T02: crear host React del flujo principal juridico. |
| `Views/Juridica/Product/_ProductListView.cshtml` | 7 | EP05-T01: migrar listado de productos. |
| `Views/Juridica/Product/_ProductSelectView.cshtml` | 19 | EP05-T01: migrar selector de producto. |
| `Views/Juridica/RecoverySignature.cshtml` | 6 | EP05-T06 / EP08: migrar recuperacion de firma. |
| `Views/Juridica/Test/TestTypes/_ConvenienceComplexTest.cshtml` | 32 | EP05-T05: migrar test de conveniencia complejo. |
| `Views/Juridica/Test/TestTypes/_ConvenienceNoComplexTest.cshtml` | 23 | EP05-T05: migrar test de conveniencia no complejo. |
| `Views/Juridica/Test/TestTypes/_ConvenienceTest.cshtml` | 136 | EP05-T05: migrar motor de conveniencia. |
| `Views/Juridica/Test/TestTypes/_ConvenienceTestInfra.cshtml` | 130 | EP05-T05: migrar variante infraestructura. |
| `Views/Juridica/Test/TestTypes/_OwnerView.cshtml` | 37 | EP05-T03 / EP05-T05: migrar titulares reales dentro de test. |
| `Views/Juridica/Test/TestTypes/_knowledgeTest.cshtml` | 197 | EP05-T05: migrar test de conocimientos juridico principal. |
| `Views/Juridica/Test/TestTypes/_knowledgeTestRepresentative.cshtml` | 101 | EP05-T05: migrar test de conocimientos representante. |
| `Views/Juridica/Test/_ApplicantListView.cshtml` | 12 | EP05-T05: migrar listado de solicitantes con test. |
| `Views/Juridica/Test/_ApplicantTestView.cshtml` | 77 | EP05-T05: migrar contenedor de tests. |
| `Views/Juridica/_AddressView.cshtml` | 23 | EP05-T02: migrar domicilio. |
| `Views/Juridica/_BasicDataView.cshtml` | 39 | EP05-T02: migrar datos basicos juridicos. |
| `Views/Juridica/_CheckAllDataView.cshtml` | 21 | EP05-T02: migrar comprobacion de datos. |
| `Views/Juridica/_ContactView.cshtml` | 10 | EP05-T02: migrar contacto. |
| `Views/Juridica/_ErrorView.cshtml` | 1 | EP05-T06: migrar estado de error o dejar Razor sin KO. |
| `Views/Juridica/_OtherApplicantView.cshtml` | 40 | EP05-T03: migrar composicion de intervinientes. |
| `Views/Juridica/_PersonalDataView.cshtml` | 34 | EP05-T02: migrar composicion de datos juridicos. |
| `Views/Juridica/_RecoverySuccessView.cshtml` | 6 | EP05-T06 / EP08: migrar exito de recuperacion de firma. |
| `Views/Juridica/_RegistrationHeader.cshtml` | 1 | EP05-T06 / EP11: adaptar cabecera juridica. |
| `Views/Juridica/_Resume.cshtml` | 18 | EP05-T06: migrar resumen. |
| `Views/Juridica/_SuccessView.cshtml` | 4 | EP05-T06: migrar estado de exito o dejar Razor sin KO. |
| `Views/Juridica/_TestView.cshtml` | 18 | EP05-T05: migrar composicion de tests. |

### 7.3 Extranjero

| Vista | Lineas KO | Jira / accion sugerida |
| --- | ---: | --- |
| `Views/Extranjero/Documents/_DocumentSubView.cshtml` | 12 | EP06-T06 / EP08: migrar subvista de documento. |
| `Views/Extranjero/Documents/_DocumentView.cshtml` | 6 | EP06-T06 / EP08: migrar contenedor de documentos. |
| `Views/Extranjero/Documents/_MinorDocumentSubView.cshtml` | 14 | EP06-T06 / EP08: migrar documento de menor. |
| `Views/Extranjero/Documents/_SignatureConfirmPhone.cshtml` | 12 | EP06-T06 / EP08: migrar confirmacion por telefono. |
| `Views/Extranjero/Documents/_SignatureDocumentDownloadView.cshtml` | 17 | EP06-T06 / EP08: migrar descarga de documento de firma. |
| `Views/Extranjero/Documents/_SignatureDocumentPostView.cshtml` | 1 | EP06-T06 / EP08: migrar postfirma o validar si puede retirarse. |
| `Views/Extranjero/Documents/_SignatureDocumentSignedSubView.cshtml` | 7 | EP06-T06 / EP08: migrar documento firmado. |
| `Views/Extranjero/Documents/_SignatureDocumentSubView.cshtml` | 30 | EP06-T06 / EP08: migrar subvista de documento de firma. |
| `Views/Extranjero/Documents/_SignatureDocumentView.cshtml` | 3 | EP06-T06 / EP08: migrar contenedor de documentos de firma. |
| `Views/Extranjero/Documents/_SignatureView.cshtml` | 23 | EP06-T06 / EP08: migrar pantalla de firma. |
| `Views/Extranjero/Index.cshtml` | 5 | EP06-T01: crear host React del selector y retirar `ko.applyBindings`. |
| `Views/Extranjero/Operation/_CriiConfigureInvestmentView.cshtml` | 4 | EP06-T03: migrar configuracion de inversion CRI. |
| `Views/Extranjero/Operation/_CriiOperationView.cshtml` | 40 | EP06-T03: migrar operativa CRI extranjero. |
| `Views/Extranjero/Operation/_CriiProductNoOperationView.cshtml` | 12 | EP06-T03: migrar producto CRI sin operacion. |
| `Views/Extranjero/Operation/_OperationIbanSubView.cshtml` | 10 | EP06-T03: migrar subvista de IBAN. |
| `Views/Extranjero/Operation/_OperationIbanView.cshtml` | 10 | EP06-T03: migrar IBAN de operacion. |
| `Views/Extranjero/Operation/_OperationSubView.cshtml` | 122 | EP06-T03: migrar subformulario principal de operacion. |
| `Views/Extranjero/OtherApplicant/_OtherApplicantListView.cshtml` | 9 | EP06-T05: migrar listado de otros solicitantes. |
| `Views/Extranjero/OtherApplicant/_OtherApplicantSubView.cshtml` | 66 | EP06-T05: migrar formulario de otro solicitante. |
| `Views/Extranjero/PersonalDataView.cshtml` | 34 | EP06-T02: crear host React del flujo principal extranjero. |
| `Views/Extranjero/Product/_ProductListView.cshtml` | 7 | EP06-T01: migrar listado de productos. |
| `Views/Extranjero/Product/_ProductSelectView.cshtml` | 18 | EP06-T01: migrar selector de producto. |
| `Views/Extranjero/RecoverySignature.cshtml` | 9 | EP06-T06 / EP08: migrar recuperacion de firma. |
| `Views/Extranjero/Test/TestTypes/_ConvenienceComplexTest.cshtml` | 32 | EP06-T04: migrar test de conveniencia complejo. |
| `Views/Extranjero/Test/TestTypes/_ConvenienceNoComplexTest.cshtml` | 23 | EP06-T04: migrar test de conveniencia no complejo. |
| `Views/Extranjero/Test/TestTypes/_ConvenienceTest.cshtml` | 136 | EP06-T04: migrar motor de conveniencia. |
| `Views/Extranjero/Test/TestTypes/_ConvenienceTestInfra.cshtml` | 130 | EP06-T04: migrar variante infraestructura. |
| `Views/Extranjero/Test/TestTypes/_KnowledgeTest.cshtml` | 166 | EP06-T04: migrar test de conocimientos extranjero principal. |
| `Views/Extranjero/Test/TestTypes/_KnowledgeTestEspecialApplicant.cshtml` | 101 | EP06-T04: migrar test de conocimientos solicitante especial. |
| `Views/Extranjero/Test/TestTypes/_KnowledgeTestRepresentative.cshtml` | 101 | EP06-T04: migrar test de conocimientos representante. |
| `Views/Extranjero/Test/TestTypes/_KnowledgeTestTutor.cshtml` | 141 | EP06-T04: migrar test de conocimientos tutor. |
| `Views/Extranjero/Test/_ApplicantListView.cshtml` | 13 | EP06-T04: migrar listado de solicitantes con test. |
| `Views/Extranjero/Test/_ApplicantTestView.cshtml` | 20 | EP06-T04: migrar contenedor de test por solicitante. |
| `Views/Extranjero/_AddressView.cshtml` | 23 | EP06-T02: migrar domicilio. |
| `Views/Extranjero/_BasicDataView.cshtml` | 37 | EP06-T02: migrar datos basicos. |
| `Views/Extranjero/_ContactView.cshtml` | 14 | EP06-T02: migrar contacto. |
| `Views/Extranjero/_ErrorView.cshtml` | 1 | EP06-T06: migrar estado de error o dejar Razor sin KO. |
| `Views/Extranjero/_OtherApplicantView.cshtml` | 54 | EP06-T05: migrar composicion de otros solicitantes. |
| `Views/Extranjero/_PersonalDataView.cshtml` | 30 | EP06-T02: migrar composicion de datos personales. |
| `Views/Extranjero/_RecoverySuccessView.cshtml` | 6 | EP06-T06 / EP08: migrar exito de recuperacion de firma. |
| `Views/Extranjero/_RegistrationHeader.cshtml` | 1 | EP06-T06 / EP11: adaptar cabecera extranjero. |
| `Views/Extranjero/_Resume.cshtml` | 18 | EP06-T06: migrar resumen. |
| `Views/Extranjero/_SuccessView.cshtml` | 4 | EP06-T06: migrar estado de exito o dejar Razor sin KO. |
| `Views/Extranjero/_TestView.cshtml` | 42 | EP06-T04: migrar composicion de tests. |

### 7.4 Remediacion

| Vista | Lineas KO | Jira / accion sugerida |
| --- | ---: | --- |
| `Views/Remediacion/Documents/_DocumentSubView.cshtml` | 1 | EP07-T04 / EP08: migrar subvista de documento. |
| `Views/Remediacion/Documents/_DocumentView.cshtml` | 14 | EP07-T04 / EP08: migrar contenedor documental. |
| `Views/Remediacion/Documents/_IEDocumentSubView.cshtml` | 1 | EP07-T04 / EP08: migrar documento IE si sigue vigente. |
| `Views/Remediacion/Documents/_SignatureConfirmEmail.cshtml` | 8 | EP07-T05 / EP08: migrar confirmacion por email. |
| `Views/Remediacion/Documents/_SignatureConfirmEmailJuridic.cshtml` | 9 | EP07-T05 / EP08: migrar confirmacion por email juridica. |
| `Views/Remediacion/Documents/_SignatureConfirmPhone.cshtml` | 1 | EP07-T05 / EP08: migrar confirmacion por telefono. |
| `Views/Remediacion/Documents/_SignatureConfirmPhoneJuridic.cshtml` | 2 | EP07-T05 / EP08: migrar confirmacion por telefono juridica. |
| `Views/Remediacion/Documents/_SignatureDocumentSubView.cshtml` | 3 | EP07-T05 / EP08: migrar subvista de documento de firma. |
| `Views/Remediacion/Documents/_SignatureDocumentSubViewJuridic.cshtml` | 4 | EP07-T05 / EP08: migrar subvista juridica de documento de firma. |
| `Views/Remediacion/Documents/_SignatureDocumentView.cshtml` | 1 | EP07-T05 / EP08: migrar contenedor de documentos de firma. |
| `Views/Remediacion/Documents/_SignatureDocumentViewJuridic.cshtml` | 1 | EP07-T05 / EP08: migrar contenedor juridico de documentos de firma. |
| `Views/Remediacion/Documents/_SignatureView.cshtml` | 9 | EP07-T05 / EP08: migrar pantalla de firma. |
| `Views/Remediacion/RemediacionView.cshtml` | 15 | EP07-T01: crear host React del flujo principal y retirar `ko.applyBindings`. |
| `Views/Remediacion/Shared/_Header.cshtml` | 1 | EP07-T01 / EP11: adaptar cabecera de remediacion. |
| `Views/Remediacion/Test/TestTypes/_OwnerPercentageView.cshtml` | 4 | EP07-T04: migrar porcentaje de titular real. |
| `Views/Remediacion/Test/TestTypes/_OwnerView.cshtml` | 37 | EP07-T04: migrar titular real. |
| `Views/Remediacion/Test/TestTypes/_knowledgeTest.cshtml` | 170 | EP07-T03: migrar test de conocimientos fisico. |
| `Views/Remediacion/Test/TestTypes/_knowledgeTestJuridica.cshtml` | 191 | EP07-T03: migrar test de conocimientos juridico. |
| `Views/Remediacion/Test/TestTypes/_knowledgeTestRepresentative.cshtml` | 104 | EP07-T03: migrar test de conocimientos representante. |
| `Views/Remediacion/Test/TestTypes/_knowledgeTestTutor.cshtml` | 145 | EP07-T03: migrar test de conocimientos tutor. |
| `Views/Remediacion/Test/_ApplicantListView.cshtml` | 10 | EP07-T03: migrar listado de solicitantes con test. |
| `Views/Remediacion/Test/_ApplicantTestView.cshtml` | 19 | EP07-T03: migrar contenedor de test por solicitante. |
| `Views/Remediacion/_AddressView.cshtml` | 23 | EP07-T02: migrar domicilio. |
| `Views/Remediacion/_ErrorNoSigners.cshtml` | 4 | EP07-T05: migrar error sin firmantes. |
| `Views/Remediacion/_PersonalDataView.cshtml` | 17 | EP07-T02: migrar datos personales. |
| `Views/Remediacion/_RemediacionHeader.cshtml` | 4 | EP07-T01 / EP11: adaptar cabecera principal. |
| `Views/Remediacion/_TestView.cshtml` | 18 | EP07-T03: migrar composicion de tests. |
| `Views/Remediacion/_UserValidation.cshtml` | 4 | EP07-T02: migrar validacion de usuario. |

### 7.5 Home

| Vista | Lineas KO | Jira / accion sugerida |
| --- | ---: | --- |
| `Views/Home/_SelectPersonView.cshtml` | 3 | EP01 / EP11: revisar si queda expuesta; migrar selector o dejar Razor sin KO. |

### 7.6 Vistas y layouts sin Knockout directo

Estas vistas no tienen bindings Knockout directos, pero pueden necesitar cambios por carga de assets, layout o convivencia con React:

- `Views/Shared/*`
- `Views/Landing/Index.cshtml`
- `Views/Error/*`
- `_ViewImports.cshtml`
- `_ViewStart.cshtml`
- Layouts especificos: `_Layout.cshtml`, `_Layout_Juridico.cshtml`, `_Layout_Extranjero.cshtml`, `_Layout_Remediacion.cshtml`

Accion recomendada:

- No migrarlas como historias funcionales independientes salvo que carguen scripts KO o condicionen el montaje React.
- Incluirlas en EP01/EP11 para carga de assets, retirada de scripts, CSP si aplica y limpieza final.

## 8. Orden recomendado de ejecucion

1. **PoC tecnica con un host React pequeno**: montar React en una vista Razor sin cambiar funcionalidad critica.
2. **MVP Register**: selector de producto, datos personales, operacion, test, documentos y firma.
3. **Extraer componentes compartidos**: formularios, direccion, contacto, tests, documentos y firma.
4. **Migrar Juridica** reutilizando componentes de Register y resolviendo particularidades de titulares/intervinientes.
5. **Migrar Extranjero** reutilizando componentes y resolviendo variantes documentales/fiscales.
6. **Migrar Remediacion** cuando ya existan componentes de datos, tests y firma.
7. **Retirada Knockout**: eliminar `data-bind`, `ko.applyBindings`, viewmodels JS antiguos y referencias de layout.

## 9. Riesgos principales

| Riesgo | Impacto | Mitigacion |
| --- | --- | --- |
| Falta de documentacion funcional | Alto | Baseline con pantallas actuales, sesiones con negocio y dataset de pruebas. |
| Reglas de negocio escondidas en JavaScript Knockout | Alto | Extraer reglas a tests antes de reescribirlas. |
| Dependencias externas de firma/documentos | Alto | Probar integracion extremo a extremo pronto. |
| Mezcla Razor + JS global | Medio/alto | Definir estrategia de host React y bootstrap tipado desde servidor. |
| Accesibilidad legal | Alto | Tratar accesibilidad como requisito de cada historia, no como fase final. |
| Datos de prueba insuficientes | Alto | Pedir casos reales anonimizados o dataset controlado desde EP00. |
| Despliegue monolitico con Docker/pipelines heredados | Medio | Actualizar build y pipeline desde EP01/EP11, no al final. |

## 10. Definition of Done por vista migrada

Una vista o bloque funcional se considera migrado cuando:

- No contiene `data-bind` ni depende de `ko` para su comportamiento.
- El estado y validaciones estan implementados en React/TypeScript o en una capa comun testeada.
- Los endpoints actuales siguen funcionando o se ha documentado el cambio de contrato.
- Hay pruebas unitarias o de componente para reglas no triviales.
- Hay smoke test manual o automatizado del flujo feliz y al menos un flujo de error.
- La navegacion por teclado, labels, errores y foco cumplen criterios basicos WCAG.
- No se rompe la convivencia con vistas no migradas.
- La historia incluye captura o evidencia de validacion funcional.
