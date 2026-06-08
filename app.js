const DATA_PATH = './data/';
const CSV_FILES = {
  contratos: DATA_PATH + 'contratos_macro.csv',
  wifi: DATA_PATH + 'wifi.csv',
  kpi: DATA_PATH + 'kpi_sobressalente.csv',
  surplusUF: DATA_PATH + 'sobressalente_uf.csv',
  surplusCarteira: DATA_PATH + 'sobressalente_carteira.csv',
  surplusMes: DATA_PATH + 'sobressalente_mes.csv'
};

let DATA = [];
let MONTHS = [];
let SURPLUS_TOTAL = 0;
let WIFI_DATA = [];
let SURPLUS_UF = [];
let SURPLUS_CARTEIRA = [];
let SURPLUS_MONTH = [];

const $ = (id) => document.getElementById(id);
const fmt = new Intl.NumberFormat('pt-BR');
const pct = (v, t) => t ? (v / t * 100).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%' : '0,0%';

function cacheBuster(url) {
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}v=${Date.now()}`;
}

function parseNumber(value) {
  if (value === null || value === undefined) return 0;
  const text = String(value).trim();
  if (text === '') return 0;
  const normalized = text.replace(/\./g, '').replace(',', '.');
  const number = Number(normalized);
  return Number.isFinite(number) ? number : 0;
}

function parseCSV(text, delimiter = ';') {
  const cleanText = text.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
  if (!cleanText) return [];

  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const next = cleanText[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        field += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      row.push(field);
      field = '';
    } else if (char === '\n' && !inQuotes) {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }

  row.push(field);
  rows.push(row);

  const headers = rows.shift().map(h => h.trim());
  return rows
    .filter(r => r.some(c => String(c).trim() !== ''))
    .map(r => Object.fromEntries(headers.map((h, idx) => [h, (r[idx] ?? '').trim()])));
}

async function carregarCSV(url) {
  const response = await fetch(cacheBuster(url));
  if (!response.ok) {
    throw new Error(`Erro ao carregar ${url}: ${response.status} ${response.statusText}`);
  }
  const text = await response.text();
  return parseCSV(text, ';');
}

function unique(arr) {
  return [...new Set(arr)].sort();
}

function sum(arr) {
  return arr.reduce((a, b) => a + b, 0);
}

function groupBy(rows, keyFn, valueFn = r => r.total) {
  const map = new Map();
  rows.forEach(row => {
    const key = keyFn(row);
    map.set(key, (map.get(key) || 0) + valueFn(row));
  });
  return [...map.entries()]
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total);
}

function filtered() {
  const tipo = $('fTipo').value;
  const estado = $('fEstado').value;
  const carteira = $('fCarteira').value;

  return DATA.filter(row =>
    (!tipo || row.tipo_desconexao === tipo) &&
    (!estado || row.estado === estado) &&
    (!carteira || row.descricao === carteira)
  );
}

function fillFilters() {
  const filterMap = [
    ['fTipo', 'tipo_desconexao'],
    ['fEstado', 'estado'],
    ['fCarteira', 'descricao']
  ];

  filterMap.forEach(([id, key]) => {
    const select = $(id);
    const currentValue = select.value;
    select.querySelectorAll('option:not([value=""])').forEach(option => option.remove());

    unique(DATA.map(row => row[key]).filter(Boolean)).forEach(value => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });

    select.value = currentValue;
  });
}

function barChart(element, items, className = '') {
  const max = Math.max(...items.map(item => item.total), 1);
  element.innerHTML = items.map(item => `
    <div class="bar-row">
      <div class="bar-label" title="${item.name}">${item.name}</div>
      <div class="bar-track">
        <div class="bar ${className}" style="width:${(item.total / max * 100).toFixed(1)}%"></div>
      </div>
      <div class="bar-value">${fmt.format(item.total)}</div>
    </div>
  `).join('');
}

function pieChart(pieElement, legendElement, items, colors = ['var(--red)', 'var(--cyan)', 'var(--green)', 'var(--yellow)']) {
  const total = sum(items.map(item => item.total));
  let start = 0;

  const gradient = items.map((item, index) => {
    const degrees = total ? (item.total / total) * 360 : 0;
    const color = colors[index % colors.length];
    const part = `${color} ${start.toFixed(2)}deg ${(start + degrees).toFixed(2)}deg`;
    start += degrees;
    return part;
  }).join(', ');

  pieElement.style.background = `conic-gradient(${gradient})`;
  pieElement.innerHTML = `<div class="pie-center"><strong>${fmt.format(total)}</strong><span>Total</span></div>`;

  legendElement.innerHTML = items.map((item, index) => `
    <div class="legend-item">
      <span class="legend-dot" style="background:${colors[index % colors.length]}"></span>
      <span class="legend-name">${item.name}</span>
      <span class="legend-value"><strong>${fmt.format(item.total)}</strong><small>${pct(item.total, total)}</small></span>
    </div>
  `).join('');
}

function render() {
  const rows = filtered();
  const total = sum(rows.map(row => row.total));
  const byUF = groupBy(rows, row => row.estado);
  const byCarteira = groupBy(rows, row => row.descricao);
  const byTipo = groupBy(rows, row => row.tipo_desconexao);
  const byMonth = MONTHS.map(month => ({
    name: month.name,
    total: sum(rows.filter(row => row.mes === month.name).map(row => row.total))
  }));
  const spAzza = sum(rows.filter(row => row.estado === 'SP' && row.descricao === 'AZZA').map(row => row.total));

  $('kpiTotal').textContent = fmt.format(total);
  $('kpiSurplus').textContent = fmt.format(SURPLUS_TOTAL);
  $('kpiUF').textContent = SURPLUS_UF[0]?.name || '-';
  $('kpiUFSub').textContent = SURPLUS_UF[0]
    ? `${fmt.format(SURPLUS_UF[0].total)} sobressalentes · ${pct(SURPLUS_UF[0].total, SURPLUS_TOTAL)}`
    : '-';
  $('kpiCarteira').textContent = SURPLUS_CARTEIRA[0]?.name || '-';
  $('kpiCarteiraSub').textContent = SURPLUS_CARTEIRA[0]
    ? `${fmt.format(SURPLUS_CARTEIRA[0].total)} sobressalentes · ${pct(SURPLUS_CARTEIRA[0].total, SURPLUS_TOTAL)}`
    : '-';
  $('kpiSpAzza').textContent = fmt.format(spAzza);
  $('kpiSpAzzaSub').textContent = `${pct(spAzza, total)} dos contratos críticos`;

  barChart($('monthlyChart'), byMonth, 'green');
  pieChart($('tipoPie'), $('tipoLegend'), byTipo, ['var(--red)', 'var(--cyan)']);
  pieChart($('wifiPie'), $('wifiLegend'), WIFI_DATA, ['var(--blue)', 'var(--green)', 'var(--yellow)']);
  barChart($('surplusMonthChart'), SURPLUS_MONTH, 'red');
  barChart($('surplusUfChart'), SURPLUS_UF, 'red');
  barChart($('surplusCarteiraChart'), SURPLUS_CARTEIRA, 'red');
  barChart($('ufChart'), byUF.slice(0, 10));
  barChart($('carteiraChart'), byCarteira.slice(0, 10));

  const ranked = [...rows]
    .sort((a, b) => b.total - a.total)
    .slice(0, 12);

  $('topTable').querySelector('tbody').innerHTML = ranked.map((row, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${row.tipo_desconexao}</td>
      <td>${row.estado}</td>
      <td><strong>${row.descricao}</strong></td>
      ${MONTHS.map(month => `<td class="num">${fmt.format(row.monthValues[month.name] || 0)}</td>`).join('')}
      <td class="num"><strong>${fmt.format(row.total)}</strong></td>
      <td class="num">${pct(row.total, total)}</td>
    </tr>
  `).join('');

  const wifiTotal = sum(WIFI_DATA.map(item => item.total));
  const wifiTop = [...WIFI_DATA].sort((a, b) => b.total - a.total)[0] || { name: '-', total: 0 };
  const surplusTopMonth = [...SURPLUS_MONTH].sort((a, b) => b.total - a.total)[0] || { name: '-', total: 0 };
  const firstMonth = SURPLUS_MONTH[0] || { name: '-', total: 0 };
  const lastMonth = SURPLUS_MONTH[SURPLUS_MONTH.length - 1] || { name: '-', total: 0 };
  const surplusGrowth = firstMonth.total ? ((lastMonth.total - firstMonth.total) / firstMonth.total * 100) : 0;

  $('insightList').innerHTML = `
    <li><span class="badge">Sobressalente</span> O volume sobressalente total é <strong>${fmt.format(SURPLUS_TOTAL)}</strong> equipamentos, considerando o excedente acima de 1 ONT/ONU por contrato.</li>
    <li><span class="badge">UF crítica</span> A UF mais crítica por sobressalente é <strong>${SURPLUS_UF[0]?.name || '-'}</strong>, com <strong>${fmt.format(SURPLUS_UF[0]?.total || 0)}</strong> equipamentos excedentes, representando <strong>${pct(SURPLUS_UF[0]?.total || 0, SURPLUS_TOTAL)}</strong> do sobressalente total.</li>
    <li><span class="badge">Carteira</span> A carteira mais crítica por sobressalente é <strong>${SURPLUS_CARTEIRA[0]?.name || '-'}</strong>, com <strong>${fmt.format(SURPLUS_CARTEIRA[0]?.total || 0)}</strong> equipamentos excedentes.</li>
    <li><span class="badge">Tecnologia</span> A tecnologia predominante é <strong>${wifiTop.name}</strong>, com <strong>${fmt.format(wifiTop.total)}</strong> equipamentos, representando <strong>${pct(wifiTop.total, wifiTotal)}</strong> do total WIFI mapeado.</li>
    <li><span class="badge">Tendência</span> O volume sobressalente saiu de <strong>${fmt.format(firstMonth.total)}</strong> em ${firstMonth.name} para <strong>${fmt.format(lastMonth.total)}</strong> em ${lastMonth.name}, variação de <strong>${surplusGrowth.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%</strong>.</li>
    <li><span class="badge">Pico</span> O maior mês de sobressalente é <strong>${surplusTopMonth.name}</strong>, com <strong>${fmt.format(surplusTopMonth.total)}</strong> equipamentos excedentes.</li>
  `;
}

