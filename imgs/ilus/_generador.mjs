// Genera las ilustraciones de La Huertita como SVG (paleta B: P1 + verdes, petróleo, naranja y magenta).
import { writeFileSync, mkdirSync } from "node:fs";
const OUT = process.argv[2];
mkdirSync(OUT, { recursive: true });

const C = {
  // paleta del P1 (Espresso, Burgundy, Ruby, Olive, Sage, Cream) y matices de esos mismos colores
  crema: "#F1ECD6", blanco: "#FFFDF6", espresso: "#2E1A0E", ruby: "#6C0B25", burgundy: "#461312", olive: "#64652A", sage: "#B5AD80",
  vOsc: "#3E3F1A", v: "#64652A", vMed: "#8C8455", vAc: "#B5AD80", pet: "#7D7E45", petCl: "#D8D2B0", fondo: "#3E3F1A",
  tom: "#6C0B25", tomOsc: "#461312", tomCl: "#8E2A3F", nar: "#8E2A3F", narCl: "#A3434F", mag: "#6C0B25", magOsc: "#461312", magCl: "#A3434F",
  ber: "#461312", berCl: "#6C0B25", mai: "#C9C19A", maiOsc: "#8C8455",
};

function azar(s) { return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
const f = (n) => n.toFixed(1);

// Fábrica por archivo: ids únicos y generador propio.
function lienzo(nombre, semilla) {
  const r = azar(semilla);
  let uid = 0;
  // forma con color base + rayado de líneas finas con temblor de mano
  const rayada = (d, base, lineas, ang = 80, paso = 6, ancho = [0.8, 2.2]) => {
    const id = `${nombre}-${uid++}`;
    const rad = (ang * Math.PI) / 180, dx = Math.cos(rad), dy = Math.sin(rad);
    let l = "";
    for (let t = -440; t < 440; t += paso) {
      const x0 = 300 - dy * t - dx * 460, y0 = 300 + dx * t - dy * 460;
      let p = `M${f(x0)} ${f(y0)}`;
      for (let k = 1; k <= 6; k++) p += ` L${f(x0 + dx * 155 * k + (r() - 0.5) * 4)} ${f(y0 + dy * 155 * k + (r() - 0.5) * 4)}`;
      const c = lineas[Math.floor(r() * lineas.length)];
      l += `<path d="${p}" stroke="${c}" stroke-width="${(ancho[0] + r() * (ancho[1] - ancho[0])).toFixed(2)}" opacity="${(0.55 + r() * 0.45).toFixed(2)}"/>`;
    }
    return `<clipPath id="${id}"><path d="${d}"/></clipPath><path d="${d}" fill="${base}"/><g clip-path="url(#${id})" fill="none">${l}</g>`;
  };
  const grano = `<filter id="${nombre}-g" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="${semilla}" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 .99  0 0 0 0 .95  0 0 0 .8 -.5" result="m"/><feComposite in="m" in2="SourceGraphic" operator="in" result="mo"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="mo"/></feMerge></filter>`;
  return { r, rayada, grano, gid: `${nombre}-g` };
}

const guardar = (nombre, w, h, cuerpo, etiqueta) =>
  writeFileSync(`${OUT}/${nombre}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${etiqueta}">${cuerpo}</svg>\n`);

// ===================== RETRATOS RAYADOS (600 × 600) =====================
const retratos = {
  tomate(L) {
    return L.rayada("M300 190 C420 180 500 270 490 370 C480 480 390 530 300 530 C200 530 110 480 105 370 C100 270 180 195 300 190Z", C.tom, [C.tomOsc, C.tomCl, "#8E2A3F", "#A3434F"], 70) +
      L.rayada("M300 200 L250 150 L300 175 L320 120 L335 180 L400 160 L345 205 L390 240 L320 220 L300 260 L285 220 L215 235 L265 205Z", C.v, [C.vMed, C.vAc, C.vOsc], 20, 5) +
      `<path d="M300 160 q10 -40 40 -60" stroke="${C.vOsc}" stroke-width="12" fill="none" stroke-linecap="round"/>`;
  },
  pimiento(L) {
    return L.rayada("M200 210 C200 170 260 160 300 178 C340 160 400 170 400 210 C440 270 430 420 385 500 C352 548 322 524 300 498 C278 524 248 548 215 500 C170 420 160 270 200 210Z", C.tom, [C.tomOsc, C.magOsc, C.tomCl], 88) +
      `<path d="M300 182 C300 230 300 330 300 480" stroke="${C.tomOsc}" stroke-width="5" opacity=".5"/>` +
      L.rayada("M250 200 C260 170 340 170 350 200 C330 215 270 215 250 200Z", C.v, [C.vMed, C.vOsc], 10, 5) +
      `<path d="M300 186 C300 140 320 110 350 92" stroke="${C.vOsc}" stroke-width="14" fill="none" stroke-linecap="round"/>`;
  },
  berenjena(L) {
    return L.rayada("M235 175 C320 150 380 210 425 310 C475 430 440 530 355 535 C265 540 225 450 205 360 C185 270 180 195 235 175Z", C.ber, [C.berCl, "#2E1A0E", "#8E2A3F"], 62) +
      `<path d="M262 220 C230 300 250 400 300 470" stroke="${C.blanco}" stroke-width="10" opacity=".18" fill="none" stroke-linecap="round"/>` +
      L.rayada("M200 175 C230 130 300 140 330 190 C300 180 280 215 262 230 C250 205 220 200 200 175Z", C.vMed, [C.v, C.vAc], 30, 5) +
      `<path d="M240 160 C230 120 200 100 170 92" stroke="${C.vOsc}" stroke-width="13" fill="none" stroke-linecap="round"/>`;
  },
  zapallo(L) {
    const gajos = [[200, 330, 92], [400, 330, 92], [255, 330, 100], [345, 330, 100], [300, 330, 104]];
    return gajos.map(([cx, cy, rx]) => L.rayada(`M${cx} ${cy - 150} C${cx + rx} ${cy - 150} ${cx + rx} ${cy + 150} ${cx} ${cy + 150} C${cx - rx} ${cy + 150} ${cx - rx} ${cy - 150} ${cx} ${cy - 150}Z`, C.nar, [C.narCl, "#461312", C.tomOsc], 90, 6)).join("") +
      `<path d="M300 186 C296 150 310 120 336 104" stroke="${C.vOsc}" stroke-width="18" fill="none" stroke-linecap="round"/>` +
      `<path d="M330 120 c30 -20 60 -6 70 14" stroke="${C.vMed}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  },
  albahaca(L) {
    let s = `<path d="M300 560 C300 440 296 300 300 120" stroke="${C.vOsc}" stroke-width="9" fill="none" stroke-linecap="round"/>`;
    [[300, 110, 0, 70], [240, 200, -55, 90], [360, 200, 55, 90], [220, 320, -65, 110], [380, 320, 65, 110], [235, 440, -70, 100], [365, 440, 70, 100]].forEach(([x, y, rot, h]) => {
      s += `<g transform="rotate(${rot} ${x} ${y})">` + L.rayada(`M${x} ${y - h} C${x + h * 0.55} ${y - h * 0.6} ${x + h * 0.5} ${y + h * 0.5} ${x} ${y + h * 0.7} C${x - h * 0.5} ${y + h * 0.5} ${x - h * 0.55} ${y - h * 0.6} ${x} ${y - h}Z`, C.vMed, [C.vAc, C.v, C.vOsc], 90, 5) +
        `<path d="M${x} ${y - h + 10} V${y + h * 0.6}" stroke="${C.vAc}" stroke-width="3"/></g>`;
    });
    return s;
  },
  lechuga(L) {
    let s = "";
    const anillo = (n, radio, tam, cols, base, rot0) => {
      for (let i = 0; i < n; i++) {
        const a = rot0 + (i / n) * Math.PI * 2, x = 300 + Math.cos(a) * radio, y = 310 + Math.sin(a) * radio;
        const d = `M${f(x - tam)} ${f(y)} C${f(x - tam)} ${f(y - tam * 1.2)} ${f(x + tam)} ${f(y - tam * 1.2)} ${f(x + tam)} ${f(y)} C${f(x + tam * 1.1)} ${f(y + tam)} ${f(x - tam * 1.1)} ${f(y + tam)} ${f(x - tam)} ${f(y)}Z`;
        s += L.rayada(d, base, cols, (a * 180) / Math.PI + 90, 5);
      }
    };
    anillo(9, 165, 95, [C.v, C.vMed, C.vOsc], C.vMed, 0.2);
    anillo(7, 95, 85, [C.vMed, C.vAc], C.vAc, 0.6);
    anillo(4, 30, 60, [C.vAc, C.crema, C.vMed], "#D8D2B0", 0);
    return s;
  },
  acelga(L) {
    return L.rayada("M300 560 C230 470 120 420 130 290 C140 160 240 70 300 50 C360 70 470 160 470 290 C480 420 370 470 300 560Z", C.v, [C.vMed, C.vOsc, C.vAc, C.pet], 60) +
      L.rayada("M288 590 L292 90 L308 90 L312 590Z", C.mag, [C.magOsc, C.magCl], 90, 4) +
      [140, 220, 300, 380].map((y) => `<path d="M300 ${y + 40} Q230 ${y} 170 ${y - 30} M300 ${y + 40} Q370 ${y} 430 ${y - 30}" stroke="${C.magCl}" stroke-width="4" fill="none" opacity=".8"/>`).join("");
  },
  zanahoria(L) {
    let z = "";
    [[210, -8], [300, 4], [390, 14]].forEach(([x, rot]) => {
      z += `<g transform="rotate(${rot} ${x} 300)">` +
        L.rayada(`M${x - 38} 230 C${x - 36} 330 ${x - 14} 470 ${x} 560 C${x + 14} 470 ${x + 36} 330 ${x + 38} 230Z`, C.nar, ["#6C0B25", C.narCl, "#461312"], 4, 5) +
        [-30, -12, 6, 22].map((a) => `<path d="M${x} 232 q${a} -70 ${a * 2.2} -170" stroke="${[C.vMed, C.vAc, C.v][Math.floor(L.r() * 3)]}" stroke-width="7" fill="none" stroke-linecap="round"/>`).join("") + `</g>`;
    });
    return z;
  },
  espinaca(L) {
    let s = `<g transform="translate(60 40) scale(.8)">`;
    [[300, 300, 0, 200], [210, 330, -32, 170], [390, 330, 32, 170], [150, 400, -60, 130], [450, 400, 60, 130]].forEach(([x, y, rot, h]) => {
      s += `<g transform="rotate(${rot} 300 540)">` +
        `<path d="M${x} ${y + h * 0.55} L300 540" stroke="${C.vMed}" stroke-width="8" stroke-linecap="round"/>` +
        L.rayada(`M${x} ${y - h * 0.6} C${x + h * 0.42} ${y - h * 0.35} ${x + h * 0.4} ${y + h * 0.3} ${x} ${y + h * 0.55} C${x - h * 0.4} ${y + h * 0.3} ${x - h * 0.42} ${y - h * 0.35} ${x} ${y - h * 0.6}Z`, C.vOsc, [C.v, C.pet, C.vMed], 85, 5) +
        `<path d="M${x} ${y - h * 0.5} V${y + h * 0.5}" stroke="${C.vAc}" stroke-width="3"/></g>`;
    });
    return s + "</g>";
  },
  cebolla(L) {
    return `<g stroke="${C.sage}" stroke-width="3" stroke-linecap="round" fill="none">${[-40, -20, 0, 20, 40].map((a) => `<path d="M300 490 q${a / 2} 30 ${a} 60"/>`).join("")}</g>` +
      L.rayada("M300 150 C330 210 450 260 450 360 C450 450 380 495 300 495 C220 495 150 450 150 360 C150 260 270 210 300 150Z", C.magOsc, [C.mag, "#2E1A0E", C.magCl], 88, 5) +
      `<g stroke="#2E1A0E" stroke-width="3" fill="none" opacity=".6"><path d="M300 160 C250 250 230 380 280 490"/><path d="M300 160 C350 250 370 380 320 490"/></g>` +
      `<path d="M300 160 C296 110 282 70 260 40 M300 160 C306 100 322 64 350 40" stroke="${C.vMed}" stroke-width="9" fill="none" stroke-linecap="round"/>`;
  },
  ajo(L) {
    return `<g stroke="${C.sage}" stroke-width="3" stroke-linecap="round" fill="none">${[-50, -25, 0, 25, 50].map((a) => `<path d="M300 500 q${a / 2} 26 ${a} 50"/>`).join("")}</g>` +
      L.rayada("M300 130 C320 200 470 250 460 380 C452 470 380 505 300 505 C220 505 148 470 140 380 C130 250 280 200 300 130Z", C.blanco, ["#E6DFC4", "#C9C19A", C.magCl, "#E6DFC4"], 86, 5, [0.6, 1.6]) +
      `<g stroke="#B5AD80" stroke-width="3" fill="none"><path d="M300 140 C240 230 220 380 250 500"/><path d="M300 140 C360 230 380 380 350 500"/><path d="M300 140 C190 240 160 380 200 480"/><path d="M300 140 C410 240 440 380 400 480"/></g>` +
      `<path d="M300 140 C300 100 290 70 280 50" stroke="#B5AD80" stroke-width="10" fill="none" stroke-linecap="round"/>`;
  },
  arveja(L) {
    let s = L.rayada("M80 340 C140 230 320 190 520 230 C520 300 400 400 250 420 C170 430 100 400 80 340Z", C.vMed, [C.v, C.vAc, C.vOsc], 15, 5) +
      L.rayada("M95 345 C160 270 320 245 500 255 C480 320 380 380 250 395 C180 402 120 385 95 345Z", "#D8D2B0", [C.vAc, C.crema], 15, 5);
    [[170, 345], [235, 330], [300, 318], [365, 306], [430, 292]].forEach(([x, y]) => {
      s += `<circle cx="${x + 4}" cy="${y + 6}" r="30" fill="${C.v}" opacity=".35"/>` + L.rayada(`M${x - 30} ${y} a30 30 0 1 0 60 0 a30 30 0 1 0 -60 0Z`, C.vMed, [C.vAc, C.v], 40, 4) +
        `<ellipse cx="${x - 10}" cy="${y - 10}" rx="8" ry="5" fill="${C.blanco}" opacity=".45"/>`;
    });
    return s + `<path d="M520 230 C540 200 560 190 580 196" stroke="${C.vOsc}" stroke-width="8" fill="none" stroke-linecap="round"/>`;
  },
  maiz(L) {
    let s = L.rayada("M300 90 C360 110 390 200 385 320 C380 430 340 510 300 530 C260 510 220 430 215 320 C210 200 240 110 300 90Z", C.mai, [C.maiOsc, "#D8D2B0"], 90, 6);
    for (let j = 0; j < 13; j++) for (let i = -3; i <= 3; i++) {
      const y = 130 + j * 30, ancho = 80 * Math.sin(Math.PI * (j + 1) / 14), x = 300 + i * (ancho / 3.4);
      s += `<ellipse cx="${f(x)}" cy="${y}" rx="${f(Math.max(4, ancho / 8))}" ry="11" fill="${(i + j) % 5 ? C.mai : C.narCl}" stroke="${C.maiOsc}" stroke-width="2"/>`;
    }
    return s + L.rayada("M300 560 C220 520 160 420 170 250 C200 360 250 450 300 500Z", C.vMed, [C.v, C.vAc], 70, 5) +
      L.rayada("M300 560 C380 520 440 420 430 250 C400 360 350 450 300 500Z", C.v, [C.vMed, C.vOsc], 110, 5);
  },
  poroto(L) {
    let s = "";
    [[0, C.vMed], [24, C.v]].forEach(([rot, base]) => {
      s += `<g transform="rotate(${rot} 300 300)">` + L.rayada("M120 200 C220 160 400 190 480 300 C500 330 490 350 470 345 C390 260 230 230 130 240 C105 240 100 210 120 200Z", base, [C.vAc, C.vOsc], 20, 5) + `</g>`;
    });
    [[230, 430, 20], [310, 455, -10], [390, 425, 30]].forEach(([x, y, rot]) => {
      s += `<g transform="rotate(${rot} ${x} ${y})">` + L.rayada(`M${x - 40} ${y} C${x - 40} ${y - 30} ${x + 40} ${y - 30} ${x + 40} ${y} C${x + 40} ${y + 26} ${x + 6} ${y + 22} ${x} ${y + 12} C${x - 6} ${y + 22} ${x - 40} ${y + 26} ${x - 40} ${y}Z`, C.ruby, [C.mag, C.burgundy, C.magCl], 30, 4) + `</g>`;
    });
    return s;
  },
};

const nombres = { tomate: "Tomate", pimiento: "Pimiento", berenjena: "Berenjena", zapallo: "Zapallo", albahaca: "Albahaca", lechuga: "Lechuga", acelga: "Acelga", zanahoria: "Zanahoria", espinaca: "Espinaca", cebolla: "Cebolla", ajo: "Ajo", arveja: "Arveja", maiz: "Maíz", poroto: "Poroto" };
let s = 3;
for (const [k, fn] of Object.entries(retratos)) {
  const L = lienzo(k, s++);
  guardar(`cultivo-${k}`, 600, 600, `<rect width="600" height="600" fill="${C.crema}"/>${fn(L)}`, `Ilustración de ${nombres[k].toLowerCase()} con rayado de líneas finas`);
}

// ===================== FRASCOS DE CONSERVAS (400 × 480) =====================
function frasco(nombre, semilla, liquido, contenido, tapa, etiqueta) {
  const L = lienzo(nombre, semilla);
  const cuerpo = "M110 120 C90 120 80 140 80 170 L80 420 C80 450 100 465 130 465 L270 465 C300 465 320 450 320 420 L320 170 C320 140 310 120 290 120Z";
  const id = `${nombre}-vidrio`;
  return `<defs>${L.grano}<clipPath id="${id}"><path d="${cuerpo}"/></clipPath></defs><g filter="url(#${L.gid})">
    <ellipse cx="200" cy="470" rx="130" ry="10" fill="${C.espresso}" opacity=".15"/>
    <path d="${cuerpo}" fill="${C.petCl}" opacity=".35"/>
    <g clip-path="url(#${id})"><rect x="60" y="${liquido.y}" width="300" height="400" fill="${liquido.c}" opacity=".85"/>${contenido(L)}</g>
    <path d="${cuerpo}" fill="none" stroke="${C.pet}" stroke-width="5"/>
    <path d="M104 170 V400 M122 180 V260" stroke="${C.blanco}" stroke-width="9" stroke-linecap="round" opacity=".55"/>
    <rect x="120" y="96" width="160" height="30" rx="8" fill="${C.petCl}" stroke="${C.pet}" stroke-width="4"/>
    ${tapa(L)}</g>`;
}
const eneldo = (x, y, esc = 1) => {
  let s = `<path d="M${x} ${y + 120 * esc} C${x + 4} ${y + 60 * esc} ${x - 2} ${y + 20 * esc} ${x} ${y}" stroke="${C.espresso}" stroke-width="2" fill="none"/>`;
  for (let i = 0; i < 9; i++) { const a = -Math.PI + (i / 8) * Math.PI, ex = x + Math.cos(a) * 34 * esc, ey = y + Math.sin(a) * 26 * esc; s += `<path d="M${x} ${y} L${f(ex)} ${f(ey)}" stroke="${C.espresso}" stroke-width="1.4"/><circle cx="${f(ex)}" cy="${f(ey)}" r="2.6" fill="${C.espresso}"/>`; }
  return s;
};
const telaLunares = (L, base, punto) => `<path d="M100 112 C120 70 280 70 300 112 C306 128 294 140 280 136 C240 126 160 126 120 136 C106 140 94 128 100 112Z" fill="${base}"/>` +
  Array.from({ length: 16 }, (_, i) => `<circle cx="${f(120 + (i % 8) * 23 + (i > 7 ? 11 : 0))}" cy="${f(92 + (i > 7 ? 20 : 0) + L.r() * 4)}" r="5" fill="${punto}"/>`).join("") +
  `<path d="M110 128 C160 118 240 118 290 128" stroke="${C.espresso}" stroke-width="4" fill="none"/>`;

guardar("conserva-encurtir", 400, 480, frasco("enc", 21, { y: 150, c: "#B5AD80" }, (L) =>
  L.rayada("M120 200 C120 160 170 160 170 200 L170 420 C170 450 120 450 120 420Z", C.vMed, [C.v, C.vAc], 90, 4) +
  L.rayada("M230 230 C230 190 280 190 280 230 L280 430 C280 460 230 460 230 430Z", C.v, [C.vMed, C.vOsc], 90, 4) +
  [[200, 300], [205, 380], [150, 455]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="20" fill="${C.nar}"/><circle cx="${x}" cy="${y}" r="10" fill="${C.narCl}"/>`).join("") +
  `<path d="M300 190 C290 260 300 330 290 400" stroke="${C.tom}" stroke-width="12" stroke-linecap="round" fill="none"/>` + eneldo(190, 190, 1.1) + eneldo(260, 330, 0.8) +
  Array.from({ length: 14 }, () => `<circle cx="${f(100 + L.r() * 200)}" cy="${f(170 + L.r() * 280)}" r="3" fill="${C.espresso}"/>`).join(""),
  (L) => telaLunares(L, C.ruby, C.blanco)), "Frasco de encurtidos con pepinos, rodajas de zanahoria, ají y eneldo");

