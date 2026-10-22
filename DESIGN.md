---
name: La Huertita
description: Guía de huerta urbana familiar con forma de cuaderno de campo impreso, a partir del INTA ProHuerta.
colors:
  cream: "#FAF7E7"
  papel: "#F1ECD6"
  espresso: "#2E1A0E"
  espresso-texto: "#4A3628"
  ruby: "#6C0B25"
  burgundy: "#461312"
  olive: "#64652A"
  sage: "#B5AD80"
typography:
  display:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(46px, 7vw, 88px)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  capitulo:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(56px, 10vw, 128px)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(32px, 4.4vw, 48px)"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
    fontFeature: "\"onum\" 1"
  bajada:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.55
  nota:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.5
  rotulo:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    letterSpacing: "0.14em"
    fontFeature: "\"lnum\" 1, \"tnum\" 1"
  pie-lamina:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  none: "0"
spacing:
  pliego: "104px"
  pliego-mobile: "72px"
  apertura: "72px"
  bloque: "44px"
  apartado: "18px"
  filete-aire: "8px"
  chip-gap: "6px"
components:
  button-primary:
    backgroundColor: "{colors.ruby}"
    textColor: "{colors.cream}"
    rounded: "{rounded.none}"
    padding: "14px 22px"
  button-primary-hover:
    backgroundColor: "{colors.burgundy}"
    textColor: "{colors.cream}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.espresso}"
    rounded: "{rounded.none}"
    padding: "14px 22px"
  button-secondary-hover:
    backgroundColor: "{colors.espresso}"
    textColor: "{colors.cream}"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.espresso}"
    rounded: "{rounded.none}"
    padding: "5px 10px"
  filter-button:
    backgroundColor: "transparent"
    textColor: "{colors.espresso}"
    rounded: "{rounded.none}"
    padding: "7px 13px"
  filter-button-pressed:
    backgroundColor: "{colors.espresso}"
    textColor: "{colors.cream}"
  search-input:
    backgroundColor: "transparent"
    textColor: "{colors.espresso}"
    rounded: "{rounded.none}"
    padding: "9px 2px"
  membrete:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.espresso}"
  banda-capitulo:
    backgroundColor: "{colors.olive}"
    textColor: "{colors.cream}"
    padding: "88px 0 96px"
  pie:
    backgroundColor: "{colors.espresso}"
    textColor: "{colors.cream}"
    padding: "40px 0"
---

# Design System: La Huertita

## Overview

**Creative North Star: "El cuaderno de campo"**

La Huertita se lee como un manual técnico de huerta impreso en papel crema. La estructura la dan los filetes, la numeración y las láminas, no las cajas. Cada sección es un apartado con un filete Espresso arriba; cada imagen es una lámina con pie y número; cada lista de pasos lleva su numeral. La tinta es Espresso, las láminas están dibujadas en línea Burgundy y Ruby aparece solo donde hay que actuar o donde está «hoy».

La densidad es de manual y no de folleto. Hay pliegos amplios (104px de aire vertical) que alternan entre Cream y Papel como hojas de distinto gramaje, y adentro la información se ordena en planillas, tablas filetadas, listas con casillero y fichas con pares rótulo y valor. Las aperturas de capítulo rompen el ritmo con una banda Olive a todo el ancho y un título enorme, como la portadilla de un capítulo.

La imagen tiene tres registros y ninguno es decorativo. Los grabados de Vilmorin-Andrieux (1883) muestran cada especie; los diagramas del INTA redibujados explican cómo se hace; las fotos en duotono muestran la huerta real. Todo convive en la misma tinta porque todo pasó a la paleta del P1.

**Key Characteristics:**
- Radios 0 en todo, de botones a fotos.
- Filetes de 1px en lugar de bordes de caja; Espresso para estructura, Sage para subdivisión.
- Láminas con pie filetado y número o crédito a la derecha.
- Numerales grandes y livianos (peso 200 a 300) como sistema de orden.
- Una sola familia, Hanken Grotesk, con contraste por peso (200 a 800) y por tamaño.
- Ruby escaso y con función; Olive para marca y rótulos.
- Sin sombras de elevación; la profundidad sale del cambio de papel.

## Colors

La paleta es la del Parcial 1, fija, con un único matiz agregado para el cuerpo de texto.

