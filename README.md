# The Chrono-Cultural Incubator - Accelerated Evolution

**Interactive 3D Civilization Simulator with Time Control and Crisis Injection**

A high-fidelity interactive 3D web experience where you act as the **Divine Observer** of ancient civilizations. Select from pre-defined civilization archetypes, then manipulate time itself and inject catastrophic events to test their resilience.

**Core Concept:** Choose a civilization archetype with unique environmental and social characteristics, then observe how they evolve through accelerated time while you intervene with real-time parameter adjustments and crisis events.

---

## 🌍 Overview

This is a two-phase accelerated simulation system:

1. **Phase 1 - Archetype Selection**: Choose from 6 pre-defined civilization types with 3D preview
2. **Phase 2 - Accelerated Simulation**: Control time flow (PAUSE/1x/10x/100x) and inject crisis events while observing 3D evolution

---

## 🏛️ Phase 1: Archetype Selection

**Aesthetic:** Holographic preview system with real-time 3D rendering

### Six Civilization Archetypes

Each archetype comes with pre-configured environmental parameters and unique visual characteristics:

#### 🏜️ Desert Nomads
- **Description:** Hardy survivors adapted to harsh desert conditions
- **Difficulty:** High (75%)
- **Key Traits:** High mobility, resource scarcity, strong trade networks
- **Visual Theme:** Sandy browns and warm oranges
- **Starting Conditions:** Dry climate, high environmental stress

#### ⛰️ Mountain Farmers
- **Description:** Isolated highland dwellers with terraced agriculture
- **Isolation:** High
- **Key Traits:** Self-sufficiency, defensive positioning, slow cultural change
- **Visual Theme:** Stone grays and earthy greens
- **Starting Conditions:** Cool climate, stable but isolated

#### 🌊 Coastal Traders
- **Description:** Maritime culture focused on commerce and innovation
- **Innovation:** High (70%)
- **Key Traits:** Open borders, rapid cultural exchange, naval technology
- **Visual Theme:** Ocean blues and sandy whites
- **Starting Conditions:** Moderate climate, high external contact

#### 🌲 Forest Dwellers
- **Description:** Woodland society with balanced sustainable practices
- **Stability:** High
- **Key Traits:** Medium all parameters, ecological harmony
- **Visual Theme:** Forest greens and natural browns
- **Starting Conditions:** Temperate climate, balanced ecosystem

#### 🐎 Steppe Warriors
- **Description:** Nomadic horse culture with aggressive expansion
- **Tolerance:** Low (35%)
- **Key Traits:** High mobility, military focus, rapid rumor spread
- **Visual Theme:** Grassland yellows and warrior reds
- **Starting Conditions:** Open plains, expansionist pressure

#### 🏛️ River Civilization
- **Description:** Advanced hydraulic society with organized governance
- **Difficulty:** Low (30%)
- **Key Traits:** Agricultural surplus, high innovation, complex hierarchy
- **Visual Theme:** Fertile greens and architectural whites
- **Starting Conditions:** Rich environment, rapid development

### 3D Preview System

- **Hover** over any archetype card to see 3D preview
- **Click** to select and confirm your civilization
- **Preview Canvas** shows real-time 3D rendering of:
  - Terrain with archetype-specific colors
  - Sample buildings matching visual theme
  - Environmental lighting based on climate
  - 10-second automated preview at 100x speed after selection

---

## ⏱️ Phase 2: Accelerated Simulation

**Aesthetic:** Command center interface with holographic 3D island view

### The 3D World

Your selected archetype generates a complete living civilization:

- **Circular Island Terrain**: 50-unit diameter landmass with beach and ocean
- **30 Inhabitants**: Animated 3D characters in archetype-specific colors
- **8 Buildings**: Structures that grow/shrink based on prosperity
- **40 Trees**: Vegetation responding to environmental stress
- **Dynamic Water Level**: Rises during flood events
- **Enemy Spawns**: Appear during war events

### Chrono-Controller - Time Manipulation

**Time Scale Slider** (4 settings):
- **PAUSE** (0x): Freeze all simulation
- **1x SPEED**: Real-time observation
- **10x SPEED**: Accelerated month progression
- **100x ACCELERATED**: Rapid evolution view

**Time Display:**
- **YEAR**: 0000-9999 (zero-padded)
- **MONTH**: 01-12
- **Accurate accumulator**: Precise time tracking at all speeds

