import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

import world from "./world.js";


/*
==================================================
PROJECT: VOID
MAIN GAME ENGINE
==================================================
*/


/*
==================================================
ERROR HANDLER
==================================================
*/

function showError(error) {

    console.error(
        "PROJECT: VOID ERROR:",
        error
    );

    const errorScreen =
        document.getElementById("void-error");

    const errorMessage =
        document.getElementById("void-error-message");

    if (errorScreen && errorMessage) {

        errorMessage.textContent =
            error instanceof Error
                ? error.stack || error.message
                : String(error);

        errorScreen.style.display =
            "flex";

    }

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


/*
==================================================
SCENE
==================================================
*/

const scene =
    new THREE.Scene();


scene.background =
    new THREE.Color(
        0x05070d
    );


scene.fog =
    new THREE.Fog(
        0x05070d,
        35,
        110
    );


/*
==================================================
CAMERA
==================================================
*/

const camera =
    new THREE.PerspectiveCamera(

        65,

        window.innerWidth /
        window.innerHeight,

        0.1,

        300

    );


camera.position.set(
    0,
    5,
    12
);


/*
==================================================
RENDERER
==================================================
*/

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


renderer.domElement.id =
    "game-canvas";


document.body.appendChild(
    renderer.domElement
);


/*
==================================================
LIGHTING
==================================================
*/

const ambientLight =
    new THREE.HemisphereLight(

        0x8aa0ff,
        0x080a12,
        1.8

    );


scene.add(
    ambientLight
);


const mainLight =
    new THREE.DirectionalLight(

        0xffffff,
        2.2

    );


mainLight.position.set(
    15,
    25,
    10
);


mainLight.castShadow =
    true;


scene.add(
    mainLight
);


/*
==================================================
COLLISION PLACEHOLDER
==================================================
*/

const collision = {

    colliders: [],

    objects: [],

    clear() {

        this.colliders.length = 0;
        this.objects.length = 0;

    },

    reset() {

        this.colliders.length = 0;
        this.objects.length = 0;

    }

};


/*
==================================================
BUILD WORLD
==================================================
*/

let station;

try {

    station =
        world.create(
            scene,
            collision
        );

}
catch (error) {

    showError(
        "WORLD CREATION FAILED\n\n" +
        error
    );

    throw error;

}


if (!station) {

    throw new Error(
        "World failed to return station data."
    );

}


console.log(
    "================================"
);

console.log(
    "PROJECT: VOID"
);

console.log(
    "WORLD READY"
);

console.log(
    "ROOMS:",
    station.rooms
);

console.log(
    "TASKS:",
    station.tasks
);

console.log(
    "TASK COUNT:",
    station.tasks.length
);

console.log(
    "================================"
);


/*
==================================================
PLAYER
==================================================
*/

const player =
    new THREE.Group();


player.position.set(

    station.spawn?.x ?? 0,

    station.spawn?.y ?? 0,

    station.spawn?.z ?? 4

);


scene.add(
    player
);


/*
==================================================
PLAYER MATERIALS
==================================================
*/

const bodyMaterial =
    new THREE.MeshStandardMaterial({

        color:
            0x35415c,

        metalness:
            0.65,

        roughness:
            0.32

    });


const visorMaterial =
    new THREE.MeshStandardMaterial({

        color:
            0xa8f2ff,

        emissive:
            0x168cb5,

        emissiveIntensity:
            3,

        metalness:
            0.8,

        roughness:
            0.1

    });


/*
==================================================
PLAYER BODY
==================================================
*/

const body =
    new THREE.Mesh(

        new THREE.CapsuleGeometry(
            0.55,
            1.1,
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


/*
==================================================
PLAYER HEAD
==================================================
*/

const head =
    new THREE.Mesh(

        new THREE.SphereGeometry(
            0.52,
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


/*
==================================================
VISOR
==================================================
*/

const visor =
    new THREE.Mesh(

        new THREE.SphereGeometry(
            0.32,
            20,
            12
        ),

        visorMaterial

    );


visor.position.set(
    0,
    2.25,
    -0.43
);


visor.scale.set(
    1.2,
    0.65,
    0.3
);


player.add(
    visor
);


/*
==================================================
PLAYER CORE
==================================================
*/

const coreMaterial =
    new THREE.MeshStandardMaterial({

        color:
            0x3de1ff,

        emissive:
            0x00aaff,

        emissiveIntensity:
            5

    });


const playerCore =
    new THREE.Mesh(

        new THREE.SphereGeometry(
            0.13,
            12,
            12
        ),

        coreMaterial

    );


playerCore.position.set(
    0,
    1.35,
    -0.53
);


player.add(
    playerCore
);


/*
==================================================
ARMS
==================================================
*/

function createArm(x) {

    const arm =
        new THREE.Mesh(

            new THREE.CapsuleGeometry(
                0.16,
                0.7,
                6,
                10
            ),

            bodyMaterial

        );


    arm.position.set(
        x,
        1.25,
        0
    );


    arm.rotation.z =
        x > 0
            ? -0.15
            : 0.15;


    arm.castShadow =
        true;


    player.add(
        arm
    );

}


createArm(-0.7);
createArm(0.7);


/*
==================================================
LEGS
==================================================
*/

function createLeg(x) {

    const leg =
        new THREE.Mesh(

            new THREE.CapsuleGeometry(
                0.19,
                0.75,
                6,
                10
            ),

            bodyMaterial

        );


    leg.position.set(
        x,
        0.45,
        0
    );


    leg.castShadow =
        true;


    player.add(
        leg
    );

}


createLeg(-0.28);
createLeg(0.28);


/*
==================================================
KEYBOARD INPUT
==================================================
*/

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


/*
==================================================
JOYSTICK
==================================================
*/

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


let joystickId =
    null;


function updateJoystick(
    x,
    y
) {

    if (!joystick) {
        return;
    }


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


    const maxDistance =
        42;


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


    joystickX =
        dx /
        maxDistance;


    joystickY =
        dy /
        maxDistance;


    if (knob) {

        knob.style.transform =
            `translate(
                calc(-50% + ${dx}px),
                calc(-50% + ${dy}px)
            )`;

    }

}


if (joystick) {

    joystick.addEventListener(
        "touchstart",
        event => {

            event.preventDefault();

            const touch =
                event.changedTouches[0];

            joystickId =
                touch.identifier;

            joystickActive =
                true;

            updateJoystick(
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
                    touch.identifier ===
                    joystickId
                ) {

                    updateJoystick(
                        touch.clientX,
                        touch.clientY
                    );

                }

            }

        },
        {
            passive: false
        }
    );


    function stopJoystick() {

        joystickActive =
            false;

        joystickId =
            null;

        joystickX =
            0;

        joystickY =
            0;


        if (knob) {

            knob.style.transform =
                "translate(-50%, -50%)";

        }

    }


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
==================================================
CAMERA
==================================================
*/

let cameraYaw =
    0;


let cameraPitch =
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

            /*
            Left side is reserved
            for joystick.
            */

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


            cameraYaw -=
                dx * 0.008;


            cameraPitch -=
                dy * 0.006;


            cameraPitch =
                THREE.MathUtils.clamp(
                    cameraPitch,
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
    event => {

        for (
            const touch of
            event.changedTouches
        ) {

            if (
                touch.identifier ===
                cameraTouch
            ) {

                cameraTouch =
                    null;

            }

        }

    }
);


/*
==================================================
MOUSE CAMERA
==================================================
*/

let mouseDown =
    false;


let mouseX =
    0;


let mouseY =
    0;


window.addEventListener(
    "mousedown",
    event => {

        mouseDown =
            true;

        mouseX =
            event.clientX;

        mouseY =
            event.clientY;

    }
);


window.addEventListener(
    "mouseup",
    () => {

        mouseDown =
            false;

    }
);


window.addEventListener(
    "mousemove",
    event => {

        if (!mouseDown) {
            return;
        }


        const dx =
            event.clientX -
            mouseX;


        const dy =
            event.clientY -
            mouseY;


        cameraYaw -=
            dx * 0.006;


        cameraPitch -=
            dy * 0.006;


        cameraPitch =
            THREE.MathUtils.clamp(
                cameraPitch,
                -0.35,
                0.8
            );


        mouseX =
            event.clientX;

        mouseY =
            event.clientY;

    }
);


/*
==================================================
MOVEMENT
==================================================
*/

const clock =
    new THREE.Clock();


const cameraTarget =
    new THREE.Vector3();


function updateMovement(delta) {

    let moveX =
        joystickActive
            ? joystickX
            : 0;


    let moveZ =
        joystickActive
            ? joystickY
            : 0;


    if (!joystickActive) {

        if (
            keys["KeyA"] ||
            keys["ArrowLeft"]
        ) {

            moveX -= 1;

        }


        if (
            keys["KeyD"] ||
            keys["ArrowRight"]
        ) {

            moveX += 1;

        }


        if (
            keys["KeyW"] ||
            keys["ArrowUp"]
        ) {

            moveZ -= 1;

        }


        if (
            keys["KeyS"] ||
            keys["ArrowDown"]
        ) {

            moveZ += 1;

        }

    }


    const magnitude =
        Math.sqrt(
            moveX * moveX +
            moveZ * moveZ
        );


    if (
        magnitude <
        0.01
    ) {

        return false;

    }


    if (
        magnitude > 1
    ) {

        moveX /=
            magnitude;

        moveZ /=
            magnitude;

    }


    const speed =
        5;


    const sin =
        Math.sin(
            cameraYaw
        );


    const cos =
        Math.cos(
            cameraYaw
        );


    const dx =
        (-moveX * cos) +
        (-moveZ * sin);


    const dz =
        (moveX * sin) +
        (-moveZ * cos);


    player.position.x +=
        dx *
        speed *
        delta;


    player.position.z +=
        dz *
        speed *
        delta;


    /*
    WORLD BOUNDARY
    */

    player.position.x =
        THREE.MathUtils.clamp(
            player.position.x,
            -38,
            38
        );


    player.position.z =
        THREE.MathUtils.clamp(
            player.position.z,
            -38,
            38
        );


    player.rotation.y =
        Math.atan2(
            dx,
            dz
        );


    return true;

}


/*
==================================================
CAMERA UPDATE
==================================================
*/

function updateCamera(delta) {

    cameraTarget.set(

        player.position.x,

        player.position.y +
        1.5,

        player.position.z

    );


    const horizontal =
        cameraDistance *
        Math.cos(
            cameraPitch
        );


    const desiredCamera =
        new THREE.Vector3(

            player.position.x -
            Math.sin(cameraYaw) *
            horizontal,

            player.position.y +
            4 +
            cameraDistance *
            Math.sin(cameraPitch),

            player.position.z -
            Math.cos(cameraYaw) *
            horizontal

        );


    camera.position.lerp(

        desiredCamera,

        Math.min(
            1,
            delta * 7
        )

    );


    camera.lookAt(
        cameraTarget
    );

}


/*
==================================================
TASK ANIMATION
==================================================
*/

function updateTasks(time) {

    if (
        !station.tasks
    ) {

        return;

    }


    for (
        const task of
        station.tasks
    ) {

        if (!task) {
            continue;
        }


        const parent =
            task.parent;


        if (!parent) {
            continue;
        }


        const pulse =
            1 +
            Math.sin(
                time * 0.004
            ) *
            0.08;


        task.scale.set(
            pulse,
            pulse,
            pulse
        );


        task.rotation.y +=
            0.01;

    }

}


/*
==================================================
GAME LOOP
==================================================
*/

function animate() {

    requestAnimationFrame(
        animate
    );


    const delta =
        Math.min(
            clock.getDelta(),
            0.05
        );


    const time =
        performance.now();


    const moving =
        updateMovement(
            delta
        );


    /*
    PLAYER BOB
    */

    if (moving) {

        player.position.y =
            Math.sin(
                time * 0.012
            ) *
            0.025;

    }
    else {

        player.position.y =
            0;

    }


    updateCamera(
        delta
    );


    updateTasks(
        time
    );


    renderer.render(
        scene,
        camera
    );

}


/*
==================================================
RESIZE
==================================================
*/

function resize() {

    const width =
        Math.max(
            1,
            window.innerWidth
        );


    const height =
        Math.max(
            1,
            window.innerHeight
        );


    camera.aspect =
        width /
        height;


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


/*
==================================================
START GAME
==================================================
*/

resize();

animate();


/*
==================================================
REMOVE LOADING SCREEN
==================================================
*/

const loading =
    document.getElementById(
        "loading"
    );


if (loading) {

    setTimeout(
        () => {

            loading.style.opacity =
                "0";


            setTimeout(
                () => {

                    loading.remove();

                },
                450
            );

        },
        500
    );

}


/*
==================================================
FINAL STATUS
==================================================
*/

console.log(
    "================================"
);

console.log(
    "PROJECT: VOID"
);

console.log(
    "MAIN.JS CONNECTED"
);

console.log(
    "ROOMS:",
    station.rooms.length
);

console.log(
    "TASKS:",
    station.tasks.length
);

console.log(
    "GAME ENGINE STARTED"
);

console.log(
    "================================"
);
