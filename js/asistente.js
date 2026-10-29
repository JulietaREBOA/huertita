// Asistente de huerta: clima de tu ciudad, riego del día, consejo diario y diario de tus plantas.
// Clima: Open-Meteo (open-meteo.com), gratis y sin clave. Tus plantas se guardan en este navegador.

// ---------- guardado local ----------
const guardado = {
  leer(clave, porDefecto) {
    try { const v = localStorage.getItem(clave); return v ? JSON.parse(v) : porDefecto; } catch { return porDefecto; }
  },
  escribir(clave, valor) {
    try { localStorage.setItem(clave, JSON.stringify(valor)); return true; } catch { return false; }
  },
};

// Fotos del diario en IndexedDB (pesan demasiado para localStorage).
const fotos = (() => {
  let base;
  function abrir() {
    if (base) return base;
    base = new Promise((ok, mal) => {
      try {
        const pedido = indexedDB.open("huertita", 1);
        pedido.onupgradeneeded = () => pedido.result.createObjectStore("fotos");
        pedido.onsuccess = () => ok(pedido.result);
        pedido.onerror = () => mal(pedido.error);
      } catch (e) { mal(e); }
    });
    return base;
  }
  async function operar(modo, fn) {
    const db = await abrir();
    return new Promise((ok, mal) => {
      const t = db.transaction("fotos", modo);
      const r = fn(t.objectStore("fotos"));
      t.oncomplete = () => ok(r && r.result);
      t.onerror = () => mal(t.error);
    });
  }
  return {
    guardar: (id, dato) => operar("readwrite", (s) => s.put(dato, id)),
    leer: (id) => operar("readonly", (s) => s.get(id)),
    borrar: (id) => operar("readwrite", (s) => s.delete(id)),
  };
})();

// Achica la foto a 900 px de lado antes de guardarla.
function achicarFoto(archivo) {
  return new Promise((ok, mal) => {
    const lector = new FileReader();
    lector.onload = () => {
      const img = new Image();
      img.onload = () => {
        const escala = Math.min(1, 900 / Math.max(img.width, img.height));
        const lienzo = Object.assign(document.createElement("canvas"), { width: Math.round(img.width * escala), height: Math.round(img.height * escala) });
        lienzo.getContext("2d").drawImage(img, 0, 0, lienzo.width, lienzo.height);
        ok(lienzo.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = mal;
      img.src = lector.result;
    };
    lector.onerror = mal;
    lector.readAsDataURL(archivo);
  });
}

// ---------- fechas ----------
const HOY = new Date();
HOY.setHours(0, 0, 0, 0);
const DIA = 86400000;
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const DIAS_SEMANA = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const aISO = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const deISO = (s) => { const [a, m, d] = s.split("-").map(Number); return new Date(a, m - 1, d); };
const diasDesde = (iso) => Math.round((HOY - deISO(iso)) / DIA);
const fechaCorta = (d) => `${d.getDate()} de ${MESES[d.getMonth()]}`;
const diaDelAno = Math.round((HOY - new Date(HOY.getFullYear(), 0, 1)) / DIA) + 1;

// ---------- mis plantas ----------
const MIS_PLANTAS = (() => {
  const CLAVE = "huertita-plantas";
  let lista = guardado.leer(CLAVE, []);
  const oyentes = [];
  const avisar = () => { guardado.escribir(CLAVE, lista); oyentes.forEach((fn) => fn(lista)); };
  const nuevoId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  return {
    todas: () => lista,
    una: (id) => lista.find((p) => p.id === id),
    alCambiar: (fn) => oyentes.push(fn),
    agregar({ slug, fecha, lugar }) {
      const c = HUERTA.porSlug(slug);
      const planta = { id: nuevoId(), slug, nombre: c.nombre, fecha, lugar, novedades: [] };
      lista = [...lista, planta];
      avisar();
      return planta;
    },
    quitar(id) {
      const p = lista.find((x) => x.id === id);
      if (p) p.novedades.filter((n) => n.foto).forEach((n) => fotos.borrar(n.id).catch(() => {}));
      lista = lista.filter((x) => x.id !== id);
      avisar();
    },
    anotar(id, novedad) {
      const p = lista.find((x) => x.id === id);
      if (!p) return;
      p.novedades = [{ id: nuevoId(), fecha: aISO(new Date()), ...novedad }, ...p.novedades];
      avisar();
      return p.novedades[0];
    },
  };
})();

// ---------- íconos del clima (trazos de Lucide) ----------
const ICONOS = {
  sol: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  solNube: '<path d="M12 2v2M4.93 4.93l1.41 1.41M20 12h2M19.07 4.93l-1.41 1.41M15.95 12.65a4 4 0 0 0-5.93-4.13"/><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"/>',
  nube: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
  niebla: '<path d="M4 14.9A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.24"/><path d="M16 17H7M17 21H9"/>',
  llovizna: '<path d="M4 14.9A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.24"/><path d="M8 19v1M8 14v1M16 19v1M16 14v1M12 21v1M12 16v1"/>',
  lluvia: '<path d="M4 14.9A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.24"/><path d="M16 14v6M8 14v6M12 16v6"/>',
  nieve: '<path d="M4 14.9A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.24"/><path d="M8 15h.01M8 19h.01M12 17h.01M12 21h.01M16 15h.01M16 19h.01"/>',
  tormenta: '<path d="M6 16.33A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.97"/><path d="m13 12-3 5h4l-3 5"/>',
};
const icono = (nombre) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONOS[nombre]}</svg>`;

function describir(codigo) {
  if (codigo === 0) return ["Despejado", "sol"];
  if (codigo <= 2) return ["Algo nublado", "solNube"];
  if (codigo === 3) return ["Nublado", "nube"];
  if (codigo <= 48) return ["Niebla", "niebla"];
  if (codigo <= 57) return ["Llovizna", "llovizna"];
  if (codigo <= 67) return ["Lluvia", "lluvia"];
  if (codigo <= 77) return ["Nieve", "nieve"];
  if (codigo <= 82) return ["Chaparrones", "lluvia"];
  return ["Tormenta", "tormenta"];
}

// ---------- clima ----------
const CIUDAD_INICIAL = { nombre: "Buenos Aires", lat: -34.61, lon: -58.38 };
let ciudad = guardado.leer("huertita-ciudad", CIUDAD_INICIAL);
let clima = null;

async function traerClima() {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${ciudad.lat}&longitude=${ciudad.lon}` +
    "&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day" +
    "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,et0_fao_evapotranspiration,wind_speed_10m_max,sunrise,sunset" +
    "&past_days=2&forecast_days=6&timezone=auto";
  const r = await fetch(url);
  if (!r.ok) throw new Error("clima");
  return r.json();
}

