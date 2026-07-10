// Motor del método VAF (Vicerrectoría de Administración y Finanzas)
// Porte 1:1 de modelo_metodo_finanzas.py — absorción total de overhead, 20% no pago,
// horizonte 5 años, tasa social 5,5%, docencia a costo marginal.

export const PV = {
  disc: 0.055, grow: 0.04, nopago: 0.20,
  nuevos: 30, r1: 0.80, r2: 0.83,
  arancel0: 4_500_000, derecho0: 150_000, inv: 14_700_000,
  coord: 12_000_000, bioseg: 6_000_000, tecnicoBase: 9_000_000,
  labEst: 160_000, otros0: 4_000_000, docEst: 550_000,
  ratioFac: 3_356_886, ratioCen: 62_393_540 / 25,   // = 2.495.741,6
  fFac: 0.15, fCen: 0.10, H: 5,
};

const tecnico = (n, base) => base * (n >= 3 ? 1.5 : 1);

export function matricula(nuevos, H, r1, r2) {
  const s = [1, r1, r1 * r2, r1 * r2 * r2, r1 * r2 * r2 * r2];
  const m = [];
  for (let n = 1; n <= H; n++) {
    let t = 0;
    for (let y = 1; y <= Math.min(n, 5); y++) t += nuevos * s[y - 1];
    m.push(t);
  }
  return m;
}

const ohAdj = (mats, ratio, factor) => {
  const prop = mats.map(x => ratio * x), base1 = prop[0];
  return prop.map(p => base1 + factor * (p - base1));
};

export function corre(over = {}) {
  const P = { ...PV, ...over };
  const mats = matricula(P.nuevos, P.H, P.r1, P.r2);
  const fac = ohAdj(mats, P.ratioFac, P.fFac);
  const cen = ohAdj(mats, P.ratioCen, P.fCen);
  const filas = [], flujos = [-P.inv];
  for (let i = 0; i < P.H; i++) {
    const n = i + 1, g = Math.pow(1 + P.grow, n - 1), mat = mats[i];
    const arancel = P.arancel0 * g, derecho = P.derecho0 * g;
    const bruto = mat * (arancel + derecho);
    const nopago = bruto * P.nopago;
    const neto = bruto - nopago;
    const soporte = (P.coord + tecnico(n, P.tecnicoBase) + P.bioseg) * g;
    const lab = mat * P.labEst * g, otros = P.otros0 * g, docencia = mat * P.docEst * g;
    const costosDir = docencia + soporte + lab + otros;
    const margen = neto - costosDir;
    const oh = fac[i] + cen[i];
    const flujo = margen - oh;
    flujos.push(flujo);
    filas.push({ n, mat, arancel, derecho, bruto, nopago, neto, soporte, lab, otros,
                 docencia, costosDir, margen, fac: fac[i], cen: cen[i], propFac: P.ratioFac * mat,
                 propCen: P.ratioCen * mat, oh, flujo });
  }
  const npv = (rate) => flujos.reduce((a, v, t) => a + v / Math.pow(1 + rate, t), 0);
  const van = npv(P.disc);
  let tir = null, lo = -0.9, hi = 5;
  if (npv(lo) * npv(hi) < 0) {
    for (let k = 0; k < 200; k++) { const m = (lo + hi) / 2; if (npv(lo) * npv(m) <= 0) hi = m; else lo = m; }
    tir = (lo + hi) / 2;
  }
  // caja acumulada
  let acum = -P.inv;
  for (const f of filas) { acum += f.flujo; f.acum = acum; }
  return { filas, flujos, van, tir, mats, regimen: mats[mats.length - 1] };
}

// Primer horizonte (años) en que el VAN pasa a ser >= 0
export function anioCruce(over = {}) {
  for (let H = 1; H <= 12; H++) if (corre({ ...over, H }).van >= 0) return H;
  return null;
}

// Escenarios que Finanzas prescribe para Bioquímica (informe preliminar §7)
export const ESC_F7 = [
  { nombre: 'Conservador',    ret: '72 / 78', arancel: '$4.200.000', vac: 30, p: { r1: 0.72, r2: 0.78, arancel0: 4_200_000, nuevos: 30 } },
  { nombre: 'Base Finanzas',  ret: '81 / 82', arancel: '$4.686.000', vac: 35, p: { r1: 0.81, r2: 0.82, arancel0: 4_686_000, nuevos: 35 } },
  { nombre: 'Nuestro modelo', ret: '80 / 83', arancel: '$4.500.000', vac: 30, p: { r1: 0.80, r2: 0.83, arancel0: 4_500_000, nuevos: 30 } },
  { nombre: 'Optimista',      ret: '85 / 85', arancel: '$5.000.000', vac: 40, p: { r1: 0.85, r2: 0.85, arancel0: 5_000_000, nuevos: 40 } },
];

export const OVERHEAD_ESC = [
  { nombre: 'Sin costo marginal', fFac: 0, fCen: 0 },
  { nombre: 'Base (15% / 10%)', fFac: 0.15, fCen: 0.10 },
  { nombre: 'Conservador (20% / 15%)', fFac: 0.20, fCen: 0.15 },
  { nombre: 'Estrés (25% / 20%)', fFac: 0.25, fCen: 0.20 },
  { nombre: 'Proporcional 100%', fFac: 1, fCen: 1 },
];