**Era Progression:**
- **EARLY SETTLEMENT** (Year 0-50)
- **GROWTH** (Year 50-150)
- **ESTABLISHED** (Year 150-300)
- **ADVANCED** (Year 300+)

### Camera Controls

- **Drag** to rotate around island
- **Scroll** to zoom in/out
- **OrbitControls** for smooth navigation
- View updates at all time scales

---

## 💥 Crisis Injection System

### 🌊 THE DELUGE - Catastrophic Flood

**Event Duration:** 3 seconds

**Visual Effects:**
- Water level rises from 0.2 to 1.5 units
- Animated blue expanding plane
- Buildings partially submerged

**Behavioral Impact:**
- All inhabitants panic and flee toward higher ground
- Movement speed increases dramatically
- Health decreases for those caught in water
- Population loss: 10-30%

**Recovery:**
- Water recedes gradually over 10 seconds
- Survivors resume normal behavior
- Buildings remain damaged (lower heights)

### ☠️ THE PLAGUE - Deadly Disease

**Event Duration:** 5-10 seconds (cascading)

**Visual Effects:**
- Infected inhabitants turn sick green (0x88ff00)
- Progressive infection spread through population
- Fade-out animations for deceased

**Behavioral Impact:**
- Infects up to 40% of population randomly
- Each infected dies after 2 seconds
- Cascading spread at 500ms intervals
- No immunity or recovery

**Long-term Effects:**
- Permanent population reduction
- Lowers survival rate statistics
- Affects prosperity calculations

### ⚔️ NEIGHBOR'S WAR - External Threat

**Event Duration:** 8 seconds (attack sequence)

**Visual Effects:**
- 10 enemy units spawn at island edge (red color: 0xff0000)
- Marching animation toward settlement center
- Collision-based combat

**Behavioral Impact:**
- Inhabitants flee or fight based on tolerance
- Health decreases during enemy encounters
- Buildings may be damaged in crossfire
- Population loss: 15-35%

**Aftermath:**
- Enemy units despawn after 8 seconds
- Survivors return to normal behavior
- Border openness may decrease automatically

---

## 🎚️ The God Controller - 6 Real-Time Intervention Sliders

### 1. LIFE DIFFICULTY (Easy ← → Harsh)

**Range:** 0-100%

**Real-Time Impact:**
- **< 30%**: Vegetation flourishes (bright green, full size)
- **30-60%**: Moderate environment
- **60-75%**: Trees wither (brown tones, 70% size)
- **> 75%**: Extreme hardship (gray, 40% size)

**Behavioral Effects:**
- High difficulty → erratic movement patterns
- Health decreases faster
- Ritual performance degrades

**Prosperity Calculation:**
- Lower difficulty = higher prosperity = taller buildings

### 2. RUMOR SPREAD (Controlled ← → Chaotic)

**Range:** 0-100%

**Real-Time Impact:**
- **< 40%**: Normal dispersed movement
- **40-60%**: Occasional clustering
- **> 60%**: GATHER behavior activates
  - All inhabitants move toward island center
  - Form agitated clusters
  - Non-productive grouping

**Social Effects:**
- High spread → information chaos
- Decision-making becomes irrational
- Trust erodes between groups

### 3. SOCIETAL TOLERANCE (Conflict ← → Cooperation)

**Range:** 0-100%

**Real-Time Impact:**
- **< 30%**: CONFLICT MODE
  - Collisions cause health loss (-5% per contact)
  - Inhabitants repel away from each other
  - Red flash on collision
- **> 70%**: COOPERATION MODE
  - Collisions grant health (+3% per contact)
  - Resource sharing animations
  - Green glow on contact

**Long-term Effects:**
- Low tolerance → population decline through attrition
- High tolerance → population stability

### 4. INNOVATION PACE (Static ← → Dynamic)

**Range:** 0-100%

**Real-Time Impact:**
- **< 30%**: Buildings remain static original colors
- **30-60%**: Occasional color shifts
- **> 60%**: RAPID EVOLUTION MODE
  - Buildings change colors every 2 seconds
  - Temporary structures appear/vanish
  - Clothing colors shift on inhabitants

**Prosperity Calculation:**
- Higher innovation = higher prosperity = building growth

### 5. CLIMATE THREAT (Calm ← → Extreme)

