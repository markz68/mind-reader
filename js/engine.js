import {entries,questions} from './data.js?v=0.6.1';
export const ANSWERS=[['yes','Yes'],['no','No'],['probably','Probably'],['probablyNot','Probably not'],['unknown',"Don't know"]];
const CATEGORIES={real:'people',fictional:'characters',animal:'animals',place:'places',object:'objects'};
const EXCLUSIVE_GROUPS=[Object.keys(CATEGORIES),['country','city','landmark'],['uk','france','ireland','usa']];
const PLACE_TYPES=new Set(['country','city','landmark']);
const REGIONS=new Set(['europe','usa','uk','france','ireland']);
const CATEGORY_TRAITS={people:new Set(['alive','historical','science','music','sports','royalty','space']),characters:new Set(['superhero','magic','movie','television','book','detective','space','royalty']),animals:new Set(['mammal','bird','water','pet','large','flight']),objects:new Set(['electronic','transport','kitchen','handheld','communication','flight','large'])};

// Narrow details require the broader subject to have been established.
const ANIMAL_QUESTIONS=new Set('mammal bird pet fast fastestLand striped spotted mane wild carnivore africa reptile insect farm domesticated herbivore omnivore hooves horns wool antlers eggs fish amphibian arachnid invertebrate insectivore arctic desert specificallyMale'.split(' '));
const OBJECT_QUESTIONS=new Set('electronic transport kitchen handheld communication instrument strings wooden powered sportEquipment indoors landTravel rails engine twoWheels animalPulled passengers wheels runners phoneCalls mobilePhone touchscreen'.split(' '));
const PERSON_QUESTIONS=new Set('american british male female'.split(' '));
const MUSIC_QUESTIONS=new Set('rock pop countryMusic solo guitarist'.split(' '));
const PARENTS={phoneCalls:'communication',mobilePhone:'phoneCalls',touchscreen:'communication',hooves:'mammal',horns:'mammal',wool:'mammal',antlers:'mammal',mane:'mammal',fastestLand:'fast',rock:'music',pop:'music',countryMusic:'music',solo:'music',guitarist:'music',strings:'instrument',landTravel:'transport',rails:'landTravel',engine:'transport',twoWheels:'wheels',animalPulled:'landTravel',passengers:'transport',wheels:'landTravel',runners:'landTravel'};

