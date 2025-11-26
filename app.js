// ========================================
// THE CHRONO-CULTURAL INCUBATOR
// Main Application Logic
// ========================================

class ChronoCulturalIncubator {
    constructor() {
        // State management
        this.selectedCulture = null;
        this.gapPointChoices = [];
        this.currentGapPoint = 0;
        this.initialParameters = {};
        this.finalParameters = {};
        this.simulationStartTime = null;
        this.animationId = null;

        // Particle system
        this.particles = [];
        this.particleCount = 300;

        // Culture data
        this.cultures = {
            china: {
                name: 'Ancient East Asia',
                symbols: ['龍', '天', '道', '陰', '陽', '氣'],
                colors: ['#ff3333', '#ffaa33', '#ffff33']
            },
            mesopotamia: {
                name: 'Mesopotamia',
                symbols: ['𒀭', '𒌋𒌋', '𒀸', '𒁹', '𒈗', '𒆠'],
                colors: ['#3366ff', '#33ccff', '#ffffff']
            },
            mesoamerica: {
                name: 'Mesoamerica',
                symbols: ['⊕', '◬', '◭', '◮', '◯', '◰'],
                colors: ['#33ff33', '#ffaa33', '#ff3333']
            },
            mediterranean: {
                name: 'Ancient Mediterranean',
                symbols: ['Ω', 'Δ', 'Φ', 'Ψ', 'Σ', 'Π'],
                colors: ['#9966ff', '#ff66cc', '#ffffff']
            }
        };

        // Gap points configuration
        this.gapPoints = [
            {
                question: "What drove this civilization's earliest survival instinct?",
                choices: [
                    { symbol: '⚔', text: 'Primal Fear', mapping: { 'conflict-resolution': 80, 'environmental-pressure': 70 } },
                    { symbol: '🤝', text: 'Communal Trust', mapping: { 'conflict-resolution': 20, 'cultural-isolation': 30 } },
                    { symbol: '⚙', text: 'Technological Drive', mapping: { 'information-fidelity': 75, 'symbol-mutation': 80 } }
                ]
            },
            {
                question: "How did they understand the cosmos and their place within it?",
                choices: [
                    { symbol: '🌙', text: 'Divine Cycles', mapping: { 'symbol-mutation': 60, 'environmental-pressure': 40 } },
                    { symbol: '🔬', text: 'Natural Observation', mapping: { 'information-fidelity': 80, 'resource-entropy': 35 } },
                    { symbol: '👁', text: 'Mystical Revelation', mapping: { 'cultural-isolation': 70, 'symbol-mutation': 85 } }
                ]
            },
            {
                question: "What defined their relationships with neighboring peoples?",
                choices: [
                    { symbol: '⚡', text: 'Conquest & Dominance', mapping: { 'conflict-resolution': 85, 'resource-entropy': 70 } },
                    { symbol: '🔄', text: 'Trade & Exchange', mapping: { 'resource-entropy': 30, 'cultural-isolation': 20 } },
                    { symbol: '🏔', text: 'Isolation & Preservation', mapping: { 'cultural-isolation': 90, 'information-fidelity': 40 } }
                ]
            }
        ];

        // Initialize
        this.init();
    }

    init() {
        // Phase 0: Culture Selection
        this.initCultureSelection();

        // Phase 1: Archeo-Decryption
        this.initArcheoDecryption();

        // Phase 2: Digital Incubation
        this.initDigitalIncubation();

        // Phase 3: Final Reflection
        this.initFinalReflection();
    }

    // ========================================
    // PHASE 0: CULTURE SELECTION
    // ========================================

    initCultureSelection() {
        const cultureCards = document.querySelectorAll('.culture-card');
        cultureCards.forEach(card => {
            card.addEventListener('click', () => {
                this.selectedCulture = card.dataset.culture;
                this.playChime();
                this.startArcheoDecryption();
            });
        });
    }

    // ========================================
    // PHASE 1: ARCHEO-DECRYPTION
    // ========================================

    initArcheoDecryption() {
        const canvas = document.getElementById('code-stream');
        if (!canvas) return;

        this.codeStreamCanvas = canvas;
        this.codeStreamCtx = canvas.getContext('2d');

        // Initialize rune choices
        const runeOptions = document.querySelectorAll('.rune-option');
        runeOptions.forEach(option => {
            option.addEventListener('click', () => {
                this.handleRuneChoice(option.dataset.choice);
            });
        });
    }

