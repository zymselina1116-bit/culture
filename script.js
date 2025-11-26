// ==========================================
// THE CIVILIZATION ACCELERATOR
// Main Simulation Script
// ==========================================

class CivilizationAccelerator {
    constructor() {
        this.selectedMap = null;
        this.previewScene = null;
        this.mainScene = null;
        this.isSimulationRunning = false;

        // Time system
        this.year = 0;
        this.month = 1;
        this.day = 1;
        this.timeScale = 0; // 0=pause, 1=1x, 2=10x, 3=100x
        this.timeAccumulator = 0;

        // Simulation parameters
        this.params = {
            lifeDifficulty: 50,
            rumorIntensity: 50,
            toleranceLevel: 50,
            innovationPace: 50,
            climateThreat: 50,
            borderOpenness: 50
        };

        // 3D entities
        this.npcs = [];
        this.buildings = [];
        this.terrain = null;
        this.waterPlane = null;
        this.walls = [];
        this.enemies = [];
        this.rivers = [];

        // Map definitions
        this.maps = {
            river: {
                name: 'River Basin',
                terrainType: 'flat',
                description: `Wide flat plains with a central river running through fertile lands.
                              Ideal for agriculture and early settlement. Prone to seasonal flooding.`,
                characteristics: 'Flat terrain, central river, high fertility',
                climate: 'Moderate, flood cycles',
                difficulty: 'Easy',
                colors: {
                    primary: 0x8b4513,    // Buildings - brown wood
                    secondary: 0xd4a574,  // NPCs - tan
                    terrain: 0x6b8e23,    // Fertile green
                    water: 0x4682b4,      // River blue
                    vegetation: 0x228b22  // Forest green
                },
                terrainConfig: {
                    heightScale: 2,       // Low mountains
                    riverEnabled: true,
                    oceanSide: null,      // No ocean
                    vegetationDensity: 0.8,
                    flatness: 0.7
                },
                startParams: {
                    lifeDifficulty: 30,
                    climateThreat: 60,
                    borderOpenness: 50
                }
            },
            mountain: {
                name: 'Mountain Valley',
                terrainType: 'mountainous',
                description: `Steep mountains surrounding a narrow valley. Defensible but isolated.
                              Difficult terrain limits movement and expansion.`,
                characteristics: 'High peaks, narrow valleys, steep slopes',
                climate: 'Cold, harsh winters',
                difficulty: 'Hard',
                colors: {
                    primary: 0x708090,    // Stone gray
                    secondary: 0xa9a9a9,  // Light gray
                    terrain: 0x8b7355,    // Mountain brown
                    water: 0x87ceeb,      // Sky blue
                    vegetation: 0x556b2f  // Dark olive
                },
                terrainConfig: {
                    heightScale: 8,       // High mountains
                    riverEnabled: false,
                    oceanSide: null,
                    vegetationDensity: 0.3,
                    flatness: 0.1
                },
                startParams: {
                    lifeDifficulty: 70,
                    climateThreat: 75,
                    borderOpenness: 20
                }
            },
            coastal: {
                name: 'Coastal Peninsula',
                terrainType: 'coastal',
                description: `A curved landmass surrounded by ocean on one side. Access to maritime trade
                              and resources, but vulnerable to storms and invasions from the sea.`,
                characteristics: 'Beaches, ocean access, maritime climate',
                climate: 'Mild, stormy seasons',
                difficulty: 'Medium',
                colors: {
                    primary: 0xf5deb3,    // Wheat buildings
                    secondary: 0x4169e1,  // Ocean blue NPCs
                    terrain: 0xc2b280,    // Sandy soil
                    water: 0x006994,      // Deep ocean
                    vegetation: 0x90ee90  // Light green
                },
                terrainConfig: {
                    heightScale: 3,
                    riverEnabled: false,
                    oceanSide: 'east',    // Ocean on east side
                    vegetationDensity: 0.6,
                    flatness: 0.5
                },
                startParams: {
                    lifeDifficulty: 45,
                    climateThreat: 55,
                    borderOpenness: 70
                }
            }
        };

        this.init();
    }

    init() {
        this.initSelectionScreen();
        this.initPreviewCanvas();
    }

    // ==========================================
    // PHASE 1: SELECTION SCREEN
    // ==========================================

