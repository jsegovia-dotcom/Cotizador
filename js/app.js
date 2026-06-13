/* ═══════════════════════════════════════════
   JASV COTIZACIONES — app.js
   Fase 1+2: Navegación, clientes, tipos de cotización
═══════════════════════════════════════════ */

// ─────────────────────────────────────────
// ESTADO GLOBAL
// ─────────────────────────────────────────
let state = {
  tipoActual: 'revision',
  config: {
    uf: 40610.69,
    year: '26',
    correlativo: 1,
    afpTasa: 0.1116,
    afpNombre: 'PlanVital',
    margenUtilidad: 55,
  }
};

// ─────────────────────────────────────────
// TEXTOS BASE POR TIPO
// ─────────────────────────────────────────
const TEXTOS_BASE = {
  revision: `El Servicio tiene por objetivo verificar que los proyectos de Remodelación o habilitación se desarrollen respetando las directrices generales de acuerdo al "Reglamento de Habilitación del Edificio".

Será responsabilidad de cada Habilitador el verificar el cumplimiento de su proyecto respecto a la Ordenanza General de Urbanismo y Construcción, por tanto, NO se incluye en la presente cotización.

El Servicio de Revisión/Validación de Arquitectura y especialidades será realizado por los especialistas de la empresa.`,

  'ito-full': `La Inspección Técnica de terreno durante la construcción, tiene por objetivo certificar la calidad de las obras y el cumplimiento de los aspectos técnicos y administrativos del contrato. El servicio tiene un enfoque preventivo.

El Servicio de Inspección Técnica de Obras, será realizada por un profesional de terreno con experiencia en proyectos de Edificación con dedicación exclusiva a la obra.`,

  'ito-part': `El Servicio de Inspección Técnica de Obra tiene por objetivos, verificar que los proyectos de Habilitación se desarrollen respetando las directrices generales de acuerdo al "Reglamento de Habilitación", las normas técnicas, el reglamento de Co-propiedad y adicionalmente apoyando y coordinando las gestiones entre el habilitador (Arrendatario) con la administración del edificio.

El Servicio de Inspección Técnica de Obra será realizado personalmente a través de 1 visita semanal (una) respectiva a la obra y coordinaciones no presenciales necesarias.`,

  otras: `Me es grato someter a su consideración una proposición de honorarios para los servicios de la referencia, los cuales serán realizados por los especialistas de la empresa.`,
};

// ─────────────────────────────────────────
// ITEMS BASE POR TIPO
// ─────────────────────────────────────────
const ITEMS_REVISION = [
  { label: 'Revisión de Proyecto de Arquitectura', uf: 10, incluido: true },
  { label: 'Revisión de Proyecto Eléctrico',       uf: 13, incluido: true },
  { label: 'Revisión de Proyecto Clima',            uf: 13, incluido: true },
  { label: 'Revisión de Proyecto Sanitario',        uf: 13, incluido: true },
  { label: 'Revisión de Proyecto Sensores Incendio',uf: 13, incluido: true },
];

const ITEMS_ITO_PART = [
  { label: 'ITO 1 visita semanal', uf: 48, unidad: '/mes', incluido: true },
  { label: 'ITO Eléctrico revisión condiciones iniciales y recepción de trabajos', uf: 10, unidad: '/visita', incluido: false },
];

const CONSIDERACIONES_BASE = {
  revision: [
    'No se incluye en estos honorarios, los trabajos especiales que hubiesen de encargarse, tales como otros servicios de especialistas salvo los expresamente indicados.',
    'El honorario presentado es a Suma Alzada.',
    'Los valores propuestos en la presente cotización son netos y la facturación de ellos será más IVA.',
    'Se considera 2 iteraciones de revisiones máximo por Arquitectura o especialidades. En caso de existir aún observaciones, la siguiente revisión será cobrada.',
  ],
  'ito-full': [
    'Esta cotización no es a suma alzada, por lo tanto, se presentan los costos mensuales. Se considera un mínimo de 2 meses de servicio.',
    'Se considera que la constructora instalará y mantendrá líneas de vida para la inspección segura de los trabajos.',
    'Se considera que la Constructora proveerá de las instalaciones provisorias de la oficina de ITO (escritorio, mesa, conexión internet, energía eléctrica, acceso a baño, agua potable).',
    'Se considera horario de trabajo diurno de lunes a viernes.',
    'No se incluye en estos honorarios los trabajos especiales que hubiesen de encargarse, tales como topografía, sondeos, ensayos de materiales u otros servicios de especialistas.',
    'La facturación es mes vencido (valores con IVA incluido).',
  ],
  'ito-part': [
    'No se incluye en estos honorarios, los trabajos especiales que hubiesen de encargarse, tales como otros servicios de especialistas salvo los expresamente indicados.',
    'El honorario presentado es mensual y no a Suma Alzada.',
    'Los valores propuestos en la presente cotización son netos. (Facturación servicio neto más IVA)',
    'Se consideran las visitas semanales en horario diurno.',
    'Se considera que el Cliente dispondrá durante el período en que se desarrolle la habilitación, de un estacionamiento para la ITO dentro del edificio para concretar la visita inspectiva semanal.',
  ],
  otras: [
    'No se incluye en estos honorarios, los trabajos especiales que hubiesen de encargarse u otros servicios de especialistas salvo los expresamente indicados.',
    'El honorario presentado es a Suma Alzada.',
    'Los valores propuestos en la presente cotización son netos y la facturación de ellos será más IVA.',
    'Esta oferta tiene una validez de 15 días contados desde su fecha de envío.',
  ],
};

// ─────────────────────────────────────────
// INIT
// ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  cargarConfig();
  actualizarCorrelativo();
  renderPanelTipo('revision');
  renderListaClientes();
  renderListaCotizaciones();
  // Mostrar barra desde el inicio (vista nueva es la activa)
  document.getElementById('actions-bar').classList.add('visible');
  actualizarBarraInfo();
});

