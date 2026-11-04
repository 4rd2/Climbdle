export const puzzles = [
  [
    "crux",
    "The hardest move or sequence on a climbing route.",
    "Route reading",
    "The part of a climb that asks the most of you."
  ],
  [
    "dyno",
    "A dynamic move in which a climber jumps between holds, briefly losing contact with the wall.",
    "Movement",
    "A committing way to cover a gap between holds."
  ],
  [
    "jug",
    "A large, positive handhold that is easy to wrap your fingers around.",
    "Holds",
    "A hold that tends to feel reassuring when you reach it."
  ],
  [
    "smearing",
    "Using friction from the sole of your shoe against the rock, rather than standing on a distinct foothold.",
    "Footwork",
    "A footwork technique for making use of a surface with little to stand on."
  ],
  [
    "flagging",
    "Extending a free leg to the side to counterbalance your body and prevent swinging.",
    "Movement",
    "A body-positioning technique that helps you stay balanced."
  ],
  [
    "heel hook",
    "Placing the back of your foot on a hold to pull with your leg and help support your weight.",
    "Footwork",
    "A way to make a foot help with pulling, rather than just standing."
  ],
  [
    "mantle",
    "Pressing down on a hold to lift your body above it, much like getting out of a swimming pool.",
    "Movement",
    "A move used to get your body above something you are holding."
  ],
  [
    "sloper",
    "A rounded or sloping hold without a positive edge, gripped mainly through friction.",
    "Holds",
    "A hold whose shape offers little to curl your fingers around."
  ],
  [
    "pinch",
    "A hold gripped by squeezing between your thumb and fingers.",
    "Holds",
    "A hold that rewards pressure from more than one direction."
  ],
  [
    "arete",
    "An outside corner or edge where two rock faces meet.",
    "Rock features",
    "An exposed meeting point between rock faces."
  ],
  [
    "chimney",
    "A crack wide enough to fit your body into, climbed by pressing against opposing walls.",
    "Rock features",
    "A rock feature with room for more than just your hands and feet."
  ],
  [
    "stemming",
    "Pushing against opposing surfaces with your hands or feet to support yourself between them.",
    "Movement",
    "A way to support yourself between separate surfaces."
  ],
  [
    "undercling",
    "A hold grasped from underneath, with the palm facing upward and feet providing opposition.",
    "Holds",
    "A hold that works best when you use it from below."
  ],
  [
    "sidepull",
    "A vertically oriented hold that you pull sideways on while your body provides opposition.",
    "Holds",
    "A hold that calls for a pull in a less usual direction."
  ],
  [
    "gaston",
    "A hold used with your thumb pointing down and elbow out, pushing outward as if opening sliding doors.",
    "Movement",
    "An outward action that helps you use a hold."
  ],
  [
    "redpoint",
    "Climbing a route cleanly on lead after previously practicing or attempting it.",
    "Climbing styles",
    "A successful ascent that comes after earlier work on the climb."
  ],
  [
    "onsight",
    "Climbing a route cleanly on your first attempt, without prior practice or information about its moves.",
    "Climbing styles",
    "A first-attempt ascent made with no advance knowledge of the moves."
  ],
  [
    "flash",
    "Climbing a route cleanly on your first attempt after receiving information about the moves.",
    "Climbing styles",
    "A first-attempt ascent that can benefit from someone else’s knowledge."
  ],
  [
    "beta",
    "Information or advice about how to complete a climb or a specific move.",
    "Climbing language",
    "Something another climber might share to help you solve a move."
  ],
  [
    "pumped",
    "The feeling of forearm fatigue and tightness that makes it difficult to keep gripping holds.",
    "Climbing language",
    "A familiar feeling when holding on starts to become difficult."
  ],
  [
    "slab",
    "A rock face that is less steep than vertical, where balance and footwork are especially important.",
    "Rock features",
    "A type of terrain where staying balanced over your feet matters."
  ],
  [
    "overhang",
    "A section of rock that leans out beyond vertical.",
    "Rock features",
    "Terrain that leans toward you."
  ],
  [
    "dihedral",
    "An inside corner formed by two intersecting rock faces, often climbed using opposing pressure.",
    "Rock features",
    "A rock feature where surfaces meet to form a recess."
  ],
  [
    "toe hook",
    "Using the top of your toes to pull against a hold and maintain body tension.",
    "Footwork",
    "A foot technique that helps keep your body from pulling away."
  ],
  [
    "drop knee",
    "Rotating one knee inward and downward to bring your hip closer to the wall.",
    "Movement",
    "A change in leg position that brings your body closer to the wall."
  ],
  [
    "deadpoint",
    "Timing a reach so you catch the next hold at the moment your upward movement briefly stops.",
    "Movement",
    "A move where catching the hold depends on a brief moment of timing."
  ],
  [
    "match",
    "Bringing both hands or both feet onto the same hold.",
    "Movement",
    "A move that brings two points of contact together."
  ],
  [
    "barn door",
    "An uncontrolled sideways swing away from the wall, like a door opening on its hinges.",
    "Climbing language",
    "A loss of balance that sends your body swinging away."
  ],
  [
    "highball",
    "A boulder problem tall enough that a fall near the top has especially serious consequences.",
    "Climbing styles",
    "A boulder problem where height adds to the commitment."
  ],
  [
    "traverse",
    "Moving sideways across the rock instead of climbing primarily upward.",
    "Movement",
    "A climb that makes progress in a different direction."
  ],
  [
    "whipper",
    "Climbing slang for a substantial fall while on lead.",
    "Climbing language",
    "Climbing slang for a sudden drop."
  ]
];
export function dayKey(now=new Date()){return new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(now)}
export function puzzleFor(day){const n=Math.floor((Date.parse(day+'T00:00:00Z')-Date.UTC(2026,10,2))/86400000);const i=((n%puzzles.length)+puzzles.length)%puzzles.length;return {number:n+1,answer:puzzles[i][0],clue:puzzles[i][3],hint:puzzles[i][1],category:puzzles[i][2]}}
export function normalize(s){return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'')}
export function isCorrect(guess,answer){const aliases={mantle:['mantel','mantling'],arete:['arête'],flagging:['flag'],smearing:['smear'],match:['matching'],redpoint:['red point'],onsight:['on sight'], 'barn door':['barndooring']};return [answer,...(aliases[answer]||[])].some(a=>normalize(a)===normalize(guess))}
