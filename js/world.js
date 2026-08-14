import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


const world = {};


/*
==================================================
MATERIALS
==================================================
*/

const materials = {

    floor: new THREE.MeshStandardMaterial({
        color: 0x14151c,
        roughness: 0.8
    }),

    wall: new THREE.MeshStandardMaterial({
        color: 0x252733,
        roughness: 0.7
    }),

    metal: new THREE.MeshStandardMaterial({
        color: 0x3a3d49,
        metalness: 0.7,
        roughness: 0.35
    }),

    emergency: new THREE.MeshStandardMaterial({
        color: 0xff3030,
        emissive: 0x660000,
        emissiveIntensity: 2
    }),

    task: new THREE.MeshStandardMaterial({
        color: 0x3b72ff,
        emissive: 0x152d88,
        emissiveIntensity: 1.5
    })

};


/*
==================================================
BOX CREATOR
==================================================
*/

function createBox(
    scene,
    x,
    y,
    z,
    width,
    height,
    depth,
    material
) {

    const geometry =
        new THREE.BoxGeometry(
            width,
            height,
            depth
        );


    const mesh =
        new THREE.Mesh(
            geometry,
            material
        );


    mesh.position.set(
        x,
        y,
        z
    );


    mesh.castShadow = true;

    mesh.receiveShadow = true;


    scene.add(mesh);


    return mesh;

}


/*
==================================================
FLOOR
==================================================
*/

function createFloor(scene) {

    return createBox(
        scene,
        0,
        -0.15,
        0,
        32,
        0.3,
        32,
        materials.floor
    );

}


/*
==================================================
WALL
==================================================
*/

function createWall(
    scene,
    collision,
    x,
    z,
    width,
    depth,
    height = 4
) {

    const wall =
        createBox(
            scene,
            x,
            height / 2,
            z,
            width,
            height,
            depth,
            materials.wall
        );


    /*
    Register wall with collision
    */

    if (collision) {

        collision.addWall(
            x,
            z,
            width,
            depth
        );

    }


    return wall;

}


/*
==================================================
LIGHT
==================================================
*/

function createCeilingLight(
    scene,
    x,
    z,
    color = 0x7a6cff
) {

    const light =
        new THREE.PointLight(
            color,
            7,
            9
        );


    light.position.set(
        x,
        3.6,
        z
    );


    scene.add(light);


    createBox(
        scene,
        x,
        3.95,
        z,
        1.4,
        0.08,
        0.25,
        new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 3
        })
    );


    return light;

}


/*
==================================================
TASK TERMINAL
==================================================
*/

function createTaskTerminal(
    scene,
    x,
    z,
    label
) {

    const group =
        new THREE.Group();


    group.position.set(
        x,
        0,
        z
    );


    /*
    Body
    */

    const body =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.8,
                1.4,
                0.45
            ),
            materials.metal
        );


    body.position.y =
        0.7;


    group.add(body);


    /*
    Screen
    */

    const screen =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.55,
                0.45,
                0.04
            ),
            materials.task
        );


    screen.position.set(
        0,
        1,
        -0.24
    );


    group.add(screen);


    /*
    Task light
    */

    const light =
        new THREE.PointLight(
            0x3377ff,
            2,
            3
        );


    light.position.set(
        0,
        1,
        -0.5
    );


    group.add(light);


    group.userData = {

        type: "task",

        label: label,

        completed: false

    };


    scene.add(group);


    return group;

}


/*
==================================================
EMERGENCY BUTTON
==================================================
*/

function createEmergencyButton(
    scene,
    x,
    z
) {

    const group =
        new THREE.Group();


    group.position.set(
        x,
        0,
        z
    );


    const base =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.6,
                0.6,
                0.25,
                24
            ),
            materials.metal
        );


    base.position.y =
        0.125;


    group.add(base);


    const button =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.35,
                0.35,
                0.25,
                24
            ),
            materials.emergency
        );


    button.position.y =
        0.38;


    group.add(button);


    group.userData = {

        type: "emergency",

        active: true

    };


    scene.add(group);


    return group;

}


/*
==================================================
ROOM
==================================================
*/

function createRoom(
    scene,
    collision,
    centerX,
    centerZ,
    width,
    depth
) {

    const thickness =
        0.35;


    /*
    Back wall
    */

    createWall(
        scene,
        collision,
        centerX,
        centerZ - depth / 2,
        width,
        thickness
    );


    /*
    Front wall
    */

    createWall(
        scene,
        collision,
        centerX,
        centerZ + depth / 2,
        width,
        thickness
    );


    /*
    Left wall
    */

    createWall(
        scene,
        collision,
        centerX - width / 2,
        centerZ,
        thickness,
        depth
    );


    /*
    Right wall
    */

    createWall(
        scene,
        collision,
        centerX + width / 2,
        centerZ,
        thickness,
        depth
    );


    /*
    Lights
    */

    createCeilingLight(
        scene,
        centerX - width / 4,
        centerZ
    );


    createCeilingLight(
        scene,
        centerX + width / 4,
        centerZ
    );

}


/*
==================================================
CREATE STATION
==================================================
*/

world.create =
function(
    scene,
    collision
) {

    /*
    Floor
    */

    createFloor(scene);


    /*
    CENTRAL HUB
    */

    createRoom(
        scene,
        collision,
        0,
        0,
        12,
        10
    );


    /*
    LABORATORY
    */

    createRoom(
        scene,
        collision,
        -9,
        -7,
        7,
        7
    );


    /*
    SECURITY
    */

    createRoom(
        scene,
        collision,
        9,
        -7,
        7,
        7
    );


    /*
    MEDBAY
    */

    createRoom(
        scene,
        collision,
        -9,
        7,
        7,
        7
    );


    /*
    ENGINE
    */

    createRoom(
        scene,
        collision,
        9,
        7,
        7,
        7
    );


    /*
    TASKS
    */

    createTaskTerminal(
        scene,
        -10,
        -7,
        "LAB TERMINAL"
    );


    createTaskTerminal(
        scene,
        8,
        -8,
        "SECURITY SYSTEM"
    );


    createTaskTerminal(
        scene,
        -8,
        8,
        "MEDICAL SYSTEM"
    );


    createTaskTerminal(
        scene,
        10,
        8,
        "ENGINE CONTROL"
    );


    /*
    EMERGENCY BUTTON
    */

    createEmergencyButton(
        scene,
        0,
        0
    );


    /*
    CENTRAL LIGHT
    */

    createCeilingLight(
        scene,
        0,
        0,
        0xff3b3b
    );


    /*
    OUTER BOUNDARIES
    */

    createWall(
        scene,
        collision,
        0,
        -16,
        32,
        0.4
    );


    createWall(
        scene,
        collision,
        0,
        16,
        32,
        0.4
    );


    createWall(
        scene,
        collision,
        -16,
        0,
        0.4,
        32
    );


    createWall(
        scene,
        collision,
        16,
        0,
        0.4,
        32
    );


    /*
    WORLD DATA
    */

    return {

        rooms: [

            "Central Hub",

            "Laboratory",

            "Security",

            "Medbay",

            "Engine Room"

        ],

        tasks: [

            "LAB TERMINAL",

            "SECURITY SYSTEM",

            "MEDICAL SYSTEM",

            "ENGINE CONTROL"

        ],

        emergencyButton:
            true

    };

};


export default world;