// ─────────────────────────────────────────
// NAVEGACIÓN
// ─────────────────────────────────────────
function showView(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('view-' + viewId).classList.add('active');
  document.querySelector(`[data-view="${viewId}"]`).classList.add('active');

  // Mostrar barra fija solo en vista nueva cotización
  const barra = document.getElementById('actions-bar');
  if (viewId === 'nueva') {
    barra.classList.add('visible');
  } else {
    barra.classList.remove('visible');
  }

  if (viewId === 'guardadas') renderListaCotizaciones();
  if (viewId === 'clientes') renderListaClientes();
  if (viewId === 'config') cargarFormConfig();
}

// ─────────────────────────────────────────
// TIPO DE COTIZACIÓN
// ─────────────────────────────────────────
function selectTipo(tipo) {
  state.tipoActual = tipo;
  document.querySelectorAll('.tipo-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`[data-tipo="${tipo}"]`).classList.add('active');
  renderPanelTipo(tipo);
  actualizarBarraInfo();
}

const TIPO_LABEL_MAP = {
  'revision':  'Revisión de proyectos',
  'ito-full':  'ITO Full-time',
  'ito-part':  'ITO Part-time',
  'otras':     'Otros servicios',
};

function actualizarBarraInfo() {
  const tipoEl = document.getElementById('actions-tipo-label');
  const projEl = document.getElementById('actions-proyecto-label');
  if (tipoEl) tipoEl.textContent = TIPO_LABEL_MAP[state.tipoActual] || 'Nueva cotización';
  const nombre = document.getElementById('p-nombre')?.value?.trim();
  if (projEl) projEl.textContent = nombre || '';
}

// Actualizar nombre del proyecto en la barra al escribir
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('p-nombre')?.addEventListener('input', actualizarBarraInfo);
});

function renderPanelTipo(tipo) {
  const panel = document.getElementById('panel-tipo');
  if (tipo === 'revision')  panel.innerHTML = panelRevision();
  else if (tipo === 'ito-full') panel.innerHTML = panelItoFull();
  else if (tipo === 'ito-part') panel.innerHTML = panelItoPart();
  else panel.innerHTML = panelOtras();
  document.getElementById('actions-bar').style.display = 'flex';
}

// ─────────────────────────────────────────
// PANEL: REVISIÓN DE PROYECTOS
// ─────────────────────────────────────────
function panelRevision() {
  const items = ITEMS_REVISION.map((it, i) => `
    <tr>
      <td class="col-check"><input type="checkbox" ${it.incluido ? 'checked' : ''} id="rev-check-${i}" onchange="recalcRevision()"></td>
      <td><input type="text" value="${it.label}" id="rev-label-${i}" style="border:none;background:none;padding:4px 0;width:100%;font-size:13px;" onchange="recalcRevision()"></td>
      <td class="col-uf"><input type="number" value="${it.uf}" id="rev-uf-${i}" min="0" step="0.5" onchange="recalcRevision()"></td>
    </tr>
  `).join('');

  return `
    <div class="panel-section">
      <div class="panel-section-title">A. Descripción de servicios</div>
      <div class="texto-base-label">Texto introductorio (editable)</div>
      <textarea class="texto-base" id="txt-descripcion">${TEXTOS_BASE.revision}</textarea>
    </div>

    <div class="panel-section">
      <div class="panel-section-title">B. Honorarios</div>
      <table class="items-table">
        <thead><tr>
          <th class="col-check">✓</th>
          <th>Especialidad / Servicio</th>
          <th class="col-uf">UF Neto</th>
        </tr></thead>
        <tbody id="revision-items">${items}</tbody>
      </table>
      <div id="revision-total" style="margin-top:14px;"></div>
    </div>

    <div class="panel-section">
      <div class="panel-section-title">C. Consideraciones</div>
      <div id="consideraciones-list"></div>
    </div>
  `;

  setTimeout(recalcRevision, 0);
}

function recalcRevision() {
  let total = 0;
  ITEMS_REVISION.forEach((_, i) => {
    const chk = document.getElementById(`rev-check-${i}`);
    const uf  = document.getElementById(`rev-uf-${i}`);
    if (chk && chk.checked && uf) total += parseFloat(uf.value) || 0;
  });
  const iva = total * 0.19;
  const conIva = total + iva;
  const totalDiv = document.getElementById('revision-total');
  if (totalDiv) {
    totalDiv.innerHTML = `
      <table class="honorarios-table">
        <thead><tr><th>Descripción</th><th class="uf-val">UF</th></tr></thead>
        <tbody>
          <tr><td>Subtotal neto</td><td class="uf-val">${fmt(total)}</td></tr>
          <tr><td>IVA (19%)</td><td class="uf-val">${fmt(iva)}</td></tr>
        </tbody>
        <tfoot><tr class="total-row"><td>Total con IVA</td><td class="uf-val">${fmt(conIva)}</td></tr></tfoot>
      </table>`;
  }
  renderConsideraciones('revision');
}