guardar("conserva-mermelada", 400, 480, frasco("mer", 22, { y: 140, c: "#A3434F" }, (L) =>
  [[140, 200, 34], [230, 230, 40], [170, 300, 38], [260, 330, 34], [140, 400, 36], [240, 420, 40], [200, 360, 26]].map(([x, y, rr]) =>
    L.rayada(`M${x - rr} ${y} a${rr} ${rr} 0 1 0 ${rr * 2} 0 a${rr} ${rr} 0 1 0 ${-rr * 2} 0Z`, C.magOsc, [C.ruby, C.mag, C.tomOsc], 60, 4) + `<ellipse cx="${x - rr / 3}" cy="${y - rr / 3}" rx="${rr / 4}" ry="${rr / 6}" fill="${C.blanco}" opacity=".5"/>`).join("") +
  `<path d="M120 260 q30 -20 60 0" stroke="${C.vMed}" stroke-width="6" fill="none" stroke-linecap="round"/>`,
  (L) => telaLunares(L, C.crema, C.ruby) + `<path d="M290 120 L330 80" stroke="${C.espresso}" stroke-width="2"/><rect x="322" y="56" width="46" height="28" rx="4" transform="rotate(-30 345 70)" fill="${C.blanco}" stroke="${C.sage}" stroke-width="2"/>`),
  "Frasco de mermelada de frutos rojos con tapa de tela a lunares");

