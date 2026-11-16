import {entries,questions} from './data.js?v=0.4.3';
export const ANSWERS=[['yes','Yes'],['no','No'],['probably','Probably'],['probablyNot','Probably not'],['unknown',"Don't know"]];
const CATEGORIES={real:'people',fictional:'characters',animal:'animals',place:'places',object:'objects'};
const EXCLUSIVE_GROUPS=[Object.keys(CATEGORIES),['country','city','landmark'],['uk','france','ireland','usa']];
const PLACE_TYPES=new Set(['country','city','landmark']);
const REGIONS=new Set(['europe','usa','uk','france','ireland']);
const CATEGORY_TRAITS={people:new Set(['alive','historical','science','music','sports','royalty','space']),characters:new Set(['superhero','magic','movie','television','book','detective','space','royalty']),animals:new Set(['mammal','bird','water','pet','large','flight']),objects:new Set(['electronic','transport','kitchen','handheld','communication','flight','large'])};
const LABELS=Object.fromEntries(questions.map(q=>[q.id,q.text]));
const RESPONSE_PROB={yes:.96,no:.04,probably:.73,probablyNot:.27,unknown:null};
const entropy=p=>p<=0||p>=1?0:-p*Math.log2(p)-(1-p)*Math.log2(1-p);
const groupFor=id=>EXCLUSIVE_GROUPS.find(group=>group.includes(id));
function fact(entry,id){
 if(Object.hasOwn(CATEGORIES,id))return CATEGORIES[id]===entry.category?1:0;
 if(entry.yes.includes(id))return 1;
 if(entry.no?.includes(id))return 0;
 // Personal answers record only confirmed facts. Unanswered traits are unknown.
 if(Array.isArray(entry.no))return .5;
 if(entry.category==='places'){
  if(PLACE_TYPES.has(id))return entry.yes.some(tag=>PLACE_TYPES.has(tag))?0:.5;
  // The starter place database uses exactly one of these country tags.
  if(['uk','france','ireland','usa'].includes(id))
   return entry.yes.some(tag=>['uk','france','ireland','usa'].includes(tag))?0:.5;
  if(id==='europe'&&entry.yes.includes('usa'))return 0;
  if(id==='usa'&&entry.yes.includes('europe'))return 0;
 }
 // Within each small, curated category, its defining traits are recorded
 // explicitly. This lets questions split characters, animals, and objects.
 // Attributes outside that category remain unknown.
 if(CATEGORY_TRAITS[entry.category]?.has(id))return 0;
 if(entry.category==='people'&&['american','british','rock','pop','countryMusic','solo','guitarist','actor','politics','male','female'].includes(id))return 0;
 if(entry.category==='animals'&&['fast','fastestLand','striped','spotted','mane','wild','carnivore','africa','asia','ocean','reptile','insect'].includes(id))return 0;
 if(entry.category==='objects'&&['instrument','strings','wooden','powered','sportEquipment'].includes(id))return 0;
 if(entry.category==='characters'&&['american','british','male','female','animated','fantasy'].includes(id))return 0;
 return .5; // Other missing information remains unknown.
}
function consistent(entry,history){
 for(const h of history){
  if(h.answer!=='yes'&&h.answer!=='no')continue;
  const value=fact(entry,h.id);
  if(h.answer==='yes'&&value===0)return false;
  if(h.answer==='no'&&value===1)return false;
 }
 return true;
}
export class Game{
 constructor(category=null,learned=[]){
  this.category=category;this.pool=[...entries.filter(e=>!learned.some(l=>l.id===e.id)),...learned.map(l=>{const builtIn=entries.find(e=>e.id===l.id);if(!builtIn)return l;const yes=[...new Set([...builtIn.yes.filter(x=>!l.no.includes(x)),...l.yes])];return {...l,yes,no:l.no}})].filter(e=>!category||e.category===category);
  this.history=[];this.rejected=[];this.guesses=0;this.question=null;this.done=false;
  this.next();
 }
 scores(){
  const available=this.pool.filter(e=>!this.rejected.includes(e.id));
  // If no recorded candidate matches all definite answers, retain uncertain
  // candidates for a graceful failure instead of pretending certainty.
  const compatible=available.filter(e=>consistent(e,this.history));
  const candidates=compatible.length?compatible:available;
  const scored=candidates.map(entry=>{
   let logScore=0;
   for(const {id,answer} of this.history){
    const response=RESPONSE_PROB[answer];if(response===null)continue;
    const likelihood=fact(entry,id);
    const compatibility=likelihood*response+(1-likelihood)*(1-response);
    logScore+=Math.log(Math.max(compatibility,.0001));
   }
   return {entry,logScore};
  });
  if(!scored.length)return [];
  const maximum=Math.max(...scored.map(x=>x.logScore));
  const denominator=scored.reduce((sum,x)=>sum+Math.exp(x.logScore-maximum),0);
  return scored.map(x=>({entry:x.entry,score:x.logScore,probability:Math.exp(x.logScore-maximum)/denominator})).sort((a,b)=>b.probability-a.probability);
 }
 implied(id){
  const group=groupFor(id);
  for(const h of this.history){
   if(h.answer!=='yes'&&h.answer!=='no')continue;
   if(h.id===id)return true;
   if(h.answer==='yes'&&group&&group.includes(h.id))return true;
   if(h.answer==='yes'&&h.id==='europe'&&id==='usa')return true;
   if(h.answer==='yes'&&h.id==='usa'&&id==='europe')return true;
   if(h.answer==='yes'&&['uk','france','ireland'].includes(h.id)&&REGIONS.has(id))return true;
   if(h.answer==='no'&&h.id==='europe'&&['uk','france','ireland'].includes(id))return true;
   if(h.answer==='no'&&h.id==='place'&&(PLACE_TYPES.has(id)||REGIONS.has(id)))return true;
  }
  return false;
 }
 next(){
  this.question=null;
  if(this.history.length>=30)return;
  const ranked=this.scores();if(!ranked.length)return;
  const asked=new Set(this.history.map(h=>h.id));
  let best=null,bestGain=0;
  for(const q of questions){
   if(asked.has(q.id)||this.implied(q.id))continue;
   if(this.category&&Object.hasOwn(CATEGORIES,q.id))continue;
   if(this.category==='places'&&['real','fictional','animal','object'].includes(q.id))continue;
   const yes=ranked.reduce((s,x)=>s+(fact(x.entry,q.id)===1?x.probability:0),0);
   const no=ranked.reduce((s,x)=>s+(fact(x.entry,q.id)===0?x.probability:0),0);
   const unknown=Math.max(0,1-yes-no);
   // Unknown facts are not negative evidence, but can still justify a question.
   // Prioritize questions that divide the remaining candidates, including
   // known-vs-unknown splits. Avoid questions with almost no informative facts.
   if(yes+no<.08)continue;
   const probabilityYes=yes+unknown*.5;
   const gain=entropy(probabilityYes)*(yes+no*.9+unknown*.3);
   if(gain>bestGain+1e-8){best=q;bestGain=gain}
  }
  // If weighted selection found no split, ask an unasked trait that can
  // distinguish any of the remaining candidates before guessing names.
  if(!best&&this.history.length<12){
   const top=ranked.slice(0,Math.min(12,ranked.length));
   let fallback=-1;
   for(const q of questions){
    if(asked.has(q.id)||this.implied(q.id))continue;
    if(this.category&&Object.hasOwn(CATEGORIES,q.id))continue;
    const yes=top.filter(x=>fact(x.entry,q.id)===1).length;
    const no=top.filter(x=>fact(x.entry,q.id)===0).length;
    const score=Math.min(yes,no)*3+yes+no;
    if(yes>0&&score>fallback){fallback=score;best=q}
   }
  }
  this.question=best;
 }
 answer(a){
  if(!this.question||!(a in RESPONSE_PROB))return;
  this.history.push({id:this.question.id,question:this.question.text,answer:a});
  this.next();
 }
 undo(){if(!this.history.length)return;this.history.pop();this.next()}
 candidate(){return this.scores()[0]?.entry||null}
 shouldGuess(){
  const ranked=this.scores();if(!ranked.length)return false;
  if(this.history.length<3&&this.question)return false;
  // When no useful questions remain, try candidates rather than ending without a guess.
  // Never make a name guess from only two broad traits. With no useful
  // questions left, a guess is allowed only after a minimum evidence floor.
  if(!this.question||this.history.length>=30)return this.history.length>=6;
  const top=ranked[0].probability,runnerUp=ranked[1]?.probability||0;
  // Prefer a useful discriminating question over an early name guess.
  return (this.history.length>=12&&top>=.97&&top-runnerUp>=.85)||(this.history.length>=20&&top>=.8&&top-runnerUp>=.6);
 }
 guessWrong(){
  const candidate=this.candidate();if(candidate)this.rejected.push(candidate.id);
  this.guesses++;this.next();
 }
 historyLines(){return this.history.map((h,i)=>({number:i+1,question:h.question||LABELS[h.id]||h.id,answer:ANSWERS.find(a=>a[0]===h.answer)?.[1]||h.answer}))}
}
export {fact};