// ─────────────────────────────────────────
// PANEL: ITO FULL-TIME
// ─────────────────────────────────────────
function panelItoFull() {
  return `
    <div class="panel-section">
      <div class="panel-section-title">A. Descripción de servicios</div>
      <div class="texto-base-label">Texto introductorio (editable)</div>
      <textarea class="texto-base" id="txt-descripcion">${TEXTOS_BASE['ito-full']}</textarea>
    </div>

    <div class="panel-section">
      <div class="panel-section-title">B. Cálculo de costo ITO — Parámetros del profesional</div>
      <div class="form-grid-3">
        <div class="form-group">
          <label>Sueldo líquido deseado ($)</label>
          <input type="number" id="ito-liquido" value="1200000" step="10000" oninput="calcularItoFull()">
        </div>
        <div class="form-group">
          <label>AFP</label>
          <select id="ito-afp" onchange="calcularItoFull()">
            <option value="0.1116" selected>PlanVital (11.16%)</option>
            <option value="0.1144">Capital / Cuprum (11.44%)</option>
            <option value="0.1127">Habitat (11.27%)</option>
            <option value="0.1145">ProVida (11.45%)</option>
            <option value="0.1058">Modelo (10.58%)</option>
            <option value="0.1046">Uno (10.46%)</option>
          </select>
        </div>
        <div class="form-group">
          <label>Meses estimados de obra</label>
          <input type="number" id="ito-meses" value="3" min="1" oninput="calcularItoFull()">
        </div>
      </div>
      <div class="divider"></div>
      <div class="panel-section-title">EPP y equipamiento (total por obra)</div>
      <div class="form-grid-3">
        <div class="form-group">
          <label>Casco ($)</label>
          <input type="number" id="ito-casco" value="15000" oninput="calcularItoFull()">
        </div>
        <div class="form-group">
          <label>Zapatos seguridad ($)</label>
          <input type="number" id="ito-zapatos" value="55000" oninput="calcularItoFull()">
        </div>
        <div class="form-group">
          <label>Antiparras ($)</label>
          <input type="number" id="ito-antiparras" value="5000" oninput="calcularItoFull()">
        </div>
        <div class="form-group">
          <label>Chaqueta / Chaleco ($)</label>
          <input type="number" id="ito-chaqueta" value="0" oninput="calcularItoFull()">
        </div>
        <div class="form-group">
          <label>Otros EPP ($)</label>
          <input type="number" id="ito-epp-otros" value="0" oninput="calcularItoFull()">
        </div>
      </div>
      <div class="divider"></div>
      <div class="panel-section-title">Viáticos y gastos de oficina (mensual)</div>
      <div class="form-grid-3">
        <div class="form-group">
          <label>Celular ($)</label>
          <input type="number" id="ito-celular" value="15000" oninput="calcularItoFull()">
        </div>
        <div class="form-group">
          <label>Pasajes / traslado ($)</label>
          <input type="number" id="ito-pasajes" value="0" oninput="calcularItoFull()">
        </div>
        <div class="form-group">
          <label>Alojamiento ($)</label>
          <input type="number" id="ito-alojamiento" value="0" oninput="calcularItoFull()">
        </div>
        <div class="form-group">
          <label>Alimentación ($)</label>
          <input type="number" id="ito-alimentacion" value="0" oninput="calcularItoFull()">
        </div>
        <div class="form-group">
          <label>Contabilidad ($)</label>
          <input type="number" id="ito-contabilidad" value="28427" oninput="calcularItoFull()">
        </div>
        <div class="form-group">
          <label>App / Software ($)</label>
          <input type="number" id="ito-app" value="10000" oninput="calcularItoFull()">
        </div>
      </div>
      <div class="divider"></div>
      <div class="form-grid-3">
        <div class="form-group">
          <label>Margen de utilidad (%)</label>
          <input type="number" id="ito-margen" value="${state.config.margenUtilidad}" min="0" max="200" oninput="calcularItoFull()">
        </div>
      </div>
      <div id="ito-resultado" style="margin-top:16px;"></div>
    </div>

    <div class="panel-section">
      <div class="panel-section-title">C. Consideraciones</div>
      <div id="consideraciones-list"></div>
    </div>
  `;
}