// Momento del día y posición del sol (o la luna) sobre el arco, con la hora local de la ciudad.
function momentoDelDia() {
  const a = clima.current, d = clima.daily;
  const ahora = new Date(a.time), sale = new Date(d.sunrise[2]), pone = new Date(d.sunset[2]);
  const HORA = 3600000;
  if (a.is_day) {
    const f = (ahora - sale) / (pone - sale);
    if (ahora - sale < HORA) return { nombre: "Amanecer", cielo: "dorado", f };
    if (pone - ahora < HORA) return { nombre: "Atardecer", cielo: "dorado", f };
    return { nombre: ahora.getHours() < 13 ? "Mañana" : "Tarde", cielo: "dia", f };
  }
  const [desde, hasta] = ahora < sale ? [new Date(d.sunset[1]), sale] : [pone, new Date(d.sunrise[3])];
  return { nombre: "Noche", cielo: "noche", f: (ahora - desde) / (hasta - desde) };
}

// Arco de vidrio: un tramo de círculo que corta el borde de abajo; el astro recorre el tramo visible.
function arco(f, noche) {
  const cx = 200, cy = 262, r = 182, borde = Math.asin((cy - 200) / r);
  // El astro no llega a las puntas, así no se corta contra el borde.
  const t = Math.PI - borde - (0.06 + 0.88 * Math.max(0, Math.min(1, f))) * (Math.PI - 2 * borde);
  const x = (cx + r * Math.cos(t)).toFixed(1), y = (cy - r * Math.sin(t)).toFixed(1);
  const luz = noche ? "#F4F6FF" : "#FFE48A";
  return `<svg class="clima-arco" viewBox="0 0 400 200" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
    <defs>
      <radialGradient id="cupula" cx="50%" cy="100%" r="80%"><stop offset="0" stop-color="#fff" stop-opacity="${noche ? ".08" : ".26"}"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
      <linearGradient id="vidrio" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="${noche ? ".34" : ".75"}"/><stop offset="1" stop-color="#fff" stop-opacity="${noche ? ".06" : ".18"}"/></linearGradient>
      <radialGradient id="resplandor"><stop offset="0" stop-color="${luz}" stop-opacity=".55"/><stop offset=".35" stop-color="${luz}" stop-opacity=".18"/><stop offset="1" stop-color="${luz}" stop-opacity="0"/></radialGradient>
      <radialGradient id="astro" cx="40%" cy="38%"><stop offset="0" stop-color="#fff"/><stop offset=".55" stop-color="${noche ? "#F1F2F6" : "#FFF1B0"}"/><stop offset="1" stop-color="${noche ? "#C9CCD6" : "#FFC93D"}"/></radialGradient>
      <filter id="brillo" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
    </defs>
    <circle cx="${cx}" cy="${cy}" r="${r - 9}" fill="url(#cupula)"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#fff" stroke-opacity="${noche ? ".08" : ".22"}" stroke-width="26" filter="url(#brillo)"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="url(#vidrio)" stroke-width="15"/>
    <circle cx="${cx}" cy="${cy}" r="${r + 7}" fill="none" stroke="#fff" stroke-opacity="${noche ? ".18" : ".45"}" stroke-width="1"/>
    <g class="astro">
      <circle cx="${x}" cy="${y}" r="120" fill="url(#resplandor)"/>
      <circle cx="${x}" cy="${y}" r="24" fill="${luz}" opacity=".7" filter="url(#brillo)"/>
      <circle cx="${x}" cy="${y}" r="12" fill="url(#astro)"/>
    </g>
  </svg>`;
}

