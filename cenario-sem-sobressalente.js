const CSV_URL = './data/cenario_sem_sobressalente.csv';
let DATA = [];
const $ = (id) => document.getElementById(id);
const fmt = new Intl.NumberFormat('pt-BR');
const fmtPct = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

function cacheBuster(url){ return `${url}?v=${Date.now()}`; }
function clean(v){ return String(v ?? '').replace(/^\uFEFF/, '').trim(); }
function parseNum(v){
  if (v === null || v === undefined) return 0;
  let s = clean(v).replace('%','').replace(/\./g,'').replace(',','.');
  let n = Number(s);
  return Number.isFinite(n) ? n : 0;
}
function parseCSV(text){
  let cleanText = String(text ?? '').replace(/^\uFEFF/, '').replace(/\r\n/g,'\n').replace(/\r/g,'\n').trim();
  if(!cleanText) return [];
  const lines = cleanText.split('\n');
  const headers = lines.shift().split(';').map(clean);
  return lines.filter(Boolean).map(line => {
    const cols = line.split(';');
    return Object.fromEntries(headers.map((h,i)=>[h, clean(cols[i])]));
  });
}
async function loadCSV(){
  const r = await fetch(cacheBuster(CSV_URL));
  if(!r.ok) throw new Error(`Falha ao carregar ${CSV_URL}: ${r.status}`);
  const txt = await r.text();
  return parseCSV(txt).map(row => ({
    tipo_desconexao: row.tipo_desconexao,
    mes: row.mes,
    ordem_mes: parseNum(row.ordem_mes),
    volume_aberto_atual: parseNum(row.volume_aberto_atual),
    volume_sobressalente: parseNum(row.volume_sobressalente),
    volume_aberto_ajustado: parseNum(row.volume_aberto_ajustado),
    volume_coletado_ok: parseNum(row.volume_coletado_ok),
    pct_coleta_atual: parseNum(row.pct_coleta_atual) / 100,
    pct_coleta_ajustado: parseNum(row.pct_coleta_ajustado) / 100,
    pct_reducao_base: parseNum(row.pct_reducao_base) / 100
  })).sort((a,b)=>a.ordem_mes-b.ordem_mes || a.tipo_desconexao.localeCompare(b.tipo_desconexao));
}
function unique(arr){ return [...new Set(arr)]; }
function sum(arr){ return arr.reduce((a,b)=>a+b,0); }
function filtered(){
  const tipo = $('fTipo').value;
  return DATA.filter(r => !tipo || r.tipo_desconexao === tipo);
}
function pct(v){ return `${fmtPct.format(v*100)}%`; }
function pp(v){ return `${fmtPct.format(v*100)} p.p.`; }
function groupByMonth(rows){
  const map = new Map();
  rows.forEach(r => {
    if(!map.has(r.mes)) map.set(r.mes, {name:r.mes, ordem:r.ordem_mes, volume_aberto_atual:0, volume_sobressalente:0, volume_aberto_ajustado:0, volume_coletado_ok:0});
    const item = map.get(r.mes);
    item.volume_aberto_atual += r.volume_aberto_atual;
    item.volume_sobressalente += r.volume_sobressalente;
    item.volume_aberto_ajustado += r.volume_aberto_ajustado;
    item.volume_coletado_ok += r.volume_coletado_ok;
  });
  return [...map.values()].map(i => ({...i, pct_atual:i.volume_coletado_ok/i.volume_aberto_atual, pct_ajustado:i.volume_coletado_ok/i.volume_aberto_ajustado})).sort((a,b)=>a.ordem-b.ordem);
}
function barChart(el, items, valueKey, cls=''){
  const max = Math.max(...items.map(i=>i[valueKey]), 1);
  el.innerHTML = items.map(i => `<div class="bar-row"><div class="bar-label" title="${i.name}">${i.name}</div><div class="bar-track"><div class="bar ${cls}" style="width:${(i[valueKey]/max*100).toFixed(1)}%"></div></div><div class="bar-value">${fmt.format(i[valueKey])}</div></div>`).join('');
}
function fillFilters(){
  const select = $('fTipo');
  unique(DATA.map(r=>r.tipo_desconexao)).sort().forEach(v => {
    const o = document.createElement('option'); o.value = v; o.textContent = v; select.appendChild(o);
  });
}
function render(){
  const rows = filtered();
  const month = groupByMonth(rows);
  const aberto = sum(rows.map(r=>r.volume_aberto_atual));
  const sobra = sum(rows.map(r=>r.volume_sobressalente));
  const ajustado = sum(rows.map(r=>r.volume_aberto_ajustado));
  const coletado = sum(rows.map(r=>r.volume_coletado_ok));
  const pctAtual = coletado / aberto;
  const pctAjustado = coletado / ajustado;
  const ganho = pctAjustado - pctAtual;

  $('kpiAberto').textContent = fmt.format(aberto);
  $('kpiSobra').textContent = fmt.format(sobra);
  $('kpiAjustado').textContent = fmt.format(ajustado);
  $('kpiColetado').textContent = fmt.format(coletado);
  $('kpiPctAtual').textContent = pct(pctAtual);
  $('kpiPctAjustado').textContent = pct(pctAjustado);
  $('kpiGanho').textContent = pp(ganho);

  $('tabelaResumoVolume').querySelector('tbody').innerHTML = month.map(m => `<tr><td>${m.name}</td><td class="num">${fmt.format(m.volume_aberto_atual)}</td><td class="num">${fmt.format(m.volume_sobressalente)}</td><td class="num">${fmt.format(m.volume_aberto_ajustado)}</td></tr>`).join('');

  barChart($('sobressalenteMes'), month, 'volume_sobressalente', 'red');

  $('tabelaResumoPercentual').querySelector('tbody').innerHTML = month.map(m => `<tr><td>${m.name}</td><td class="num">${fmt.format(m.volume_coletado_ok)}</td><td class="num">${pct(m.pct_atual)}</td><td class="num">${pct(m.pct_ajustado)}</td><td class="num">${pp(m.pct_ajustado-m.pct_atual)}</td></tr>`).join('');

  $('tabelaCenario').querySelector('tbody').innerHTML = rows.map(r => `<tr><td>${r.tipo_desconexao}</td><td>${r.mes}</td><td class="num">${fmt.format(r.volume_aberto_atual)}</td><td class="num">${fmt.format(r.volume_sobressalente)}</td><td class="num">${fmt.format(r.volume_aberto_ajustado)}</td><td class="num">${fmt.format(r.volume_coletado_ok)}</td><td class="num">${pct(r.pct_coleta_atual)}</td><td class="num">${pct(r.pct_coleta_ajustado)}</td><td class="num">${pp(r.pct_coleta_ajustado-r.pct_coleta_atual)}</td></tr>`).join('');

  const topMonth = [...month].sort((a,b)=>b.volume_sobressalente-a.volume_sobressalente)[0];
  $('insightList').innerHTML = `<li><span class="badge">Impacto total</span> A retirada de <strong>${fmt.format(sobra)}</strong> equipamentos sobressalentes reduz a base aberta de <strong>${fmt.format(aberto)}</strong> para <strong>${fmt.format(ajustado)}</strong>.</li><li><span class="badge">Indicador</span> O percentual consolidado sobe de <strong>${pct(pctAtual)}</strong> para <strong>${pct(pctAjustado)}</strong>, ganho de <strong>${pp(ganho)}</strong>.</li><li><span class="badge">Mês crítico</span> O maior impacto ocorre em <strong>${topMonth.name}</strong>, com <strong>${fmt.format(topMonth.volume_sobressalente)}</strong> equipamentos sobressalentes.</li>`;
}
$('fTipo').addEventListener('change', render);
$('resetBtn').addEventListener('click', () => { $('fTipo').value=''; render(); });
loadCSV().then(rows => { DATA = rows; fillFilters(); render(); }).catch(err => { console.error(err); $('insightList').innerHTML = `<li><span class="badge">Erro</span> Não foi possível carregar <strong>data/cenario_sem_sobressalente.csv</strong>. ${err.message}</li>`; });