guardar("conserva-secar", 400, 480, frasco("sec", 23, { y: 180, c: "#C9C19A" }, (L) =>
  [[150, 230, 20], [240, 250, -25], [180, 320, 35], [260, 340, -10], [140, 410, -30], [230, 420, 15]].map(([x, y, rot]) =>
    `<g transform="rotate(${rot} ${x} ${y})">` + L.rayada(`M${x - 46} ${y} C${x - 40} ${y - 30} ${x + 40} ${y - 30} ${x + 46} ${y} C${x + 40} ${y + 24} ${x - 40} ${y + 24} ${x - 46} ${y}Z`, C.tomOsc, [C.ruby, C.tom, C.burgundy], 0, 4) + `</g>`).join("") +
  `<path d="M300 200 C280 280 290 360 270 440" stroke="${C.vOsc}" stroke-width="4" fill="none"/>` +
  Array.from({ length: 10 }, (_, i) => `<path d="M${f(298 - i * 3)} ${200 + i * 24} l${i % 2 ? 16 : -16} -10" stroke="${C.vMed}" stroke-width="4" stroke-linecap="round"/>`).join(""),
  () => `<rect x="112" y="70" width="176" height="40" rx="10" fill="#8C8455"/><path d="M112 84 H288" stroke="#64652A" stroke-width="3"/>`),
  "Frasco con tomates secos en aceite y una rama de romero");

