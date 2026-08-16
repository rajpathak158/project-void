import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

import world from "./world.js";


/*
==================================================
PROJECT: VOID
MAIN GAME ENGINE
VERSION 4.0
==================================================
*/


/*
==================================================
ERROR SYSTEM
==================================================
*/

function showError(error) {

    console.error(
        "PROJECT: VOID ERROR:",
        error
    );

    const screen =
        document.getElementById("void-error");

    const message =
        document.getElementById(
            "void-error-message"
        );

    if (!screen || !message) {
        return;
    }

    message.textContent =
        error instanceof Error
            ? error.stack || error.message
            : String(error);

    screen.style.display = "flex";

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
        45,
        180
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
    4.5,
    10
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

        0x7188cc,
        0x080a12,
        1.25

    );


scene.add(
    ambientLight
);


const mainLight =
    new THREE.DirectionalLight(

        0xffffff,
        1.5

    );


mainLight.position.set(
    20,
    12,
    15
);


mainLight.castShadow =
    true;


mainLight.shadow.mapSize.width =
    1024;


mainLight.shadow.mapSize.height =
    1024;


mainLight.shadow.camera.near =
    1;


mainLight.shadow.camera.far =
    100;


scene.add(
    mainLight
);


/*
==================================================
COLLISION DATA
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
        "world.create() did not return station data."
    );

}


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

    station.spawn?.z ?? 10

);


scene.add(
    player
);


/*
==================================================
PLAYER SIZE
==================================================
*/

const PLAYER_RADIUS =
    0.65;


const PLAYER_HEIGHT =
    2.7;


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


body.userData.noCollision =
    true;


player.add(
    body
);


/*
==================================================
HEAD
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


head.userData.noCollision =
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


visor.userData.noCollision =
    true;


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


playerCore.userData.noCollision =
    true;


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


    arm.userData.noCollision =
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


    leg.userData.noCollision =
        true;


    player.add(
        leg
    );

}


createLeg(-0.28);
createLeg(0.28);


/*
==================================================
WORLD COLLIDERS
==================================================
*/

const worldColliders = [];


function buildWorldColliders() {

    worldColliders.length = 0;


    scene.updateMatrixWorld(
        true
    );


    scene.traverse(
        object => {

            if (!object.isMesh) {
                return;
            }


            if (
                object === player ||
                player.getObjectById(
                    object.id
                )
            ) {

                return;

            }


            if (
                object.userData?.noCollision ||
                object.userData?.decoration ||
                object.userData?.task
            ) {

                return;

            }


            const box =
                new THREE.Box3();


            box.setFromObject(
                object
            );


            if (box.isEmpty()) {
                return;
            }


            const size =
                new THREE.Vector3();


            box.getSize(
                size
            );


            /*
            Ignore floors.
            */

            if (
                size.y < 0.35 &&
                size.x > 5 &&
                size.z > 5
            ) {

                return;

            }


            worldColliders.push({

                box:
                    box.clone(),

                object

            });

        }
    );


    console.log(
        "SOLID COLLIDERS:",
        worldColliders.length
    );

}


buildWorldColliders();


/*
==================================================
PLAYER COLLISION
==================================================
*/

function canMoveTo(
    x,
    z
) {

    const playerBox =
        new THREE.Box3();


    playerBox.set(

        new THREE.Vector3(

            x - PLAYER_RADIUS,

            0.05,

            z - PLAYER_RADIUS

        ),

        new THREE.Vector3(

            x + PLAYER_RADIUS,

            PLAYER_HEIGHT,

            z + PLAYER_RADIUS

        )

    );


    for (
        const collider of
        worldColliders
    ) {

        if (
            playerBox.intersectsBox(
                collider.box
            )
        ) {

            return false;

        }

    }


    return true;

}


/*
==================================================
MOVEMENT
==================================================
*/

function movePlayer(
    dx,
    dz
) {

    const nextX =
        player.position.x +
        dx;


    const nextZ =
        player.position.z +
        dz;


    if (
        canMoveTo(
            nextX,
            player.position.z
        )
    ) {

        player.position.x =
            nextX;

    }


    if (
        canMoveTo(
            player.position.x,
            nextZ
        )
    ) {

        player.position.z =
            nextZ;

    }

}


/*
==================================================
WORLD BOUNDARY
==================================================
*/

const WORLD_LIMIT =
    78;


function applyWorldBoundary() {

    player.position.x =
        THREE.MathUtils.clamp(

            player.position.x,

            -WORLD_LIMIT,

            WORLD_LIMIT

        );


    player.position.z =
        THREE.MathUtils.clamp(

            player.position.z,

            -WORLD_LIMIT,

            WORLD_LIMIT

        );

}


/*
==================================================
KEYBOARD
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
        Math.hypot(
            dx,
            dy
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
    0.12;


/*
IMPORTANT:

Camera is deliberately kept
below the 7.2 ceiling.
*/

const cameraDistance =
    8.5;


let cameraTouch =
    null;


let lastTouchX =
    0;


let lastTouchY =
    0;