function prepararContratosMacro(rawRows) {
  const grouped = new Map();

  rawRows.forEach(row => {
    const key = [row.tipo_desconexao, row.estado, row.descricao].join('|');
    const month = row.mes;
    const contracts = parseNumber(row.contratos);
    const order = parseNumber(row.ordem_mes);

    if (!grouped.has(key)) {
      grouped.set(key, {
        tipo_desconexao: row.tipo_desconexao,
        estado: row.estado,
        descricao: row.descricao,
        monthValues: {},
        total: 0
      });
    }

    const item = grouped.get(key);
    item.monthValues[month] = (item.monthValues[month] || 0) + contracts;
    item.total += contracts;

    if (!MONTHS.some(m => m.name === month)) {
      MONTHS.push({ name: month, ordem: order });
    }
  });

  MONTHS.sort((a, b) => a.ordem - b.ordem);
  return [...grouped.values()];
}

async function carregarDashboard() {
  try {
    const [contratosRaw, wifiRaw, kpiRaw, surplusUFRaw, surplusCarteiraRaw, surplusMesRaw] = await Promise.all([
      carregarCSV(CSV_FILES.contratos),
      carregarCSV(CSV_FILES.wifi),
      carregarCSV(CSV_FILES.kpi),
      carregarCSV(CSV_FILES.surplusUF),
      carregarCSV(CSV_FILES.surplusCarteira),
      carregarCSV(CSV_FILES.surplusMes)
    ]);

    MONTHS = [];
    DATA = prepararContratosMacro(contratosRaw);
    WIFI_DATA = wifiRaw.map(row => ({ name: row.tecnologia, total: parseNumber(row.total) }));
    SURPLUS_TOTAL = parseNumber(kpiRaw[0]?.total);
    SURPLUS_UF = surplusUFRaw.map(row => ({ name: row.estado, total: parseNumber(row.total) })).sort((a, b) => b.total - a.total);
    SURPLUS_CARTEIRA = surplusCarteiraRaw.map(row => ({ name: row.descricao, total: parseNumber(row.total) })).sort((a, b) => b.total - a.total);
    SURPLUS_MONTH = surplusMesRaw
      .map(row => ({ name: row.mes, ordem: parseNumber(row.ordem_mes), total: parseNumber(row.total) }))
      .sort((a, b) => a.ordem - b.ordem);

    fillFilters();
    render();
  } catch (error) {
    console.error(error);
    const target = $('insightList');
    if (target) {
      target.innerHTML = `<li><span class="badge">Erro</span> Não foi possível carregar os CSVs da pasta <strong>/data</strong>. Detalhe: ${error.message}</li>`;
    }
  }
}

['fTipo', 'fEstado', 'fCarteira'].forEach(id => {
  const element = $(id);
  if (element) element.addEventListener('change', render);
});

const resetButton = $('resetBtn');
if (resetButton) {
  resetButton.addEventListener('click', () => {
    ['fTipo', 'fEstado', 'fCarteira'].forEach(id => { $(id).value = ''; });
    render();
  });
}

carregarDashboard();