// congelar: táper rectangular
{
  const L = lienzo("con", 24);
  const caja = "M60 170 L340 170 L330 410 C328 430 316 440 296 440 L104 440 C84 440 72 430 70 410Z";
  let cont = "";
  for (let i = 0; i < 46; i++) { const x = 90 + L.r() * 220, y = 230 + L.r() * 190; cont += `<circle cx="${f(x)}" cy="${f(y)}" r="14" fill="${[C.vMed, C.vAc, C.v][i % 3]}"/><circle cx="${f(x - 4)}" cy="${f(y - 4)}" r="4" fill="${C.blanco}" opacity=".45"/>`; }
  cont += [[120, 250, -20], [270, 280, 25]].map(([x, y, rot]) => `<g transform="rotate(${rot} ${x} ${y})"><rect x="${x - 50}" y="${y - 20}" width="100" height="40" rx="18" fill="${C.mai}"/>${Array.from({ length: 8 }, (_, k) => `<path d="M${x - 44 + k * 12} ${y - 16} V${y + 16}" stroke="${C.maiOsc}" stroke-width="2"/>`).join("")}</g>`).join("");
  guardar("conserva-congelar", 400, 480, `<defs>${L.grano}<clipPath id="con-c"><path d="${caja}"/></clipPath></defs><g filter="url(#${L.gid})">
    <ellipse cx="200" cy="448" rx="150" ry="10" fill="${C.espresso}" opacity=".15"/>
    <path d="${caja}" fill="${C.petCl}" opacity=".35"/><g clip-path="url(#con-c)">${cont}</g>
    <path d="${caja}" fill="none" stroke="${C.pet}" stroke-width="5"/>
    <rect x="48" y="140" width="304" height="40" rx="12" fill="${C.pet}"/><rect x="150" y="128" width="100" height="18" rx="8" fill="${C.pet}"/>
    <path d="M86 200 V400" stroke="${C.blanco}" stroke-width="9" stroke-linecap="round" opacity=".5"/>
    <g stroke="${C.blanco}" stroke-width="4" stroke-linecap="round"><path d="M310 90 v40 M290 100 l40 20 M290 120 l40 -20"/></g></g>`,
    "Táper con arvejas y trozos de choclo listos para congelar");
}