    startArcheoDecryption() {
        // Switch to Phase 1
        this.switchPhase('archeo-decryption');

        // Set culture name
        document.getElementById('culture-name').textContent =
            this.cultures[this.selectedCulture].name;

        // Start code stream animation
        this.animateCodeStream();

        // Show first gap point after delay
        setTimeout(() => this.showGapPoint(0), 3000);
    }

    animateCodeStream() {
        const canvas = this.codeStreamCanvas;
        const ctx = this.codeStreamCtx;

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const culture = this.cultures[this.selectedCulture];
        const symbols = culture.symbols;
        const colors = culture.colors;

        // Create flowing symbols
        const streamElements = [];
        for (let i = 0; i < 50; i++) {
            streamElements.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                symbol: symbols[Math.floor(Math.random() * symbols.length)],
                color: colors[Math.floor(Math.random() * colors.length)],
                speed: 0.5 + Math.random() * 1.5,
                opacity: Math.random() * 0.5 + 0.3,
                rotation: Math.random() * Math.PI * 2
            });
        }

        const animate = () => {
            ctx.fillStyle = 'rgba(10, 5, 2, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            streamElements.forEach(el => {
                ctx.save();
                ctx.translate(el.x, el.y);
                ctx.rotate(el.rotation);
                ctx.globalAlpha = el.opacity;
                ctx.fillStyle = el.color;
                ctx.font = '30px serif';
                ctx.textAlign = 'center';
                ctx.fillText(el.symbol, 0, 0);
                ctx.restore();

                // Move down like flowing sand
                el.y += el.speed;
                el.rotation += 0.01;

                // Wrap around
                if (el.y > canvas.height + 30) {
                    el.y = -30;
                    el.x = Math.random() * canvas.width;
                }
            });

            this.codeStreamAnimationId = requestAnimationFrame(animate);
        };

        animate();
    }

    showGapPoint(index) {
        this.currentGapPoint = index;
        const gapPoint = this.gapPoints[index];
        const ui = document.getElementById('gap-point-ui');

        // Update UI
        document.getElementById('gap-number').textContent = index + 1;
        document.getElementById('gap-question').textContent = gapPoint.question;

        // Set rune symbols and text
        ['A', 'B', 'C'].forEach((choice, i) => {
            document.getElementById(`rune-${choice}`).textContent = gapPoint.choices[i].symbol;
            document.getElementById(`text-${choice}`).textContent = gapPoint.choices[i].text;
        });

        // Show gap point UI
        ui.classList.remove('gap-point-hidden');

        // Clear previous selections
        document.querySelectorAll('.rune-option').forEach(opt => {
            opt.classList.remove('selected');
        });
    }

    handleRuneChoice(choice) {
        const choiceIndex = choice.charCodeAt(0) - 65; // A=0, B=1, C=2
        const gapPoint = this.gapPoints[this.currentGapPoint];
        const selectedChoice = gapPoint.choices[choiceIndex];

        // Store choice
        this.gapPointChoices.push(selectedChoice);

        // Visual feedback
        document.querySelectorAll('.rune-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        document.querySelector(`.rune-option[data-choice="${choice}"]`).classList.add('selected');

        // Play chime
        this.playChime();

        // Update progress dots
        document.getElementById(`dot-${this.currentGapPoint + 1}`).classList.add('completed');

        // Hide gap point UI
        setTimeout(() => {
            document.getElementById('gap-point-ui').classList.add('gap-point-hidden');

            // Check if done with all gap points
            if (this.currentGapPoint < 2) {
                setTimeout(() => this.showGapPoint(this.currentGapPoint + 1), 2000);
            } else {
                setTimeout(() => this.completeArcheoDecryption(), 2000);
            }
        }, 1000);
    }

    completeArcheoDecryption() {
        // Cancel code stream animation
        cancelAnimationFrame(this.codeStreamAnimationId);

        // Calculate initial parameters based on choices
        this.calculateInitialParameters();

        // Transition to Phase 2
        this.startDigitalIncubation();
    }

    calculateInitialParameters() {
        // Initialize all parameters at 50%
        this.initialParameters = {
            'resource-entropy': 50,
            'information-fidelity': 50,
            'conflict-resolution': 50,
            'symbol-mutation': 50,
            'environmental-pressure': 50,
            'cultural-isolation': 50
        };

        // Apply mappings from choices (averaged)
        this.gapPointChoices.forEach(choice => {
            Object.keys(choice.mapping).forEach(param => {
                if (!this.initialParameters[param]) {
                    this.initialParameters[param] = 0;
                }
                // Average the values
                this.initialParameters[param] =
                    (this.initialParameters[param] + choice.mapping[param]) / 2;
            });
        });

        // Round to integers
        Object.keys(this.initialParameters).forEach(key => {
            this.initialParameters[key] = Math.round(this.initialParameters[key]);
        });
    }

    // ========================================
    // PHASE 2: DIGITAL INCUBATION
    // ========================================

    initDigitalIncubation() {
        const canvas = document.getElementById('particle-canvas');
        if (!canvas) return;

        this.particleCanvas = canvas;
        this.particleCtx = canvas.getContext('2d');

        // Initialize sliders
        const sliders = document.querySelectorAll('.intervention-slider');
        sliders.forEach(slider => {
            slider.addEventListener('input', (e) => {
                this.handleSliderChange(e.target);
            });
        });

        // Freeze button
        document.getElementById('freeze-btn').addEventListener('click', () => {
            this.freezeSimulation();
        });
    }

    startDigitalIncubation() {
        // Switch to Phase 2
        this.switchPhase('digital-incubation');

        // Set culture display
        document.getElementById('culture-display').textContent =
            `CULTURE: ${this.cultures[this.selectedCulture].name.toUpperCase()}`;

        // Set initial slider positions
        Object.keys(this.initialParameters).forEach(key => {
            const slider = document.getElementById(key);
            if (slider) {
                slider.value = this.initialParameters[key];
                this.updateSliderDisplay(slider);
            }
        });

        // Initialize particles
        this.initParticles();

        // Start simulation
        this.simulationStartTime = Date.now();
        this.animateParticles();
        this.startSimulationTimer();
    }

    initParticles() {
        const canvas = this.particleCanvas;
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const colors = this.cultures[this.selectedCulture].colors;

        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                radius: 3 + Math.random() * 3,
                color: colors[Math.floor(Math.random() * colors.length)],
                knowledge: Math.random(),
                symbol: Math.floor(Math.random() * 10),
                group: Math.floor(Math.random() * 5),
                energy: 1.0
            });
        }
    }

    animateParticles() {
        const ctx = this.particleCtx;
        const canvas = this.particleCanvas;

        // Clear with fade effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Get current parameters
        const params = this.getCurrentParameters();

        // Update and draw particles
        this.particles.forEach((p, i) => {
            // Apply environmental pressure
            const pressure = params['environmental-pressure'] / 100;
            p.energy -= pressure * 0.001;

            // Regenerate based on resource entropy
            const abundance = 1 - (params['resource-entropy'] / 100);
            p.energy += abundance * 0.002;
            p.energy = Math.max(0, Math.min(1, p.energy));

            // Movement influenced by cultural isolation
            const isolation = params['cultural-isolation'] / 100;
            const speedMultiplier = 1 - (isolation * 0.5);

            p.x += p.vx * speedMultiplier;
            p.y += p.vy * speedMultiplier;

            // Wrap around edges
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            // Check collisions
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p2.x - p.x;
                const dy = p2.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < p.radius + p2.radius + 10) {
                    // Interaction based on conflict resolution
                    const conflictIndex = params['conflict-resolution'] / 100;

                    if (Math.random() > conflictIndex) {
                        // Constructive: share knowledge
                        const fidelity = params['information-fidelity'] / 100;
                        const knowledgeTransfer = (p.knowledge + p2.knowledge) / 2;
                        p.knowledge += (knowledgeTransfer - p.knowledge) * fidelity * 0.1;
                        p2.knowledge += (knowledgeTransfer - p2.knowledge) * fidelity * 0.1;

                        // Merge groups if not isolated
                        if (isolation < 0.5 && Math.random() > isolation) {
                            p2.group = p.group;
                        }
                    } else {
                        // Destructive: lose energy
                        p.energy *= 0.95;
                        p2.energy *= 0.95;
                    }
                }
            }

            // Symbol mutation
            const mutationRate = params['symbol-mutation'] / 100;
            if (Math.random() < mutationRate * 0.01) {
                p.symbol = Math.floor(Math.random() * 10);
            }

            // Respawn if energy depleted
            if (p.energy < 0.1) {
                p.x = Math.random() * canvas.width;
                p.y = Math.random() * canvas.height;
                p.energy = 1.0;
            }

            // Draw particle
            const alpha = p.energy;
            ctx.globalAlpha = alpha;

            // Color intensity based on knowledge
            const brightness = 0.5 + (p.knowledge * 0.5);
            ctx.fillStyle = this.adjustColor(p.color, brightness);

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();

            // Draw connections to same group
            if (!isolation || isolation < 0.7) {
                this.particles.forEach(p3 => {
                    if (p3 !== p && p3.group === p.group) {
                        const dx = p3.x - p.x;
                        const dy = p3.y - p.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist < 100) {
                            ctx.globalAlpha = (1 - dist / 100) * 0.3 * alpha;
                            ctx.strokeStyle = p.color;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(p.x, p.y);
                            ctx.lineTo(p3.x, p3.y);
                            ctx.stroke();
                        }
                    }
                });
            }
        });

        ctx.globalAlpha = 1;

        // Update stats
        this.updateStats();

        this.animationId = requestAnimationFrame(() => this.animateParticles());
    }

    adjustColor(hexColor, brightness) {
        // Simple brightness adjustment
        const num = parseInt(hexColor.replace('#', ''), 16);
        const r = Math.min(255, Math.floor(((num >> 16) & 255) * brightness));
        const g = Math.min(255, Math.floor(((num >> 8) & 255) * brightness));
        const b = Math.min(255, Math.floor((num & 255) * brightness));
        return `rgb(${r}, ${g}, ${b})`;
    }

    getCurrentParameters() {
        const params = {};
        const sliders = document.querySelectorAll('.intervention-slider');
        sliders.forEach(slider => {
            params[slider.id] = parseInt(slider.value);
        });
        return params;
    }

    handleSliderChange(slider) {
        this.updateSliderDisplay(slider);
    }

    updateSliderDisplay(slider) {
        const valueDisplay = document.getElementById(`${slider.id}-val`);
        if (valueDisplay) {
            valueDisplay.textContent = `${slider.value}%`;
        }
    }

    updateStats() {
        // Calculate population (living particles)
        const living = this.particles.filter(p => p.energy > 0.3).length;
        document.getElementById('population').textContent = living;

        // Calculate stability (variance in energy)
        const avgEnergy = this.particles.reduce((sum, p) => sum + p.energy, 0) / this.particles.length;
        const stability = Math.round(avgEnergy * 100);
        document.getElementById('stability').textContent = `${stability}%`;

        // Calculate complexity (unique groups and symbols)
        const uniqueGroups = new Set(this.particles.map(p => p.group)).size;
        const uniqueSymbols = new Set(this.particles.map(p => p.symbol)).size;
        const complexity = uniqueGroups * uniqueSymbols;
        document.getElementById('complexity').textContent = complexity;
    }

    startSimulationTimer() {
        setInterval(() => {
            const elapsed = Date.now() - this.simulationStartTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            document.getElementById('simulation-time').textContent =
                `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }, 1000);
    }

    // ========================================
    // PHASE 3: FINAL REFLECTION
    // ========================================

    initFinalReflection() {
        document.getElementById('restart-btn').addEventListener('click', () => {
            location.reload();
        });
    }

    freezeSimulation() {
        // Stop animation
        cancelAnimationFrame(this.animationId);

        // Store final parameters
        this.finalParameters = this.getCurrentParameters();

        // Switch to reflection phase
        this.showFinalReflection();
    }

    showFinalReflection() {
        this.switchPhase('final-reflection');

        // Display initial parameters
        const initialParamsDiv = document.getElementById('initial-params');
        initialParamsDiv.innerHTML = '<h4>Interpretation-Based Settings:</h4>';
        Object.keys(this.initialParameters).forEach(key => {
            const name = this.formatParameterName(key);
            initialParamsDiv.innerHTML += `<p>${name}: ${this.initialParameters[key]}%</p>`;
        });

        // Display final parameters
        const finalParamsDiv = document.getElementById('final-params');
        finalParamsDiv.innerHTML = '<h4>Final Intervention Settings:</h4>';
        Object.keys(this.finalParameters).forEach(key => {
            const name = this.formatParameterName(key);
            const change = this.finalParameters[key] - this.initialParameters[key];
            const changeText = change >= 0 ? `+${change}` : change;
            finalParamsDiv.innerHTML += `<p>${name}: ${this.finalParameters[key]}% (${changeText})</p>`;
        });

        // Draw final snapshot
        this.drawFinalSnapshot();

        // Generate report
        this.generateEvolutionReport();
    }

    drawFinalSnapshot() {
        const canvas = document.getElementById('final-snapshot');
        const ctx = canvas.getContext('2d');

        // Copy current particle state to snapshot
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const scaleX = canvas.width / this.particleCanvas.width;
        const scaleY = canvas.height / this.particleCanvas.height;

        this.particles.forEach(p => {
            ctx.globalAlpha = p.energy;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x * scaleX, p.y * scaleY, p.radius, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.globalAlpha = 1;
    }

    generateEvolutionReport() {
        const reportDiv = document.getElementById('evolution-report');

        const living = this.particles.filter(p => p.energy > 0.3).length;
        const survivalRate = (living / this.particleCount * 100).toFixed(1);

        const avgKnowledge = this.particles.reduce((sum, p) => sum + p.knowledge, 0) / this.particles.length;
        const knowledgeLevel = avgKnowledge > 0.7 ? 'highly advanced' :
                               avgKnowledge > 0.4 ? 'moderately developed' : 'primitive';

        const uniqueGroups = new Set(this.particles.map(p => p.group)).size;
        const cohesion = uniqueGroups < 3 ? 'unified' :
                         uniqueGroups < 7 ? 'fragmented' : 'highly diverse';

        // Calculate biggest change
        let biggestChange = { param: '', value: 0 };
        Object.keys(this.finalParameters).forEach(key => {
            const change = Math.abs(this.finalParameters[key] - this.initialParameters[key]);
            if (change > biggestChange.value) {
                biggestChange = { param: key, value: change };
            }
        });

        const report = `
            <p><strong>Survival Rate:</strong> ${survivalRate}% of the cultural agents persisted through your intervention.</p>

            <p><strong>Knowledge Evolution:</strong> The culture achieved a ${knowledgeLevel} state of collective understanding,
            with an average knowledge index of ${(avgKnowledge * 100).toFixed(1)}%.</p>

            <p><strong>Social Cohesion:</strong> The civilization evolved into a ${cohesion} society with ${uniqueGroups} distinct cultural groups.</p>

            <p><strong>Greatest Intervention:</strong> Your most significant change was to
            ${this.formatParameterName(biggestChange.param)}, shifting it by ${biggestChange.value} points from your initial interpretation.</p>

            <p><strong>Historical Reflection:</strong> ${this.generateHistoricalReflection()}</p>
        `;

        reportDiv.innerHTML = report;
    }

    generateHistoricalReflection() {
        const culture = this.cultures[this.selectedCulture].name;
        const living = this.particles.filter(p => p.energy > 0.3).length;
        const survivalRate = living / this.particleCount;

        if (survivalRate > 0.7) {
            return `Your interpretation and intervention allowed ${culture} to thrive. By balancing the forces of change and preservation, you created conditions for sustainable cultural evolution.`;
        } else if (survivalRate > 0.4) {
            return `${culture} survived your stewardship, though not without struggle. Your interventions created a culture that persists despite internal tensions and external pressures.`;
        } else {
            return `Your interpretation and intervention led to the decline of ${culture}. Perhaps your modern understanding imposed conditions incompatible with their fundamental nature, or your interventions were too extreme for the culture to adapt.`;
        }
    }

    formatParameterName(key) {
        return key.split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    // ========================================
    // UTILITY FUNCTIONS
    // ========================================

    switchPhase(phaseId) {
        document.querySelectorAll('.phase-container').forEach(phase => {
            phase.classList.remove('active');
        });
        document.getElementById(phaseId).classList.add('active');
    }

    playChime() {
        // Create a simple chime sound using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ChronoCulturalIncubator();
});
