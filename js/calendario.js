// Calendario anual, filtros y fichas de cultivo.
// Meses de siembra orientativos para la región pampeana (1 = enero).
// forma: "directa" | "almacigo"; temporada: "oi" otoño-invierno, "pv" primavera-verano, "todo".
const CULTIVOS = [
  { nombre: "Ajo",       forma: "directa",  temporada: "oi",   familia: "raiz",      meses: [3, 4, 5] },
  { nombre: "Haba",      forma: "directa",  temporada: "oi",   familia: "legumbre",  meses: [3, 4, 5, 6] },
  { nombre: "Arveja",    forma: "directa",  temporada: "oi",   familia: "legumbre",  meses: [4, 5, 6, 7] },
  { nombre: "Espinaca",  forma: "directa",  temporada: "oi",   familia: "hoja",      meses: [2, 3, 4, 5] },
  { nombre: "Repollo",   forma: "almacigo", temporada: "oi",   familia: "hoja",      meses: [1, 2, 3] },
  { nombre: "Brócoli",   forma: "almacigo", temporada: "oi",   familia: "hoja",      meses: [1, 2, 3] },
  { nombre: "Coliflor",  forma: "almacigo", temporada: "oi",   familia: "hoja",      meses: [1, 2, 3] },
  { nombre: "Cebolla",   forma: "almacigo", temporada: "oi",   familia: "raiz",      meses: [3, 4, 5, 6] },
  { nombre: "Tomate",    forma: "almacigo", temporada: "pv",   familia: "fruto",     meses: [7, 8, 9, 10] },
  { nombre: "Pimiento",  forma: "almacigo", temporada: "pv",   familia: "fruto",     meses: [7, 8, 9] },
  { nombre: "Berenjena", forma: "almacigo", temporada: "pv",   familia: "fruto",     meses: [8, 9] },
  { nombre: "Albahaca",  forma: "almacigo", temporada: "pv",   familia: "aromatica", meses: [9, 10, 11] },
  { nombre: "Zapallo",   forma: "directa",  temporada: "pv",   familia: "fruto",     meses: [10, 11] },
  { nombre: "Maíz",      forma: "directa",  temporada: "pv",   familia: "fruto",     meses: [10, 11, 12] },
  { nombre: "Poroto",    forma: "directa",  temporada: "pv",   familia: "legumbre",  meses: [10, 11, 12] },
  { nombre: "Lechuga",   forma: "directa",  temporada: "todo", familia: "hoja",      meses: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
  { nombre: "Acelga",    forma: "directa",  temporada: "todo", familia: "hoja",      meses: [1, 2, 3, 8, 9, 10, 11, 12] },
  { nombre: "Zanahoria", forma: "directa",  temporada: "todo", familia: "raiz",      meses: [1, 2, 3, 4, 8, 9, 10, 11, 12] },
];

// Las doce fichas del catálogo, en el orden de la grilla.
const FICHAS = [
  { nombre: "Tomate",    tipo: "Fruto",     epoca: "Primavera y verano", forma: "Almácigo", botanica: "Solanáceas",     siembra: "Agosto a octubre, al reparo",       como: "Almácigo y transplante, después de la última helada", distancia: "40 × 70 cm", riego: "Al pie y a la mañana, sin mojar las hojas", asociaciones: "Albahaca y caléndula" },
  { nombre: "Pimiento",  tipo: "Fruto",     epoca: "Primavera y verano", forma: "Almácigo", botanica: "Solanáceas",     siembra: "Julio a septiembre, al reparo",     como: "Almácigo y transplante, con tres o cuatro hojas",     distancia: "40 × 70 cm", riego: "Parejo, sin encharcar",                     asociaciones: "Albahaca y cebolla" },
  { nombre: "Berenjena", tipo: "Fruto",     epoca: "Primavera y verano", forma: "Almácigo", botanica: "Solanáceas",     siembra: "Agosto y septiembre, al reparo",    como: "Almácigo y transplante, con calor asentado",          distancia: "50 × 70 cm", riego: "Frecuente en plena fructificación",         asociaciones: "Poroto y caléndula" },
  { nombre: "Zapallo",   tipo: "Fruto",     epoca: "Primavera y verano", forma: "Directa",  botanica: "Cucurbitáceas",  siembra: "Octubre y noviembre",               como: "Directa a golpes, dos o tres semillas por hoyo",      distancia: "100 × 150 cm", riego: "Al pie, profundo y espaciado",           asociaciones: "Maíz y poroto (la milpa)" },
  { nombre: "Albahaca",  tipo: "Aromática", epoca: "Primavera y verano", forma: "Almácigo", botanica: "Lamiáceas",      siembra: "Septiembre a noviembre",            como: "Almácigo o plantín, entre las hortalizas",            distancia: "25 × 30 cm", riego: "Seguido, sin mojar las hojas",              asociaciones: "Tomate y pimiento" },
  { nombre: "Lechuga",   tipo: "Hoja",      epoca: "Casi todo el año",   forma: "Directa",  botanica: "Asteráceas",     siembra: "Todo el año, con media sombra en verano", como: "Directa a chorrillo o almácigo",              distancia: "25 × 25 cm", riego: "Liviano y frecuente",                       asociaciones: "Zanahoria y rabanito" },
  { nombre: "Acelga",    tipo: "Hoja",      epoca: "Casi todo el año",   forma: "Directa",  botanica: "Quenopodiáceas", siembra: "Enero a marzo y agosto a diciembre", como: "Directa en línea; se ralea",                       distancia: "15 × 35 cm", riego: "Parejo",                                    asociaciones: "Cebolla y lechuga" },
  { nombre: "Zanahoria", tipo: "Raíz",      epoca: "Casi todo el año",   forma: "Directa",  botanica: "Apiáceas",       siembra: "Agosto a abril, salvo pleno verano", como: "Directa a chorrillo; se ralea dos veces",          distancia: "5 × 20 cm",  riego: "Constante hasta que nace",                  asociaciones: "Cebolla y lechuga" },
  { nombre: "Espinaca",  tipo: "Hoja",      epoca: "Otoño e invierno",   forma: "Directa",  botanica: "Quenopodiáceas", siembra: "Febrero a mayo",                    como: "Directa en línea",                                    distancia: "10 × 25 cm", riego: "Parejo, con buen drenaje",                  asociaciones: "Haba y arveja" },
  { nombre: "Cebolla",   tipo: "Raíz",      epoca: "Otoño e invierno",   forma: "Almácigo", botanica: "Aliáceas",       siembra: "Marzo a junio",                     como: "Almácigo y transplante",                              distancia: "10 × 20 cm", riego: "Moderado; se corta antes de cosechar",      asociaciones: "Zanahoria y acelga" },
  { nombre: "Ajo",       tipo: "Raíz",      epoca: "Otoño e invierno",   forma: "Directa",  botanica: "Aliáceas",       siembra: "Marzo a mayo",                      como: "Directa, un diente por hoyo con la punta hacia arriba", distancia: "10 × 25 cm", riego: "Escaso; no tolera el encharcamiento",     asociaciones: "Tomate y frutilla" },
  { nombre: "Arveja",    tipo: "Legumbre",  epoca: "Otoño e invierno",   forma: "Directa",  botanica: "Leguminosas",    siembra: "Abril a julio",                     como: "Directa a golpes, con tutor",                         distancia: "5 × 50 cm",  riego: "Moderado",                                  asociaciones: "Zanahoria y lechuga" },
];

const sinTildes = (t) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

// Foto recortada de cada cultivo; si falta, cultivos.js pasa al grabado de Vilmorin.
const retrato = (nombre) => `../imgs/cultivos/${sinTildes(nombre)}.webp`;
const tonoDe = (nombre) => HUERTA.FAMILIAS[HUERTA.porNombre(nombre)?.familia || "hoja"].tono;

const FAMILIA_DE = { Fruto: "fruto", Hoja: "hoja", "Raíz": "raiz", Legumbre: "legumbre", "Aromática": "aromatica" };
const LETRAS = ["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const MES_HOY = new Date().getMonth() + 1;

const filtros = { temporada: "todo", forma: "todas", texto: "" };

// ---------- calendario anual ----------
const gantt = document.getElementById("gantt");

function pintarCalendario() {
  const lista = CULTIVOS.filter((c) =>
    (filtros.temporada === "todo" || c.temporada === filtros.temporada || c.temporada === "todo") &&
    (filtros.forma === "todas" || c.forma === filtros.forma) &&
    sinTildes(c.nombre).includes(sinTildes(filtros.texto))
  );

  const cabecera = `<div class="fila cabecera" role="row">
      <span role="columnheader">Especie</span><span role="columnheader">Forma</span>
      ${LETRAS.map((l, i) => `<span role="columnheader" class="${i + 1 === MES_HOY ? "hoy" : ""}">${l}</span>`).join("")}
    </div>`;

  const filas = lista.map((c) => {
    const tieneFicha = FICHAS.some((f) => f.nombre === c.nombre);
    const nombre = tieneFicha ? `<a href="#ficha" data-ficha="${c.nombre}">${c.nombre}</a>` : `<span class="fw-semibold">${c.nombre}</span>`;
    const celdas = LETRAS.map((_, i) => `<span class="mes ${i + 1 === MES_HOY ? "hoy" : ""}" role="cell" style="grid-column:${i + 3}" aria-label="${c.meses.includes(i + 1) ? "se siembra" : ""}"></span>`).join("");
    // Meses seguidos se agrupan en una píldora.
    const tramos = [];
    c.meses.forEach((m) => {
      const ultimo = tramos[tramos.length - 1];
      if (ultimo && ultimo[1] === m - 1) ultimo[1] = m; else tramos.push([m, m]);
    });
    const pildoras = tramos.map(([a, b]) => `<span class="tramo ${c.forma}" style="grid-column:${a + 2} / ${b + 3}" aria-hidden="true"></span>`).join("");
    const meses = celdas + pildoras;
    return `<div class="fila" role="row" aria-label="${c.nombre}: ${c.forma === "directa" ? "siembra directa" : "almácigo"}">
      <span role="cell" style="grid-column:1">${nombre}</span><span class="forma" role="cell" style="grid-column:2">${c.forma === "directa" ? "Directa" : "Almácigo"}</span>${meses}
    </div>`;
  }).join("");

  gantt.innerHTML = cabecera + (filas || `<p class="vacio mb-0">No hay especies con esos filtros. Probá con otra temporada o forma.</p>`);
}

function enlazarFiltro(id, clave) {
  const grupo = document.getElementById(id);
  grupo.addEventListener("click", (e) => {
    const boton = e.target.closest("button");
    if (!boton) return;
    grupo.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", b === boton));
    filtros[clave] = boton.dataset.valor;
    pintarCalendario();
  });
}

enlazarFiltro("filtro-temporada", "temporada");
enlazarFiltro("filtro-forma", "forma");
document.getElementById("buscador").addEventListener("input", (e) => {
  filtros.texto = e.target.value.trim();
  pintarCalendario();
});

// ---------- fichas ----------
const grilla = document.getElementById("grilla-fichas");
const ficha = document.getElementById("ficha");
let fichaActual = 0;

function pintarGrilla(familia = "todas") {
  grilla.innerHTML = FICHAS.map((f, i) => ({ f, i }))
    .filter(({ f }) => familia === "todas" || FAMILIA_DE[f.tipo] === familia)
    .map(({ f, i }) => `
      <div class="col-6 col-md-4 col-lg-2">
        <button class="ficha-tarjeta" type="button" data-indice="${i}" aria-current="${i === fichaActual}">
          <span class="etiqueta-foto">${f.tipo}</span><span class="flecha-cuadrada" aria-hidden="true">↗</span>
          <img class="img-fluid recorte" src="${retrato(f.nombre)}" data-cultivo="${sinTildes(f.nombre)}" data-base="../" style="--tono:${tonoDe(f.nombre)}" alt="" loading="lazy">
          <div class="cultivo-cuerpo"><h3>${f.nombre}</h3><p>${f.epoca}</p></div>
        </button>
      </div>`).join("");
}

function mostrarFicha(i, desplazar) {
  fichaActual = (i + FICHAS.length) % FICHAS.length;
  const f = FICHAS[fichaActual];
  const anterior = FICHAS[(fichaActual - 1 + FICHAS.length) % FICHAS.length].nombre;
  const siguiente = FICHAS[(fichaActual + 1) % FICHAS.length].nombre;

  const imagen = ficha.querySelector(".ficha-imagen");
  delete imagen.dataset.paso;
  imagen.dataset.cultivo = sinTildes(f.nombre);
  imagen.src = retrato(f.nombre);
  imagen.alt = f.nombre;
  const datosCultivo = HUERTA.porNombre(f.nombre);
  const enCalendario = CULTIVOS.find((c) => c.nombre === f.nombre);
  const nMeses = enCalendario ? enCalendario.meses.length : 0;
  ficha.style.setProperty("--tono", tonoDe(f.nombre));
  document.getElementById("ficha-sumar").href = `../index.html?sumar=${sinTildes(f.nombre)}#mis-plantas`;
  ficha.querySelector("[data-campo=familia]").textContent = f.tipo;
  ficha.querySelector("[data-campo=nombre]").textContent = f.nombre;
  ficha.querySelector("[data-campo=dias]").textContent = datosCultivo ? `Unos ${datosCultivo.dias} días desde la siembra` : "Según la variedad";
  const largo = 2 * Math.PI * 24;
  ficha.querySelector("[data-campo=anillo]").innerHTML = `<svg viewBox="0 0 58 58" aria-hidden="true"><circle cx="29" cy="29" r="24" fill="none" stroke="rgba(42,26,14,.15)" stroke-width="4"/><circle cx="29" cy="29" r="24" fill="none" stroke="#2A1A0E" stroke-width="4" stroke-linecap="round" stroke-dasharray="${(largo * nMeses) / 12} ${largo}" transform="rotate(-90 29 29)"/><text x="29" y="33" text-anchor="middle" font-size="12" font-weight="700" fill="#2A1A0E">${nMeses}/12</text></svg>Meses de siembra`;
  ficha.querySelector("[data-campo=miga]").textContent = f.nombre;
  ficha.querySelector("h3").textContent = f.nombre;
  ficha.querySelector(".chips").innerHTML = [f.tipo, f.epoca, f.forma].map((t) => `<span class="chip">${t}</span>`).join("");
  ["botanica", "siembra", "como", "distancia", "riego", "asociaciones"].forEach((k) => {
    ficha.querySelector(`[data-campo=${k}]`).textContent = f[k];
  });
  document.getElementById("ficha-anterior").textContent = `← ${anterior}`;
  document.getElementById("ficha-siguiente").textContent = `${siguiente} →`;

  grilla.querySelectorAll(".ficha-tarjeta").forEach((b) => b.setAttribute("aria-current", Number(b.dataset.indice) === fichaActual));
  if (desplazar) ficha.scrollIntoView({ behavior: "smooth", block: "start" });
}

const filtroFamilia = document.getElementById("filtro-familia");
filtroFamilia.addEventListener("click", (e) => {
  const boton = e.target.closest("button");
  if (!boton) return;
  filtroFamilia.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", b === boton));
  pintarGrilla(boton.dataset.valor);
});

grilla.addEventListener("click", (e) => {
  const boton = e.target.closest(".ficha-tarjeta");
  if (boton) mostrarFicha(Number(boton.dataset.indice), true);
});

gantt.addEventListener("click", (e) => {
  const enlace = e.target.closest("[data-ficha]");
  if (!enlace) return;
  e.preventDefault();
  mostrarFicha(FICHAS.findIndex((f) => f.nombre === enlace.dataset.ficha), true);
});

document.getElementById("ficha-anterior").addEventListener("click", () => mostrarFicha(fichaActual - 1, false));
document.getElementById("ficha-siguiente").addEventListener("click", () => mostrarFicha(fichaActual + 1, false));

pintarCalendario();
// En pantallas chicas, el calendario arranca mostrando el mes actual.
const marco = gantt.parentElement;
const columnaHoy = gantt.querySelector(".cabecera .hoy");
if (columnaHoy && marco.scrollWidth > marco.clientWidth) {
  marco.scrollLeft = columnaHoy.offsetLeft - marco.clientWidth / 2;
}
pintarGrilla();
mostrarFicha(0, false);