// Tiempo que se dibuja en el cielo, a partir del código WMO de Open-Meteo.
function tiempoDe(codigo) {
  if (codigo === 0) return "despejado";
  if (codigo <= 2) return "algo";
  if (codigo === 3) return "nublado";
  if (codigo <= 48) return "niebla";
  if (codigo <= 57) return "llovizna";
  if (codigo <= 67 || (codigo >= 80 && codigo <= 82)) return "lluvia";
  if (codigo <= 77 || codigo === 85 || codigo === 86) return "nieve";
  return "tormenta";
}

// Un cúmulo: base chata y copos que suben hacia el centro; el filtro le da relieve con luz de arriba.
function cumulo(semilla) {
  let h = '<ellipse cx="0" cy="18" rx="150" ry="30"/>';
  for (let i = 0; i < 13; i++) {
    const t = i / 12, alto = Math.sin(Math.PI * t);
    const r = 22 + alto * 34 + ((i * semilla * 7) % 11);
    h += `<circle cx="${Math.round(-135 + 270 * t)}" cy="${Math.round(10 - alto * 38 - ((i * semilla * 5) % 9))}" r="${Math.round(r)}"/>`;
  }
  return h;
}
// Dónde va cada nube (x, y, escala) según cuánto está cubierto el cielo.
const NUBES = {
  pocas: [[262, 136, .46], [86, 176, .24]],
  muchas: [[118, 142, .46], [300, 132, .5], [214, 184, .4]],
};

// Nubes, lluvia, gotas en el vidrio, copos o estrellas por encima del arco y por debajo del texto.
function capasDelTiempo(tiempo, noche) {
  const cuales = { algo: "pocas", nublado: "muchas", llovizna: "muchas", lluvia: "muchas", nieve: "muchas", tormenta: "muchas" }[tiempo];
  const caen = { llovizna: 34, lluvia: 60, tormenta: 66, nieve: 30 }[tiempo] || 0;
  const mojado = ["llovizna", "lluvia", "tormenta"].includes(tiempo);
  let dibujo = "";
  if (noche && (tiempo === "despejado" || tiempo === "algo")) {
    dibujo += Array.from({ length: 22 }, (_, i) =>
      `<circle class="estrella" cx="${(i * 71) % 400}" cy="${8 + ((i * 37) % 120)}" r="${i % 4 ? .7 : 1.2}" style="--i:${i}"/>`).join("");
  }
  if (cuales) {
    dibujo += NUBES[cuales].map(([x, y, e], i) =>
      `<g transform="translate(${x} ${y}) scale(${e})" filter="url(#nube-real)" fill="url(#nube-tono)">${cumulo(i + 1)}</g>`).join("");
  }
  let html = `<svg class="clima-tiempo" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="nube-tono" x1="0" y1="0" x2="0" y2="1"><stop offset=".25" style="stop-color:var(--nube)"/><stop offset="1" style="stop-color:var(--nube-sombra)"/></linearGradient>
      <filter id="nube-real" x="-30%" y="-40%" width="160%" height="180%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency=".02" numOctaves="4" seed="4" result="ruido"/>
        <feDisplacementMap in="SourceGraphic" in2="ruido" scale="25" xChannelSelector="R" yChannelSelector="G" result="forma"/>
        <feGaussianBlur in="forma" stdDeviation="4" result="suave"/>
        <feTurbulence type="fractalNoise" baseFrequency=".012" numOctaves="3" seed="11" result="detalle"/>
        <feGaussianBlur in="detalle" stdDeviation="3" result="detalle2"/>
        <feComposite in="detalle2" in2="suave" operator="arithmetic" k1="1" result="alto"/>
        <feDiffuseLighting in="alto" surfaceScale="4" diffuseConstant="1" lighting-color="#fff" result="luz"><feDistantLight azimuth="250" elevation="55"/></feDiffuseLighting>
        <feComponentTransfer in="luz" result="luz2"><feFuncR type="linear" slope=".55" intercept=".52"/><feFuncG type="linear" slope=".55" intercept=".52"/><feFuncB type="linear" slope=".55" intercept=".53"/></feComponentTransfer>
        <feComposite in="luz2" in2="suave" operator="arithmetic" k1="1"/>
      </filter>
    </defs>${dibujo}</svg>`;
  if (caen) {
    const clase = tiempo === "nieve" ? "copo" : "gota";
    // Un tercio va adelante: más largas, más claras y más rápidas.
    html += `<div class="clima-caen">${Array.from({ length: caen }, (_, i) =>
      `<span class="${clase}${i % 3 === 0 ? " cerca" : ""}" style="left:${12 + ((i * 37) % 76)}%;--retraso:${-((i * 53) % 100) / 100}s;--dur:${0.5 + ((i * 29) % 40) / 100}s"></span>`).join("")}</div>`;
  }
  if (mojado) {
    html += `<div class="clima-vidrio">${Array.from({ length: 18 }, (_, i) =>
      `<span style="left:${(i * 43) % 96 + 2}%;top:${(i * 29) % 70 + 4}%;--t:${3 + ((i * 17) % 8)}px"></span>`).join("")}</div>`;
  }
  if (tiempo === "niebla") html += `<div class="clima-niebla"><span></span><span></span><span></span></div>`;
  if (tiempo === "tormenta") html += `<div class="clima-relampago"></div>`;
  return html;
}

