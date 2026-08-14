import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


const world = {};


/*
==================================================
PROJECT: VOID
MASSIVE WORLD SYSTEM
==================================================

MAP SIZE:
96 x 96

SECTORS:

                 NORTH
                   ↑

        ┌───────────────────────┐
        │    RESEARCH SECTOR    │
        │                       │
        ├──────────┬────────────┤
        │ SECURITY │ CENTRAL    │
        │ SECTOR   │   HUB      │
        ├──────────┴────────────┤
        │ MEDICAL  │ ENGINEERING│
        │ SECTOR   │   SECTOR   │
        └───────────────────────┘

Future:
- Outer Space
- Reactor
- Hangar
- Cargo
- Quarantine
- Command
- Maintenance
- Different maps
==================================================
*/


/*
==================================================
WORLD SETTINGS
==================================================
*/

const WORLD_SIZE = 96;

const HALF_WORLD = WORLD_SIZE / 2;


/*
==================================================
MATERIALS
==================================================
*/

const materials = {

    floor:
        new THREE.MeshStandardMaterial({

            color: 0x11131a,

            roughness: 0.85

        }),


    floorMetal:
        new THREE.MeshStandardMaterial({

            color: 0x1c202b,

            metalness: 0.55,

            roughness: 0.45

        }),


    wall:
        new THREE.MeshStandardMaterial({

            color: 0x252936,

            roughness: 0.75

        }),


    wallDark:
        new THREE.MeshStandardMaterial({

            color: 0x171a23,

            roughness: 0.8

        }),


    metal:
        new THREE.MeshStandardMaterial({

            color: 0x3a3e4c,

            metalness: 0.75,

            roughness: 0.35

        }),


    research:
        new THREE.MeshStandardMaterial({

            color: 0x304e72,

            metalness: 0.35,

            roughness: 0.45

        }),


    security:
        new THREE.MeshStandardMaterial({

            color: 0x49313a,

            metalness: 0.35,

            roughness: 0.5

        }),


    medical:
        new THREE.MeshStandardMaterial({

            color: 0x304b48,

            metalness: 0.3,

            roughness: 0.45

        }),


    engineering:
        new THREE.MeshStandardMaterial({

            color: 0x514329,

            metalness: 0.45,

            roughness: 0.45

        }),


    emergency:
        new THREE.MeshStandardMaterial({

            color: 0xff3030,

            emissive: 0x660000,

            emissiveIntensity: 2

        }),


    task:
        new THREE.MeshStandardMaterial({

            color: 0x3b72ff,

            emissive: 0x152d88,

            emissiveIntensity: 1.5

        }),


    cyan:
        new THREE.MeshStandardMaterial({

            color: 0x39dfff,

            emissive: 0x073b55,

            emissiveIntensity: 2

        }),


    yellow:
        new THREE.MeshStandardMaterial({

            color: 0xffc247,

            emissive: 0x593800,

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


    if (
        collision &&
        typeof collision.addWall ===
        "function"
    ) {

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

function createFloor(
    scene,
    x,
    z,
    width,
    depth,
    material =
        materials.floor
) {

    createBox(

        scene,

        x,

        -0.15,

        z,

        width,

        0.3,

        depth,

        material

    );

}


/*
==================================================
CEILING LIGHT
==================================================
*/

function createLight(
    scene,
    x,
    z,
    color = 0x7a6cff,
    intensity = 5,
    distance = 12
) {

    const light =
        new THREE.PointLight(

            color,

            intensity,

            distance

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

        1.8,

        0.08,

        0.25,

        new THREE.MeshStandardMaterial({

            color: color,

            emissive: color,

            emissiveIntensity: 2

        })

    );

}


/*
==================================================
STRIP LIGHT
==================================================
*/

function createStrip(
    scene,
    x,
    z,
    width,
    color = 0x3b72ff
) {

    createBox(

        scene,

        x,

        3.85,

        z,

        width,

        0.08,

        0.12,

        new THREE.MeshStandardMaterial({

            color: color,

            emissive: color,

            emissiveIntensity: 2.5

        })

    );

}


/*
==================================================
ROOM
==================================================
*/

function createRoom(
    scene,
    collision,
    x,
    z,
    width,
    depth,
    material =
        materials.wall
) {

    const thickness =
        0.35;


    createWall(

        scene,
        collision,

        x,

        z - depth / 2,

        width,

        thickness

    );


    createWall(

        scene,
        collision,

        x,

        z + depth / 2,

        width,

        thickness

    );


    createWall(

        scene,
        collision,

        x - width / 2,

        z,

        thickness,

        depth

    );


    createWall(

        scene,
        collision,

        x + width / 2,

        z,

        thickness,

        depth

    );


    createFloor(

        scene,

        x,

        z,

        width - 0.5,

        depth - 0.5,

        materials.floorMetal

    );


    createLight(

        scene,

        x,

        z

    );


    return {

        x,

        z,

        width,

        depth

    };

}


/*
==================================================
CORRIDOR
==================================================
*/

function createCorridor(
    scene,
    x,
    z,
    width,
    depth
) {

    createFloor(

        scene,

        x,

        z,

        width,

        depth,

        materials.floorMetal

    );


    createStrip(

        scene,

        x,

        z,

        Math.min(width, depth) * 0.6,

        0x3b72ff

    );

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

            1.8,

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

                0.65,

                0.65,

                0.25,

                20

            ),

            materials.metal

        );


    base.position.y =
        0.125;


    group.add(base);


    const button =
        new THREE.Mesh(

            new THREE.CylinderGeometry(

                0.38,

                0.38,

                0.25,

                20

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
CENTRAL HUB
==================================================
*/

function createCentralHub(
    scene,
    collision
) {

    /*
    Large central room
    */

    const width =
        28;

    const depth =
        24;


    createFloor(

        scene,

        0,

        0,

        width,

        depth,

        materials.floorMetal

    );


    /*
    North wall
    */

    createWall(

        scene,
        collision,

        0,

        -12,

        11,

        0.4

    );


    createWall(

        scene,
        collision,

        -9,

        -12,

        6,

        0.4

    );


    createWall(

        scene,
        collision,

        9,

        -12,

        6,

        0.4

    );


    /*
    South wall
    */

    createWall(

        scene,
        collision,

        0,

        12,

        11,

        0.4

    );


    createWall(

        scene,
        collision,

        -9,

        12,

        6,

        0.4

    );


    createWall(

        scene,
        collision,

        9,

        12,

        6,

        0.4

    );


    /*
    West wall
    */

    createWall(

        scene,
        collision,

        -14,

        0,

        0.4,

        7

    );


    createWall(

        scene,
        collision,

        -14,

        0,

        0.4,

        7

    );


    /*
    East wall
    */

    createWall(

        scene,
        collision,

        14,

        0,

        0.4,

        7

    );


    createWall(

        scene,
        collision,

        14,

        0,

        0.4,

        7

    );


    /*
    Central lighting
    */

    createLight(

        scene,

        -7,

        -5,

        0x596cff

    );


    createLight(

        scene,

        7,

        -5,

        0x596cff

    );


    createLight(

        scene,

        -7,

        5,

        0x596cff

    );


    createLight(

        scene,

        7,

        5,

        0x596cff

    );


    /*
    Emergency
    */

    createEmergencyButton(

        scene,

        0,

        0

    );


    /*
    Central task
    */

    createTaskTerminal(

        scene,

        0,

        -6,

        "CENTRAL CONTROL"

    );

}


/*
==================================================
RESEARCH SECTOR
==================================================
*/

function createResearchSector(
    scene,
    collision
) {

    const centerX =
        0;

    const centerZ =
        -32;


    createFloor(

        scene,

        centerX,

        centerZ,

        42,

        32,

        materials.floorMetal

    );


    /*
    Main research rooms
    */

    createRoom(

        scene,
        collision,

        -11,

        -32,

        15,

        12,

        materials.research

    );


    createRoom(

        scene,
        collision,

        11,

        -32,

        15,

        12,

        materials.research

    );


    /*
    Containment rooms
    */

    createRoom(

        scene,
        collision,

        -11,

        -45,

        15,

        9,

        materials.research

    );


    createRoom(

        scene,
        collision,

        11,

        -45,

        15,

        9,

        materials.research

    );


    /*
    Tasks
    */

    createTaskTerminal(

        scene,

        -14,

        -32,

        "RESEARCH TERMINAL"

    );


    createTaskTerminal(

        scene,

        14,

        -32,

        "LABORATORY SYSTEM"

    );


    createTaskTerminal(

        scene,

        -11,

        -45,

        "CONTAINMENT CONTROL"

    );


    /*
    Lights
    */

    createLight(

        scene,

        0,

        -27,

        0x3ddcff

    );


    createLight(

        scene,

        0,

        -38,

        0x3ddcff

    );

}


/*
==================================================
SECURITY SECTOR
==================================================
*/

function createSecuritySector(
    scene,
    collision
) {

    const z =
        32;


    createFloor(

        scene,

        0,

        z,

        42,

        32,

        materials.floorMetal

    );


    createRoom(

        scene,
        collision,

        -11,
        32,
        15,
        12,
        materials.security

    );


    createRoom(

        scene,
        collision,

        11,
        32,
        15,
        12,
        materials.security

    );


    createRoom(

        scene,
        collision,

        -11,
        45,
        15,
        9,
        materials.security

    );


    createRoom(

        scene,
        collision,

        11,
        45,
        15,
        9,
        materials.security

    );


    createTaskTerminal(

        scene,

        -11,

        32,

        "SECURITY CONTROL"

    );


    createTaskTerminal(

        scene,

        12,

        32,

        "SURVEILLANCE SYSTEM"

    );


    createTaskTerminal(

        scene,

        -11,

        45,

        "ACCESS CONTROL"

    );


    createLight(

        scene,

        0,

        27,

        0xff3b4d

    );


    createLight(

        scene,

        0,

        38,

        0xff3b4d

    );

}


/*
==================================================
MEDICAL SECTOR
==================================================
*/

function createMedicalSector(
    scene,
    collision
) {

    const x =
        -32;


    createFloor(

        scene,

        x,

        0,

        32,

        42,

        materials.floorMetal

    );


    createRoom(

        scene,
        collision,

        -32,

        -11,

        12,

        15,

        materials.medical

    );


    createRoom(

        scene,
        collision,

        -32,

        11,

        12,

        15,

        materials.medical

    );


    createRoom(

        scene,
        collision,

        -45,

        -11,

        9,

        15,

        materials.medical

    );


    createRoom(

        scene,
        collision,

        -45,

        11,

        9,

        15,

        materials.medical

    );


    createTaskTerminal(

        scene,

        -32,

        -11,

        "MEDICAL SYSTEM"

    );


    createTaskTerminal(

        scene,

        -32,

        11,

        "LIFE SUPPORT"

    );


    createTaskTerminal(

        scene,

        -45,

        11,

        "QUARANTINE CONTROL"

    );


    createLight(

        scene,

        -27,

        0,

        0x3dffcf

    );


    createLight(

        scene,

        -38,

        0,

        0x3dffcf

    );

}


/*
==================================================
ENGINEERING SECTOR
==================================================
*/

function createEngineeringSector(
    scene,
    collision
) {

    const x =
        32;


    createFloor(

        scene,

        x,

        0,

        32,

        42,

        materials.floorMetal

    );


    createRoom(

        scene,
        collision,

        32,

        -11,

        12,

        15,

        materials.engineering

    );


    createRoom(

        scene,
        collision,

        32,

        11,

        12,

        15,

        materials.engineering

    );


    createRoom(

        scene,
        collision,

        45,

        -11,

        9,

        15,

        materials.engineering

    );


    createRoom(

        scene,
        collision,

        45,

        11,

        9,

        15,

        materials.engineering

    );


    createTaskTerminal(

        scene,

        32,

        -11,

        "ENGINE CONTROL"

    );


    createTaskTerminal(

        scene,

        32,

        11,

        "POWER SYSTEM"

    );


    createTaskTerminal(

        scene,

        45,

        -11,

        "REACTOR CONTROL"

    );


    createLight(

        scene,

        27,

        0,

        0xffbd3d

    );


    createLight(

        scene,

        38,

        0,

        0xffbd3d

    );

}


/*
==================================================
CONNECTING CORRIDORS
==================================================
*/

function createConnections(
    scene
) {

    /*
    North
    */

    createCorridor(

        scene,

        0,

        -22,

        10,

        20

    );


    /*
    South
    */

    createCorridor(

        scene,

        0,

        22,

        10,

        20

    );


    /*
    West
    */

    createCorridor(

        scene,

        -22,

        0,

        20,

        10

    );


    /*
    East
    */

    createCorridor(

        scene,

        22,

        0,

        20,

        10

    );

}


/*
==================================================
OUTER BOUNDARY
==================================================
*/

function createOuterBoundary(
    scene,
    collision
) {

    const size =
        WORLD_SIZE;


    createWall(

        scene,
        collision,

        0,

        -HALF_WORLD,

        size,

        0.5

    );


    createWall(

        scene,
        collision,

        0,

        HALF_WORLD,

        size,

        0.5

    );


    createWall(

        scene,
        collision,

        -HALF_WORLD,

        0,

        0.5,

        size

    );


    createWall(

        scene,
        collision,

        HALF_WORLD,

        0,

        0.5,

        size

    );

}


/*
==================================================
DECORATION
==================================================
*/

function createDecoration(
    scene
) {

    /*
    Central navigation pillars
    */

    for (
        let x = -10;
        x <= 10;
        x += 20
    ) {

        for (
            let z = -8;
            z <= 8;
            z += 16
        ) {

            createBox(

                scene,

                x,

                1.2,

                z,

                0.45,

                2.4,

                0.45,

                materials.metal

            );

        }

    }


    /*
    Floor strips
    */

    for (
        let z = -55;
        z <= 55;
        z += 10
    ) {

        createStrip(

            scene,

            0,

            z,

            3,

            0x273cff

        );

    }

}


/*
==================================================
CREATE WORLD
==================================================
*/

world.create =
function(
    scene,
    collision
) {

    /*
    ==========================================
    MAIN FLOOR
    ==========================================
    */

    createFloor(

        scene,

        0,

        0,

        WORLD_SIZE,

        WORLD_SIZE,

        materials.floor

    );


    /*
    ==========================================
    CENTRAL
    ==========================================
    */

    createCentralHub(

        scene,

        collision

    );


    /*
    ==========================================
    SECTORS
    ==========================================
    */

    createResearchSector(

        scene,

        collision

    );


    createSecuritySector(

        scene,

        collision

    );


    createMedicalSector(

        scene,

        collision

    );


    createEngineeringSector(

        scene,

        collision

    );


    /*
    ==========================================
    CONNECTIONS
    ==========================================
    */

    createConnections(

        scene

    );


    /*
    ==========================================
    BOUNDARY
    ==========================================
    */

    createOuterBoundary(

        scene,

        collision

    );


    /*
    ==========================================
    DECORATION
    ==========================================
    */

    createDecoration(

        scene

    );


    /*
    ==========================================
    EXTRA LIGHTING
    ==========================================
    */

    createLight(

        scene,

        0,

        0,

        0xff3030,

        4,

        10

    );


    /*
    ==========================================
    WORLD DATA
    ==========================================
    */

    return {

        size:
            WORLD_SIZE,

        rooms: [

            "Central Hub",

            "Research Sector",

            "Security Sector",

            "Medical Sector",

            "Engineering Sector"

        ],

        maps: [

            "VOID-STATION-01"

        ],

        sectors: [

            {

                id:
                    "central",

                name:
                    "Central Hub"

            },

            {

                id:
                    "research",

                name:
                    "Research Sector"

            },

            {

                id:
                    "security",

                name:
                    "Security Sector"

            },

            {

                id:
                    "medical",

                name:
                    "Medical Sector"

            },

            {

                id:
                    "engineering",

                name:
                    "Engineering Sector"

            }

        ],

        tasks: [

            "CENTRAL CONTROL",

            "RESEARCH TERMINAL",

            "LABORATORY SYSTEM",

            "CONTAINMENT CONTROL",

            "SECURITY CONTROL",

            "SURVEILLANCE SYSTEM",

            "ACCESS CONTROL",

            "MEDICAL SYSTEM",

            "LIFE SUPPORT",

            "QUARANTINE CONTROL",

            "ENGINE CONTROL",

            "POWER SYSTEM",

            "REACTOR CONTROL"

        ],

        emergencyButton:
            true

    };

};


export default world;