// Se llama desde setTimeout después de renderizar
function calcularItoFull() {
  const liquido      = parseFloat(document.getElementById('ito-liquido')?.value) || 1200000;
  const afpTasa      = parseFloat(document.getElementById('ito-afp')?.value) || 0.1116;
  const meses        = parseInt(document.getElementById('ito-meses')?.value) || 3;
  const margen       = parseFloat(document.getElementById('ito-margen')?.value) || 55;
  const uf           = state.config.uf;

  // ── Cargas previsionales Chile (Junio 2026)
  const SALUD        = 0.07;     // 7% trabajador
  const SIS          = 0.0162;   // tasa SIS empleador
  const MUTUAL       = 0.0093;   // mutual básica
  const CESANTIA_EMP = 0.024;    // seguro cesantía empleador plazo fijo
  const SEG_SOCIAL   = 0.009;    // seguro social
  const AFP_ADIC     = 0.001;    // AFP adicional empleador

  // Calcular sueldo bruto desde líquido
  // Descuentos trabajador: AFP + Salud + Impuesto
  // Recargo ≈ 0.3807 sobre líquido para llegar a bruto (simplificado, sin impuesto exacto)
  const RECARGO_BRUTO = afpTasa + SALUD + 0.013; // AFP + salud + impuesto estimado
  const bruto         = liquido / (1 - RECARGO_BRUTO);
  const totalImponible = bruto;

  // Cargas empleador
  const cMutual       = totalImponible * MUTUAL;
  const cSIS          = totalImponible * SIS;
  const cCesantia     = totalImponible * CESANTIA_EMP;
  const cSegSocial    = totalImponible * SEG_SOCIAL;
  const cAfpAdic      = totalImponible * AFP_ADIC;
  const totalCargas   = cMutual + cSIS + cCesantia + cSegSocial + cAfpAdic;

  const costoMensualBase = totalImponible + totalCargas;

  // Vacaciones prorrateadas (15 días hábiles / año = 1.25 días/mes)
  const vacaciones    = (bruto / 30) * 15 / 12;

  // EPP prorrateado en meses
  const casco    = (parseFloat(document.getElementById('ito-casco')?.value) || 0) / meses;
  const zapatos  = (parseFloat(document.getElementById('ito-zapatos')?.value) || 0) / meses;
  const antip    = (parseFloat(document.getElementById('ito-antiparras')?.value) || 0) / meses;
  const chaqueta = (parseFloat(document.getElementById('ito-chaqueta')?.value) || 0) / meses;
  const eppOtros = (parseFloat(document.getElementById('ito-epp-otros')?.value) || 0) / meses;
  const totalEPP = casco + zapatos + antip + chaqueta + eppOtros;

  // Viáticos y oficina (mensual)
  const celular      = parseFloat(document.getElementById('ito-celular')?.value) || 0;
  const pasajes      = parseFloat(document.getElementById('ito-pasajes')?.value) || 0;
  const alojamiento  = parseFloat(document.getElementById('ito-alojamiento')?.value) || 0;
  const alimentacion = parseFloat(document.getElementById('ito-alimentacion')?.value) || 0;
  const contabilidad = parseFloat(document.getElementById('ito-contabilidad')?.value) || 0;
  const app          = parseFloat(document.getElementById('ito-app')?.value) || 0;
  const totalViaticos = celular + pasajes + alojamiento + alimentacion + contabilidad + app;

  // Costo ITO mensual total
  const costoMensual = costoMensualBase + vacaciones + totalEPP + totalViaticos;
  const costoMensualUF = costoMensual / uf;

  // Precio venta
  const margenFactor = 1 + (margen / 100);
  const ventaNetaUF  = costoMensualUF * margenFactor;
  const ivaUF        = ventaNetaUF * 0.19;
  const totalConIva  = ventaNetaUF + ivaUF;

  const div = document.getElementById('ito-resultado');
  if (!div) return;
  div.innerHTML = `
    <table class="honorarios-table">
      <thead><tr><th>Componente</th><th class="uf-val">$/mes</th><th class="uf-val">UF/mes</th></tr></thead>
      <tbody>
        <tr><td>Sueldo líquido</td><td class="uf-val">${fmtCLP(liquido)}</td><td class="uf-val">${fmt(liquido/uf)}</td></tr>
        <tr><td>Sueldo bruto (imponible)</td><td class="uf-val">${fmtCLP(bruto)}</td><td class="uf-val">${fmt(bruto/uf)}</td></tr>
        <tr><td>Cargas empleador (mutual, SIS, cesantía, SS, AFP adic.)</td><td class="uf-val">${fmtCLP(totalCargas)}</td><td class="uf-val">${fmt(totalCargas/uf)}</td></tr>
        <tr><td>Vacaciones prorrateadas</td><td class="uf-val">${fmtCLP(vacaciones)}</td><td class="uf-val">${fmt(vacaciones/uf)}</td></tr>
        <tr><td>EPP prorrateado</td><td class="uf-val">${fmtCLP(totalEPP)}</td><td class="uf-val">${fmt(totalEPP/uf)}</td></tr>
        <tr><td>Viáticos y gastos de oficina</td><td class="uf-val">${fmtCLP(totalViaticos)}</td><td class="uf-val">${fmt(totalViaticos/uf)}</td></tr>
      </tbody>
      <tfoot>
        <tr class="total-row"><td><strong>Costo ITO mensual (${margen}% margen)</strong></td><td class="uf-val">${fmtCLP(costoMensual * margenFactor)}</td><td class="uf-val"><strong>${fmt(ventaNetaUF)} UF/mes neto</strong></td></tr>
        <tr class="total-row"><td>Con IVA (19%)</td><td></td><td class="uf-val"><strong>${fmt(totalConIva)} UF/mes</strong></td></tr>
      </tfoot>
    </table>
    <p style="font-size:11px;color:var(--gray-500);margin-top:8px;">UF al ${new Date().toLocaleDateString('es-CL')}: $${fmtCLP(uf)}. Los valores son referenciales.</p>
  `;
  renderConsideraciones('ito-full');
}

// ─────────────────────────────────────────
// PANEL: ITO PART-TIME
// ─────────────────────────────────────────
function panelItoPart() {
  const items = ITEMS_ITO_PART.map((it, i) => `
    <tr>
      <td class="col-check"><input type="checkbox" ${it.incluido ? 'checked' : ''} id="part-check-${i}" onchange="recalcPart()"></td>
      <td><input type="text" value="${it.label}" id="part-label-${i}" style="border:none;background:none;padding:4px 0;width:100%;font-size:13px;"></td>
      <td class="col-uf"><input type="number" value="${it.uf}" id="part-uf-${i}" min="0" step="0.5" onchange="recalcPart()"></td>
      <td style="width:90px;"><input type="text" value="${it.unidad}" id="part-unidad-${i}" style="border:1px solid var(--gray-200);font-size:12px;padding:4px 6px;border-radius:4px;width:100%;"></td>
    </tr>
  `).join('');

  return `
    <div class="panel-section">
      <div class="panel-section-title">A. Descripción de servicios</div>
      <div class="texto-base-label">Texto introductorio (editable)</div>
      <textarea class="texto-base" id="txt-descripcion">${TEXTOS_BASE['ito-part']}</textarea>
    </div>

    <div class="panel-section">
      <div class="panel-section-title">B. Honorarios</div>
      <table class="items-table">
        <thead><tr>
          <th class="col-check">✓</th>
          <th>Descripción</th>
          <th class="col-uf">UF Neto</th>
          <th style="width:90px;">Unidad</th>
        </tr></thead>
        <tbody>${items}</tbody>
      </table>
      <div style="margin-top:10px;">
        <button class="btn-secondary" onclick="agregarItemPart()" style="font-size:12px;padding:6px 12px;">+ Agregar ítem</button>
      </div>
      <div id="part-total" style="margin-top:14px;"></div>
    </div>

    <div class="panel-section">
      <div class="panel-section-title">C. Consideraciones</div>
      <div id="consideraciones-list"></div>
    </div>
  `;
}

