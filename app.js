// ========================================
// THE CHRONO-CULTURAL INCUBATOR - 3D GOD MODE
// Main Application with Three.js
// ========================================

class CivilizationIncubator3D {
    constructor() {
        // Genesis Configuration Data
        this.config = {
            name: '',
            fear: '',
            aesthetic: '',
            ritual: ''
        };

        // Parsed configuration
        this.parsedConfig = {
            colors: { primary: 0x00d4ff, secondary: 0x00ff9d, accent: 0xffaa00 },
            climate: { sky: 0x1a1a2e, fog: 0x0f0f1e, lighting: 0.6 },
            lifeDifficulty: 50
        };

        // Three.js objects
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;

        // World objects
        this.island = null;
        this.inhabitants = [];
        this.buildings = [];
        this.vegetation = [];
        this.walls = [];
        this.weather = null;

        // Simulation state
        this.inhabitantCount = 30;
        this.simulationStartTime = null;
        this.animationId = null;
        this.ritualInterval = 60; // seconds
        this.lastRitualTime = 0;

        // Initialize
        this.init();
    }

    init() {
        // Phase 1: Genesis Configuration
        this.initGenesisPhase();

        // Phase 2: God Mode (initialized after genesis)
        // Phase 3: Final Report (initialized after freeze)
    }

    // ========================================
    // PHASE 1: GENESIS CONFIGURATION
    // ========================================

    initGenesisPhase() {
        // Input validation
        const inputs = {
            name: document.getElementById('civ-name'),
            fear: document.getElementById('civ-fear'),
            aesthetic: document.getElementById('civ-aesthetic'),
            ritual: document.getElementById('civ-ritual')
        };

        const beginBtn = document.getElementById('begin-creation-btn');
        const validationMsg = document.getElementById('validation-msg');

        // Real-time validation
        Object.values(inputs).forEach(input => {
            input.addEventListener('input', () => {
                const allFilled = Object.values(inputs).every(i => i.value.trim().length > 0);
                beginBtn.disabled = !allFilled;

                if (allFilled) {
                    validationMsg.textContent = 'Ready to begin creation';
                    validationMsg.classList.add('valid');
                    this.updatePreview();
                } else {
                    validationMsg.textContent = 'Complete all fields to begin';
                    validationMsg.classList.remove('valid');
                }
            });
        });

        // Begin creation button
        beginBtn.addEventListener('click', () => {
            this.config.name = inputs.name.value.trim();
            this.config.fear = inputs.fear.value.trim();
            this.config.aesthetic = inputs.aesthetic.value.trim();
            this.config.ritual = inputs.ritual.value.trim();

            this.parseConfiguration();
            this.startGodMode();
        });

        // Initialize preview canvas
        this.initPreviewCanvas();
    }

    initPreviewCanvas() {
        const canvas = document.getElementById('preview-canvas');
        const container = canvas.parentElement;

        this.previewScene = new THREE.Scene();
        this.previewCamera = new THREE.PerspectiveCamera(
            50,
            container.offsetWidth / container.offsetHeight,
            0.1,
            1000
        );
        this.previewCamera.position.set(0, 5, 10);
        this.previewCamera.lookAt(0, 0, 0);

        this.previewRenderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        this.previewRenderer.setSize(container.offsetWidth, container.offsetHeight);
        this.previewRenderer.setPixelRatio(window.devicePixelRatio);
        this.previewRenderer.setClearColor(0x000000);

        // Basic lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.previewScene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(5, 10, 5);
        this.previewScene.add(directionalLight);

        // Start preview animation
        this.animatePreview();
    }

    updatePreview() {
        // Clear existing preview objects
        while (this.previewScene.children.length > 2) {
            this.previewScene.remove(this.previewScene.children[2]);
        }

        // Simple growing structure based on input
        const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
        const material = new THREE.MeshPhongMaterial({
            color: 0x00d4ff,
            emissive: 0x00d4ff,
            emissiveIntensity: 0.3
        });
        const mesh = new THREE.Mesh(geometry, material);
        this.previewScene.add(mesh);
        this.previewMesh = mesh;
    }

