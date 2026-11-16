import test from 'node:test';
import assert from 'node:assert/strict';
import {Game,fact} from '../js/engine.js';
import {entries} from '../js/data.js';
test('category questions reflect definite category facts',()=>{
 const dog=entries.find(x=>x.name==='Dog');
 assert.equal(fact(dog,'animal'),1);
 assert.equal(fact(dog,'object'),0);
 assert.equal(fact(dog,'science'),.5);
});
test('category play excludes other categories',()=>{
 const g=new Game('animals');
 assert.ok(g.scores().every(x=>x.entry.category==='animals'));
});
test('No to animal sharply reduces animal probability',()=>{
 const g=new Game();
 g.question={id:'animal',text:'Is it an animal?'};
 g.answer('no');
 const scores=g.scores();
 const animal=scores.filter(x=>x.entry.category==='animals').reduce((s,x)=>s+x.probability,0);
 assert.ok(animal<.05,'animal probability '+animal);
});
test('Yes to animal makes animal category dominant',()=>{
 const g=new Game();
 g.question={id:'animal',text:'Is it an animal?'};
 g.answer('yes');
 const animal=g.scores().filter(x=>x.entry.category==='animals').reduce((s,x)=>s+x.probability,0);
 assert.ok(animal>.7,'animal probability '+animal);
 assert.notEqual(g.question?.id,'animal');
});
test('history, undo and unknown response',()=>{
 const g=new Game('objects');
 const first=g.question;
 assert.ok(first);
 g.answer('unknown');
 assert.equal(g.historyLines()[0].question,first.text);
 g.undo();
 assert.equal(g.history.length,0);
 assert.ok(g.question);
});
test('question limit and rejected guesses',()=>{
 const g=new Game('people');
 for(let i=0;i<30;i++){g.question={id:'q'+i,text:'Question '+i};g.answer('unknown')}
 assert.equal(g.question,null);
 assert.equal(g.shouldGuess(),true);
 const first=g.candidate().id;g.guessWrong();
 assert.ok(!g.scores().some(x=>x.entry.id===first));
});

test('London and Paris have distinct, explicit geography',()=>{
 const london=entries.find(x=>x.name==='London');
 const paris=entries.find(x=>x.name==='Paris');
 assert.equal(fact(london,'uk'),1);
 assert.equal(fact(london,'france'),0);
 assert.equal(fact(paris,'france'),1);
 assert.equal(fact(paris,'uk'),0);
 assert.equal(fact(london,'landmark'),0);
});
test('European city answers exclude incompatible place types and countries',()=>{
 const g=new Game('places');
 g.question={id:'europe',text:'Is it in Europe?'};g.answer('yes');
 assert.notEqual(g.question?.id,'usa');
 g.question={id:'city',text:'Is it a city?'};g.answer('yes');
 assert.notEqual(g.question?.id,'landmark');
 assert.notEqual(g.question?.id,'country');
 const names=g.scores().map(x=>x.entry.name);
 assert.ok(names.includes('London'));
 assert.ok(names.includes('Paris'));
 assert.ok(!names.includes('New York City'));
 assert.ok(!names.includes('Eiffel Tower'));
 assert.ok(g.scores().every(x=>x.entry.yes.includes('city')));
});
test('United Kingdom answer separates London from Paris',()=>{
 const g=new Game('places');
 g.question={id:'europe',text:'Is it in Europe?'};g.answer('yes');
 g.question={id:'city',text:'Is it a city?'};g.answer('yes');
 g.question={id:'uk',text:'Is it in the United Kingdom?'};g.answer('yes');
 assert.equal(g.candidate().name,'London');
 assert.notEqual(g.question?.id,'france');
 assert.notEqual(g.question?.id,'usa');
});

