export const puzzles = [
 ['crux','The hardest move or sequence on a climbing route.','Route reading'],
 ['dyno','A dynamic move in which a climber jumps between holds, briefly losing contact with the wall.','Movement'],
 ['jug','A large, positive handhold that is easy to wrap your fingers around.','Holds'],
 ['smearing','Using friction from the sole of your shoe against the rock, rather than standing on a distinct foothold.','Footwork'],
 ['flagging','Extending a free leg to the side to counterbalance your body and prevent swinging.','Movement'],
 ['heel hook','Placing the back of your foot on a hold to pull with your leg and help support your weight.','Footwork'],
 ['mantle','Pressing down on a hold to lift your body above it, much like getting out of a swimming pool.','Movement'],
 ['sloper','A rounded or sloping hold without a positive edge, gripped mainly through friction.','Holds'],
 ['pinch','A hold gripped by squeezing between your thumb and fingers.','Holds'],
 ['arete','An outside corner or edge where two rock faces meet.','Rock features'],
 ['chimney','A crack wide enough to fit your body into, climbed by pressing against opposing walls.','Rock features'],
 ['stemming','Pushing against opposing surfaces with your hands or feet to support yourself between them.','Movement'],
 ['undercling','A hold grasped from underneath, with the palm facing upward and feet providing opposition.','Holds'],
 ['sidepull','A vertically oriented hold that you pull sideways on while your body provides opposition.','Holds'],
 ['gaston','A hold used with your thumb pointing down and elbow out, pushing outward as if opening sliding doors.','Movement'],
 ['redpoint','Climbing a route cleanly on lead after previously practicing or attempting it.','Climbing styles'],
 ['onsight','Climbing a route cleanly on your first attempt, without prior practice or information about its moves.','Climbing styles'],
 ['flash','Climbing a route cleanly on your first attempt after receiving information about the moves.','Climbing styles'],
 ['beta','Information or advice about how to complete a climb or a specific move.','Climbing language'],
 ['pumped','The feeling of forearm fatigue and tightness that makes it difficult to keep gripping holds.','Climbing language'],
 ['slab','A rock face that is less steep than vertical, where balance and footwork are especially important.','Rock features'],
 ['overhang','A section of rock that leans out beyond vertical.','Rock features'],
 ['dihedral','An inside corner formed by two intersecting rock faces, often climbed using opposing pressure.','Rock features'],
 ['toe hook','Using the top of your toes to pull against a hold and maintain body tension.','Footwork'],
 ['drop knee','Rotating one knee inward and downward to bring your hip closer to the wall.','Movement'],
 ['deadpoint','Timing a reach so you catch the next hold at the moment your upward movement briefly stops.','Movement'],
 ['match','Bringing both hands or both feet onto the same hold.','Movement'],
 ['barn door','An uncontrolled sideways swing away from the wall, like a door opening on its hinges.','Climbing language'],
 ['highball','A boulder problem tall enough that a fall near the top has especially serious consequences.','Climbing styles'],
 ['traverse','Moving sideways across the rock instead of climbing primarily upward.','Movement'],
 ['whipper','Climbing slang for a substantial fall while on lead.','Climbing language']
 ];
export function dayKey(now=new Date()){return new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(now)}
export function puzzleFor(day){const n=Math.floor((Date.parse(day+'T00:00:00Z')-Date.UTC(2026,10,2))/86400000);const i=((n%puzzles.length)+puzzles.length)%puzzles.length;return {number:n+1,answer:puzzles[i][0],clue:puzzles[i][1],category:puzzles[i][2]}}
export function normalize(s){return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'')}
export function isCorrect(guess,answer){const aliases={mantle:['mantel','mantling'],arete:['arête'],flagging:['flag'],smearing:['smear'],match:['matching'],redpoint:['red point'],onsight:['on sight'], 'barn door':['barndooring']};return [answer,...(aliases[answer]||[])].some(a=>normalize(a)===normalize(guess))}