    animatePreview() {
        if (this.previewMesh) {
            this.previewMesh.rotation.x += 0.005;
            this.previewMesh.rotation.y += 0.01;
        }

        this.previewRenderer.render(this.previewScene, this.previewCamera);
        requestAnimationFrame(() => this.animatePreview());
    }

    parseConfiguration() {
        // Extract colors from aesthetic
        const aesthetic = this.config.aesthetic.toLowerCase();

        // Color keywords mapping
        const colorMap = {
            red: 0xff3333, crimson: 0xdc143c, scarlet: 0xff2400,
            blue: 0x3366ff, azure: 0x007fff, cyan: 0x00ffff,
            green: 0x33ff33, emerald: 0x50c878, jade: 0x00a86b,
            gold: 0xffd700, golden: 0xffd700, amber: 0xffbf00,
            purple: 0x9966ff, violet: 0x8f00ff, lavender: 0xe6e6fa,
            white: 0xffffff, silver: 0xc0c0c0, grey: 0x808080,
            black: 0x1a1a1a, obsidian: 0x0f0f0f,
            orange: 0xff8800, coral: 0xff7f50,
            yellow: 0xffff00, bronze: 0xcd7f32
        };

        // Find colors in aesthetic description
        let primaryColor = 0x00d4ff;
        let secondaryColor = 0x00ff9d;

        for (const [keyword, color] of Object.entries(colorMap)) {
            if (aesthetic.includes(keyword)) {
                primaryColor = color;
                break;
            }
        }

        this.parsedConfig.colors.primary = primaryColor;
        this.parsedConfig.colors.secondary = secondaryColor;

        // Parse climate from fear
        const fear = this.config.fear.toLowerCase();

        if (fear.includes('dark') || fear.includes('night')) {
            this.parsedConfig.climate.sky = 0x0a0a1a;
            this.parsedConfig.climate.lighting = 0.3;
            this.parsedConfig.lifeDifficulty = 70;
        } else if (fear.includes('water') || fear.includes('drought') || fear.includes('dry')) {
            this.parsedConfig.climate.sky = 0x4a4a2a;
            this.parsedConfig.climate.lighting = 0.7;
            this.parsedConfig.lifeDifficulty = 65;
        } else if (fear.includes('cold') || fear.includes('freeze') || fear.includes('ice')) {
            this.parsedConfig.climate.sky = 0xaaccdd;
            this.parsedConfig.climate.lighting = 0.8;
            this.parsedConfig.lifeDifficulty = 75;
        } else if (fear.includes('fire') || fear.includes('heat') || fear.includes('burn')) {
            this.parsedConfig.climate.sky = 0x4a2a1a;
            this.parsedConfig.climate.lighting = 0.9;
            this.parsedConfig.lifeDifficulty = 70;
        } else {
            this.parsedConfig.climate.sky = 0x1a1a2e;
            this.parsedConfig.climate.lighting = 0.6;
            this.parsedConfig.lifeDifficulty = 50;
        }
    }

    // ========================================
    // PHASE 2: GOD MODE (3D WORLD)
    // ========================================

    startGodMode() {
        this.switchPhase('god-mode');

        // Set civilization title
        document.getElementById('civilization-title').textContent = this.config.name.toUpperCase();

        // Initialize Three.js
        this.initThreeJS();

        // Create world
        this.createIsland();
        this.createInhabitants();
        this.createBuildings();
        this.createVegetation();

        // Set initial slider values
        document.getElementById('life-difficulty').value = this.parsedConfig.lifeDifficulty;
        this.updateSliderDisplay('life-difficulty');

        // Initialize sliders
        this.initSliders();

        // Start simulation
        this.simulationStartTime = Date.now();
        this.animateWorld();
        this.startSimulationTimer();
        this.startRitualTimer();

        // Freeze button
        document.getElementById('freeze-btn').addEventListener('click', () => {
            this.freezeSimulation();
        });
    }

