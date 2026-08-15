import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


/*
==================================================
PROJECT: VOID
WORLD ENGINE
VERSION 3.0

LARGE SCI-FI SPACE STATION

WORLD SIZE: 160 x 160
WALL HEIGHT: 7
ROOMS: LARGE
CORRIDORS: LARGE
==================================================
*/


const world = {};


/*
==================================================
WORLD SETTINGS
==================================================
*/

const WORLD_SIZE = 160;

const HALF_WORLD =
    WORLD_SIZE / 2;

const WALL_HEIGHT = 7;

const WALL_THICKNESS = 0.6;

const CEILING_HEIGHT = 7.2;


/*
==================================================
MATERIAL FACTORY
==================================================
*/

function material(
    color,
    metalness = 0.3,
    roughness = 0.55,
    emissive = 0x000000,
    emissiveIntensity = 0
) {

    return new THREE.MeshStandardMaterial({

        color,

        metalness,

        roughness,

        emissive,

        emissiveIntensity

    });

}


/*
==================================================
MATERIALS
==================================================
*/

const materials = {


    /*
    ----------------------------------------------
    FLOOR
    ----------------------------------------------
    */

    floor:
        material(
            0x111722,
            0.65,
            0.5
        ),


    floorDark:
        material(
            0x090d15,
            0.7,
            0.48
        ),


    floorMetal:
        material(
            0x252d3b,
            0.8,
            0.32
        ),


    /*
    ----------------------------------------------
    WALLS
    ----------------------------------------------
    */

    centralWall:
        material(
            0x28344a,
            0.55,
            0.42
        ),


    researchWall:
        material(
            0x24558a,
            0.45,
            0.4,
            0x071b42,
            0.7
        ),


    medicalWall:
        material(
            0x17695f,
            0.4,
            0.42,
            0x05352f,
            0.7
        ),


    securityWall:
        material(
            0x7b2639,
            0.45,
            0.42,
            0x3b0712,
            0.8
        ),


    engineeringWall:
        material(
            0x8a5b22,
            0.5,
            0.4,
            0x3a2205,
            0.7
        ),


    /*
    ----------------------------------------------
    CEILING
    ----------------------------------------------
    */

    ceiling:
        material(
            0x0b101a,
            0.45,
            0.75
        ),


    /*
    ----------------------------------------------
    METAL
    ----------------------------------------------
    */

    metal:
        material(
            0x4b5668,
            0.9,
            0.28
        ),


    darkMetal:
        material(
            0x171d29,
            0.85,
            0.3
        ),


    /*
    ----------------------------------------------
    NEON
    ----------------------------------------------
    */

    cyan:
        material(
            0x24eaff,
            0.3,
            0.18,
            0x00cfff,
            4
        ),


    blue:
        material(
            0x4c72ff,
            0.3,
            0.2,
            0x1738ff,
            4
        ),


    green:
        material(
            0x35ffb0,
            0.3,
            0.2,
            0x00c875,
            4
        ),


    red:
        material(
            0xff3d55,
            0.3,
            0.2,
            0xff001d,
            4
        ),


    orange:
        material(
            0xffa52f,
            0.3,
            0.2,
            0xff5a00,
            4
        ),


    white:
        material(
            0xdcecff,
            0.3,
            0.2,
            0x6aaaff,
            2
        )

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
    mat,
    options = {}
) {

    const mesh =
        new THREE.Mesh(

            new THREE.BoxGeometry(
                width,
                height,
                depth
            ),

            mat

        );


    mesh.position.set(
        x,
        y,
        z
    );


    mesh.castShadow =
        options.castShadow !== false;


    mesh.receiveShadow =
        options.receiveShadow !== false;


    if (options.noCollision) {

        mesh.userData.noCollision =
            true;

    }


    if (options.decoration) {

        mesh.userData.decoration =
            true;

    }


    scene.add(
        mesh
    );


    return mesh;

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
    mat = materials.floor
) {

    return createBox(

        scene,

        x,

        -0.1,

        z,

        width,

        0.2,

        depth,

        mat

    );

}


