import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


const world = {};


/*
==================================================
PROJECT: VOID
STATION MAP 01
==================================================

Large seamless sci-fi station.

                 NORTH
                   ↑

        ┌─────────────────────────┐
        │       RESEARCH           │
        │                           │
        ├───────────┬───────────────┤
        │ SECURITY  │ CENTRAL HUB   │
        │           │               │
        ├───────────┼───────────────┤
        │ MEDICAL   │ ENGINEERING   │
        │           │               │
        ├───────────┴───────────────┤
        │       LOWER DECK          │
        │                           │
        │   CARGO / REACTOR         │
        └───────────────────────────┘

==================================================
*/


/*
==================================================
WORLD SETTINGS
==================================================
*/

const WORLD_WIDTH = 140;
const WORLD_DEPTH = 140;

const HALF_WIDTH =
    WORLD_WIDTH / 2;

const HALF_DEPTH =
    WORLD_DEPTH / 2;


/*
==================================================
WALL SETTINGS
==================================================
*/

const WALL_HEIGHT = 4.5;

const WALL_THICKNESS = 0.45;


/*
==================================================
MATERIALS
==================================================
*/

const materials = {

    floor:
        new THREE.MeshStandardMaterial({

            color: 0x0b0e15,

            roughness: 0.9

        }),


    floorMetal:
        new THREE.MeshStandardMaterial({

            color: 0x171c27,

            metalness: 0.55,

            roughness: 0.42

        }),


    wall:
        new THREE.MeshStandardMaterial({

            color: 0x252b38,

            metalness: 0.25,

            roughness: 0.72

        }),


    wallDark:
        new THREE.MeshStandardMaterial({

            color: 0x11151e,

            metalness: 0.3,

            roughness: 0.8

        }),


    metal:
        new THREE.MeshStandardMaterial({

            color: 0x424958,

            metalness: 0.8,

            roughness: 0.32

        }),


    research:
        new THREE.MeshStandardMaterial({

            color: 0x27476b,

            metalness: 0.35,

            roughness: 0.5

        }),


    security:
        new THREE.MeshStandardMaterial({

            color: 0x4c2935,

            metalness: 0.35,

            roughness: 0.5

        }),


    medical:
        new THREE.MeshStandardMaterial({

            color: 0x28504b,

            metalness: 0.3,

            roughness: 0.5

        }),


    engineering:
        new THREE.MeshStandardMaterial({

            color: 0x594527,

            metalness: 0.45,

            roughness: 0.45

        }),


    reactor:
        new THREE.MeshStandardMaterial({

            color: 0x46336b,

            metalness: 0.5,

            roughness: 0.38

        }),


    cargo:
        new THREE.MeshStandardMaterial({

            color: 0x3e424b,

            metalness: 0.65,

            roughness: 0.42

        }),


    blue:
        new THREE.MeshStandardMaterial({

            color: 0x3d72ff,

            emissive: 0x102d88,

            emissiveIntensity: 1.5,

            metalness: 0.2,

            roughness: 0.3

        }),


    cyan:
        new THREE.MeshStandardMaterial({

            color: 0x36ddff,

            emissive: 0x06394c,

            emissiveIntensity: 2,

            metalness: 0.25,

            roughness: 0.3

        }),


    red:
        new THREE.MeshStandardMaterial({

            color: 0xff344d,

            emissive: 0x69000d,

            emissiveIntensity: 2

        }),


    yellow:
        new THREE.MeshStandardMaterial({

            color: 0xffc34d,

            emissive: 0x583800,

            emissiveIntensity: 1.7

        }),


    green:
        new THREE.MeshStandardMaterial({

            color: 0x35e0a0,

            emissive: 0x063c29,

            emissiveIntensity: 1.6

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
CREATE FLOOR
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

    /*
    The floor always sits at Y = 0.

    No overlapping raised floors.
    No gaps.
    */

    return createBox(

        scene,

        x,

        -0.10,

        z,

        width,

        0.20,

        depth,

        material

    );

}


/*
==================================================
CREATE WALL
==================================================

IMPORTANT:

The visual wall and collision wall use
exactly the same dimensions.

This prevents invisible walls.
==================================================
*/

function createWall(
    scene,
    collision,
    x,
    z,
    width,
    depth,
    material =
        materials.wall
) {

    createBox(

        scene,

        x,

        WALL_HEIGHT / 2,

        z,

        width,

        WALL_HEIGHT,

        depth,

        material

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
CREATE LIGHT
==================================================
*/

function createLight(
    scene,
    x,
    z,
    color = 0x596cff,
    intensity = 3.5,
    distance = 18
) {

    const light =
        new THREE.PointLight(

            color,

            intensity,

            distance

        );


    light.position.set(

        x,

        3.7,

        z

    );


    scene.add(light);


    createBox(

        scene,

        x,

        4.25,

        z,

        2.2,

        0.08,

        0.22,

        new THREE.MeshStandardMaterial({

            color,

            emissive: color,

            emissiveIntensity: 2

        })

    );

}


/*
==================================================
CREATE LIGHT STRIP
==================================================
*/

function createStrip(
    scene,
    x,
    z,
    width,
    color = 0x3d72ff
) {

    createBox(

        scene,

        x,

        0.035,

        z,

        width,

        0.04,

        0.12,

        new THREE.MeshStandardMaterial({

            color,

            emissive: color,

            emissiveIntensity: 2

        })

    );

}


/*
==================================================
CREATE DOOR
==================================================
*/

function createDoor(
    scene,
    x,
    z,
    width = 3,
    color = 0x3d72ff
) {

    createBox(

        scene,

        x,

        1.65,

        z,

        width,

        3.3,

        0.18,

        materials.wallDark

    );


    createBox(

        scene,

        x - width / 2 + 0.12,

        1.65,

        z - 0.11,

        0.08,

        3.0,

        0.08,

        new THREE.MeshStandardMaterial({

            color,

            emissive: color,

            emissiveIntensity: 2

        })

    );


    createBox(

        scene,

        x + width / 2 - 0.12,

        1.65,

        z - 0.11,

        0.08,

        3.0,

        0.08,

        new THREE.MeshStandardMaterial({

            color,

            emissive: color,

            emissiveIntensity: 2

        })

    );

}


/*
==================================================
CREATE ROOM
==================================================

Room walls are created with openings.

The openings are REAL openings, not invisible
collision gaps.
==================================================
*/

function createRoom(
    scene,
    collision,
    x,
    z,
    width,
    depth,
    material
) {

    /*
    Floor
    */

    createFloor(

        scene,

        x,

        z,

        width,

        depth,

        materials.floorMetal

    );


    /*
    North
    */

    createWall(

        scene,
        collision,

        x - width / 4,
        z - depth / 2,
        width / 2 - 1.5,
        WALL_THICKNESS,
        material

    );


    createWall(

        scene,
        collision,

        x + width / 4,
        z - depth / 2,
        width / 2 - 1.5,
        WALL_THICKNESS,
        material

    );


    /*
    South
    */

    createWall(

        scene,
        collision,

        x - width / 4,
        z + depth / 2,
        width / 2 - 1.5,
        WALL_THICKNESS,
        material

    );


    createWall(

        scene,
        collision,

        x + width / 4,
        z + depth / 2,
        width / 2 - 1.5,
        WALL_THICKNESS,
        material

    );


    /*
    West
    */

    createWall(

        scene,
        collision,

        x - width / 2,
        z,
        WALL_THICKNESS,
        depth,
        material

    );


    /*
    East
    */

    createWall(

        scene,
        collision,

        x + width / 2,
        z,
        WALL_THICKNESS,
        depth,
        material

    );


    /*
    Doors
    */

    createDoor(

        scene,

        x,

        z - depth / 2,

        3,

        0x3d72ff

    );


    createDoor(

        scene,

        x,

        z + depth / 2,

        3,

        0x3d72ff

    );


    /*
    Lighting
    */

    createLight(

        scene,

        x,

        z,

        0x6578ff,

        2.5,

        14

    );

}


/*
==================================================
CREATE TERMINAL
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

                0.85,

                1.5,

                0.5

            ),

            materials.metal

        );


    body.position.y =
        0.75;


    body.castShadow = true;


    group.add(body);


    const screen =
        new THREE.Mesh(

            new THREE.BoxGeometry(

                0.58,

                0.46,

                0.04

            ),

            materials.blue

        );


    screen.position.set(

        0,

        1.05,

        -0.27

    );


    group.add(screen);


    const glow =
        new THREE.PointLight(

            0x3377ff,

            1.4,

            3

        );


    glow.position.set(

        0,

        1.1,

        -0.5

    );


    group.add(glow);


    group.userData = {

        type:
            "task",

        label,

        completed:
            false

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

    const base =
        new THREE.Mesh(

            new THREE.CylinderGeometry(

                0.7,
                0.7,
                0.22,
                24

            ),

            materials.metal

        );


    base.position.set(

        x,

        0.11,

        z

    );


    scene.add(base);


    const button =
        new THREE.Mesh(

            new THREE.CylinderGeometry(

                0.4,
                0.4,
                0.28,
                24

            ),

            materials.red

        );


    button.position.set(

        x,

        0.34,

        z

    );


    scene.add(button);


    return button;

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

    const width = 36;

    const depth = 32;


    createFloor(

        scene,

        0,

        0,

        width,

        depth,

        materials.floorMetal

    );


    /*
    North boundary
    */

    createWall(

        scene,
        collision,

        -13,
        -16,
        10,
        WALL_THICKNESS

    );


    createWall(

        scene,
        collision,

        13,
        -16,
        10,
        WALL_THICKNESS

    );


    /*
    South boundary
    */

    createWall(

        scene,
        collision,

        -13,
        16,
        10,
        WALL_THICKNESS

    );


    createWall(

        scene,
        collision,

        13,
        16,
        10,
        WALL_THICKNESS

    );


    /*
    West boundary
    */

    createWall(

        scene,
        collision,

        -18,
        0,
        WALL_THICKNESS,
        32

    );


    /*
    East boundary
    */

    createWall(

        scene,
        collision,

        18,
        0,
        WALL_THICKNESS,
        32

    );


    /*
    Main lights
    */

    createLight(

        scene,
        -10,
        -8,
        0x596cff,
        4,
        20

    );


    createLight(

        scene,
        10,
        -8,
        0x596cff,
        4,
        20

    );


    createLight(

        scene,
        -10,
        8,
        0x596cff,
        4,
        20

    );


    createLight(

        scene,
        10,
        8,
        0x596cff,
        4,
        20

    );


    /*
    Central reactor console
    */

    createTaskTerminal(

        scene,

        0,

        -5,

        "CENTRAL CONTROL"

    );


    createEmergencyButton(

        scene,

        0,

        4

    );


    /*
    Floor navigation lines
    */

    createStrip(

        scene,
        0,
        -10,
        12,
        0x3d72ff

    );


    createStrip(

        scene,
        0,
        10,
        12,
        0x3d72ff

    );

}


/*
==================================================
RESEARCH
==================================================
*/

function createResearchSector(
    scene,
    collision
) {

    const x = 0;

    const z = -46;


    createFloor(

        scene,

        x,

        z,

        60,

        28,

        materials.floorMetal

    );


    createRoom(

        scene,
        collision,

        -16,

        z,

        24,

        20,

        materials.research

    );


    createRoom(

        scene,
        collision,

        16,

        z,

        24,

        20,

        materials.research

    );


    createTaskTerminal(

        scene,

        -16,

        z,

        "RESEARCH TERMINAL"

    );


    createTaskTerminal(

        scene,

        16,

        z,

        "LABORATORY SYSTEM"

    );


    createLight(

        scene,

        0,

        z,

        0x3ddcff,

        4,

        24

    );

}


/*
==================================================
SECURITY
==================================================
*/

function createSecuritySector(
    scene,
    collision
) {

    const x = 0;

    const z = 46;


    createFloor(

        scene,

        x,

        z,

        60,

        28,

        materials.floorMetal

    );


    createRoom(

        scene,
        collision,

        -16,

        z,

        24,

        20,

        materials.security

    );


    createRoom(

        scene,
        collision,

        16,

        z,

        24,

        20,

        materials.security

    );


    createTaskTerminal(

        scene,

        -16,

        z,

        "SECURITY CONTROL"

    );


    createTaskTerminal(

        scene,

        16,

        z,

        "SURVEILLANCE SYSTEM"

    );


    createLight(

        scene,

        0,

        z,

        0xff3d52,

        4,

        24

    );

}


/*
==================================================
MEDICAL
==================================================
*/

function createMedicalSector(
    scene,
    collision
) {

    const x = -46;

    const z = 0;


    createFloor(

        scene,

        x,

        z,

        28,

        60,

        materials.floorMetal

    );


    createRoom(

        scene,
        collision,

        x,

        -16,

        20,

        24,

        materials.medical

    );


    createRoom(

        scene,
        collision,

        x,

        16,

        20,

        24,

        materials.medical

    );


    createTaskTerminal(

        scene,

        x,

        -16,

        "MEDICAL SYSTEM"

    );


    createTaskTerminal(

        scene,

        x,

        16,

        "LIFE SUPPORT"

    );


    createLight(

        scene,

        x,

        0,

        0x3dffcf,

        4,

        24

    );

}


/*
==================================================
ENGINEERING
==================================================
*/

function createEngineeringSector(
    scene,
    collision
) {

    const x = 46;

    const z = 0;


    createFloor(

        scene,

        x,

        z,

        28,

        60,

        materials.floorMetal

    );


    createRoom(

        scene,
        collision,

        x,

        -16,

        20,

        24,

        materials.engineering

    );


    createRoom(

        scene,
        collision,

        x,

        16,

        20,

        24,

        materials.engineering

    );


    createTaskTerminal(

        scene,

        x,

        -16,

        "ENGINE CONTROL"

    );


    createTaskTerminal(

        scene,

        x,

        16,

        "POWER SYSTEM"

    );


    createLight(

        scene,

        x,

        0,

        0xffbd3d,

        4,

        24

    );

}


/*
==================================================
LOWER DECK
==================================================
*/

function createLowerDeck(
    scene,
    collision
) {

    const z = 66;


    createFloor(

        scene,

        0,

        z,

        100,

        18,

        materials.floorMetal

    );


    createRoom(

        scene,
        collision,

        -28,

        z,

        36,

        14,

        materials.cargo

    );


    createRoom(

        scene,
        collision,

        0,

        z,

        22,

        14,

        materials.reactor

    );


    createRoom(

        scene,
        collision,

        28,

        z,

        36,

        14,

        materials.engineering

    );


    createTaskTerminal(

        scene,

        -28,

        z,

        "CARGO CONTROL"

    );


    createTaskTerminal(

        scene,

        0,

        z,

        "REACTOR CONTROL"

    );


    createTaskTerminal(

        scene,

        28,

        z,

        "POWER DISTRIBUTION"

    );


    createLight(

        scene,

        -28,

        z,

        0x6d7bff,

        4,

        20

    );


    createLight(

        scene,

        0,

        z,

        0xb85cff,

        4,

        20

    );


    createLight(

        scene,

        28,

        z,

        0xffbd3d,

        4,

        20

    );

}


/*
==================================================
CORRIDOR
==================================================
*/

function createCorridor(
    scene,
    collision,
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


    /*
    Corridor side walls.

    Ends remain open.
    */

    if (
        width > depth
    ) {

        createWall(

            scene,
            collision,

            x,
            z - depth / 2,
            width,
            WALL_THICKNESS

        );


        createWall(

            scene,
            collision,

            x,
            z + depth / 2,
            width,
            WALL_THICKNESS

        );

    } else {

        createWall(

            scene,
            collision,

            x - width / 2,
            z,
            WALL_THICKNESS,
            depth

        );


        createWall(

            scene,
            collision,

            x + width / 2,
            z,
            WALL_THICKNESS,
            depth

        );

    }


    createStrip(

        scene,

        x,

        z,

        Math.min(
            width,
            depth
        ) * 0.55,

        0x3d72ff

    );

}


/*
==================================================
CONNECT SECTORS
==================================================
*/

function createConnections(
    scene,
    collision
) {

    /*
    North
    */

    createCorridor(

        scene,
        collision,

        0,
        -30,

        10,
        28

    );


    /*
    South
    */

    createCorridor(

        scene,
        collision,

        0,
        30,

        10,
        28

    );


    /*
    West
    */

    createCorridor(

        scene,
        collision,

        -30,
        0,

        28,
        10

    );


    /*
    East
    */

    createCorridor(

        scene,
        collision,

        30,
        0,

        28,
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

    createWall(

        scene,
        collision,

        0,

        -HALF_DEPTH,

        WORLD_WIDTH,
        WALL_THICKNESS,
        materials.wallDark

    );


    createWall(

        scene,
        collision,

        0,

        HALF_DEPTH,

        WORLD_WIDTH,
        WALL_THICKNESS,
        materials.wallDark

    );


    createWall(

        scene,
        collision,

        -HALF_WIDTH,

        0,

        WALL_THICKNESS,
        WORLD_DEPTH,
        materials.wallDark

    );


    createWall(

        scene,
        collision,

        HALF_WIDTH,

        0,

        WALL_THICKNESS,
        WORLD_DEPTH,
        materials.wallDark

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
    Central pillars
    */

    const positions = [

        [-14, -10],
        [14, -10],
        [-14, 10],
        [14, 10]

    ];


    for (
        const position
        of positions
    ) {

        createBox(

            scene,

            position[0],

            1.25,

            position[1],

            0.5,

            2.5,

            0.5,

            materials.metal

        );

    }


    /*
    Long navigation strips
    */

    for (
        let z = -60;
        z <= 60;
        z += 10
    ) {

        createStrip(

            scene,

            0,

            z,

            4,

            0x243dff

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
    ==================================================
    CLEAR COLLISION
    ==================================================
    */

    if (
        collision &&
        typeof collision.clear ===
        "function"
    ) {

        collision.clear();

    }


    /*
    ==================================================
    CONTINUOUS MASTER FLOOR
    ==================================================

    One giant floor.

    This is the important fix for the
    old floor gaps.
    */

    createFloor(

        scene,

        0,

        0,

        WORLD_WIDTH,
        WORLD_DEPTH,

        materials.floor

    );


    /*
    ==================================================
    CENTRAL HUB
    ==================================================
    */

    createCentralHub(

        scene,
        collision

    );


    /*
    ==================================================
    SECTORS
    ==================================================
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


    createLowerDeck(

        scene,
        collision

    );


    /*
    ==================================================
    CONNECTIONS
    ==================================================
    */

    createConnections(

        scene,
        collision

    );


    /*
    ==================================================
    OUTER WALL
    ==================================================
    */

    createOuterBoundary(

        scene,
        collision

    );


    /*
    ==================================================
    DECORATION
    ==================================================
    */

    createDecoration(

        scene

    );


    /*
    ==================================================
    GLOBAL LIGHT
    ==================================================
    */

    const ambient =
        new THREE.HemisphereLight(

            0x8090ff,

            0x080a10,

            1.15

        );


    scene.add(ambient);


    /*
    ==================================================
    WORLD DATA
    ==================================================
    */

    return {

        size: {

            width:
                WORLD_WIDTH,

            depth:
                WORLD_DEPTH

        },


        map:

            "VOID-STATION-01",


        rooms: [

            "Central Hub",

            "Research Sector",

            "Security Sector",

            "Medical Sector",

            "Engineering Sector",

            "Cargo Deck",

            "Reactor Deck"

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

            },

            {

                id:
                    "cargo",

                name:
                    "Cargo Deck"

            },

            {

                id:
                    "reactor",

                name:
                    "Reactor Deck"

            }

        ],


        maps: [

            {

                id:
                    "VOID-STATION-01",

                name:
                    "Void Station"

            },

            {

                id:
                    "VOID-STATION-02",

                name:
                    "Orbital Colony"

            },

            {

                id:
                    "VOID-STATION-03",

                name:
                    "Deep Research Facility"

            }

        ],


        tasks: [

            "CENTRAL CONTROL",

            "RESEARCH TERMINAL",

            "LABORATORY SYSTEM",

            "SECURITY CONTROL",

            "SURVEILLANCE SYSTEM",

            "MEDICAL SYSTEM",

            "LIFE SUPPORT",

            "ENGINE CONTROL",

            "POWER SYSTEM",

            "CARGO CONTROL",

            "REACTOR CONTROL",

            "POWER DISTRIBUTION"

        ],


        emergencyButton:
            true

    };

};


export default world;