// Línea ondulada con la máxima de cada día, como un horizonte de temperaturas.
function ondaDeMaximas(dias) {
  const max = Math.max(...dias.map((d) => d.t)), min = Math.min(...dias.map((d) => d.t));
  const puntos = dias.map((d, i) => ({ ...d, x: 10 + i * 20, y: max === min ? 50 : 70 - ((d.t - min) / (max - min)) * 40 }));
  // Curva suave que pasa por todos los puntos y sale por los bordes.
  const p = [{ x: -10, y: puntos[0].y }, ...puntos, { x: 110, y: puntos.at(-1).y }];
  let d = `M${p[0].x},${p[0].y}`;
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[i - 1] || p[i], b = p[i], c = p[i + 1], e = p[i + 2] || c;
    d += ` C${b.x + (c.x - a.x) / 6},${b.y + (c.y - a.y) / 6} ${c.x - (e.x - b.x) / 6},${c.y - (e.y - b.y) / 6} ${c.x},${c.y}`;
  }
  return `<div class="clima-onda" aria-label="Máximas de los próximos cinco días">
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="${d}" vector-effect="non-scaling-stroke"/></svg>
    ${puntos.map((q, i) => `<div class="onda-punto${i === 0 ? " hoy" : ""}" style="left:${q.x}%;top:${q.y}%" aria-label="${q.dia}: ${q.desc}, ${q.t}°">
      <b>${q.t}°</b><i></i><small>${q.dia}</small></div>`).join("")}
  </div>`;
}

function pintarClima() {
  const caja = document.getElementById("clima");
  if (!caja) return;
  caja.querySelector(".ciudad span").textContent = ciudad.nombre;
  const cuerpo = caja.querySelector(".clima-cuerpo");
  if (!clima) {
    cuerpo.innerHTML = `<div class="clima-cielo" data-cielo="nublado"><div class="clima-arriba"><div><p class="estado">Sin datos</p><p class="momento">Revisá la conexión o probá con otra ciudad.</p></div></div></div>`;
    return;
  }
  const a = clima.current, d = clima.daily;
  const [estado] = describir(a.weather_code);
  const m = momentoDelDia();
  // De día, el cielo se pone gris si está cubierto o llueve.
  const tiempo = tiempoDe(a.weather_code);
  const cielo = m.cielo === "dia" && a.weather_code >= 3 ? (a.weather_code >= 51 ? "lluvia" : "nublado") : m.cielo;
  const dias = d.time.slice(2, 7).map((t, i) => {
    const k = i + 2;
    return { dia: i === 0 ? "Hoy" : DIAS_SEMANA[deISO(t).getDay()], desc: describir(d.weather_code[k])[0], t: Math.round(d.temperature_2m_max[k]) };
  });
  cuerpo.innerHTML = `
    <div class="clima-cielo" data-cielo="${cielo}" data-tiempo="${tiempo}">
      ${arco(m.f, m.cielo === "noche")}
      ${capasDelTiempo(tiempo, m.cielo === "noche")}
      <div class="clima-arriba">
        <div><p class="estado">${estado}</p><p class="momento">${m.nombre}</p></div>
        <div class="clima-temp"><p class="temp">${Math.round(a.temperature_2m)}<span>°</span></p>
          <p class="clima-datos">Viento ${Math.round(a.wind_speed_10m)} km/h<br>Humedad ${a.relative_humidity_2m}%</p></div>
      </div>
    </div>
    ${ondaDeMaximas(dias)}`;
}

