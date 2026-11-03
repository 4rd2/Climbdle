import {test} from 'node:test';import assert from 'node:assert/strict';import {dayKey,puzzleFor,isCorrect} from './public/puzzles.js';
test('New York midnight in winter',()=>{assert.equal(dayKey(new Date('2026-11-03T04:59:59Z')),'2026-11-02');assert.equal(dayKey(new Date('2026-11-03T05:00:00Z')),'2026-11-03')});
test('New York midnight in summer',()=>{assert.equal(dayKey(new Date('2026-07-02T03:59:59Z')),'2026-07-01');assert.equal(dayKey(new Date('2026-07-02T04:00:00Z')),'2026-07-02')});
test('Fall daylight saving transition retains day',()=>{assert.equal(dayKey(new Date('2026-11-01T05:59:00Z')),'2026-11-01');assert.equal(dayKey(new Date('2026-11-01T06:01:00Z')),'2026-11-01')});
test('Deterministic daily rotation',()=>{assert.equal(puzzleFor('2026-11-02').answer,'crux');assert.equal(puzzleFor('2026-11-03').answer,'dyno');assert.ok(puzzleFor('2025-01-01').answer)});
test('Normalization and aliases, incorrect guesses',()=>{assert.ok(isCorrect('HEEL-HOOK','heel hook'));assert.ok(isCorrect('Arête','arete'));assert.ok(isCorrect('mantling','mantle'));assert.equal(isCorrect('jug','crux'),false)});
