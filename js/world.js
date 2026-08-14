import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


const world = {};


/*
==================================================
PROJECT VOID
LARGE STATION
==================================================

WORLD:

                    RESEARCH
                       |
                       |
        MEDICAL -- CENTRAL -- ENGINEERING
                       |
                       |
                    SECURITY

WORLD SIZE:
120 x 120

FLOOR:
y = 0

WALL:
0 → 4

CEILING:
4 → 4.2

==================================================
*/


const WORLD_SIZE =
    120;


const HALF =
    WORLD_SIZE / 2;


const WALL_HEIGHT =
    4;


const WALL_THICKNESS =
    0.4;


/*
==================================================
MATERIALS
==================================================
*/

const materials = {

    floor:
        new THREE.MeshStandardMaterial({
            color: 0x10131b,
            roughness: 0.85
        }),


    floorMetal:
        new THREE.MeshStandardMaterial({
            color: 0x202632,
            metalness: 0.65,
            roughness: 0.4
        }),


    wall:
        new THREE.MeshStandardMaterial({
            color: 0x272c39,
            roughness: 0.72
        }),


    ceiling:
        new THREE.MeshStandardMaterial({
            color: 0x11141d,
            roughness: 0.8
        }),


    research:
        new THREE.MeshStandardMaterial({
            color: 0x31577c,
            metalness: 0.35,
            roughness: 0.45
        }),


    security:
        new THREE.MeshStandardMaterial({
            color: 0x59323e,
            metalness: 0.35,
            roughness: 0.5
        }),


    medical:
        new THREE.MeshStandardMaterial({
            color: 0x315b55,
            metalness: 0.3,
            roughness: 0.45
        }),


    engineering:
        new THREE.MeshStandardMaterial({
            color: 0x5a4829,
            metalness: 0.45,
            roughness: 0.45
        }),


    metal:
        new THREE.MeshStandardMaterial({
            color: 0x444a58,
            metalness: 0.8,
            roughness: 0.3
        }),


    blue:
        new THREE.MeshStandardMaterial({
            color: 0x3c75ff,
            emissive: 0x122c88,
            emissiveIntensity: 2
        }),


    cyan:
        new THREE.MeshStandardMaterial({
            color: 0x32e5ff,
            emissive: 0x064a60,
            emissiveIntensity: 2
        }),


    red:
        new THREE.MeshStandardMaterial({
            color: 0xff3040,
            emissive: 0x700000,
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

function box(
    scene,
    x,
    y,
    z,
    width,
    height,
    depth,
    material
) {

    const mesh =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                width,
                height,
                depth
            ),
            material
        );


    mesh.position.set(
        x,
        y,
        z
    );


    mesh.castShadow =
        true;

    mesh.receiveShadow =
        true;


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

function floor(
    scene,
    x,
    z,
    width,
    depth
) {

    box(
        scene,
        x,
        -0.08,
        z,
        width,
        0.16,
        depth,
        materials.floorMetal
    );

}


/*
==================================================
WALL
==================================================
*/

function wall(
    scene,
    collision,
    x,
    z,
    width,
    depth
) {

    box(
        scene,
        x,
        WALL_HEIGHT / 2,
        z,
        width,
        WALL_HEIGHT,
        depth,
        materials.wall
    );


    collision.addWall(
        x,
        z,
        width,
        depth
    );

}


/*
==================================================
WALL WITH DOOR

The wall is split into:

LEFT SEGMENT
DOOR
RIGHT SEGMENT
==================================================
*/

function horizontalDoorWall(
    scene,
    collision,
    x,
    z,
    totalWidth,
    doorWidth
) {

    const remaining =
        totalWidth -
        doorWidth;


    const segment =
        remaining / 2;


    if (
        segment > 0
    ) {

        wall(
            scene,
            collision,
            x -
            doorWidth / 2 -
            segment / 2,
            z,
            segment,
            WALL_THICKNESS
        );


        wall(
            scene,
            collision,
            x +
            doorWidth / 2 +
            segment / 2,
            z,
            segment,
            WALL_THICKNESS
        );

    }

}


/*
==================================================
VERTICAL DOOR WALL
==================================================
*/

function verticalDoorWall(
    scene,
    collision,
    x,
    z,
    totalDepth,
    doorWidth
) {

    const remaining =
        totalDepth -
        doorWidth;


    const segment =
        remaining / 2;


    if (
        segment > 0
    ) {

        wall(
            scene,
            collision,
            x,
            z -
            doorWidth / 2 -
            segment / 2,
            WALL_THICKNESS,
            segment
        );


        wall(
            scene,
            collision,
            x,
            z +
            doorWidth / 2 +
            segment / 2,
            WALL_THICKNESS,
            segment
        );

    }

}


/*
==================================================
ROOM
==================================================
*/

function room(
    scene,
    collision,
    x,
    z,
    width,
    depth,
    material,
    doorSide = "south"
) {

    floor(
        scene,
        x,
        z,
        width,
        depth
    );


    /*
    ----------------------------------------------
    NORTH
    ----------------------------------------------
    */

    if (
        doorSide ===
        "north"
    ) {

        horizontalDoorWall(
            scene,
            collision,
            x,
            z - depth / 2,
            width,
            5
        );

    } else {

        wall(
            scene,
            collision,
            x,
            z - depth / 2,
            width,
            WALL_THICKNESS
        );

    }


    /*
    SOUTH
    ----------------------------------------------
    */

    if (
        doorSide ===
        "south"
    ) {

        horizontalDoorWall(
            scene,
            collision,
            x,
            z + depth / 2,
            width,
            5
        );

    } else {

        wall(
            scene,
            collision,
            x,
            z + depth / 2,
            width,
            WALL_THICKNESS
        );

    }


    /*
    WEST
    ----------------------------------------------
    */

    if (
        doorSide ===
        "west"
    ) {

        verticalDoorWall(
            scene,
            collision,
            x - width / 2,
            z,
            depth,
            5
        );

    } else {

        wall(
            scene,
            collision,
            x - width / 2,
            z,
            WALL_THICKNESS,
            depth
        );

    }


    /*
    EAST
    ----------------------------------------------
    */

    if (
        doorSide ===
        "east"
    ) {

        verticalDoorWall(
            scene,
            collision,
            x + width / 2,
            z,
            depth,
            5
        );

    } else {

        wall(
            scene,
            collision,
            x + width / 2,
            z,
            WALL_THICKNESS,
            depth
        );

    }


    /*
    Ceiling
    */

    box(
        scene,
        x,
        4.1,
        z,
        width,
        0.2,
        depth,
        materials.ceiling
    );


    /*
    Lights
    */

    light(
        scene,
        x,
        z,
        0x566cff
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

function corridor(
    scene,
    x,
    z,
    width,
    depth
) {

    floor(
        scene,
        x,
        z,
        width,
        depth
    );


    /*
    Corridor ceiling
    */

    box(
        scene,
        x,
        4.1,
        z,
        width,
        0.2,
        depth,
        materials.ceiling
    );


    /*
    Blue navigation strip
    */

    box(
        scene,
        x,
        0.02,
        z,
        Math.min(
            width,
            1
        ),
        0.04,
        Math.min(
            depth,
            1
        ),
        materials.blue
    );

}


/*
==================================================
LIGHT
==================================================
*/

function light(
    scene,
    x,
    z,
    color
) {

    const l =
        new THREE.PointLight(
            color,
            5,
            18
        );


    l.position.set(
        x,
        3.4,
        z
    );


    scene.add(
        l
    );


    box(
        scene,
        x,
        3.92,
        z,
        2,
        0.08,
        0.3,
        new THREE.MeshStandardMaterial({
            color,
            emissive: color,
            emissiveIntensity: 2
        })
    );

}


/*
==================================================
CENTRAL HUB
==================================================
*/

function centralHub(
    scene,
    collision
) {

    floor(
        scene,
        0,
        0,
        30,
        30
    );


    /*
    Four open exits.
    */

    horizontalDoorWall(
        scene,
        collision,
        0,
        -15,
        30,
        7
    );


    horizontalDoorWall(
        scene,
        collision,
        0,
        15,
        30,
        7
    );


    verticalDoorWall(
        scene,
        collision,
        -15,
        0,
        30,
        7
    );


    verticalDoorWall(
        scene,
        collision,
        15,
        0,
        30,
        7
    );


    /*
    Ceiling
    */

    box(
        scene,
        0,
        4.1,
        0,
        30,
        0.2,
        30,
        materials.ceiling
    );


    /*
    Lights
    */

    light(
        scene,
        -8,
        -8,
        0x596cff
    );


    light(
        scene,
        8,
        -8,
        0x596cff
    );


    light(
        scene,
        -8,
        8,
        0x596cff
    );


    light(
        scene,
        8,
        8,
        0x596cff
    );


    /*
    Central pillar
    */

    box(
        scene,
        0,
        1.5,
        0,
        1,
        3,
        1,
        materials.metal
    );

}


/*
==================================================
RESEARCH
==================================================
*/

function research(
    scene,
    collision
) {

    /*
    Main research building
    */

    room(
        scene,
        collision,
        -32,
        -38,
        26,
        22,
        materials.research,
        "south"
    );


    room(
        scene,
        collision,
        0,
        -48,
        22,
        16,
        materials.research,
        "south"
    );


    /*
    Connection corridor
    */

    corridor(
        scene,
        -16,
        -23,
        8,
        20
    );


    corridor(
        scene,
        0,
        -36,
        8,
        20
    );

}


/*
==================================================
SECURITY
==================================================
*/

function security(
    scene,
    collision
) {

    room(
        scene,
        collision,
        -32,
        38,
        26,
        22,
        materials.security,
        "north"
    );


    room(
        scene,
        collision,
        0,
        48,
        22,
        16,
        materials.security,
        "north"
    );


    corridor(
        scene,
        -16,
        23,
        8,
        20
    );


    corridor(
        scene,
        0,
        36,
        8,
        20
    );

}


/*
==================================================
MEDICAL
==================================================
*/

function medical(
    scene,
    collision
) {

    room(
        scene,
        collision,
        -38,
        -8,
        22,
        26,
        materials.medical,
        "east"
    );


    room(
        scene,
        collision,
        -48,
        18,
        16,
        22,
        materials.medical,
        "east"
    );


    corridor(
        scene,
        -23,
        -8,
        20,
        8
    );


    corridor(
        scene,
        -36,
        18,
        20,
        8
    );

}


/*
==================================================
ENGINEERING
==================================================
*/

function engineering(
    scene,
    collision
) {

    room(
        scene,
        collision,
        38,
        -8,
        22,
        26,
        materials.engineering,
        "west"
    );


    room(
        scene,
        collision,
        48,
        18,
        16,
        22,
        materials.engineering,
        "west"
    );


    corridor(
        scene,
        23,
        -8,
        20,
        8
    );


    corridor(
        scene,
        36,
        18,
        20,
        8
    );

}


/*
==================================================
OUTER BOUNDARY
==================================================
*/

function boundary(
    scene,
    collision
) {

    wall(
        scene,
        collision,
        0,
        -HALF,
        WORLD_SIZE,
        0.6
    );


    wall(
        scene,
        collision,
        0,
        HALF,
        WORLD_SIZE,
        0.6
    );


    wall(
        scene,
        collision,
        -HALF,
        0,
        0.6,
        WORLD_SIZE
    );


    wall(
        scene,
        collision,
        HALF,
        0,
        0.6,
        WORLD_SIZE
    );

}


/*
==================================================
WORLD
==================================================
*/

world.create =
function(
    scene,
    collision
) {

    /*
    Clear old collision.
    */

    if (
        collision &&
        typeof collision.clear ===
        "function"
    ) {

        collision.clear();

    }


    /*
    Massive base floor.
    */

    floor(
        scene,
        0,
        0,
        WORLD_SIZE,
        WORLD_SIZE
    );


    /*
    Main station.
    */

    centralHub(
        scene,
        collision
    );


    research(
        scene,
        collision
    );


    security(
        scene,
        collision
    );


    medical(
        scene,
        collision
    );


    engineering(
        scene,
        collision
    );


    /*
    Outer boundary.
    */

    boundary(
        scene,
        collision
    );


    /*
    Ambient light.
    */

    const ambient =
        new THREE.HemisphereLight(
            0x6677aa,
            0x111111,
            1.1
        );


    scene.add(
        ambient
    );


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
                id: "central",
                name: "Central Hub"
            },

            {
                id: "research",
                name: "Research Sector"
            },

            {
                id: "security",
                name: "Security Sector"
            },

            {
                id: "medical",
                name: "Medical Sector"
            },

            {
                id: "engineering",
                name: "Engineering Sector"
            }

        ]

    };

};


export default world;
