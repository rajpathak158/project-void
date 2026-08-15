import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


import world from "./world.js?v=1";


/* ==========================================
   ERROR HANDLING
========================================== */

function showError(error) {

    console.error(
        "PROJECT VOID ERROR:",
        error
    );


    const screen =
        document.getElementById(
            "error-screen"
        );


    const message =
        document.getElementById(
            "error-message"
        );


    if (!screen || !message) {
        return;
    }


    message.textContent =
        error?.stack ||
        error?.message ||
        String(error);


    screen.style.display =
        "flex";

}


window.addEventListener(
    "error",
    event => {

        showError(
            event.error ||
            event.message
        );

    }
);


window.addEventListener(
    "unhandledrejection",
    event => {

        showError(
            event.reason
        );

    }
);


/* ==========================================
   SCENE
========================================== */

const scene =
    new THREE.Scene();


scene.background =
    new THREE.Color(
        0x04070d
    );


scene.fog =
    new THREE.Fog(
        0x04070d,
        30,
        95
    );


/* ==========================================
   CAMERA
========================================== */

const camera =
    new THREE.PerspectiveCamera(

        65,

        window.innerWidth /
        window.innerHeight,

        0.1,

        300

    );


/* ==========================================
   RENDERER
========================================== */

const renderer =
    new THREE.WebGLRenderer({

        antialias: true,

        powerPreference:
            "high-performance"

    });


renderer.setSize(
    window.innerWidth,
    window.innerHeight
);


renderer.setPixelRatio(
    Math.min(
        window.devicePixelRatio,
        1.5
    )
);


renderer.shadowMap.enabled =
    true;


renderer.shadowMap.type =
    THREE.PCFSoftShadowMap;


document.body.appendChild(
    renderer.domElement
);


/* ==========================================
   LIGHT
========================================== */

scene.add(

    new THREE.HemisphereLight(
        0x8195c8,
        0x080b12,
        1.8
    )

);


const sun =
    new THREE.DirectionalLight(
        0xffffff,
        1.8
    );


sun.position.set(
    10,
    20,
    10
);


sun.castShadow =
    true;


scene.add(
    sun
);


/* ==========================================
   WORLD
========================================== */

let station;


try {

    station =
        world.create(
            scene
        );

}
catch (error) {

    showError(error);

    throw error;

}


console.log(
    "=============================="
);

console.log(
    "PROJECT: VOID"
);

console.log(
    "ROOMS:",
    station.rooms
);

console.log(
    "TASKS:",
    station.tasks.length
);

console.log(
    "WORLD READY"
);

console.log(
    "=============================="
);


/* ==========================================
   PLAYER
========================================== */

const player =
    new THREE.Group();


player.position.set(

    station.spawn.x,
    station.spawn.y,
    station.spawn.z

);


scene.add(
    player
);


/* ==========================================
   PLAYER MATERIALS
========================================== */

const bodyMaterial =
    new THREE.MeshStandardMaterial({

        color: 0x34415c,

        roughness: 0.35,

        metalness: 0.65

    });


const visorMaterial =
    new THREE.MeshStandardMaterial({

        color: 0x8feaff,

        emissive: 0x0099cc,

        emissiveIntensity: 3,

        roughness: 0.1,

        metalness: 0.8

    });


/* BODY */

const body =
    new THREE.Mesh(

        new THREE.CapsuleGeometry(
            0.55,
            1.05,
            8,
            16
        ),

        bodyMaterial

    );


body.position.y =
    1.25;

body.castShadow =
    true;

player.add(
    body
);


/* HEAD */

const head =
    new THREE.Mesh(

        new THREE.SphereGeometry(
            0.53,
            20,
            16
        ),

        bodyMaterial

    );


head.position.y =
    2.25;

head.castShadow =
    true;

player.add(
    head
);


/* VISOR */

const visor =
    new THREE.Mesh(

        new THREE.SphereGeometry(
            0.33,
            20,
            14
        ),

        visorMaterial

    );


visor.position.set(
    0,
    2.25,
    -0.45
);


visor.scale.set(
    1.25,
    0.68,
    0.3
);


player.add(
    visor
);


/* CORE */

const core =
    new THREE.Mesh(

        new THREE.SphereGeometry(
            0.13,
            12,
            12
        ),

        new THREE.MeshStandardMaterial({

            color: 0x3de7ff,

            emissive: 0x00aaff,

            emissiveIntensity: 5

        })

    );


core.position.set(
    0,
    1.35,
    -0.54
);


player.add(
    core
);


/* ==========================================
   ARMS
========================================== */

function arm(x) {

    const mesh =
        new THREE.Mesh(

            new THREE.CapsuleGeometry(
                0.16,
                0.7,
                6,
                10
            ),

            bodyMaterial

        );


    mesh.position.set(
        x,
        1.25,
        0
    );


    mesh.rotation.z =
        x > 0
            ? -0.15
            : 0.15;


    mesh.castShadow =
        true;


    player.add(
        mesh
    );

}


