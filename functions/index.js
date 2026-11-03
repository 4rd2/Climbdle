import {onCall,HttpsError} from 'firebase-functions/v2/https';
import {initializeApp} from 'firebase-admin/app';
import {getFirestore,FieldValue} from 'firebase-admin/firestore';
import {dayKey,puzzleFor,isCorrect,normalize} from './puzzles.js';
initializeApp();const db=getFirestore();
const empty=()=>({guesses:[],solved:false});
function requireUser(req){if(!req.auth)throw new HttpsError('unauthenticated','Please sign in.');return req.auth.uid}
export const getProgress=onCall(async req=>{const uid=requireUser(req),day=dayKey();const snap=await db.doc(`days/${day}/attempts/${uid}`).get();return {day,state:snap.exists?{guesses:snap.data().guesses,solved:snap.data().solved}:empty()}});
export const submitGuess=onCall(async req=>{const uid=requireUser(req),day=dayKey(),puzzle=puzzleFor(day);const guess=typeof req.data?.guess==='string'?req.data.guess.trim():'';if(!normalize(guess)||guess.length>60)throw new HttpsError('invalid-argument','Enter a climbing term.');const ref=db.doc(`days/${day}/attempts/${uid}`);return db.runTransaction(async tx=>{const snap=await tx.get(ref);const state=snap.exists?{guesses:snap.data().guesses,solved:snap.data().solved}:empty();if(state.solved||state.guesses.some(g=>normalize(g)===normalize(guess)))return {day,state};state.guesses.push(guess);state.solved=isCorrect(guess,puzzle.answer);tx.set(ref,{...state,updatedAt:FieldValue.serverTimestamp()});if(state.solved){tx.set(db.doc(`days/${day}/scores/${uid}`),{name:String(req.auth.token.name||'Climber').slice(0,40),attempts:state.guesses.length,completedAt:FieldValue.serverTimestamp()})}return {day,state}})});
export const getLeaderboard=onCall(async()=>{const day=dayKey();const snaps=await db.collection(`days/${day}/scores`).orderBy('attempts','asc').limit(50).get();return {day,scores:snaps.docs.map(s=>({name:s.data().name,attempts:s.data().attempts}))}});