/*
==================================================
CEILING
==================================================
*/

function createCeiling(
    scene,
    x,
    z,
    width,
    depth
) {

    return createBox(

        scene,

        x,

        CEILING_HEIGHT,

        z,

        width,

        0.25,

        depth,

        materials.ceiling

    );

}


/*
==================================================
SOLID WALL
==================================================
*/

function createWall(
    scene,
    x,
    z,
    width,
    depth,
    mat
) {

    return createBox(

        scene,

        x,

        WALL_HEIGHT / 2,

        z,

        width,

        WALL_HEIGHT,

        depth,

        mat

    );

}


/*
==================================================
HORIZONTAL WALL WITH DOOR
==================================================
*/

function horizontalWallWithDoor(
    scene,
    x,
    z,
    width,
    doorWidth,
    mat
) {

    const sideWidth =
        (width - doorWidth) / 2;


    if (sideWidth <= 0) {

        return;

    }


    createWall(

        scene,

        x -
        doorWidth / 2 -
        sideWidth / 2,

        z,

        sideWidth,

        WALL_THICKNESS,

        mat

    );


    createWall(

        scene,

        x +
        doorWidth / 2 +
        sideWidth / 2,

        z,

        sideWidth,

        WALL_THICKNESS,

        mat

    );

}


/*
==================================================
VERTICAL WALL WITH DOOR
==================================================
*/

function verticalWallWithDoor(
    scene,
    x,
    z,
    depth,
    doorWidth,
    mat
) {

    const sideDepth =
        (depth - doorWidth) / 2;


    if (sideDepth <= 0) {

        return;

    }


    createWall(

        scene,

        x,

        z -
        doorWidth / 2 -
        sideDepth / 2,

        WALL_THICKNESS,

        sideDepth,

        mat

    );


    createWall(

        scene,

        x,

        z +
        doorWidth / 2 +
        sideDepth / 2,

        WALL_THICKNESS,

        sideDepth,

        mat

    );

}


/*
==================================================
NEON STRIP
==================================================
*/

function neonStrip(
    scene,
    x,
    y,
    z,
    width,
    depth,
    mat
) {

    createBox(

        scene,

        x,
        y,
        z,

        width,

        0.05,

        depth,

        mat,

        {
            noCollision: true,
            decoration: true
        }

    );

}


/*
==================================================
CEILING LIGHT
==================================================
*/

function ceilingLight(
    scene,
    x,
    z,
    color
) {

    createBox(

        scene,

        x,

        CEILING_HEIGHT - 0.12,

        z,

        3,

        0.08,

        0.35,

        color,

        {
            noCollision: true,
            decoration: true
        }

    );


    const light =
        new THREE.PointLight(
            color.color,
            4,
            22
        );


    light.position.set(
        x,
        WALL_HEIGHT - 0.4,
        z
    );


    scene.add(
        light
    );

}


/*
==================================================
ROOM
==================================================
*/