test('fictional character play asks traits before guessing names',()=>{
 const g=new Game('characters');
 assert.ok(g.question,'first question must exist');
 assert.equal(g.shouldGuess(),false,'do not guess immediately');
 for(let i=0;i<3;i++){
  assert.ok(g.question,'question '+(i+1)+' should exist');
  assert.equal(g.shouldGuess(),false,'no premature guess at '+i);
  g.answer('unknown');
 }
 assert.ok(g.question,'continue asking after three unknown answers');
});
test('characters have meaningful positive and negative trait facts',()=>{
 const sherlock=entries.find(x=>x.name==='Sherlock Holmes');
 const batman=entries.find(x=>x.name==='Batman');
 assert.equal(fact(sherlock,'detective'),1);
 assert.equal(fact(sherlock,'superhero'),0);
 assert.equal(fact(batman,'superhero'),1);
});
test('all categories start with an actual question, not a guess',()=>{
 for(const category of ['people','characters','animals','places','objects']){
  const g=new Game(category);
  assert.ok(g.question,category+' must have a question');
  assert.equal(g.shouldGuess(),false,category+' must not guess immediately');
 }
});

test('learned candidates participate in category games',()=>{
 const custom={id:'animals-cheetah',name:'Cheetah',category:'animals',yes:['mammal'],no:['pet'],aliases:[]};
 const g=new Game('animals',[custom]);
 assert.ok(g.pool.some(x=>x.name==='Cheetah'));
 assert.ok(g.question);
 assert.equal(fact(custom,'pet'),0);
});
test('learning validation rejects contradictory facts',async()=>{
 const {validEntry}=await import('../js/storage.js');
 assert.equal(validEntry({id:'animals-cheetah',name:'Cheetah',category:'animals',yes:['mammal'],no:['mammal']}),false);
 assert.equal(validEntry({id:'animals-cheetah',name:'Cheetah',category:'animals',yes:['mammal'],no:['pet']}),true);
});


test('expanded knowledge includes musician, instrument, and fast animal',()=>{
 assert.ok(entries.length>=120);
 for(const name of ['Bruce Springsteen','Guitar','Cheetah'])assert.ok(entries.some(e=>e.name===name));
 assert.equal(fact(entries.find(e=>e.name==='Bruce Springsteen'),'rock'),1);
 assert.equal(fact(entries.find(e=>e.name==='Guitar'),'instrument'),1);
});
test('learned facts override built-in facts without duplicate candidates',()=>{
 const learned={id:'people-bruce-springsteen',name:'Bruce Springsteen',category:'people',yes:['alive','music'],no:[],aliases:[]};
 const g=new Game('people',[learned]);
 assert.equal(g.pool.filter(e=>e.name==='Bruce Springsteen').length,1);
 assert.equal(fact(g.pool.find(e=>e.name==='Bruce Springsteen'),'rock'),1);
 assert.equal(fact(g.pool.find(e=>e.name==='Bruce Springsteen'),'music'),1);
});
test('learned unrecorded traits remain unknown',()=>{
 const learned={id:'people-sample',name:'Sample',category:'people',yes:['music'],no:[],aliases:[]};
 assert.equal(fact(learned,'rock'),.5);
});
test('question selection can distinguish musicians by genre',()=>{
 const g=new Game('people');
 g.question={id:'music',text:'Is it associated with music?'};g.answer('yes');
 const eligible=['alive','historical','science','sports','rock','pop','countryMusic','american','british','guitarist','solo','male','female','actor','politics'];
 assert.ok(g.question&&eligible.includes(g.question.id),'expected a useful musician trait, got '+g.question?.id);
});

test('cheetah has distinctive traits unlike lion and tiger',()=>{
 const cheetah=entries.find(e=>e.name==='Cheetah');
 const lion=entries.find(e=>e.name==='Lion');
 const tiger=entries.find(e=>e.name==='Tiger');
 assert.equal(fact(cheetah,'fastestLand'),1);
 assert.equal(fact(lion,'fastestLand'),0);
 assert.equal(fact(tiger,'fastestLand'),0);
 assert.equal(fact(cheetah,'spotted'),1);
 assert.equal(fact(tiger,'striped'),1);
});
test('animal game keeps asking diagnostic questions before early guesses',()=>{
 const g=new Game('animals');
 g.question={id:'mammal',text:'Is it a mammal?'};g.answer('yes');
 g.question={id:'wild',text:'Is it wild?'};g.answer('yes');
 g.question={id:'fast',text:'Is it fast?'};g.answer('yes');
 assert.equal(g.shouldGuess(),false);
 assert.ok(g.question,'should continue with a distinguishing question');
});

