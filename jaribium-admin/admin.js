
// 공개 시연용 가상 데이터만 포함. 실제 운영자 인증과 DB는 미연결.
const people=[{name:'시연 참여자 A',work:'시연 작품 A',zone:'멀티 전시',status:'전시장 내'},{name:'시연 참여자 B',work:'시연 작품 B',zone:'영상 전시',status:'자리비움'},{name:'시연 참여자 C',work:'시연 작품 C',zone:'창업캡스톤',status:'전시장 내'}];
let helpers=[{name:'지원 인력 A',group:'학생회',zone:'입구 안내',status:'활동 중'},{name:'지원 인력 B',group:'학과 후배',zone:'공용 공간',status:'휴식 중'}];
let issues=[{location:'시연 작품 B',type:'영상 오류',status:'접수'}], tab='people',day=0;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const schedule=[
['11월 14일 토요일',[['15:00–17:00','팀별 전시 세팅'],['17:00–18:30','현수막 및 기자재 설치'],['18:30–19:10','저녁 식사'],['19:10–21:00','리허설 및 설치 마무리']]],
['11월 15일 일요일',[['15:00–17:00','팀별 전시 세팅'],['17:00–18:30','현수막 및 기자재 설치'],['18:30–19:10','저녁 식사'],['19:10–21:00','리허설 및 설치 마무리']]],
['11월 16일 월요일',[['09:30–10:00','운영진 사전 점검'],['10:00–10:30','학생 전시장 이동'],['10:30–11:00','학생 집결 및 인원 체크'],['11:00–11:50','개막식'],['11:50–22:00','자유관람']]],
['11월 17일 화요일',[['09:40–10:00','운영진 사전 점검'],['10:00–16:45','자유관람'],['16:45–17:00','관람 마감 안내'],['17:00–17:10','철거 시작'],['17:10–17:30','개인 및 팀 전시물 회수'],['17:30–17:50','공용 전시물 철거'],['17:50–18:00','원상복구']]]
];
const table=(heads,rows)=>`<table><thead><tr>${heads.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(x=>`<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;render()});
function render(){
document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));
document.getElementById('stats').innerHTML=[[40,'전체 전시 참여자 (기획 기준)'],[people.filter(p=>p.status==='전시장 내').length,'시연 데이터 재실'],[people.filter(p=>p.status==='자리비움').length,'시연 데이터 부재'],[helpers.filter(h=>h.status==='활동 중').length,'시연 지원 인력 활동 중']].map(([n,t])=>`<div class="stat"><strong>${n}</strong><span>${t}</span></div>`).join('');
let h='';
if(tab==='people')h='<h2>참여자 현황</h2>'+table(['이름','담당 작품','구역','상태'],people.map(p=>[p.name,p.work,p.zone,p.status]));
if(tab==='works')h='<h2>작품별 담당자</h2>'+table(['작품','담당자','전시 구역','현재 상태'],people.map(p=>[p.work,p.name,p.zone,p.status]));
if(tab==='issues')h='<h2>현장 이슈</h2>'+table(['위치','유형','처리 상태'],issues.map((i,n)=>[esc(i.location),esc(i.type),`<select data-issue="${n}">${['접수','확인 중','해결 완료'].map(x=>`<option ${x===i.status?'selected':''}>${x}</option>`).join('')}</select>`]));
if(tab==='helpers')h=`<h2>일시 지원 인력</h2><div class="toolbar"><input id="helperName" placeholder="지원 인력 이름"><select id="helperGroup"><option>학생회</option><option>학과 후배</option><option>기타</option></select><select id="helperZone"><option>입구 안내</option><option>멀티 전시</option><option>영상 전시</option><option>공용 공간</option></select><button id="addHelper">인력 추가</button></div>`+table(['이름','소속','담당 구역','상태'],helpers.map((x,n)=>[esc(x.name),esc(x.group),`<select data-zone="${n}">${['입구 안내','멀티 전시','영상 전시','공용 공간'].map(z=>`<option ${z===x.zone?'selected':''}>${z}</option>`).join('')}</select>`,`<select data-helper="${n}">${['활동 중','휴식 중','지원 종료'].map(s=>`<option ${s===x.status?'selected':''}>${s}</option>`).join('')}</select>`]));
if(tab==='schedule')h=`<h2>행사 일정</h2><div class="toolbar"><select id="day">${schedule.map((d,i)=>`<option value="${i}" ${i===day?'selected':''}>${d[0]}</option>`).join('')}</select></div>`+table(['시간','진행 내용'],schedule[day][1]);
document.getElementById('panel').innerHTML=h;
document.querySelectorAll('[data-issue]').forEach(e=>e.onchange=()=>{issues[Number(e.dataset.issue)].status=e.value});
document.querySelectorAll('[data-helper]').forEach(e=>e.onchange=()=>{helpers[Number(e.dataset.helper)].status=e.value;render()});
document.querySelectorAll('[data-zone]').forEach(e=>e.onchange=()=>{helpers[Number(e.dataset.zone)].zone=e.value;render()});
if(document.getElementById('addHelper'))document.getElementById('addHelper').onclick=()=>{let name=document.getElementById('helperName').value.trim();if(!name)return alert('이름을 입력해 주세요');helpers.push({name,group:document.getElementById('helperGroup').value,zone:document.getElementById('helperZone').value,status:'활동 중'});render()};
if(document.getElementById('day'))document.getElementById('day').onchange=e=>{day=Number(e.target.value);render()};
}
render();
