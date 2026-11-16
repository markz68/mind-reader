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