test('speed and no stripes should not trigger a horse guess',()=>{
 const g=new Game('animals');
 g.question={id:'fast',text:'Is the animal known for speed?'};g.answer('yes');
 g.question={id:'striped',text:'Does it have stripes?'};g.answer('no');
 assert.ok(g.question,'must ask another distinguishing question');
 assert.equal(g.shouldGuess(),false,'two broad facts are insufficient to guess');
});
test('a cheetah can be distinguished by fastest land animal',()=>{
 const g=new Game('animals');
 g.question={id:'fast',text:'Is the animal known for speed?'};g.answer('yes');
 g.question={id:'striped',text:'Does it have stripes?'};g.answer('no');
 g.question={id:'fastestLand',text:'Is it the fastest land animal?'};g.answer('yes');
 assert.equal(g.candidate()?.name,'Cheetah');
});

test('never guess horse after just speed and stripes even if no question selected',()=>{
 const g=new Game('animals');
 g.question={id:'fast',text:'Fast?'};g.answer('yes');
 g.question={id:'striped',text:'Striped?'};g.answer('no');
 g.question=null;
 assert.equal(g.shouldGuess(),false);
});
test('lion is not tagged as an animal especially known for speed',()=>{
 assert.equal(fact(entries.find(e=>e.name==='Lion'),'fast'),0);
 assert.equal(fact(entries.find(e=>e.name==='Cheetah'),'fast'),1);
});

test('Africa cannot resurrect elephant and giraffe after fast and spots',()=>{
 const g=new Game('animals');
 for(const [id,answer] of [['fast','yes'],['striped','no'],['spotted','yes'],['mane','no'],['africa','yes']]){
  g.question={id,text:id};g.answer(answer);
 }
 const ranked=g.scores().map(x=>x.entry.name);
 assert.equal(ranked[0],'Cheetah');
 assert.ok(!ranked.includes('Elephant'));
 assert.ok(!ranked.includes('Giraffe'));
 assert.ok(!ranked.includes('Lion'));
});
test('contradictory evidence never restores excluded candidates',()=>{
 const g=new Game('animals');
 g.question={id:'mammal',text:'Mammal?'};g.answer('yes');
 g.question={id:'bird',text:'Bird?'};g.answer('yes');
 assert.equal(g.scores().length,0);
 assert.equal(g.candidate(),null);
});

test('five questions with no remaining useful question can produce a guess',()=>{
 const g=new Game('animals');
 for(const [id,answer] of [['fast','yes'],['striped','no'],['spotted','yes'],['mane','no'],['africa','yes']]){
  g.question={id,text:id};g.answer(answer);
 }
 g.question=null;
 assert.equal(g.candidate()?.name,'Cheetah');
 assert.equal(g.shouldGuess(),true);
});
test('exhausted candidate pool continues collecting facts',()=>{
 const g=new Game('animals');
 g.question={id:'mammal',text:'Mammal?'};g.answer('yes');
 g.question={id:'bird',text:'Bird?'};g.answer('yes');
 assert.equal(g.candidate(),null);
 assert.ok(g.question,'should continue asking instead of ending after two conflicting facts');
});

test('animal category begins with mammal classification',()=>{
 const g=new Game('animals');
 assert.equal(g.question?.id,'mammal');
});
test('cheetah confirmation phase asks a relevant distinguishing question',()=>{
 const g=new Game('animals');
 for(const [id,answer] of [['mammal','yes'],['carnivore','yes'],['pet','no'],['fast','yes'],['fastestLand','yes']]){
  g.question={id,text:id};g.answer(answer);
 }
 assert.equal(g.candidate()?.name,'Cheetah');
 assert.ok(g.shouldGuess()||g.question,'should confirm or guess rather than end');
 if(g.question){
  assert.notEqual(g.question.id,'fastestLand');
  const q=g.question;g.answer(fact(g.pool.find(e=>e.name==='Cheetah'),q.id)===1?'yes':'no');
  assert.equal(g.candidate()?.name,'Cheetah');
 }
});

