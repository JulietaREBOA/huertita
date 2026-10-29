// Estante del INTA: un libro destacado que flota arriba y una fila de lomos abajo, con filtros por tema y un diario de lectura.
(() => {
  const estante = document.getElementById("estante");
  if (!estante) return;
  const R = "https://repositorio.inta.gob.ar/handle/20.500.12123/";
  const BASE = document.body.dataset.base || "";
  const quieto = window.matchMedia("(prefers-reduced-motion: reduce)");

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
  // Los que van pasando en el destacado mientras nadie eligió un libro.
  const DESTACADOS = ["15389", "15072", "15106", "15109", "663"];
  const PAUSA = 7000;

  // Diario de lectura guardado en este navegador.
  let leidos = [];
  try { leidos = JSON.parse(localStorage.getItem("huertita-leidos") || "[]"); } catch { leidos = []; }
  const guardar = () => { try { localStorage.setItem("huertita-leidos", JSON.stringify(leidos)); } catch {} };

  const porH = (h) => ESTANTE.find((l) => l.h === h);
  const numero = (libro) => String(ESTANTE.indexOf(libro) + 1).padStart(2, "0");
  const autoria = (libro) => (libro.autores.length ? libro.autores.join("; ") : "INTA");

  // Medidas de cada lomo a partir del título, siempre iguales para el mismo libro.
  const medida = (libro) => {
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

  // Texto claro u oscuro según la luminancia del color del lomo.
  const textoSobre = (hex) => {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.55 ? "oscuro" : "claro";
  };

  let elegido = null;   // el libro que la persona sacó del estante
  let mirado = null;    // el lomo bajo el mouse o con foco
  let grupo = "todos";
  let vuelta = 0;       // índice dentro de DESTACADOS
  let reloj = null;

  /* ---------- fila de lomos ---------- */

  function pintarEstante() {
    const temas = GRUPOS[grupo];
    estante.innerHTML = ESTANTE.map((libro) => {
      if (temas && !temas.includes(libro.tema)) return "";
      const m = medida(libro);
      const semilla = (Number(libro.h) * 7919) % 100;
      const estilo = semilla < 35 ? "filetes" : semilla < 65 ? "banda" : "liso";
      // Al sacarlo del estante, el lomo se abre al ancho de su tapa; las apaisadas se apoyan sobre papel.
      const apaisada = libro.aspecto > 0.9;
      const asp = apaisada ? 0.72 : Math.min(0.8, Math.max(0.62, libro.aspecto || 0.715));
      return `<button class="lomo ${textoSobre(libro.color)} ${estilo}" type="button" data-h="${libro.h}"
        style="--alto:${m.alto}px;--ancho:${m.ancho}px;--lomo:${libro.color};--tapa-ancho:${Math.round(m.alto * asp)}px">
        <span class="titulo-lomo">${corto(libro.titulo)}</span><span class="sello">INTA</span>
        <span class="lomo-tapa${apaisada ? " apaisada" : ""}" aria-hidden="true">${libro.tapa
          ? `<img src="${BASE}imgs/inta/tapas/${libro.h}.webp" alt="" loading="lazy" decoding="async">`
          : `<span class="lomo-tapa-pie"><small>INTA · ${libro.anio}</small>${corto(libro.titulo)}</span>`}</span>
      </button>`;
    }).join("");
    marcar();
    medirBordes();
  }

  // Estado de cada lomo sin volver a dibujar la fila (así no se pierde el foco).
  function marcar() {
    estante.querySelectorAll(".lomo").forEach((b) => {
      const libro = porH(b.dataset.h);
      const leido = leidos.includes(libro.h);
      b.classList.toggle("arriba", elegido === libro.h);
      b.classList.toggle("leido", leido);
      b.setAttribute("aria-pressed", String(elegido === libro.h));
      b.setAttribute("aria-label", `${libro.titulo}, ${libro.anio}${leido ? ", leído" : ""}`);
    });
    estante.classList.toggle("con-elegido", Boolean(elegido));
    document.getElementById("cuenta-leidos").textContent = `Leíste ${leidos.length} de ${ESTANTE.length}`;
  }

  // Bordes que se desvanecen solo del lado donde quedan libros por ver.
  const vista = document.getElementById("estante-vista");
  function medirBordes() {
    const fin = estante.scrollWidth - estante.clientWidth;
    vista.dataset.izq = estante.scrollLeft > 4 ? "1" : "0";
    vista.dataset.der = estante.scrollLeft < fin - 4 ? "1" : "0";
    document.querySelectorAll("[data-mover]").forEach((b) => {
      b.disabled = Number(b.dataset.mover) < 0 ? vista.dataset.izq === "0" : vista.dataset.der === "0";
    });
  }
  estante.addEventListener("scroll", medirBordes, { passive: true });
  new ResizeObserver(medirBordes).observe(estante);

  /* ---------- etiqueta debajo del estante ---------- */

  const etiqueta = document.getElementById("estante-etiqueta");
  let enEtiqueta = "";
  function pintarEtiqueta() {
    const libro = porH(mirado || elegido);
    const clave = `${libro?.h || ""}|${elegido || ""}|${leidos.includes(elegido)}`;
    if (clave === enEtiqueta) return;
    enEtiqueta = clave;
    etiqueta.dataset.on = libro ? "1" : "0";
    etiqueta.innerHTML = libro
      ? `<span class="etq-copia"><span class="etq-n">${numero(libro)}</span><span class="etq-titulo">${libro.titulo}</span><span class="etq-anio">${libro.anio}</span></span>
         ${elegido === libro.h ? `<span class="etq-acciones"><a href="${R}${libro.h}" target="_blank" rel="noopener">Leer en el repositorio ↗</a><button type="button" data-leido aria-pressed="${leidos.includes(libro.h)}">${leidos.includes(libro.h) ? "✓ Leído" : "Marcar como leído"}</button><button type="button" data-devolver>Devolver al estante</button></span>` : ""}`
      : `<span class="etq-copia etq-vacia">Tocá un lomo para presentar su tapa.</span>`;
  }
  etiqueta.addEventListener("click", (e) => {
    if (e.target.closest("[data-devolver]")) devolver();
    if (e.target.closest("[data-leido]") && elegido) {
      leidos = leidos.includes(elegido) ? leidos.filter((x) => x !== elegido) : [...leidos, elegido];
      guardar();
      marcar();
      pintarEtiqueta();
      if (enTapa === elegido) pintarFicha(porH(enTapa));
    }
  });

  /* ---------- libro destacado ---------- */

  const escena = document.getElementById("dest-escena");
  const salto = document.getElementById("dest-salto");
  const tapa = document.getElementById("dest-tapa");
  const ficha = document.getElementById("ficha-libro");
  let enTapa = null;

  function presentar(libro, girar) {
    if (enTapa !== libro.h) {
      enTapa = libro.h;
      // Tapas apaisadas: se apoyan sobre papel del color del libro en lugar de recortarse.
      const apaisada = libro.aspecto > 0.9;
      escena.style.setProperty("--aspecto", apaisada ? 0.72 : Math.min(0.8, Math.max(0.62, libro.aspecto || 0.715)));
      escena.style.setProperty("--papel", libro.color);
      tapa.className = `dest-tapa ${textoSobre(libro.color)}${apaisada ? " apaisada" : ""}`;
      tapa.innerHTML = libro.tapa
        ? `<img src="${BASE}imgs/inta/tapas/${libro.h}.webp" alt="" decoding="async">`
        : `<span class="dest-sin-tapa"><b>${libro.titulo}</b><small>INTA · ${libro.anio}</small></span>`;
      escena.href = `${R}${libro.h}`;
      escena.setAttribute("aria-label", `Abrir «${libro.titulo}» en el repositorio del INTA`);
      if (girar && !quieto.matches) {
        salto.classList.remove("girando");
        void salto.offsetWidth;
        salto.classList.add("girando");
      }
    }
    pintarFicha(libro);
  }

  // Bajada con datos del repositorio: tema, año y autoría.
  const bajada = (libro) => {
    const apellidos = libro.autores.map((a) => a.split(",")[0]);
    const quien = apellidos.length ? `, de ${apellidos.length > 1 ? `${apellidos.slice(0, -1).join(", ")} y ${apellidos.at(-1)}` : apellidos[0]}` : "";
    return `${TEMAS[libro.tema]}. Publicación del INTA de ${libro.anio}${quien}. Libre para leer y descargar.`;
  };

  // Ficha a la manera de Grokipedia: rótulo, título grande, bajada, enlace y la lista numerada de destacados.
  function pintarFicha(libro) {
    const leido = leidos.includes(libro.h);
    ficha.innerHTML = `
      <p class="dest-rotulo">Destacado</p>
      <h3>${corto(libro.titulo)}</h3>
      <p class="dest-bajada">${bajada(libro)}</p>
      <div class="dest-acciones">
        <a class="dest-leer" href="${R}${libro.h}" target="_blank" rel="noopener">Leer en el repositorio <span aria-hidden="true">›</span></a>
        <div class="form-check form-switch d-flex align-items-center gap-2 m-0 p-0">
          <input class="form-check-input" type="checkbox" role="switch" id="leido-libro" ${leido ? "checked" : ""}>
          <label class="form-check-label small" for="leido-libro">Ya lo leí</label>
        </div>
      </div>
      <ol class="dest-lista" aria-label="Publicaciones destacadas">${DESTACADOS.map((h, i) => `
        <li><button type="button" data-paso="${i}" aria-current="${i === vuelta}">
          <span class="n">${String(i + 1).padStart(2, "0")}</span><span class="t">${corto(porH(h).titulo)}</span><span class="flecha" aria-hidden="true">›</span>
        </button></li>`).join("")}
      </ol>`;
    ficha.querySelector("#leido-libro").addEventListener("change", (e) => {
      leidos = e.target.checked ? [...new Set([...leidos, libro.h])] : leidos.filter((x) => x !== libro.h);
      guardar();
      marcar();
      enEtiqueta = "";
      pintarEtiqueta();
    });
    ficha.classList.toggle("corriendo", Boolean(reloj));
  }

  ficha.addEventListener("click", (e) => {
    const paso = e.target.closest("[data-paso]");
    if (!paso) return;
    vuelta = Number(paso.dataset.paso);
    presentar(porH(DESTACADOS[vuelta]), true);
    arrancarVuelta();
    // La ficha se vuelve a dibujar: el foco vuelve a la fila elegida.
    ficha.querySelector(`[data-paso="${vuelta}"]`)?.focus();
  });

  // Mientras la sección está a la vista y nadie eligió, los destacados se turnan.
  let visible = false;
  function arrancarVuelta() {
    clearInterval(reloj);
    reloj = null;
    if (visible && !quieto.matches) {
      reloj = setInterval(() => {
        vuelta = (vuelta + 1) % DESTACADOS.length;
        presentar(porH(DESTACADOS[vuelta]), true);
      }, PAUSA);
    }
    ficha.classList.toggle("corriendo", Boolean(reloj));
  }
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; arrancarVuelta(); }, { threshold: 0.25 })
    .observe(escena);
  document.addEventListener("visibilitychange", () => { visible = !document.hidden; arrancarVuelta(); });

  // La tapa se inclina un poco hacia el puntero.
  if (!quieto.matches) {
    escena.addEventListener("pointermove", (e) => {
      const r = escena.getBoundingClientRect();
      escena.style.setProperty("--px", `${((e.clientX - r.left) / r.width - 0.5) * 14}deg`);
      escena.style.setProperty("--py", `${((e.clientY - r.top) / r.height - 0.5) * -10}deg`);
    });
    escena.addEventListener("pointerleave", () => { escena.style.setProperty("--px", "0deg"); escena.style.setProperty("--py", "0deg"); });
  }

  /* ---------- elegir y devolver ---------- */

  function elegir(h) {
    if (elegido === h) {
      window.open(`${R}${h}`, "_blank", "noopener");
      return;
    }
    elegido = h;
    marcar();
    pintarEtiqueta();
    // Cuando terminó de abrirse, se centra en la fila.
    const lomo = estante.querySelector(`.lomo[data-h="${h}"]`);
    setTimeout(() => lomo?.scrollIntoView({ block: "nearest", inline: "center", behavior: quieto.matches ? "auto" : "smooth" }), quieto.matches ? 0 : 420);
  }

  function devolver() {
    const antes = elegido;
    elegido = null;
    marcar();
    pintarEtiqueta();
    estante.querySelector(`.lomo[data-h="${antes}"]`)?.focus();
  }

  estante.addEventListener("click", (e) => {
    const lomo = e.target.closest(".lomo");
    if (lomo) elegir(lomo.dataset.h);
  });
  estante.addEventListener("pointerover", (e) => {
    const lomo = e.target.closest(".lomo");
    if (lomo) { mirado = lomo.dataset.h; pintarEtiqueta(); }
  });
  estante.addEventListener("pointerleave", () => { mirado = null; pintarEtiqueta(); });
  estante.addEventListener("focusin", (e) => {
    const lomo = e.target.closest(".lomo");
    mirado = lomo ? lomo.dataset.h : null;
    pintarEtiqueta();
  });
  estante.addEventListener("focusout", () => { mirado = null; pintarEtiqueta(); });

  // Flechas del teclado para pasar de lomo en lomo; Escape devuelve el libro.
  estante.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && elegido) { e.preventDefault(); devolver(); return; }
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const lomos = [...estante.querySelectorAll(".lomo")];
    if (!lomos.length) return;
    e.preventDefault();
    const i = lomos.indexOf(document.activeElement);
    const sig = i < 0 ? 0 : Math.max(0, Math.min(lomos.length - 1, i + (e.key === "ArrowRight" ? 1 : -1)));
    lomos[sig].focus();
    lomos[sig].scrollIntoView({ block: "nearest", inline: "nearest", behavior: quieto.matches ? "auto" : "smooth" });
  });

  const filtro = document.getElementById("filtro-estante");
  filtro.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    filtro.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", x === b));
    grupo = b.dataset.grupo;
    estante.scrollLeft = 0;
    pintarEstante();
  });

  // Flechas para recorrer el estante.
  document.querySelectorAll("[data-mover]").forEach((b) => b.addEventListener("click", () => {
    estante.scrollBy({ left: Number(b.dataset.mover) * estante.clientWidth * 0.7, behavior: quieto.matches ? "auto" : "smooth" });
  }));

  pintarEstante();
  presentar(porH(DESTACADOS[0]), false);
  pintarEtiqueta();
})();
