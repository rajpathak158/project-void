import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


class PlayerController {

    constructor(scene, camera, collisionSystem) {

        this.scene = scene;
        this.camera = camera;
        this.collision = collisionSystem;

        this.player = new THREE.Group();

        this.playerId =
            "VOID-" +
            Date.now().toString(36).toUpperCase();

        this.playerName =
            localStorage.getItem("void_player_name") || "";

        this.playerColor = 0x3d6dff;

        this.ready = false;

        /* MOVEMENT */

        this.speed = 4;
        this.runSpeed = 6.5;

        this.moveInput = new THREE.Vector2();

        this.keys = {};

        this.joystickActive = false;
        this.joystickTouchId = null;

        /* CAMERA */

        this.cameraDistance = 6.5;
        this.cameraHeight = 2.5;

        this.cameraYaw = 0;
        this.cameraPitch = 0.2;

        this.cameraMinPitch = -0.45;
        this.cameraMaxPitch = 0.85;

        /* CAMERA TOUCH */

        this.cameraTouchId = null;
        this.cameraTouchActive = false;

        this.lastCameraX = 0;
        this.lastCameraY = 0;

        /* ANIMATION */

        this.walkTime = 0;

        this.parts = {};

        this.createPlayer();

        this.setupKeyboard();
        this.setupJoystick();
        this.setupCameraTouch();
        this.setupMouseCamera();

        this.createNameScreen();
    }


    /* =====================================
       MATERIAL
    ===================================== */

    material(color, emissive = 0x000000) {

        return new THREE.MeshStandardMaterial({

            color: color,

            emissive: emissive,

            emissiveIntensity:
                emissive ? 1.8 : 0,

            roughness: 0.5,

            metalness: 0.35

        });

    }


    /* =====================================
       PLAYER
    ===================================== */

