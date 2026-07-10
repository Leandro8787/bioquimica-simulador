// Motor del modelo financiero — Carrera de Bioquímica (portado 1:1 de model2.py)
// Proyección determinística por cohortes a 10 años.

export const P = {
  vac: 35, tasaMat: 0.85, ret1: 0.80, ret2: 0.83,
  arancel0: 4_500_000, derecho0: 150_000,
  grat: 0.65, beca: 0.12, directo: 0.23, morosidad: 0.05,
  nAcad: 16, salaryBruta: 3_246_448, empleadorFactor: 1.055, dedH: 12, jornadaH: 44,
  ramp: [0.2, 0.4, 0.6, 0.8, 1, 1, 1, 1, 1, 1],
  docenteFrac: 0,              // 0 = vista principal (docente $0) ; 1 = vista económica total
  coordAnual: 12_000_000, tecnicoAnual: 9_000_000, biosegAnual: 6_000_000,
  labEst: 160_000, otrosOp0: 4_000_000,
  overheadEst: 700_000, overheadFrac: 1,
  invInicial: 14_700_000,
  infl: 0.035, disc: 0.08, H: 10,
};

export const factorCobranza = (p) => (p.grat + p.beca) + p.directo * (1 - p.morosidad);

export function matricula(vac, tasa, r1, r2, H) {
  const nuevos = vac * tasa;
  const s = [1, r1, r1 * r2, r1 * r2 * r2, r1 * r2 * r2 * r2];
  const mats = [];
  for (let n = 1; n <= H; n++) {
    let tot = 0;
    for (let y = 1; y <= Math.min(n, 5); y++) tot += nuevos * s[y - 1];
    mats.push(tot);
  }
  return { mats, nuevos, s };
}

export function run(p) {
  const { mats, nuevos } = matricula(p.vac, p.tasaMat, p.ret1, p.ret2, p.H);
  const costoEmp = p.salaryBruta * p.empleadorFactor;
  const docenteFull = p.nAcad * costoEmp * 12 * (p.dedH / p.jornadaH);
  const c = factorCobranza(p);
  const rows = [];
  for (let i = 0; i < p.H; i++) {
    const n = i + 1;
    const f = Math.pow(1 + p.infl, n - 1);
    const mat = mats[i];
    const arancel = p.arancel0 * f, derecho = p.derecho0 * f;
    const ingresos = mat * (arancel + derecho) * c;
    const docentes = docenteFull * p.ramp[i] * f * p.docenteFrac;
    const tecnico = p.tecnicoAnual * (n >= 3 ? 1.5 : 1);
    const support = (p.coordAnual + tecnico + p.biosegAnual) * f;
    const lab = mat * p.labEst * f;
    const otros = p.otrosOp0 * f;
    const overhead = mat * p.overheadEst * f * p.overheadFrac;
    const costos = docentes + support + lab + otros + overhead;
    rows.push({ n, mat, nuevos, arancel, ingresos, docentes, support, lab, otros, overhead, costos, resultado: ingresos - costos });
  }
  let acum = -p.invInicial;
  for (const r of rows) { acum += r.resultado; r.acum = acum; }
  let van = -p.invInicial;
  for (const r of rows) { r.vp = r.resultado / Math.pow(1 + p.disc, r.n); van += r.vp; }
  // TIR por bisección
  const flujos = [-p.invInicial, ...rows.map(r => r.resultado)];
  const npv = (rate) => flujos.reduce((a, v, t) => a + v / Math.pow(1 + rate, t), 0);
  let tir = null, lo = -0.9, hi = 5;
  if (npv(lo) * npv(hi) < 0) {
    for (let k = 0; k < 200; k++) { const m = (lo + hi) / 2; if (npv(lo) * npv(m) <= 0) hi = m; else lo = m; }
    tir = (lo + hi) / 2;
  }
  const payback = (rows.find(r => r.acum >= 0) || {}).n ?? null;
  const peAnio = (rows.find(r => r.resultado > 0) || {}).n ?? null;
  // Punto de equilibrio (matrícula) en régimen (año 6)
  const f6 = Math.pow(1 + p.infl, 5), r6 = rows[5];
  const fijos = r6.docentes + r6.support + r6.otros;
  const varPs = (p.labEst + p.overheadEst) * f6;
  const revPs = (p.arancel0 * f6 + p.derecho0 * f6) * c;
  const be = revPs > varPs ? fijos / (revPs - varPs) : Infinity;
  return { rows, van, tir, payback, peAnio, be, fijos, varPs, revPs, docenteFull, factorCobranza: c, regimen: mats[mats.length - 1], nuevos };
}

// Escenarios canónicos (vista principal)
export function escenarios() {
  const base = { ...P, docenteFrac: 0 };
  const cons = { ...base, vac: 25, tasaMat: 0.75, ret1: 0.72, ret2: 0.80, arancel0: 4_200_000, labEst: 200_000, invInicial: 55_000_000 };
  const opt = { ...base, vac: 40, tasaMat: 0.92, ret1: 0.85, ret2: 0.86, arancel0: 5_000_000, labEst: 140_000 };
  return { cons: run(cons), base: run(base), opt: run(opt) };
}

// Barrido de resistencia: nuevos/año de 10 a 1 (vista principal)
export function resistencia() {
  const out = [];
  const runNuevos = (nuevos) => {
    const p = { ...P, docenteFrac: 0, vac: nuevos, tasaMat: 1 };
    return run(p);
  };
  for (let nu = 10; nu >= 1; nu--) {
    const r = runNuevos(nu);
    out.push({ nuevos: nu, regimen: r.regimen, res1: r.rows[0].resultado, resReg: r.rows[9].resultado, van: r.van });
  }
  // bisección de umbrales
  const vanOf = (nu) => runNuevos(nu).van;
  const regOf = (nu) => runNuevos(nu).rows[9].resultado;
  const cruce = (fn) => { let lo = 1, hi = 4; for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (fn(m) < 0) lo = m; else hi = m; } return (lo + hi) / 2; };
  return { tabla: out, vanCero: cruce(vanOf), regCero: cruce(regOf) };
}
