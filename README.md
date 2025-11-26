# The Chrono-Cultural Incubator - 3D God Mode

**Text-to-World 3D Civilization Simulator**

A high-fidelity interactive 3D web experience where you act as the **Divine Creator** of a new civilization. Define your culture through text, then observe and intervene in its real-time 3D evolution.

**Core Concept:** Your subjective interpretation of a culture (expressed through text) becomes the literal physical and social laws governing a 3D micro-society island.

---

## 🌍 Overview

This is a two-phase God Mode simulator:

1. **Phase 1 - Genesis Configuration**: Define your civilization through text input
2. **Phase 2 - Divine Intervention**: Observe your 3D world and manipulate it in real-time
3. **Phase 3 - Final Judgment**: Analyze whether your civilization thrived or collapsed

---

## 📝 Phase 1: Genesis Configuration (Text-to-Code)

**Aesthetic:** Minimalist, clean UI with live 3D preview

### Four Sacred Questions

Answer these prompts to birth your civilization:

**1. What is the name of your civilization?**
- Displayed as your world title throughout the simulation

**2. Describe your civilization's greatest fear or need**
- Examples: "survival in perpetual darkness", "constant need for flowing water"
- **Maps to:** Initial climate, lighting, and Life Difficulty slider
- **3D Impact:** Sets sky color, fog, environmental lighting

**3. Describe your civilization's core aesthetic**
- Examples: "polished obsidian and crimson silk", "crystalline structures with golden accents"
- **Maps to:** Color palette for inhabitants and buildings
- **3D Impact:** Determines visual appearance of all structures and people

**4. Define your civilization's unique daily ritual**
- Examples: "Every hour they must raise their hands to the sky", "They bow when two meet"
- **Maps to:** Periodic animation loop for all inhabitants
- **3D Impact:** Animated behavior performed every 60 seconds

---

## 🎮 Phase 2: 3D Incubation (God Mode)

**Aesthetic:** High-tech holographic control panel surrounding a living 3D island

### The 3D World

Your text inputs generate:
- **Island Terrain**: Circular island with beach and surrounding ocean
- **30 Inhabitants**: Animated 3D characters in your chosen color scheme
- **8 Buildings**: Structures matching your aesthetic
- **40 Vegetation**: Trees that respond to environmental stress
- **Dynamic Borders**: Walls that appear/dissolve based on openness

### Camera Controls

- **Drag** to rotate camera
- **Scroll** to zoom in/out
- **Auto-orbit** around your civilization

### Live Statistics

**POPULATION** - Number of living inhabitants (health > 30%)
**SURVIVAL RATE** - Percentage of original population still alive
**STABILITY** - Average health of all inhabitants

**CORE RITUAL STATUS** - Active / Degraded / Failed
- Degrades when Life Difficulty > 75%
- Fails when Life Difficulty > 90%

---

## 🎚️ The God Controller - 6 Real-Time Intervention Sliders

### 1. LIFE DIFFICULTY RATING (Easy ← → Harsh)

**Initial Value:** Set by your "greatest fear" response

**Real-Time Impact:**
- **Vegetation**: Trees wither and shrink
- **Inhabitants**: Move erratically, health decreases
- **Ritual**: Degrades at 75%, fails at 90%
- **Visual**: Green fades to brown/grey

### 2. RUMOR SPREAD INTENSITY (Controlled ← → Chaotic)

**Real-Time Impact:**
- **High**: Inhabitants gather in agitated clusters
- **Behavior**: Communication breaks down
- **Movement**: Non-productive grouping at center
- **Social**: Decisions become irrational

### 3. SOCIETAL TOLERANCE LEVEL (Low ← → High)

**Real-Time Impact:**
- **Low**: Collisions trigger destructive interactions (health loss, repulsion)
- **High**: Collisions trigger cooperative behavior (health gain, resource sharing)
- **Visual**: Conflict vs collaboration animations

### 4. PACE OF TREND/INNOVATION (Static ← → Rapid)

**Real-Time Impact:**
- **High**: Buildings rapidly change colors and styles
- **Architecture**: Temporary structures appear and vanish
- **Cultural**: Visual aesthetic evolution
- **Clothing**: Inhabitant colors shift

### 5. CLIMATE/DISASTER THREAT (Calm ← → Extreme)

**Real-Time Impact:**
- **Sky**: Darkens progressively
- **Weather**: Fog and atmospheric effects
- **Behavior**: Inhabitants panic and seek shelter
- **Camera**: Subtle shake simulating tremors
- **Environment**: Visual instability

### 6. BORDER OPENNESS LEVEL (Closed ← → Open)

**Real-Time Impact:**
- **< 50%**: Translucent walls appear between groups
- **Wall Height**: Scales with closure (higher = more closed)
- **> 50%**: Walls dissolve completely
- **Movement**: Cross-group exchange increases
- **Isolation**: Groups merge or separate

---

## 🏛️ Inhabitant Behaviors

Your 3D inhabitants exhibit complex AI behaviors:

### Behavior States

**WANDER** (Default)
- Random exploration of the island
- Occasional direction changes

**GATHER** (Rumor Spread > 60%)
- Move toward center of island
- Form clusters
- Non-productive grouping

**SHELTER** (Climate Threat > 70%)
- Panic response
- Seek nearest building
- Huddled behavior