    createPlayer() {

        const armor =
            this.material(0x202532);

        const dark =
            this.material(0x0b0e15);

        const joint =
            this.material(0x05070b);

        const blue =
            this.material(
                0x42dfff,
                0x087caa
            );

        /* BODY */

        const body =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.9,
                    0.95,
                    0.5
                ),
                armor
            );

        body.position.y = 1.15;

        body.castShadow = true;

        this.player.add(body);


        /* CHEST */

        const chest =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.72,
                    0.55,
                    0.12
                ),
                dark
            );

        chest.position.set(
            0,
            1.3,
            -0.3
        );

        this.player.add(chest);


        /* CORE */

        const core =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    0.11,
                    12,
                    12
                ),
                blue
            );

        core.position.set(
            0,
            1.35,
            -0.38
        );

        this.player.add(core);


        /* NECK */

        const neck =
            new THREE.Mesh(
                new THREE.CylinderGeometry(
                    0.18,
                    0.2,
                    0.22,
                    12
                ),
                joint
            );

        neck.position.y = 1.72;

        this.player.add(neck);


        /* HELMET */

        const helmet =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    0.5,
                    16,
                    12
                ),
                dark
            );

        helmet.position.y = 2.08;

        helmet.scale.set(
            1,
            1.05,
            0.95
        );

        helmet.castShadow = true;

        this.player.add(helmet);


        /* VISOR */

        const visor =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.58,
                    0.25,
                    0.12
                ),
                blue
            );

        visor.position.set(
            0,
            2.08,
            -0.43
        );

        this.player.add(visor);


        /* ARMS */

        this.parts.leftArm =
            this.createArm(
                -0.62,
                armor,
                dark,
                joint
            );

        this.parts.rightArm =
            this.createArm(
                0.62,
                armor,
                dark,
                joint
            );


        /* LEGS */

        this.parts.leftLeg =
            this.createLeg(
                -0.25,
                armor,
                dark,
                joint
            );

        this.parts.rightLeg =
            this.createLeg(
                0.25,
                armor,
                dark,
                joint
            );


        /* BACK */

        const backpack =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.7,
                    0.9,
                    0.3
                ),
                dark
            );

        backpack.position.set(
            0,
            1.2,
            0.42
        );

        this.player.add(backpack);


        /* START */

        this.player.position.set(
            0,
            0,
            0
        );

        this.scene.add(this.player);
    }


    /* =====================================
       ARM
    ===================================== */

    createArm(x, armor, dark, joint) {

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
                    0.23,
                    12,
                    12
                ),
                armor
            );

        arm.add(shoulder);


        const upper =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.32,
                    0.5,
                    0.32
                ),
                armor
            );

        upper.position.y = -0.3;

        arm.add(upper);


        const elbow =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    0.15,
                    10,
                    10
                ),
                joint
            );

        elbow.position.y = -0.58;

        arm.add(elbow);


        const forearm =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.3,
                    0.45,
                    0.3
                ),
                dark
            );

        forearm.position.y = -0.83;

        arm.add(forearm);


        const hand =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    0.16,
                    10,
                    10
                ),
                joint
            );

        hand.position.y = -1.1;

        arm.add(hand);


        this.player.add(arm);

        return arm;
    }


    /* =====================================
       LEG
    ===================================== */

    createLeg(x, armor, dark, joint) {

        const leg =
            new THREE.Group();

        leg.position.set(
            x,
            0.62,
            0
        );


        const thigh =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.36,
                    0.5,
                    0.36
                ),
                armor
            );

        thigh.position.y = -0.27;

        leg.add(thigh);


        const knee =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    0.17,
                    10,
                    10
                ),
                joint
            );

        knee.position.y = -0.55;

        leg.add(knee);


        const shin =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.32,
                    0.5,
                    0.32
                ),
                dark
            );

        shin.position.y = -0.83;

        leg.add(shin);


        const boot =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.35,
                    0.2,
                    0.48
                ),
                joint
            );

        boot.position.set(
            0,
            -1.12,
            -0.08
        );

        leg.add(boot);


        this.player.add(leg);

        return leg;
    }


    /* =====================================
       NAME SCREEN
    ===================================== */

    createNameScreen() {

        this.nameScreen =
            document.createElement("div");

        this.nameScreen.id =
            "void-name-screen";

        this.nameScreen.style.cssText = `
            position:fixed;
            inset:0;
            z-index:99999;
            display:flex;
            align-items:center;
            justify-content:center;
            background:rgba(3,5,12,0.97);
            color:white;
            font-family:Arial,sans-serif;
        `;

        this.nameScreen.innerHTML = `

            <div style="
                width:min(480px,85vw);
                padding:35px;
                border-radius:20px;
                background:#0d1120;
                border:1px solid #344a8a;
                text-align:center;
            ">

                <div style="
                    font-size:13px;
                    letter-spacing:5px;
                    opacity:.6;
                    margin-bottom:18px;
                ">
                    PROJECT: VOID
                </div>

                <div style="
                    font-size:28px;
                    font-weight:800;
                    margin-bottom:12px;
                ">
                    ENTER YOUR NAME
                </div>

                <input
                    id="void-name-input"
                    maxlength="16"
                    placeholder="Player name"
                    style="
                        width:100%;
                        height:52px;
                        box-sizing:border-box;
                        border-radius:12px;
                        border:1px solid #40558f;
                        background:#151a2b;
                        color:white;
                        text-align:center;
                        font-size:16px;
                        margin-bottom:12px;
                    "
                >

                <button
                    id="void-name-button"
                    style="
                        width:100%;
                        height:52px;
                        border:0;
                        border-radius:12px;
                        background:#3d6dff;
                        color:white;
                        font-weight:800;
                        font-size:14px;
                    "
                >
                    ENTER STATION
                </button>

            </div>
        `;

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


        if (this.playerName) {
            input.value =
                this.playerName;
        }


        button.onclick =
            () => this.confirmName();


        input.onkeydown =
            event => {

                if (
                    event.key === "Enter"
                ) {

                    this.confirmName();

                }

            };
    }


    confirmName() {

        const input =
            this.nameScreen.querySelector(
                "#void-name-input"
            );

        let name =
            input.value.trim();

        if (!name) {
            name = "Player";
        }

        this.playerName =
            name.substring(0, 16);

        localStorage.setItem(
            "void_player_name",
            this.playerName
        );

        this.ready = true;

        this.nameScreen.remove();
    }


    /* =====================================
       KEYBOARD
    ===================================== */

    setupKeyboard() {

        window.addEventListener(
            "keydown",
            e => {
                this.keys[e.code] = true;
            }
        );

        window.addEventListener(
            "keyup",
            e => {
                this.keys[e.code] = false;
            }
        );
    }


    /* =====================================
       JOYSTICK
    ===================================== */

    setupJoystick() {

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


        const move = touch => {

            const rect =
                joystick.getBoundingClientRect();

            const cx =
                rect.left +
                rect.width / 2;

            const cy =
                rect.top +
                rect.height / 2;

            let dx =
                touch.clientX - cx;

            let dy =
                touch.clientY - cy;

            const max = 42;

            const length =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );

            if (length > max) {

                dx =
                    dx / length * max;

                dy =
                    dy / length * max;
            }

            this.moveInput.set(
                dx / max,
                dy / max
            );

            knob.style.transform =
                `translate(
                    calc(-50% + ${dx}px),
                    calc(-50% + ${dy}px)
                )`;
        };


        joystick.addEventListener(
            "touchstart",
            e => {

                e.preventDefault();

                const touch =
                    e.changedTouches[0];

                this.joystickActive = true;

                this.joystickTouchId =
                    touch.identifier;

                move(touch);

            },
            { passive:false }
        );


        joystick.addEventListener(
            "touchmove",
            e => {

                e.preventDefault();

                for (
                    const touch of
                    e.changedTouches
                ) {

                    if (
                        touch.identifier ===
                        this.joystickTouchId
                    ) {

                        move(touch);

                    }
                }

            },
            { passive:false }
        );


        const stop = e => {

            for (
                const touch of
                e.changedTouches
            ) {

                if (
                    touch.identifier ===
                    this.joystickTouchId
                ) {

                    this.joystickActive =
                        false;

                    this.joystickTouchId =
                        null;

                    this.moveInput.set(
                        0,
                        0
                    );

                    knob.style.transform =
                        "translate(-50%,-50%)";
                }
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


    /* =====================================
       CAMERA TOUCH
    ===================================== */

    setupCameraTouch() {

        const canvas =
            document.querySelector("canvas");

        if (!canvas) {
            return;
        }


        canvas.addEventListener(
            "touchstart",
            e => {

                for (
                    const touch of
                    e.changedTouches
                ) {

                    if (
                        touch.clientX <
                        window.innerWidth * 0.45
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
            { passive:true }
        );


        canvas.addEventListener(
            "touchmove",
            e => {

                if (
                    !this.cameraTouchActive
                ) {
                    return;
                }


                for (
                    const touch of
                    e.changedTouches
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
                        dx * 0.008;

                    this.cameraPitch -=
                        dy * 0.008;


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
            { passive:true }
        );


        canvas.addEventListener(
            "touchend",
            () => {

                this.cameraTouchActive =
                    false;

                this.cameraTouchId =
                    null;

            }
        );
    }


    /* =====================================
       MOUSE CAMERA
    ===================================== */

    setupMouseCamera() {

        let dragging = false;

        let lastX = 0;
        let lastY = 0;


        window.addEventListener(
            "mousedown",
            e => {

                dragging = true;

                lastX = e.clientX;
                lastY = e.clientY;

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
            e => {

                if (!dragging) {
                    return;
                }


                const dx =
                    e.clientX - lastX;

                const dy =
                    e.clientY - lastY;


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


                lastX = e.clientX;
                lastY = e.clientY;
            }
        );
    }


    /* =====================================
       KEYBOARD INPUT
    ===================================== */

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


        if (x || y) {

            const length =
                Math.sqrt(
                    x * x +
                    y * y
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


    /* =====================================
       UPDATE
    ===================================== */

    update(delta) {

        if (!this.player) {
            return;
        }


        if (!this.ready) {

            this.updateCamera(delta);

            return;
        }


        if (!this.joystickActive) {

            this.updateKeyboardInput();

        }


        const ix =
            this.moveInput.x;

        const iz =
            this.moveInput.y;


        const moving =
            Math.abs(ix) > 0.01 ||
            Math.abs(iz) > 0.01;


        if (moving) {

            const forward =
                new THREE.Vector3(
                    Math.sin(this.cameraYaw),
                    0,
                    Math.cos(this.cameraYaw)
                );


            const right =
                new THREE.Vector3(
                    Math.cos(this.cameraYaw),
                    0,
                    -Math.sin(this.cameraYaw)
                );


            const direction =
                new THREE.Vector3();


            direction.addScaledVector(
                right,
                ix
            );


            direction.addScaledVector(
                forward,
                -iz
            );


            direction.normalize();


            const running =
                this.keys["ShiftLeft"] ||
                this.keys["ShiftRight"];


            const speed =
                running
                    ? this.runSpeed
                    : this.speed;


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


            if (
                this.collision &&
                typeof this.collision.movePlayer ===
                "function"
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


            const rotation =
                Math.atan2(
                    direction.x,
                    direction.z
                );


            this.player.rotation.y =
                THREE.MathUtils.lerp(
                    this.player.rotation.y,
                    rotation,
                    Math.min(
                        1,
                        delta * 10
                    )
                );


            /* WALK ANIMATION */

            this.walkTime +=
                delta *
                (running ? 12 : 8);

            const swing =
                Math.sin(
                    this.walkTime
                ) *
                (running ? 0.6 : 0.4);


            this.parts.leftArm.rotation.x =
                swing;

            this.parts.rightArm.rotation.x =
                -swing;

            this.parts.leftLeg.rotation.x =
                -swing;

            this.parts.rightLeg.rotation.x =
                swing;

        } else {

            this.parts.leftArm.rotation.x =
                THREE.MathUtils.lerp(
                    this.parts.leftArm.rotation.x,
                    0,
                    delta * 8
                );

            this.parts.rightArm.rotation.x =
                THREE.MathUtils.lerp(
                    this.parts.rightArm.rotation.x,
                    0,
                    delta * 8
                );

            this.parts.leftLeg.rotation.x =
                THREE.MathUtils.lerp(
                    this.parts.leftLeg.rotation.x,
                    0,
                    delta * 8
                );

            this.parts.rightLeg.rotation.x =
                THREE.MathUtils.lerp(
                    this.parts.rightLeg.rotation.x,
                    0,
                    delta * 8
                );
        }


        this.updateCamera(delta);
    }


    /* =====================================
       CAMERA
    ===================================== */

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
            Math.cos(this.cameraPitch);


        const vertical =
            this.cameraDistance *
            Math.sin(this.cameraPitch);


        const desired =
            new THREE.Vector3(

                this.player.position.x -
                Math.sin(this.cameraYaw) *
                horizontal,

                2.5 + vertical,

                this.player.position.z -
                Math.cos(this.cameraYaw) *
                horizontal

            );


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


    /* =====================================
       NETWORK
    ===================================== */

    getNetworkState() {

        return {

            id: this.playerId,

            name: this.playerName,

            color: this.playerColor,

            x: this.player.position.x,

            y: this.player.position.y,

            z: this.player.position.z,

            rotation: this.player.rotation.y,

            ready: this.ready

        };
    }


    /* =====================================
       PUBLIC
    ===================================== */

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