**Range:** 0-100%

**Real-Time Impact:**
- **< 40%**: Clear skies, normal lighting
- **40-70%**: Atmospheric fog increases
- **> 70%**: SHELTER behavior activates
  - Sky darkens significantly
  - Inhabitants panic and seek buildings
  - Camera shake effect (tremor simulation)

**Environmental Effects:**
- High threat → darker scene
- Fog density increases
- Inhabitants cluster near structures

### 6. BORDER OPENNESS (Closed ← → Open)

**Range:** 0-100%

**Real-Time Impact:**
- **< 50%**: ISOLATION MODE
  - Translucent walls appear (0x888888, 50% opacity)
  - Wall height = (50 - openness) / 10
  - Movement restricted between zones
- **> 50%**: OPEN BORDERS
  - Walls dissolve completely
  - Free cross-group movement
  - Cultural exchange enabled

**Social Structure:**
- Low openness → segregated groups
- High openness → unified society

---

## 📊 Live Statistics Display

### Top Bar Metrics

**POPULATION**: Real-time count of living inhabitants (health > 30%)

**BUILDINGS**: Number of standing structures

**STABILITY**: Average health percentage of all inhabitants
- **100%**: Perfect health (green)
- **70-99%**: Good health (light green)
- **40-69%**: Moderate health (yellow)
- **< 40%**: Critical health (red)

### Civilization Status

**Prosperity Formula:**
```javascript
prosperity = (100 - Life Difficulty + Innovation Pace) / 200
```

**Status Levels:**
- **THRIVING** (prosperity > 0.7): Green text, growing buildings
- **STABLE** (prosperity 0.4-0.7): White text, stable buildings
- **DECLINING** (prosperity 0.2-0.4): Yellow text, shrinking buildings
- **COLLAPSING** (prosperity < 0.2): Red text, minimal structures

---

## 🏗️ Dynamic Building System

### Building Growth/Decay

**Target Height Calculation:**
```javascript
targetHeight = originalHeight * (0.5 + prosperity * 1.5)
```

**Growth Rate:**
- Interpolates at 1% per frame toward target height
- Smooth transitions (no jarring jumps)
- Y-position automatically adjusts with scale

**Visual Effects:**
- **Thriving**: Buildings grow to 2x original height
- **Collapsing**: Buildings shrink to 50% original height
- **Material**: Emissive glow based on innovation pace

---

## 🤖 Inhabitant AI Behaviors

### Behavior States

**WANDER** (Default)
- Random exploration within island boundaries
- Occasional direction changes (1% per frame)
- Speed: 0.05 units/frame at 1x speed

**GATHER** (Rumor Spread > 60%)
- Move toward island center (0, 0, 0)
- Cluster formation
- Agitated movement patterns

**SHELTER** (Climate Threat > 70%)
- Pathfind to nearest building
- Panic speed increase
- Huddled behavior near structures

**RITUAL** (Every 60 seconds, if Life Difficulty < 90%)
- All inhabitants pause simultaneously
- Y-axis bounce animation (sine wave)
- 2-second duration
- Synchronized cultural performance

### Movement System

**Speed Multipliers:**
- Base speed: 0.05 units/frame
- 1x time: Normal speed
- 10x time: 10x faster movement
- 100x time: 100x faster movement

**Boundary Constraints:**
- Island radius: 23 units
- Collision detection with edge
- Velocity reversal on boundary hit

**Collision System:**
- Detection radius: 1.5 units
- Low tolerance: Health loss, repulsion
- High tolerance: Health gain, attraction

### Health System

**Health Range:** 0-100%

**Visual Representation:**
- Opacity = health percentage
- 100% health = fully opaque
- 30% health = semi-transparent
- < 30% health = dead (removed from scene)

**Health Modifiers:**
- Life Difficulty: -0.5% per frame at high difficulty
- Collisions (low tolerance): -5% per contact
- Collisions (high tolerance): +3% per contact
- Plague infection: Instant death after 2 seconds
- War damage: -10% per enemy contact

---

## 💻 Technical Implementation

### Technologies

- **Three.js r128**: WebGL 3D rendering engine
- **OrbitControls**: Camera manipulation library
- **Vanilla JavaScript**: ES6+ class-based architecture (CivilizationSimulator)
- **HTML5 Canvas**: 3D rendering target
- **CSS3 Grid**: Responsive multi-panel layout
- **Shadow Mapping**: Real-time dynamic shadows