// ===================== FRANJA PARA BANDAS DE CAPÍTULO (1440 × 140) =====================
{
  const L = lienzo("fr", 31);
  let s = `<defs>${L.grano}</defs><g filter="url(#${L.gid})">`;
  s += `<path d="M0 90 C160 50 300 80 460 66 C640 50 760 96 940 80 C1120 64 1260 40 1440 70 V140 H0Z" fill="#525326"/>`;
  s += `<path d="M0 110 C200 84 380 104 600 98 C820 92 1000 120 1200 104 C1300 96 1380 92 1440 96 V140 H0Z" fill="#3E3F1A"/>`;
  for (let i = 0; i < 46; i++) {
    const x = 20 + i * 31 + L.r() * 10, y = 112 + L.r() * 16, h = 14 + L.r() * 18, c = [C.vAc, C.vMed, C.sage][i % 3];
    s += `<path d="M${f(x)} ${f(y)} v${f(-h)}" stroke="${c}" stroke-width="3" stroke-linecap="round"/><path d="M${f(x)} ${f(y - h * 0.6)} q-10 -2 -12 -12 q10 0 12 12z M${f(x)} ${f(y - h * 0.8)} q10 -4 10 -14 q-10 2 -10 14z" fill="${c}"/>`;
  }
  for (let i = 0; i < 30; i++) s += `<circle cx="${f(L.r() * 1440)}" cy="${f(20 + L.r() * 60)}" r="${f(1.5 + L.r() * 2)}" fill="${C.crema}" opacity=".5"/>`;
  [[180, 34], [880, 28], [1260, 40]].forEach(([x, y]) => (s += `<path d="M${x} ${y} q7 -7 14 0 q7 -7 14 0" stroke="${C.crema}" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/>`));
  guardar("franja-canteros", 1440, 140, s + "</g>", "");
}