test('elephant six-answer history does not concede without a guess',()=>{
 const g=new Game('animals');
 for(const [id,answer] of [['mammal','yes'],['large','yes'],['africa','yes'],['water','no'],['mane','no'],['wild','yes']]){
  g.question={id,text:id};g.answer(answer);
 }
 assert.ok(g.scores().some(x=>x.entry.name==='Elephant'));
 assert.ok(g.question||g.shouldGuess(),'must ask or guess, not concede');
});
test('animal missing facts remain unknown rather than implicit no',()=>{
 const elephant=entries.find(x=>x.name==='Elephant');
 assert.equal(fact(elephant,'spotted'),0);
 assert.equal(fact(elephant,'reptile'),0,'known mammal excludes reptile taxonomy');
 assert.equal(fact(elephant,'large'),1);
 assert.equal(fact(entries.find(x=>x.name==='Giraffe'),'spotted'),1);
});

test('expanded built-in database includes cow and broad animal groups',()=>{
 const animals=entries.filter(e=>e.category==='animals');
 assert.ok(animals.length>=150,'animal entries: '+animals.length);
 for(const name of ['Cow','Sheep','Goat','Pig','Chicken','Duck','Rabbit','Buffalo','Bison','Frog','Salmon','Spider']){
  assert.ok(animals.some(e=>e.name===name),name+' missing');
 }
});
test('cow facts and taxonomy remain internally consistent',()=>{
 const cow=entries.find(e=>e.name==='Cow');
 assert.equal(fact(cow,'mammal'),1);
 assert.equal(fact(cow,'farm'),1);
 assert.equal(fact(cow,'herbivore'),1);
 assert.equal(fact(cow,'bird'),0);
 assert.equal(fact(cow,'spotted'),.5,'cows may be spotted or solid-colored');
});
test('farm mammal answers retain cow and exclude wild cheetah',()=>{
 const g=new Game('animals');
 for(const [id,answer] of [['mammal','yes'],['farm','yes'],['domesticated','yes'],['herbivore','yes']]){
  g.question={id,text:id};g.answer(answer);
 }
 assert.ok(g.scores().some(x=>x.entry.name==='Cow'));
 assert.ok(!g.scores().some(x=>x.entry.name==='Cheetah'));
});
test('cheetah and elephant remain viable in expanded database',()=>{
 for(const [name,answers] of [
  ['Cheetah',[['mammal','yes'],['fast','yes'],['fastestLand','yes'],['spotted','yes'],['africa','yes']]],
  ['Elephant',[['mammal','yes'],['large','yes'],['africa','yes'],['water','no'],['mane','no'],['wild','yes']]]
 ]){
  const g=new Game('animals');
  for(const [id,answer] of answers){g.question={id,text:id};g.answer(answer)}
  assert.ok(g.scores().some(x=>x.entry.name===name),name+' eliminated');
 }
});

test('no to speed suppresses fastest land animal follow-up',()=>{
 const g=new Game('animals');
 g.question={id:'fast',text:'Known for speed?'};g.answer('no');
 assert.equal(g.implied('fastestLand'),true);
 assert.notEqual(g.question?.id,'fastestLand');
});
test('yes to fastest land animal suppresses generic speed follow-up',()=>{
 const g=new Game('animals');
 g.question={id:'fastestLand',text:'Fastest land animal?'};g.answer('yes');
 assert.equal(g.implied('fast'),true);
 assert.notEqual(g.question?.id,'fast');
});
test('elephant history does not ask fastest land animal after no to speed',()=>{
 const g=new Game('animals');
 for(const [id,answer] of [['mammal','yes'],['large','yes'],['herbivore','yes'],['hooves','no'],['water','no'],['spotted','no'],['fast','no']]){
  g.question={id,text:id};g.answer(answer);
 }
 assert.notEqual(g.question?.id,'fastestLand');
 assert.ok(g.scores().some(x=>x.entry.name==='Elephant'));
});

test('horns alone do not make bull a better answer than cow',()=>{
 const g=new Game('animals');
 for(const [id,answer] of [['mammal','yes'],['large','yes'],['herbivore','yes'],['hooves','yes'],['domesticated','yes'],['farm','yes'],['horns','yes']]){
  g.question={id,text:id};g.answer(answer);
 }
 const ranked=g.scores().map(x=>x.entry.name);
 assert.ok(ranked.includes('Cow'),'cow must remain possible with horns');
 assert.ok(ranked.indexOf('Cow')<ranked.indexOf('Bull'),'generic cow should outrank bull before sex is confirmed');
 assert.equal(g.question?.id,'specificallyMale');
});
test('explicit male answer can favor bull over cow',()=>{
 const g=new Game('animals');
 for(const [id,answer] of [['mammal','yes'],['large','yes'],['herbivore','yes'],['hooves','yes'],['domesticated','yes'],['farm','yes'],['horns','yes'],['specificallyMale','yes']]){
  g.question={id,text:id};g.answer(answer);
 }
 assert.ok(g.scores().some(x=>x.entry.name==='Bull'));
 assert.ok(!g.scores().some(x=>x.entry.name==='Cow'));
});

