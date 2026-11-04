import {dayKey,puzzleFor,isCorrect,normalize} from './puzzles.js';
import * as accounts from './accounts.js';
import {showSignIn,showUsernameSetup} from './auth-dialogs.js';
import {summarizeDistribution,guestDistribution} from './stats.js';
import {statsLoading,statsError,renderStats} from './stats-view.js';
const $=s=>document.querySelector(s);let day=dayKey(),puzzle=puzzleFor(day),state,cloud=null,user=null,busy=false;
function read(){try{return JSON.parse(localStorage.getItem('crux:'+day))||{guesses:[],solved:false}}catch{return {guesses:[],solved:false}}}
function save(){try{localStorage.setItem('crux:'+day,JSON.stringify(state))}catch{$('#message').textContent='Your browser could not save progress. Keep this tab open.'}}
function render(){ const yesterday=new Date(Date.parse(day+'T00:00:00Z')-86400000).toISOString().slice(0,10);$('#yesterday-answer').textContent=puzzleFor(yesterday).answer; $('#puzzle-number').textContent='#'+String(puzzle.number).padStart(3,'0');$('#category').textContent=puzzle.category;$('#clue').textContent=puzzle.clue;$('#attempts').textContent=state.guesses.length;$('#attempt-label').textContent=state.guesses.length===1?'attempt':'attempts';$('.attempt-bar').hidden=state.solved;$('#guess').disabled=state.solved||busy;$('#submit').disabled=state.solved||busy;$('#share').hidden=!state.solved;$('#history').replaceChildren();state.guesses.slice().reverse().forEach((g,i)=>{const li=document.createElement('li');const correct=state.solved&&i===0;li.className=correct?'correct':'';const name=document.createElement('span');name.textContent=String(state.guesses.length-i).padStart(2,'0')+'  '+g;const mark=document.createElement('span');mark.textContent=correct?'Correct':'Incorrect';li.append(name,mark);$('#history').append(li)});if(state.solved)$('#message').textContent='Solved in '+state.guesses.length+' '+(state.guesses.length===1?'attempt.':'attempts.');}
function resetDay(){day=dayKey();puzzle=puzzleFor(day);state=read();$('#message').textContent='';$('#guess').value='';render();loadBoard();if(user)syncProgress()}
function tick(){if(day!==dayKey()){resetDay()}let low=Date.now(),high=low+27*3600000;while(high-low>1000){const mid=Math.floor((low+high)/2);if(dayKey(new Date(mid))===day)low=mid;else high=mid}let seconds=Math.max(0,Math.ceil((high-Date.now())/1000));$('#countdown').textContent=[Math.floor(seconds/3600),Math.floor(seconds%3600/60),seconds%60].map(v=>String(v).padStart(2,'0')).join(':')}
$('#guess-form').addEventListener('submit',async e=>{e.preventDefault();if(day!==dayKey()){resetDay();$('#message').textContent='New puzzle available. Read the clue before guessing.';return}if(busy||state.solved)return;const guess=$('#guess').value.trim();if(!normalize(guess))return;if(state.guesses.some(g=>normalize(g)===normalize(guess))){$('#message').textContent='Already guessed.';return}busy=true;render();try{if(user&&cloud){const result=await cloud.guess({guess});if(result.data.day!==day){resetDay();return}state=result.data.state}else{state.guesses.push(guess);state.solved=isCorrect(guess,puzzle.answer)}if(!user)save();$('#guess').value='';$('#message').textContent=state.solved?'':'Incorrect. Try again.';await loadBoard()}catch(e){$('#message').textContent='Could not record your guess. Please check your connection and try again.'}finally{busy=false;render();if(location.hash==='#stats')void loadStats();if(!state.solved)$('#guess').focus()}});
function modal(html){window.dispatchEvent(new CustomEvent('crux:modal',{detail:html}))}
$('#help').onclick=()=>modal('<h2>How to play</h2><ol><li>Read the definition and guess the climbing term.</li><li>You have unlimited attempts. Every new, non-empty guess counts; repeated guesses don’t.</li><li>Capitalization, spaces and punctuation don’t matter.</li><li>The leaderboard ranks players by fewest attempts.</li></ol><p>Everyone gets the same clue. A new puzzle arrives at midnight in New York, including daylight saving time.</p><p>Guest progress stays on this device. Log in before playing to save your score.</p>');
async function login(){
 if(connectionStatus!=='ready'){
  const buttons=[$('#login'),$('#board-login'),$('#start-login')];buttons.forEach(button=>button.disabled=true);
  try{await connectAccounts()}finally{buttons.forEach(button=>button.disabled=false)}
 }
 if(connectionStatus==='error'){modal('<h2>Connection unavailable</h2><p>We could not reach accounts. Close this window and click Log in to retry.</p><p>Your guest progress is still saved on this browser.</p>');return}

 if(user&&!user.username){showUsernameSetup(modal);return}
 if(user){modal('<h2>Your account</h2><button class="primary" id="logout">Log out</button><p id="auth-error" role="status"></p>');$('#logout').onclick=async()=>{try{await accounts.signOut();location.reload()}catch(e){$('#auth-error').textContent=e.message}};return}
 if(!cloud){modal('<h2>Login unavailable</h2><p>You can still play as a guest.</p>');return}
 showSignIn(modal,cloud.google);
}
$('#login').onclick=login;$('#board-login').onclick=login;$('#start-login').onclick=login;
async function syncProgress(){busy=true;render();try{const result=await cloud.progress({});if(result.data.day===day){state=result.data.state;render()}}catch{$('#message').textContent='Account progress is unavailable. Please retry once you’re connected.'}finally{busy=false;render()}}
async function loadBoard(){const el=$('#leaderboard');if(cloud){try{const result=await cloud.leaderboard({});el.replaceChildren();const scores=result.data.scores;let rank=0,last=-1;scores.forEach((s,i)=>{if(s.attempts!==last)rank=i+1;last=s.attempts;const row=document.createElement('div');row.className='score-row';for(const [cls,text] of [['rank',String(rank).padStart(2,'0')],['name',s.name],['score',s.attempts+' '+(s.attempts===1?'attempt':'attempts')]]){const span=document.createElement('span');span.className=cls;span.textContent=text;row.append(span)}el.append(row)});if(!scores.length)el.innerHTML='<div class="empty"><p>No scores yet.</p></div>';$('#board-note').textContent='';return}catch{el.innerHTML='<div class="empty"><p>Leaderboard unavailable. Try again later.</p></div>';return}}if(state.solved){el.innerHTML='<div class="score-row"><span class="rank">—</span><span class="name">You · guest</span><span class="score"></span></div>';el.querySelector('.score').textContent=state.guesses.length+' '+(state.guesses.length===1?'attempt':'attempts')}else el.innerHTML='<div class="empty"><p>No scores yet.</p></div>';$('#board-note').textContent=''}
$('#share').onclick=async()=>{const result='Climbdle #'+puzzle.number+' · '+day+'\n'+state.guesses.length+' '+(state.guesses.length===1?'attempt':'attempts')+' · Solved\n'+location.origin;try{await navigator.clipboard.writeText(result);$('#share').textContent='Copied ✓'}catch{modal('<h2>Your result</h2><p id="share-text"></p>');$('#share-text').textContent=result}};
state=read();render();tick();setInterval(tick,1000);document.addEventListener('visibilitychange',()=>{if(!document.hidden){tick();loadBoard();if(location.hash==='#stats')void loadStats()}});window.addEventListener('storage',e=>{if(e.key==='crux:'+day&&!user){state=read();render();loadBoard()}});loadBoard();
let connectionStatus='loading',connectionRequest=null,statsRequest=0;
function connectAccounts(){
 if(connectionRequest)return connectionRequest;
 connectionStatus='loading';
 connectionRequest=(async()=>{
  try{
   const config=await accounts.getConfig();
   if(!config.configured){cloud=null;connectionStatus='unconfigured';return}
   const session=await accounts.getSession();
   cloud={google:config.google,guess:async body=>({data:await accounts.request('/api/guess',body)}),progress:async()=>({data:await accounts.request('/api/progress')}),leaderboard:async()=>({data:await accounts.request('/api/leaderboard')})};
   user=session?.user||null;
   connectionStatus='ready';
   $('#login').textContent=user?'My account':'Log in';
   $('#start-login').textContent=user?'My account':'Log in';
   $('#board-login').textContent=user?'My account':'Log in';
   if(user)await syncProgress();
   await loadBoard();
  }catch{connectionStatus='error';$('#board-note').textContent='Accounts are temporarily unavailable. Click Log in to retry.'}
  finally{connectionRequest=null;if(location.hash==='#stats')void loadStats()}
 })();
 return connectionRequest;
}
void connectAccounts();

