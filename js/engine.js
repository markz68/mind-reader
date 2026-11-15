import {entries,questions} from './data.js';
export const ANSWERS=[['yes','Yes'],['no','No'],['probably','Probably'],['probablyNot','Probably not'],['unknown',"Don't know"]];
const weights={yes:1,no:-1,probably:.45,probablyNot:-.45,unknown:0};
export class Game{
 constructor(category=null){this.category=category;this.pool=entries.filter(e=>!category||e.category===category);this.history=[];this.rejected=[];this.guesses=0;this.question=null;this.done=false;this.next()}
 scores(){return this.pool.map(e=>{let score=0;for(const h of this.history){const expected=e.yes.includes(h.id)?1:e.yes.includes(opposite[h.id])?-1:0;score+=expected*weights[h.answer]*2}return {entry:e,score}}).filter(x=>!this.rejected.includes(x.entry.id)).sort((a,b)=>b.score-a.score)}
 next(){if(this.history.length>=30){this.question=null;return}const asked=new Set(this.history.map(h=>h.id));const ranked=this.scores();const candidates=ranked.slice(0,Math.max(8,Math.ceil(ranked.length*.65)));let best=null,bestGain=-1;for(const q of questions){if(asked.has(q.id))continue;const positive=candidates.filter(x=>x.entry.yes.includes(q.id)).length;const negative=candidates.length-positive;const gain=Math.min(positive,negative);if(gain>bestGain){best=q;bestGain=gain}}this.question=bestGain>0?best:null}
 answer(a){if(!this.question||!(a in weights))return;this.history.push({id:this.question.id,answer:a});this.next()}
 undo(){if(!this.history.length)return;this.history.pop();this.rejected=[];this.guesses=0;this.done=false;this.next()}
 candidate(){return this.scores()[0]?.entry||null}
 shouldGuess(){const ranked=this.scores();if(!ranked.length)return false;if(!this.question||this.history.length>=20)return true;if(this.history.length<5)return false;const top=ranked[0].score,second=ranked[1]?.score??-99;return top-second>=3.5&&top>=5}
 guessWrong(){const candidate=this.candidate();if(candidate)this.rejected.push(candidate.id);this.guesses++;this.next()}
}
const opposite={};