### 3D Asset Generation

**Island Terrain:**
```javascript
THREE.CylinderGeometry(25, 25, 0.5, 64)  // Main land
THREE.RingGeometry(25, 28, 64)           // Beach
THREE.CircleGeometry(50, 64)             // Ocean
```

**Inhabitants:**
```javascript
THREE.CapsuleGeometry(0.4, 0.8, 8, 16)   // Body with shadows
THREE.SphereGeometry(0.3, 16, 16)        // Head
```

**Buildings:**
```javascript
THREE.BoxGeometry(2, height, 2)          // Variable height
THREE.MeshStandardMaterial({
    emissive: color,
    emissiveIntensity: innovation * 0.01
})
```

**Vegetation:**
```javascript
THREE.CylinderGeometry(0.1, 0.15, 1.5)   // Trunk
THREE.ConeGeometry(0.8, 2, 8)            // Leaves
// Scale based on life difficulty
```

**Walls:**
```javascript
THREE.BoxGeometry(30, height, 0.5)       // Barrier
THREE.MeshStandardMaterial({
    transparent: true,
    opacity: 0.5
})
```

**Water Level:**
```javascript
THREE.CircleGeometry(50, 64)
position.y = 0.2 (normal) → 1.5 (flood)
```

**Enemy Units:**
```javascript
THREE.ConeGeometry(0.5, 1.5, 4)          // Aggressive red cones
```

### Archetype Configuration System

**Data Structure:**
```javascript
{
    name: String,
    description: String,
    colors: {
        primary: 0xHEXCODE,
        secondary: 0xHEXCODE,
        terrain: 0xHEXCODE
    },
    climate: {
        sky: 0xHEXCODE,
        lighting: 0.0-1.0
    },
    parameters: {
        'life-difficulty': 0-100,
        'rumor-spread': 0-100,
        'societal-tolerance': 0-100,
        'innovation-pace': 0-100,
        'climate-threat': 0-100,
        'border-openness': 0-100
    }
}
```

### Time Accumulator Pattern

**Purpose:** Accurate simulation time tracking at variable speeds

**Implementation:**
```javascript
const multipliers = [0, 1, 10, 100];
const actualDelta = delta * multipliers[timeScale];
timeAccumulator += actualDelta;

if (timeAccumulator >= 1.0) {
    simulatedMonth += Math.floor(timeAccumulator);
    timeAccumulator -= Math.floor(timeAccumulator);

    if (simulatedMonth > 12) {
        simulatedYear += Math.floor(simulatedMonth / 12);
        simulatedMonth = simulatedMonth % 12;
    }
}
```

### Event Animation Choreography

**Flood Sequence:**
1. Show notification overlay (scale animation)
2. Animate water level rise (3-second lerp)
3. Trigger panic behavior in all inhabitants
4. Gradual recede over 10 seconds
5. Remove notification

**Plague Sequence:**
1. Show notification overlay
2. Select random 40% of population
3. Cascading infection at 500ms intervals
4. Color change to sick green
5. Death after 2 seconds per infected
6. Remove from scene

**War Sequence:**
1. Show notification overlay
2. Spawn 10 red enemy units at edge
3. March toward center over 8 seconds
4. Collision damage with inhabitants
5. Despawn all enemies
6. Remove notification

---

## 🎮 How to Use

1. **Open** `index.html` in a modern browser (Chrome/Firefox/Safari 14+)
2. **Hover** over the 6 archetype cards to preview in 3D
3. **Click** your chosen civilization to select
4. **Watch** automated 10-second preview at 100x speed
5. **Transition** to full simulation view
6. **Adjust** the 6 intervention sliders in real-time
7. **Control** time flow with the Chrono-Controller (PAUSE/1x/10x/100x)
8. **Inject** crisis events (Flood/Plague/War) to test resilience
9. **Observe** how your civilization adapts and evolves
10. **Monitor** population, stability, and status metrics

---

## 🌐 Browser Compatibility

**Recommended:**
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

**Requirements:**
- WebGL 2.0 support
- ES6 JavaScript (class syntax, arrow functions)
- CSS Grid support
- Canvas 2D context
- Shadow DOM not required

---

## 📖 Design Philosophy