function calcularRiego() {
  const d = clima.daily;
  const perdida = d.et0_fao_evapotranspiration[0] + d.et0_fao_evapotranspiration[1] + d.et0_fao_evapotranspiration[2];
  const llovio = d.precipitation_sum[0] + d.precipitation_sum[1];
  const lluviaHoy = (d.precipitation_probability_max[2] ?? 0) >= 60 ? d.precipitation_sum[2] : 0;
  const lluviaManana = (d.precipitation_probability_max[3] ?? 0) >= 60 ? d.precipitation_sum[3] : 0;
  const falta = Math.max(0, perdida - llovio - lluviaHoy);
  const tmax = d.temperature_2m_max[2];
  const helada = Math.min(d.temperature_2m_min[2], d.temperature_2m_min[3]) <= 3;
  const viento = d.wind_speed_10m_max[2] >= 35;
  const razones = [];
  let veredicto, litros = Math.min(12, Math.round(falta)), seco = false;

  if (falta < 1.5) {
    veredicto = "Hoy no hace falta regar";
    litros = 0;
  } else if (lluviaManana >= 5 && falta < 6) {
    veredicto = "Esperá: mañana llueve";
    litros = 0;
    razones.push({ t: `Se esperan ${lluviaManana.toFixed(0)} mm mañana. Regá solo las macetas si la tierra está seca.`, c: "clave" });
  } else if (falta < 4) {
    veredicto = "Riego liviano al pie";
    seco = true;
  } else {
    veredicto = "Regá a fondo hoy";
    seco = true;
  }
  razones.unshift({ t: llovio >= 1 ? `Llovieron ${llovio.toFixed(0)} mm en los últimos dos días.` : "No llovió en los últimos dos días.", c: "" });
  razones.push({ t: `La huerta pierde unos ${perdida.toFixed(0)} mm entre el sol y el viento de tres días.`, c: "" });
  if (seco && tmax >= 30) razones.push({ t: `Hace ${Math.round(tmax)}°: en macetas, repetí el riego al atardecer.`, c: "clave" });
  if (seco) razones.push({ t: "Regá temprano o al atardecer, al pie y sin mojar las hojas.", c: "" });
  if (helada) razones.push({ t: "Puede helar: cubrí los plantines a la noche con tela o botellas cortadas.", c: "alerta" });
  if (viento) razones.push({ t: "Viento fuerte: revisá tutores y atá las plantas altas.", c: "alerta" });

  // Plantas propias con más necesidad de agua.
  const sedientas = [...new Set(MIS_PLANTAS.todas().filter((p) => HUERTA.porSlug(p.slug)?.riego === "alta").map((p) => p.nombre))];
  if (seco && sedientas.length) razones.push({ t: `Prioridad: ${sedientas.slice(0, 3).join(", ")}, que piden más agua.`, c: "clave" });

  return { veredicto, litros, razones, seco, perdida, lluvia: llovio + lluviaHoy, helada, tmax, lluviaManana };
}

function pintarRiego() {
  const caja = document.getElementById("riego");
  if (!caja) return;
  const cuerpo = caja.querySelector(".riego-cuerpo");
  if (!clima) {
    caja.classList.remove("seco");
    cuerpo.innerHTML = `<p class="veredicto">Tocá la tierra</p><ul class="razones"><li class="clave">Si a dos centímetros de profundidad está seca, regá al pie.</li><li>Regá temprano o al atardecer, sin mojar las hojas.</li></ul>`;
    return;
  }
  const r = calcularRiego();
  caja.classList.toggle("seco", r.seco);
  // Pluviómetro: el agua es la lluvia que ya cayó; la marca, lo que la huerta perdió y hay que reponer.
  const escala = Math.max(r.perdida, r.lluvia, 4) * 1.18;
  const nivel = Math.min(100, (r.lluvia / escala) * 100);
  const meta = Math.min(100, (r.perdida / escala) * 100);
  const falta = Math.max(0, r.perdida - r.lluvia);
  cuerpo.innerHTML = `
    <p class="veredicto">${r.veredicto}</p>
    <div class="riego-medio">
      <div class="cantidad">${r.litros
        ? `<b>${r.litros}<span>L</span></b><small>por metro cuadrado<br>de cantero</small>`
        : `<b>0<span>L</span></b><small>por ahora<br>no hace falta</small>`}</div>
      <div class="pluvio" role="img" aria-label="Llovieron ${r.lluvia.toFixed(0)} mm de los ${r.perdida.toFixed(0)} mm que perdió la huerta; faltan ${falta.toFixed(0)} mm">
        <div class="pluvio-tubo">
          <div class="pluvio-agua" style="height:${nivel}%"><svg viewBox="0 0 120 10" preserveAspectRatio="none" aria-hidden="true"><path d="M0 5 Q15 0 30 5 T60 5 T90 5 T120 5 V10 H0Z"/></svg></div>
          <div class="pluvio-meta" style="bottom:${meta}%"></div>
          <div class="pluvio-brillo"></div>
        </div>
        <div class="pluvio-marcas" aria-hidden="true">
          <span style="bottom:${meta}%"><b>${r.perdida.toFixed(0)} mm</b> necesita</span>
          <span class="lluvia" style="bottom:${nivel}%"><b>${r.lluvia.toFixed(0)} mm</b> llovió</span>
        </div>
      </div>
    </div>
    <ul class="razones">${r.razones.map((x) => `<li class="${x.c}">${x.t}</li>`).join("")}</ul>`;
}