// ===================== MISCELÁNEAS (120 × 120) =====================
{
  const piezas = {
    hoja: (L) => L.rayada("M60 10 C100 30 105 80 60 110 C15 80 20 30 60 10Z", C.vMed, [C.vAc, C.v], 80, 4) + `<path d="M60 16 V104" stroke="${C.vAc}" stroke-width="2.5"/>`,
    brote: (L) => `<path d="M60 112 V60" stroke="${C.vMed}" stroke-width="5" stroke-linecap="round"/>` + L.rayada("M60 66 C30 64 16 40 18 22 C42 22 60 40 60 66Z", C.vMed, [C.vAc, C.v], 40, 4) + L.rayada("M60 58 C86 50 100 28 96 12 C72 16 58 34 60 58Z", C.vAc, [C.vMed, "#D8D2B0"], 130, 4),
    semillas: (L) => [[30, 40, 20], [70, 30, -30], [50, 75, 60], [88, 72, 10], [26, 92, -20]].map(([x, y, rot]) => `<ellipse cx="${x}" cy="${y}" rx="11" ry="7" transform="rotate(${rot} ${x} ${y})" fill="${[C.burgundy, C.ruby, C.maiOsc][Math.floor(L.r() * 3)]}"/>`).join(""),
  };
  let s = 40;
  for (const [k, fn] of Object.entries(piezas)) guardar(`misc-${k}`, 120, 120, fn(lienzo(`m${k}`, s++)), "");
}

