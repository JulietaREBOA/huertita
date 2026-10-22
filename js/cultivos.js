// Datos compartidos por el asistente, el inicio y el calendario.
// Días aproximados de la siembra a la primera cosecha, orientativos para la región pampeana.
// Juli: verificar contra el Manual de cultivos del INTA (columna «días a cosecha»).
const HUERTA = (() => {
  const sinTildes = (t) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  // tono: fondo de la foto recortada, una mezcla de la paleta por familia.
  const FAMILIAS = {
    fruto:     { nombre: "Fruto",     tono: "#E8C3BC" },
    hoja:      { nombre: "Hoja",      tono: "#D6DE9E" },
    raiz:      { nombre: "Raíz",      tono: "#EAD7B8" },
    legumbre:  { nombre: "Legumbre",  tono: "#CBD79A" },
    aromatica: { nombre: "Aromática", tono: "#C3D493" },
  };

  // riego: necesidad relativa de agua (alta, media, baja).
  const LISTA = [
    ["Tomate", "fruto", 120, "alta"], ["Pimiento", "fruto", 130, "alta"], ["Berenjena", "fruto", 130, "alta"],
    ["Zapallo", "fruto", 120, "media"], ["Zapallito", "fruto", 60, "alta"], ["Pepino", "fruto", 70, "alta"],
    ["Maíz", "fruto", 100, "media"], ["Frutilla", "fruto", 90, "media"],
    ["Lechuga", "hoja", 60, "alta"], ["Acelga", "hoja", 60, "media"], ["Espinaca", "hoja", 50, "media"],
    ["Repollo", "hoja", 120, "media"], ["Brócoli", "hoja", 100, "media"], ["Coliflor", "hoja", 120, "media"],
    ["Zanahoria", "raiz", 100, "media"], ["Rabanito", "raiz", 30, "media"], ["Remolacha", "raiz", 80, "media"],
    ["Cebolla", "raiz", 150, "baja"], ["Ajo", "raiz", 210, "baja"], ["Papa", "raiz", 110, "media"],
    ["Arveja", "legumbre", 100, "media"], ["Haba", "legumbre", 150, "baja"], ["Poroto", "legumbre", 80, "media"],
    ["Albahaca", "aromatica", 60, "media"], ["Perejil", "aromatica", 70, "media"],
  ];

  const CULTIVOS = LISTA.map(([nombre, familia, dias, riego]) => ({ nombre, slug: sinTildes(nombre), familia, dias, riego }));
  const porSlug = (slug) => CULTIVOS.find((c) => c.slug === slug);
  const porNombre = (nombre) => porSlug(sinTildes(nombre));

  // Grabados de Vilmorin disponibles como respaldo mientras falten fotos recortadas.
  const CON_GRABADO = ["tomate", "pimiento", "berenjena", "zapallo", "albahaca", "lechuga", "acelga", "zanahoria", "espinaca", "cebolla", "ajo", "arveja", "maiz", "poroto"];

  // Ruta de la imagen de un cultivo; base es "" en el inicio y "../" en las internas.
  function imagen(slug, base = "") {
    return `${base}imgs/cultivos/${slug}.webp`;
  }
  // Si falta la foto, pasa al grabado; si tampoco hay, deja la inicial.
  function respaldo(img, slug, base = "") {
    if (!img.dataset.paso && CON_GRABADO.includes(slug)) {
      img.dataset.paso = "1";
      img.src = `${base}imgs/ilus/cultivo-${slug}.webp`;
      return;
    }
    img.replaceWith(Object.assign(document.createElement("span"), { className: `${img.className} letra`, textContent: (porSlug(slug)?.nombre || slug)[0].toUpperCase() }));
  }
  // Delegado global: cualquier <img data-cultivo> que falle usa el respaldo.
  document.addEventListener("error", (e) => {
    const img = e.target;
    if (img.tagName === "IMG" && img.dataset.cultivo) respaldo(img, img.dataset.cultivo, img.dataset.base || "");
  }, true);

  // Etapa según la fracción del ciclo recorrida.
  function etapa(cultivo, dias) {
    const f = dias / cultivo.dias;
    if (f < 0.12) return { clave: "germinacion", nombre: "Germinación" };
    if (f < 0.45) return { clave: "crecimiento", nombre: "Crecimiento" };
    if (f < 0.8) return { clave: "desarrollo", nombre: cultivo.familia === "fruto" ? "Flor y fruto" : cultivo.familia === "raiz" ? "Engorde" : "Desarrollo" };
    if (f < 1) return { clave: "casi", nombre: "Casi lista" };
    return { clave: "cosecha", nombre: "Para cosechar" };
  }

  // Consejo de cuidado para la etapa. Juli: verificar con La Huerta Orgánica.
  function consejoDeEtapa(cultivo, clave) {
    const f = cultivo.familia;
    const c = {
      germinacion: "Mantené la tierra húmeda, sin encharcar, hasta que asomen los brotes.",
      crecimiento: f === "raiz" ? "Raleá las plantas que quedaron muy juntas para que engorden."
        : f === "fruto" ? "Poné el tutor ahora, antes de que la planta se vuelque."
        : f === "legumbre" ? "Armale una guía o un tutor para que trepe."
        : "Desmalezá alrededor y cubrí el suelo con paja o pasto seco.",
      desarrollo: f === "fruto" ? "Regá parejo y al pie: los cambios bruscos de humedad rajan los frutos."
        : f === "hoja" ? "Cosechá las hojas de afuera y dejá crecer el centro."
        : f === "aromatica" ? "Despuntá las flores para que siga dando hojas."
        : "Aporcá un poco de tierra al pie y mantené el riego parejo.",
      casi: "Revisá el punto de cosecha en su ficha y cosechá a la mañana temprano.",
      cosecha: "Ya está para cosechar. Si dejás alguna planta, te guarda semilla para la próxima.",
    };
    return c[clave];
  }

  // Publicaciones del INTA citadas en el sitio, con su enlace al repositorio institucional.
  const R = "https://repositorio.inta.gob.ar/handle/20.500.12123/";
  const FUENTES = {
    huertaOrganica: { titulo: "La Huerta Orgánica", anio: 2008, tema: "Huerta", url: R + "15389" },
    miCasa: { titulo: "Mi casa, mi huerta. Técnicas de agricultura urbana", anio: 2015, tema: "Ciudad", url: R + "15072" },
    semillas: { titulo: "Producción artesanal de semillas para la huerta", anio: 2018, tema: "Semillas", url: R + "15109" },
    botiquin: { titulo: "Botiquín del Huertero", anio: 2017, tema: "Plagas", url: R + "663" },
    goteo: { titulo: "Diseño e instalación de pequeños proyectos de riego por goteo", anio: 2017, tema: "Riego", url: R + "1967" },
    riego: { titulo: "Riego por goteo", anio: null, tema: "Riego", url: R + "4528" },
    frutales: { titulo: "Frutales en la Huerta Orgánica Familiar", anio: 2005, tema: "Frutales", url: R + "15387" },
    conservas: { titulo: "Conservación de frutas y hortalizas", anio: 2004, tema: "Conservas", url: R + "15606" },
    proHuerta: { titulo: "Pro-Huerta", anio: 2008, tema: "Programa", url: R + "21409" },
  };
  const cita = (clave) => `<a href="${FUENTES[clave].url}" target="_blank" rel="noopener"><em>${FUENTES[clave].titulo}</em></a>`;

  return { FAMILIAS, CULTIVOS, FUENTES, cita, porSlug, porNombre, imagen, respaldo, etapa, consejoDeEtapa, sinTildes };
})();
