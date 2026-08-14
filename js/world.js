import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


/*
==================================================
VOID STATION — WORLD SYSTEM
==================================================
*/


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

    wallDark: new THREE.MeshStandardMaterial({
        color: 0x111218,
        roughness: 0.9
    }),

    metal: new THREE.MeshStandardMaterial({
        color: 0x3a3d49,
        metalness: 0.7,
        roughness: 0.35
    }),

    glass: new THREE.MeshStandardMaterial({
        color: 0x3bdcff,
        transparent: true,
        opacity: 0.25,
        metalness: 0.3,
        roughness: 0.15
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
CREATE BOX
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

    const floor =
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


    return floor;

}



/*
==================================================
WALL
==================================================
*/

function createWall(
    scene,
    x,
    z,
    width,
    depth,
    height = 4
) {

    return createBox(
        scene,
        x,
        height / 2,
        z,
        width,
        height,
        depth,
        materials.wall
    );

}



/*
==================================================
CORRIDOR LIGHT
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


    const lamp =
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


    return {
        light,
        lamp
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


    /*
    Main terminal
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
        1.0,
        -0.24
    );


    group.add(screen);


    /*
    Glow
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


    /*
    Label data
    */

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


    /*
    Base
    */

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


    /*
    Button
    */

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
    centerX,
    centerZ,
    width,
    depth
) {

    const wallThickness =
        0.35;


    /*
    Back wall
    */

    createWall(
        scene,
        centerX,
        centerZ - depth / 2,
        width,
        wallThickness
    );


    /*
    Front wall
    */

    createWall(
        scene,
        centerX,
        centerZ + depth / 2,
        width,
        wallThickness
    );


    /*
    Left wall
    */

    createWall(
        scene,
        centerX - width / 2,
        centerZ,
        wallThickness,
        depth
    );


    /*
    Right wall
    */

    createWall(
        scene,
        centerX + width / 2,
        centerZ,
        wallThickness,
        depth
    );


    /*
    Ceiling lights
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
VOID STATION
==================================================
*/

world.create =
function(scene) {


    /*
    Main floor
    */

    createFloor(scene);


    /*
    Central Hub
    */

    createRoom(
        scene,
        0,
        0,
        12,
        10
    );


    /*
    Laboratory
    */

    createRoom(
        scene,
        -9,
        -7,
        7,
        7
    );


    /*
    Security
    */

    createRoom(
        scene,
        9,
        -7,
        7,
        7
    );


    /*
    Medbay
    */

    createRoom(
        scene,
        -9,
        7,
        7,
        7
    );


    /*
    Engine Room
    */

    createRoom(
        scene,
        9,
        7,
        7,
        7
    );


    /*
    Task terminals
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
    Emergency button
    */

    createEmergencyButton(
        scene,
        0,
        0
    );


    /*
    Extra lights
    */

    createCeilingLight(
        scene,
        0,
        0,
        0xff3b3b
    );


    /*
    World boundaries
    */

    createWall(
        scene,
        0,
        -16,
        32,
        0.4
    );


    createWall(
        scene,
        0,
        16,
        32,
        0.4
    );


    createWall(
        scene,
        -16,
        0,
        0.4,
        32
    );


    createWall(
        scene,
        16,
        0,
        0.4,
        32
    );


    /*
    Return world information
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