// ===================== PLANO DE HUERTA (900 × 1300) =====================
function plano(p, id){
  const r = azar(7);
  const W=900, H=1300;
  let o = [];
  const add = (s)=>o.push(s);

  // hoja con nervadura (vista de arriba)
  const hoja = (x,y,w,h,rot,fill,vena) => {
    add(`<g transform="translate(${x} ${y}) rotate(${rot})">
      <path d="M0 ${-h/2} C${w/2} ${-h/3} ${w/2} ${h/3} 0 ${h/2} C${-w/2} ${h/3} ${-w/2} ${-h/3} 0 ${-h/2}Z" fill="${fill}"/>
      <path d="M0 ${-h/2+4} V${h/2-2}" stroke="${vena}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      ${[0.25,0.45,0.65].map(t=>{const yy=-h/2+h*t;return `<path d="M0 ${yy+8} L${w*0.32} ${yy} M0 ${yy+8} L${-w*0.32} ${yy}" stroke="${vena}" stroke-width="1.6" stroke-linecap="round"/>`}).join("")}
    </g>`);
  };
  // copa de árbol con ramitas
  const arbol = (x,y,rad,fill,sombra) => {
    add(`<circle cx="${x+8}" cy="${y+10}" r="${rad}" fill="${sombra}" opacity=".55"/>`);
    const pts=[]; for(let i=0;i<10;i++){ const a=i/10*Math.PI*2, rr=rad*(0.85+r()*0.22); pts.push([x+Math.cos(a)*rr, y+Math.sin(a)*rr]); }
    const m=(p,q)=>[(p[0]+q[0])/2,(p[1]+q[1])/2];
    let d=`M${m(pts[9],pts[0]).map(n=>n.toFixed(1)).join(" ")}`;
    for(let i=0;i<10;i++){ const p=pts[i], q=m(p,pts[(i+1)%10]); d+=` Q${p[0].toFixed(1)} ${p[1].toFixed(1)} ${q[0].toFixed(1)} ${q[1].toFixed(1)}`; }
    add(`<path d="${d}Z" fill="${fill}"/>`);
    for(let i=0;i<5;i++){ const a=r()*Math.PI*2; add(`<path d="M${x} ${y} l${(Math.cos(a)*rad*0.6).toFixed(1)} ${(Math.sin(a)*rad*0.6).toFixed(1)}" stroke="${p.vena}" stroke-width="2" stroke-linecap="round" opacity=".7"/>`); }
  };

  add(`<rect width="${W}" height="${H}" fill="${p.fondo}"/>`);
  add(`<rect width="${W}" height="${H}" fill="url(#pt-${id})"/>`);

  // senderos
  add(`<path d="M0 330 H${W} M0 830 H${W}" stroke="${p.sendero}" stroke-width="58"/>`);
  add(`<path d="M470 0 V${H}" stroke="${p.sendero}" stroke-width="64"/>`);
  for(let i=0;i<30;i++){ add(`<ellipse cx="${(450+r()*40).toFixed(0)}" cy="${(r()*H).toFixed(0)}" rx="${(2+r()*6).toFixed(1)}" ry="${(4+r()*10).toFixed(1)}" fill="${p.tierraClara}" opacity=".7"/>`); }

  // bancal arriba izq: repollos/coles vistas desde arriba
  add(`<rect x="30" y="40" width="400" height="250" rx="12" fill="${p.cantero}"/>`);
  for(let i=0;i<4;i++) for(let j=0;j<2;j++){
    const cx=90+i*95, cy=110+j*110;
    add(`<circle cx="${cx}" cy="${cy}" r="38" fill="${p.col}"/>`);
    add(`<circle cx="${cx}" cy="${cy}" r="24" fill="${p.colClaro}"/>`);
    for(let k=0;k<6;k++){ const a=k/6*Math.PI*2; add(`<path d="M${cx} ${cy} l${(Math.cos(a)*34).toFixed(1)} ${(Math.sin(a)*34).toFixed(1)}" stroke="${p.vena}" stroke-width="2" opacity=".8"/>`); }
  }

  // bancal arriba der: tomatitos en hileras + tutores
  add(`<rect x="530" y="40" width="340" height="250" rx="12" fill="${p.cantero}"/>`);
  for(let i=0;i<5;i++){ const x=575+i*62;
    add(`<path d="M${x} 60 V270" stroke="${p.hojaOscura}" stroke-width="10" stroke-linecap="round"/>`);
    for(let j=0;j<7;j++){ add(`<circle cx="${x+(j%2?8:-8)}" cy="${72+j*30}" r="9" fill="${p.tomate}"/>`); }
  }

  // bancal medio izq: tierra con plantines y semillas
  add(`<rect x="30" y="390" width="400" height="390" rx="12" fill="${p.cantero}"/>`);
  for(let i=0;i<5;i++) hoja(80+i*80, 450, 46, 92, 0, p.hojaClara, p.vena);
  add(`<rect x="50" y="520" width="360" height="130" rx="6" fill="${p.tierra}"/>`);
  for(let i=0;i<70;i++) add(`<circle cx="${(60+r()*340).toFixed(0)}" cy="${(530+r()*110).toFixed(0)}" r="${(1.5+r()*2.5).toFixed(1)}" fill="${p.tierraOscura}"/>`);
  for(let i=0;i<6;i++) for(let j=0;j<2;j++){ const x=80+i*60, y=560+j*55;
    add(`<path d="M${x} ${y} q-14 -10 -18 -22 q14 2 18 22 q4 -20 18 -22 q-4 12 -18 22z" fill="${p.hoja}"/>`); }
  for(let i=0;i<5;i++) hoja(80+i*80, 715, 56, 96, 0, p.col, p.vena);
  add(`<path d="M50 662 H410 M50 768 H410" stroke="${p.sendero}" stroke-width="3" opacity=".8"/>`);
  for(let i=0;i<7;i++) add(`<path d="M${60+i*58} 650 V678" stroke="${p.sendero}" stroke-width="3" opacity=".8"/>`);

  // bancal medio der: zanahorias en hileras + acelgas
  add(`<rect x="530" y="390" width="340" height="390" rx="12" fill="${p.cantero}"/>`);
  for(let i=0;i<8;i++) hoja(560+i*40, 440, 30, 70, (r()-.5)*16, i%2?p.hoja:p.hojaClara, p.vena);
  for(let i=0;i<4;i++){ const x=575+i*80;
    add(`<path d="M${x} 520 V740" stroke="${p.zanahoria}" stroke-width="12" stroke-linecap="round"/>`);
    for(let j=0;j<5;j++){ add(`<path d="M${x} ${520+j*48} l-14 -16 M${x} ${520+j*48} l14 -16 M${x} ${520+j*48} l0 -20" stroke="${p.hoja}" stroke-width="4" stroke-linecap="round"/>`); }
  }

  // bancal abajo izq: tomates grandes
  add(`<rect x="30" y="890" width="400" height="300" rx="12" fill="${p.cantero}"/>`);
  for(let i=0;i<4;i++) for(let j=0;j<2;j++){ const cx=90+i*95+(j?40:0), cy=960+j*130;
    add(`<circle cx="${cx+5}" cy="${cy+7}" r="40" fill="${p.sombra}" opacity=".5"/>`);
    add(`<circle cx="${cx}" cy="${cy}" r="40" fill="${(i+j)%4===3?p.tomateVerde:p.tomate}"/>`);
    add(`<ellipse cx="${cx-14}" cy="${cy-14}" rx="10" ry="6" fill="#FFFDF6" opacity=".35" transform="rotate(-35 ${cx-14} ${cy-14})"/>`);
    add(`<path d="M${cx} ${cy-40} l-12 -10 M${cx} ${cy-40} l12 -10 M${cx} ${cy-40} l0 -18 M${cx} ${cy-40} l-18 2 M${cx} ${cy-40} l18 2" stroke="${p.hojaOscura}" stroke-width="5" stroke-linecap="round"/>`);
  }

  // árboles y bordes
  arbol(650,1000,80,p.arbol,p.sombra); arbol(820,1130,70,p.hojaClara,p.sombra); arbol(590,1210,60,p.col,p.sombra);
  arbol(870,960,50,p.hoja,p.sombra); arbol(-10,600,60,p.hojaClara,p.sombra); arbol(-20,1250,80,p.arbol,p.sombra);

  // flores sueltas
  for(let i=0;i<14;i++){ const x=r()*W, y=r()*H; add(`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="3" fill="#FFFDF6" opacity=".7"/>`); }

  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Plano ilustrado de una huerta vista desde arriba, con canteros, senderos y árboles">
    <defs>
      <filter id="riso-${id}" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="3" result="n"/>
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 .99  0 0 0 0 .95  0 0 0 .75 -.47" result="claro"/>
        <feComposite in="claro" in2="SourceGraphic" operator="in" result="motas"/>
        <feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="motas"/></feMerge>
      </filter>
      <pattern id="pt-${id}" width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.2" fill="#000" opacity=".12"/><circle cx="9" cy="8" r=".9" fill="#000" opacity=".09"/></pattern>
    </defs>
    <g filter="url(#riso-${id})">${o.join("")}</g>
  </svg>`;
}

const P1 = { fondo:"#3E3F1A", cantero:"#64652A", sendero:"#F1ECD6", tierraClara:"#B5AD80", tierra:"#7A5A3A", tierraOscura:"#2E1A0E",
  hoja:"#8C8455", hojaClara:"#B5AD80", hojaOscura:"#3E3F1A", col:"#8F9A6A", colClaro:"#B5AD80", vena:"#F1ECD6",
  tomate:"#6C0B25", tomateVerde:"#8C8455", zanahoria:"#C9603F", arbol:"#4F5A2A", sombra:"#2E1A0E" };
writeFileSync(`${OUT}/plano-huerta.svg`, plano(P1, "pl"));

console.log("listo");
