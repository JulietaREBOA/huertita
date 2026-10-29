// «Qué sembrar este mes»: toma el mes actual y muestra cuatro cultivos.
// Datos orientativos para la región pampeana; la tabla completa vive en el Calendario.
const SIEMBRAS = [
  { mes: "enero",      temporada: "Verano",                 cultivos: [["Lechuga", "Directa"], ["Acelga", "Directa"], ["Zanahoria", "Directa"], ["Remolacha", "Directa"]] },
  { mes: "febrero",    temporada: "Verano, se prepara el otoño", cultivos: [["Brócoli", "Almácigo"], ["Coliflor", "Almácigo"], ["Repollo", "Almácigo"], ["Lechuga", "Directa"]] },
  { mes: "marzo",      temporada: "Otoño e invierno",       cultivos: [["Espinaca", "Directa"], ["Rabanito", "Directa"], ["Haba", "Directa"], ["Acelga", "Directa"]] },
  { mes: "abril",      temporada: "Otoño e invierno",       cultivos: [["Ajo", "Directa (dientes)"], ["Haba", "Directa"], ["Arveja", "Directa"], ["Espinaca", "Directa"]] },
  { mes: "mayo",       temporada: "Otoño e invierno",       cultivos: [["Arveja", "Directa"], ["Haba", "Directa"], ["Cebolla", "Almácigo"], ["Lechuga", "Directa"]] },
  { mes: "junio",      temporada: "Otoño e invierno",       cultivos: [["Arveja", "Directa"], ["Lechuga", "Directa"], ["Cebolla", "Trasplante"], ["Rabanito", "Directa"]] },
  { mes: "julio",      temporada: "Invierno, se prepara la primavera", cultivos: [["Lechuga", "Directa"], ["Acelga", "Directa"], ["Tomate", "Almácigo protegido"], ["Pimiento", "Almácigo protegido"]] },
  { mes: "agosto",     temporada: "Primavera y verano",     cultivos: [["Tomate", "Almácigo"], ["Pimiento", "Almácigo"], ["Berenjena", "Almácigo"], ["Papa", "Directa"]] },
  { mes: "septiembre", temporada: "Primavera y verano",     cultivos: [["Tomate", "Almácigo"], ["Pimiento", "Almácigo"], ["Berenjena", "Almácigo"], ["Albahaca", "Almácigo o plantín"]] },
  { mes: "octubre",    temporada: "Primavera y verano",     cultivos: [["Zapallo", "Directa"], ["Maíz", "Directa"], ["Poroto", "Directa"], ["Tomate", "Trasplante"]] },
  { mes: "noviembre",  temporada: "Primavera y verano",     cultivos: [["Zapallito", "Directa"], ["Pepino", "Directa"], ["Maíz", "Directa"], ["Poroto", "Directa"]] },
  { mes: "diciembre",  temporada: "Verano",                 cultivos: [["Zapallito", "Directa"], ["Poroto", "Directa"], ["Lechuga", "Directa"], ["Acelga", "Directa"]] },
];

