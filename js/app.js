import {getLearned,saveLearned,deleteLearned,replaceLearned} from './storage.js?v=0.4.0';
import {entries,questions} from './data.js?v=0.4.0';
import {Game,ANSWERS} from './engine.js?v=0.4.0';
const $=id=>document.getElementById(id);let game=null;let learned=[];let current='home';let stats=load();function load(){try{return JSON.parse(localStorage.getItem('mind-reader-stats'))||{wins:0,losses:0,abandoned:0,games:[]}}catch{return {wins:0,losses:0,abandoned:0,games:[]}}}function save(){localStorage.setItem('mind-reader-stats',JSON.stringify(stats))}
function show(id){current=id;for(const el of ['home','game','result','settings','learn'])$(el).classList.toggle('hidden',el!==id)}
function start(category=null){game=new Game(category,learned);show('game');render()}
function button(label,fn){const b=document.createElement('button');b.textContent=label;b.addEventListener('click',fn);return b}
function render(){if(!game||game.done)return;show('game');$('count').textContent='Question '+game.history.length+' / 20 (max 30)';$('mode').textContent=game.category||'Quick Play';$('fill').style.width=Math.min(100,game.history.length/30*100)+'%';const target=$('answers');target.replaceChildren();$('undo').disabled=!game.history.length;renderHistory();if(game.guesses>=3||!game.candidate()){finish(false);return}if(game.shouldGuess()){const candidate=game.candidate();$('question').textContent='Are you thinking of '+candidate.name+'?';target.append(button('Yes, you got it!',()=>finish(true,candidate.name)),button('No, keep trying',()=>{game.guessWrong();render()}));return}if(!game.question){finish(false);return}$('question').textContent=game.question.text;for(const [value,label] of ANSWERS)target.append(button(label,()=>{game.answer(value);render()}))}
function finish(won,name=''){if(!game||game.done)return;game.done=true;stats[won?'wins':'losses']++;stats.games.unshift({date:new Date().toISOString(),won,questions:game.history.length,guesses:game.guesses+(won?1:0),answer:name||null});stats.games=stats.games.slice(0,100);save();show('result');$('resultTitle').textContent=won?'I got it! 🎉':'You stumped me!';$('resultText').textContent=won?'It was '+name+' in '+game.history.length+' questions.':'This prototype does not yet know enough to guess everything. You can teach me the answer.';$('resultActions').replaceChildren();if(!won)$('resultActions').append(button('Teach Mind Reader',beginLearning))}

const categoryNames={people:'Real people',characters:'Fictional characters',animals:'Animals',places:'Places',objects:'Objects'};
let draft=null;
const normalized=s=>s.trim().toLowerCase().replace(/\s+/g,' ');
function beginLearning(){
 draft={name:'',category:game?.category||'people',yes:[],no:[]};
 for(const h of game?.history||[]){if(h.answer==='yes')draft.yes.push(h.id);if(h.answer==='no')draft.no.push(h.id)}
 $('learnName').value='';$('learnCategory').value=draft.category;show('learn');renderLearning();
}
function renderLearning(){
 const target=$('learnFacts');target.replaceChildren();
 for(const q of questions){
  if(['real','fictional','animal','place','object'].includes(q.id))continue;
  const line=document.createElement('label');line.className='fact-row';
  const caption=document.createElement('span');caption.textContent=q.text;
  const sel=document.createElement('select');sel.dataset.fact=q.id;
  for(const [value,title] of [['unknown','Unknown'],['yes','Yes'],['no','No']]){
   const option=document.createElement('option');option.value=value;option.textContent=title;sel.append(option);
  }
  sel.value=draft.yes.includes(q.id)?'yes':draft.no.includes(q.id)?'no':'unknown';
  line.append(caption,sel);target.append(line);
 }
}
function collectDraft(){
 const name=$('learnName').value.trim(),category=$('learnCategory').value,yes=[],no=[];
 for(const sel of $('learnFacts').querySelectorAll('select')){
  if(sel.value==='yes')yes.push(sel.dataset.fact);
  if(sel.value==='no')no.push(sel.dataset.fact);
 }
 return {id:category+'-'+normalized(name).replace(/[^a-z0-9]+/g,'-'),name,category,yes,no,aliases:[]};
}
function reviewLearning(){
 const e=collectDraft();
 if(!e.name||e.name.length>100){alert('Enter a name up to 100 characters.');return}
 if([...entries,...learned].some(x=>normalized(x.name)===normalized(e.name)&&x.category===e.category&&x.id!==draft?.editing)){alert('That answer already exists in this category.');return}
 draft={...e,editing:draft?.editing};
 const facts=questions.filter(q=>e.yes.includes(q.id)||e.no.includes(q.id)).map(q=>(e.yes.includes(q.id)?'Yes: ':'No: ')+q.text);
 $('learnReview').textContent=e.name+' | '+categoryNames[e.category]+'\n'+(facts.join('\n')||'No traits selected');
 $('learnReview').classList.remove('hidden');$('learnSave').classList.remove('hidden');
}
async function commitLearning(){
 const e=collectDraft();
 if(!draft||e.name!==draft.name||e.category!==draft.category||JSON.stringify(e.yes)!==JSON.stringify(draft.yes)||JSON.stringify(e.no)!==JSON.stringify(draft.no)){alert('Review your changes before saving.');return}
 if(draft.editing)e.id=draft.editing;
 try{await saveLearned(e);learned=await getLearned();renderSettings();show('settings');alert('Answer saved for future games.')}
 catch(err){alert('Unable to save: '+err.message)}
}
function renderSettings(){
 $('stats').textContent='Wins: '+stats.wins+' • Losses: '+stats.losses+' • Abandoned: '+stats.abandoned;
 $('databaseCount').textContent='Built-in answers: '+entries.length+' • Learned answers: '+learned.length;
 const list=$('learnedList');list.replaceChildren();
 for(const e of [...learned].sort((a,b)=>a.name.localeCompare(b.name))){
  const row=document.createElement('div');row.className='learned-row';
  const name=document.createElement('span');name.textContent=e.name+' ('+categoryNames[e.category]+')';
  row.append(name,button('Edit',()=>{draft={...e,editing:e.id};$('learnName').value=e.name;$('learnCategory').value=e.category;show('learn');renderLearning()}),button('Delete',async()=>{if(!confirm('Delete '+e.name+'?'))return;try{await deleteLearned(e.id);learned=await getLearned();renderSettings()}catch(err){alert(err.message)}}));
  list.append(row);
 }
}
$('learnCategory').onchange=()=>{renderLearning();$('learnReview').classList.add('hidden');$('learnSave').classList.add('hidden')};
$('learnName').oninput=()=>{$('learnReview').classList.add('hidden');$('learnSave').classList.add('hidden')};
$('learnFacts').onchange=()=>{$('learnReview').classList.add('hidden');$('learnSave').classList.add('hidden')};
$('learnReviewBtn').onclick=reviewLearning;
$('learnSave').onclick=commitLearning;
$('learnCancel').onclick=()=>show(game?.done?'result':'settings');
getLearned().then(items=>{learned=items;renderSettings()}).catch(err=>{$('databaseCount').textContent='Learning storage unavailable';console.warn(err)});

