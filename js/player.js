import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


class PlayerController {

    constructor(
        scene,
        camera,
        collisionSystem
    ) {

        this.scene =
            scene;

        this.camera =
            camera;

        this.collision =
            collisionSystem;


        /*
        ==================================================
        PLAYER
        ==================================================
        */

        this.player =
            new THREE.Group();


        this.playerId =
            this.createPlayerId();


        this.playerName =
            localStorage.getItem(
                "void_player_name"
            ) || "";


        this.playerColor =
            this.createPlayerColor();


        this.ready =
            false;


        /*
        ==================================================
        MOVEMENT
        ==================================================
        */

        this.speed =
            4.5;

        this.runSpeed =
            7;


        this.moveInput =
            new THREE.Vector2();


        this.keys = {};


        this.joystickActive =
            false;

        this.joystickTouchId =
            null;


        /*
        ==================================================
        CAMERA
        ==================================================
        */

        this.cameraDistance =
            6.5;

        this.cameraHeight =
            2.5;

        this.cameraYaw =
            0;

        this.cameraPitch =
            0.2;

        this.cameraMinPitch =
            -0.45;

        this.cameraMaxPitch =
            0.85;

        this.cameraSensitivity =
            0.008;


        /*
        ==================================================
        TOUCH CAMERA
        ==================================================
        */

        this.cameraTouchId =
            null;

        this.cameraTouchActive =
            false;

        this.lastCameraX =
            0;

        this.lastCameraY =
            0;


        /*
        ==================================================
        ANIMATION
        ==================================================
        */

        this.characterParts = {};

        this.walkTime =
            0;


        /*
        ==================================================
        CREATE
        ==================================================
        */

        this.createPlayer();

        this.setupKeyboard();

        this.setupJoystick();

        this.setupCameraTouch();

        this.setupMouseCamera();

        this.createNameScreen();

    }


    /*
    ==================================================
    ID
    ==================================================
    */

    createPlayerId() {

        return (
            "VOID-" +
            Date.now().toString(36) +
            "-" +
            Math.random()
                .toString(36)
                .substring(2, 8)
        ).toUpperCase();

    }


    /*
    ==================================================
    COLOR
    ==================================================
    */

    createPlayerColor() {

        const colors = [

            0x3d6dff,
            0xff3d5a,
            0x38d9a9,
            0xffc107,
            0xb66cff,
            0xff7a3d,
            0x3ddcff,
            0xff5ac8

        ];


        return colors[
            Math.floor(
                Math.random() *
                colors.length
            )
        ];

    }


    /*
    ==================================================
    MATERIAL
    ==================================================
    */

    material(
        color,
        roughness = 0.5,
        metalness = 0.2
    ) {

        return new THREE.MeshStandardMaterial({

            color,

            roughness,

            metalness

        });

    }


    glow(
        color,
        intensity = 2
    ) {

        return new THREE.MeshStandardMaterial({

            color,

            emissive: color,

            emissiveIntensity:
                intensity,

            roughness: 0.25,

            metalness: 0.3

        });

    }


    /*
    ==================================================
    CREATE PLAYER
    ==================================================
    */