let partItemsCount = ITEMS_ITO_PART.length;

function agregarItemPart() {
  const tbody = document.querySelector('.items-table tbody');
  const i = partItemsCount++;
  const tr = document.createElement('tr');
  tr.id = `part-row-${i}`;
  tr.innerHTML = `
    <td class="col-check"><input type="checkbox" checked id="part-check-${i}" onchange="recalcPart()"></td>
    <td><input type="text" value="Nuevo ítem" id="part-label-${i}" style="border:none;background:none;padding:4px 0;width:100%;font-size:13px;"></td>
    <td class="col-uf"><input type="number" value="0" id="part-uf-${i}" min="0" step="0.5" onchange="recalcPart()"></td>
    <td style="width:90px;"><input type="text" value="/mes" id="part-unidad-${i}" style="border:1px solid var(--gray-200);font-size:12px;padding:4px 6px;border-radius:4px;width:100%;"></td>
    <td class="col-del"><button class="btn-del-item" onclick="this.closest('tr').remove();recalcPart()">✕</button></td>
  `;
  tbody.appendChild(tr);
  recalcPart();
}

function recalcPart() {
  let rows = [];
  document.querySelectorAll('.items-table tbody tr').forEach((tr, i) => {
    const chk = tr.querySelector('input[type="checkbox"]');
    const uf  = tr.querySelector('input[type="number"]');
    const unidad = tr.querySelector('input[type="text"]:last-of-type');
    const label  = tr.querySelector('input[type="text"]:first-of-type');
    if (chk?.checked && uf) {
      rows.push({ label: label?.value || '', uf: parseFloat(uf.value)||0, unidad: unidad?.value || '' });
    }
  });
  const totalDiv = document.getElementById('part-total');
  if (!totalDiv) return;
  const tbodyRows = rows.map(r => `<tr><td>${r.label}</td><td class="uf-val">${fmt(r.uf)} UF${r.unidad}</td></tr>`).join('');
  totalDiv.innerHTML = `
    <table class="honorarios-table">
      <thead><tr><th>Descripción</th><th class="uf-val">Honorario</th></tr></thead>
      <tbody>${tbodyRows}</tbody>
    </table>`;
}

// ─────────────────────────────────────────
// PANEL: OTRAS
// ─────────────────────────────────────────
function panelOtras() {
  return `
    <div class="panel-section">
      <div class="panel-section-title">A. Descripción de servicios</div>
      <div class="texto-base-label">Texto introductorio (editable)</div>
      <textarea class="texto-base" id="txt-descripcion">${TEXTOS_BASE.otras}</textarea>
    </div>

    <div class="panel-section">
      <div class="panel-section-title">B. Honorarios</div>
      <table class="items-table">
        <thead><tr>
          <th class="col-check">✓</th>
          <th>Descripción del servicio</th>
          <th class="col-uf">UF Neto</th>
          <th style="width:90px;">Unidad</th>
          <th class="col-del"></th>
        </tr></thead>
        <tbody id="otras-items">
          <tr>
            <td class="col-check"><input type="checkbox" checked onchange="recalcOtras()"></td>
            <td><input type="text" value="Honorario profesional" style="border:none;background:none;padding:4px 0;width:100%;font-size:13px;" onchange="recalcOtras()"></td>
            <td class="col-uf"><input type="number" value="0" min="0" step="0.5" onchange="recalcOtras()"></td>
            <td style="width:90px;"><input type="text" value="global" style="border:1px solid var(--gray-200);font-size:12px;padding:4px 6px;border-radius:4px;width:100%;"></td>
            <td class="col-del"></td>
          </tr>
        </tbody>
      </table>
      <div style="margin-top:10px;">
        <button class="btn-secondary" onclick="agregarItemOtras()" style="font-size:12px;padding:6px 12px;">+ Agregar ítem</button>
      </div>
      <div id="otras-total" style="margin-top:14px;"></div>
    </div>

    <div class="panel-section">
      <div class="panel-section-title">C. Consideraciones</div>
      <div id="consideraciones-list"></div>
    </div>
  `;
}

