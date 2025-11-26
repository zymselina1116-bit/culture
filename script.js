// ==========================================
// THE CIVILIZATION ACCELERATOR
// Main Simulation Script
// ==========================================

class CivilizationAccelerator {
    constructor() {
        this.selectedCiv = null;
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

        // Civilization definitions
        this.civilizations = {
            egypt: {
                name: 'Ancient Egypt',
                region: 'North Africa',
                description: `The mighty civilization along the Nile River. Known for pyramids,
                              pharaohs, and one of the earliest writing systems.`,
                terrainType: 'desert',
                colors: {
                    primary: 0xd4a017,    // Golden sandstone
                    secondary: 0xf5f5dc,  // White linen NPCs
                    terrain: 0xc2b280,    // Desert sand
                    water: 0x4682b4,      // Nile blue
                    vegetation: 0x6b8e23  // Papyrus green
                },
                terrainConfig: {
                    heightScale: 2,
                    riverEnabled: true,
                    oceanSide: null,
                    vegetationDensity: 0.3,
                    flatness: 0.8
                },
                buildings: {
                    type: 'pyramid',      // Pyramids and mud-brick structures
                    baseSize: 2.5,
                    heightRange: [4, 8]
                },
                startParams: {
                    lifeDifficulty: 40,
                    climateThreat: 55,
                    borderOpenness: 45
                }
            },
            greece: {
                name: 'Classical Greece',
                region: 'Mediterranean',
                description: `Birthplace of democracy and philosophy. Rocky coastlines, marble temples,
                              and city-states that shaped Western civilization.`,
                terrainType: 'coastal',
                colors: {
                    primary: 0xf5f5f5,    // Marble white
                    secondary: 0x4169e1,  // Blue tunic NPCs
                    terrain: 0x8b7355,    // Rocky brown
                    water: 0x006994,      // Mediterranean blue
                    vegetation: 0x808000  // Olive green
                },
                terrainConfig: {
                    heightScale: 4,
                    riverEnabled: false,
                    oceanSide: 'east',
                    vegetationDensity: 0.5,
                    flatness: 0.4
                },
                buildings: {
                    type: 'temple',       // Columns and amphitheaters
                    baseSize: 2.0,
                    heightRange: [3, 6]
                },
                startParams: {
                    lifeDifficulty: 35,
                    climateThreat: 40,
                    borderOpenness: 70
                }
            },
            china: {
                name: 'Ancient China',
                region: 'East Asia',
                description: `Ancient civilization along the Yellow and Yangtze rivers. Inventors of
                              paper, gunpowder, and builders of the Great Wall.`,
                terrainType: 'fertile',
                colors: {
                    primary: 0x8b4513,    // Wooden halls
                    secondary: 0xff6347,  // Red robes
                    terrain: 0x6b8e23,    // Fertile plains
                    water: 0x4682b4,      // River blue
                    vegetation: 0x228b22  // Bamboo green
                },
                terrainConfig: {
                    heightScale: 3,
                    riverEnabled: true,
                    oceanSide: null,
                    vegetationDensity: 0.7,
                    flatness: 0.6
                },
                buildings: {
                    type: 'pagoda',       // Tiered roofs
                    baseSize: 2.2,
                    heightRange: [5, 9]
                },
                startParams: {
                    lifeDifficulty: 30,
                    climateThreat: 50,
                    borderOpenness: 55
                }
            },
            mesopotamia: {
                name: 'Mesopotamia',
                region: 'Middle East',
                description: `Cradle of civilization between the Tigris and Euphrates. Birthplace of
                              writing, law codes, and urban planning.`,
                terrainType: 'river',
                colors: {
                    primary: 0xd2691e,    // Clay brick ziggurats
                    secondary: 0xdaa520,  // Simple cloth NPCs
                    terrain: 0xb8860b,    // Floodplain soil
                    water: 0x4682b4,      // River blue
                    vegetation: 0x9acd32  // Reeds
                },
                terrainConfig: {
                    heightScale: 1.5,
                    riverEnabled: true,
                    oceanSide: null,
                    vegetationDensity: 0.4,
                    flatness: 0.9
                },
                buildings: {
                    type: 'ziggurat',     // Stepped platforms
                    baseSize: 3.0,
                    heightRange: [4, 7]
                },
                startParams: {
                    lifeDifficulty: 45,
                    climateThreat: 60,
                    borderOpenness: 50
                }
            },
            maya: {
                name: 'Maya Civilization',
                region: 'Central America',
                description: `Master astronomers and mathematicians of Mesoamerica. Built massive
                              stone cities in dense jungle environments.`,
                terrainType: 'jungle',
                colors: {
                    primary: 0x708090,    // Stone pyramids
                    secondary: 0xff4500,  // Bright cloth
                    terrain: 0x556b2f,    // Jungle soil
                    water: 0x4682b4,      // Cenote blue
                    vegetation: 0x006400  // Dense jungle
                },
                terrainConfig: {
                    heightScale: 3.5,
                    riverEnabled: false,
                    oceanSide: null,
                    vegetationDensity: 0.9,
                    flatness: 0.5
                },
                buildings: {
                    type: 'pyramid',      // Step pyramids
                    baseSize: 2.8,
                    heightRange: [6, 10]
                },
                startParams: {
                    lifeDifficulty: 50,
                    climateThreat: 55,
                    borderOpenness: 40
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
    // PHASE 1: WORLD MAP SELECTION SCREEN
    // ==========================================

    initSelectionScreen() {
        const markers = document.querySelectorAll('.civ-marker');
        const previewPanel = document.getElementById('preview-panel');
        const previewTitle = document.getElementById('preview-civ-name');
        const previewInfo = document.getElementById('preview-info');

        markers.forEach(marker => {
            // Hover behavior - show floating preview
            marker.addEventListener('mouseenter', (e) => {
                const civKey = marker.dataset.civ;
                const civ = this.civilizations[civKey];

                // Update preview panel content
                previewTitle.textContent = civ.name;
                previewInfo.innerHTML = `
                    <strong>${civ.region}</strong><br>
                    ${civ.description}
                `;

                // Show preview panel
                previewPanel.classList.remove('hidden');

                // Position preview panel next to marker
                const rect = marker.getBoundingClientRect();
                previewPanel.style.left = (rect.right + 20) + 'px';
                previewPanel.style.top = rect.top + 'px';

                // Generate 3D preview
                this.updatePreview(civKey);
            });

            marker.addEventListener('mouseleave', () => {
                // Hide preview panel
                previewPanel.classList.add('hidden');
            });

            // Click behavior - select civilization
            marker.addEventListener('click', () => {
                markers.forEach(m => m.classList.remove('selected'));
                marker.classList.add('selected');
                this.selectedCiv = marker.dataset.civ;

                // Start simulation immediately
                this.startSimulation();
            });
        });
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

    updatePreview(civKey) {
        const civ = this.civilizations[civKey];
        const { scene } = this.previewScene;

        // Clear existing preview
        while(scene.children.length > 2) {
            scene.remove(scene.children[2]);
        }

        // Create terrain based on civilization type
        const size = 16;
        const resolution = 32;
        const geometry = new THREE.PlaneGeometry(size, size, resolution, resolution);

        // Apply heightmap based on civilization terrain
        const vertices = geometry.attributes.position;
        for (let i = 0; i < vertices.count; i++) {
            const x = vertices.getX(i);
            const z = vertices.getY(i);
            let height = 0;

            if (civ.terrainType === 'desert' || civ.terrainType === 'river') {
                // Flat with variations
                height = this.noise(x * 0.1, z * 0.1) * 0.5;
                if (civ.terrainConfig.riverEnabled && Math.abs(x) < 1) {
                    height -= 0.5; // River channel
                }
            } else if (civ.terrainType === 'coastal') {
                // Gradual slope
                height = this.noise(x * 0.1, z * 0.1) * 1.5 + (x * 0.15);
            } else if (civ.terrainType === 'fertile') {
                // Gentle rolling hills
                height = this.noise(x * 0.15, z * 0.15) * 1.2;
            } else if (civ.terrainType === 'jungle') {
                // Varied terrain
                height = this.noise(x * 0.2, z * 0.2) * 2 +
                        this.noise(x * 0.1, z * 0.1) * 0.8;
            }

            vertices.setZ(i, height);
        }
        geometry.computeVertexNormals();

        const terrainMat = new THREE.MeshStandardMaterial({
            color: civ.colors.terrain,
            flatShading: true
        });
        const terrain = new THREE.Mesh(geometry, terrainMat);
        terrain.rotation.x = -Math.PI / 2;
        scene.add(terrain);

        // Add water based on civilization
        if (civ.terrainConfig.riverEnabled) {
            // River strip
            const riverGeo = new THREE.BoxGeometry(2, 0.1, 16);
            const riverMat = new THREE.MeshStandardMaterial({
                color: civ.colors.water,
                transparent: true,
                opacity: 0.7
            });
            const river = new THREE.Mesh(riverGeo, riverMat);
            river.position.y = -0.3;
            scene.add(river);
        } else if (civ.terrainConfig.oceanSide) {
            // Ocean plane on one side
            const oceanGeo = new THREE.PlaneGeometry(8, 16);
            const oceanMat = new THREE.MeshStandardMaterial({
                color: civ.colors.water,
                transparent: true,
                opacity: 0.6
            });
            const ocean = new THREE.Mesh(oceanGeo, oceanMat);
            ocean.rotation.x = -Math.PI / 2;
            ocean.position.x = 8;
            ocean.position.y = -0.2;
            scene.add(ocean);
        }

        // Add sample buildings based on civilization style
        for (let i = 0; i < 3; i++) {
            const height = 1.5 + Math.random() * 2;
            const buildingGeo = new THREE.BoxGeometry(1, height, 1);
            const buildingMat = new THREE.MeshStandardMaterial({ color: civ.colors.primary });
            const building = new THREE.Mesh(buildingGeo, buildingMat);

            building.position.x = (Math.random() - 0.5) * 6;
            building.position.z = (Math.random() - 0.5) * 6;
            building.position.y = height / 2 + 0.5;

            scene.add(building);
        }

        // Add sample NPCs
        for (let i = 0; i < 5; i++) {
            const npcGeo = new THREE.CapsuleGeometry(0.2, 0.6, 4, 8);
            const npcMat = new THREE.MeshStandardMaterial({ color: civ.colors.secondary });
            const npc = new THREE.Mesh(npcGeo, npcMat);

            npc.position.x = (Math.random() - 0.5) * 6;
            npc.position.z = (Math.random() - 0.5) * 6;
            npc.position.y = 1;

            scene.add(npc);
        }
    }

    // ==========================================
    // PHASE 2: MAIN SIMULATION
    // ==========================================

    startSimulation() {
        // Hide selection, show simulation
        document.getElementById('selection-screen').classList.remove('active');
        document.getElementById('simulation-screen').classList.add('active');

        const civ = this.civilizations[this.selectedCiv];
        document.getElementById('civ-title').textContent = civ.name.toUpperCase();

        // Load civilization settings into sliders
        this.loadCivSettings();

        // Initialize main 3D scene
        this.initMainCanvas();

        // Run 10-second preview at 100x
        this.runInitialPreview();
    }

    loadCivSettings() {
        const civ = this.civilizations[this.selectedCiv];

        // Set sliders with civilization's starting parameters
        document.getElementById('slider-life').value = civ.startParams.lifeDifficulty;
        document.getElementById('slider-rumor').value = 50;  // Default
        document.getElementById('slider-tolerance').value = 50;  // Default
        document.getElementById('slider-innovation').value = 50;  // Default
        document.getElementById('slider-climate').value = civ.startParams.climateThreat;
        document.getElementById('slider-border').value = civ.startParams.borderOpenness;

        // Update params
        this.params.lifeDifficulty = civ.startParams.lifeDifficulty;
        this.params.rumorIntensity = 50;
        this.params.toleranceLevel = 50;
        this.params.innovationPace = 50;
        this.params.climateThreat = civ.startParams.climateThreat;
        this.params.borderOpenness = civ.startParams.borderOpenness;

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
        console.log('Initializing main canvas...');

        // Show loading overlay initially
        const loadingOverlay = document.getElementById('loading-overlay');
        loadingOverlay.classList.remove('hidden');

        // Create new canvas and append to container
        const container = document.getElementById('sim-container');
        const canvas = document.createElement('canvas');
        canvas.id = 'main-canvas';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.display = 'block';
        container.insertBefore(canvas, loadingOverlay);

        console.log('Canvas created and appended');

        // Create NEW Three.js scene for main simulation
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1a1a2e);
        scene.fog = new THREE.Fog(0x1a1a2e, 50, 200);

        // Camera positioned at 3/4 angled top-down view
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(30, 25, 30);
        camera.lookAt(0, 0, 0);

        // Create renderer
        const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: false
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        console.log('Renderer created');

        // OrbitControls with limited angle (cannot go below ground)
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.maxPolarAngle = Math.PI / 2.2; // Prevent going below horizon
        controls.minDistance = 10;
        controls.maxDistance = 100;
        controls.target.set(0, 0, 0);
        controls.update();

        // Lighting - ambient + directional
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
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

        console.log('Creating world...');

        // Create world immediately
        this.createTerrain();
        this.createWater();
        this.createBuildings();
        this.createNPCs();

        console.log('World created, starting animation');

        // Start animation loop
        this.isSimulationRunning = true;
        this.animate();

        // Force initial render
        renderer.render(scene, camera);

        // Hide loading after 2 seconds
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
            console.log('Loading hidden, scene should be visible');
        }, 2000);

        // Handle resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    createTerrain() {
        const civ = this.civilizations[this.selectedCiv];
        const config = civ.terrainConfig;
        const { scene } = this.mainScene;

        // Procedural terrain with noise based on civilization type
        const size = 50;
        const resolution = 64;
        const geometry = new THREE.PlaneGeometry(size, size, resolution, resolution);

        // Apply noise to vertices based on civilization's terrain configuration
        const vertices = geometry.attributes.position;
        for (let i = 0; i < vertices.count; i++) {
            const x = vertices.getX(i);
            const z = vertices.getY(i);
            let height = 0;

            if (civ.terrainType === 'desert' || civ.terrainType === 'river') {
                // Flat plains with optional river channel
                height = this.noise(x * 0.1, z * 0.1) * config.heightScale * 0.5 +
                        this.noise(x * 0.05, z * 0.05) * config.heightScale * 0.3;

                // River channel depression
                if (config.riverEnabled && Math.abs(x) < 3) {
                    height -= config.heightScale * 0.5;
                }
            } else if (civ.terrainType === 'coastal') {
                // Gradual slope with peninsula shape
                height = this.noise(x * 0.1, z * 0.1) * config.heightScale +
                        (x * 0.1) + // Slope toward ocean side
                        this.noise(x * 0.05, z * 0.05) * config.heightScale * 0.5;
            } else if (civ.terrainType === 'fertile') {
                // Gentle rolling hills
                height = this.noise(x * 0.12, z * 0.12) * config.heightScale +
                        this.noise(x * 0.08, z * 0.08) * config.heightScale * 0.4;

                if (config.riverEnabled && Math.abs(x) < 3) {
                    height -= config.heightScale * 0.3;
                }
            } else if (civ.terrainType === 'jungle') {
                // Varied mountainous jungle terrain
                height = this.noise(x * 0.15, z * 0.15) * config.heightScale +
                        this.noise(x * 0.25, z * 0.25) * config.heightScale * 0.6;
            }

            vertices.setZ(i, height);
        }

        geometry.computeVertexNormals();

        const material = new THREE.MeshStandardMaterial({
            color: civ.colors.terrain,
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
        const civ = this.civilizations[this.selectedCiv];
        const { scene } = this.mainScene;

        // Create river along center
        const riverGeo = new THREE.BoxGeometry(6, 0.2, 50);
        const riverMat = new THREE.MeshStandardMaterial({
            color: civ.colors.water,
            transparent: true,
            opacity: 0.8
        });
        const river = new THREE.Mesh(riverGeo, riverMat);
        river.position.y = -0.3;
        scene.add(river);
        this.rivers.push(river);
    }

    createVegetation(density) {
        const civ = this.civilizations[this.selectedCiv];
        const { scene } = this.mainScene;
        const count = Math.floor(40 * density);

        for (let i = 0; i < count; i++) {
            const trunkGeo = new THREE.CylinderGeometry(0.1, 0.15, 1.5, 8);
            const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
            const trunk = new THREE.Mesh(trunkGeo, trunkMat);

            const leavesGeo = new THREE.ConeGeometry(0.8, 2, 8);
            const leavesMat = new THREE.MeshStandardMaterial({ color: civ.colors.vegetation });
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
        const civ = this.civilizations[this.selectedCiv];
        const { scene } = this.mainScene;

        // Different water placement based on civilization terrain
        if (civ.terrainConfig.oceanSide) {
            // Ocean on specified side
            const waterGeo = new THREE.PlaneGeometry(30, 60);
            const waterMat = new THREE.MeshStandardMaterial({
                color: civ.colors.water,
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
                color: civ.colors.water,
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
        const civ = this.civilizations[this.selectedCiv];
        const { scene } = this.mainScene;

        const count = 12;

        for (let i = 0; i < count; i++) {
            const buildingConfig = civ.buildings;
            const height = buildingConfig.heightRange[0] +
                          Math.random() * (buildingConfig.heightRange[1] - buildingConfig.heightRange[0]);
            const width = buildingConfig.baseSize + Math.random() * 1;

            const geometry = new THREE.BoxGeometry(width, height, width);
            const material = new THREE.MeshStandardMaterial({
                color: civ.colors.primary,
                emissive: civ.colors.primary,
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
        const civ = this.civilizations[this.selectedCiv];
        const { scene } = this.mainScene;

        const count = 30;

        for (let i = 0; i < count; i++) {
            const geometry = new THREE.CapsuleGeometry(0.4, 1.2, 4, 8);
            const material = new THREE.MeshStandardMaterial({
                color: civ.colors.secondary
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
                const civ = this.civilizations[this.selectedCiv];
                const colors = [civ.colors.primary, civ.colors.secondary, civ.colors.terrain];
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