const LABELS=Object.fromEntries(questions.map(q=>[q.id,q.text]));
const RESPONSE_PROB={yes:.96,no:.04,probably:.73,probablyNot:.27,unknown:null};
const entropy=p=>p<=0||p>=1?0:-p*Math.log2(p)-(1-p)*Math.log2(1-p);
const groupFor=id=>EXCLUSIVE_GROUPS.find(group=>group.includes(id));
function fact(entry,id){
 if(Object.hasOwn(CATEGORIES,id))return CATEGORIES[id]===entry.category?1:0;
 if(entry.yes.includes(id))return 1;
 if(entry.no?.includes(id))return 0;
 // Personal answers record only confirmed facts. Unanswered traits are unknown.
 if(Array.isArray(entry.no)){
  if(entry.builtIn&&CATEGORY_TRAITS[entry.category]?.has(id))return 0;
  return .5;
 }
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
 if(entry.category==='animals'&&['fast','fastestLand','striped','spotted','mane','wild','carnivore','africa','asia','ocean','reptile','insect','farm','domesticated','herbivore','omnivore','hooves','horns','wool','antlers','eggs','fish','amphibian','arachnid','invertebrate','insectivore','arctic','desert','specificallyMale'].includes(id))return 0;
 if(entry.category==='objects'&&['instrument','strings','wooden','sportEquipment'].includes(id))return 0;
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
  this.category=category;this.pool=[...entries.filter(e=>!learned.some(l=>l.id===e.id)),...learned.map(l=>{const builtIn=entries.find(e=>e.id===l.id);if(!builtIn)return l;const yes=[...new Set([...builtIn.yes.filter(x=>!l.no.includes(x)),...l.yes])];return {...l,yes,no:l.no,curated:true}})].filter(e=>!category||e.category===category);
  this.history=[];this.rejected=[];this.guesses=0;this.question=null;this.done=false;this.confirmation=null;
  this.next();
 }
 scores(){
  const available=this.pool.filter(e=>!this.rejected.includes(e.id));
  // If no recorded candidate matches all definite answers, retain uncertain
  // candidates for a graceful failure instead of pretending certainty.
  const compatible=available.filter(e=>consistent(e,this.history));
  // Never revive candidates contradicted by definite answers. This was
  // allowing elephants and giraffes back into a fast, spotted animal game.
  const candidates=compatible;
  const scored=candidates.map(entry=>{
   // Prefer the common animal name until evidence supports a sex-specific one.
   let logScore=entry.category==='animals'&&['Bull','Rooster'].includes(entry.name)?Math.log(.22):0;
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
 established(id){
  const explicit=[...this.history].reverse().find(h=>h.id===id&&['yes','no'].includes(h.answer));
  if(explicit)return explicit.answer==='yes';
  if(Object.hasOwn(CATEGORIES,id)&&this.category)return CATEGORIES[id]===this.category;
  return null;
 }
 eligible(q){
  const id=q.id;
  if(this.history.some(h=>h.id===id)||this.implied(id))return false;
  const category=this.category||Object.entries(CATEGORIES).find(([tag])=>this.established(tag)===true)?.[1];
  if(this.category&&Object.hasOwn(CATEGORIES,id))return false;
  if(category){
   if(ANIMAL_QUESTIONS.has(id)&&category!=='animals')return false;
   if(OBJECT_QUESTIONS.has(id)&&category!=='objects')return false;
   if((PERSON_QUESTIONS.has(id)||MUSIC_QUESTIONS.has(id))&&!['people','characters'].includes(category))return false;
  }
  if(PARENTS[id]&&this.established(PARENTS[id])!==true)return false;
  return true;
 }
 implied(id){
  const parent=PARENTS[id];
  if(parent&&this.established(parent)===false)return true;
  if(id==='powered'&&this.established('electronic')===true)return true;
  const group=groupFor(id);
  for(const h of this.history){
   if(h.answer!=='yes'&&h.answer!=='no')continue;
   if(h.id===id)return true;
   // An explicit answer to a broader trait makes its narrower follow-up redundant.
   if(id==='fastestLand'&&h.id==='fast'&&h.answer==='no')return true;
   if(id==='fast'&&h.id==='fastestLand'&&h.answer==='yes')return true;
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
  const ranked=this.scores();
  const asked=new Set(this.history.map(h=>h.id));
  if(!this.history.length&&this.category==='animals'){
   this.question=questions.find(q=>q.id==='mammal');return;
  }
  // Establish the broad object type before specialized details.
  const objectMode=this.category==='objects'||this.established('object')===true;
  if(objectMode){
   const broad=['handheld','indoors','transport'];
   const nextBroad=broad.find(id=>!asked.has(id)&&!this.implied(id));
   if(nextBroad){this.question=questions.find(q=>q.id===nextBroad);return}
   // Establish function before guessing from shape or materials.
   if(this.established('transport')===false){
    const functions=['electronic','communication','phoneCalls','mobilePhone','instrument','kitchen'];
    const nextFunction=functions.map(id=>questions.find(q=>q.id===id)).find(q=>this.eligible(q)&&ranked.some(x=>fact(x.entry,q.id)===1)&&ranked.some(x=>fact(x.entry,q.id)!==1));
    if(nextFunction){this.question=nextFunction;return}
   }
   if(this.established('transport')===true){
    const branch=['landTravel','rails','engine','animalPulled','passengers','wheels','twoWheels','runners'];
    const nextBranch=branch.map(id=>questions.find(q=>q.id===id)).find(q=>this.eligible(q)&&ranked.some(x=>fact(x.entry,q.id)===1)&&ranked.some(x=>fact(x.entry,q.id)!==1));
    if(nextBranch){this.question=nextBranch;return}
   }
  }
  // Start a short confirmation phase once one candidate clearly leads.
  // Reset it when later answers change the leader.
  const leader=ranked[0];
  const margin=(leader?.probability||0)-(ranked[1]?.probability||0);
  const ready=this.history.filter(h=>h.answer!=='unknown').length>=4&&leader&&leader.probability>=.78&&margin>=.55;
  if(!ready||this.confirmation?.id!==leader.entry.id){
   this.confirmation=ready?{id:leader.entry.id,start:this.history.length}:null;
  }
  // When all known candidates conflict, continue gathering facts for learning
  // instead of immediately declaring defeat.
  if(!ranked.length){
   const categoryQuestions={animals:new Set(['mammal','bird','water','pet','large','flight','fast','fastestLand','striped','spotted','mane','wild','carnivore','africa','asia','ocean','reptile','insect','farm','domesticated','herbivore','omnivore','hooves','horns','wool','antlers','eggs','fish','amphibian','arachnid','invertebrate','insectivore','arctic','desert']),people:new Set(['alive','historical','science','music','sports','royalty','space','american','british','rock','pop','countryMusic','solo','guitarist','actor','politics','male','female']),characters:new Set(['superhero','magic','movie','television','book','detective','space','royalty','american','british','male','female','animated','fantasy']),places:new Set(['country','city','landmark','europe','usa','uk','france','ireland','asia','fictionalWorld']),objects:new Set(['electronic','transport','kitchen','handheld','communication','flight','large','instrument','strings','wooden','powered','sportEquipment'])};
   this.question=questions.find(q=>this.eligible(q)&&(!this.category||categoryQuestions[this.category]?.has(q.id)))||null;
   return;
  }
  // Resolve Cow/Bull (and Chicken/Rooster) using sex, not horns.
  if(this.category==='animals'&&!asked.has('specificallyMale')){
   const topNames=new Set(ranked.slice(0,8).map(x=>x.entry.name));
   if((topNames.has('Cow')&&topNames.has('Bull'))||(topNames.has('Chicken')&&topNames.has('Rooster'))){
    const relevant=ranked.filter(x=>['Cow','Bull','Chicken','Rooster'].includes(x.entry.name)).reduce((s,x)=>s+x.probability,0);
    if(relevant>=.20&&this.history.length>=4){this.question=questions.find(q=>q.id==='specificallyMale');return}
   }
  }
  // During confirmation prefer a high-value fact of the leading candidate
  // that has not yet been established, especially one rivals lack.
  if(this.confirmation&&this.history.length-this.confirmation.start<2){
   let confirm=null,confirmScore=-1;
   for(const q of questions){
    if(!this.eligible(q))continue;
    if(this.category&&Object.hasOwn(CATEGORIES,q.id))continue;
    if(this.category==='animals'&&!['mammal','bird','water','pet','large','flight','fast','fastestLand','striped','spotted','mane','wild','carnivore','africa','asia','ocean','reptile','insect','farm','domesticated','herbivore','omnivore','hooves','horns','wool','antlers','eggs','fish','amphibian','arachnid','invertebrate','insectivore','arctic','desert'].includes(q.id))continue;
    const topFact=fact(leader.entry,q.id);
    if(topFact!==1&&topFact!==0)continue;
    const rivals=ranked.slice(1);
    const opposite=rivals.reduce((s,x)=>s+x.probability*(topFact===1?1-fact(x.entry,q.id):fact(x.entry,q.id)),0);
    // Only ask a confirmation question if it actually separates the leader
    // from a plausible rival. Otherwise guess rather than asking filler.
    if(opposite<.025)continue;
    const score=opposite+(topFact===1?.025:0);
    if(score>confirmScore){confirm=q;confirmScore=score}
   }
   if(confirm){this.question=confirm;return}
  }
  let best=null,bestGain=0;
  for(const q of questions){
   if(!this.eligible(q))continue;
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
   // Discourage near-universal questions among the remaining candidates.
   const separation=Math.min(yes,no)+Math.min(yes+no,1)*Math.min(yes,unknown)*.2;
   const adjustedGain=gain*(.25+.75*Math.min(1,separation*4));
   if(adjustedGain>bestGain+1e-8){best=q;bestGain=adjustedGain}
  }
  // If weighted selection found no split, ask an unasked trait that can
  // distinguish any of the remaining candidates before guessing names.
  if(!best&&this.history.length<30){
   const top=ranked.slice(0,Math.min(12,ranked.length));
   let fallback=-1;
   for(const q of questions){
    if(!this.eligible(q))continue;
    if(this.category&&Object.hasOwn(CATEGORIES,q.id))continue;
    const yes=top.filter(x=>fact(x.entry,q.id)===1).length;
    const no=top.filter(x=>fact(x.entry,q.id)===0).length;
    const score=Math.min(yes,no)*3+yes+no;
    if(yes>0&&score>fallback){fallback=score;best=q}
   }
  }
  // Never concede while an informative, unasked question remains.
  if(!best){
   const pool=ranked.slice(0,Math.min(8,ranked.length));
   best=questions.find(q=>this.eligible(q)&&(!this.category||!Object.hasOwn(CATEGORIES,q.id))&&pool.some(x=>fact(x.entry,q.id)===1))||null;
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
  if(this.history.length<4&&this.question)return false;
  // Ask a selected purpose/phone distinction before committing to a device.
  if(this.question&&['electronic','communication','phoneCalls','mobilePhone'].includes(this.question.id)&&this.eligible(this.question))return false;
  // Distinctive positive facts can justify a guess without a fixed 12-question minimum.
  const leader=ranked[0];
  const signature=this.history.filter(h=>h.answer==='yes'&&['fastestLand'].includes(h.id)&&fact(leader.entry,h.id)===1);
  if(signature.length&&this.history.length>=5&&leader.probability>=.7&&leader.probability-(ranked[1]?.probability||0)>=.45)return true;
  if(this.confirmation&&ranked[0].entry.id===this.confirmation.id){
   const confirmations=this.history.slice(this.confirmation.start).filter(h=>h.answer==='yes'||h.answer==='no'||h.answer==='probably'||h.answer==='probablyNot').length;
   if(confirmations>=1&&ranked[0].probability>=.9&&ranked[0].probability-(ranked[1]?.probability||0)>=.75)return true;
   if(confirmations>=2&&ranked[0].probability>=.78&&ranked[0].probability-(ranked[1]?.probability||0)>=.55)return true;
  }
  // When no useful questions remain, try candidates rather than ending without a guess.
  // Never make a name guess from only two broad traits. With no useful
  // questions left, a guess is allowed only after a minimum evidence floor.
  if(!this.question||this.history.length>=30)return this.history.length>=4;
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
