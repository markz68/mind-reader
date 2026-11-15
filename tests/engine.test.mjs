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