/*
==================================================
TOUCH CAMERA
==================================================
*/

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


            cameraYaw -=
                dx * 0.006;


            cameraPitch -=
                dy * 0.004;


            cameraPitch =
                THREE.MathUtils.clamp(

                    cameraPitch,

                    -0.15,

                    0.35

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
            dx * 0.005;


        cameraPitch -=
            dy * 0.004;


        cameraPitch =
            THREE.MathUtils.clamp(

                cameraPitch,

                -0.15,

                0.35

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


function updateMovement(
    delta
) {

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
        Math.hypot(
            moveX,
            moveZ
        );


    if (
        magnitude <
        0.01
    ) {

        return false;

    }


    if (
        magnitude >
        1
    ) {

        moveX /=
            magnitude;

        moveZ /=
            magnitude;

    }


    const speed =
        5.5;


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


    movePlayer(

        dx *
        speed *
        delta,

        dz *
        speed *
        delta

    );


    applyWorldBoundary();


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

function updateCamera(
    delta
) {

    /*
    Player's eye/body center.
    */

    cameraTarget.set(

        player.position.x,

        1.55,

        player.position.z

    );


    const horizontal =
        cameraDistance *
        Math.cos(
            cameraPitch
        );


    /*
    IMPORTANT:

    Maximum camera Y is roughly
    5.0, safely below ceiling.
    */

    const cameraY =
        4.1 +
        cameraDistance *
        Math.sin(
            cameraPitch
        );


    const desiredCamera =
        new THREE.Vector3(

            player.position.x -
            Math.sin(cameraYaw) *
            horizontal,

            THREE.MathUtils.clamp(
                cameraY,
                2.8,
                5.6
            ),

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
TASK SYSTEM
==================================================
*/

const taskList =
    document.getElementById(
        "task-list"
    );


const interactButton =
    document.getElementById(
        "interact-button"
    );


const tasks =
    Array.isArray(
        station.tasks
    )
        ? station.tasks
        : [];


const taskState =
    new Map();


for (
    const task of
    tasks
) {

    taskState.set(
        task.id,
        false
    );

}


/*
==================================================
TASK UI
==================================================
*/

function updateTaskUI() {

    if (!taskList) {
        return;
    }


    if (
        tasks.length === 0
    ) {

        taskList.innerHTML =
            "<div>NO TASKS</div>";

        return;

    }


    taskList.innerHTML =
        tasks.map(
            task => {

                const completed =
                    taskState.get(
                        task.id
                    );


                return `

                    <div class="task-item ${
                        completed
                            ? "completed"
                            : ""
                    }">

                        <span class="task-status">

                            ${
                                completed
                                    ? "✓"
                                    : "○"
                            }

                        </span>

                        <span>

                            ${
                                task.name
                            }

                        </span>

                    </div>

                `;

            }
        ).join("");

}


updateTaskUI();


/*
==================================================
NEAREST TASK
==================================================
*/

let nearestTask =
    null;


function findNearestTask() {

    nearestTask =
        null;


    let nearestDistance =
        Infinity;


    for (
        const task of
        tasks
    ) {

        if (
            taskState.get(
                task.id
            )
        ) {

            continue;

        }


        if (
            !task.object
        ) {

            continue;

        }


        const distance =
            player.position.distanceTo(
                task.object.position
            );


        if (
            distance <
            nearestDistance
        ) {

            nearestDistance =
                distance;

            nearestTask =
                task;

        }

    }


    return nearestTask;

}


/*
==================================================
INTERACT
==================================================
*/

function interact() {

    const task =
        findNearestTask();


    if (!task) {
        return;
    }


    if (
        player.position.distanceTo(
            task.object.position
        ) > 4
    ) {

        return;

    }


    taskState.set(
        task.id,
        true
    );


    if (
        task.object
    ) {

        task.object.scale.set(
            0.75,
            0.75,
            0.75
        );

        task.object.material =
            task.completedMaterial ||
            task.object.material;

    }


    updateTaskUI();


    console.log(
        "TASK COMPLETED:",
        task.name
    );

}


if (interactButton) {

    interactButton.addEventListener(
        "click",
        interact
    );

}


/*
==================================================
TASK PROXIMITY
==================================================
*/

function updateTaskInteraction() {

    const task =
        findNearestTask();


    if (
        !interactButton
    ) {

        return;

    }


    if (!task) {

        interactButton.style.opacity =
            "0.45";

        return;

    }


    const distance =
        player.position.distanceTo(
            task.object.position
        );


    if (
        distance <= 4
    ) {

        interactButton.style.opacity =
            "1";

        interactButton.textContent =
            "INTERACT";

    }
    else {

        interactButton.style.opacity =
            "0.55";

        interactButton.textContent =
            "INTERACT";

    }

}


/*
==================================================
TASK ANIMATION
==================================================
*/

function updateTasks(
    time
) {

    for (
        const task of
        tasks
    ) {

        if (
            !task ||
            !task.object ||
            taskState.get(
                task.id
            )
        ) {

            continue;

        }


        const pulse =
            1 +
            Math.sin(
                time * 0.004
            ) *
            0.08;


        task.object.scale.set(
            pulse,
            pulse,
            pulse
        );


        task.object.rotation.y +=
            0.01;

    }

}


/*
==================================================
LOCATION HUD
==================================================
*/

const locationElement =
    document.getElementById(
        "location"
    );


function updateLocation() {

    if (
        !locationElement
    ) {

        return;

    }


    let location =
        "CENTRAL HUB";


    const x =
        player.position.x;


    const z =
        player.position.z;


    if (z < -25) {

        location =
            "RESEARCH SECTOR";

    }
    else if (z > 25) {

        location =
            "SECURITY SECTOR";

    }
    else if (x < -25) {

        location =
            "MEDICAL SECTOR";

    }
    else if (x > 25) {

        location =
            "ENGINEERING SECTOR";

    }


    locationElement.textContent =
        location;

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
    Smooth player bob.
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


    updateTaskInteraction();


    updateLocation();


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
START
==================================================
*/

resize();

animate();


/*
==================================================
LOADING
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
        700
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
    "MAIN.JS 4.0 CONNECTED"
);

console.log(
    "ROOMS:",
    station.rooms?.length ?? 0
);

console.log(
    "TASKS:",
    tasks.length
);

console.log(
    "COLLIDERS:",
    worldColliders.length
);

console.log(
    "GAME ENGINE STARTED"
);

console.log(
    "================================"
);