    initSelectionScreen() {
        const buttons = document.querySelectorAll('.civ-btn');
        const startBtn = document.getElementById('start-btn');

        buttons.forEach(btn => {
            // Hover behavior
            btn.addEventListener('mouseenter', () => {
                const mapKey = btn.dataset.map;
                this.updateDescription(mapKey);
                this.updatePreview(mapKey);
            });

            // Click behavior
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.selectedMap = btn.dataset.map;
                startBtn.disabled = false;
            });
        });

        startBtn.addEventListener('click', () => {
            this.startSimulation();
        });
    }

    updateDescription(mapKey) {
        const map = this.maps[mapKey];
        const title = document.getElementById('desc-title');
        const content = document.getElementById('desc-content');
        const dnaDisplay = document.getElementById('desc-dna');

        title.textContent = map.name;
        content.innerHTML = `
            <p class="desc-text">${map.description}</p>
            <p class="desc-text"><strong>Characteristics:</strong> ${map.characteristics}</p>
            <p class="desc-text"><strong>Climate:</strong> ${map.climate}</p>
            <p class="desc-text"><strong>Difficulty:</strong> ${map.difficulty}</p>
        `;

        dnaDisplay.innerHTML = `
            <div class="dna-item"><span class="dna-label">Terrain Type:</span><span class="dna-value">${map.terrainType}</span></div>
            <div class="dna-item"><span class="dna-label">Height Scale:</span><span class="dna-value">${map.terrainConfig.heightScale}</span></div>
            <div class="dna-item"><span class="dna-label">Vegetation:</span><span class="dna-value">${Math.floor(map.terrainConfig.vegetationDensity * 100)}%</span></div>
            <div class="dna-item"><span class="dna-label">River:</span><span class="dna-value">${map.terrainConfig.riverEnabled ? 'Yes' : 'No'}</span></div>
            <div class="dna-item"><span class="dna-label">Starting Difficulty:</span><span class="dna-value">${map.startParams.lifeDifficulty}</span></div>
            <div class="dna-item"><span class="dna-label">Climate Threat:</span><span class="dna-value">${map.startParams.climateThreat}</span></div>
        `;
    }

    initPreviewCanvas() {
        const canvas = document.getElementById('preview-canvas');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });

        renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
        camera.position.set(15, 10, 15);
        camera.lookAt(0, 0, 0);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(10, 20, 10);
        scene.add(dirLight);

        this.previewScene = { scene, camera, renderer };

        // Initial placeholder
        this.createPreviewPlaceholder();

        // Animate
        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();
    }

    createPreviewPlaceholder() {
        const { scene } = this.previewScene;

        // Clear existing
        while(scene.children.length > 2) { // Keep lights
            scene.remove(scene.children[2]);
        }

        // Simple placeholder
        const geo = new THREE.SphereGeometry(2, 32, 32);
        const mat = new THREE.MeshStandardMaterial({ color: 0x00ffff, wireframe: true });
        const sphere = new THREE.Mesh(geo, mat);
        scene.add(sphere);
    }

    updatePreview(mapKey) {
        const map = this.maps[mapKey];
        const { scene } = this.previewScene;

        // Clear existing preview
        while(scene.children.length > 2) {
            scene.remove(scene.children[2]);
        }

        // Create terrain based on map type
        const size = 16;
        const resolution = 32;
        const geometry = new THREE.PlaneGeometry(size, size, resolution, resolution);

        // Apply heightmap based on map type
        const vertices = geometry.attributes.position;
        for (let i = 0; i < vertices.count; i++) {
            const x = vertices.getX(i);
            const z = vertices.getY(i);
            let height = 0;

            if (mapKey === 'river') {
                // Flat with central river depression
                height = this.noise(x * 0.1, z * 0.1) * 0.5;
                if (Math.abs(x) < 1) height -= 0.5; // River channel
            } else if (mapKey === 'mountain') {
                // High peaks
                height = this.noise(x * 0.15, z * 0.15) * 4 +
                        this.noise(x * 0.3, z * 0.3) * 2;
            } else if (mapKey === 'coastal') {
                // Gradual slope to one side
                height = this.noise(x * 0.1, z * 0.1) * 1.5 + (x * 0.15);
            }

            vertices.setZ(i, height);
        }
        geometry.computeVertexNormals();

        const terrainMat = new THREE.MeshStandardMaterial({
            color: map.colors.terrain,
            flatShading: true
        });
        const terrain = new THREE.Mesh(geometry, terrainMat);
        terrain.rotation.x = -Math.PI / 2;
        scene.add(terrain);

        // Add water based on map type
        if (mapKey === 'river') {
            // River strip
            const riverGeo = new THREE.BoxGeometry(2, 0.1, 16);
            const riverMat = new THREE.MeshStandardMaterial({ color: map.colors.water, transparent: true, opacity: 0.7 });
            const river = new THREE.Mesh(riverGeo, riverMat);
            river.position.y = -0.3;
            scene.add(river);
        } else if (mapKey === 'coastal') {
            // Ocean plane on one side
            const oceanGeo = new THREE.PlaneGeometry(8, 16);
            const oceanMat = new THREE.MeshStandardMaterial({ color: map.colors.water, transparent: true, opacity: 0.6 });
            const ocean = new THREE.Mesh(oceanGeo, oceanMat);
            ocean.rotation.x = -Math.PI / 2;
            ocean.position.x = 8;
            ocean.position.y = -0.2;
            scene.add(ocean);
        }

        // Add sample buildings
        for (let i = 0; i < 3; i++) {
            const height = 1.5 + Math.random() * 2;
            const buildingGeo = new THREE.BoxGeometry(1, height, 1);
            const buildingMat = new THREE.MeshStandardMaterial({ color: map.colors.primary });
            const building = new THREE.Mesh(buildingGeo, buildingMat);

            building.position.x = (Math.random() - 0.5) * 6;
            building.position.z = (Math.random() - 0.5) * 6;
            building.position.y = height / 2 + 0.5;

            scene.add(building);
        }
    }

    // ==========================================
    // PHASE 2: MAIN SIMULATION
    // ==========================================

    startSimulation() {
        // Hide selection, show simulation
        document.getElementById('selection-screen').classList.remove('active');
        document.getElementById('simulation-screen').classList.add('active');

        const map = this.maps[this.selectedMap];
        document.getElementById('civ-title').textContent = `MAP: ${map.name.toUpperCase()}`;

        // Load map settings into sliders
        this.loadMapSettings();

        // Initialize main 3D scene
        this.initMainCanvas();

        // Run 10-second preview at 100x
        this.runInitialPreview();
    }

    loadMapSettings() {
        const map = this.maps[this.selectedMap];

        // Set sliders with map's starting parameters
        document.getElementById('slider-life').value = map.startParams.lifeDifficulty;
        document.getElementById('slider-rumor').value = 50;  // Default
        document.getElementById('slider-tolerance').value = 50;  // Default
        document.getElementById('slider-innovation').value = 50;  // Default
        document.getElementById('slider-climate').value = map.startParams.climateThreat;
        document.getElementById('slider-border').value = map.startParams.borderOpenness;

        // Update params
        this.params.lifeDifficulty = map.startParams.lifeDifficulty;
        this.params.rumorIntensity = 50;
        this.params.toleranceLevel = 50;
        this.params.innovationPace = 50;
        this.params.climateThreat = map.startParams.climateThreat;
        this.params.borderOpenness = map.startParams.borderOpenness;

        // Update displays
        this.updateSliderDisplays();

        // Attach listeners
        this.attachSliderListeners();
    }

    updateSliderDisplays() {
        document.getElementById('val-life').textContent = this.params.lifeDifficulty;
        document.getElementById('val-rumor').textContent = this.params.rumorIntensity;
        document.getElementById('val-tolerance').textContent = this.params.toleranceLevel;
        document.getElementById('val-innovation').textContent = this.params.innovationPace;
        document.getElementById('val-climate').textContent = this.params.climateThreat;
        document.getElementById('val-border').textContent = this.params.borderOpenness;
    }

    attachSliderListeners() {
        const sliders = [
            { id: 'slider-life', param: 'lifeDifficulty', display: 'val-life' },
            { id: 'slider-rumor', param: 'rumorIntensity', display: 'val-rumor' },
            { id: 'slider-tolerance', param: 'toleranceLevel', display: 'val-tolerance' },
            { id: 'slider-innovation', param: 'innovationPace', display: 'val-innovation' },
            { id: 'slider-climate', param: 'climateThreat', display: 'val-climate' },
            { id: 'slider-border', param: 'borderOpenness', display: 'val-border' }
        ];

        sliders.forEach(slider => {
            const element = document.getElementById(slider.id);
            element.addEventListener('input', () => {
                this.params[slider.param] = parseInt(element.value);
                document.getElementById(slider.display).textContent = element.value;
            });
        });

        // Time control
        document.getElementById('time-slider').addEventListener('input', (e) => {
            this.timeScale = parseInt(e.target.value);
            const speeds = ['PAUSED', '1× SPEED', '10× SPEED', '100× ACCELERATED'];
            document.getElementById('current-speed').textContent = speeds[this.timeScale];
        });

        // Crisis buttons
        document.getElementById('btn-deluge').addEventListener('click', () => this.triggerDeluge());
        document.getElementById('btn-plague').addEventListener('click', () => this.triggerPlague());
        document.getElementById('btn-war').addEventListener('click', () => this.triggerWar());
    }

    initMainCanvas() {
        // Show loading overlay initially
        const loadingOverlay = document.getElementById('loading-overlay');
        loadingOverlay.classList.remove('hidden');

        // Create new canvas and append to container
        const container = document.getElementById('sim-container');
        const canvas = document.createElement('canvas');
        canvas.id = 'main-canvas';
        container.appendChild(canvas);

        // Create NEW Three.js scene for main simulation
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000428);
        scene.fog = new THREE.Fog(0x000428, 50, 200);

        // Camera positioned at 3/4 angled top-down view
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(30, 25, 30);
        camera.lookAt(0, 0, 0);

        // Create renderer
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // OrbitControls with limited angle (cannot go below ground)
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.maxPolarAngle = Math.PI / 2.2; // Prevent going below horizon
        controls.minDistance = 10;
        controls.maxDistance = 100;
        controls.target.set(0, 0, 0);

        // Lighting - ambient + directional
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(50, 50, 30);
        dirLight.castShadow = true;
        dirLight.shadow.camera.left = -50;
        dirLight.shadow.camera.right = 50;
        dirLight.shadow.camera.top = 50;
        dirLight.shadow.camera.bottom = -50;
        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        scene.add(dirLight);

        this.mainScene = { scene, camera, renderer, controls };

        // Create world immediately
        this.createTerrain();
        this.createWater();
        this.createBuildings();
        this.createNPCs();

        // Start animation loop
        this.isSimulationRunning = true;
        this.animate();

        // Hide loading after 2 seconds
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
        }, 2000);

        // Handle resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    createTerrain() {
        const map = this.maps[this.selectedMap];
        const config = map.terrainConfig;
        const { scene } = this.mainScene;

        // Procedural terrain with noise based on map type
        const size = 50;
        const resolution = 64;
        const geometry = new THREE.PlaneGeometry(size, size, resolution, resolution);

        // Apply noise to vertices based on map configuration
        const vertices = geometry.attributes.position;
        for (let i = 0; i < vertices.count; i++) {
            const x = vertices.getX(i);
            const z = vertices.getY(i);
            let height = 0;

            if (this.selectedMap === 'river') {
                // Flat plains with river channel
                height = this.noise(x * 0.1, z * 0.1) * config.heightScale * 0.5 +
                        this.noise(x * 0.05, z * 0.05) * config.heightScale * 0.3;

                // River channel depression
                if (Math.abs(x) < 3) {
                    height -= config.heightScale * 0.5;
                }
            } else if (this.selectedMap === 'mountain') {
                // High mountains with valleys
                height = this.noise(x * 0.15, z * 0.15) * config.heightScale +
                        this.noise(x * 0.3, z * 0.3) * config.heightScale * 0.5 +
                        this.noise(x * 0.05, z * 0.05) * config.heightScale * 0.3;
            } else if (this.selectedMap === 'coastal') {
                // Gradual slope with peninsula shape
                height = this.noise(x * 0.1, z * 0.1) * config.heightScale +
                        (x * 0.1) + // Slope toward east
                        this.noise(x * 0.05, z * 0.05) * config.heightScale * 0.5;
            }

            vertices.setZ(i, height);
        }

        geometry.computeVertexNormals();

        const material = new THREE.MeshStandardMaterial({
            color: map.colors.terrain,
            flatShading: true
        });

        const terrain = new THREE.Mesh(geometry, material);
        terrain.rotation.x = -Math.PI / 2;
        terrain.receiveShadow = true;
        scene.add(terrain);

        this.terrain = terrain;

        // Add river if enabled
        if (config.riverEnabled) {
            this.createRiver();
        }

        // Add vegetation based on density
        this.createVegetation(config.vegetationDensity);
    }

    createRiver() {
        const map = this.maps[this.selectedMap];
        const { scene } = this.mainScene;

        // Create river along center
        const riverGeo = new THREE.BoxGeometry(6, 0.2, 50);
        const riverMat = new THREE.MeshStandardMaterial({
            color: map.colors.water,
            transparent: true,
            opacity: 0.8
        });
        const river = new THREE.Mesh(riverGeo, riverMat);
        river.position.y = -0.3;
        scene.add(river);
        this.rivers.push(river);
    }

    createVegetation(density) {
        const map = this.maps[this.selectedMap];
        const { scene } = this.mainScene;
        const count = Math.floor(40 * density);

        for (let i = 0; i < count; i++) {
            const trunkGeo = new THREE.CylinderGeometry(0.1, 0.15, 1.5, 8);
            const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
            const trunk = new THREE.Mesh(trunkGeo, trunkMat);

            const leavesGeo = new THREE.ConeGeometry(0.8, 2, 8);
            const leavesMat = new THREE.MeshStandardMaterial({ color: map.colors.vegetation });
            const leaves = new THREE.Mesh(leavesGeo, leavesMat);
            leaves.position.y = 1.75;

            const tree = new THREE.Group();
            tree.add(trunk);
            tree.add(leaves);

            tree.position.x = (Math.random() - 0.5) * 40;
            tree.position.z = (Math.random() - 0.5) * 40;
            tree.position.y = 0.75;

            tree.castShadow = true;
            scene.add(tree);
        }
    }

    // Simple noise function (pseudo-random)
    noise(x, y) {
        const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
        return (n - Math.floor(n)) * 2 - 1;
    }

    createWater() {
        const map = this.maps[this.selectedMap];
        const { scene } = this.mainScene;

        // Different water placement based on map
        if (this.selectedMap === 'coastal') {
            // Ocean on east side
            const waterGeo = new THREE.PlaneGeometry(30, 60);
            const waterMat = new THREE.MeshStandardMaterial({
                color: map.colors.water,
                transparent: true,
                opacity: 0.7,
                side: THREE.DoubleSide
            });
            const water = new THREE.Mesh(waterGeo, waterMat);
            water.rotation.x = -Math.PI / 2;
            water.position.x = 35;
            water.position.y = -0.5;
            scene.add(water);
            this.waterPlane = water;
        } else {
            // Circular ocean around island
            const waterGeo = new THREE.CircleGeometry(60, 64);
            const waterMat = new THREE.MeshStandardMaterial({
                color: map.colors.water,
                transparent: true,
                opacity: 0.6,
                side: THREE.DoubleSide
            });
            const water = new THREE.Mesh(waterGeo, waterMat);
            water.rotation.x = -Math.PI / 2;
            water.position.y = -0.5;
            scene.add(water);
            this.waterPlane = water;
        }
    }

    createBuildings() {
        const map = this.maps[this.selectedMap];
        const { scene } = this.mainScene;

        const count = 12;

        for (let i = 0; i < count; i++) {
            const height = 3 + Math.random() * 5;
            const width = 2 + Math.random() * 2;

            const geometry = new THREE.BoxGeometry(width, height, width);
            const material = new THREE.MeshStandardMaterial({
                color: map.colors.primary,
                emissive: map.colors.primary,
                emissiveIntensity: 0.1
            });

            const building = new THREE.Mesh(geometry, material);

            // Position in clusters
            const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
            const radius = 10 + Math.random() * 8;

            building.position.x = Math.cos(angle) * radius;
            building.position.z = Math.sin(angle) * radius;
            building.position.y = height / 2 + 1; // Slightly elevated

            building.castShadow = true;
            building.receiveShadow = true;

            building.userData = {
                originalHeight: height,
                targetHeight: height,
                growthRate: 0
            };

            scene.add(building);
            this.buildings.push(building);
        }

        this.updateStats();
    }

    createNPCs() {
        const map = this.maps[this.selectedMap];
        const { scene } = this.mainScene;

        const count = 30;

        for (let i = 0; i < count; i++) {
            const geometry = new THREE.CapsuleGeometry(0.4, 1.2, 4, 8);
            const material = new THREE.MeshStandardMaterial({
                color: map.colors.secondary
            });

            const npc = new THREE.Mesh(geometry, material);

            npc.position.x = (Math.random() - 0.5) * 30;
            npc.position.z = (Math.random() - 0.5) * 30;
            npc.position.y = 2; // Slightly elevated

            npc.castShadow = true;

            npc.userData = {
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.1,
                    0,
                    (Math.random() - 0.5) * 0.1
                ),
                health: 100,
                alive: true,
                infected: false,
                behavior: 'wander'
            };

            scene.add(npc);
            this.npcs.push(npc);
        }

        this.updateStats();
    }

    runInitialPreview() {
        // Set time to 100x for 10 seconds
        this.timeScale = 3;
        document.getElementById('time-slider').value = 3;
        document.getElementById('current-speed').textContent = '100× ACCELERATED';

        setTimeout(() => {
            // Auto-pause after preview
            this.timeScale = 0;
            document.getElementById('time-slider').value = 0;
            document.getElementById('current-speed').textContent = 'PAUSED';
        }, 10000);
    }

    animate() {
        if (!this.isSimulationRunning) return;

        requestAnimationFrame(() => this.animate());

        const deltaTime = 1/60; // Assuming 60 FPS

        this.updateCivilization(deltaTime);

        if (this.mainScene.controls) {
            this.mainScene.controls.update();
        }

        this.mainScene.renderer.render(this.mainScene.scene, this.mainScene.camera);
    }

    // ==========================================
    // CORE UPDATE FUNCTIONS
    // ==========================================

    updateCivilization(deltaTime) {
        this.updateTime(deltaTime);
        this.applyLifeDifficulty();
        this.applyRumorIntensity();
        this.applyTolerance();
        this.applyInnovationPace();
        this.applyClimateThreat();
        this.applyBorderOpenness();

        this.updateNPCs(deltaTime);
        this.updateBuildings(deltaTime);
    }

    updateTime(deltaTime) {
        if (this.timeScale === 0) return;

        const multipliers = [0, 1, 10, 100];
        const actualDelta = deltaTime * multipliers[this.timeScale];

        this.timeAccumulator += actualDelta;

        // Each unit = 1 day
        if (this.timeAccumulator >= 1.0) {
            const daysToAdd = Math.floor(this.timeAccumulator);
            this.timeAccumulator -= daysToAdd;

            this.day += daysToAdd;

            while (this.day > 30) {
                this.day -= 30;
                this.month++;

                if (this.month > 12) {
                    this.month = 1;
                    this.year++;
                }
            }

            // Update display
            document.getElementById('time-year').textContent = `Year ${String(this.year).padStart(4, '0')}`;
            document.getElementById('time-month').textContent = `Month ${String(this.month).padStart(2, '0')}`;
            document.getElementById('time-day').textContent = `Day ${String(this.day).padStart(2, '0')}`;
        }
    }

    applyLifeDifficulty() {
        const difficulty = this.params.lifeDifficulty;

        // Affects NPC health decay
        this.npcs.forEach(npc => {
            if (!npc.userData.alive) return;

            if (difficulty > 60) {
                npc.userData.health -= (difficulty / 100) * 0.05;

                if (npc.userData.health <= 0) {
                    npc.userData.alive = false;
                    npc.visible = false;
                }
            } else if (difficulty < 40) {
                npc.userData.health = Math.min(100, npc.userData.health + 0.02);
            }

            // Visual feedback
            npc.material.opacity = Math.max(0.3, npc.userData.health / 100);
        });
    }

    applyRumorIntensity() {
        const rumor = this.params.rumorIntensity;

        this.npcs.forEach(npc => {
            if (!npc.userData.alive) return;

            if (rumor > 60) {
                // Gather behavior - move to center
                npc.userData.behavior = 'gather';
                const toCenter = new THREE.Vector3(0, 0, 0).sub(npc.position).normalize();
                npc.userData.velocity.copy(toCenter.multiplyScalar(0.08));
            } else {
                npc.userData.behavior = 'wander';
            }
        });
    }

    applyTolerance() {
        const tolerance = this.params.toleranceLevel;

        // Check NPC collisions
        for (let i = 0; i < this.npcs.length; i++) {
            const npcA = this.npcs[i];
            if (!npcA.userData.alive) continue;

            for (let j = i + 1; j < this.npcs.length; j++) {
                const npcB = this.npcs[j];
                if (!npcB.userData.alive) continue;

                const distance = npcA.position.distanceTo(npcB.position);

                if (distance < 2) {
                    if (tolerance < 30) {
                        // Conflict - lose health
                        npcA.userData.health -= 2;
                        npcB.userData.health -= 2;

                        // Repel
                        const away = npcA.position.clone().sub(npcB.position).normalize();
                        npcA.userData.velocity.add(away.multiplyScalar(0.05));
                        npcB.userData.velocity.sub(away.multiplyScalar(0.05));

                    } else if (tolerance > 70) {
                        // Cooperation - gain health
                        npcA.userData.health = Math.min(100, npcA.userData.health + 0.5);
                        npcB.userData.health = Math.min(100, npcB.userData.health + 0.5);
                    }
                }
            }
        }
    }

    applyInnovationPace() {
        const innovation = this.params.innovationPace;

        // Affects building aesthetics and prosperity
        const prosperity = (100 - this.params.lifeDifficulty + innovation) / 200;

        this.buildings.forEach(building => {
            building.userData.targetHeight = building.userData.originalHeight * (0.5 + prosperity * 1.5);
            building.userData.growthRate = (building.userData.targetHeight - building.scale.y * building.userData.originalHeight) * 0.01;

            // Color variation based on innovation
            if (innovation > 60 && Math.random() < 0.01) {
                const map = this.maps[this.selectedMap];
                const colors = [map.colors.primary, map.colors.secondary, map.colors.terrain];
                building.material.color.setHex(colors[Math.floor(Math.random() * colors.length)]);
            }
        });

        // Update status
        const statusEl = document.getElementById('stat-status');
        if (prosperity > 0.7) {
            statusEl.textContent = 'THRIVING';
            statusEl.style.color = '#0f0';
        } else if (prosperity > 0.4) {
            statusEl.textContent = 'STABLE';
            statusEl.style.color = '#0ff';
        } else {
            statusEl.textContent = 'DECLINING';
            statusEl.style.color = '#f00';
        }
    }

    applyClimateThreat() {
        const threat = this.params.climateThreat;

        // Affects scene atmosphere
        const { scene } = this.mainScene;

        if (threat > 70) {
            scene.fog.far = 100 - (threat - 70);
            scene.background.setHex(0x000000 + Math.floor((100 - threat) * 0x000408));

            // NPCs seek shelter
            this.npcs.forEach(npc => {
                if (!npc.userData.alive) return;

                // Find nearest building
                let nearest = null;
                let minDist = Infinity;

                this.buildings.forEach(building => {
                    const dist = npc.position.distanceTo(building.position);
                    if (dist < minDist) {
                        minDist = dist;
                        nearest = building;
                    }
                });

                if (nearest) {
                    const toShelter = nearest.position.clone().sub(npc.position).normalize();
                    npc.userData.velocity.copy(toShelter.multiplyScalar(0.1));
                }
            });
        } else {
            scene.fog.far = 200;
            scene.background.setHex(0x000428);
        }
    }

    applyBorderOpenness() {
        const openness = this.params.borderOpenness;
        const { scene } = this.mainScene;

        // Remove old walls
        this.walls.forEach(wall => scene.remove(wall));
        this.walls = [];

        if (openness < 50) {
            // Create isolation walls
            const wallHeight = (50 - openness) / 5;

            for (let i = 0; i < 4; i++) {
                const wallGeo = new THREE.BoxGeometry(40, wallHeight, 0.5);
                const wallMat = new THREE.MeshStandardMaterial({
                    color: 0x888888,
                    transparent: true,
                    opacity: 0.5
                });
                const wall = new THREE.Mesh(wallGeo, wallMat);

                const angle = (i / 4) * Math.PI * 2;
                wall.position.x = Math.cos(angle) * 20;
                wall.position.z = Math.sin(angle) * 20;
                wall.position.y = wallHeight / 2;
                wall.rotation.y = angle + Math.PI / 2;

                scene.add(wall);
                this.walls.push(wall);
            }
        }
    }

    updateNPCs(deltaTime) {
        const multipliers = [0, 1, 10, 100];
        const speedMult = multipliers[this.timeScale];

        this.npcs.forEach(npc => {
            if (!npc.userData.alive) return;

            // Move based on velocity
            npc.position.add(npc.userData.velocity.clone().multiplyScalar(speedMult));

            // Random wander
            if (npc.userData.behavior === 'wander' && Math.random() < 0.01) {
                npc.userData.velocity.x += (Math.random() - 0.5) * 0.02;
                npc.userData.velocity.z += (Math.random() - 0.5) * 0.02;
                npc.userData.velocity.clampLength(0, 0.1);
            }

            // Boundary constraints
            const maxDist = 25;
            const dist = Math.sqrt(npc.position.x ** 2 + npc.position.z ** 2);
            if (dist > maxDist) {
                const angle = Math.atan2(npc.position.z, npc.position.x);
                npc.position.x = Math.cos(angle) * maxDist;
                npc.position.z = Math.sin(angle) * maxDist;
                npc.userData.velocity.multiplyScalar(-0.5);
            }
        });
    }

    updateBuildings(deltaTime) {
        this.buildings.forEach(building => {
            // Gradual height changes
            const currentHeight = building.scale.y * building.userData.originalHeight;
            const targetHeight = building.userData.targetHeight;

            if (Math.abs(currentHeight - targetHeight) > 0.1) {
                const newScale = building.scale.y + building.userData.growthRate;
                building.scale.y = Math.max(0.2, newScale);
                building.position.y = (building.scale.y * building.userData.originalHeight) / 2;
            }
        });
    }

    updateStats() {
        const aliveNPCs = this.npcs.filter(npc => npc.userData.alive).length;
        document.getElementById('stat-population').textContent = aliveNPCs;
        document.getElementById('stat-buildings').textContent = this.buildings.length;
    }

    // ==========================================
    // CRISIS EVENTS
    // ==========================================

    triggerDeluge() {
        console.log('DELUGE triggered!');

        const startY = this.waterPlane.position.y;
        const targetY = 2;
        const duration = 3000;
        const startTime = Date.now();

        const animateFlood = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            this.waterPlane.position.y = startY + (targetY - startY) * progress;

            // NPCs panic and run uphill
            this.npcs.forEach(npc => {
                if (!npc.userData.alive) return;

                if (npc.position.y < this.waterPlane.position.y + 1) {
                    // Run away from center
                    const away = npc.position.clone().normalize().multiplyScalar(0.2);
                    npc.userData.velocity.copy(away);

                    // Take damage
                    npc.userData.health -= 1;
                }
            });

            if (progress < 1) {
                requestAnimationFrame(animateFlood);
            } else {
                // Recede
                setTimeout(() => {
                    this.waterPlane.position.y = startY;
                }, 2000);
            }
        };

        animateFlood();
        this.updateStats();
    }

    triggerPlague() {
        console.log('PLAGUE triggered!');

        const infectCount = Math.floor(this.npcs.length * 0.4);
        const aliveNPCs = this.npcs.filter(npc => npc.userData.alive);

        let infected = 0;

        const spreadDisease = () => {
            if (infected >= infectCount || aliveNPCs.length === 0) return;

            const victim = aliveNPCs[Math.floor(Math.random() * aliveNPCs.length)];

            if (!victim.userData.infected) {
                victim.userData.infected = true;
                victim.material.color.setHex(0x00ff00); // Sick green
                infected++;

                setTimeout(() => {
                    victim.userData.alive = false;
                    victim.visible = false;
                    this.updateStats();
                }, 2000);
            }

            if (infected < infectCount) {
                setTimeout(spreadDisease, 500);
            }
        };

        spreadDisease();
    }

    triggerWar() {
        console.log('WAR triggered!');

        const { scene } = this.mainScene;

        // Spawn enemies at edges
        for (let i = 0; i < 10; i++) {
            const angle = (i / 10) * Math.PI * 2;
            const radius = 35;

            const enemyGeo = new THREE.ConeGeometry(0.8, 2, 4);
            const enemyMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
            const enemy = new THREE.Mesh(enemyGeo, enemyMat);

            enemy.position.x = Math.cos(angle) * radius;
            enemy.position.z = Math.sin(angle) * radius;
            enemy.position.y = 1;

            enemy.userData = {
                velocity: new THREE.Vector3(
                    -Math.cos(angle) * 0.15,
                    0,
                    -Math.sin(angle) * 0.15
                )
            };

            scene.add(enemy);
            this.enemies.push(enemy);
        }

        // Attack sequence
        const attackDuration = 8000;
        const attackStart = Date.now();

        const attackLoop = () => {
            const elapsed = Date.now() - attackStart;

            if (elapsed > attackDuration) {
                // Remove enemies
                this.enemies.forEach(enemy => scene.remove(enemy));
                this.enemies = [];
                return;
            }

            this.enemies.forEach(enemy => {
                enemy.position.add(enemy.userData.velocity);

                // Attack NPCs
                this.npcs.forEach(npc => {
                    if (!npc.userData.alive) return;

                    const dist = enemy.position.distanceTo(npc.position);
                    if (dist < 2) {
                        npc.userData.health -= 10;

                        if (npc.userData.health <= 0) {
                            npc.userData.alive = false;
                            npc.visible = false;
                        }
                    }
                });
            });

            this.updateStats();
            requestAnimationFrame(attackLoop);
        };

        attackLoop();
    }
}

// ==========================================
// INITIALIZE APPLICATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    const app = new CivilizationAccelerator();
});
