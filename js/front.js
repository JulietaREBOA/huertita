/* =========================================================
   Capa Nativé + Lilo: barra de aviso, títulos que aparecen
   palabra a palabra, contadores, momento del día y antes/después.
   ========================================================= */
(() => {
  const BASE = document.body.dataset.base || "";
  const MESES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // barra de aviso arriba de todo
  const mes = MESES[new Date().getMonth()];
  const barra = document.createElement("a");
  barra.className = "barra-aviso";
  barra.href = `${BASE}html/calendario.html#calendario`;
  barra.innerHTML = `<span>${mes[0].toUpperCase() + mes.slice(1)} en la huerta: mirá qué toca sembrar</span><span aria-hidden="true">→</span>`;
  document.body.prepend(barra);

  // títulos que aparecen palabra a palabra
  const partir = (nodo) => {
    [...nodo.childNodes].forEach((hijo) => {
      if (hijo.nodeType === 3) {
        const frag = document.createDocumentFragment();
        hijo.textContent.split(/(\s+)/).forEach((trozo) => {
          if (!trozo) return;
          if (/^\s+$/.test(trozo)) { frag.append(trozo); return; }
          const s = document.createElement("span");
          s.className = "palabra";
          s.textContent = trozo;
          frag.append(s);
        });
        hijo.replaceWith(frag);
      } else if (hijo.nodeType === 1 && !hijo.matches(".contador, .palabra")) {
        partir(hijo);
      }
    });
  };
  const titulos = document.querySelectorAll("main h1, main h2:not(.visually-hidden):not(.modal-title), .revela");
  titulos.forEach((t) => {
    if (t.closest(".panel, .panel-verde, .tarjeta, .card, .modal, .offcanvas, .ficha-libro")) return;
    t.classList.add("revela");
    partir(t);
    t.querySelectorAll(".palabra").forEach((p, i) => p.style.setProperty("--i", i));
  });

  // contadores que suben
  const contar = (el) => {
    const fin = +el.dataset.contar;
    if (quieto) { el.textContent = fin; return; }
    const t0 = performance.now();
    const paso = (t) => {
      const k = Math.min(1, (t - t0) / 1400);
      el.textContent = Math.round(fin * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  };

  const io = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("visto");
      if (e.target.dataset.contar) contar(e.target);
      io.unobserve(e.target);
    });
  }, { rootMargin: "0px 0px -12% 0px" });
  document.querySelectorAll(".revela, .aparece, [data-contar]").forEach((el) => io.observe(el));

  // un día en la huerta: cambia la escena según el momento
  const dia = document.getElementById("dia-huerta");
  if (dia) {
    const escena = dia.querySelector(".escena");
    const nota = dia.querySelector(".escena-nota");
    dia.querySelectorAll("[data-momento]").forEach((b) => {
      b.addEventListener("click", () => {
        dia.querySelectorAll("[data-momento]").forEach((x) => x.setAttribute("aria-pressed", x === b));
        escena.dataset.momento = b.dataset.momento;
        nota.innerHTML = `<strong>${b.dataset.titulo}</strong><span>${b.dataset.texto}</span>`;
      });
    });
    dia.querySelector('[aria-pressed="true"]')?.click();
  }

  // antes y después
  document.querySelectorAll(".antes-despues").forEach((ad) => {
    const r = ad.querySelector("input[type=range]");
    const pintar = () => ad.style.setProperty("--pos", r.value + "%");
    r.addEventListener("input", pintar);
    pintar();
  });
})();
