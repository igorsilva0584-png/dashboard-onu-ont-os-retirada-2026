const CSV_URL = './data/cenario_sem_sobressalente.csv';
let DATA = [];
const $ = (id) => document.getElementById(id);
const fmt = new Intl.NumberFormat('pt-BR');
const fmtPct = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
function cacheBuster(url){ return `${url}?v=${Date.now()}`; }
function clean(v){ return String(v ?? '').replace(/^\uFEFF/, '').trim(); }
function parseNum(v){
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
    volume_coletado_ok: parseNum(row.volume_coletado_ok)
  })).sort((a,b)=>a.ordem_mes-b.ordem_mes || a.tipo_desconexao.localeCompare(b.tipo_desconexao));
}
function sum(arr){ return arr.reduce((a,b)=>a+b,0); }
function pct(v){ return `${fmtPct.format(v*100)}%`; }
function pp(v){ return `${fmtPct.format(v*100)} p.p.`; }
function calc(r){
  const pctAtual = r.volume_coletado_ok / r.volume_aberto_atual;
  const pctAjustado = r.volume_coletado_ok / r.volume_aberto_ajustado;
  return {...r, pctAtual, pctAjustado, ganho:pctAjustado-pctAtual};
}
function aggregate(rows, label){
  const aberto = sum(rows.map(r=>r.volume_aberto_atual));
  const sobra = sum(rows.map(r=>r.volume_sobressalente));
  const ajustado = sum(rows.map(r=>r.volume_aberto_ajustado));
  const coletado = sum(rows.map(r=>r.volume_coletado_ok));
  const pctAtual = coletado / aberto;
  const pctAjustado = coletado / ajustado;
  return {label, aberto, sobra, ajustado, coletado, pctAtual, pctAjustado, ganho:pctAjustado-pctAtual};
}
function months(){
  return [...new Map(DATA.map(r => [r.mes, {mes:r.mes, ordem:r.ordem_mes}])).values()].sort((a,b)=>a.ordem-b.ordem);
}
function buildMatrix(){
  const ms = months();
  const rows = [
    {label:'Total', key:'total'},
    {label:'Voluntária', key:'voluntaria'},
    {label:'Involuntária', key:'involuntaria'}
  ];
  $('matrizExecutiva').querySelector('thead').innerHTML = `<tr><th>Visão</th>${ms.map(m => `<th>${m.mes}</th>`).join('')}</tr>`;
  $('matrizExecutiva').querySelector('tbody').innerHTML = rows.map(row => {
    const cells = ms.map(m => {
      const base = DATA.filter(r => r.mes === m.mes && (row.key === 'total' || r.tipo_desconexao === row.key));
      const a = aggregate(base, row.label);
      return `<td><span class="matrix-value">${pct(a.pctAjustado)}</span><span class="matrix-gain">+${pp(a.ganho).replace('-', '')}</span></td>`;
    }).join('');
    return `<tr class="${row.key === 'total' ? 'matrix-row-total' : ''}"><td>${row.label}</td>${cells}</tr>`;
  }).join('');
}
function render(){
  const total = aggregate(DATA, 'Total');
  $('kpiPctAtual').textContent = pct(total.pctAtual);
  $('kpiPctAjustado').textContent = pct(total.pctAjustado);
  $('kpiGanho').textContent = pp(total.ganho);
  $('kpiSobra').textContent = fmt.format(total.sobra);
  $('headlineTexto').innerHTML = `Sem o volume sobressalente, o indicador consolidado passaria de <strong>${pct(total.pctAtual)}</strong> para <strong>${pct(total.pctAjustado)}</strong>, com ganho estimado de <strong>${pp(total.ganho)}</strong>.`;
  buildMatrix();
  $('tabelaDetalhe').querySelector('tbody').innerHTML = DATA.map(r => {
    const c = calc(r);
    return `<tr><td>${c.tipo_desconexao}</td><td>${c.mes}</td><td class="num">${fmt.format(c.volume_aberto_atual)}</td><td class="num">${fmt.format(c.volume_sobressalente)}</td><td class="num">${fmt.format(c.volume_aberto_ajustado)}</td><td class="num">${fmt.format(c.volume_coletado_ok)}</td><td class="num">${pct(c.pctAtual)}</td><td class="num">${pct(c.pctAjustado)}</td><td class="num gain">${pp(c.ganho)}</td></tr>`;
  }).join('');
  const allCells = [];
  months().forEach(m => {
    ['voluntaria','involuntaria'].forEach(tipo => {
      allCells.push(calc(DATA.find(r => r.mes === m.mes && r.tipo_desconexao === tipo)));
    });
  });
  const maior = allCells.sort((a,b)=>b.ganho-a.ganho)[0];
  $('insightList').innerHTML = `<li><span class="badge">Resposta direta</span> O percentual consolidado ficaria em <strong>${pct(total.pctAjustado)}</strong> sem o sobressalente, contra <strong>${pct(total.pctAtual)}</strong> no cenário atual.</li><li><span class="badge">Ganho</span> O ganho estimado é de <strong>${pp(total.ganho)}</strong> no período consolidado.</li><li><span class="badge">Abertura por desconexão</span> O maior ganho por tipo/mês ocorre em <strong>${maior.tipo_desconexao} / ${maior.mes}</strong>, com <strong>${pp(maior.ganho)}</strong>.</li>`;
}
loadCSV().then(rows => { DATA = rows; render(); }).catch(err => { console.error(err); $('insightList').innerHTML = `<li><span class="badge">Erro</span> Não foi possível carregar <strong>data/cenario_sem_sobressalente.csv</strong>. ${err.message}</li>`; });