### Primary
- **Ruby de acción** (ruby): botones principales, enlaces, subrayado de la página activa en el membrete, el mes de «hoy» en el calendario, la ficha seleccionada, el foco de teclado y el caret. Es el único color que pide un clic.

### Secondary
- **Olive de rótulo** (olive): la sub-marca «Cuaderno de huerta», los rótulos de tablas y fichas, los numerales de pasos e índices, los créditos de láminas, la siembra directa en el calendario y el fondo de las bandas de capítulo. También es el color de la selección de texto.

### Tertiary
- **Burgundy de lámina** (burgundy): la tinta de todos los grabados, diagramas y esquemas. En interfaz, solo como hover de Ruby y como capa media del perfil de suelo.

### Neutral
- **Cream papel** (cream): fondo de página y texto sobre fondos oscuros.
- **Papel de pliego** (papel): pliegos alternos, banda «Qué sembrar este mes» y fondo de las láminas sobre Cream. Sobre un pliego Papel, la lámina invierte y toma fondo Cream.
- **Espresso tinta** (espresso): títulos, filetes estructurales, botón secundario, filtro activo y pie de página.
- **Espresso aclarado** (espresso-texto): cuerpo de texto, 9:1 sobre Cream. Es un aclarado de Espresso y no un color nuevo.
- **Sage filete** (sage): filetes finos de subdivisión, borde de chips y filtros, almácigo en el calendario, scrollbar.

### Named Rules
**La regla de Ruby con función.** Ruby solo marca acción, estado activo o «hoy». Si un elemento Ruby no se puede tocar ni indica dónde estás, es un error.

**La regla del papel que invierte.** Una lámina toma el papel contrario al del pliego que la contiene (Papel sobre Cream, Cream sobre Papel), para que siempre se lea como hoja pegada.

**La regla de la paleta cerrada.** No se agregan colores fuera de los seis del P1 y el aclarado de texto. Los matices nuevos salen de transparencias de la paleta existente.

## Typography

**Display Font:** Hanken Grotesk (con system-ui, sans-serif), variable 100 a 900, local en `css/font/`.
**Body Font:** Hanken Grotesk, la misma familia.

**Character:** una grotesca de manual técnico usada en dos extremos. Títulos en 800 muy apretados, numerales en 200 a 300 muy abiertos, y el cuerpo en 400 con numerales elzevirianos para que las cifras en el texto corrido se lean como en un libro.

### Hierarchy
- **Display** (800, clamp(46px, 7vw, 88px), 0.98): el h1 de Inicio. En las internas baja a clamp(44px, 6.4vw, 80px).
- **Capítulo** (800, clamp(56px, 10vw, 128px), 0.9): solo en la banda de apertura de capítulo, en Cream sobre Olive.
- **Headline** (800, clamp(32px, 4.4vw, 48px), 1.08): h2 de sección.
- **Title** (800, 20px a 28px, 1.15 a 1.3): h3 de apartados, pasos y tarjetas de sección.
- **Body** (400, 17px, 1.6; 16px en mobile): texto corrido con numerales elzevirianos.
- **Bajada** (400, 19px, 1.55, máximo 68ch): la entrada debajo de cada título.
- **Nota** (400 itálica, 18px, 1.5): anotación al margen con un trazo Ruby de 16px a la izquierda.
- **Rótulo** (600, 12px, 0.14em, mayúsculas, Olive, numerales tabulares): cabeceras de tabla, términos de ficha, etiqueta de filtros, meses del calendario, pasillo del croquis.
- **Pie de lámina** (400, 13px, 1.4): pie a la izquierda, número o crédito en itálica Olive a la derecha.
- **Numeral** (200 a 300, 28px a 64px): el orden de los pasos y de los índices.

### Named Rules
**La regla de los dos pesos.** El contraste se hace con 800 contra 200/300 y no con una segunda familia. No se suma otra tipografía.

**La regla de las cifras.** En el texto corrido los números son elzevirianos; en tablas, calendario, rótulos y títulos son de caja y tabulares.

## Layout

Grilla de Bootstrap 5.3.8 dentro de `container-xxl`, con gutter 4 y 5 en desktop. Breakpoints de Bootstrap (576, 768, 992); los ajustes propios caen en 767.98px y 991.98px.