arm(-0.7);
arm(0.7);


/* ==========================================
   LEGS
========================================== */

function leg(x) {

    const mesh =
        new THREE.Mesh(

            new THREE.CapsuleGeometry(
                0.19,
                0.75,
                6,
                10
            ),

            bodyMaterial

        );


    mesh.position.set(
        x,
        0.45,
        0
    );


    mesh.castShadow =
        true;


    player.add(
        mesh
    );

}


leg(-0.28);
leg(0.28);


/* ==========================================
   KEYBOARD
========================================== */

const keys = {};


window.addEventListener(
    "keydown",
    event => {

        keys[event.code] =
            true;

    }
);


window.addEventListener(
    "keyup",
    event => {

        keys[event.code] =
            false;

    }
);


/* ==========================================
   JOYSTICK
========================================== */

const joystick =
    document.getElementById(
        "joystick"
    );


const knob =
    document.getElementById(
        "joystick-knob"
    );


let joystickActive =
    false;

let joystickX =
    0;

let joystickY =
    0;

let joystickID =
    null;


function joystickMove(
    x,
    y
) {

    const rect =
        joystick.getBoundingClientRect();


    const centerX =
        rect.left +
        rect.width / 2;


    const centerY =
        rect.top +
        rect.height / 2;


    let dx =
        x - centerX;


    let dy =
        y - centerY;


    const max =
        42;


    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    if (distance > max) {

        dx =
            dx / distance * max;

        dy =
            dy / distance * max;

    }


    joystickX =
        dx / max;


    joystickY =
        dy / max;


    knob.style.transform =
        `translate(
            calc(-50% + ${dx}px),
            calc(-50% + ${dy}px)
        )`;

}


