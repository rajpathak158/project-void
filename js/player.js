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
        ==========================================
        PLAYER IDENTITY
        ==========================================
        */

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
        ==========================================
        MOVEMENT
        ==========================================
        */

        this.speed = 4;

        this.runSpeed = 6.5;

        this.moveInput =
            new THREE.Vector2();

        this.keys = {};

        this.joystickActive =
            false;

        this.joystickTouchId =
            null;


        /*
        ==========================================
        CAMERA
        ==========================================
        */

        this.cameraDistance = 6.5;

        this.cameraHeight = 2.5;

        this.cameraYaw = 0;

        this.cameraPitch = 0.2;

        this.cameraMinPitch = -0.45;

        this.cameraMaxPitch = 0.85;

        this.cameraSensitivity = 0.008;


        /*
        ==========================================
        CAMERA TOUCH
        ==========================================
        */

        this.cameraTouchId =
            null;

        this.cameraTouchActive =
            false;

        this.lastCameraX = 0;

        this.lastCameraY = 0;


        /*
        ==========================================
        CREATE PLAYER
        ==========================================
        */

        this.createPlayer();


        /*
        ==========================================
        INPUT
        ==========================================
        */

        this.setupKeyboard();

        this.setupJoystick();

        this.setupCameraTouch();

        this.setupMouseCamera();


        /*
        ==========================================
        NAME SCREEN
        ==========================================
        */

        this.createNameScreen();

    }


    /*
    ==========================================
    PLAYER ID
    ==========================================
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
    ==========================================
    PLAYER COLOR
    ==========================================
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
    ==========================================
    PLAYER
    ==========================================
    */

    createPlayer() {

        this.player =
            new THREE.Group();


        /*
        ==========================================
        BODY
        ==========================================
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

                    color:
                        this.playerColor,

                    roughness: 0.5

                })

            );


        body.position.y =
            1.05;


        body.castShadow =
            true;


        this.player.add(
            body
        );


        /*
        ==========================================
        HEAD
        ==========================================
        */

        const head =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    0.48,
                    24,
                    24
                ),

                new THREE.MeshStandardMaterial({

                    color:
                        this.playerColor,

                    roughness: 0.45

                })

            );


        head.position.y =
            2;


        head.castShadow =
            true;


        this.player.add(
            head
        );


        /*
        ==========================================
        VISOR
        ==========================================
        */

        const visor =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    0.28,
                    20,
                    20
                ),

                new THREE.MeshStandardMaterial({

                    color:
                        0x8be9ff,

                    metalness:
                        0.8,

                    roughness:
                        0.15,

                    emissive:
                        0x123c55,

                    emissiveIntensity:
                        0.5

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


        this.player.add(
            visor
        );


        /*
        ==========================================
        BACKPACK
        ==========================================
        */

        const backpack =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    0.65,
                    0.9,
                    0.3
                ),

                new THREE.MeshStandardMaterial({

                    color:
                        0x20263a,

                    roughness:
                        0.7

                })

            );


        backpack.position.set(
            0,
            1.05,
            0.48
        );


        backpack.castShadow =
            true;


        this.player.add(
            backpack
        );


        /*
        ==========================================
        START POSITION
        ==========================================
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
    NAME SCREEN
    ==========================================
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

                <div id="void-name-small">
                    PROJECT: VOID
                </div>

                <div id="void-name-title">
                    ENTER YOUR NAME
                </div>

                <div id="void-name-subtitle">
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

                <button
                    id="void-name-button"
                >
                    ENTER STATION
                </button>

                <div id="void-player-id">
                    ID: ${this.playerId}
                </div>

            </div>

        `;


        /*
        ==========================================
        STYLE
        ==========================================
        */

        const style =
            document.createElement(
                "style"
            );


        style.textContent = `

            #void-name-screen {

                position: fixed;

                inset: 0;

                z-index: 99999;

                display: flex;

                align-items: center;

                justify-content: center;

                background:
                    radial-gradient(
                        circle at center,
                        rgba(30,40,90,0.35),
                        rgba(2,3,8,0.97)
                    );

                font-family:
                    Arial,
                    Helvetica,
                    sans-serif;

                color: white;

            }


            #void-name-box {

                width:
                    min(520px, 86vw);

                padding:
                    42px 34px;

                border:
                    1px solid
                    rgba(100,130,255,0.45);

                border-radius:
                    24px;

                background:
                    rgba(12,15,29,0.96);

                box-shadow:
                    0 25px 80px
                    rgba(0,0,0,0.7);

                text-align:
                    center;

                backdrop-filter:
                    blur(18px);

            }


            #void-name-small {

                font-size:
                    14px;

                letter-spacing:
                    6px;

                color:
                    #8994b8;

                margin-bottom:
                    18px;

            }


            #void-name-title {

                font-size:
                    32px;

                font-weight:
                    800;

                letter-spacing:
                    2px;

                margin-bottom:
                    12px;

            }


            #void-name-subtitle {

                color:
                    #858ba3;

                font-size:
                    14px;

                line-height:
                    1.5;

                margin-bottom:
                    28px;

            }


            #void-name-input {

                width:
                    100%;

                height:
                    58px;

                padding:
                    0 18px;

                box-sizing:
                    border-box;

                border:
                    1px solid
                    rgba(120,140,255,0.35);

                border-radius:
                    14px;

                outline:
                    none;

                background:
                    rgba(255,255,255,0.06);

                color:
                    white;

                font-size:
                    17px;

                text-align:
                    center;

                margin-bottom:
                    14px;

            }


            #void-name-input:focus {

                border-color:
                    #4778ff;

                box-shadow:
                    0 0 20px
                    rgba(71,120,255,0.25);

            }


            #void-name-button {

                width:
                    100%;

                height:
                    58px;

                border:
                    none;

                border-radius:
                    14px;

                background:
                    #3d6dff;

                color:
                    white;

                font-size:
                    15px;

                font-weight:
                    800;

                letter-spacing:
                    1.5px;

                cursor:
                    pointer;

            }


            #void-name-button:active {

                transform:
                    scale(0.98);

            }


            #void-player-id {

                margin-top:
                    22px;

                color:
                    #505772;

                font-size:
                    10px;

                letter-spacing:
                    1px;

            }

        `;


        document.head.appendChild(
            style
        );


        document.body.appendChild(
            this.nameScreen
        );


        /*
        ==========================================
        ELEMENTS
        ==========================================
        */

        const input =
            this.nameScreen.querySelector(
                "#void-name-input"
            );


        const button =
            this.nameScreen.querySelector(
                "#void-name-button"
            );


        /*
        ==========================================
        EXISTING NAME
        ==========================================
        */

        if (
            this.playerName
        ) {

            input.value =
                this.playerName;

        }


        /*
        ==========================================
        ENTER BUTTON
        ==========================================
        */

        button.addEventListener(
            "click",
            () => {

                this.confirmName();

            }
        );


        /*
        ==========================================
        ENTER KEY
        ==========================================
        */

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


        /*
        ==========================================
        FOCUS
        ==========================================
        */

        setTimeout(
            () => {

                input.focus();

            },
            100
        );

    }


    /*
    ==========================================
    CONFIRM NAME
    ==========================================
    */

    confirmName() {

        const input =
            this.nameScreen.querySelector(
                "#void-name-input"
            );


        let name =
            input.value.trim();


        if (
            !name
        ) {

            name =
                "Player";

        }


        /*
        Limit name
        */

        name =
            name.substring(
                0,
                16
            );


        this.playerName =
            name;


        localStorage.setItem(
            "void_player_name",
            this.playerName
        );


        this.ready =
            true;


        /*
        ==========================================
        REMOVE SCREEN
        ==========================================
        */

        this.nameScreen.style.opacity =
            "0";


        this.nameScreen.style.transition =
            "opacity 0.35s ease";


        setTimeout(
            () => {

                if (
                    this.nameScreen &&
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


        /*
        ==========================================
        NAME TAG
        ==========================================
        */

        this.createNameTag();


        console.log(
            "PLAYER READY:",
            this.playerName
        );


        console.log(
            "PLAYER ID:",
            this.playerId
        );

    }


    /*
    ==========================================
    NAME TAG
    ==========================================
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


        const context =
            canvas.getContext(
                "2d"
            );


        context.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        context.font =
            "bold 46px Arial";


        context.textAlign =
            "center";


        context.textBaseline =
            "middle";


        context.fillStyle =
            "#ffffff";


        context.shadowColor =
            "rgba(0,0,0,0.8)";


        context.shadowBlur =
            8;


        context.fillText(
            this.playerName,
            256,
            64
        );


        const texture =
            new THREE.CanvasTexture(
                canvas
            );


        texture.needsUpdate =
            true;


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


        this.nameTag.position.set(
            0,
            2.8,
            0
        );


        this.player.add(
            this.nameTag
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
    JOYSTICK
    ==========================================
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

        const maxDistance = 42;


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


        const stopJoystick =
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
            stopJoystick
        );


        joystick.addEventListener(
            "touchcancel",
            stopJoystick
        );

    }


    /*
    ==========================================
    JOYSTICK CALCULATION
    ==========================================
    */

    updateJoystick(
        x,
        y,
        centerX,
        centerY,
        maxDistance,
        knob
    ) {

        let dx =
            x -
            centerX;


        let dy =
            y -
            centerY;


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


        /*
        ==========================================
        JOYSTICK AXIS
        ==========================================

        RIGHT = positive X
        LEFT  = negative X

        UP    = negative Y
        DOWN  = positive Y
        */

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
    CAMERA TOUCH
    ==========================================
    */

    setupCameraTouch() {

        const canvas =
            document.querySelector(
                "canvas"
            );


        if (
            !canvas
        ) {

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


        const stopCamera =
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
            stopCamera
        );


        canvas.addEventListener(
            "touchcancel",
            stopCamera
        );

    }


    /*
    ==========================================
    MOUSE CAMERA
    ==========================================
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

                if (
                    !dragging
                ) {

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
    KEYBOARD MOVEMENT
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


        /*
        IMPORTANT:
        Always reset keyboard input.

        This prevents the player from
        continuing to move after releasing
        a key.
        */

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

        } else {

            this.moveInput.set(
                0,
                0
            );

        }

    }


    /*
    ==========================================
    UPDATE
    ==========================================
    */

    update(delta) {

        if (
            !this.player
        ) {

            return;

        }


        /*
        Don't move until player
        has entered their name.
        */

        if (
            !this.ready
        ) {

            this.updateCamera(
                delta
            );

            return;

        }


        /*
        ==========================================
        KEYBOARD
        ==========================================
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


        if (
            moving
        ) {

            /*
            ======================================
            CAMERA RELATIVE MOVEMENT
            ======================================
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


            /*
            ======================================
            LEFT / RIGHT
            ======================================

            Positive joystick X =
            joystick moved RIGHT.

            This is the direction fix
            from our previous version.
            */

            direction.addScaledVector(
                right,
                -inputX
            );


            /*
            ======================================
            FORWARD / BACKWARD
            ======================================
            */

            direction.addScaledVector(
                forward,
                -inputZ
            );


            direction.normalize();


            /*
            ======================================
            SPEED
            ======================================
            */

            const running =
                this.keys["ShiftLeft"] ||
                this.keys["ShiftRight"];


            const speed =
                running
                    ? this.runSpeed
                    : this.speed;


            /*
            ======================================
            NEW POSITION
            ======================================
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
            ======================================
            COLLISION
            ======================================
            */

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


            /*
            ======================================
            PLAYER ROTATION
            ======================================
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
        ==========================================
        WORLD BOUNDARY
        ==========================================
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
        ==========================================
        CAMERA
        ==========================================
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
    MULTIPLAYER DATA
    ==========================================
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


    /*
    ==========================================
    PUBLIC METHODS
    ==========================================
    */

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