El ritmo vertical es de pliegos: 104px por sección (72px en mobile), aperturas de 72px, bandas de capítulo de 88px a 96px y cierres de 120px. Dentro, el encabezado de sección ocupa hasta 820px y deja 44px antes del contenido. Todo texto largo respeta una medida de 68ch.

El primer viewport es siempre el mismo esquema. Membrete pegajoso a todo el ancho con filete inferior; a la izquierda el título con su bajada y la acción; a la derecha una lámina 4:5 con pie y número. En Preparar y sembrar se suma un índice numerado en dos columnas filetadas (una en mobile).

Los pasos se ordenan en planilla (numeral de 44px y texto) o en fila de 3 o 4 columnas, que pasan a 2 en tablet y a 1 en mobile. El calendario es una tabla Gantt con mínimo 900px dentro de `table-responsive`.

## Elevation & Depth

Sistema plano. No hay sombras de elevación. La profundidad se arma con el cambio de papel (Cream y Papel), con bandas de color pleno (Olive en capítulos, Espresso en el pie) y con filetes. Los únicos `box-shadow` del sitio son marcas planas sin desenfoque (el contorno Ruby del mes de hoy y el trazo de página activa en el menú mobile).

### Named Rules
**La regla del papel plano.** Nada flota. Si algo necesita destacarse, cambia de papel, gana un filete de 2px o pasa a Ruby; nunca se le pone sombra.

## Shapes

Radio 0 en todo el sistema (`--radio:0` y `--bs-border-radius:0`), incluidos los componentes de Bootstrap. La forma la definen los filetes. El filete estructural es 1px Espresso; el de subdivisión es 1px Sage; el de énfasis es 2px (Espresso en la tarjeta de sección, Ruby en el mes actual y la ficha seleccionada). Las líneas punteadas Sage indican algo provisorio o de esquema (pasillo del croquis, grilla del cantero, foto pendiente). El único círculo es la planta en el esquema del cantero.

## Components

### Buttons
Enlace-botón rectangular, sobrio y de imprenta.
- **Shape:** esquinas rectas (0).
- **Primary:** Ruby lleno con texto Cream, 600 a 15px, padding 14px 22px, borde 1px del mismo color.
- **Hover / Focus:** pasa a Burgundy en 0.2s; foco con contorno Ruby de 2px separado 3px.
- **Secundario:** transparente con borde y texto Espresso; en hover se llena de Espresso con texto Cream.
- **Enlace con flecha:** 600 a 15px, subrayado Sage que pasa a Ruby en hover, con «→» al final.

### Chips
- **Style:** rectángulo con filete Sage, texto Espresso 500 a 13px, padding 5px 10px, separación 6px. Son índices de contenido, no acciones.
- **Filtros:** botón rectangular con filete Sage, 500 a 14px; hover a filete Espresso; `aria-pressed` lleno de Espresso con texto Cream.

### Cards / Containers
Los recuadros son apartados con filete arriba.
- **Corner Style:** 0.
- **Background:** transparente.
- **Border:** solo filete superior de 1px Espresso; la tarjeta de sección de Inicio usa 2px y el título pasa a Ruby en hover.
- **Internal Padding:** 18px a 20px arriba, 0 a los costados.

### Inputs / Fields
- **Style:** buscador subrayado, sin caja, con línea inferior de 1px Espresso y padding 9px 2px.
- **Focus:** la línea pasa a 2px Ruby.

### Navigation
- **Membrete:** sticky, fondo Cream, filete inferior Espresso. Marca en 800 a 21px con la sub-marca «Cuaderno de huerta» como rótulo Olive al lado.
- **Enlaces:** 500 a 15px Espresso, separados 32px; hover Ruby; la página activa en Ruby con subrayado de 2px que pisa el filete del membrete.
- **Mobile:** el menú se abre con filete superior Sage, cada enlace filetado abajo, y la activa marcada con un trazo Ruby de 3px a la izquierda.
- **Migas:** breadcrumb de Bootstrap a 14px con separador Sage.
- **Solapas:** las tabs de herramientas son solapas de cuaderno, sin píldora, con el mismo subrayado Ruby que el membrete.

### Lámina
La firma del sistema. Una figura con la imagen arriba y un pie filetado (1px Espresso, 10px de aire) que lleva la descripción a la izquierda y, a la derecha en itálica Olive, el número («Lámina 1») o la fuente («Vilmorin, 1883»). Las fotos van a 4:5 o recortadas a la grilla; los grabados van en cuadrado con `contain` y 6% de margen de papel; los diagramas INTA llevan 5% de margen y el crédito en una segunda línea itálica Olive.

