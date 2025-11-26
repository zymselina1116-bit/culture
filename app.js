// ========================================
// THE CHRONO-CULTURAL INCUBATOR
// Accelerated Evolution Simulation
// ========================================

class AcceleratedCivilization {
    constructor() {
        // Archetype definitions
        this.archetypes = {
            desert: {
                name: 'Desert Nomads',
                description: 'Hardy survivors adapted to harsh desert conditions. High mobility, scarce resources.',
                colors: { primary: 0xd4a574, secondary: 0xff8c42, terrain: 0xe0c097 },
                climate: { sky: 0x4a3a1a, lighting: 0.9 },
                parameters: {
                    'life-difficulty': 75,
                    'rumor-spread': 45,
                    'societal-tolerance': 60,
                    'innovation-pace': 40,
                    'climate-threat': 70,
                    'border-openness': 65
                }
            },
            mountain: {
                name: 'Mountain Farmers',
                description: 'Isolated highlanders living in self-sufficient communities. Strong traditions, slow change.',
                colors: { primary: 0x6b8e23, secondary: 0x8b7355, terrain: 0x5a7f4a },
                climate: { sky: 0x5a6f8a, lighting: 0.7 },
                parameters: {
                    'life-difficulty': 60,
                    'rumor-spread': 30,
                    'societal-tolerance': 75,
                    'innovation-pace': 25,
                    'climate-threat': 50,
                    'border-openness': 20
                }
            },
            coastal: {
                name: 'Coastal Traders',
                description: 'Seafaring merchants with open borders and rapid innovation. Cosmopolitan and adaptable.',
                colors: { primary: 0x4169e1, secondary: 0x87ceeb, terrain: 0x6fa3d8 },
                climate: { sky: 0x87ceeb, lighting: 0.8 },
                parameters: {
                    'life-difficulty': 35,
                    'rumor-spread': 55,
                    'societal-tolerance': 70,
                    'innovation-pace': 80,
                    'climate-threat': 40,
                    'border-openness': 85
                }
            },
            forest: {
                name: 'Forest Dwellers',
                description: 'Balanced society living in harmony with nature. Sustainable and stable.',
                colors: { primary: 0x228b22, secondary: 0x6b8e23, terrain: 0x4a7c4a },
                climate: { sky: 0x4a7c7c, lighting: 0.6 },
                parameters: {
                    'life-difficulty': 50,
                    'rumor-spread': 50,
                    'societal-tolerance': 65,
                    'innovation-pace': 50,
                    'climate-threat': 50,
                    'border-openness': 50
                }
            },
            steppe: {
                name: 'Steppe Warriors',
                description: 'Aggressive horse-riding nomads. Expansionist and warlike.',
                colors: { primary: 0xb8860b, secondary: 0xdaa520, terrain: 0xa89968 },
                climate: { sky: 0x6a5a3a, lighting: 0.75 },
                parameters: {
                    'life-difficulty': 55,
                    'rumor-spread': 70,
                    'societal-tolerance': 30,
                    'innovation-pace': 60,
                    'climate-threat': 55,
                    'border-openness': 40
                }
            },
            river: {
                name: 'River Civilization',
                description: 'Advanced agricultural society along fertile rivers. Organized and innovative.',
                colors: { primary: 0xcd853f, secondary: 0xdaa520, terrain: 0xb8956a },
                climate: { sky: 0x6a8fb8, lighting: 0.85 },
                parameters: {
                    'life-difficulty': 30,
                    'rumor-spread': 40,
                    'societal-tolerance': 70,
                    'innovation-pace': 75,
                    'climate-threat': 35,
                    'border-openness': 60
                }
            }
        };

        this.selectedArchetype = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;

        // Simulation objects
        this.island = null;
        this.inhabitants = [];
        this.buildings = [];
        this.vegetation = [];
        this.walls = [];
        this.waterLevel = null;
        this.enemies = [];

        // Time control
        this.simulatedYear = 0;
        this.simulatedMonth = 1;
        this.timeScale = 0; // 0=pause, 1=1x, 2=10x, 3=100x
        this.timeAccumulator = 0;
        this.previewRunning = false;

        // Simulation state
        this.populationCount = 30;
        this.buildingCount = 8;
        this.animationId = null;

        this.init();
    }

    init() {
        this.initArchetypeSelection();
    }

    // ========================================
    // PHASE 1: ARCHETYPE SELECTION
    // ========================================

