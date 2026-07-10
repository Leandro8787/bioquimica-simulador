// Datos reales usados en el modelo (con fuentes)

export const parametros = [
  ['Horizonte de evaluación', '10 años', 'Malla de 10 semestres'],
  ['Tasa de descuento', '8% anual', 'Estándar institucional'],
  ['Reajuste anual (arancel y costos)', '3,5%', 'Referencia IPC / sector'],
  ['Vacantes · matriculación (base)', '35 · 85% ≈ 30 nuevos/año', 'Propuesta de la carrera'],
  ['Retención', '80% año 1 · 83% siguientes', 'Promedio de carreras de ciencias exactas'],
  ['Arancel · derecho básico', '$4.500.000 · $150.000', 'Posicionamiento entre UVM y PUCV'],
  ['Factor de cobranza', '0,9885', '65% gratuidad + 12% becas + 23% pago directo, 5% morosidad'],
  ['Costo docente (vista principal)', '$0 incremental', 'Planta ya existente (16 académicos/as)'],
  ['Soporte', 'Coord. $12M + técnico $9M (×1,5 año 3) + bioseg. $6M', 'Presupuesto real Q&F'],
  ['Laboratorio (reactivos)', '$160.000 / estudiante / año', 'Precios reales de proveedores nacionales'],
  ['Overhead (indirectos)', '$700.000 / estudiante / año', 'Referencial per cápita'],
  ['Inversión inicial', '$14.700.000', 'Equipamiento casi completo + Western Blot'],
];

// Muestra de remuneraciones reales (planillas de remuneraciones, mayo 2026)
export const remuneraciones = [
  ['Académico/a 1', 'Contrata', 'Jornada completa', '$4.189.966'],
  ['Académico/a 2', 'Contrata', 'Jornada completa', '$3.587.370'],
  ['Académico/a 3', 'Contrata', 'Dirección de Carrera', '$3.814.965'],
  ['Académico/a 4', 'Contrata', 'Jornada completa', '$3.096.616'],
  ['Académico/a 5', 'Contrata', 'Jornada completa', '$2.924.557'],
  ['Académico/a 6', 'Contrata', 'Jornada completa', '$2.613.476'],
  ['Académico/a 7', 'Contrata', 'Jornada completa', '$2.422.107'],
  ['Académico/a 8', 'Planta', 'Dirección General de Investigación', '$4.024.533'],
  ['Académico/a 9', 'Planta', 'Dirección General de Centro', '$4.331.538'],
  ['Académico/a 10', 'Planta', 'Jornada completa', '$3.961.627'],
];

// Precios reales de reactivos e insumos (proveedores nacionales, 2026)
export const reactivos = [
  ['Taq polimerasa 500 U (con buffer, dNTPs)', '$39.500', 'TAAG-ls', 'https://taag-ls.cl/products/adn-polimerasa-taq-500u'],
  ['Kit extracción ADN genómico (50 preps)', '$138.500', 'Gene X-Press', 'https://genexpress.cl/producto/e-z-n-a-tissue-dna-kit'],
  ['GelRed — tinción de ADN', '$152.000', 'Gene X-Press', 'https://genexpress.cl/producto/gelred-nucleic-acid-gel-stain-10000x-no-toxico'],
  ['Enzimas de restricción (EcoRI/HindIII/BamHI)', '$99.000 c/u', 'Gene X-Press', 'https://genexpress.cl/producto/eco-r-i'],
  ['Agar nutritivo granulado 500 g', '$151.827', 'Prodelab', 'https://prodelab.cl/productos/insumos-laboratorio/reactivos/agar-nutritivo-granulado-500-g'],
  ['Agar Mueller Hinton II 500 g', '$169.932', 'Prodelab', 'https://prodelab.cl/productos/insumos-laboratorio/reactivos/agar-mueller-hinton-ii'],
  ['Kit de tinción de Gram (100 mL)', '$37.684', 'Bioquimica.cl', 'https://bioquimica.cl/producto/kit-de-tincion-gram-100-ml'],
  ['Guantes de nitrilo (caja 100)', '$8.072', 'Prodelab', 'https://prodelab.cl/productos/insumos-laboratorio/proteccion-personal-insumos-laboratorio/guantes-de-nitrilo-talla-m-caja-100-unidades'],
];

// Aranceles de referencia (2026)
export const aranceles = [
  ['UC — P. U. Católica', 'Privada CRUCH · Santiago', '$7.440.000'],
  ['UACh — Austral', 'Estatal CRUCH · Valdivia', '$6.825.000'],
  ['U. de Chile', 'Estatal CRUCH · Santiago', '$6.564.700'],
  ['USACH', 'Estatal CRUCH · Santiago', '$5.982.000'],
  ['PUCV', 'Privada CRUCH · Valparaíso', '$5.665.000'],
  ['UVM — Viña del Mar', 'Privada · Viña del Mar', '$4.686.000'],
  ['Bioquímica (propuesta)', 'Estatal CRUCH', '$4.500.000'],
  ['Pedagogías de referencia (Física, Biología)', 'Estatal CRUCH', '$3.780.000'],
];

export const fuentes = [
  ['Remuneraciones', 'Planillas de remuneraciones — Planta y Contrata (mayo 2026)'],
  ['Costos de operación', 'Presupuesto real de la carrera de Química y Farmacia (misma Facultad)'],
  ['Malla curricular', 'Plan Formativo 2027 — 30 de junio de 2026'],
  ['Aranceles de referencia', 'Sitios de admisión de cada universidad'],
  ['Precios de reactivos', 'Distribuidores nacionales (Gene X-Press, TAAG-ls, Prodelab, Bioquimica.cl)'],
];
