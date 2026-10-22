# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Gente que empieza su huerta en casa: personas de ciudad, sin experiencia previa, con un patio, un balcón o una terraza. Necesitan saber dónde ubicarla, cómo preparar la tierra, qué sembrar en cada mes y cómo cuidarla hasta la cosecha.

## Product Purpose
La Huertita es una guía de difusión sobre huerta urbana familiar, basada en el programa ProHuerta y en los materiales del INTA. Acompaña todo el ciclo: preparar, sembrar, cuidar y cosechar.

Es el Parcial 2 de Composición Digital (DGN5, Da Vinci), con el profesor Juan Bautista Carloni. Para esta entrega, el éxito es doble: cumplir la consigna y que el sitio funcione de verdad como guía para quien empieza.

## Positioning
- **Contenido de fuente oficial:** sale de la bibliografía del INTA ProHuerta (Argentina), con las fuentes citadas y los diagramas de los manuales redibujados.
- **Calendario regional:** muestra qué se siembra en cada mes en la región pampeana y se actualiza solo con la fecha.

## Operating Context
- La guía se recorre en orden la primera vez y después se vuelve al calendario en cada cambio de estación.
- El profesor la evalúa contra la consigna del P2 y contra el P1. En el P1 se entregaron el moodboard, el sitemap, el sistema de color y tipografía y la arquitectura de contenidos, en el Figma `6YJZrIhDmumtXxo2hfJDE9`.

## Capabilities and Constraints
- **Cuatro páginas:**
  - Inicio.
  - Calendario y cultivos (`html/calendario.html`).
  - Preparar y sembrar (`html/preparar-y-sembrar.html`).
  - Cuidar y cosechar (`html/cuidar-y-cosechar.html`).
- **Consigna del P2:**
  - Bootstrap 5.3.8 por CDN, con su grid y al menos 4 componentes nativos. Hoy se usan navbar con collapse, tabs, card, btn, breadcrumb, accordion y table-responsive.
  - Responsive en 3 breakpoints y semántica HTML5.
  - Publicado en Netlify, con el código en GitHub o GitLab.
- **Partes interactivas:**
  - `js/calendario.js`: calendario anual de 18 cultivos con filtros por temporada, forma y búsqueda, el mes actual resaltado, 12 fichas con filtro por familia y una ficha de detalle.
  - `js/este-mes.js`: «Qué sembrar este mes» en Inicio y en Calendario.
- **Fechas:** preentrega el jueves 22/10/2026 y entrega el 29/10/2026.
- **Resumen de adecuaciones:** la entrega lleva uno frente al P1. Preparar y Sembrar se unieron en una sola página para cumplir con las cuatro.
- **Datos orientativos:** la región es la pampeana.

## Brand Commitments
- **Nombre:** La Huertita. El P1 usaba la sub-marca «The Edible Garden».
- **Paleta del P1, fija y sin colores nuevos** (decisión de Juli):
  - Espresso #2E1A0E
  - Burgundy #461312
  - Ruby #6C0B25
  - Olive #64652A
  - Sage #B5AD80
  - Cream #FAF7E7
- **Tipografía:** Hanken Grotesk, la del P1.
- **Copy:**
  - Español rioplatense con voseo.
  - Comillas angulares «» y sin rayas.
  - Redacción en positivo, sin dos puntos ni punto medio en las notas.

## Evidence on Hand
- **Manuales del INTA, con licencia CC BY-NC-SA:**
  - *La Huerta Orgánica*: repositorio 20.500.12123/15389.
  - *Mi casa, mi huerta*.
  - *Manual de cultivos para la huerta orgánica familiar*.
  - Calendario de siembra ProHuerta.
  - Riego por goteo.
- **Crédito obligatorio en todo dibujo derivado:** «Redibujado a partir de INTA ProHuerta, *La Huerta Orgánica*».
- **Imágenes:**
  - Fotos propias recortadas en `imgs/`, con los originales en `imgs/_originales`.
  - 13 diagramas redibujados en `imgs/ilus/inta/`.
  - Ilustraciones generadas en `imgs/ilus/`.
- **Textos que Juli tiene que verificar con las fuentes**, porque los escribió Claude:
  - Las pestañas de herramientas «Macetas» y «Caseras INTA».
  - Los datos de 11 fichas.
  - Los meses de siembra.
  - Los preparados caseros.
- **Lo que no hay que inventar:** testimonios, usuarios ni datos que no estén en las fuentes del INTA.

## Product Principles
1. **Fuente oficial primero.** Todo dato de cultivo sale de un material del INTA y se cita.
2. **Para quien empieza.** Pasos concretos en imperativo y nada de jerga sin explicar.
3. **El calendario es el corazón.** Todo lleva de vuelta al «qué siembro ahora».
4. **El ciclo en orden.** Preparar, sembrar, cuidar y cosechar como un recorrido.