test('sleigh game narrows by broad type and transport mechanics before guessing',()=>{
 const g=new Game('objects');
 const target=entries.find(e=>e.name==='Sleigh');
 const path=[];
 for(let i=0;i<20&&!g.shouldGuess();i++){
  assert.ok(g.question,'must keep asking useful questions');
  const q=g.question;path.push(q.id);
  const value=fact(target,q.id);
  g.answer(value===1?'yes':value===0?'no':'unknown');
 }
 assert.equal(g.candidate()?.name,'Sleigh');
 assert.equal(g.shouldGuess(),true);
 for(const id of ['transport','landTravel','rails','engine','animalPulled','passengers','wheels'])assert.ok(path.includes(id),id);
 assert.ok(path.indexOf('transport')<path.indexOf('animalPulled'));
 assert.ok(path.indexOf('animalPulled')<path.indexOf('wheels'));
});
test('carriage remains possible until wheels distinguish it from sleigh',()=>{
 const g=new Game('objects');
 for(const [id,answer] of [['transport','yes'],['landTravel','yes'],['rails','no'],['engine','no'],['animalPulled','yes'],['passengers','yes']]){
  g.question={id,text:id};g.answer(answer);
 }
 let names=g.scores().map(x=>x.entry.name);
 assert.ok(names.includes('Sleigh'));assert.ok(names.includes('Horse-drawn carriage'));
 g.question={id:'wheels',text:'Wheels?'};g.answer('no');
 names=g.scores().map(x=>x.entry.name);
 assert.ok(names.includes('Sleigh'));assert.ok(!names.includes('Horse-drawn carriage'));
 assert.ok(!names.includes('Bicycle'));
});
test('transport details require an established transport branch',()=>{
 const g=new Game('objects');
 for(const id of ['landTravel','rails','engine','animalPulled','passengers','wheels','twoWheels','runners'])assert.equal(g.eligible({id}),false,id);
 g.question={id:'transport',text:'Transport?'};g.answer('no');
 for(const id of ['landTravel','rails','engine','animalPulled','passengers','wheels','twoWheels','runners'])assert.equal(g.eligible({id}),false,id);
});
test('no to wheels suppresses two-wheel follow-up and undo restores eligibility',()=>{
 const g=new Game('objects');
 for(const [id,answer] of [['transport','yes'],['landTravel','yes'],['wheels','yes']]){g.question={id,text:id};g.answer(answer)}
 assert.equal(g.eligible({id:'twoWheels'}),true);
 g.undo();g.question={id:'wheels',text:'Wheels?'};g.answer('no');
 assert.equal(g.eligible({id:'twoWheels'}),false);
 assert.notEqual(g.question?.id,'twoWheels');
});
test('probably and unknown do not establish a prerequisite as certain',()=>{
 for(const answer of ['probably','unknown']){
  const g=new Game('objects');g.question={id:'transport',text:'Transport?'};g.answer(answer);
  assert.equal(g.eligible({id:'landTravel'}),false);
  assert.equal(g.implied('landTravel'),false);
 }
});
test('music genres wait for music and object games exclude animal questions',()=>{
 const g=new Game('people');assert.equal(g.eligible({id:'rock'}),false);
 g.question={id:'music',text:'Music?'};g.answer('yes');
 assert.equal(g.eligible({id:'rock'}),true);
 const o=new Game('objects');assert.equal(o.eligible({id:'mammal'}),false);
 assert.equal(o.eligible({id:'specificallyMale'}),false);
});
test('no to mammal suppresses mammal anatomy across selection paths',()=>{
 const g=new Game('animals');g.answer('no');
 for(const id of ['hooves','horns','antlers','wool','mane'])assert.equal(g.eligible({id}),false,id);
});
test('unknown learned transport mechanics stay unknown',()=>{
 const learned={id:'objects-custom-cart',name:'Custom cart',category:'objects',yes:['transport'],no:[],aliases:[]};
 assert.equal(fact(learned,'wheels'),.5);
 assert.equal(fact(learned,'engine'),.5);
});