    initArchetypeSelection() {
        const cards = document.querySelectorAll('.archetype-card');
        const previewName = document.getElementById('preview-name');
        const previewDesc = document.getElementById('preview-description');

        // Initialize preview canvas
        this.initPreviewCanvas();

        // Hover previews
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const archetype = card.dataset.archetype;
                const data = this.archetypes[archetype];

                previewName.textContent = data.name;
                previewDesc.textContent = data.description;

                this.updatePreview(archetype);
            });

            // Click to select
            card.addEventListener('click', () => {
                cards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');

                this.selectedArchetype = card.dataset.archetype;

                // Start simulation after brief delay
                setTimeout(() => this.startSimulation(), 1000);
            });
        });
    }

    initPreviewCanvas() {
        const canvas = document.getElementById('preview-canvas');
        const container = canvas.parentElement;

        this.previewScene = new THREE.Scene();
        this.previewCamera = new THREE.PerspectiveCamera(50, container.offsetWidth / container.offsetHeight, 0.1, 1000);
        this.previewCamera.position.set(15, 10, 15);
        this.previewCamera.lookAt(0, 0, 0);

        this.previewRenderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        this.previewRenderer.setSize(container.offsetWidth * 0.66, 400);
        this.previewRenderer.setPixelRatio(window.devicePixelRatio);
        this.previewRenderer.setClearColor(0x000000);

        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.previewScene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(5, 10, 5);
        this.previewScene.add(directionalLight);

        this.animatePreview();
    }

    updatePreview(archetypeKey) {
        // Clear existing preview
        while (this.previewScene.children.length > 2) {
            this.previewScene.remove(this.previewScene.children[2]);
        }

        const archetype = this.archetypes[archetypeKey];

        // Simple island preview
        const islandGeo = new THREE.CylinderGeometry(8, 9, 1, 32);
        const islandMat = new THREE.MeshPhongMaterial({ color: archetype.colors.terrain });
        const island = new THREE.Mesh(islandGeo, islandMat);
        island.position.y = -0.5;
        this.previewScene.add(island);

        // Sample buildings
        for (let i = 0; i < 3; i++) {
            const angle = (i / 3) * Math.PI * 2;
            const radius = 4;
            const buildingGeo = new THREE.BoxGeometry(0.8, 1.5, 0.8);
            const buildingMat = new THREE.MeshPhongMaterial({
                color: archetype.colors.primary,
                emissive: archetype.colors.primary,
                emissiveIntensity: 0.2
            });
            const building = new THREE.Mesh(buildingGeo, buildingMat);
            building.position.set(
                Math.cos(angle) * radius,
                0.75,
                Math.sin(angle) * radius
            );
            this.previewScene.add(building);
        }

        // Sample inhabitants
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            const radius = 2 + Math.random() * 3;
            const personGeo = new THREE.CapsuleGeometry(0.2, 0.6, 4, 8);
            const personMat = new THREE.MeshPhongMaterial({ color: archetype.colors.secondary });
            const person = new THREE.Mesh(personGeo, personMat);
            person.position.set(
                Math.cos(angle) * radius,
                0.5,
                Math.sin(angle) * radius
            );
            this.previewScene.add(person);
        }
    }

    animatePreview() {
        this.previewRenderer.render(this.previewScene, this.previewCamera);
        requestAnimationFrame(() => this.animatePreview());
    }

    // ========================================
    // PHASE 2: ACCELERATED SIMULATION
    // ========================================

    startSimulation() {
        this.switchPhase('accelerated-sim');

        const archetype = this.archetypes[this.selectedArchetype];

        // Set UI
        document.getElementById('civilization-name').textContent = archetype.name.toUpperCase();

        // Initialize Three.js
        this.initThreeJS();

        // Create world
        this.createIsland();
        this.createInhabitants();
        this.createBuildings();
        this.createVegetation();

        // Set archetype parameters
        Object.keys(archetype.parameters).forEach(key => {
            const slider = document.getElementById(key);
            if (slider) {
                slider.value = archetype.parameters[key];
                this.updateSliderDisplay(key);
            }
        });

        // Initialize controls
        this.initTimeControl();
        this.initEventButtons();
        this.initSliders();

        // Start animation
        this.animateWorld();

        // Run 10-second preview at 100x
        this.runInitialPreview();
    }

    initThreeJS() {
        const canvas = document.getElementById('world-canvas');
        const container = canvas.parentElement;

        this.scene = new THREE.Scene();
        const archetype = this.archetypes[this.selectedArchetype];
        this.scene.background = new THREE.Color(archetype.climate.sky);
        this.scene.fog = new THREE.Fog(archetype.climate.sky, 50, 200);

        this.camera = new THREE.PerspectiveCamera(60, container.offsetWidth / container.offsetHeight, 0.1, 1000);
        this.camera.position.set(30, 25, 30);

        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        this.renderer.setSize(container.offsetWidth, container.offsetHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;

        this.controls = new THREE.OrbitControls(this.camera, canvas);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxPolarAngle = Math.PI / 2.2;
        this.controls.minDistance = 15;
        this.controls.maxDistance = 80;

        const archetype = this.archetypes[this.selectedArchetype];
        const ambientLight = new THREE.AmbientLight(0x404040, archetype.climate.lighting);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, archetype.climate.lighting);
        directionalLight.position.set(50, 50, 25);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        window.addEventListener('resize', () => {
            this.camera.aspect = container.offsetWidth / container.offsetHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(container.offsetWidth, container.offsetHeight);
        });
    }

    createIsland() {
        const archetype = this.archetypes[this.selectedArchetype];

        const islandGeometry = new THREE.CylinderGeometry(25, 28, 3, 32);
        const islandMaterial = new THREE.MeshPhongMaterial({
            color: archetype.colors.terrain,
            flatShading: true
        });
        this.island = new THREE.Mesh(islandGeometry, islandMaterial);
        this.island.position.y = -1.5;
        this.island.receiveShadow = true;
        this.scene.add(this.island);

        const beachGeometry = new THREE.RingGeometry(25, 28, 32);
        const beachMaterial = new THREE.MeshBasicMaterial({
            color: 0xe5c9a0,
            side: THREE.DoubleSide
        });
        const beach = new THREE.Mesh(beachGeometry, beachMaterial);
        beach.rotation.x = -Math.PI / 2;
        beach.position.y = 0.1;
        this.scene.add(beach);

        const oceanGeometry = new THREE.CircleGeometry(100, 64);
        const oceanMaterial = new THREE.MeshPhongMaterial({
            color: 0x1a4d6d,
            shininess: 100
        });
        const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);
        ocean.rotation.x = -Math.PI / 2;
        ocean.position.y = -2;
        this.scene.add(ocean);

        this.waterLevel = ocean;
    }

    createInhabitants() {
        const archetype = this.archetypes[this.selectedArchetype];
        const color = archetype.colors.secondary;

        for (let i = 0; i < this.populationCount; i++) {
            const angle = (i / this.populationCount) * Math.PI * 2;
            const radius = 5 + Math.random() * 15;

            const bodyGeometry = new THREE.CapsuleGeometry(0.3, 1, 4, 8);
            const bodyMaterial = new THREE.MeshPhongMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: 0.1
            });
            const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
            body.castShadow = true;

            const headGeometry = new THREE.SphereGeometry(0.25, 8, 8);
            const head = new THREE.Mesh(headGeometry, bodyMaterial);
            head.position.y = 0.75;
            body.add(head);

            body.position.set(
                Math.cos(angle) * radius,
                0.7,
                Math.sin(angle) * radius
            );

            const inhabitant = {
                mesh: body,
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.05,
                    0,
                    (Math.random() - 0.5) * 0.05
                ),
                health: 1.0,
                alive: true,
                infected: false
            };

            this.inhabitants.push(inhabitant);
            this.scene.add(body);
        }
    }

    createBuildings() {
        const archetype = this.archetypes[this.selectedArchetype];
        const color = archetype.colors.primary;

        for (let i = 0; i < this.buildingCount; i++) {
            const angle = (i / this.buildingCount) * Math.PI * 2;
            const radius = 12 + Math.random() * 5;

            const height = 1.5 + Math.random() * 2;
            const width = 1 + Math.random() * 0.5;

            const geometry = new THREE.BoxGeometry(width, height, width);
            const material = new THREE.MeshPhongMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: 0.1
            });
            const building = new THREE.Mesh(geometry, material);
            building.position.set(
                Math.cos(angle) * radius,
                height / 2,
                Math.sin(angle) * radius
            );
            building.castShadow = true;
            building.receiveShadow = true;

            this.buildings.push({
                mesh: building,
                originalHeight: height,
                targetHeight: height,
                growthRate: 0
            });

            this.scene.add(building);
        }
    }

    createVegetation() {
        for (let i = 0; i < 40; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 23;

            const trunkGeometry = new THREE.CylinderGeometry(0.1, 0.15, 0.8, 6);
            const trunkMaterial = new THREE.MeshPhongMaterial({ color: 0x6b4423 });
            const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);

            const leavesGeometry = new THREE.ConeGeometry(0.5, 1, 6);
            const leavesMaterial = new THREE.MeshPhongMaterial({ color: 0x2d5016 });
            const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
            leaves.position.y = 1;
            trunk.add(leaves);

            trunk.position.set(
                Math.cos(angle) * radius,
                0.4,
                Math.sin(angle) * radius
            );
            trunk.castShadow = true;

            this.vegetation.push({
                mesh: trunk,
                health: 1.0,
                originalScale: 1.0
            });

            this.scene.add(trunk);
        }
    }

    // ========================================
    // TIME CONTROL
    // ========================================

    initTimeControl() {
        const timeSlider = document.getElementById('time-scale');
        const speedDisplay = document.getElementById('current-speed');

        timeSlider.addEventListener('input', () => {
            this.timeScale = parseInt(timeSlider.value);

            const speeds = ['PAUSED', '1x SPEED', '10x SPEED', '100x ACCELERATED'];
            speedDisplay.textContent = speeds[this.timeScale];
        });
    }

    runInitialPreview() {
        // Run at 100x for 10 seconds
        this.previewRunning = true;
        this.timeScale = 3;
        document.getElementById('time-scale').value = 3;
        document.getElementById('current-speed').textContent = '100x ACCELERATED (PREVIEW)';

        setTimeout(() => {
            this.previewRunning = false;
            this.timeScale = 0;
            document.getElementById('time-scale').value = 0;
            document.getElementById('current-speed').textContent = 'PAUSED';
        }, 10000);
    }

    updateSimulationTime(delta) {
        if (this.timeScale === 0) return;

        const multipliers = [0, 1, 10, 100];
        const actualDelta = delta * multipliers[this.timeScale];

        this.timeAccumulator += actualDelta;

        // Each "month" is 1 second of real time at 1x speed
        if (this.timeAccumulator >= 1.0) {
            this.simulatedMonth += Math.floor(this.timeAccumulator);
            this.timeAccumulator -= Math.floor(this.timeAccumulator);

            if (this.simulatedMonth > 12) {
                this.simulatedYear += Math.floor(this.simulatedMonth / 12);
                this.simulatedMonth = this.simulatedMonth % 12;
                if (this.simulatedMonth === 0) this.simulatedMonth = 12;
            }

            document.getElementById('year-display').textContent =
                String(this.simulatedYear).padStart(4, '0');
            document.getElementById('month-display').textContent =
                String(this.simulatedMonth).padStart(2, '0');

            // Update era
            this.updateEra();
        }
    }

    updateEra() {
        const eraDisplay = document.getElementById('current-era');
        if (this.simulatedYear < 10) {
            eraDisplay.textContent = 'EARLY SETTLEMENT';
        } else if (this.simulatedYear < 50) {
            eraDisplay.textContent = 'GROWTH PERIOD';
        } else if (this.simulatedYear < 100) {
            eraDisplay.textContent = 'ESTABLISHED SOCIETY';
        } else {
            eraDisplay.textContent = 'ADVANCED CIVILIZATION';
        }
    }

    // ========================================
    // EVENT INJECTION
    // ========================================

    initEventButtons() {
        document.getElementById('inject-flood').addEventListener('click', () => {
            this.injectFlood();
        });

        document.getElementById('inject-plague').addEventListener('click', () => {
            this.injectPlague();
        });

        document.getElementById('inject-war').addEventListener('click', () => {
            this.injectWar();
        });

        document.getElementById('reset-btn').addEventListener('click', () => {
            location.reload();
        });
    }

    showEventNotification(title, message) {
        const notification = document.getElementById('event-notification');
        document.getElementById('event-title').textContent = title;
        document.getElementById('event-message').textContent = message;

        notification.classList.add('active');

        setTimeout(() => {
            notification.classList.remove('active');
        }, 4000);
    }

    injectFlood() {
        this.showEventNotification('THE DELUGE', 'Catastrophic flooding strikes the island!');

        // Raise water level
        const targetY = 1.5;
        const startY = this.waterLevel.position.y;
        const duration = 3000;
        const startTime = Date.now();

        const animateFlood = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            this.waterLevel.position.y = startY + (targetY - startY) * progress;

            // Panic behavior
            this.inhabitants.forEach(inh => {
                if (inh.alive && inh.mesh.position.y < 2) {
                    const toCenter = new THREE.Vector3(0, 0, 0).sub(inh.mesh.position).normalize();
                    inh.velocity.copy(toCenter.multiplyScalar(0.15));
                }
            });

            if (progress < 1) {
                requestAnimationFrame(animateFlood);
            } else {
                // Recede after 5 seconds
                setTimeout(() => {
                    const recedeStart = Date.now();
                    const animateRecede = () => {
                        const elapsed = Date.now() - recedeStart;
                        const progress = Math.min(elapsed / duration, 1);

                        this.waterLevel.position.y = targetY + (startY - targetY) * progress;

                        if (progress < 1) {
                            requestAnimationFrame(animateRecede);
                        }
                    };
                    animateRecede();
                }, 5000);
            }
        };

        animateFlood();
    }

    injectPlague() {
        this.showEventNotification('THE PLAGUE', 'A deadly disease sweeps through the population!');

        let infectionCount = 0;
        const maxInfected = Math.floor(this.inhabitants.length * 0.4);

        const spreadDisease = () => {
            if (infectionCount >= maxInfected) return;

            const aliveInhabitants = this.inhabitants.filter(i => i.alive && !i.infected);
            if (aliveInhabitants.length === 0) return;

            const victim = aliveInhabitants[Math.floor(Math.random() * aliveInhabitants.length)];
            victim.infected = true;
            victim.mesh.material.color.setHex(0x88ff00); // Green sick color
            infectionCount++;

            setTimeout(() => {
                victim.alive = false;
                victim.health = 0;
                victim.mesh.visible = false;
                this.scene.remove(victim.mesh);
            }, 2000);

            if (infectionCount < maxInfected) {
                setTimeout(spreadDisease, 500);
            }
        };

        spreadDisease();
    }

    injectWar() {
        this.showEventNotification('NEIGHBOR\'S WAR', 'Hostile forces attack from the borders!');

        // Create enemy units at borders
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const radius = 30;

            const enemyGeo = new THREE.ConeGeometry(0.4, 1.2, 4);
            const enemyMat = new THREE.MeshPhongMaterial({
                color: 0xff3366,
                emissive: 0xff3366,
                emissiveIntensity: 0.5
            });
            const enemy = new THREE.Mesh(enemyGeo, enemyMat);
            enemy.position.set(
                Math.cos(angle) * radius,
                0.6,
                Math.sin(angle) * radius
            );
            enemy.rotation.y = angle + Math.PI;

            const enemyData = {
                mesh: enemy,
                angle: angle,
                speed: 0.05
            };

            this.enemies.push(enemyData);
            this.scene.add(enemy);
        }

        // Animate enemies moving inward
        const attackDuration = 8000;
        const startTime = Date.now();

        const animateAttack = () => {
            const elapsed = Date.now() - startTime;

            this.enemies.forEach(enemy => {
                const radius = 30 - (elapsed / attackDuration) * 15;
                enemy.mesh.position.set(
                    Math.cos(enemy.angle) * radius,
                    0.6,
                    Math.sin(enemy.angle) * radius
                );
            });

            if (elapsed < attackDuration) {
                requestAnimationFrame(animateAttack);
            } else {
                // Remove enemies
                this.enemies.forEach(enemy => {
                    this.scene.remove(enemy.mesh);
                });
                this.enemies = [];
            }
        };

        animateAttack();
    }

    // ========================================
    // SLIDERS
    // ========================================

    initSliders() {
        const sliderIds = [
            'life-difficulty', 'rumor-spread', 'societal-tolerance',
            'innovation-pace', 'climate-threat', 'border-openness'
        ];

        sliderIds.forEach(id => {
            const slider = document.getElementById(id);
            slider.addEventListener('input', () => {
                this.updateSliderDisplay(id);
            });
        });
    }

    updateSliderDisplay(sliderId) {
        const slider = document.getElementById(sliderId);
        const display = document.getElementById(`${sliderId}-val`);
        if (display) {
            display.textContent = `${slider.value}%`;
        }
    }

    applySliderEffects() {
        const values = {
            lifeDifficulty: parseInt(document.getElementById('life-difficulty').value),
            rumorSpread: parseInt(document.getElementById('rumor-spread').value),
            societalTolerance: parseInt(document.getElementById('societal-tolerance').value),
            innovationPace: parseInt(document.getElementById('innovation-pace').value),
            climateThreat: parseInt(document.getElementById('climate-threat').value),
            borderOpenness: parseInt(document.getElementById('border-openness').value)
        };

        // Vegetation health
        const healthFactor = 1 - (values.lifeDifficulty / 100) * 0.7;
        this.vegetation.forEach(veg => {
            veg.health = healthFactor;
            veg.mesh.scale.y = veg.originalScale * healthFactor;
        });

        // Building growth/decay based on overall health
        const prosperity = (100 - values.lifeDifficulty + values.innovationPace) / 200;
        this.buildings.forEach(building => {
            building.targetHeight = building.originalHeight * (0.5 + prosperity * 1.5);
            building.growthRate = (building.targetHeight - building.mesh.scale.y) * 0.01;
        });

        // Update civilization status
        const statusElement = document.getElementById('civ-status');
        if (prosperity > 0.7) {
            statusElement.textContent = 'THRIVING';
            statusElement.className = 'thriving';
        } else if (prosperity > 0.4) {
            statusElement.textContent = 'STABLE';
            statusElement.className = '';
        } else if (prosperity > 0.2) {
            statusElement.textContent = 'DECLINING';
            statusElement.className = 'declining';
        } else {
            statusElement.textContent = 'COLLAPSING';
            statusElement.className = 'collapsing';
        }
    }

    // ========================================
    // ANIMATION LOOP
    // ========================================

    animateWorld() {
        this.controls.update();

        // Time update
        this.updateSimulationTime(1/60);

        // Apply slider effects
        this.applySliderEffects();

        // Update inhabitants
        this.updateInhabitants();

        // Update buildings (growth/decay)
        this.updateBuildings();

        // Update stats
        this.updateStats();

        // Render
        this.renderer.render(this.scene, this.camera);

        this.animationId = requestAnimationFrame(() => this.animateWorld());
    }

    updateInhabitants() {
        const multipliers = [0, 1, 10, 100];
        const speedMultiplier = multipliers[this.timeScale];

        this.inhabitants.forEach((inh, i) => {
            if (!inh.alive) return;

            // Movement
            inh.mesh.position.add(inh.velocity.clone().multiplyScalar(speedMultiplier));

            // Random direction change
            if (Math.random() < 0.01) {
                inh.velocity.x += (Math.random() - 0.5) * 0.02;
                inh.velocity.z += (Math.random() - 0.5) * 0.02;
                inh.velocity.clampLength(0, 0.1);
            }

            // Keep on island
            const distFromCenter = Math.sqrt(
                inh.mesh.position.x ** 2 + inh.mesh.position.z ** 2
            );
            if (distFromCenter > 23) {
                const angle = Math.atan2(inh.mesh.position.z, inh.mesh.position.x);
                inh.mesh.position.x = Math.cos(angle) * 23;
                inh.mesh.position.z = Math.sin(angle) * 23;
                inh.velocity.multiplyScalar(-0.5);
            }

            // Face movement direction
            if (inh.velocity.length() > 0.01) {
                const angle = Math.atan2(inh.velocity.x, inh.velocity.z);
                inh.mesh.rotation.y = angle;
            }
        });
    }

    updateBuildings() {
        this.buildings.forEach(building => {
            // Gradual growth/decay
            if (Math.abs(building.mesh.scale.y - building.targetHeight / building.originalHeight) > 0.01) {
                building.mesh.scale.y += building.growthRate;
                building.mesh.position.y = (building.mesh.scale.y * building.originalHeight) / 2;
            }
        });
    }

    updateStats() {
        const alive = this.inhabitants.filter(i => i.alive).length;
        document.getElementById('population').textContent = alive;

        const buildingCount = this.buildings.filter(b => b.mesh.scale.y > 0.5).length;
        document.getElementById('buildings').textContent = buildingCount;

        const avgHealth = this.inhabitants.filter(i => i.alive).reduce((sum, i) => sum + i.health, 0) / alive;
        document.getElementById('stability').textContent = `${Math.round(avgHealth * 100)}%`;
    }

    // ========================================
    // UTILITY
    // ========================================

    switchPhase(phaseId) {
        document.querySelectorAll('.phase-container').forEach(phase => {
            phase.classList.remove('active');
        });
        document.getElementById(phaseId).classList.add('active');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new AcceleratedCivilization();
});
