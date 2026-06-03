const DATA = [
  {
    "tipo_desconexao": "involuntaria",
    "estado": "SP",
    "descricao": "AZZA",
    "JAN/2026": 89,
    "FEV/2026": 102,
    "MAR/2026": 118,
    "ABR/2026": 126,
    "MAI/2026": 168,
    "total": 603
  },
  {
    "tipo_desconexao": "involuntaria",
    "estado": "SP",
    "descricao": "CONEXÃO",
    "JAN/2026": 7,
    "FEV/2026": 4,
    "MAR/2026": 9,
    "ABR/2026": 8,
    "MAI/2026": 9,
    "total": 37
  },
  {
    "tipo_desconexao": "involuntaria",
    "estado": "SP",
    "descricao": "OUTCENTER",
    "JAN/2026": 1,
    "FEV/2026": 1,
    "MAR/2026": 0,
    "ABR/2026": 1,
    "MAI/2026": 2,
    "total": 5
  },
  {
    "tipo_desconexao": "involuntaria",
    "estado": "SP",
    "descricao": "WEBBY",
    "JAN/2026": 10,
    "FEV/2026": 10,
    "MAR/2026": 9,
    "ABR/2026": 15,
    "MAI/2026": 20,
    "total": 64
  },
  {
    "tipo_desconexao": "involuntaria",
    "estado": "MG",
    "descricao": "CONEXÃO",
    "JAN/2026": 1,
    "FEV/2026": 0,
    "MAR/2026": 1,
    "ABR/2026": 1,
    "MAI/2026": 0,
    "total": 3
  },
  {
    "tipo_desconexao": "involuntaria",
    "estado": "MG",
    "descricao": "OUTCENTER",
    "JAN/2026": 7,
    "FEV/2026": 0,
    "MAR/2026": 9,
    "ABR/2026": 4,
    "MAI/2026": 7,
    "total": 27
  },
  {
    "tipo_desconexao": "involuntaria",
    "estado": "MG",
    "descricao": "STARWEB",
    "JAN/2026": 5,
    "FEV/2026": 3,
    "MAR/2026": 7,
    "ABR/2026": 2,
    "MAI/2026": 5,
    "total": 22
  },
  {
    "tipo_desconexao": "involuntaria",
    "estado": "CE",
    "descricao": "IDEIA (TECNET)",
    "JAN/2026": 0,
    "FEV/2026": 2,
    "MAR/2026": 1,
    "ABR/2026": 0,
    "MAI/2026": 2,
    "total": 5
  },
  {
    "tipo_desconexao": "involuntaria",
    "estado": "CE",
    "descricao": "MULTIPLAY",
    "JAN/2026": 3,
    "FEV/2026": 8,
    "MAR/2026": 4,
    "ABR/2026": 8,
    "MAI/2026": 5,
    "total": 28
  },
  {
    "tipo_desconexao": "involuntaria",
    "estado": "PR",
    "descricao": "WEBBY",
    "JAN/2026": 6,
    "FEV/2026": 4,
    "MAR/2026": 2,
    "ABR/2026": 6,
    "MAI/2026": 12,
    "total": 30
  },
  {
    "tipo_desconexao": "involuntaria",
    "estado": "RN",
    "descricao": "CABO",
    "JAN/2026": 4,
    "FEV/2026": 0,
    "MAR/2026": 3,
    "ABR/2026": 2,
    "MAI/2026": 4,
    "total": 13
  },
  {
    "tipo_desconexao": "involuntaria",
    "estado": "BA",
    "descricao": "OUTCENTER",
    "JAN/2026": 1,
    "FEV/2026": 2,
    "MAR/2026": 3,
    "ABR/2026": 2,
    "MAI/2026": 1,
    "total": 9
  },
  {
    "tipo_desconexao": "voluntaria",
    "estado": "SP",
    "descricao": "AZZA",
    "JAN/2026": 43,
    "FEV/2026": 55,
    "MAR/2026": 68,
    "ABR/2026": 68,
    "MAI/2026": 105,
    "total": 339
  },
  {
    "tipo_desconexao": "voluntaria",
    "estado": "SP",
    "descricao": "CONEXÃO",
    "JAN/2026": 2,
    "FEV/2026": 1,
    "MAR/2026": 3,
    "ABR/2026": 1,
    "MAI/2026": 7,
    "total": 14
  },
  {
    "tipo_desconexao": "voluntaria",
    "estado": "SP",
    "descricao": "OUTCENTER",
    "JAN/2026": 0,
    "FEV/2026": 0,
    "MAR/2026": 0,
    "ABR/2026": 1,
    "MAI/2026": 1,
    "total": 2
  },
  {
    "tipo_desconexao": "voluntaria",
    "estado": "SP",
    "descricao": "WEBBY",
    "JAN/2026": 3,
    "FEV/2026": 1,
    "MAR/2026": 1,
    "ABR/2026": 3,
    "MAI/2026": 11,
    "total": 19
  },
  {
    "tipo_desconexao": "voluntaria",
    "estado": "CE",
    "descricao": "IDEIA (TECNET)",
    "JAN/2026": 2,
    "FEV/2026": 1,
    "MAR/2026": 2,
    "ABR/2026": 1,
    "MAI/2026": 3,
    "total": 9
  },
  {
    "tipo_desconexao": "voluntaria",
    "estado": "CE",
    "descricao": "MULTIPLAY",
    "JAN/2026": 2,
    "FEV/2026": 6,
    "MAR/2026": 2,
    "ABR/2026": 6,
    "MAI/2026": 17,
    "total": 33
  },
  {
    "tipo_desconexao": "voluntaria",
    "estado": "MG",
    "descricao": "CONEXÃO",
    "JAN/2026": 0,
    "FEV/2026": 0,
    "MAR/2026": 2,
    "ABR/2026": 0,
    "MAI/2026": 2,
    "total": 4
  },
  {
    "tipo_desconexao": "voluntaria",
    "estado": "MG",
    "descricao": "OUTCENTER",
    "JAN/2026": 2,
    "FEV/2026": 3,
    "MAR/2026": 1,
    "ABR/2026": 7,
    "MAI/2026": 8,
    "total": 21
  },
  {
    "tipo_desconexao": "voluntaria",
    "estado": "MG",
    "descricao": "STARWEB",
    "JAN/2026": 4,
    "FEV/2026": 2,
    "MAR/2026": 3,
    "ABR/2026": 1,
    "MAI/2026": 3,
    "total": 13
  },
  {
    "tipo_desconexao": "voluntaria",
    "estado": "PR",
    "descricao": "WEBBY",
    "JAN/2026": 0,
    "FEV/2026": 3,
    "MAR/2026": 3,
    "ABR/2026": 0,
    "MAI/2026": 6,
    "total": 12
  },
  {
    "tipo_desconexao": "voluntaria",
    "estado": "RN",
    "descricao": "CABO",
    "JAN/2026": 0,
    "FEV/2026": 2,
    "MAR/2026": 0,
    "ABR/2026": 1,
    "MAI/2026": 6,
    "total": 9
  },
  {
    "tipo_desconexao": "voluntaria",
    "estado": "BA",
    "descricao": "OUTCENTER",
    "JAN/2026": 0,
    "FEV/2026": 0,
    "MAR/2026": 1,
    "ABR/2026": 1,
    "MAI/2026": 3,
    "total": 5
  },
  {
    "tipo_desconexao": "voluntaria",
    "estado": "PB",
    "descricao": "CABO",
    "JAN/2026": 0,
    "FEV/2026": 0,
    "MAR/2026": 0,
    "ABR/2026": 1,
    "MAI/2026": 1,
    "total": 2
  }
];
const MONTHS = ["JAN/2026", "FEV/2026", "MAR/2026", "ABR/2026", "MAI/2026"];
const $ = (id) => document.getElementById(id);
const fmt = new Intl.NumberFormat('pt-BR');
const pct = (v,t) => t ? (v/t*100).toLocaleString('pt-BR', {minimumFractionDigits:1, maximumFractionDigits:1}) + '%' : '0,0%';
function unique(arr) { return [...new Set(arr)].sort(); }
function sum(arr) { return arr.reduce((a,b)=>a+b,0); }
function groupBy(rows, keyFn, valueFn=r=>r.total) { const m = new Map(); rows.forEach(r=>{ const k=keyFn(r); m.set(k,(m.get(k)||0)+valueFn(r)); }); return [...m.entries()].map(([name,total])=>({name,total})).sort((a,b)=>b.total-a.total); }
function filtered() { const t=$('fTipo').value, e=$('fEstado').value, c=$('fCarteira').value; return DATA.filter(r=>(!t||r.tipo_desconexao===t)&&(!e||r.estado===e)&&(!c||r.descricao===c)); }
function fillFilters() { [['fTipo','tipo_desconexao'],['fEstado','estado'],['fCarteira','descricao']].forEach(([id,key])=>unique(DATA.map(r=>r[key])).forEach(v=>{ const o=document.createElement('option'); o.value=v; o.textContent=v; $(id).appendChild(o); })); }
function barChart(el, items) { const max = Math.max(...items.map(i=>i.total),1); el.innerHTML = items.map(i=>`<div class="bar-row"><div class="bar-label" title="${i.name}">${i.name}</div><div class="bar-track"><div class="bar green" style="width:${(i.total/max*100).toFixed(1)}%"></div></div><div class="bar-value">${fmt.format(i.total)}</div></div>`).join(''); }
function barChartDefault(el, items) { const max = Math.max(...items.map(i=>i.total),1); el.innerHTML = items.map(i=>`<div class="bar-row"><div class="bar-label" title="${i.name}">${i.name}</div><div class="bar-track"><div class="bar" style="width:${(i.total/max*100).toFixed(1)}%"></div></div><div class="bar-value">${fmt.format(i.total)}</div></div>`).join(''); }
function pieChart(pieEl, legendEl, items) {
  const total = sum(items.map(i => i.total)); let start = 0; const colors = ['var(--red)', 'var(--cyan)', 'var(--green)', 'var(--yellow)'];
  const gradient = items.map((i, idx) => { const deg = total ? (i.total / total) * 360 : 0; const part = `${colors[idx % colors.length]} ${start.toFixed(2)}deg ${(start + deg).toFixed(2)}deg`; start += deg; return part; }).join(', ');
  pieEl.style.background = `conic-gradient(${gradient})`; pieEl.innerHTML = `<div class="pie-center"><strong>${fmt.format(total)}</strong><span>Total</span></div>`;
  legendEl.innerHTML = items.map((i, idx) => `<div class="legend-item"><span class="legend-dot" style="background:${colors[idx % colors.length]}"></span><span class="legend-name">${i.name}</span><span class="legend-value"><strong>${fmt.format(i.total)}</strong><small>${pct(i.total,total)}</small></span></div>`).join('');
}
function render() {
  const rows = filtered(); const total = sum(rows.map(r=>r.total)); const byUF = groupBy(rows, r=>r.estado); const byCarteira = groupBy(rows, r=>r.descricao); const byTipo = groupBy(rows, r=>r.tipo_desconexao); const byMonth = MONTHS.map(m=>({name:m,total:sum(rows.map(r=>r[m]||0))})); const spAzza = sum(rows.filter(r=>r.estado==='SP' && r.descricao==='AZZA').map(r=>r.total)); const topMonth = [...byMonth].sort((a,b)=>b.total-a.total)[0] || {name:'-',total:0};
  $('kpiTotal').textContent = fmt.format(total); $('kpiUF').textContent = byUF[0]?.name || '-'; $('kpiUFSub').textContent = byUF[0] ? `${fmt.format(byUF[0].total)} contratos · ${pct(byUF[0].total,total)}` : '-'; $('kpiCarteira').textContent = byCarteira[0]?.name || '-'; $('kpiCarteiraSub').textContent = byCarteira[0] ? `${fmt.format(byCarteira[0].total)} contratos · ${pct(byCarteira[0].total,total)}` : '-'; $('kpiMes').textContent = topMonth.name; $('kpiMesSub').textContent = `${fmt.format(topMonth.total)} contratos`; $('kpiSpAzza').textContent = fmt.format(spAzza); $('kpiSpAzzaSub').textContent = `${pct(spAzza,total)} do total filtrado`;
  barChart($('monthlyChart'), byMonth); pieChart($('tipoPie'), $('tipoLegend'), byTipo); barChartDefault($('ufChart'), byUF.slice(0,10)); barChartDefault($('carteiraChart'), byCarteira.slice(0,10));
  const ranked = [...rows].sort((a,b)=>b.total-a.total).slice(0,12); $('topTable').querySelector('tbody').innerHTML = ranked.map((r,i)=>`<tr><td>${i+1}</td><td>${r.tipo_desconexao}</td><td>${r.estado}</td><td><strong>${r.descricao}</strong></td>${MONTHS.map(m=>`<td class="num">${fmt.format(r[m])}</td>`).join('')}<td class="num"><strong>${fmt.format(r.total)}</strong></td><td class="num">${pct(r.total,total)}</td></tr>`).join('');
  const jan = byMonth.find(m=>m.name==='JAN/2026')?.total || 0; const mai = byMonth.find(m=>m.name==='MAI/2026')?.total || 0; const growth = jan ? ((mai-jan)/jan*100) : 0;
  $('insightList').innerHTML = `<li><span class="badge">Concentração</span> A UF mais crítica é <strong>${byUF[0]?.name||'-'}</strong>, com <strong>${fmt.format(byUF[0]?.total||0)}</strong> contratos, representando <strong>${pct(byUF[0]?.total||0,total)}</strong> do total filtrado.</li><li><span class="badge">Carteira</span> A carteira mais crítica é <strong>${byCarteira[0]?.name||'-'}</strong>, com <strong>${fmt.format(byCarteira[0]?.total||0)}</strong> contratos.</li><li><span class="badge">Desconexão</span> O tipo predominante é <strong>${byTipo[0]?.name||'-'}</strong>, com <strong>${fmt.format(byTipo[0]?.total||0)}</strong> contratos.</li><li><span class="badge">Tendência</span> O volume foi de <strong>${fmt.format(jan)}</strong> em JAN/2026 para <strong>${fmt.format(mai)}</strong> em MAI/2026, variação de <strong>${growth.toLocaleString('pt-BR',{minimumFractionDigits:1,maximumFractionDigits:1})}%</strong>.</li><li><span class="badge">Alerta</span> A combinação <strong>SP/AZZA</strong> soma <strong>${fmt.format(spAzza)}</strong> contratos e deve ser a primeira frente de investigação operacional.</li>`;
}
['fTipo','fEstado','fCarteira'].forEach(id=>$(id).addEventListener('change', render)); $('resetBtn').addEventListener('click',()=>{['fTipo','fEstado','fCarteira'].forEach(id=>$(id).value=''); render();}); fillFilters(); render();