function createRoom(
    scene,
    x,
    z,
    width,
    depth,
    wallMaterial,
    neonMaterial,
    doorSide
) {


    /*
    FLOOR
    */

    createFloor(
        scene,
        x,
        z,
        width,
        depth
    );


    /*
    NORTH
    */

    if (
        doorSide ===
        "north"
    ) {

        horizontalWallWithDoor(

            scene,

            x,

            z - depth / 2,

            width,

            7,

            wallMaterial

        );

    }
    else {

        createWall(

            scene,

            x,

            z - depth / 2,

            width,

            WALL_THICKNESS,

            wallMaterial

        );

    }


    /*
    SOUTH
    */

    if (
        doorSide ===
        "south"
    ) {

        horizontalWallWithDoor(

            scene,

            x,

            z + depth / 2,

            width,

            7,

            wallMaterial

        );

    }
    else {

        createWall(

            scene,

            x,

            z + depth / 2,

            width,

            WALL_THICKNESS,

            wallMaterial

        );

    }


    /*
    WEST
    */

    if (
        doorSide ===
        "west"
    ) {

        verticalWallWithDoor(

            scene,

            x - width / 2,

            z,

            depth,

            7,

            wallMaterial

        );

    }
    else {

        createWall(

            scene,

            x - width / 2,

            z,

            WALL_THICKNESS,

            depth,

            wallMaterial

        );

    }


    /*
    EAST
    */

    if (
        doorSide ===
        "east"
    ) {

        verticalWallWithDoor(

            scene,

            x + width / 2,

            z,

            depth,

            7,

            wallMaterial

        );

    }
    else {

        createWall(

            scene,

            x + width / 2,

            z,

            WALL_THICKNESS,

            depth,

            wallMaterial

        );

    }


    /*
    CEILING
    */

    createCeiling(
        scene,
        x,
        z,
        width,
        depth
    );


    /*
    ROOM LIGHTS
    */

    const lightPositions = [

        [
            x - width * 0.25,
            z - depth * 0.25
        ],

        [
            x + width * 0.25,
            z - depth * 0.25
        ],

        [
            x - width * 0.25,
            z + depth * 0.25
        ],

        [
            x + width * 0.25,
            z + depth * 0.25
        ]

    ];


    for (
        const position of
        lightPositions
    ) {

        ceilingLight(

            scene,

            position[0],

            position[1],

            neonMaterial

        );

    }


    /*
    FLOOR BORDER
    */

    neonStrip(

        scene,

        x,

        0.03,

        z - depth / 2 + 0.35,

        width - 1,

        0.12,

        neonMaterial

    );


    neonStrip(

        scene,

        x,

        0.03,

        z + depth / 2 - 0.35,

        width - 1,

        0.12,

        neonMaterial

    );


    neonStrip(

        scene,

        x - width / 2 + 0.35,

        0.03,

        z,

        0.12,

        depth - 1,

        neonMaterial

    );


    neonStrip(

        scene,

        x + width / 2 - 0.35,

        0.03,

        z,

        0.12,

        depth - 1,

        neonMaterial

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
    depth,
    neonMaterial
) {


    createFloor(

        scene,

        x,

        z,

        width,

        depth,

        materials.floorDark

    );


    createCeiling(

        scene,

        x,

        z,

        width,

        depth

    );


    /*
    Neon center line
    */

    neonStrip(

        scene,

        x,

        0.04,

        z,

        0.18,

        depth - 0.8,

        neonMaterial

    );


    /*
    Side strips
    */

    neonStrip(

        scene,

        x - width / 2 + 0.5,

        0.04,

        z,

        0.08,

        depth - 0.8,

        neonMaterial

    );


    neonStrip(

        scene,

        x + width / 2 - 0.5,

        0.04,

        z,

        0.08,

        depth - 0.8,

        neonMaterial

    );


    /*
    Ceiling lights
    */

    const count =
        Math.max(
            2,
            Math.floor(
                depth / 8
            )
        );


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const offset =
            -depth / 2 +
            4 +
            i *
            (
                (depth - 8) /
                Math.max(
                    1,
                    count - 1
                )
            );


        ceilingLight(

            scene,

            x,

            z + offset,

            neonMaterial

        );

    }

}


/*
==================================================
CENTRAL HUB
==================================================
*/