function showScreen(focus=false){
 const view=location.hash==='#play'?'puzzle':location.hash==='#leaderboard'?'leaderboard':location.hash==='#stats'?'stats':'start';
 for(const name of ['start','puzzle','leaderboard','stats'])$('#'+name+'-screen').hidden=name!==view;
 for(const [id,name] of [['nav-play','puzzle'],['nav-leaderboard','leaderboard'],['nav-stats','stats']]){
  const button=$('#'+id);if(view===name)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');
 }
 if(view==='leaderboard')void loadBoard();
 if(view==='stats')void loadStats();
 if(focus){const target=view==='puzzle'?$('#guess'):view==='leaderboard'?$('#leaderboard-title'):view==='stats'?$('#stats-title'):$('#start-title');if(!target.disabled)target.focus();window.scrollTo(0,0)}
}
for(const id of ['start-play','nav-play','board-play','stats-play'])$('#'+id).onclick=()=>{if(location.hash==='#play')showScreen(true);else location.hash='play'};
$('#nav-leaderboard').onclick=()=>{if(location.hash==='#leaderboard')showScreen(true);else location.hash='leaderboard'};
$('#start-date').textContent=new Intl.DateTimeFormat('en-US',{dateStyle:'long',timeZone:'America/New_York'}).format(new Date());
$('#nav-stats').onclick=()=>{if(location.hash==='#stats')void loadStats();else location.hash='stats'};
$('#stats-retry').onclick=async()=>{if(connectionStatus==='error')await connectAccounts();void loadStats()};
window.addEventListener('storage',event=>{if(!user&&location.hash==='#stats'&&(event.key===null||event.key.startsWith('crux:')))void loadStats()});
window.addEventListener('hashchange',()=>showScreen(true));
showScreen();

async function loadStats(){
 const request=++statsRequest;
 statsLoading();
 // Wait for account discovery so account players never see guest totals first.
 if(connectionStatus==='loading')return;
 try{
  if(connectionStatus==='error')throw new Error('Account unavailable');
  const stats=user?await accounts.request('/api/stats'):summarizeDistribution(guestDistribution(localStorage));
  if(request===statsRequest)renderStats(stats);
 }catch{if(request===statsRequest)statsError()}
}