// ---------- consejo del día ----------
// Juli: verificar contra La Huerta Orgánica y Mi casa, mi huerta.
const CONSEJOS = [
  "Cubrí el suelo con paja: guarda la humedad.",
  "Sembrá de a poco, cada quince días.",
  "Sumá flores: atraen bichos que ayudan.",
  "Revisá el envés de las hojas.",
  "Compost al pie de las que dan fruto.",
  "Donde hubo tomate, va una hoja o una legumbre.",
  "Desmalezá con la tierra húmeda.",
  "Anotá qué sembraste y cuándo.",
  "Aromáticas en los bordes: alejan plagas.",
  "Juntá agua de lluvia para regar.",
  "Albahaca al lado de cada tomate.",
  "Sacá las hojas con manchas.",
  "Dejá florecer una lechuga: da semilla.",
  "Regá profundo: la raíz baja a buscar agua.",
  "Cosechá temprano, con las hojas firmes.",
  "Tutorá antes de que haga falta.",
  "El rabanito sale en un mes.",
  "Cáscara de huevo molida frena caracoles.",
  "Raleá: con espacio, rinde más.",
  "Mirá la huerta un rato cada día.",
];
let consejoActual = diaDelAno % CONSEJOS.length;
const FOTOS_CONSEJO = ["plantines", "brotes", "manos-plantando", "maceta-tierra", "riego", "vivero"];

function consejosDeHoy() {
  const lista = [];
  if (clima) {
    const r = calcularRiego();
    if (r.helada) lista.push("Puede helar: cubrí los plantines.");
    else if (r.tmax >= 32) lista.push(`${Math.round(r.tmax)}°: media sombra a la tarde.`);
    if (r.lluviaManana >= 10) lista.push("Mañana llueve: aboná hoy.");
  }
  MIS_PLANTAS.todas().forEach((p) => {
    const c = HUERTA.porSlug(p.slug), d = diasDesde(p.fecha);
    if (!c || d < 0) return;
    const e = HUERTA.etapa(c, d);
    if (e.clave === "casi" || e.clave === "cosecha") lista.push(`${p.nombre}: ${HUERTA.consejoDeEtapa(c, e.clave)}`);
  });
  return lista;
}

function pintarConsejo() {
  const caja = document.getElementById("consejo");
  if (!caja) return;
  const delDia = consejosDeHoy();
  const todos = [...delDia, ...CONSEJOS];
  const i = ((consejoActual % todos.length) + todos.length) % todos.length;
  caja.querySelector(".texto").textContent = todos[i];
  // Cada consejo con su foto de huerta.
  const foto = caja.querySelector(".consejo-foto img");
  if (foto) foto.src = `${BASE}imgs/fotos/${FOTOS_CONSEJO[i % FOTOS_CONSEJO.length]}.webp`;
}

// ---------- tarjetas de mis plantas ----------
const BASE = document.body.dataset.base || "";
const fotoCultivo = (slug, clase = "") => `<img class="${clase}" src="${HUERTA.imagen(slug, BASE)}" data-cultivo="${slug}" data-base="${BASE}" alt="" loading="lazy">`;

function anillo(fraccion, color = "#2A1A0E") {
  const r = 20, l = 2 * Math.PI * r, f = Math.max(0, Math.min(1, fraccion));
  return `<svg class="anillo-dia" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="${r}" fill="rgba(251,248,236,.85)" stroke="rgba(42,26,14,.12)" stroke-width="3"/><circle cx="24" cy="24" r="${r}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-dasharray="${l * f} ${l}" transform="rotate(-90 24 24)"/><text x="24" y="27.5" text-anchor="middle">${Math.round(f * 100)}%</text></svg>`;
}

function pintarPlantas() {
  const grilla = document.getElementById("grilla-plantas");
  if (!grilla) return;
  const lista = MIS_PLANTAS.todas();
  document.getElementById("cuenta-plantas").textContent = lista.length;
  grilla.innerHTML = lista.map((p) => {
    const c = HUERTA.porSlug(p.slug), d = Math.max(0, diasDesde(p.fecha));
    const e = HUERTA.etapa(c, d), faltan = Math.max(0, c.dias - d);
    const ultima = p.novedades[0];
    return `<div class="col-6 col-md-4 col-lg-3 col-xl-2">
      <button class="planta" type="button" data-planta="${p.id}" aria-label="Abrir el diario de ${p.nombre}">
        <div class="foto" style="--tono:${HUERTA.FAMILIAS[c.familia].tono}">${fotoCultivo(p.slug, "recorte")}<span class="chip">${e.nombre}</span>${anillo(d / c.dias)}</div>
        <div class="cuerpo">
          <h3>${p.nombre} <small>Día ${d}</small></h3>
          <div class="progreso" aria-hidden="true"><i style="width:${Math.min(100, (d / c.dias) * 100)}%"></i></div>
          <div class="meta"><span>${p.lugar === "maceta" ? "En maceta" : "En cantero"}</span><span>${faltan ? `${faltan} días para cosechar` : "Lista para cosechar"}</span></div>
          <p class="ultimo">${ultima ? `${ultima.nota || "Sin nota"} <span class="text-nowrap">(${fechaCorta(deISO(ultima.fecha))})</span>` : "Todavía sin novedades. Contale cómo está."}</p>
        </div>
      </button>
    </div>`;
  }).join("") + `<div class="col-6 col-md-4 col-lg-3 col-xl-2 d-flex flex-column">
      <button class="planta vacia flex-grow-1" type="button" data-bs-toggle="modal" data-bs-target="#modal-planta">
        <span class="boton-redondo lima" aria-hidden="true">+</span>
        <strong>${lista.length ? "Sumar otra planta" : "Sumá tu primera planta"}</strong>
        <span>Elegí qué sembraste y cuándo. El asistente la sigue día a día.</span>
      </button>
      ${lista.length ? "" : `<button class="link-flecha mt-3" type="button" id="cargar-ejemplo">Probar con una huerta de ejemplo →</button>`}
    </div>`;
  document.getElementById("cargar-ejemplo")?.addEventListener("click", () => {
    const hace = (n) => aISO(new Date(HOY.getTime() - n * DIA));
    const t = MIS_PLANTAS.agregar({ slug: "tomate", fecha: hace(48), lugar: "cantero" });
    MIS_PLANTAS.anotar(t.id, { estado: "bien", nota: "Primeras flores amarillas." });
    MIS_PLANTAS.agregar({ slug: "lechuga", fecha: hace(41), lugar: "cantero" });
    const a = MIS_PLANTAS.agregar({ slug: "albahaca", fecha: hace(12), lugar: "maceta" });
    MIS_PLANTAS.anotar(a.id, { estado: "regular", nota: "Hojas un poco caídas al mediodía." });
  });
}