### Planilla de pasos
Lista sin viñetas con filetes Sage entre ítems y un numeral Olive en 300 a 28px en una columna de 44px. En Inicio, los cuatro pasos de arranque usan numerales de 64px en 200.

### Lista con casillero
Cada ítem lleva un casillero de 12px con borde Olive, como una planilla de tareas. La variante «cruz» lleva casillero Ruby tachado para lo que no se hace; la variante «punto» lleva un punto Olive de 6px.

### Tabla y ficha
Tabla con filete Espresso arriba y abajo, cabeceras en rótulo Olive, filas separadas por filete Sage y primera columna en 600 Espresso. La ficha de cultivo usa una lista de definición en dos columnas (190px y el resto) con el mismo tratamiento.

### Calendario Gantt
Una fila por cultivo con nombre, forma de siembra y doce meses de 20px de alto. Siembra directa en Olive, almácigo en Sage, mes vacío en Sage al 16%, y el mes actual con contorno interno Ruby de 2px y su cabecera en Ruby.

### Banda de capítulo
Portadilla a todo el ancho en Olive con título de capítulo en Cream (hasta 128px) y la bajada en Papel. Abre cada etapa del ciclo dentro de Preparar y sembrar.

### Acordeón de preparados
Acordeón de Bootstrap sin caja, con filetes Sage entre ítems, Espresso arriba y abajo, títulos en 700 a 18px y el abierto en Ruby.

## Procedencia de las imágenes

Toda imagen que se publica lleva su origen en el pie o en una línea de crédito.

- **Grabados Vilmorin-Andrieux** (`imgs/laminas/grabado-*.webp`, `lamina-plan.webp`, `imgs/ilus/cultivo-*.webp`): grabados de *Les plantes potagères* (Vilmorin-Andrieux, 1883), de dominio público, tomados de Wikimedia Commons y recoloreados a línea Burgundy sobre papel. Crédito «Grabados de Vilmorin-Andrieux, *Les plantes potagères* (1883), dominio público.»
- **Diagramas INTA** (`imgs/ilus/inta/*.webp`): diagramas de INTA ProHuerta, *La Huerta Orgánica*, re-entintados en la paleta. Licencia CC BY-NC-SA, con crédito obligatorio «Redibujado a partir de INTA ProHuerta, *La Huerta Orgánica*.» en el pie de cada uno.
- **Fotos en duotono** (`imgs/laminas/foto-*.webp`): versiones en duotono Espresso, Olive y Cream de las fotos de la dueña del proyecto, con los originales en `imgs/_originales/`. Llevan pie y número de lámina.
- **Esquema de riego** (`imgs/laminas/esquema-goteo.svg`): esquema propio dibujado en SVG, trazo Burgundy de 2px con suelo en Sage, a partir de la ficha de riego por goteo del INTA. Crédito «Esquema propio a partir de INTA, riego por goteo.»

## Do's and Don'ts

### Do:
- **Do** separar con filetes de 1px (Espresso para estructura, Sage para subdivisión) y dejar los fondos transparentes.
- **Do** poner cada imagen dentro de una lámina con pie filetado, y número o crédito a la derecha en itálica Olive.
- **Do** alternar pliegos Cream y Papel, e invertir el papel de la lámina respecto del pliego.
- **Do** numerar los pasos y los índices con numerales livianos Olive y cifras tabulares.
- **Do** reservar Ruby para acción, página activa, selección y «hoy».
- **Do** pasar toda imagen nueva a la tinta del sistema (línea Burgundy o duotono Espresso, Olive y Cream) y registrar su procedencia.

### Don't:
- **Don't** redondear esquinas; el radio es 0 en todo, también en Bootstrap.
- **Don't** usar cajas con borde completo Sage ni navegación en píldora; esa es la versión anterior del sitio.
- **Don't** usar sombras de elevación ni desenfoques.
- **Don't** sumar colores fuera de la paleta del P1 ni una segunda familia tipográfica.
- **Don't** publicar un dibujo derivado del INTA sin el crédito «Redibujado a partir de INTA ProHuerta, *La Huerta Orgánica*.»
- **Don't** usar Ruby como decoración ni para texto que no se toca.