test('telephone screenshot answers retain both phone types through the power question',()=>{
 const g=new Game('objects');
 const answers=[['handheld','yes'],['indoors','yes'],['transport','no'],['instrument','no'],['electronic','yes'],['powered','yes'],['large','no'],['kitchen','no'],['communication','yes'],['flight','no'],['wooden','no'],['sportEquipment','no']];
 for(const [id,answer] of answers){
  g.question={id,text:id};g.answer(answer);
  const names=g.scores().map(x=>x.entry.name);
  assert.ok(names.includes('Telephone'),'Telephone lost at '+id);
  assert.ok(names.includes('Smartphone'),'Smartphone lost at '+id);
 }
 const names=g.scores().map(x=>x.entry.name);
 assert.ok(!names.includes('Camera'));assert.ok(!names.includes('Flashlight'));
});
test('all explicitly electrical objects and engine-driven vehicles have power facts',()=>{
 for(const e of entries.filter(e=>e.category==='objects'&&(e.yes.includes('electronic')||e.yes.includes('engine'))))assert.equal(fact(e,'powered'),1,e.name);
 const unrecorded={id:'objects-unknown-power',name:'Unknown power',category:'objects',yes:['object']};
 assert.equal(fact(unrecorded,'powered'),.5);
});
test('telephone and smartphone full games ask communication before the first guess',()=>{
 for(const name of ['Telephone','Smartphone']){
  const g=new Game('objects'),target=entries.find(e=>e.name===name);
  for(let i=0;i<20&&!g.shouldGuess()&&g.question;i++){
   const q=g.question,value=fact(target,q.id);
   g.answer(value===1?'yes':value===0?'no':'unknown');
  }
  assert.equal(g.shouldGuess(),true,name);
  assert.equal(g.candidate()?.name,name);
  assert.ok(g.history.some(h=>h.id==='communication'&&h.answer==='yes'));
  assert.ok(!g.history.some(h=>h.id==='powered'),'electricity already establishes power');
 }
});
test('phone follow-ups require communication and phone-call facts',()=>{
 const g=new Game('objects');
 assert.equal(g.eligible({id:'phoneCalls'}),false);
 assert.equal(g.eligible({id:'mobilePhone'}),false);
 g.question={id:'communication',text:'Communication?'};g.answer('yes');
 assert.equal(g.eligible({id:'phoneCalls'}),true);
 assert.equal(g.eligible({id:'mobilePhone'}),false);
 g.question={id:'phoneCalls',text:'Calls?'};g.answer('yes');
 assert.equal(g.eligible({id:'mobilePhone'}),true);
});
test('no to mobile phone separates a landline from smartphone',()=>{
 const g=new Game('objects');
 for(const [id,answer] of [['handheld','yes'],['indoors','yes'],['transport','no'],['electronic','yes'],['communication','yes'],['phoneCalls','yes'],['mobilePhone','no']]){
  g.question={id,text:id};g.answer(answer);
 }
 assert.equal(g.candidate()?.name,'Telephone');
 assert.ok(!g.scores().some(x=>x.entry.name==='Smartphone'));
});
test('electrical power inference suppresses redundant questions but undo restores them',()=>{
 const g=new Game('objects');g.question={id:'electronic',text:'Electricity?'};g.answer('yes');
 assert.equal(g.implied('powered'),true);
 g.undo();assert.equal(g.implied('powered'),false);
});
test('learned phone overrides retain explicit user facts and unknown power remains unknown',()=>{
 const learned={id:'objects-smartphone',name:'Smartphone',category:'objects',yes:['communication'],no:['touchscreen'],aliases:[]};
 const g=new Game('objects',[learned]),phone=g.pool.find(e=>e.id===learned.id);
 assert.equal(fact(phone,'powered'),1);assert.equal(fact(phone,'touchscreen'),0);
 assert.equal(g.pool.filter(e=>e.id===learned.id).length,1);
 const custom={id:'objects-custom-phone',name:'Custom phone',category:'objects',yes:['communication'],no:[]};
 assert.equal(fact(custom,'powered'),.5);
});