### Archetypal Determinism vs Free Will

Each civilization begins with fixed environmental and cultural parameters (archetype determinism), but you manipulate these in real-time to explore:
- Can harsh conditions create resilient societies?
- Does isolation preserve or destroy culture?
- Can external crises strengthen or fracture communities?

### The Observer's Dilemma

You are both observer and intervener:
- **Passive observation**: Let time flow and watch natural evolution
- **Active intervention**: Adjust sliders to guide development
- **Crisis injection**: Test extreme stress responses

Can you resist intervening? Should you?

### Accelerated Evolution

Time manipulation reveals long-term patterns:
- 100x speed shows centuries of development in minutes
- Emergent behaviors only visible at scale
- Butterfly effect of small parameter changes

### Visual Feedback Loops

Every slider adjustment has immediate visible consequences:
- Buildings rise and fall with prosperity
- Inhabitants cluster or disperse based on rumor
- Walls materialize with isolation
- Trees wither under hardship

---

## 🎓 Educational Applications

- **Systems Thinking**: Observe cascading effects of interconnected parameters
- **Historical Simulation**: Compare archetype outcomes to real civilizations
- **Ethics**: Question the morality of god-like intervention
- **Emergence**: Study complex behaviors from simple rules
- **Resilience Theory**: Test civilization survival under stress
- **Cultural Ecology**: Explore environment-culture relationships

---

## 🔮 Future Enhancements (Not Implemented)

- **Multi-civilization mode**: Multiple islands with trade and war
- **Custom archetype creator**: Define your own civilization parameters
- **Time-lapse recording**: Export video of simulation evolution
- **More crisis types**: Volcano, meteor, famine, revolution
- **Trade routes**: Visible pathways between settlements
- **Technology tree**: Innovation unlocks new buildings
- **Seasonal cycles**: Visual winter/summer transitions
- **Sound design**: Ambient music responding to civilization state

---

## 📜 File Structure

```
culture/
├── index.html          # UI structure (252 lines)
│   ├── Phase 1: Archetype selection grid
│   ├── 3D preview canvas
│   ├── Phase 2: Main simulation canvas
│   ├── Chrono-controller
│   └── Intervention panel
├── styles.css          # Styling (685 lines)
│   ├── Archetype card hover effects
│   ├── Grid layout for simulation
│   ├── Event notification animations
│   └── Time display glowing numbers
├── app.js              # Core logic (894 lines)
│   ├── CivilizationSimulator class
│   ├── 6 archetype definitions
│   ├── Three.js scene setup
│   ├── Time accumulator system
│   ├── 3 crisis injection functions
│   ├── Dynamic building interpolation
│   ├── AI behavior state machine
│   └── Real-time slider effects
└── README.md           # This documentation
```

---

## 🙏 Credits

**Concept**: The Chrono-Cultural Incubator - Accelerated Evolution Edition
**3D Engine**: Three.js r128 by Mr.doob and contributors
**Camera Controls**: OrbitControls.js
**Philosophical Foundation**: Systems theory, cultural ecology, the observer effect

---

## 🎯 Quick Reference - Slider Effects

| Slider | Low Value Effect | High Value Effect |
|--------|-----------------|-------------------|
| **Life Difficulty** | Green flourishing trees, healthy population | Gray withered vegetation, erratic movement |
| **Rumor Spread** | Dispersed exploration | Center clustering, agitated grouping |
| **Tolerance** | Health loss on collision, conflict | Health gain on collision, cooperation |
| **Innovation** | Static building colors | Rapid color changes, temporary structures |
| **Climate Threat** | Clear skies, calm | Dark skies, fog, shelter-seeking panic |
| **Border Openness** | Translucent walls, isolation | No walls, free movement |

---

## ⚡ Quick Reference - Crisis Events

| Event | Duration | Population Loss | Visual Signature | Recovery Time |
|-------|----------|----------------|------------------|---------------|
| **THE DELUGE** | 3 seconds | 10-30% | Rising blue water to 1.5 units | 10 seconds |
| **THE PLAGUE** | 5-10 seconds | Up to 40% | Green sick color, cascading deaths | Permanent |
| **NEIGHBOR'S WAR** | 8 seconds | 15-35% | Red enemy cones marching inward | Immediate |

---

*"Will your civilization thrive through millennia, or collapse under the weight of your interventions?"*