function createCentralHub(
    scene
) {

    const width = 40;

    const depth = 40;


    createFloor(

        scene,

        0,

        0,

        width,

        depth,

        materials.floorMetal

    );


    /*
    NORTH
    */

    horizontalWallWithDoor(

        scene,

        0,

        -20,

        width,

        8,

        materials.centralWall

    );


    /*
    SOUTH
    */

    horizontalWallWithDoor(

        scene,

        0,

        20,

        width,

        8,

        materials.centralWall

    );


    /*
    WEST
    */

    verticalWallWithDoor(

        scene,

        -20,

        0,

        depth,

        8,

        materials.centralWall

    );


    /*
    EAST
    */

    verticalWallWithDoor(

        scene,

        20,

        0,

        depth,

        8,

        materials.centralWall

    );


    createCeiling(

        scene,

        0,

        0,

        width,

        depth

    );


    /*
    Central reactor
    */

    createBox(

        scene,

        0,

        1.5,

        0,

        3,

        3,

        3,

        materials.darkMetal

    );


    createBox(

        scene,

        0,

        3.1,

        0,

        2.4,

        0.15,

        2.4,

        materials.cyan,

        {
            noCollision: true,
            decoration: true
        }

    );


    /*
    Reactor glow
    */

    const reactorLight =
        new THREE.PointLight(
            0x22ddff,
            10,
            25
        );


    reactorLight.position.set(
        0,
        3,
        0
    );


    scene.add(
        reactorLight
    );


    /*
    Hub floor rings
    */

    const ringGeometry =
        new THREE.RingGeometry(
            5,
            5.2,
            64
        );


    const ring =
        new THREE.Mesh(

            ringGeometry,

            materials.cyan

        );


    ring.rotation.x =
        -Math.PI / 2;


    ring.position.y =
        0.04;


    ring.userData.noCollision =
        true;


    ring.userData.decoration =
        true;


    scene.add(
        ring
    );


    /*
    Hub lights
    */

    ceilingLight(
        scene,
        -10,
        -10,
        materials.blue
    );


    ceilingLight(
        scene,
        10,
        -10,
        materials.blue
    );


    ceilingLight(
        scene,
        -10,
        10,
        materials.blue
    );


    ceilingLight(
        scene,
        10,
        10,
        materials.blue
    );

}


/*
==================================================
RESEARCH SECTOR
==================================================
*/

function createResearch(
    scene
) {

    createRoom(

        scene,

        -42,

        -52,

        34,

        28,

        materials.researchWall,

        materials.blue,

        "south"

    );


    createRoom(

        scene,

        0,

        -60,

        30,

        22,

        materials.researchWall,

        materials.blue,

        "south"

    );


    createCorridor(

        scene,

        -21,

        -31,

        10,

        22,

        materials.blue

    );


    createCorridor(

        scene,

        0,

        -41,

        10,

        18,

        materials.blue

    );

}


/*
==================================================
SECURITY SECTOR
==================================================
*/

function createSecurity(
    scene
) {

    createRoom(

        scene,

        -42,

        52,

        34,

        28,

        materials.securityWall,

        materials.red,

        "north"

    );


    createRoom(

        scene,

        0,

        60,

        30,

        22,

        materials.securityWall,

        materials.red,

        "north"

    );


    createCorridor(

        scene,

        -21,

        31,

        10,

        22,

        materials.red

    );


    createCorridor(

        scene,

        0,

        41,

        10,

        18,

        materials.red

    );

}


/*
==================================================
MEDICAL SECTOR
==================================================
*/

function createMedical(
    scene
) {

    createRoom(

        scene,

        -52,

        -8,

        28,

        34,

        materials.medicalWall,

        materials.green,

        "east"

    );


    createRoom(

        scene,

        -60,

        35,

        22,

        28,

        materials.medicalWall,

        materials.green,

        "east"

    );


    createCorridor(

        scene,

        -31,

        -8,

        22,

        10,

        materials.green

    );


    createCorridor(

        scene,

        -41,

        35,

        20,

        10,

        materials.green

    );

}


/*
==================================================
ENGINEERING SECTOR
==================================================
*/

