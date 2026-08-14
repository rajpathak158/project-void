import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


class PlayerController {

    constructor(
        scene,
        camera,
        collisionSystem
    ) {

        this.scene = scene;
        this.camera = camera;
        this.collision = collisionSystem;

        this.player = null;

        /*
        Movement
        */

        this.speed = 4;
        this.runSpeed = 6.5;

        this.moveInput =
            new THREE.Vector2();

        this.keys = {};

        this.joystickActive = false;

        this.joystickStart =
            new THREE.Vector2();


        /*
        Camera
        */

        this.cameraDistance = 7;

        this.cameraHeight = 3.2;

        this.cameraYaw = 0;

        this.cameraPitch = 0.15;

        this.cameraMinPitch = -0.35;

        this.cameraMaxPitch = 0.8;

        this.cameraSensitivity = 0.006;


        /*
        Camera touch
        */

        this.cameraTouchActive = false;

        this.cameraTouchId = null;

        this.cameraTouchX = 0;

        this.cameraTouchY = 0;


        /*
        Create everything
        */

        this.createPlayer();

        this.setupKeyboard();

        this.setupMovementJoystick();

        this.setupCameraTouch();

        this.setupMouseCamera();

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
        BODY
        */

        const body =
            new THREE.Mesh(
                new THREE.CapsuleGeometry(
                    0.45,
                    0.8,
                    8,
                    16
                ),
                new THREE.MeshStandardMaterial({
                    color: 0x3d6dff,
                    roughness: 0.5
                })
            );


        body.position.y = 1.05;

        body.castShadow = true;

        this.player.add(body);


        /*
        HEAD
        */

        const head =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    0.48,
                    24,
                    24
                ),
                new THREE.MeshStandardMaterial({
                    color: 0x4778ff,
                    roughness: 0.45
                })
            );


        head.position.y = 2;

        head.castShadow = true;

        this.player.add(head);


        /*
        VISOR
        */

        const visor =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    0.28,
                    20,
                    20
                ),
                new THREE.MeshStandardMaterial({
                    color: 0x8be9ff,
                    metalness: 0.8,
                    roughness: 0.15,
                    emissive: 0x123c55,
                    emissiveIntensity: 0.5
                })
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


        this.player.add(visor);


        /*
        BACKPACK
        */

        const backpack =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.65,
                    0.9,
                    0.3
                ),
                new THREE.MeshStandardMaterial({
                    color: 0x20263a,
                    roughness: 0.7
                })
            );


        backpack.position.set(
            0,
            1.05,
            0.48
        );


        backpack.castShadow = true;

        this.player.add(backpack);


        /*
        START POSITION
        */

        this.player.position.set(
            0,
            0,
            0
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

                this.keys[event.code] = true;

            }
        );


        window.addEventListener(
            "keyup",
            event => {

                this.keys[event.code] = false;

            }
        );

    }


    /*
    ==========================================
    MOVEMENT JOYSTICK
    ==========================================
    */

    setupMovementJoystick() {

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
                    event.changedTouches[0];


                const rect =
                    joystick.getBoundingClientRect();


                this.joystickStart.set(
                    rect.left +
                    rect.width / 2,

                    rect.top +
                    rect.height / 2
                );


                this.joystickActive = true;


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
                    event.changedTouches[0];


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


                this.joystickActive = false;


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
    360 CAMERA TOUCH
    ==========================================
    */

    setupCameraTouch() {

        const canvas =
            document.querySelector(
                "canvas"
            );


        if (!canvas) {

            return;

        }


        canvas.addEventListener(
            "touchstart",
            event => {

                for (
                    const touch of
                    event.changedTouches
                ) {

                    /*
                    Ignore touches
                    on the joystick.
                    */

                    const target =
                        document.elementFromPoint(
                            touch.clientX,
                            touch.clientY
                        );


                    if (
                        target &&
                        (
                            target.id ===
                            "joystick" ||
                            target.closest(
                                "#joystick"
                            )
                        )
                    ) {

                        continue;

                    }


                    this.cameraTouchActive =
                        true;

                    this.cameraTouchId =
                        touch.identifier;

                    this.cameraTouchX =
                        touch.clientX;

                    this.cameraTouchY =
                        touch.clientY;

                    break;

                }

            },
            {
                passive: true
            }
        );


        canvas.addEventListener(
            "touchmove",
            event => {

                if (
                    !this.cameraTouchActive
                ) {

                    return;

                }


                for (
                    const touch of
                    event.changedTouches
                ) {

                    if (
                        touch.identifier !==
                        this.cameraTouchId
                    ) {

                        continue;

                    }


                    const dx =
                        touch.clientX -
                        this.cameraTouchX;


                    const dy =
                        touch.clientY -
                        this.cameraTouchY;


                    this.cameraYaw -=
                        dx *
                        this.cameraSensitivity;


                    this.cameraPitch -=
                        dy *
                        this.cameraSensitivity;


                    this.cameraPitch =
                        THREE.MathUtils.clamp(
                            this.cameraPitch,
                            this.cameraMinPitch,
                            this.cameraMaxPitch
                        );


                    this.cameraTouchX =
                        touch.clientX;


                    this.cameraTouchY =
                        touch.clientY;

                }

            },
            {
                passive: true
            }
        );


        canvas.addEventListener(
            "touchend",
            event => {

                for (
                    const touch of
                    event.changedTouches
                ) {

                    if (
                        touch.identifier ===
                        this.cameraTouchId
                    ) {

                        this.cameraTouchActive =
                            false;

                        this.cameraTouchId =
                            null;

                    }

                }

            },
            {
                passive: true
            }
        );


        canvas.addEventListener(
            "touchcancel",
            () => {

                this.cameraTouchActive =
                    false;

                this.cameraTouchId =
                    null;

            }
        );

    }


    /*
    ==========================================
    MOUSE CAMERA
    ==========================================
    */

    setupMouseCamera() {

        let dragging = false;

        let lastX = 0;

        let lastY = 0;


        window.addEventListener(
            "mousedown",
            event => {

                dragging = true;

                lastX = event.clientX;

                lastY = event.clientY;

            }
        );


        window.addEventListener(
            "mouseup",
            () => {

                dragging = false;

            }
        );


        window.addEventListener(
            "mousemove",
            event => {

                if (!dragging) {

                    return;

                }


                const dx =
                    event.clientX -
                    lastX;


                const dy =
                    event.clientY -
                    lastY;


                this.cameraYaw -=
                    dx * 0.006;


                this.cameraPitch -=
                    dy * 0.006;


                this.cameraPitch =
                    THREE.MathUtils.clamp(
                        this.cameraPitch,
                        this.cameraMinPitch,
                        this.cameraMaxPitch
                    );


                lastX =
                    event.clientX;


                lastY =
                    event.clientY;

            }
        );

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
    UPDATE
    ==========================================
    */

    update(delta) {

        if (!this.player) {

            return;

        }


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

            const forward =
                new THREE.Vector3(
                    Math.sin(
                        this.cameraYaw
                    ),
                    0,
                    Math.cos(
                        this.cameraYaw
                    )
                );


            const right =
                new THREE.Vector3(
                    Math.cos(
                        this.cameraYaw
                    ),
                    0,
                    -Math.sin(
                        this.cameraYaw
                    )
                );


            const direction =
                new THREE.Vector3();


            direction.addScaledVector(
                right,
                inputX
            );


            direction.addScaledVector(
                forward,
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
            New position
            */

            const newX =
                this.player.position.x +
                direction.x *
                speed *
                delta;


            const newZ =
                this.player.position.z +
                direction.z *
                speed *
                delta;


            /*
            Collision
            */

            if (
                this.collision
            ) {

                this.collision.movePlayer(
                    this.player,
                    newX,
                    newZ
                );

            } else {

                this.player.position.x =
                    newX;

                this.player.position.z =
                    newZ;

            }


            /*
            Character rotation
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
        Station boundary
        */

        this.player.position.x =
            THREE.MathUtils.clamp(
                this.player.position.x,
                -15.2,
                15.2
            );


        this.player.position.z =
            THREE.MathUtils.clamp(
                this.player.position.z,
                -15.2,
                15.2
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
    CAMERA UPDATE
    ==========================================
    */

    updateCamera(delta) {

        const target =
            new THREE.Vector3(
                this.player.position.x,
                this.player.position.y + 1.35,
                this.player.position.z
            );


        /*
        Spherical camera position
        */

        const horizontalDistance =
            this.cameraDistance *
            Math.cos(
                this.cameraPitch
            );


        const verticalDistance =
            this.cameraDistance *
            Math.sin(
                this.cameraPitch
            );


        const desired =
            new THREE.Vector3();


        desired.x =
            this.player.position.x -
            Math.sin(
                this.cameraYaw
            ) *
            horizontalDistance;


        desired.z =
            this.player.position.z -
            Math.cos(
                this.cameraYaw
            ) *
            horizontalDistance;


        desired.y =
            this.player.position.y +
            this.cameraHeight +
            verticalDistance;


        /*
        Smooth camera
        */

        this.camera.position.lerp(
            desired,
            Math.min(
                1,
                delta * 8
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
