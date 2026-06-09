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
function groupByMonth(rows){
  const map = new Map();
  rows.forEach(r => {
    if(!map.has(r.mes)) map.set(r.mes, {name:r.mes, ordem:r.ordem_mes, aberto:0, sobra:0, ajustado:0, coletado:0});
    const i = map.get(r.mes);
    i.aberto += r.volume_aberto_atual;
    i.sobra += r.volume_sobressalente;
    i.ajustado += r.volume_aberto_ajustado;
    i.coletado += r.volume_coletado_ok;
  });
  return [...map.values()].map(i => ({...i, pctAtual:i.coletado/i.aberto, pctAjustado:i.coletado/i.ajustado, ganho:(i.coletado/i.ajustado)-(i.coletado/i.aberto)})).sort((a,b)=>a.ordem-b.ordem);
}
function render(){
  const month = groupByMonth(DATA);
  const aberto = sum(DATA.map(r=>r.volume_aberto_atual));
  const sobra = sum(DATA.map(r=>r.volume_sobressalente));
  const ajustado = sum(DATA.map(r=>r.volume_aberto_ajustado));
  const coletado = sum(DATA.map(r=>r.volume_coletado_ok));
  const pctAtual = coletado / aberto;
  const pctAjustado = coletado / ajustado;
  const ganho = pctAjustado - pctAtual;
  $('kpiPctAtual').textContent = pct(pctAtual);
  $('kpiPctAjustado').textContent = pct(pctAjustado);
  $('kpiGanho').textContent = pp(ganho);
  $('kpiSobra').textContent = fmt.format(sobra);
  $('headlineTexto').innerHTML = `Sem o volume sobressalente, o indicador consolidado passaria de <strong>${pct(pctAtual)}</strong> para <strong>${pct(pctAjustado)}</strong>, com ganho estimado de <strong>${pp(ganho)}</strong>.`;
  $('tabelaGerencial').querySelector('tbody').innerHTML = month.map(m => `<tr><td>${m.name}</td><td class="num">${pct(m.pctAtual)}</td><td class="num"><strong>${pct(m.pctAjustado)}</strong></td><td class="num gain">${pp(m.ganho)}</td></tr>`).join('');
  $('tabelaDetalhe').querySelector('tbody').innerHTML = DATA.map(r => {
    const pctAtualLinha = r.volume_coletado_ok / r.volume_aberto_atual;
    const pctAjustadoLinha = r.volume_coletado_ok / r.volume_aberto_ajustado;
    const ganhoLinha = pctAjustadoLinha - pctAtualLinha;
    return `<tr><td>${r.tipo_desconexao}</td><td>${r.mes}</td><td class="num">${fmt.format(r.volume_aberto_atual)}</td><td class="num">${fmt.format(r.volume_sobressalente)}</td><td class="num">${fmt.format(r.volume_aberto_ajustado)}</td><td class="num">${fmt.format(r.volume_coletado_ok)}</td><td class="num">${pct(pctAtualLinha)}</td><td class="num">${pct(pctAjustadoLinha)}</td><td class="num gain">${pp(ganhoLinha)}</td></tr>`;
  }).join('');
  const melhorMes = [...month].sort((a,b)=>b.ganho-a.ganho)[0];
  $('insightList').innerHTML = `<li><span class="badge">Resposta direta</span> O percentual consolidado ficaria em <strong>${pct(pctAjustado)}</strong> sem o sobressalente, contra <strong>${pct(pctAtual)}</strong> no cenário atual.</li><li><span class="badge">Ganho</span> O ganho estimado é de <strong>${pp(ganho)}</strong> no período consolidado.</li><li><span class="badge">Maior impacto</span> O mês com maior ganho é <strong>${melhorMes.name}</strong>, com avanço de <strong>${pp(melhorMes.ganho)}</strong>.</li>`;
}
loadCSV().then(rows => { DATA = rows; render(); }).catch(err => { console.error(err); $('insightList').innerHTML = `<li><span class="badge">Erro</span> Não foi possível carregar <strong>data/cenario_sem_sobressalente.csv</strong>. ${err.message}</li>`; });