joystick.addEventListener(
    "touchstart",
    event => {

        event.preventDefault();


        const touch =
            event.changedTouches[0];


        joystickID =
            touch.identifier;


        joystickActive =
            true;


        joystickMove(
            touch.clientX,
            touch.clientY
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


        if (!joystickActive) {
            return;
        }


        for (
            const touch of
            event.changedTouches
        ) {

            if (
                touch.identifier !==
                joystickID
            ) {

                continue;

            }


            joystickMove(
                touch.clientX,
                touch.clientY
            );

        }

    },
    {
        passive: false
    }
);


function joystickStop() {

    joystickActive =
        false;


    joystickID =
        null;


    joystickX =
        0;


    joystickY =
        0;


    knob.style.transform =
        "translate(-50%, -50%)";

}


joystick.addEventListener(
    "touchend",
    joystickStop
);


joystick.addEventListener(
    "touchcancel",
    joystickStop
);


/* ==========================================
   CAMERA
========================================== */

let yaw =
    0;

let pitch =
    0.3;


const cameraDistance =
    10;


let cameraTouch =
    null;

let lastTouchX =
    0;

let lastTouchY =
    0;


renderer.domElement.addEventListener(
    "touchstart",
    event => {

        for (
            const touch of
            event.changedTouches
        ) {

            if (
                touch.clientX <
                window.innerWidth * 0.4
            ) {

                continue;

            }


            cameraTouch =
                touch.identifier;


            lastTouchX =
                touch.clientX;


            lastTouchY =
                touch.clientY;

        }

    },
    {
        passive: true
    }
);


renderer.domElement.addEventListener(
    "touchmove",
    event => {

        if (
            cameraTouch === null
        ) {

            return;

        }


        for (
            const touch of
            event.changedTouches
        ) {

            if (
                touch.identifier !==
                cameraTouch
            ) {

                continue;

            }


            const dx =
                touch.clientX -
                lastTouchX;


            const dy =
                touch.clientY -
                lastTouchY;


            yaw -=
                dx * 0.008;


            pitch -=
                dy * 0.006;


            pitch =
                THREE.MathUtils.clamp(
                    pitch,
                    -0.35,
                    0.8
                );


            lastTouchX =
                touch.clientX;


            lastTouchY =
                touch.clientY;

        }

    },
    {
        passive: true
    }
);


renderer.domElement.addEventListener(
    "touchend",
    () => {

        cameraTouch =
            null;

    }
);


/* ==========================================
   MOVEMENT
========================================== */

function movePlayer(delta) {

    let x =
        joystickActive
            ? joystickX
            : 0;


    let z =
        joystickActive
            ? joystickY
            : 0;


    if (!joystickActive) {

        if (
            keys["KeyA"] ||
            keys["ArrowLeft"]
        ) {

            x -= 1;

        }


        if (
            keys["KeyD"] ||
            keys["ArrowRight"]
        ) {

            x += 1;

        }


        if (
            keys["KeyW"] ||
            keys["ArrowUp"]
        ) {

            z -= 1;

        }


        if (
            keys["KeyS"] ||
            keys["ArrowDown"]
        ) {

            z += 1;

        }

    }


    const length =
        Math.sqrt(
            x * x +
            z * z
        );


    if (length < 0.01) {
        return false;
    }


    if (length > 1) {

        x /= length;
        z /= length;

    }


    const speed =
        5;


    const sin =
        Math.sin(yaw);


    const cos =
        Math.cos(yaw);


    const dx =
        (-x * cos) +
        (-z * sin);


    const dz =
        (x * sin) +
        (-z * cos);


    player.position.x +=
        dx *
        speed *
        delta;


    player.position.z +=
        dz *
        speed *
        delta;


    /* WORLD LIMIT */

    player.position.x =
        THREE.MathUtils.clamp(
            player.position.x,
            -40,
            40
        );


    player.position.z =
        THREE.MathUtils.clamp(
            player.position.z,
            -40,
            40
        );


    player.rotation.y =
        Math.atan2(
            dx,
            dz
        );


    return true;

}


/* ==========================================
   LOCATION DETECTION
========================================== */

function updateLocation() {

    const x =
        player.position.x;


    const z =
        player.position.z;


    let location =
        "CENTRAL HUB";


    if (
        z < -10
    ) {

        location =
            "COMMAND";

    }
    else if (
        z > 10
    ) {

        location =
            "ENGINEERING";

    }
    else if (
        x < -13
    ) {

        location =
            "MEDICAL";

    }
    else if (
        x > 13
    ) {

        location =
            "REACTOR";

    }


    document.getElementById(
        "location"
    ).textContent =
        location;

}


/* ==========================================
   TASK DETECTION
========================================== */

function updateTasks() {

    let nearby =
        null;


    for (
        const task of
        station.tasks
    ) {

        if (
            task.userData.completed
        ) {

            continue;

        }


        const distance =
            player.position.distanceTo(
                task.getWorldPosition(
                    new THREE.Vector3()
                )
            );


        if (
            distance < 2.2
        ) {

            nearby =
                task;

            break;

        }

    }


    const interaction =
        document.getElementById(
            "interaction"
        );


    if (nearby) {

        interaction.textContent =
            "TASK: " +
            nearby.userData.label;


        interaction.classList.add(
            "visible"
        );

    }
    else {

        interaction.classList.remove(
            "visible"
        );

    }

}


/* ==========================================
   CAMERA UPDATE
========================================== */

function updateCamera(delta) {

    const horizontal =
        cameraDistance *
        Math.cos(pitch);


    const target =
        new THREE.Vector3(

            player.position.x,

            player.position.y + 1.5,

            player.position.z

        );


    const desired =
        new THREE.Vector3(

            player.position.x -
            Math.sin(yaw) *
            horizontal,

            player.position.y +
            4 +
            cameraDistance *
            Math.sin(pitch),

            player.position.z -
            Math.cos(yaw) *
            horizontal

        );


    camera.position.lerp(
        desired,
        Math.min(
            1,
            delta * 7
        )
    );


    camera.lookAt(
        target
    );

}


/* ==========================================
   GAME LOOP
========================================== */

const clock =
    new THREE.Clock();


function animate() {

    requestAnimationFrame(
        animate
    );


    const delta =
        Math.min(
            clock.getDelta(),
            0.05
        );


    const moving =
        movePlayer(
            delta
        );


    if (moving) {

        player.position.y =
            Math.sin(
                performance.now() * 0.012
            ) * 0.025;

    }
    else {

        player.position.y =
            0;

    }


    updateLocation();

    updateTasks();

    updateCamera(
        delta
    );


    renderer.render(
        scene,
        camera
    );

}


animate();


/* ==========================================
   RESIZE
========================================== */

function resize() {

    const width =
        Math.max(
            window.innerWidth,
            1
        );


    const height =
        Math.max(
            window.innerHeight,
            1
        );


    camera.aspect =
        width / height;


    camera.updateProjectionMatrix();


    renderer.setSize(
        width,
        height
    );


    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            1.5
        )
    );

}


window.addEventListener(
    "resize",
    resize
);


window.addEventListener(
    "orientationchange",
    () => {

        setTimeout(
            resize,
            150
        );

    }
);


resize();


/* ==========================================
   LOADING COMPLETE
========================================== */

setTimeout(
    () => {

        const loading =
            document.getElementById(
                "loading"
            );


        if (!loading) {
            return;
        }


        loading.style.opacity =
            "0";


        setTimeout(
            () => {

                loading.remove();

            },
            500
        );

    },
    700
);


console.log(
    "PROJECT: VOID GAME STARTED"
);
