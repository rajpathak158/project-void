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
BOX
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
WALL + COLLISION
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

    if (collision) {

        collision.addWall(
            x,
            z,
            width,
            depth
        );

    }

}


/*
==================================================
FLOOR
==================================================
*/

function createFloor(scene) {

    createBox(
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
LIGHT
==================================================
*/

function createLight(
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

}


/*
==================================================
DOORWAY WALL
==================================================

Creates a wall with an opening in the middle.

==================================================
*/

function createHorizontalDoorWall(
    scene,
    collision,
    x,
    z,
    totalWidth,
    openingWidth,
    depth
) {

    const sideWidth =
        (totalWidth - openingWidth) / 2;


    if (sideWidth > 0) {

        createWall(
            scene,
            collision,
            x - totalWidth / 2 + sideWidth / 2,
            z,
            sideWidth,
            depth
        );

        createWall(
            scene,
            collision,
            x + totalWidth / 2 - sideWidth / 2,
            z,
            sideWidth,
            depth
        );

    }

}


function createVerticalDoorWall(
    scene,
    collision,
    x,
    z,
    totalDepth,
    openingWidth,
    depth
) {

    const sideDepth =
        (totalDepth - openingWidth) / 2;


    if (sideDepth > 0) {

        createWall(
            scene,
            collision,
            x,
            z - totalDepth / 2 + sideDepth / 2,
            depth,
            sideDepth
        );

        createWall(
            scene,
            collision,
            x,
            z + totalDepth / 2 - sideDepth / 2,
            depth,
            sideDepth
        );

    }

}


/*
==================================================
CENTRAL HUB
==================================================
*/

function createCentralHub(
    scene,
    collision
) {

    const width = 12;
    const depth = 10;
    const thickness = 0.35;
    const door = 3;


    /*
    North wall
    */

    createHorizontalDoorWall(
        scene,
        collision,
        0,
        -5,
        width,
        door,
        thickness
    );


    /*
    South wall
    */

    createHorizontalDoorWall(
        scene,
        collision,
        0,
        5,
        width,
        door,
        thickness
    );


    /*
    West wall
    */

    createVerticalDoorWall(
        scene,
        collision,
        -6,
        0,
        depth,
        door,
        thickness
    );


    /*
    East wall
    */

    createVerticalDoorWall(
        scene,
        collision,
        6,
        0,
        depth,
        door,
        thickness
    );


    createLight(
        scene,
        -3,
        0
    );

    createLight(
        scene,
        3,
        0
    );

}


/*
==================================================
SIDE ROOM
==================================================
*/

function createRoom(
    scene,
    collision,
    x,
    z,
    name
) {

    const width = 7;
    const depth = 7;
    const thickness = 0.35;
    const door = 2.5;


    /*
    Back
    */

    createWall(
        scene,
        collision,
        x,
        z - depth / 2,
        width,
        thickness
    );


    /*
    Front
    */

    createWall(
        scene,
        collision,
        x,
        z + depth / 2,
        width,
        thickness
    );


    /*
    Left
    */

    createWall(
        scene,
        collision,
        x - width / 2,
        z,
        thickness,
        depth
    );


    /*
    Right
    */

    createWall(
        scene,
        collision,
        x + width / 2,
        z,
        thickness,
        depth
    );


    /*
    Room light
    */

    createLight(
        scene,
        x,
        z
    );


    return {
        name: name,
        x: x,
        z: z
    };

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
    Central hub
    */

    createCentralHub(
        scene,
        collision
    );


    /*
    Four rooms
    */

    createRoom(
        scene,
        collision,
        -9,
        -7,
        "Laboratory"
    );


    createRoom(
        scene,
        collision,
        9,
        -7,
        "Security"
    );


    createRoom(
        scene,
        collision,
        -9,
        7,
        "Medbay"
    );


    createRoom(
        scene,
        collision,
        9,
        7,
        "Engine Room"
    );


    /*
    Tasks
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
        -7,
        "SECURITY SYSTEM"
    );


    createTaskTerminal(
        scene,
        -8,
        7,
        "MEDICAL SYSTEM"
    );


    createTaskTerminal(
        scene,
        10,
        7,
        "ENGINE CONTROL"
    );


    /*
    Emergency button
    */

    createEmergencyButton(
        scene,
        0,
        0
    );


    /*
    Outer boundaries
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
    Central emergency light
    */

    createLight(
        scene,
        0,
        0,
        0xff3b3b
    );


    /*
    Station information
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

        emergencyButton: true

    };

};


export default world;
