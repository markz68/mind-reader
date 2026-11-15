import {entries,questions} from './data.js';
export const ANSWERS=[['yes','Yes'],['no','No'],['probably','Probably'],['probablyNot','Probably not'],['unknown',"Don't know"]];
const CATEGORIES={real:'people',fictional:'characters',animal:'animals',place:'places',object:'objects'};
const CATEGORY_KEYS=Object.keys(CATEGORIES);
const LABELS=Object.fromEntries(questions.map(q=>[q.id,q.text]));
const RESPONSE_PROB={yes:.96,no:.04,probably:.73,probablyNot:.27,unknown:null};
const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
const entropy=p=>p<=0||p>=1?0:-p*Math.log2(p)-(1-p)*Math.log2(1-p);
function fact(entry,id){
  if(CATEGORY_KEYS.includes(id))return CATEGORIES[id]===entry.category?1:0;
  if(entry.yes.includes(id))return 1;
  // Absence of an attribute is UNKNOWN, not a negative fact.
  return .5;
}
export class Game{
 constructor(category=null){
  this.category=category;this.pool=entries.filter(e=>!category||e.category===category);
  this.history=[];this.rejected=[];this.guesses=0;this.question=null;this.done=false;this.guessPending=false;
  this.next();
 }
 scores(){
  const scored=this.pool.filter(e=>!this.rejected.includes(e.id)).map(entry=>{
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
 next(){
  this.guessPending=false;this.question=null;
  if(this.history.length>=30)return;
  const ranked=this.scores();if(!ranked.length)return;
  const asked=new Set(this.history.map(h=>h.id));
  let best=null,bestGain=0;
  for(const q of questions){
   if(asked.has(q.id))continue;
   if(this.category&&CATEGORY_KEYS.includes(q.id))continue;
   // Do not ask about a category ruled out by a definite answer.
   if(CATEGORY_KEYS.includes(q.id)&&this.history.some(h=>CATEGORY_KEYS.includes(h.id)&&h.answer==='yes'&&h.id!==q.id))continue;
   const knownWeight=ranked.reduce((s,x)=>s+(fact(x.entry,q.id)===.5?0:x.probability),0);
   if(knownWeight<.12)continue;
   const p=ranked.reduce((s,x)=>s+x.probability*fact(x.entry,q.id),0);
   const gain=entropy(p)*knownWeight;
   if(gain>bestGain+1e-8){best=q;bestGain=gain}
  }
  this.question=best;
 }
 answer(a){
  if(!this.question||!(a in RESPONSE_PROB))return;
  this.history.push({id:this.question.id,question:this.question.text,answer:a});
  this.next();
 }
 undo(){
  if(!this.history.length)return;
  this.history.pop();this.next();
 }
 candidate(){return this.scores()[0]?.entry||null}
 shouldGuess(){
  if(this.guessPending)return true;
  const ranked=this.scores();if(!ranked.length)return false;
  if(!this.question||this.history.length>=30)return true;
  if(this.history.length<4)return false;
  const top=ranked[0].probability,runnerUp=ranked[1]?.probability||0;
  // Guess only with substantial separation, or at the 20-question target.
  return top>=.78&&top-runnerUp>=.45 || this.history.length>=20&&top>=.38&&top-runnerUp>=.18;
 }
 guessWrong(){
  const candidate=this.candidate();if(candidate)this.rejected.push(candidate.id);
  this.guesses++;this.next();
 }
 historyLines(){return this.history.map((h,i)=>({number:i+1,question:h.question||LABELS[h.id]||h.id,answer:ANSWERS.find(a=>a[0]===h.answer)?.[1]||h.answer}))}
}
export {fact};