    initThreeJS() {
        const canvas = document.getElementById('world-canvas');
        const container = canvas.parentElement;

        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(this.parsedConfig.climate.sky);
        this.scene.fog = new THREE.Fog(this.parsedConfig.climate.fog, 50, 200);

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            60,
            container.offsetWidth / container.offsetHeight,
            0.1,
            1000
        );
        this.camera.position.set(30, 25, 30);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        this.renderer.setSize(container.offsetWidth, container.offsetHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;

        // Orbit controls
        this.controls = new THREE.OrbitControls(this.camera, canvas);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxPolarAngle = Math.PI / 2.2;
        this.controls.minDistance = 15;
        this.controls.maxDistance = 80;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, this.parsedConfig.climate.lighting);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, this.parsedConfig.climate.lighting);
        directionalLight.position.set(50, 50, 25);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 500;
        directionalLight.shadow.camera.left = -50;
        directionalLight.shadow.camera.right = 50;
        directionalLight.shadow.camera.top = 50;
        directionalLight.shadow.camera.bottom = -50;
        this.scene.add(directionalLight);

        // Handle window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = container.offsetWidth / container.offsetHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(container.offsetWidth, container.offsetHeight);
        });
    }

    createIsland() {
        // Island terrain
        const islandGeometry = new THREE.CylinderGeometry(25, 28, 3, 32);
        const islandMaterial = new THREE.MeshPhongMaterial({
            color: 0x4a7c59,
            flatShading: true
        });
        this.island = new THREE.Mesh(islandGeometry, islandMaterial);
        this.island.position.y = -1.5;
        this.island.receiveShadow = true;
        this.scene.add(this.island);

        // Beach ring
        const beachGeometry = new THREE.RingGeometry(25, 28, 32);
        const beachMaterial = new THREE.MeshBasicMaterial({
            color: 0xe5c9a0,
            side: THREE.DoubleSide
        });
        const beach = new THREE.Mesh(beachGeometry, beachMaterial);
        beach.rotation.x = -Math.PI / 2;
        beach.position.y = 0.1;
        this.scene.add(beach);

        // Ocean
        const oceanGeometry = new THREE.CircleGeometry(100, 64);
        const oceanMaterial = new THREE.MeshPhongMaterial({
            color: 0x1a4d6d,
            shininess: 100
        });
        const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);
        ocean.rotation.x = -Math.PI / 2;
        ocean.position.y = -2;
        this.scene.add(ocean);
    }

    createInhabitants() {
        const color = this.parsedConfig.colors.primary;

        for (let i = 0; i < this.inhabitantCount; i++) {
            const angle = (i / this.inhabitantCount) * Math.PI * 2;
            const radius = 5 + Math.random() * 15;

            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;

            // Body
            const bodyGeometry = new THREE.CapsuleGeometry(0.3, 1, 4, 8);
            const bodyMaterial = new THREE.MeshPhongMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: 0.2
            });
            const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
            body.castShadow = true;

            // Head
            const headGeometry = new THREE.SphereGeometry(0.25, 8, 8);
            const head = new THREE.Mesh(headGeometry, bodyMaterial);
            head.position.y = 0.75;
            body.add(head);

            // Position
            body.position.set(x, 0.7, z);

            // Store inhabitant data
            const inhabitant = {
                mesh: body,
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.1,
                    0,
                    (Math.random() - 0.5) * 0.1
                ),
                health: 1.0,
                stress: 0,
                group: Math.floor(Math.random() * 5),
                performingRitual: false,
                ritualTimer: 0,
                targetPosition: null,
                behavior: 'wander' // wander, gather, flee, shelter
            };

            this.inhabitants.push(inhabitant);
            this.scene.add(body);
        }
    }

    createBuildings() {
        const color = this.parsedConfig.colors.primary;
        const buildingCount = 8;

        for (let i = 0; i < buildingCount; i++) {
            const angle = (i / buildingCount) * Math.PI * 2;
            const radius = 12 + Math.random() * 5;

            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;

            const height = 1.5 + Math.random() * 2;
            const width = 1 + Math.random() * 0.5;

            const geometry = new THREE.BoxGeometry(width, height, width);
            const material = new THREE.MeshPhongMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: 0.1
            });
            const building = new THREE.Mesh(geometry, material);
            building.position.set(x, height / 2, z);
            building.castShadow = true;
            building.receiveShadow = true;

            this.buildings.push({
                mesh: building,
                originalColor: color,
                currentColor: color
            });

            this.scene.add(building);
        }
    }

    createVegetation() {
        const vegCount = 40;

        for (let i = 0; i < vegCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 23;

            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;

            const trunkGeometry = new THREE.CylinderGeometry(0.1, 0.15, 0.8, 6);
            const trunkMaterial = new THREE.MeshPhongMaterial({ color: 0x6b4423 });
            const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);

            const leavesGeometry = new THREE.ConeGeometry(0.5, 1, 6);
            const leavesMaterial = new THREE.MeshPhongMaterial({ color: 0x2d5016 });
            const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
            leaves.position.y = 1;
            trunk.add(leaves);

            trunk.position.set(x, 0.4, z);
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
    // SLIDERS AND REAL-TIME EFFECTS
    // ========================================

    initSliders() {
        const sliderIds = [
            'life-difficulty',
            'rumor-spread',
            'societal-tolerance',
            'innovation-pace',
            'climate-threat',
            'border-openness'
        ];

        sliderIds.forEach(id => {
            const slider = document.getElementById(id);
            slider.addEventListener('input', () => {
                this.updateSliderDisplay(id);
                this.applySliderEffects();
            });
        });
    }

    updateSliderDisplay(sliderId) {
        const slider = document.getElementById(sliderId);
        const display = document.getElementById(`${sliderId}-val`);
        display.textContent = `${slider.value}%`;
    }

    applySliderEffects() {
        const values = this.getSliderValues();

        // Life Difficulty
        this.applyLifeDifficulty(values.lifeDifficulty);

        // Rumor Spread
        this.applyRumorSpread(values.rumorSpread);

        // Societal Tolerance
        this.applySocietalTolerance(values.societalTolerance);

        // Innovation Pace
        this.applyInnovationPace(values.innovationPace);

        // Climate Threat
        this.applyClimateThreat(values.climateThreat);

        // Border Openness
        this.applyBorderOpenness(values.borderOpenness);
    }

    getSliderValues() {
        return {
            lifeDifficulty: parseInt(document.getElementById('life-difficulty').value),
            rumorSpread: parseInt(document.getElementById('rumor-spread').value),
            societalTolerance: parseInt(document.getElementById('societal-tolerance').value),
            innovationPace: parseInt(document.getElementById('innovation-pace').value),
            climateThreat: parseInt(document.getElementById('climate-threat').value),
            borderOpenness: parseInt(document.getElementById('border-openness').value)
        };
    }

    applyLifeDifficulty(value) {
        // Vegetation withering
        const healthFactor = 1 - (value / 100) * 0.7;
        this.vegetation.forEach(veg => {
            veg.health = healthFactor;
            veg.mesh.scale.y = veg.originalScale * healthFactor;
            const colorValue = Math.floor(45 * healthFactor + 16);
            veg.mesh.children[0].material.color.setHex(
                (colorValue << 16) | (80 * healthFactor << 8) | 22
            );
        });

        // Inhabitant stress
        this.inhabitants.forEach(inhabitant => {
            inhabitant.stress = value / 100;
            inhabitant.health = Math.max(0.1, 1 - value / 150);
        });

        // Check ritual degradation
        if (value > 75) {
            document.getElementById('ritual-health').textContent = 'DEGRADED';
            document.getElementById('ritual-health').className = 'degraded';
        } else if (value > 90) {
            document.getElementById('ritual-health').textContent = 'FAILED';
            document.getElementById('ritual-health').className = 'failed';
        } else {
            document.getElementById('ritual-health').textContent = 'ACTIVE';
            document.getElementById('ritual-health').className = '';
        }
    }

    applyRumorSpread(value) {
        // High rumor = clustering behavior
        const clusterFactor = value / 100;
        this.inhabitants.forEach(inhabitant => {
            if (clusterFactor > 0.6 && Math.random() < 0.1) {
                inhabitant.behavior = 'gather';
            }
        });
    }

    applySocietalTolerance(value) {
        // Stored for collision handling
        this.societalTolerance = value / 100;
    }

    applyInnovationPace(value) {
        // Color and style changes
        if (Math.random() < value / 1000) {
            this.buildings.forEach(building => {
                const hue = Math.random();
                building.mesh.material.color.setHSL(hue, 0.7, 0.5);
            });
        }
    }

    applyClimateThreat(value) {
        // Environmental effects
        const threatLevel = value / 100;

        // Sky darkening
        const baseSky = this.parsedConfig.climate.sky;
        const darkFactor = 1 - threatLevel * 0.6;
        const r = ((baseSky >> 16) & 0xff) * darkFactor;
        const g = ((baseSky >> 8) & 0xff) * darkFactor;
        const b = (baseSky & 0xff) * darkFactor;
        this.scene.background.setRGB(r / 255, g / 255, b / 255);

        // Panic behavior
        if (threatLevel > 0.7) {
            this.inhabitants.forEach(inhabitant => {
                if (Math.random() < 0.3) {
                    inhabitant.behavior = 'shelter';
                }
            });
        }

        // Camera shake (subtle)
        if (threatLevel > 0.8) {
            this.camera.position.x += (Math.random() - 0.5) * 0.1;
            this.camera.position.y += (Math.random() - 0.5) * 0.1;
        }
    }

    applyBorderOpenness(value) {
        const openness = value / 100;

        // Remove existing walls
        this.walls.forEach(wall => this.scene.remove(wall.mesh));
        this.walls = [];

        // Create walls if closed
        if (openness < 0.5) {
            const wallCount = 5;
            const wallHeight = 2 * (1 - openness);
            const wallOpacity = 1 - openness;

            for (let i = 0; i < wallCount; i++) {
                const angle = (i / wallCount) * Math.PI * 2;
                const radius = 18;

                const wallGeometry = new THREE.BoxGeometry(8, wallHeight, 0.3);
                const wallMaterial = new THREE.MeshPhongMaterial({
                    color: this.parsedConfig.colors.primary,
                    transparent: true,
                    opacity: wallOpacity,
                    emissive: this.parsedConfig.colors.primary,
                    emissiveIntensity: 0.3
                });
                const wall = new THREE.Mesh(wallGeometry, wallMaterial);
                wall.position.set(
                    Math.cos(angle) * radius,
                    wallHeight / 2,
                    Math.sin(angle) * radius
                );
                wall.rotation.y = angle;

                this.walls.push({ mesh: wall });
                this.scene.add(wall);
            }
        }
    }

    // ========================================
    // ANIMATION AND SIMULATION
    // ========================================

    animateWorld() {
        this.controls.update();

        // Update inhabitants
        this.updateInhabitants();

        // Update stats
        this.updateStats();

        // Render
        this.renderer.render(this.scene, this.camera);

        this.animationId = requestAnimationFrame(() => this.animateWorld());
    }

    updateInhabitants() {
        const values = this.getSliderValues();

        this.inhabitants.forEach((inhabitant, i) => {
            if (inhabitant.performingRitual) {
                // Ritual animation
                inhabitant.ritualTimer -= 0.016;
                const scale = 1 + Math.sin(inhabitant.ritualTimer * 10) * 0.1;
                inhabitant.mesh.scale.y = scale;

                if (inhabitant.ritualTimer <= 0) {
                    inhabitant.performingRitual = false;
                    inhabitant.mesh.scale.y = 1;
                }
                return;
            }

            // Behavior-based movement
            switch (inhabitant.behavior) {
                case 'gather':
                    // Move towards center
                    const toCenter = new THREE.Vector3(0, 0, 0)
                        .sub(inhabitant.mesh.position)
                        .normalize()
                        .multiplyScalar(0.05);
                    inhabitant.velocity.lerp(toCenter, 0.1);
                    break;

                case 'flee':
                    // Move outward
                    const fromCenter = inhabitant.mesh.position.clone()
                        .normalize()
                        .multiplyScalar(0.08);
                    inhabitant.velocity.lerp(fromCenter, 0.1);
                    break;

                case 'shelter':
                    // Move to nearest building
                    if (!inhabitant.targetPosition && this.buildings.length > 0) {
                        const nearest = this.buildings.reduce((prev, curr) => {
                            const d1 = prev.mesh.position.distanceTo(inhabitant.mesh.position);
                            const d2 = curr.mesh.position.distanceTo(inhabitant.mesh.position);
                            return d1 < d2 ? prev : curr;
                        });
                        inhabitant.targetPosition = nearest.mesh.position.clone();
                    }
                    if (inhabitant.targetPosition) {
                        const toTarget = inhabitant.targetPosition.clone()
                            .sub(inhabitant.mesh.position)
                            .normalize()
                            .multiplyScalar(0.06);
                        inhabitant.velocity.lerp(toTarget, 0.2);
                    }
                    break;

                default: // wander
                    if (Math.random() < 0.01) {
                        inhabitant.velocity.x += (Math.random() - 0.5) * 0.05;
                        inhabitant.velocity.z += (Math.random() - 0.5) * 0.05;
                    }
                    inhabitant.velocity.multiplyScalar(0.98);
            }

            // Apply stress to movement
            const stressFactor = 1 + inhabitant.stress;
            inhabitant.velocity.multiplyScalar(stressFactor);

            // Move
            inhabitant.mesh.position.add(inhabitant.velocity);

            // Keep on island
            const distFromCenter = Math.sqrt(
                inhabitant.mesh.position.x ** 2 +
                inhabitant.mesh.position.z ** 2
            );
            if (distFromCenter > 23) {
                const angle = Math.atan2(
                    inhabitant.mesh.position.z,
                    inhabitant.mesh.position.x
                );
                inhabitant.mesh.position.x = Math.cos(angle) * 23;
                inhabitant.mesh.position.z = Math.sin(angle) * 23;
                inhabitant.velocity.multiplyScalar(-0.5);
            }

            // Face movement direction
            if (inhabitant.velocity.length() > 0.01) {
                const angle = Math.atan2(inhabitant.velocity.x, inhabitant.velocity.z);
                inhabitant.mesh.rotation.y = angle;
            }

            // Check collisions and interactions
            for (let j = i + 1; j < this.inhabitants.length; j++) {
                const other = this.inhabitants[j];
                const dist = inhabitant.mesh.position.distanceTo(other.mesh.position);

                if (dist < 1.5) {
                    // Interaction based on tolerance
                    if (Math.random() > this.societalTolerance) {
                        // Destructive
                        inhabitant.health *= 0.99;
                        other.health *= 0.99;
                        inhabitant.velocity.multiplyScalar(-1);
                        other.velocity.multiplyScalar(-1);
                    } else {
                        // Cooperative
                        inhabitant.health = Math.min(1, inhabitant.health + 0.001);
                        other.health = Math.min(1, other.health + 0.001);
                    }
                }
            }

            // Health-based opacity
            inhabitant.mesh.material.opacity = inhabitant.health;
        });

        // Random behavior reset
        if (Math.random() < 0.002) {
            this.inhabitants.forEach(inhabitant => {
                inhabitant.behavior = 'wander';
                inhabitant.targetPosition = null;
            });
        }
    }

    startRitualTimer() {
        setInterval(() => {
            const values = this.getSliderValues();

            // Don't perform ritual if life is too difficult
            if (values.lifeDifficulty > 90) return;

            this.inhabitants.forEach(inhabitant => {
                inhabitant.performingRitual = true;
                inhabitant.ritualTimer = 2; // 2 seconds
            });
        }, this.ritualInterval * 1000);
    }

    updateStats() {
        const living = this.inhabitants.filter(i => i.health > 0.3).length;
        const survivalRate = (living / this.inhabitantCount * 100).toFixed(1);
        const avgHealth = this.inhabitants.reduce((sum, i) => sum + i.health, 0) / this.inhabitants.length;
        const stability = (avgHealth * 100).toFixed(0);

        document.getElementById('population').textContent = living;
        document.getElementById('survival-rate').textContent = `${survivalRate}%`;
        document.getElementById('stability').textContent = `${stability}%`;
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
    // PHASE 3: FINAL REPORT
    // ========================================

    freezeSimulation() {
        cancelAnimationFrame(this.animationId);
        this.showFinalReport();
    }

    showFinalReport() {
        this.switchPhase('final-report');

        // Display initial configuration
        const configDiv = document.getElementById('initial-config');
        configDiv.innerHTML = `
            <p><strong>Civilization Name:</strong> ${this.config.name}</p>
            <p><strong>Greatest Fear:</strong> ${this.config.fear}</p>
            <p><strong>Core Aesthetic:</strong> ${this.config.aesthetic}</p>
            <p><strong>Sacred Ritual:</strong> ${this.config.ritual}</p>
        `;

        // Display final slider settings
        const values = this.getSliderValues();
        const slidersDiv = document.getElementById('final-sliders');
        slidersDiv.innerHTML = `
            <p><strong>Life Difficulty:</strong> ${values.lifeDifficulty}%</p>
            <p><strong>Rumor Spread:</strong> ${values.rumorSpread}%</p>
            <p><strong>Societal Tolerance:</strong> ${values.societalTolerance}%</p>
            <p><strong>Innovation Pace:</strong> ${values.innovationPace}%</p>
            <p><strong>Climate Threat:</strong> ${values.climateThreat}%</p>
            <p><strong>Border Openness:</strong> ${values.borderOpenness}%</p>
        `;

        // Generate outcome analysis
        this.generateOutcomeAnalysis(values);

        // Draw final snapshot
        this.drawFinalSnapshot();

        // Restart button
        document.getElementById('restart-btn').addEventListener('click', () => {
            location.reload();
        });
    }

    generateOutcomeAnalysis(values) {
        const living = this.inhabitants.filter(i => i.health > 0.3).length;
        const survivalRate = (living / this.inhabitantCount * 100);
        const avgHealth = this.inhabitants.reduce((sum, i) => sum + i.health, 0) / this.inhabitants.length;

        const analysisDiv = document.getElementById('outcome-analysis');

        let verdict = '';
        if (survivalRate > 80 && avgHealth > 0.7) {
            verdict = `<p><strong>Outcome: THRIVING CIVILIZATION</strong></p>
                <p>Your divine decree created favorable conditions. The ${this.config.name} have flourished under your guidance,
                with ${survivalRate.toFixed(1)}% survival rate and strong social cohesion.</p>`;
        } else if (survivalRate > 50) {
            verdict = `<p><strong>Outcome: STRUGGLING SURVIVAL</strong></p>
                <p>The ${this.config.name} persist, but face significant challenges. Your interventions created
                a precarious balance between growth and decline (${survivalRate.toFixed(1)}% survival).</p>`;
        } else {
            verdict = `<p><strong>Outcome: CIVILIZATION COLLAPSE</strong></p>
                <p>Your interventions proved too harsh for the ${this.config.name}. With only ${survivalRate.toFixed(1)}%
                surviving, the culture teeters on the brink of extinction.</p>`;
        }

        const extremeFactors = [];
        if (values.lifeDifficulty > 75) extremeFactors.push('extreme hardship');
        if (values.climateThreat > 75) extremeFactors.push('environmental disasters');
        if (values.societalTolerance < 25) extremeFactors.push('internal conflict');
        if (values.borderOpenness < 25) extremeFactors.push('isolation');

        let factorsText = '';
        if (extremeFactors.length > 0) {
            factorsText = `<p><strong>Critical Factors:</strong> Your civilization faced ${extremeFactors.join(', ')}.</p>`;
        }

        analysisDiv.innerHTML = verdict + factorsText + `
            <p><strong>Cultural Legacy:</strong> ${this.config.ritual}</p>
            <p>This sacred ritual ${values.lifeDifficulty > 90 ? 'was abandoned due to extreme hardship' : 'remains the cornerstone of their identity'}.</p>
        `;
    }

    drawFinalSnapshot() {
        const canvas = document.getElementById('final-snapshot');
        const ctx = canvas.getContext('2d');

        // Render current 3D scene to snapshot
        this.renderer.render(this.scene, this.camera);

        // Copy WebGL canvas to 2D canvas
        ctx.drawImage(this.renderer.domElement, 0, 0, canvas.width, canvas.height);
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
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    new CivilizationIncubator3D();
});