**RITUAL** (Every 60 seconds, if Life Difficulty < 90%)
- All inhabitants pause
- Perform synchronized animation
- 2-second duration

### Interaction Mechanics

**Collisions**:
- Inhabitants detect proximity (< 1.5 units)
- **Low Tolerance**: Fight, lose health, repel
- **High Tolerance**: Cooperate, gain health, share resources

**Health System**:
- Visual opacity reflects health (1.0 = solid, 0.1 = transparent)
- Death occurs at health < 0.3
- Affects survival rate statistics

---

## 📊 Phase 3: Final Report

Click **FREEZE SIMULATION** to generate your civilization analysis.

### Report Sections

**1. Initial Genesis Configuration**
- Your 4 text responses displayed

**2. Final 3D State Snapshot**
- Rendered image of your final world state

**3. Final God Controller Settings**
- All 6 slider values at freeze time

**4. Civilization Outcome Analysis**

**Outcomes:**
- **THRIVING** (> 80% survival, > 70% health)
- **STRUGGLING** (> 50% survival)
- **COLLAPSE** (< 50% survival)

**Critical Factors Detected:**
- Extreme hardship (Life Difficulty > 75%)
- Environmental disasters (Climate Threat > 75%)
- Internal conflict (Tolerance < 25%)
- Isolation (Border Openness < 25%)

**Cultural Legacy:**
- Analysis of your sacred ritual's survival
- Whether it remains or was abandoned

---

## 💻 Technical Implementation

### Technologies

- **Three.js (r128)** - 3D rendering engine
- **OrbitControls** - Camera manipulation
- **Vanilla JavaScript** - ES6+ class-based architecture
- **HTML5 Canvas** - Final snapshot rendering
- **CSS3 Grid** - Responsive layout

### 3D Assets

**Island**:
- CylinderGeometry for terrain
- RingGeometry for beach
- CircleGeometry for ocean

**Inhabitants**:
- CapsuleGeometry for body (with shadow casting)
- SphereGeometry for head
- Custom color from aesthetic parsing

**Buildings**:
- BoxGeometry with varying heights
- Emissive materials for glow
- Shadow casting and receiving

**Vegetation**:
- CylinderGeometry trunks
- ConeGeometry leaves
- Dynamic scaling based on health

**Walls**:
- BoxGeometry barriers
- Transparent materials
- Dynamic opacity and height

### Text Parsing System

**Color Extraction**:
- Parses 20+ color keywords from aesthetic text
- Maps to hex values for Three.js materials
- Examples: "crimson" → 0xdc143c, "jade" → 0x00a86b

**Climate Interpretation**:
- Detects keywords: dark, water, cold, fire
- Sets sky color, fog, lighting intensity
- Initializes Life Difficulty (50-75%)

### Animation System

**Ritual Timing**:
- setInterval at 60-second intervals
- All inhabitants enter ritual state simultaneously
- Y-axis scaling animation (sine wave)
- Auto-exits after 2 seconds

**Movement**:
- Velocity-based physics
- Island boundary constraints
- Direction-based rotation
- Stress-multiplied speed

---

## 🎯 How to Use

1. **Open** `index.html` in a modern browser
2. **Fill** all 4 text input fields
3. **Click** "BEGIN CREATION"
4. **Observe** your 3D world generate
5. **Manipulate** the 6 God Controller sliders
6. **Watch** real-time 3D effects
7. **Freeze** when satisfied
8. **Analyze** your civilization's fate

---

## 🌐 Browser Compatibility

**Recommended:**
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

**Requirements:**
- WebGL 2.0 support
- ES6 JavaScript
- CSS Grid
- Canvas 2D context

---

## 📖 Design Philosophy

### The Power of Text-to-World

Your words become reality:
- "Darkness" literally dims the sun
- "Crimson" paints every inhabitant red
- "Raise hands" becomes their sacred act

### Interpretation as Creation

This simulator makes explicit the subjective nature of cultural understanding:
- **You interpret** ancient needs through modern text
- **The system translates** your words into physical laws
- **The civilization lives** under your interpretation
- **You discover** if your understanding was life-giving or destructive

### The Observer Effect

By watching, you inevitably intervene:
- Can you resist adjusting the sliders?
- Does observation change the outcome?
- Are you saving them or playing god?

---

## 🎓 Educational Applications

- **Anthropology**: Explore how interpretation shapes understanding
- **Systems Thinking**: See cascading effects of parameter changes
- **Ethics**: Question the morality of divine intervention
- **Game Design**: Study emergent behavior from simple rules
- **Simulation**: Understand agent-based modeling

---

## 🔮 Future Enhancements (Not Implemented)

- Multi-civilization islands with trade
- Natural language processing for richer text parsing
- Generative buildings based on architectural descriptions
- Ritual animation customization from text
- Time-lapse replay functionality
- Export 3D models (GLTF/OBJ)

---

## 📜 File Structure

```
culture/
├── index.html          # Three-phase UI structure
├── styles.css          # Genesis + God Mode + Report styling
├── app.js              # Main 3D application (940+ lines)
└── README.md           # This documentation
```

---

## 🙏 Credits

**Concept**: The Chrono-Cultural Incubator - God Mode Edition
**3D Engine**: Three.js by Mr.doob and contributors
**Philosophical Foundation**: Cultural relativism, systems theory, the observer effect

---

*"Did your divine decree create a thriving culture, or did your interventions lead to collapse?"*