    createPlayer() {

        const armor =
            this.material(
                0x202532,
                0.38,
                0.7
            );


        const darkArmor =
            this.material(
                0x0d111a,
                0.42,
                0.8
            );


        const joint =
            this.material(
                0x080b11,
                0.65,
                0.55
            );


        const visor =
            new THREE.MeshStandardMaterial({

                color: 0x8be9ff,

                emissive: 0x168cb5,

                emissiveIntensity: 2.5,

                metalness: 0.8,

                roughness: 0.12

            });


        const accent =
            this.glow(
                this.playerColor,
                2.2
            );


        const cyan =
            this.glow(
                0x36d9ff,
                2.5
            );


        /*
        ==================================================
        TORSO
        ==================================================
        */

        const torso =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.9,
                    0.95,
                    0.5
                ),
                armor
            );


        torso.position.y =
            1.15;

        torso.castShadow =
            true;

        this.player.add(
            torso
        );


        /*
        CHEST
        */

        const chest =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.72,
                    0.55,
                    0.12
                ),
                darkArmor
            );


        chest.position.set(
            0,
            1.3,
            -0.3
        );


        this.player.add(
            chest
        );


        /*
        CORE
        */

        const core =
            new THREE.Mesh(
                new THREE.CylinderGeometry(
                    0.105,
                    0.105,
                    0.055,
                    16
                ),
                cyan
            );


        core.rotation.x =
            Math.PI / 2;


        core.position.set(
            0,
            1.35,
            -0.37
        );


        this.player.add(
            core
        );


        this.characterParts.core =
            core;


        /*
        NECK
        */

        const neck =
            new THREE.Mesh(
                new THREE.CylinderGeometry(
                    0.19,
                    0.22,
                    0.25,
                    12
                ),
                joint
            );


        neck.position.y =
            1.72;


        this.player.add(
            neck
        );


        /*
        HELMET
        */

        const helmet =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    0.5,
                    20,
                    16
                ),
                darkArmor
            );


        helmet.position.y =
            2.08;


        helmet.scale.set(
            1,
            1.05,
            0.95
        );


        this.player.add(
            helmet
        );


        /*
        VISOR
        */

        const visorMesh =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    0.34,
                    20,
                    12
                ),
                visor
            );


        visorMesh.position.set(
            0,
            2.08,
            -0.39
        );


        visorMesh.scale.set(
            1.15,
            0.65,
            0.35
        );


        this.player.add(
            visorMesh
        );


        /*
        VISOR FRAME
        */

        const frame =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.78,
                    0.08,
                    0.08
                ),
                accent
            );


        frame.position.set(
            0,
            1.91,
            -0.41
        );


        this.player.add(
            frame
        );


        /*
        ARMS
        */

        this.characterParts.leftArm =
            this.createArm(
                -0.62,
                armor,
                darkArmor,
                joint,
                accent
            );


        this.characterParts.rightArm =
            this.createArm(
                0.62,
                armor,
                darkArmor,
                joint,
                accent
            );


        /*
        LEGS
        */

        this.characterParts.leftLeg =
            this.createLeg(
                -0.25,
                armor,
                darkArmor,
                joint
            );


        this.characterParts.rightLeg =
            this.createLeg(
                0.25,
                armor,
                darkArmor,
                joint
            );


        /*
        BACKPACK
        */

        const backpack =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.7,
                    0.95,
                    0.32
                ),
                darkArmor
            );


        backpack.position.set(
            0,
            1.2,
            0.43
        );


        this.player.add(
            backpack
        );


        /*
        WAIST
        */

        const waist =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.82,
                    0.22,
                    0.48
                ),
                darkArmor
            );


        waist.position.y =
            0.68;


        this.player.add(
            waist
        );


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
    ==================================================
    ARM
    ==================================================
    */

    createArm(
        x,
        armor,
        darkArmor,
        joint,
        accent
    ) {

        const arm =
            new THREE.Group();


        arm.position.set(
            x,
            1.42,
            0
        );


        const shoulder =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    0.25,
                    12,
                    12
                ),
                armor
            );


        arm.add(
            shoulder
        );


        const upper =
            new THREE.Mesh(
                new THREE.CapsuleGeometry(
                    0.17,
                    0.4,
                    6,
                    10
                ),
                armor
            );


        upper.position.y =
            -0.28;


        arm.add(
            upper
        );


        const elbow =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    0.16,
                    10,
                    10
                ),
                joint
            );


        elbow.position.y =
            -0.55;


        arm.add(
            elbow
        );


        const forearm =
            new THREE.Mesh(
                new THREE.CapsuleGeometry(
                    0.16,
                    0.38,
                    6,
                    10
                ),
                darkArmor
            );


        forearm.position.y =
            -0.82;


        arm.add(
            forearm
        );


        const glove =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    0.17,
                    12,
                    12
                ),
                joint
            );


        glove.position.y =
            -1.08;


        arm.add(
            glove
        );


        this.player.add(
            arm
        );


        return arm;

    }


    /*
    ==================================================
    LEG
    ==================================================
    */

    createLeg(
        x,
        armor,
        darkArmor,
        joint
    ) {

        const leg =
            new THREE.Group();


        leg.position.set(
            x,
            0.62,
            0
        );


        const thigh =
            new THREE.Mesh(
                new THREE.CapsuleGeometry(
                    0.19,
                    0.42,
                    6,
                    10
                ),
                armor
            );


        thigh.position.y =
            -0.27;


        leg.add(
            thigh
        );


        const knee =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    0.18,
                    10,
                    10
                ),
                joint
            );


        knee.position.y =
            -0.55;


        leg.add(
            knee
        );


        const shin =
            new THREE.Mesh(
                new THREE.CapsuleGeometry(
                    0.17,
                    0.42,
                    6,
                    10
                ),
                darkArmor
            );


        shin.position.y =
            -0.84;


        leg.add(
            shin
        );


        const boot =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.34,
                    0.2,
                    0.48
                ),
                joint
            );


        boot.position.set(
            0,
            -1.13,
            -0.08
        );


        leg.add(
            boot
        );


        this.player.add(
            leg
        );


        return leg;

    }


    /*
    ==================================================
    KEYBOARD
    ==================================================
    */

    setupKeyboard() {

        window.addEventListener(
            "keydown",
            event => {

                this.keys[
                    event.code
                ] = true;

            }
        );


        window.addEventListener(
            "keyup",
            event => {

                this.keys[
                    event.code
                ] = false;

            }
        );

    }


    /*
    ==================================================
    JOYSTICK
    ==================================================
    */

    setupJoystick() {

        const joystick =
            document.getElementById(
                "joystick"
            );


        const knob =
            document.getElementById(
                "joystick-knob"
            );


        if (
            !joystick ||
            !knob
        ) {

            return;

        }


        let centerX = 0;
        let centerY = 0;

        const maxDistance =
            42;


        joystick.addEventListener(
            "touchstart",
            event => {

                event.preventDefault();


                const touch =
                    event.changedTouches[0];


                const rect =
                    joystick.getBoundingClientRect();


                centerX =
                    rect.left +
                    rect.width / 2;


                centerY =
                    rect.top +
                    rect.height / 2;


                this.joystickTouchId =
                    touch.identifier;


                this.joystickActive =
                    true;


                this.updateJoystick(
                    touch.clientX,
                    touch.clientY,
                    centerX,
                    centerY,
                    maxDistance,
                    knob
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


                for (
                    const touch of
                    event.changedTouches
                ) {

                    if (
                        touch.identifier !==
                        this.joystickTouchId
                    ) {

                        continue;

                    }


                    this.updateJoystick(
                        touch.clientX,
                        touch.clientY,
                        centerX,
                        centerY,
                        maxDistance,
                        knob
                    );

                }

            },
            {
                passive: false
            }
        );


        const stop =
            event => {

                for (
                    const touch of
                    event.changedTouches
                ) {

                    if (
                        touch.identifier !==
                        this.joystickTouchId
                    ) {

                        continue;

                    }


                    this.joystickActive =
                        false;


                    this.joystickTouchId =
                        null;


                    this.moveInput.set(
                        0,
                        0
                    );


                    knob.style.transform =
                        "translate(-50%, -50%)";

                }

            };


        joystick.addEventListener(
            "touchend",
            stop
        );


        joystick.addEventListener(
            "touchcancel",
            stop
        );

    }


    updateJoystick(
        x,
        y,
        centerX,
        centerY,
        maxDistance,
        knob
    ) {

        let dx =
            x - centerX;


        let dy =
            y - centerY;


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
                dx / distance *
                maxDistance;


            dy =
                dy / distance *
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
    ==================================================
    CAMERA TOUCH
    ==================================================
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

                    if (
                        touch.clientX <
                        window.innerWidth *
                        0.45
                    ) {

                        continue;

                    }


                    this.cameraTouchId =
                        touch.identifier;


                    this.cameraTouchActive =
                        true;


                    this.lastCameraX =
                        touch.clientX;


                    this.lastCameraY =
                        touch.clientY;

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
                        this.lastCameraX;


                    const dy =
                        touch.clientY -
                        this.lastCameraY;


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


                    this.lastCameraX =
                        touch.clientX;


                    this.lastCameraY =
                        touch.clientY;

                }

            },
            {
                passive: true
            }
        );


        const stop =
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

            };


        canvas.addEventListener(
            "touchend",
            stop
        );


        canvas.addEventListener(
            "touchcancel",
            stop
        );

    }


    /*
    ==================================================
    MOUSE CAMERA
    ==================================================
    */

    setupMouseCamera() {

        let dragging =
            false;


        let lastX = 0;
        let lastY = 0;


        window.addEventListener(
            "mousedown",
            event => {

                dragging =
                    true;


                lastX =
                    event.clientX;


                lastY =
                    event.clientY;

            }
        );


        window.addEventListener(
            "mouseup",
            () => {

                dragging =
                    false;

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
    ==================================================
    INPUT
    ==================================================
    */

    updateKeyboardInput() {

        let x = 0;
        let y = 0;


        if (
            this.keys["KeyA"] ||
            this.keys["ArrowLeft"]
        ) {

            x--;

        }


        if (
            this.keys["KeyD"] ||
            this.keys["ArrowRight"]
        ) {

            x++;

        }


        if (
            this.keys["KeyW"] ||
            this.keys["ArrowUp"]
        ) {

            y--;

        }


        if (
            this.keys["KeyS"] ||
            this.keys["ArrowDown"]
        ) {

            y++;

        }


        if (
            x ||
            y
        ) {

            const length =
                Math.hypot(
                    x,
                    y
                );


            this.moveInput.set(
                x / length,
                y / length
            );

        } else {

            this.moveInput.set(
                0,
                0
            );

        }

    }


    /*
    ==================================================
    ANIMATION
    ==================================================
    */

    updateAnimation(
        delta,
        moving,
        running
    ) {

        const leftArm =
            this.characterParts.leftArm;

        const rightArm =
            this.characterParts.rightArm;

        const leftLeg =
            this.characterParts.leftLeg;

        const rightLeg =
            this.characterParts.rightLeg;


        if (!leftArm) {

            return;

        }


        if (moving) {

            this.walkTime +=
                delta *
                (running ? 12 : 8);


            const swing =
                Math.sin(
                    this.walkTime
                ) *
                (running ? 0.55 : 0.35);


            leftArm.rotation.x =
                swing;

            rightArm.rotation.x =
                -swing;


            leftLeg.rotation.x =
                -swing * 0.8;

            rightLeg.rotation.x =
                swing * 0.8;

        } else {

            leftArm.rotation.x =
                THREE.MathUtils.lerp(
                    leftArm.rotation.x,
                    0,
                    delta * 8
                );


            rightArm.rotation.x =
                THREE.MathUtils.lerp(
                    rightArm.rotation.x,
                    0,
                    delta * 8
                );


            leftLeg.rotation.x =
                THREE.MathUtils.lerp(
                    leftLeg.rotation.x,
                    0,
                    delta * 8
                );


            rightLeg.rotation.x =
                THREE.MathUtils.lerp(
                    rightLeg.rotation.x,
                    0,
                    delta * 8
                );

        }


        /*
        IMPORTANT:
        Never move the entire player vertically.
        */

        this.player.position.y =
            0;

    }


    /*
    ==================================================
    UPDATE
    ==================================================
    */

    update(delta) {

        if (
            !this.player
        ) {

            return;

        }


        if (
            !this.ready
        ) {

            this.updateCamera(
                delta
            );

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


        const running =
            this.keys["ShiftLeft"] ||
            this.keys["ShiftRight"];


        if (moving) {

            /*
            ------------------------------------------
            Camera-relative movement
            ------------------------------------------
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


            if (
                direction.lengthSq() >
                0
            ) {

                direction.normalize();

            }


            const speed =
                running
                    ? this.runSpeed
                    : this.speed;


            const targetX =
                this.player.position.x +
                direction.x *
                speed *
                delta;


            const targetZ =
                this.player.position.z +
                direction.z *
                speed *
                delta;


            /*
            ------------------------------------------
            Collision
            ------------------------------------------
            */

            if (
                this.collision &&
                typeof this.collision.movePlayer ===
                "function"
            ) {

                this.collision.movePlayer(
                    this.player,
                    targetX,
                    targetZ
                );

            } else {

                this.player.position.x =
                    targetX;

                this.player.position.z =
                    targetZ;

            }


            /*
            ------------------------------------------
            Rotate character
            ------------------------------------------
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
        Animation
        */

        this.updateAnimation(
            delta,
            moving,
            running
        );


        /*
        ==================================================
        LARGE WORLD LIMIT
        ==================================================
        */

        const limit =
            57;


        this.player.position.x =
            THREE.MathUtils.clamp(
                this.player.position.x,
                -limit,
                limit
            );


        this.player.position.z =
            THREE.MathUtils.clamp(
                this.player.position.z,
                -limit,
                limit
            );


        /*
        Camera
        */

        this.updateCamera(
            delta
        );

    }


    /*
    ==================================================
    CAMERA
    ==================================================
    */

    updateCamera(delta) {

        if (!this.player) {

            return;

        }


        const target =
            new THREE.Vector3(
                this.player.position.x,
                1.35,
                this.player.position.z
            );


        const horizontal =
            this.cameraDistance *
            Math.cos(
                this.cameraPitch
            );


        const vertical =
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
            horizontal;


        desired.z =
            this.player.position.z -
            Math.cos(
                this.cameraYaw
            ) *
            horizontal;


        desired.y =
            this.player.position.y +
            this.cameraHeight +
            vertical;


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
    ==================================================
    NAME SCREEN
    ==================================================
    */

    createNameScreen() {

        this.nameScreen =
            document.createElement(
                "div"
            );


        this.nameScreen.id =
            "void-name-screen";


        this.nameScreen.innerHTML = `

            <div id="void-name-box">

                <div class="void-small">
                    PROJECT: VOID
                </div>

                <div class="void-title">
                    ENTER YOUR NAME
                </div>

                <div class="void-subtitle">
                    Your identity will be used
                    in multiplayer.
                </div>

                <input
                    id="void-name-input"
                    type="text"
                    maxlength="16"
                    autocomplete="off"
                    placeholder="Enter player name"
                >

                <button id="void-name-button">
                    ENTER STATION
                </button>

                <div class="void-id">
                    ID: ${this.playerId}
                </div>

            </div>
        `;


        const style =
            document.createElement(
                "style"
            );


        style.textContent = `

            #void-name-screen {
                position:fixed;
                inset:0;
                z-index:99999;
                display:flex;
                align-items:center;
                justify-content:center;
                background:
                    radial-gradient(
                        circle,
                        rgba(30,40,90,.35),
                        rgba(2,3,8,.97)
                    );
                color:white;
                font-family:Arial,sans-serif;
            }

            #void-name-box {
                width:min(520px,86vw);
                padding:42px 34px;
                border:1px solid
                    rgba(100,130,255,.45);
                border-radius:24px;
                background:
                    rgba(12,15,29,.96);
                box-shadow:
                    0 25px 80px
                    rgba(0,0,0,.7);
                text-align:center;
            }

            .void-small {
                color:#8994b8;
                letter-spacing:6px;
                font-size:14px;
                margin-bottom:18px;
            }

            .void-title {
                font-size:32px;
                font-weight:800;
                margin-bottom:12px;
            }

            .void-subtitle {
                color:#858ba3;
                font-size:14px;
                margin-bottom:28px;
            }

            #void-name-input {
                width:100%;
                height:58px;
                padding:0 18px;
                border:1px solid
                    rgba(120,140,255,.35);
                border-radius:14px;
                outline:none;
                background:
                    rgba(255,255,255,.06);
                color:white;
                font-size:17px;
                text-align:center;
                margin-bottom:14px;
            }

            #void-name-button {
                width:100%;
                height:58px;
                border:0;
                border-radius:14px;
                background:#3d6dff;
                color:white;
                font-size:15px;
                font-weight:800;
                cursor:pointer;
            }

            .void-id {
                margin-top:22px;
                color:#505772;
                font-size:10px;
            }

        `;


        document.head.appendChild(
            style
        );


        document.body.appendChild(
            this.nameScreen
        );


        const input =
            this.nameScreen.querySelector(
                "#void-name-input"
            );


        const button =
            this.nameScreen.querySelector(
                "#void-name-button"
            );


        if (
            this.playerName
        ) {

            input.value =
                this.playerName;

        }


        button.addEventListener(
            "click",
            () => this.confirmName()
        );


        input.addEventListener(
            "keydown",
            event => {

                if (
                    event.key ===
                    "Enter"
                ) {

                    this.confirmName();

                }

            }
        );

    }


    /*
    ==================================================
    CONFIRM NAME
    ==================================================
    */

    confirmName() {

        const input =
            this.nameScreen.querySelector(
                "#void-name-input"
            );


        let name =
            input.value.trim();


        if (!name) {

            name =
                "Player";

        }


        this.playerName =
            name.substring(
                0,
                16
            );


        localStorage.setItem(
            "void_player_name",
            this.playerName
        );


        this.ready =
            true;


        this.nameScreen.style.transition =
            "opacity .35s";


        this.nameScreen.style.opacity =
            "0";


        setTimeout(
            () => {

                if (
                    this.nameScreen.parentNode
                ) {

                    this.nameScreen.parentNode
                        .removeChild(
                            this.nameScreen
                        );

                }

            },
            350
        );


        this.createNameTag();

    }


    /*
    ==================================================
    NAME TAG
    ==================================================
    */

    createNameTag() {

        const canvas =
            document.createElement(
                "canvas"
            );


        canvas.width =
            512;

        canvas.height =
            128;


        const ctx =
            canvas.getContext(
                "2d"
            );


        ctx.font =
            "bold 46px Arial";


        ctx.textAlign =
            "center";


        ctx.textBaseline =
            "middle";


        ctx.fillStyle =
            "#ffffff";


        ctx.shadowColor =
            "#000000";


        ctx.shadowBlur =
            8;


        ctx.fillText(
            this.playerName,
            256,
            64
        );


        const texture =
            new THREE.CanvasTexture(
                canvas
            );


        const material =
            new THREE.SpriteMaterial({

                map:
                    texture,

                transparent:
                    true,

                depthTest:
                    false

            });


        this.nameTag =
            new THREE.Sprite(
                material
            );


        this.nameTag.scale.set(
            2.4,
            0.6,
            1
        );


        this.nameTag.position.y =
            2.9;


        this.player.add(
            this.nameTag
        );

    }


    /*
    ==================================================
    NETWORK
    ==================================================
    */

    getNetworkState() {

        return {

            id:
                this.playerId,

            name:
                this.playerName,

            color:
                this.playerColor,

            x:
                this.player.position.x,

            y:
                this.player.position.y,

            z:
                this.player.position.z,

            rotation:
                this.player.rotation.y,

            ready:
                this.ready

        };

    }


    getObject() {

        return this.player;

    }


    getPosition() {

        return this.player.position;

    }


    getId() {

        return this.playerId;

    }


    getName() {

        return this.playerName;

    }


    getColor() {

        return this.playerColor;

    }


    isReady() {

        return this.ready;

    }

}


export default PlayerController;