function renderHistory(){const target=$('history');if(!target)return;target.replaceChildren();for(const h of game.historyLines()){const item=document.createElement('li');item.textContent=h.number+'. '+h.question+' — '+h.answer;target.append(item)}}
$('quick').onclick=()=>start();$('categoryPlay').onclick=()=>start($('category').value);$('undo').onclick=()=>{game.undo();render()};$('restart').onclick=()=>{if(game&&!game.done&&game.history.length){stats.abandoned++;save()}start(game?.category||null)};$('newGame').onclick=()=>{game=null;show('home')};$('settingsBtn').onclick=()=>{if(current==='game'&&game&&!game.done){if(!confirm('Leave the current game?'))return;stats.abandoned++;save()}renderSettings();show('settings')};$('back').onclick=()=>show('home');$('export').onclick=()=>{const blob=new Blob([JSON.stringify({schema:2,stats,learned},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='mind-reader-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
$('import').onchange=async event=>{try{
 const parsed=JSON.parse(await event.target.files[0].text());
 if(![1,2].includes(parsed.schema)||!parsed.stats||!Array.isArray(parsed.stats.games)||!['wins','losses','abandoned'].every(k=>Number.isInteger(parsed.stats[k])&&parsed.stats[k]>=0))throw Error('Invalid statistics');
 if(parsed.schema===2){
  if(!Array.isArray(parsed.learned))throw Error('Invalid knowledge');
  if(!confirm('Replace existing learned answers and statistics with this backup?'))return;
  await replaceLearned(parsed.learned);learned=await getLearned();
 }else if(!confirm('Restore old statistics backup? Learned answers will be kept.'))return;
 stats=parsed.stats;save();renderSettings();alert('Backup restored');
 }catch(err){alert('Import failed: '+err.message)}finally{event.target.value=''}
};
$('clear').onclick=()=>{if(confirm('Clear local game statistics?')){stats={wins:0,losses:0,abandoned:0,games:[]};save();$('stats').textContent='Wins: 0 • Losses: 0 • Abandoned: 0'}};function network(){ $('network').textContent=navigator.onLine?'Online':'Offline'}addEventListener('online',network);addEventListener('offline',network);network();if('serviceWorker'in navigator){
 let refreshing=false;
 navigator.serviceWorker.addEventListener('controllerchange',()=>{
  if(refreshing)return;
  refreshing=true;
  // Reload into the newly activated version without deleting any saved data.
  location.reload();
 });
 navigator.serviceWorker.register('./service-worker.js',{updateViaCache:'none'})
  .then(registration=>{
   registration.update().catch(console.warn);
   document.addEventListener('visibilitychange',()=>{
    if(!document.hidden)registration.update().catch(console.warn);
   });
  }).catch(console.warn);
}