function createEngineering(
    scene
) {

    createRoom(

        scene,

        52,

        -8,

        28,

        34,

        materials.engineeringWall,

        materials.orange,

        "west"

    );


    createRoom(

        scene,

        60,

        35,

        22,

        28,

        materials.engineeringWall,

        materials.orange,

        "west"

    );


    createCorridor(

        scene,

        31,

        -8,

        22,

        10,

        materials.orange

    );


    createCorridor(

        scene,

        41,

        35,

        20,

        10,

        materials.orange

    );

}


/*
==================================================
OUTER BOUNDARY
==================================================
*/

function createBoundary(
    scene
) {

    createWall(

        scene,

        0,

        -HALF_WORLD,

        WORLD_SIZE,

        0.8,

        materials.darkMetal

    );


    createWall(

        scene,

        0,

        HALF_WORLD,

        WORLD_SIZE,

        0.8,

        materials.darkMetal

    );


    createWall(

        scene,

        -HALF_WORLD,

        0,

        0.8,

        WORLD_SIZE,

        materials.darkMetal

    );


    createWall(

        scene,

        HALF_WORLD,

        0,

        0.8,

        WORLD_SIZE,

        materials.darkMetal

    );

}


/*
==================================================
NAVIGATION LIGHTS
==================================================
*/

function createNavigationLights(
    scene
) {

    const positions = [

        [-12, -20],
        [12, -20],

        [-20, -12],
        [-20, 12],

        [20, -12],
        [20, 12],

        [-12, 20],
        [12, 20]

    ];


    for (
        const position of
        positions
    ) {

        const light =
            new THREE.PointLight(
                0x22cfff,
                3,
                16
            );


        light.position.set(

            position[0],

            3.5,

            position[1]

        );


        scene.add(
            light
        );

    }

}


/*
==================================================
WORLD CREATE
==================================================
*/

world.create =
function(
    scene,
    collision
) {


    /*
    ----------------------------------------------
    BASE FLOOR
    ----------------------------------------------
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
    ----------------------------------------------
    CENTRAL
    ----------------------------------------------
    */

    createCentralHub(
        scene
    );


    /*
    ----------------------------------------------
    SECTORS
    ----------------------------------------------
    */

    createResearch(
        scene
    );


    createSecurity(
        scene
    );


    createMedical(
        scene
    );


    createEngineering(
        scene
    );


    /*
    ----------------------------------------------
    OUTER WALL
    ----------------------------------------------
    */

    createBoundary(
        scene
    );


    /*
    ----------------------------------------------
    NAVIGATION
    ----------------------------------------------
    */

    createNavigationLights(
        scene
    );


    /*
    ----------------------------------------------
    EXTRA GLOBAL LIGHT
    ----------------------------------------------
    */

    const stationLight =
        new THREE.HemisphereLight(

            0x7188cc,

            0x090b12,

            1.15

        );


    scene.add(
        stationLight
    );


    /*
    ----------------------------------------------
    RETURN DATA
    ----------------------------------------------
    */

    return {

        size:
            WORLD_SIZE,


        spawn: {

            x: 0,

            y: 0,

            z: 10

        },


        rooms: [

            "Central Hub",

            "Research Sector",

            "Security Sector",

            "Medical Sector",

            "Engineering Sector"

        ],


        tasks: [],


        maps: [

            "VOID-STATION-02"

        ],


        sectors: [

            {

                id:
                    "central",

                name:
                    "Central Hub",

                color:
                    "#24eaff"

            },

            {

                id:
                    "research",

                name:
                    "Research Sector",

                color:
                    "#4c72ff"

            },

            {

                id:
                    "security",

                name:
                    "Security Sector",

                color:
                    "#ff3d55"

            },

            {

                id:
                    "medical",

                name:
                    "Medical Sector",

                color:
                    "#35ffb0"

            },

            {

                id:
                    "engineering",

                name:
                    "Engineering Sector",

                color:
                    "#ffa52f"

            }

        ]

    };

};


export default world;


