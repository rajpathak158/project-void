import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


class PlayerController {

    constructor(scene, camera) {

        this.scene = scene;
        this.camera = camera;

        this.player = null;

        this.speed = 4;
        this.runSpeed = 6.5;

        this.velocity =
            new THREE.Vector3();

        this.moveInput =
            new THREE.Vector2();

        this.keys = {};

        this.joystickActive = false;

        this.joystickStart =
            new THREE.Vector2();

        this.cameraDistance = 7;

        this.cameraHeight = 4;

        this.createPlayer();

        this.setupKeyboard();

        this.setupTouch();

    }


    /*
    ==========================================
    CREATE PLAYER
    ==========================================
    */

    createPlayer() {

        this.player =
            new THREE.Group();


        /*
        Body
        */

        const bodyGeometry =
            new THREE.CapsuleGeometry(
                0.45,
                0.8,
                8,
                16
            );


        const bodyMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x3d6dff,
                roughness: 0.5
            });


        const body =
            new THREE.Mesh(
                bodyGeometry,
                bodyMaterial
            );


        body.position.y = 1.05;

        body.castShadow = true;

        this.player.add(body);


        /*
        Head
        */

        const headGeometry =
            new THREE.SphereGeometry(
                0.48,
                24,
                24
            );


        const headMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x4778ff,
                roughness: 0.45
            });


        const head =
            new THREE.Mesh(
                headGeometry,
                headMaterial
            );


        head.position.y = 2;

        head.castShadow = true;

        this.player.add(head);


        /*
        Visor
        */

        const visorGeometry =
            new THREE.SphereGeometry(
                0.28,
                20,
                20
            );


        const visorMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x8be9ff,
                metalness: 0.8,
                roughness: 0.15,
                emissive: 0x123c55,
                emissiveIntensity: 0.5
            });


        const visor =
            new THREE.Mesh(
                visorGeometry,
                visorMaterial
            );


        visor.position.set(
            0,
            2.05,
            -0.42
        );


        visor.scale.set(
            1,
            0.78,
            0.45
        );


        visor.castShadow = true;

        this.player.add(visor);


        /*
        Backpack
        */

        const backpackGeometry =
            new THREE.BoxGeometry(
                0.65,
                0.9,
                0.3
            );


        const backpackMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x20263a,
                roughness: 0.7
            });


        const backpack =
            new THREE.Mesh(
                backpackGeometry,
                backpackMaterial
            );


        backpack.position.set(
            0,
            1.05,
            0.48
        );


        backpack.castShadow = true;

        this.player.add(backpack);


        /*
        Player position
        */

        this.player.position.set(
            0,
            0,
            5
        );


        this.scene.add(
            this.player
        );

    }


    /*
    ==========================================
    KEYBOARD
    ==========================================
    */

    setupKeyboard() {

        window.addEventListener(
            "keydown",
            event => {

                this.keys[event.code] =
                    true;

            }
        );


        window.addEventListener(
            "keyup",
            event => {

                this.keys[event.code] =
                    false;

            }
        );

    }


    /*
    ==========================================
    TOUCH JOYSTICK
    ==========================================
    */

    setupTouch() {

        const joystick =
            document.getElementById(
                "joystick"
            );


        const knob =
            document.getElementById(
                "joystick-knob"
            );


        if (!joystick || !knob) {

            return;

        }


        const maxDistance = 42;


        joystick.addEventListener(
            "touchstart",
            event => {

                event.preventDefault();

                const touch =
                    event.touches[0];


                const rect =
                    joystick.getBoundingClientRect();


                this.joystickStart.set(
                    rect.left +
                    rect.width / 2,

                    rect.top +
                    rect.height / 2
                );


                this.joystickActive =
                    true;


                this.updateJoystick(
                    touch.clientX,
                    touch.clientY,
                    knob,
                    maxDistance
                );

            },
            {
                passive: false
            }
        );


        joystick.addEventListener(
            "touchmove",
            event => {

                event.preventDefault();


                if (
                    !this.joystickActive
                ) {

                    return;

                }


                const touch =
                    event.touches[0];


                this.updateJoystick(
                    touch.clientX,
                    touch.clientY,
                    knob,
                    maxDistance
                );

            },
            {
                passive: false
            }
        );


        joystick.addEventListener(
            "touchend",
            event => {

                event.preventDefault();

                this.joystickActive =
                    false;


                this.moveInput.set(
                    0,
                    0
                );


                knob.style.transform =
                    "translate(-50%, -50%)";

            },
            {
                passive: false
            }
        );

    }


    /*
    ==========================================
    JOYSTICK UPDATE
    ==========================================
    */

    updateJoystick(
        x,
        y,
        knob,
        maxDistance
    ) {

        let dx =
            x -
            this.joystickStart.x;


        let dy =
            y -
            this.joystickStart.y;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (
            distance >
            maxDistance
        ) {

            dx =
                dx /
                distance *
                maxDistance;


            dy =
                dy /
                distance *
                maxDistance;

        }


        this.moveInput.set(
            dx / maxDistance,
            dy / maxDistance
        );


        knob.style.transform =
            `translate(
                calc(-50% + ${dx}px),
                calc(-50% + ${dy}px)
            )`;

    }


    /*
    ==========================================
    KEYBOARD INPUT
    ==========================================
    */

    updateKeyboardInput() {

        let x = 0;

        let y = 0;


        if (
            this.keys["KeyA"] ||
            this.keys["ArrowLeft"]
        ) {

            x -= 1;

        }


        if (
            this.keys["KeyD"] ||
            this.keys["ArrowRight"]
        ) {

            x += 1;

        }


        if (
            this.keys["KeyW"] ||
            this.keys["ArrowUp"]
        ) {

            y -= 1;

        }


        if (
            this.keys["KeyS"] ||
            this.keys["ArrowDown"]
        ) {

            y += 1;

        }


        if (
            x !== 0 ||
            y !== 0
        ) {

            const length =
                Math.sqrt(
                    x * x +
                    y * y
                );


            this.moveInput.set(
                x / length,
                y / length
            );

        }

    }


    /*
    ==========================================
    MOVEMENT
    ==========================================
    */

    update(delta) {

        if (
            !this.player
        ) {

            return;

        }


        /*
        Keyboard input only when
        joystick isn't being used.
        */

        if (
            !this.joystickActive
        ) {

            this.updateKeyboardInput();

        }


        const inputX =
            this.moveInput.x;


        const inputZ =
            this.moveInput.y;


        const moving =
            Math.abs(inputX) > 0.01 ||
            Math.abs(inputZ) > 0.01;


        if (moving) {

            /*
            Camera-relative movement
            */

            const cameraDirection =
                new THREE.Vector3();


            this.camera.getWorldDirection(
                cameraDirection
            );


            cameraDirection.y = 0;

            cameraDirection.normalize();


            const right =
                new THREE.Vector3(
                    cameraDirection.z,
                    0,
                    -cameraDirection.x
                );


            const direction =
                new THREE.Vector3();


            direction
                .addScaledVector(
                    right,
                    inputX
                );


            direction
                .addScaledVector(
                    cameraDirection,
                    -inputZ
                );


            direction.normalize();


            /*
            Speed
            */

            const running =
                this.keys["ShiftLeft"] ||
                this.keys["ShiftRight"];


            const speed =
                running
                    ? this.runSpeed
                    : this.speed;


            /*
            Movement
            */

            this.player.position.addScaledVector(
                direction,
                speed * delta
            );


            /*
            Rotate character
            */

            const targetRotation =
                Math.atan2(
                    direction.x,
                    direction.z
                );


            this.player.rotation.y =
                THREE.MathUtils.lerp(
                    this.player.rotation.y,
                    targetRotation,
                    Math.min(
                        1,
                        delta * 10
                    )
                );

        }


        /*
        Station boundaries
        */

        this.player.position.x =
            THREE.MathUtils.clamp(
                this.player.position.x,
                -15,
                15
            );


        this.player.position.z =
            THREE.MathUtils.clamp(
                this.player.position.z,
                -15,
                15
            );


        /*
        Camera
        */

        this.updateCamera(
            delta
        );

    }


    /*
    ==========================================
    THIRD-PERSON CAMERA
    ==========================================
    */

    updateCamera(delta) {

        const target =
            new THREE.Vector3(
                this.player.position.x,
                this.player.position.y +
                1.4,
                this.player.position.z
            );


        const desired =
            new THREE.Vector3(
                this.player.position.x,
                this.player.position.y +
                this.cameraHeight,
                this.player.position.z +
                this.cameraDistance
            );


        this.camera.position.lerp(
            desired,
            Math.min(
                1,
                delta * 5
            )
        );


        this.camera.lookAt(
            target
        );

    }


    /*
    ==========================================
    GET PLAYER
    ==========================================
    */

    getObject() {

        return this.player;

    }


    /*
    ==========================================
    GET POSITION
    ==========================================
    */

    getPosition() {

        return this.player.position;

    }

}


export default PlayerController;