test('handheld indoor object continues toward electricity rather than transportation',()=>{
 const g=new Game('objects');
 assert.equal(g.question.id,'handheld');g.answer('yes');
 assert.equal(g.question.id,'indoors');g.answer('yes');
 assert.equal(g.question.id,'electronic');
});
test('outdoor nonhandheld object continues toward transportation',()=>{
 const g=new Game('objects');g.answer('no');g.answer('no');
 assert.equal(g.question.id,'transport');
});
test('phone games stay on purpose and phone details without unrelated questions',()=>{
 for(const name of ['Telephone','Smartphone']){
  const g=new Game('objects'),target=entries.find(e=>e.name===name),path=[];
  for(let i=0;i<20&&!g.shouldGuess()&&g.question;i++){
   const q=g.question,value=fact(target,q.id);path.push(q.id);
   g.answer(value===1?'yes':value===0?'no':'unknown');
  }
  assert.equal(g.candidate()?.name,name);assert.equal(g.shouldGuess(),true);
  for(const id of ['transport','kitchen','sportEquipment','wooden','large','flight','instrument','powered'])assert.ok(!path.includes(id),name+' asked '+id);
  for(const id of ['electronic','communication','phoneCalls','mobilePhone'])assert.ok(path.includes(id),name+' omitted '+id);
  assert.ok(path.indexOf('communication')<path.indexOf('phoneCalls'));
  assert.ok(path.indexOf('phoneCalls')<path.indexOf('mobilePhone'));
 }
});
test('indoor context does not falsely rule out transportation',()=>{
 const learned={id:'objects-indoor-cart',name:'Indoor cart',category:'objects',yes:['object','handheld','indoors','transport'],no:['electronic','instrument','kitchen','communication','sportEquipment'],aliases:[]};
 const g=new Game('objects',[learned]);
 for(const answer of ['yes','yes','no'])g.answer(answer);
 assert.ok(g.scores().some(x=>x.entry.id===learned.id));
 for(let i=0;i<10&&g.question&&g.question.id!=='transport';i++)g.answer('no');
 assert.equal(g.question?.id,'transport');
});
test('unknown indoor answer keeps broad purpose questions available',()=>{
 const g=new Game('objects');g.answer('yes');g.answer('unknown');
 assert.ok(g.question);assert.ok(['electronic','instrument','kitchen','communication','sportEquipment','transport'].includes(g.question.id));
 assert.equal(g.established('indoors'),null);
});
test('undo reopens the appropriate context branch',()=>{
 const g=new Game('objects');g.answer('yes');g.answer('yes');
 assert.equal(g.question.id,'electronic');
 g.undo();assert.equal(g.question.id,'indoors');
 g.answer('no');assert.notEqual(g.question.id,'phoneCalls');
 assert.equal(g.history.length,2);
});
test('camera and flashlight separate by purpose without transportation questions',()=>{
 for(const name of ['Camera','Flashlight']){
  const target=entries.find(e=>e.name===name),g=new Game('objects');
  for(let i=0;i<20&&!g.shouldGuess()&&g.question;i++){
   const value=fact(target,g.question.id);g.answer(value===1?'yes':value===0?'no':'unknown');
  }
  assert.equal(g.candidate()?.name,name);assert.equal(g.shouldGuess(),true);
  assert.ok(g.history.some(h=>h.id==='photography'));
  assert.ok(!g.history.some(h=>h.id==='transport'));
 }
});
test('instrument confirmation stays within instrument details',()=>{
 const target=entries.find(e=>e.name==='Guitar'),g=new Game('objects');
 for(let i=0;i<20&&!g.shouldGuess()&&g.question;i++){
  const value=fact(target,g.question.id);g.answer(value===1?'yes':value===0?'no':'unknown');
 }
 const index=g.history.findIndex(h=>h.id==='instrument'&&h.answer==='yes');
 assert.ok(index>=0);
 for(const h of g.history.slice(index+1))assert.ok(['strings','wooden','electronic'].includes(h.id),h.id);
});