// ---------- diario de una planta ----------
let plantaAbierta = null;

async function pintarDiario() {
  const p = MIS_PLANTAS.una(plantaAbierta);
  const cuerpo = document.getElementById("diario-cuerpo");
  if (!p || !cuerpo) return;
  const c = HUERTA.porSlug(p.slug), d = Math.max(0, diasDesde(p.fecha));
  const e = HUERTA.etapa(c, d);
  const cosecha = new Date(deISO(p.fecha).getTime() + c.dias * DIA);
  document.getElementById("diario-titulo").textContent = `Diario de ${p.nombre.toLowerCase()}`;
  const estados = { bien: "Está bien", regular: "Más o menos", ayuda: "Necesita ayuda" };
  const novedades = p.novedades.map((n) => `<li><span class="cuando">${fechaCorta(deISO(n.fecha))}</span><span class="punto ${n.estado}"></span><div><strong>${estados[n.estado]}</strong>${n.nota ? `<p>${n.nota}</p>` : ""}${n.foto ? `<img data-foto="${n.id}" alt="Foto de ${p.nombre.toLowerCase()} del ${fechaCorta(deISO(n.fecha))}">` : ""}</div></li>`).join("");
  cuerpo.innerHTML = `
    <div class="cabecera-planta" style="--tono:${HUERTA.FAMILIAS[c.familia].tono}">${fotoCultivo(p.slug, "recorte")}<span class="chip align-self-start mb-auto position-relative">${e.nombre}</span><h3>${p.nombre}</h3><p>Sembrada el ${fechaCorta(deISO(p.fecha))}, ${p.lugar === "maceta" ? "en maceta" : "en cantero"}</p></div>
    <div class="datos"><div><small>Día</small><b>${d}</b></div><div><small>Ciclo</small><b>${Math.min(100, Math.round((d / c.dias) * 100))}%</b></div><div><small>Cosecha aprox.</small><b>${cosecha.getDate()}/${cosecha.getMonth() + 1}</b></div></div>
    <p class="nota mt-0">${HUERTA.consejoDeEtapa(c, e.clave)}</p>
    <p class="fuente-dato mt-0">Cuidados según ${HUERTA.cita("huertaOrganica")}, INTA ProHuerta.</p>
    <form class="panel" id="form-novedad">
      <h4 class="fs-5 mb-3">¿Cómo está hoy?</h4>
      <div class="selector-estado mb-3" role="radiogroup" aria-label="Estado">
        <input type="radio" name="estado" id="e-bien" value="bien" checked><label for="e-bien">Bien</label>
        <input type="radio" name="estado" id="e-regular" value="regular"><label for="e-regular">Más o menos</label>
        <input type="radio" name="estado" id="e-ayuda" value="ayuda"><label for="e-ayuda">Necesita ayuda</label>
      </div>
      <label class="form-label" for="nota-novedad">Nota</label>
      <textarea class="form-control mb-3" id="nota-novedad" name="nota" rows="2" placeholder="Ej.: salieron las primeras flores"></textarea>
      <label class="form-label" for="foto-novedad">Foto (opcional)</label>
      <input class="form-control mb-3" id="foto-novedad" name="foto" type="file" accept="image/*">
      <button class="btn btn-huerta w-100" type="submit">Guardar novedad</button>
    </form>
    <ol class="linea-diario">${novedades}<li><span class="cuando">${fechaCorta(deISO(p.fecha))}</span><span class="punto siembra"></span><div><strong>Siembra</strong><p>${c.nombre} ${p.lugar === "maceta" ? "en maceta" : "en cantero"}.</p></div></li></ol>
    <button class="link-flecha text-danger-emphasis" type="button" id="quitar-planta" style="color:var(--color-acento)">Quitar esta planta</button>`;

  cuerpo.querySelectorAll("img[data-foto]").forEach(async (img) => {
    try { const dato = await fotos.leer(img.dataset.foto); if (dato) img.src = dato; else img.remove(); } catch { img.remove(); }
  });

  cuerpo.querySelector("#form-novedad").addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const f = new FormData(ev.target);
    const archivo = f.get("foto");
    let dato = null;
    if (archivo && archivo.size) { try { dato = await achicarFoto(archivo); } catch { dato = null; } }
    const n = MIS_PLANTAS.anotar(p.id, { estado: f.get("estado"), nota: (f.get("nota") || "").trim(), foto: Boolean(dato) });
    if (dato) { try { await fotos.guardar(n.id, dato); } catch { n.foto = false; } }
    pintarDiario();
  });

  const quitar = cuerpo.querySelector("#quitar-planta");
  quitar.addEventListener("click", () => {
    if (quitar.dataset.confirmar) {
      MIS_PLANTAS.quitar(p.id);
      bootstrap.Offcanvas.getOrCreateInstance("#diario").hide();
      return;
    }
    quitar.dataset.confirmar = "1";
    quitar.textContent = "Tocá de nuevo para quitarla";
  });
}

