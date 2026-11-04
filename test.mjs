import {test} from 'node:test';import assert from 'node:assert/strict';import {dayKey,puzzleFor,isCorrect} from './public/puzzles.js';
import {summarizeDistribution,guestDistribution} from './public/stats.js';
import {canRevealHint,hintKey} from './public/hints.js';

test('Hints unlock after three unsuccessful attempts, never on a solved run',()=>{
 for(const guesses of [[],['wrong'],['wrong','also wrong']])assert.equal(canRevealHint({guesses,solved:false}),false);
 assert.equal(canRevealHint({guesses:['a','b','c'],solved:false}),true);
 assert.equal(canRevealHint({guesses:['a','b','c','d'],solved:false}),true);
 assert.equal(canRevealHint({guesses:['a','b','answer'],solved:true}),false);
});
test('Every daily puzzle has a shorter initial clue and a fuller hint',()=>{
 for(let offset=0;offset<31;offset++){
  const day=new Date(Date.UTC(2026,10,2+offset)).toISOString().slice(0,10);
  const puzzle=puzzleFor(day);
  assert.ok(puzzle.clue.length>0);
  assert.ok(puzzle.hint.length>puzzle.clue.length, puzzle.answer);
  assert.notEqual(puzzle.clue,puzzle.hint);
 }
 assert.equal(puzzleFor('2026-11-04').answer,'jug');
 assert.equal(puzzleFor('2026-11-04').hint,'A large, positive handhold that is easy to wrap your fingers around.');
});
test('Hint reveals stay separate between dates, guests, and accounts',()=>{
 const keys=[hintKey('2026-11-04'),hintKey('2026-11-05'),hintKey('2026-11-04','user-a'),hintKey('2026-11-04','user-b')];
 assert.equal(new Set(keys).size,4);
});

test('Stats have no average before the first solve',()=>{
 const stats=summarizeDistribution([]);
 assert.equal(stats.solved,0);assert.equal(stats.average,null);
 assert.equal(stats.buckets.length,11);assert.ok(stats.buckets.every(bucket=>bucket.count===0));
});
test('Stats weight averages by puzzle count and preserve exact long solves',()=>{
 const stats=summarizeDistribution([{attempts:'1',count:'2'},{attempts:3,count:1},{attempts:11,count:1},{attempts:30,count:1}]);
 assert.equal(stats.solved,5);assert.equal(stats.average,46/5);
 assert.equal(stats.buckets[0].count,2);assert.equal(stats.buckets[2].count,1);
 assert.deepEqual(stats.buckets[10],{label:'11+',count:2});
 assert.equal(stats.buckets.reduce((total,bucket)=>total+bucket.count,0),stats.solved);
});
test('Guest stats include historical solves, ignore unfinished or malformed data',()=>{
 const entries=new Map([
  ['crux:2026-11-02',JSON.stringify({solved:true,guesses:['wrong','crux']})],
  ['crux:2026-11-03',JSON.stringify({solved:true,guesses:['dyno']})],
  ['crux:2026-11-04',JSON.stringify({solved:false,guesses:['wrong']})],
  ['crux:2026-11-05','invalid json'],
  ['crux:2026-11-06',JSON.stringify({solved:true,guesses:[]})],
  ['crux:2026-11-07',JSON.stringify({solved:true,guesses:[null]})],
  ['another-game',JSON.stringify({solved:true,guesses:['answer']})]
 ]);
 const storage={length:entries.size,key:index=>[...entries.keys()][index],getItem:key=>entries.get(key)};
 const stats=summarizeDistribution(guestDistribution(storage));
 assert.equal(stats.solved,2);assert.equal(stats.average,1.5);
 assert.equal(stats.buckets[0].count,1);assert.equal(stats.buckets[1].count,1);
});
test('Stats ignore invalid attempt counts and frequencies',()=>{
 const stats=summarizeDistribution([{attempts:0,count:5},{attempts:2,count:-1},{attempts:1.5,count:1},{attempts:'bad',count:1},{attempts:2,count:1}]);
 assert.equal(stats.solved,1);assert.equal(stats.average,2);
});
test('New York midnight in winter',()=>{assert.equal(dayKey(new Date('2026-11-03T04:59:59Z')),'2026-11-02');assert.equal(dayKey(new Date('2026-11-03T05:00:00Z')),'2026-11-03')});
test('New York midnight in summer',()=>{assert.equal(dayKey(new Date('2026-07-02T03:59:59Z')),'2026-07-01');assert.equal(dayKey(new Date('2026-07-02T04:00:00Z')),'2026-07-02')});
test('Fall daylight saving transition retains day',()=>{assert.equal(dayKey(new Date('2026-11-01T05:59:00Z')),'2026-11-01');assert.equal(dayKey(new Date('2026-11-01T06:01:00Z')),'2026-11-01')});
test('Deterministic daily rotation',()=>{assert.equal(puzzleFor('2026-11-02').answer,'crux');assert.equal(puzzleFor('2026-11-03').answer,'dyno');assert.ok(puzzleFor('2025-01-01').answer)});
test('Normalization and aliases, incorrect guesses',()=>{assert.ok(isCorrect('HEEL-HOOK','heel hook'));assert.ok(isCorrect('Arête','arete'));assert.ok(isCorrect('mantling','mantle'));assert.equal(isCorrect('jug','crux'),false)});
