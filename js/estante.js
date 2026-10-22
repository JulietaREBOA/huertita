// Estante del INTA: lomos que se pueden tocar, filtros por tema y un diario de lectura.
(() => {
  const estante = document.getElementById("estante");
  if (!estante) return;
  const R = "https://repositorio.inta.gob.ar/handle/20.500.12123/";
  const BASE = document.body.dataset.base || "";

  const TEMAS = {
    empezar: "Para empezar", ciudad: "En la ciudad", planificar: "Planificar", sembrar: "Siembra",
    semillas: "Semillas", suelo: "Suelo", riego: "Riego", proteger: "Proteger", plagas: "Plagas",
    aromaticas: "Aromáticas", cultivos: "Cultivos", herramientas: "Herramientas", cosecha: "Cosecha y cocina",
    escuela: "Escuela", granja: "Granja", programa: "Programa",
  };
  const GRUPOS = {
    todos: null, empezar: ["empezar", "ciudad"], planificar: ["planificar", "sembrar"], semillas: ["semillas"],
    agua: ["suelo", "riego"], cuidados: ["proteger", "plagas"], cultivos: ["cultivos", "aromaticas"],
    cosecha: ["cosecha"], mas: ["herramientas", "escuela", "granja", "programa"],
  };

  // Diario de lectura guardado en este navegador.
  let leidos = [];
  try { leidos = JSON.parse(localStorage.getItem("huertita-leidos") || "[]"); } catch { leidos = []; }
  const guardar = () => { try { localStorage.setItem("huertita-leidos", JSON.stringify(leidos)); } catch {} };

  // Medidas de cada lomo a partir del título, siempre iguales para el mismo libro.
  const medida = (libro, i) => {
    const largo = libro.titulo.length;
    const semilla = (Number(libro.h) * 9301 + 49297) % 233280 / 233280;
    return { alto: 230 + Math.round(semilla * 90), ancho: Math.max(38, Math.min(62, 30 + Math.round(largo * 0.45))) };
  };

  // Título corto para el lomo: sin subtítulo y con corte en palabra.
  const corto = (t) => {
    let c = t.split(/[.:]\s/)[0].replace(/\s*\(.*\)$/, "");
    if (c.length > 40) c = c.slice(0, 40).replace(/\s+\S*$/, "") + "…";
    return c;
  };

  let elegido = null;
  let grupo = "todos";

  // Texto claro u oscuro según la luminancia del color del lomo.
  const textoSobre = (hex) => {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.55 ? "oscuro" : "claro";
  };

  function pintarEstante() {
    const temas = GRUPOS[grupo];
    estante.innerHTML = ESTANTE.map((libro, i) => {
      if (temas && !temas.includes(libro.tema)) return "";
      const m = medida(libro, i);
      const leido = leidos.includes(libro.h);
      const semilla = (Number(libro.h) * 7919) % 100;
      const estilo = semilla < 35 ? "filetes" : semilla < 65 ? "banda" : "liso";
      return `<button class="lomo ${textoSobre(libro.color)} ${estilo} ${elegido === libro.h ? "arriba" : ""} ${leido ? "leido" : ""}" type="button" data-h="${libro.h}"
        style="--alto:${m.alto}px;--ancho:${m.ancho}px;--lomo:${libro.color}" aria-pressed="${elegido === libro.h}"
        aria-label="${libro.titulo}, ${libro.anio}${leido ? ", leído" : ""}">
        <span class="anio">${libro.anio}</span><span class="titulo-lomo">${corto(libro.titulo)}</span><span class="sello">INTA</span>
      </button>`;
    }).join("");
    estante.classList.toggle("con-elegido", Boolean(elegido));
    document.getElementById("cuenta-leidos").textContent = `Leíste ${leidos.length} de ${ESTANTE.length}`;
  }

  function pintarFicha() {
    const caja = document.getElementById("ficha-libro");
    const libro = ESTANTE.find((l) => l.h === elegido);
    if (!libro) {
      caja.innerHTML = `<p class="mb-0 vacio-libro">Tocá un lomo para ver de qué trata y abrirlo en el repositorio del INTA.</p>`;
      return;
    }
    const leido = leidos.includes(libro.h);
    caja.innerHTML = `
      ${libro.tapa ? `<img class="tapa" src="${BASE}imgs/inta/tapas/${libro.h}.webp" alt="Tapa de ${libro.titulo}">` : `<span class="tapa sin-tapa" style="--lomo:${libro.color}">INTA</span>`}
      <div class="datos-libro">
        <span class="chip">${TEMAS[libro.tema]}</span>
        <h3>${libro.titulo}</h3>
        <dl>
          <div><dt>Año</dt><dd>${libro.anio}</dd></div>
          <div><dt>Autoría</dt><dd>${libro.autores.length ? libro.autores.join("; ") : "INTA"}</dd></div>
          <div><dt>Licencia</dt><dd>CC BY-NC-SA</dd></div>
        </dl>
        <div class="d-flex flex-wrap gap-2 align-items-center">
          <a class="btn btn-huerta lima chico" href="${R}${libro.h}" target="_blank" rel="noopener">Leer en el repositorio ↗</a>
          <div class="form-check form-switch d-flex align-items-center gap-2 m-0 p-0">
            <input class="form-check-input" type="checkbox" role="switch" id="leido-libro" ${leido ? "checked" : ""}>
            <label class="form-check-label small" for="leido-libro">Ya lo leí</label>
          </div>
        </div>
      </div>`;
    caja.querySelector("#leido-libro").addEventListener("change", (e) => {
      leidos = e.target.checked ? [...new Set([...leidos, libro.h])] : leidos.filter((x) => x !== libro.h);
      guardar();
      pintarEstante();
    });
  }

  estante.addEventListener("click", (e) => {
    const lomo = e.target.closest(".lomo");
    if (!lomo) return;
    elegido = elegido === lomo.dataset.h ? null : lomo.dataset.h;
    pintarEstante();
    pintarFicha();
  });

  const filtro = document.getElementById("filtro-estante");
  filtro.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    filtro.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", x === b));
    grupo = b.dataset.grupo;
    pintarEstante();
    estante.scrollLeft = 0;
  });

  // Flechas para recorrer el estante.
  document.querySelectorAll("[data-mover]").forEach((b) => b.addEventListener("click", () => {
    estante.scrollBy({ left: Number(b.dataset.mover) * estante.clientWidth * 0.7, behavior: "smooth" });
  }));

  pintarEstante();
  pintarFicha();
})();