// ---------- arranque ----------
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-planta]");
  if (!b) return;
  plantaAbierta = b.dataset.planta;
  pintarDiario();
  bootstrap.Offcanvas.getOrCreateInstance("#diario").show();
});

// Alta de planta
const formPlanta = document.getElementById("form-planta");
if (formPlanta) {
  const select = formPlanta.querySelector("select");
  select.innerHTML = Object.entries(HUERTA.FAMILIAS).map(([clave, fam]) =>
    `<optgroup label="${fam.nombre}">${HUERTA.CULTIVOS.filter((c) => c.familia === clave).map((c) => `<option value="${c.slug}">${c.nombre}</option>`).join("")}</optgroup>`).join("");
  formPlanta.querySelector("[name=fecha]").value = aISO(HOY);
  formPlanta.querySelector("[name=fecha]").max = aISO(HOY);
  formPlanta.addEventListener("submit", (ev) => {
    ev.preventDefault();
    const f = new FormData(formPlanta);
    MIS_PLANTAS.agregar({ slug: f.get("cultivo"), fecha: f.get("fecha"), lugar: f.get("lugar") });
    bootstrap.Modal.getOrCreateInstance("#modal-planta").hide();
    formPlanta.reset();
    formPlanta.querySelector("[name=fecha]").value = aISO(HOY);
  });
}

// Llegada desde una ficha: abre el alta con el cultivo elegido.
const pedido = new URLSearchParams(location.search).get("sumar");
if (formPlanta && pedido && HUERTA.porSlug(pedido)) {
  formPlanta.querySelector("select").value = pedido;
  window.addEventListener("load", () => bootstrap.Modal.getOrCreateInstance("#modal-planta").show());
}

// Cambio de ciudad
const formCiudad = document.getElementById("form-ciudad");
if (formCiudad) {
  const resultados = document.getElementById("resultados-ciudad");
  const elegir = (c) => {
    ciudad = c;
    guardado.escribir("huertita-ciudad", c);
    bootstrap.Modal.getOrCreateInstance("#modal-ciudad").hide();
    cargarClima();
  };
  formCiudad.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const q = new FormData(formCiudad).get("q").trim();
    if (!q) return;
    resultados.innerHTML = `<p class="text-body-secondary mb-0">Buscando…</p>`;
    try {
      const r = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=6&language=es&format=json`);
      const j = await r.json();
      resultados.innerHTML = (j.results || []).map((c, i) => `<button class="btn btn-huerta secundario w-100 justify-content-start mb-2" type="button" data-i="${i}">${c.name}<small class="text-body-secondary ms-1">${[c.admin1, c.country].filter(Boolean).join(", ")}</small></button>`).join("") || `<p class="mb-0">No encontramos esa ciudad. Probá con otro nombre.</p>`;
      resultados.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => {
        const c = j.results[b.dataset.i];
        elegir({ nombre: c.name, lat: c.latitude, lon: c.longitude });
      }));
    } catch {
      resultados.innerHTML = `<p class="mb-0">No pudimos buscar ahora. Revisá la conexión.</p>`;
    }
  });
  document.getElementById("usar-ubicacion")?.addEventListener("click", () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => elegir({ nombre: "Mi ubicación", lat: +pos.coords.latitude.toFixed(2), lon: +pos.coords.longitude.toFixed(2) }),
      () => { resultados.innerHTML = `<p class="mb-0">Sin permiso de ubicación. Buscá tu ciudad por nombre.</p>`; }
    );
  });
}

document.querySelectorAll("#consejo [data-paso]").forEach((b) => b.addEventListener("click", () => {
  consejoActual += Number(b.dataset.paso);
  pintarConsejo();
}));

async function cargarClima() {
  try { clima = await traerClima(); } catch { clima = null; }
  pintarClima();
  pintarRiego();
  pintarConsejo();
}

MIS_PLANTAS.alCambiar(() => { pintarPlantas(); pintarRiego(); pintarConsejo(); if (plantaAbierta) pintarDiario(); });
pintarPlantas();
pintarClima();
pintarRiego();
pintarConsejo();
cargarClima();