function agregarItemOtras() {
  const tbody = document.getElementById('otras-items');
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td class="col-check"><input type="checkbox" checked onchange="recalcOtras()"></td>
    <td><input type="text" value="Nuevo servicio" style="border:none;background:none;padding:4px 0;width:100%;font-size:13px;" onchange="recalcOtras()"></td>
    <td class="col-uf"><input type="number" value="0" min="0" step="0.5" onchange="recalcOtras()"></td>
    <td style="width:90px;"><input type="text" value="global" style="border:1px solid var(--gray-200);font-size:12px;padding:4px 6px;border-radius:4px;width:100%;"></td>
    <td class="col-del"><button class="btn-del-item" onclick="this.closest('tr').remove();recalcOtras()">✕</button></td>
  `;
  tbody.appendChild(tr);
  recalcOtras();
}

function recalcOtras() {
  let total = 0;
  document.querySelectorAll('#otras-items tr').forEach(tr => {
    const chk = tr.querySelector('input[type="checkbox"]');
    const uf  = tr.querySelector('input[type="number"]');
    if (chk?.checked && uf) total += parseFloat(uf.value)||0;
  });
  const iva = total * 0.19;
  const div = document.getElementById('otras-total');
  if (!div) return;
  div.innerHTML = `
    <table class="honorarios-table">
      <thead><tr><th>Descripción</th><th class="uf-val">UF</th></tr></thead>
      <tbody>
        <tr><td>Subtotal neto</td><td class="uf-val">${fmt(total)}</td></tr>
        <tr><td>IVA (19%)</td><td class="uf-val">${fmt(iva)}</td></tr>
      </tbody>
      <tfoot><tr class="total-row"><td>Total con IVA</td><td class="uf-val">${fmt(total + iva)}</td></tr></tfoot>
    </table>`;
  renderConsideraciones('otras');
}

// ─────────────────────────────────────────
// CONSIDERACIONES
// ─────────────────────────────────────────
function renderConsideraciones(tipo) {
  const container = document.getElementById('consideraciones-list');
  if (!container) return;
  const items = CONSIDERACIONES_BASE[tipo] || [];
  container.innerHTML = items.map((txt, i) => `
    <div class="consideracion-item">
      <span style="font-size:12px;color:var(--gray-500);min-width:20px;font-weight:600;">${i+1}.</span>
      <textarea class="consideracion-txt" rows="2" style="flex:1;min-height:auto;resize:vertical;padding:5px 8px;font-size:13px;line-height:1.5;">${txt}</textarea>
      <button class="btn-del-item" onclick="this.closest('.consideracion-item').remove()" title="Eliminar">✕</button>
    </div>
  `).join('') + `
    <button class="btn-secondary" style="font-size:12px;padding:6px 12px;margin-top:8px;" onclick="agregarConsideracion()">+ Agregar consideración</button>
  `;
}

function agregarConsideracion() {
  const container = document.getElementById('consideraciones-list');
  const btn = container.querySelector('button:last-child');
  const div = document.createElement('div');
  div.className = 'consideracion-item';
  const num = container.querySelectorAll('.consideracion-item').length + 1;
  div.innerHTML = `
    <span style="font-size:12px;color:var(--gray-500);min-width:20px;font-weight:600;">${num}.</span>
    <textarea class="consideracion-txt" rows="2" style="flex:1;min-height:auto;resize:vertical;padding:5px 8px;font-size:13px;line-height:1.5;"></textarea>
    <button class="btn-del-item" onclick="this.closest('.consideracion-item').remove()">✕</button>
  `;
  container.insertBefore(div, btn);
}

// ─────────────────────────────────────────
// BASE DE DATOS — CLIENTES
// ─────────────────────────────────────────
function getClientes() {
  return JSON.parse(localStorage.getItem('jasv_clientes') || '[]');
}
function saveClientes(clientes) {
  localStorage.setItem('jasv_clientes', JSON.stringify(clientes));
}

function openClienteModal(id = null) {
  document.getElementById('modal-cliente').classList.add('open');
  document.getElementById('mc-id').value = id || '';
  if (id) {
    const c = getClientes().find(x => x.id === id);
    if (c) {
      document.getElementById('mc-empresa').value  = c.empresa  || '';
      document.getElementById('mc-nombre').value   = c.nombre   || '';
      document.getElementById('mc-cargo').value    = c.cargo    || '';
      document.getElementById('mc-email').value    = c.email    || '';
      document.getElementById('mc-telefono').value = c.telefono || '';
      document.getElementById('modal-cliente-title').textContent = 'Editar cliente';
    }
  } else {
    ['mc-empresa','mc-nombre','mc-cargo','mc-email','mc-telefono'].forEach(id => {
      document.getElementById(id).value = '';
    });
    document.getElementById('modal-cliente-title').textContent = 'Nuevo cliente';
  }
}

function closeClienteModal(event, force = false) {
  if (force || !event || event.target === document.getElementById('modal-cliente')) {
    document.getElementById('modal-cliente').classList.remove('open');
  }
}

function guardarCliente() {
  const empresa = document.getElementById('mc-empresa').value.trim();
  const nombre  = document.getElementById('mc-nombre').value.trim();
  if (!empresa || !nombre) { toast('Empresa y nombre son obligatorios', 'error'); return; }

  const clientes = getClientes();
  const id = document.getElementById('mc-id').value;

  if (id) {
    const idx = clientes.findIndex(x => x.id === id);
    if (idx >= 0) clientes[idx] = { ...clientes[idx], empresa, nombre,
      cargo:    document.getElementById('mc-cargo').value.trim(),
      email:    document.getElementById('mc-email').value.trim(),
      telefono: document.getElementById('mc-telefono').value.trim(),
    };
  } else {
    clientes.push({
      id: Date.now().toString(),
      empresa, nombre,
      cargo:    document.getElementById('mc-cargo').value.trim(),
      email:    document.getElementById('mc-email').value.trim(),
      telefono: document.getElementById('mc-telefono').value.trim(),
      fechaCreacion: new Date().toISOString(),
    });
  }
  saveClientes(clientes);
  closeClienteModal(null, true);
  renderListaClientes();
  toast('Cliente guardado', 'success');
}

function guardarClienteDesdeForm() {
  const empresa = document.getElementById('c-empresa').value.trim();
  const nombre  = document.getElementById('c-nombre').value.trim();
  if (!empresa || !nombre) { toast('Ingrese empresa y nombre', 'error'); return; }

  const clientes = getClientes();
  const existe = clientes.find(c => c.nombre.toLowerCase() === nombre.toLowerCase() && c.empresa.toLowerCase() === empresa.toLowerCase());
  if (existe) { toast('Cliente ya existe', 'error'); return; }

  clientes.push({
    id: Date.now().toString(),
    empresa, nombre,
    cargo:    document.getElementById('c-cargo').value.trim(),
    email:    document.getElementById('c-email').value.trim(),
    telefono: document.getElementById('c-telefono').value.trim(),
    fechaCreacion: new Date().toISOString(),
  });
  saveClientes(clientes);
  renderListaClientes();
  toast('Cliente guardado en la base de datos', 'success');
}

function eliminarCliente(id) {
  if (!confirm('¿Eliminar este cliente?')) return;
  saveClientes(getClientes().filter(c => c.id !== id));
  renderListaClientes();
  toast('Cliente eliminado');
}

function renderListaClientes(filtro = '') {
  const container = document.getElementById('lista-clientes');
  if (!container) return;
  let clientes = getClientes();
  if (filtro) clientes = clientes.filter(c =>
    c.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    c.empresa.toLowerCase().includes(filtro.toLowerCase())
  );

  if (!clientes.length) {
    container.innerHTML = `<div class="empty-state">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
      <p>${filtro ? 'Sin resultados' : 'No hay clientes registrados'}</p>
    </div>`;
    return;
  }

  container.innerHTML = clientes.map(c => `
    <div class="cliente-card">
      <div class="cliente-info">
        <div class="cliente-empresa">${c.empresa}</div>
        <div class="cliente-nombre">${c.nombre}${c.cargo ? ' — ' + c.cargo : ''}</div>
        <div class="cliente-meta">${[c.email, c.telefono].filter(Boolean).join(' · ')}</div>
      </div>
      <div class="cliente-actions">
        <button class="btn-icon" onclick="usarClienteEnForm('${c.id}')">Usar</button>
        <button class="btn-icon" onclick="openClienteModal('${c.id}')">Editar</button>
        <button class="btn-icon" onclick="eliminarCliente('${c.id}')">Eliminar</button>
      </div>
    </div>
  `).join('');
}

function filtrarClientes(val) { renderListaClientes(val); }

function usarClienteEnForm(id) {
  const c = getClientes().find(x => x.id === id);
  if (!c) return;
  document.getElementById('c-nombre').value   = c.nombre   || '';
  document.getElementById('c-empresa').value  = c.empresa  || '';
  document.getElementById('c-cargo').value    = c.cargo    || '';
  document.getElementById('c-email').value    = c.email    || '';
  document.getElementById('c-telefono').value = c.telefono || '';
  showView('nueva');
  toast('Cliente cargado');
}

// Autocomplete
function buscarClienteAuto(val) {
  const lista = document.getElementById('autocomplete-clientes');
  if (!val || val.length < 2) { lista.classList.remove('open'); return; }
  const matches = getClientes().filter(c =>
    c.nombre.toLowerCase().includes(val.toLowerCase()) ||
    c.empresa.toLowerCase().includes(val.toLowerCase())
  ).slice(0, 6);

  if (!matches.length) { lista.classList.remove('open'); return; }
  lista.innerHTML = matches.map(c => `
    <div class="autocomplete-item" onclick="usarClienteEnForm('${c.id}')">
      <div>${c.nombre}</div>
      <div class="sub">${c.empresa}</div>
    </div>
  `).join('');
  lista.classList.add('open');
}

document.addEventListener('click', e => {
  if (!e.target.closest('#c-nombre')) {
    document.getElementById('autocomplete-clientes')?.classList.remove('open');
  }
});

// ─────────────────────────────────────────
// COTIZACIONES GUARDADAS
// ─────────────────────────────────────────
function getCotizaciones() {
  return JSON.parse(localStorage.getItem('jasv_cotizaciones') || '[]');
}
function saveCotizaciones(cots) {
  localStorage.setItem('jasv_cotizaciones', JSON.stringify(cots));
}

function guardarBorrador() {
  const nombre = document.getElementById('p-nombre')?.value?.trim();
  if (!nombre) { toast('Ingrese el nombre del proyecto', 'error'); return; }

  const datos = recopilarDatosFormulario();
  const cots  = getCotizaciones();
  const idx   = cots.findIndex(c => c.correlativo === datos.correlativo);

  if (idx >= 0) {
    cots[idx] = { ...cots[idx], ...datos, fechaModificacion: new Date().toISOString() };
    toast('Borrador actualizado', 'success');
  } else {
    cots.unshift({ ...datos, id: Date.now().toString(), fechaCreacion: new Date().toISOString() });
    avanzarCorrelativo();
    toast('Borrador guardado', 'success');
  }
  saveCotizaciones(cots);
}

function recopilarDatosFormulario() {
  return {
    correlativo:  document.getElementById('correlativo-badge').textContent.trim(),
    tipo:         state.tipoActual,
    cliente: {
      tratamiento: document.getElementById('c-tratamiento')?.value || '',
      nombre:      document.getElementById('c-nombre')?.value || '',
      cargo:       document.getElementById('c-cargo')?.value || '',
      empresa:     document.getElementById('c-empresa')?.value || '',
      email:       document.getElementById('c-email')?.value || '',
      telefono:    document.getElementById('c-telefono')?.value || '',
    },
    proyecto: {
      nombre:      document.getElementById('p-nombre')?.value || '',
      direccion:   document.getElementById('p-direccion')?.value || '',
      comuna:      document.getElementById('p-comuna')?.value || '',
      edificio:    document.getElementById('p-edificio')?.value || '',
      piso:        document.getElementById('p-piso')?.value || '',
      superficie:  document.getElementById('p-superficie')?.value || '',
      descripcion: document.getElementById('p-descripcion')?.value || '',
    },
    descripcion: document.getElementById('txt-descripcion')?.value || '',
  };
}

function renderListaCotizaciones(filtro = '') {
  const container = document.getElementById('lista-cotizaciones');
  if (!container) return;
  let cots = getCotizaciones();
  if (filtro) cots = cots.filter(c =>
    c.proyecto?.nombre?.toLowerCase().includes(filtro.toLowerCase()) ||
    c.cliente?.empresa?.toLowerCase().includes(filtro.toLowerCase()) ||
    c.correlativo?.toLowerCase().includes(filtro.toLowerCase())
  );

  if (!cots.length) {
    container.innerHTML = `<div class="empty-state">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>
      <p>${filtro ? 'Sin resultados' : 'No hay cotizaciones guardadas'}</p>
      ${!filtro ? '<button class="btn-primary" onclick="showView(\'nueva\')">Nueva cotización</button>' : ''}
    </div>`;
    return;
  }

  const TIPO_LABEL = {
    'revision': 'Revisión proyectos',
    'ito-full': 'ITO Full-time',
    'ito-part': 'ITO Part-time',
    'otras':    'Otros servicios',
  };

  container.innerHTML = cots.map(c => `
    <div class="cot-list-item">
      <div class="cot-info">
        <div class="cot-correlativo">${c.correlativo}</div>
        <div class="cot-nombre">${c.proyecto?.nombre || 'Sin nombre'}</div>
        <div class="cot-meta">${c.cliente?.empresa || ''} · ${c.fechaCreacion ? new Date(c.fechaCreacion).toLocaleDateString('es-CL') : ''}</div>
      </div>
      <div style="margin:0 16px;">
        <span class="cot-tipo-badge badge-${c.tipo}">${TIPO_LABEL[c.tipo] || c.tipo}</span>
      </div>
      <div class="cot-actions">
        <button class="btn-icon" onclick="generarPDFCotizacion('${c.id}')">PDF</button>
        <button class="btn-icon" onclick="eliminarCotizacion('${c.id}')">Eliminar</button>
      </div>
    </div>
  `).join('');
}

function filtrarCotizaciones(val) { renderListaCotizaciones(val); }

function eliminarCotizacion(id) {
  if (!confirm('¿Eliminar esta cotización?')) return;
  saveCotizaciones(getCotizaciones().filter(c => c.id !== id));
  renderListaCotizaciones();
  toast('Cotización eliminada');
}

// ─────────────────────────────────────────
// CORRELATIVO
// ─────────────────────────────────────────
function actualizarCorrelativo() {
  const cfg  = state.config;
  const num  = String(cfg.correlativo).padStart(4, '0');
  const year = cfg.year;
  document.getElementById('num-correlativo').textContent = num;
  document.getElementById('correlativo-badge').textContent = `JASV_${num}/${year}/V01`;
}

function avanzarCorrelativo() {
  state.config.correlativo++;
  guardarConfig(true);
  actualizarCorrelativo();
}

// ─────────────────────────────────────────
// CONFIGURACIÓN
// ─────────────────────────────────────────
function cargarConfig() {
  const saved = JSON.parse(localStorage.getItem('jasv_config') || 'null');
  if (saved) state.config = { ...state.config, ...saved };
  document.getElementById('uf-val').textContent = state.config.uf.toFixed(2);
  actualizarCorrelativo();
}

function cargarFormConfig() {
  document.getElementById('cfg-uf').value          = state.config.uf;
  document.getElementById('cfg-year').value        = state.config.year;
  document.getElementById('cfg-correlativo').value = state.config.correlativo;
  document.getElementById('cfg-margen').value      = state.config.margenUtilidad;
  document.getElementById('cfg-afp').value         = state.config.afpTasa;
}

function guardarConfig(silencioso = false) {
  const uf   = parseFloat(document.getElementById('cfg-uf')?.value) || state.config.uf;
  const year = document.getElementById('cfg-year')?.value || state.config.year;
  const corr = parseInt(document.getElementById('cfg-correlativo')?.value) || state.config.correlativo;
  const margen = parseFloat(document.getElementById('cfg-margen')?.value) || state.config.margenUtilidad;
  const afpTasa = parseFloat(document.getElementById('cfg-afp')?.value) || state.config.afpTasa;

  state.config = { ...state.config, uf, year, correlativo: corr, margenUtilidad: margen, afpTasa };
  localStorage.setItem('jasv_config', JSON.stringify(state.config));
  document.getElementById('uf-val').textContent = uf.toFixed(2);
  actualizarCorrelativo();
  if (!silencioso) toast('Configuración guardada', 'success');
}

// ─────────────────────────────────────────
// EXPORTAR / IMPORTAR
// ─────────────────────────────────────────
function exportarDatos() {
  const datos = {
    version: '1.0',
    exportado: new Date().toISOString(),
    config: state.config,
    clientes: getClientes(),
    cotizaciones: getCotizaciones(),
  };
  const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `jasv-backup-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  toast('Datos exportados', 'success');
}

