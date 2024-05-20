class StickyEffect {
	constructor(container) {
		// Set Scene
		this.scene = new THREE.Scene();

		// Set Renderer
		this.renderer = new THREE.WebGLRenderer();
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(this.width, this.height);
		this.renderer.setClearColor(0xe0e0e0, 1);
		this.renderer.physicallyCorrectLights = true;
		this, (this.renderer.outputEncoding = THREE.sRGBEncoding);

		// Set Scene Container
		this.container = document.getElementById("hero-image");
		this.width = this.container.offsetWidth;
		this.height = this.container.offsetHeight;
		this.container.appendChild(this.renderer.domElement);

		// Set Camera
		this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.001, 1000);
		this.camera.position.set(0, 0, 2);

		// // Controls
		// this.controls = new THREE.OrbitControls(
		//   this.camera,
		//   this.renderer.domElement
		// );

		// Set Time
		this.time = 0;
		this.paused = false;

		// Store Mouse Position
		this.mouse = new THREE.Vector2();
		this.previousMouse = new THREE.Vector2();
		this.velocity = 0;
		this.targetVelocity = 0;

		// Call functions
		this.setupResize();
		this.tabEvents();
		this.addObjects();
		this.resize();
		this.render();
		this.mouseEvents();
		this.mouseMoveEvent();
	}

	// Mouse Events
	mouseMoveEvent() {
		document.addEventListener("mousemove", (event) => {
			this.mouse.x = event.x / this.width;
			this.mouse.y = 1 - event.y / this.height; // Usually in Inverted Cordinates
			this.material.uniforms.mouse.value = this.mouse;
		});
	}

	getMouseVelocity() {
		this.velocity = Math.sqrt((this.previousMouse.x - this.mouse.x) ** 2 + (this.previousMouse.y - this.mouse.y) ** 2);

		// Inertia Smoothness
		this.targetVelocity += 0.1 * (this.velocity - this.targetVelocity);

		// console.log(this.velocity);

		this.previousMouse.x = this.mouse.x;
		this.previousMouse.y = this.mouse.y;
	}

	mouseEvents() {
		// Custom Easing
		CustomEase.create("myEaseSmooth", "M0,0 C0.34,0 0.11,1 1,1");

		// Mouse Down
		document.addEventListener("mousedown", () => {
			this.material.uniforms.direction.value = 0;
			gsap.to(this.material.uniforms.progress, {
				value: 1,
				duration: 0.5,
				ease: "power4.out",
			});
		});

		// Mouse Up
		document.addEventListener("mouseup", () => {
			this.material.uniforms.direction.value = 1;
			gsap.to(this.material.uniforms.progress, {
				value: 0,
				duration: 0.5,
				ease: "power4.out",
			});
		});
	}

	// Window & Image Resize
	setupResize() {
		window.addEventListener("resize", this.resize.bind(this));
	}

	resize() {
		this.width = this.container.offsetWidth;
		this.height = this.container.offsetHeight;
		this.renderer.setSize(this.width, this.height);
		this.camera.aspect = this.width / this.height;

		// Scale Image to Aspect Ration
		this.imageAspect = 853 / 1280;
		let a1;
		let a2;
		if (this.height / this.width > this.imageAspect) {
			a1 = (this.width / this.height) * this.imageAspect;
			a2 = 1;
		} else {
			a1 = 1;
			a2 = this.height / this.width / this.imageAspect;
		}

		this.material.uniforms.resolution.value.x = this.width;
		this.material.uniforms.resolution.value.y = this.height;
		this.material.uniforms.resolution.value.z = a1;
		this.material.uniforms.resolution.value.w = a2;

		// Plane Cover Full Screen
		const dist = this.camera.position.z;
		const height = 1;
		this.camera.fov = 2 * (180 / Math.PI) * Math.atan(height / (2 * dist));

		// Responsive Aspect Ratio – if (w / h > 1){}
		if (this.width / this.height > 1) {
			this.plane.scale.x = this.camera.aspect;
			//this.plane.scale.y = this.camera.aspect;
		} else {
			this.plane.scale.y = 1 / this.camera.aspect;
		}

		this.camera.updateProjectionMatrix();
	}

	// Create Scene Objects
	addObjects() {
		this.geometry = new THREE.PlaneBufferGeometry(1, 1, 100, 100);
		this.material = new THREE.ShaderMaterial({
			extensions: {
				derivatives: "#extensions GL_OES_standard_derivatives : enable",
			},
			uniforms: {
				time: { type: "f", value: 0 },
				velocity: { type: "f", value: 0 },
				mouse: { type: "v2", value: new THREE.Vector2(0.0, 0.0) },
				direction: { type: "f", value: 0 },
				progress: { type: "f", value: 0 },
				texture: {
					type: "t",
					value: new THREE.TextureLoader().load(image),
				},
				resolution: { type: "v4", value: new THREE.Vector4() },
				uvRate1: { value: new THREE.Vector2(1, 1) },
			},
			side: THREE.DoubleSide,
			// wireframe: true,
			// transparent: true,

			vertexShader: `
        varying vec2 vUv;
        varying vec4 vPosition;
        
        uniform float time;
        uniform float progress;
        uniform float direction;
        uniform vec2 mouse;
        uniform vec4 resolution;
        
        
        void main() {
        
            vUv = uv;
        
            vec3 pos = position;
        
            float distance = length(uv - vec2(0.5));
            float maxdist = length(vec2(0.5));
            float normalizeDistance = distance / maxdist;
        
            float stickEffectIn = normalizeDistance;
            float stickEffectOut = -normalizeDistance;
            float stickEffect = mix(stickEffectIn, stickEffectOut, direction);
        
            float backForthProgress = min(2.0 * progress, 2.0 * (1.0 - progress));
        
            float zDistance = 0.0;
            float zProgress = mix(clamp(2.0 * progress, 0.0, 1.0), clamp(1.0 - 2.0 * (1.0 - progress), 0.0, 1.0), direction);
        
            pos.z += zDistance * (stickEffect * backForthProgress - zProgress);

        
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
        }
      `,

			fragmentShader: `
        varying vec2 vUv;
        varying vec4 vPosition;
      
        uniform float time;
        uniform float progress;
        uniform float velocity;
        uniform vec2 mouse;
        uniform vec4 resolution;
      
      
        uniform sampler2D texture;
        uniform sampler2D texture2;
      
        void main() {

            float normVelocity = clamp(velocity * 34.0, 0.0, 1.0); 
      
            float mouseDistance = length(vUv - mouse);
      
            float buldgeCircle = smoothstep(1.3, 0.0, mouseDistance);
      
            vec2 newUV = (vUv - vec2(0.5)) * resolution.zw + vec2(0.5);
      
            vec4 color = texture2D(texture, newUV);
      
            float r = texture2D(texture, newUV + 0.1 * 0.5 * buldgeCircle * normVelocity).r;
            float g = texture2D(texture, newUV + 0.1 * 0.3 * buldgeCircle * normVelocity).g;
            float b = texture2D(texture, newUV + 0.1 * 0.1 * buldgeCircle * normVelocity).b;
      
            gl_FragColor = vec4(r, g, b, 1.0);
        }
      `,
		});

		this.plane = new THREE.Mesh(this.geometry, this.material);
		this.scene.add(this.plane);
	}

	tabEvents() {
		document.addEventListener("visibilitychange", () => {
			if (document.hidden) {
				this.stop();
			} else {
				this.play();
			}
		});
	}

	stop() {
		this.paused = true;
	}

	play() {
		this.paused = false;
	}

	// Render Scene & Animation
	render() {
		if (this.paused) return;
		this.time += 0.05;
		this.getMouseVelocity();

		this.material.uniforms.velocity.value = this.targetVelocity;
		this.material.uniforms.time.value = this.time;
		requestAnimationFrame(this.render.bind(this));
		this.renderer.render(this.scene, this.camera);
	}
}
