class MainHoverEffect {
	constructor(container = document.body, effectWrapper) {
		this.container = container;
		this.effectWrapper = effectWrapper;

		if (!this.container || !this.effectWrapper) return;

		this.setup();

		this.initHoverEffect().then(() => {
			this.isLoaded = true;
			if (this.isMouseOver) this.onMouseOver(this.tempItemIndex);
			this.tempItemIndex = null;
		});

		this.createEventsListeners();
	}

	// Create Setup
	setup() {
		window.addEventListener("resize", this.onWindowResize.bind(this), false);

		// Create Renderer
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		this.renderer.setSize(this.viewport.width, this.viewport.height);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.container.appendChild(this.renderer.domElement);

		// Create Scene
		this.scene = new THREE.Scene();

		// Create Camera
		this.camera = new THREE.PerspectiveCamera(40, this.viewport.aspectRatio, 0.1, 100);
		this.camera.position.set(0, 0, 3);

		// Create Mouse
		this.mouse = new THREE.Vector2();

		// Add Time
		this.timeSpeed = 2;
		this.time = 0;
		this.clock = new THREE.Clock();

		// Set Animation Loop
		this.renderer.setAnimationLoop(this.render.bind(this));
	}

	// Render Each Frame
	render() {
		this.time += this.clock.getDelta() * this.timeSpeed;
		this.renderer.render(this.scene, this.camera);
	}

	// Texture Load Setup
	initHoverEffect() {
		let promises = [];

		this.items = this.itemsElements;

		const myTextureLoad = new THREE.TextureLoader();
		this.items.forEach((item, index) => {
			// Create Textures
			promises.push(this.loadTexture(myTextureLoad, item.image ? item.image.src : null, index));
		});

		return new Promise((resolve, reject) => {
			// Resolve promises
			Promise.all(promises).then((promises) => {
				// Success on texture load
				promises.forEach((promise, index) => {
					// Assign textures to item
					this.items[index].texture = promise.texture;
				});
				resolve();
			});
		});
	}

	// Create Event Listeners
	createEventsListeners() {
		this.items.forEach((item, index) => {
			item.element.addEventListener("mouseover", this.mouseOver.bind(this, index), false);
		});

		this.container.addEventListener("mousemove", this.mouseMove.bind(this), false);
		this.effectWrapper.addEventListener("mouseleave", this.mouseLeave.bind(this), false);
	}

	mouseLeave(event) {
		this.isMouseOver = false;
		this.onMouseLeave(event);
	}

	mouseMove(event) {
		// get normalized mouse position on viewport
		this.mouse.x = (event.clientX / this.viewport.width) * 2 - 1;
		this.mouse.y = -(event.clientY / this.viewport.height) * 2 + 1;

		this.onMouseMove(event);
	}

	mouseOver(index, event) {
		console.log('dddd')
		this.tempItemIndex = index;
		this.onMouseOver(index, event);
	}

	onWindowResize() {
		this.camera.aspect = this.viewport.aspectRatio;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(this.viewport.width, this.viewport.height);
	}

	onUpdate() {}

	onMouseEnter(event) {}

	onMouseLeave(event) {}

	onMouseMove(event) {}

	onMouseOver(index, event) {}

	get viewport() {
		let width = this.container.clientWidth;
		let height = this.container.clientHeight;
		let aspectRatio = width / height;
		return {
			width,
			height,
			aspectRatio,
		};
	}

	// Fit image plane to viewport
	get viewSize() {
		let distance = this.camera.position.z;
		let vFov = (this.camera.fov * Math.PI) / 180;
		let height = 2 * Math.tan(vFov / 2) * distance;
		let width = height * this.viewport.aspectRatio;
		return { width, height, vFov };
	}

	get itemsElements() {
		// Convert NodeList to Array
		const items = [...this.effectWrapper.querySelectorAll(".card-lists")];

		//Create Array of items including element, image and index
		return items.map((item, index) => ({
			element: item,
			image: item.querySelector("img") || null,
			index: index,
		}));
	}

	loadTexture(loader, url, index) {
		return new Promise((resolve, reject) => {
			if (!url) {
				resolve({ texture: null, index });
				return;
			}
			// load a resource
			loader.load(
				// resource URL
				url,

				// onLoad callback
				(texture) => {
					resolve({ texture, index });
				},

				// onProgress callback currently not supported
				undefined,

				// onError callback
				(error) => {
					console.error("An error happened.", error);
					reject(error);
				}
			);
		});
	}
}