const hoy = new Date();
const datos = SIEMBRAS[hoy.getMonth()];
const BASE_IMG = document.body.dataset.base || "";
const slugDe = (nombre) => nombre.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const LETRAS_MES = ["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

// Temporadas del calendario: otoño-invierno de febrero a julio, primavera-verano de agosto a enero.
function temporadaActual() {
  const m = hoy.getMonth();
  const enOI = m >= 1 && m <= 6;
  const anio = hoy.getFullYear() - (m === 0 ? 1 : 0);
  const inicio = enOI ? new Date(hoy.getFullYear(), 1, 1) : new Date(anio, 7, 1);
  const fin = enOI ? new Date(hoy.getFullYear(), 7, 1) : new Date(anio + 1, 1, 1);
  const finMes = new Date(hoy.getFullYear(), m + 1, 1);
  const total = fin - inicio;
  return {
    nombre: enOI ? "Otoño e invierno" : "Primavera y verano",
    recorrido: (hoy - inicio) / total,
    mes: (finMes - hoy) / total,
  };
}

// Dial: el año como un reloj, con el avance hasta hoy.
function dibujarDial() {
  const caja = document.getElementById("dial-mes");
  if (!caja) return;
  const inicioAnio = new Date(hoy.getFullYear(), 0, 1);
  const f = (hoy - inicioAnio) / (new Date(hoy.getFullYear() + 1, 0, 1) - inicioAnio);
  const c = 150, r = 118, l = 2 * Math.PI * r;
  const ang = f * 2 * Math.PI - Math.PI / 2;
  const marcas = LETRAS_MES.map((t, i) => {
    const a = ((i + 0.5) / 12) * 2 * Math.PI - Math.PI / 2;
    return `<text class="marca-mes ${i === hoy.getMonth() ? "hoy" : ""}" x="${c + Math.cos(a) * 142}" y="${c + Math.sin(a) * 142 + 4}" text-anchor="middle">${t}</text>`;
  }).join("");
  const puntos = Array.from({ length: 60 }, (_, i) => {
    const a = (i / 60) * 2 * Math.PI;
    return `<circle cx="${c + Math.cos(a) * 82}" cy="${c + Math.sin(a) * 82}" r="${i % 5 ? 0.9 : 1.6}" fill="rgba(251,248,236,.45)"/>`;
  }).join("");
  caja.innerHTML = `<svg viewBox="0 0 300 300" role="img" aria-label="Día ${hoy.getDate()} de ${datos.mes}, ${Math.round(f * 100)} % del año">
    <defs>
      <linearGradient id="dial-vidrio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBF8EC" stop-opacity=".95"/><stop offset="1" stop-color="#FBF8EC" stop-opacity=".55"/></linearGradient>
      <radialGradient id="dial-centro" cx="50%" cy="40%"><stop offset="0" stop-color="#FBF8EC" stop-opacity=".1"/><stop offset="1" stop-color="#FBF8EC" stop-opacity="0"/></radialGradient>
      <filter id="dial-brillo" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>
    </defs>
    <circle class="pista" cx="${c}" cy="${c}" r="${r}" fill="none" stroke-width="10"/>
    <circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="#D3E36A" stroke-opacity=".35" stroke-width="12" stroke-dasharray="${l * f} ${l}" transform="rotate(-90 ${c} ${c})" filter="url(#dial-brillo)"/>
    <circle class="avance" cx="${c}" cy="${c}" r="${r}" fill="none" stroke="url(#dial-vidrio)" stroke-width="10" stroke-linecap="round" stroke-dasharray="${l * f} ${l}" transform="rotate(-90 ${c} ${c})"/>
    <circle cx="${c}" cy="${c}" r="96" fill="url(#dial-centro)"/>${puntos}${marcas}
    <circle cx="${c + Math.cos(ang) * r}" cy="${c + Math.sin(ang) * r}" r="18" fill="#D3E36A" opacity=".55" filter="url(#dial-brillo)"/>
    <circle cx="${c + Math.cos(ang) * r}" cy="${c + Math.sin(ang) * r}" r="8" fill="#E6F28F" stroke="#FBF8EC" stroke-width="2"/>
    <text class="numero" x="${c}" y="${c + 14}" text-anchor="middle">${hoy.getDate()}</text>
    <text class="rotulo" x="${c}" y="${c + 40}" text-anchor="middle">de ${datos.mes}</text>
  </svg>`;
}

// Inicio: tablero del mes.
const contenedor = document.getElementById("cultivos-mes");
if (contenedor) {
  document.getElementById("titulo-mes").textContent = datos.mes;
  const temporadaMes = document.getElementById("temporada-mes");
  if (temporadaMes) temporadaMes.textContent = `${datos.temporada}. Se actualiza solo según la fecha.`;
  dibujarDial();

  // Tarjeta de fecha y aviso del día.
  const [primero, forma] = datos.cultivos[0];
  const fecha = document.getElementById("tarjeta-fecha");
  if (fecha) fecha.innerHTML = `
    <div class="fecha"><small>${datos.mes}</small><b>${String(hoy.getDate()).padStart(2, "0")}</b></div>
    <div class="dato"><img src="${BASE_IMG}imgs/cultivos/${slugDe(primero)}.webp" data-cultivo="${slugDe(primero)}" data-base="${BASE_IMG}" alt=""><div><strong>Hoy toca sembrar</strong><span>${primero}, ${forma.toLowerCase()}</span></div></div>`;
  const aviso = document.getElementById("aviso-hoy");
  if (aviso) aviso.innerHTML = `<img src="${BASE_IMG}imgs/cultivos/${slugDe(primero)}.webp" data-cultivo="${slugDe(primero)}" data-base="${BASE_IMG}" alt=""><span class="texto"><strong>Hoy toca sembrar ${primero.toLowerCase()}</strong><span>${hoy.getDate()} de ${datos.mes}, ${forma.toLowerCase()}</span></span><span class="flecha-cuadrada" aria-hidden="true">↗</span>`;

  // Barra segmentada de la temporada.
  const t = temporadaActual();
  const prog = document.getElementById("tarjeta-progreso");
  if (prog) {
    const p1 = Math.round(t.recorrido * 100), p2 = Math.max(1, Math.round(t.mes * 100)), p3 = Math.max(0, 100 - p1 - p2);
    prog.innerHTML = `<div class="valor"><small>${t.nombre}</small><b>${p1}%</b></div>
      <div class="barra-segmentos" role="img" aria-label="Temporada recorrida en un ${p1} %">
        <div class="s1" style="flex:${p1}"><i></i></div>
        <div class="s2" style="flex:${p2}"><i></i></div>
        <div class="s3" style="flex:${p3}"><i></i></div>
      </div>`;
  }

  // Lista con interruptor: al marcar «Sembrado» la planta pasa a tu huerta.
  const pintarLista = () => {
    const mias = typeof MIS_PLANTAS !== "undefined" ? MIS_PLANTAS.todas() : [];
    const esteMes = (p) => p.fecha.slice(0, 7) === `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}`;
    contenedor.innerHTML = datos.cultivos.map(([nombre, forma], i) => {
      const slug = slugDe(nombre);
      const sembrada = mias.some((p) => p.slug === slug && esteMes(p));
      return `<div class="tarea">
        <img class="avatar" src="${BASE_IMG}imgs/cultivos/${slug}.webp" data-cultivo="${slug}" data-base="${BASE_IMG}" alt="">
        <div class="tarea-nombre"><strong>${nombre}</strong><span class="forma">${forma}</span></div>
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" role="switch" id="sembrado-${i}" data-slug="${slug}" ${sembrada ? "checked" : ""} ${HUERTA.porSlug(slug) ? "" : "disabled"}>
          <label class="form-check-label" for="sembrado-${i}">Sembrado</label>
        </div>
      </div>`;
    }).join("");
    document.getElementById("cuenta-mes").textContent = datos.cultivos.length;
  };
  pintarLista();
  contenedor.addEventListener("change", (e) => {
    const s = e.target.closest("[data-slug]");
    if (!s || typeof MIS_PLANTAS === "undefined") return;
    const mes = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}`;
    if (s.checked) {
      MIS_PLANTAS.agregar({ slug: s.dataset.slug, fecha: `${mes}-${String(hoy.getDate()).padStart(2, "0")}`, lugar: "cantero" });
    } else {
      const p = MIS_PLANTAS.todas().find((x) => x.slug === s.dataset.slug && x.fecha.slice(0, 7) === mes);
      if (p) MIS_PLANTAS.quitar(p.id);
    }
  });
  if (typeof MIS_PLANTAS !== "undefined") MIS_PLANTAS.alCambiar(pintarLista);
}

// Calendario: tarjeta «Este mes» con chips.
const chipsMes = document.getElementById("chips-mes");
if (chipsMes) {
  document.getElementById("rotulo-mes").textContent = `Este mes, ${datos.mes}`;
  document.getElementById("temporada-mes").textContent = datos.temporada;
  chipsMes.innerHTML = datos.cultivos.map(([nombre, forma]) => `<span class="chip" title="${forma}">${nombre}</span>`).join("");
}