function importarDatos(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const datos = JSON.parse(e.target.result);
      if (datos.clientes)     localStorage.setItem('jasv_clientes',     JSON.stringify(datos.clientes));
      if (datos.cotizaciones) localStorage.setItem('jasv_cotizaciones', JSON.stringify(datos.cotizaciones));
      if (datos.config)       { state.config = { ...state.config, ...datos.config }; localStorage.setItem('jasv_config', JSON.stringify(state.config)); }
      cargarConfig();
      toast('Datos importados correctamente', 'success');
    } catch {
      toast('Error al leer el archivo JSON', 'error');
    }
  };
  reader.readAsText(file);
  input.value = '';
}

// ─────────────────────────────────────────
// PDF (Placeholder — Fase 4)
// ─────────────────────────────────────────
function generarPDF() {
  const nombre = document.getElementById('p-nombre')?.value?.trim();
  if (!nombre) { toast('Complete el nombre del proyecto', 'error'); return; }
  guardarBorrador();
  toast('Generación de PDF disponible en Fase 4', 'success');
  // En Fase 4 se implementará con jsPDF
}

function generarPDFCotizacion(id) {
  toast('Generación de PDF disponible en Fase 4');
}

// ─────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────
function fmt(n) {
  return (Math.round(n * 100) / 100).toFixed(2);
}

function fmtCLP(n) {
  return Math.round(n).toLocaleString('es-CL');
}

function toast(msg, tipo = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show' + (tipo ? ' ' + tipo : '');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// Trigger para recalc después de render dinámico
const _origRender = renderPanelTipo;
function renderPanelTipo(tipo) {
  _origRender(tipo);
  setTimeout(() => {
    if (tipo === 'revision')  recalcRevision();
    if (tipo === 'ito-full')  calcularItoFull();
    if (tipo === 'ito-part')  recalcPart();
    if (tipo === 'otras')     recalcOtras();
  }, 50);
}
