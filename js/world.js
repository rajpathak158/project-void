import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


const world = {};


/*
==================================================
PROJECT: VOID
MASSIVE STATION WORLD
==================================================

WORLD:
180 x 180

HEIGHT:
8.2

MAIN AREAS:

                    COMMAND
                       |
                 RESEARCH
                       |
        SECURITY — CENTRAL — ENGINEERING
                       |
                  MEDICAL
                       |
                    REACTOR

WEST:
    CARGO
    MAINTENANCE
    QUARANTINE

EAST:
    HANGAR
    DOCKING

==================================================
*/


const WORLD_SIZE = 180;

const HALF_WORLD =
    WORLD_SIZE / 2;

const WALL_HEIGHT = 4;

const WALL_THICKNESS = 0.4;

const FLOOR_Y = 0;

const CEILING_Y = 4.15;


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

            metalness: 0.5,

            roughness: 0.5

        }),


    floorDark:
        new THREE.MeshStandardMaterial({

            color: 0x10131b,

            metalness: 0.35,

            roughness: 0.65

        }),


    wall:
        new THREE.MeshStandardMaterial({

            color: 0x252b38,

            roughness: 0.72

        }),


    wallDark:
        new THREE.MeshStandardMaterial({

            color: 0x171b25,

            roughness: 0.82

        }),


    metal:
        new THREE.MeshStandardMaterial({

            color: 0x414856,

            metalness: 0.78,

            roughness: 0.32

        }),


    research:
        new THREE.MeshStandardMaterial({

            color: 0x29486d,

            metalness: 0.3,

            roughness: 0.5

        }),


    security:
        new THREE.MeshStandardMaterial({

            color: 0x4a3039,

            metalness: 0.3,

            roughness: 0.52

        }),


    medical:
        new THREE.MeshStandardMaterial({

            color: 0x28504b,

            metalness: 0.25,

            roughness: 0.5

        }),


    engineering:
        new THREE.MeshStandardMaterial({

            color: 0x51432a,

            metalness: 0.4,

            roughness: 0.48

        }),


    reactor:
        new THREE.MeshStandardMaterial({

            color: 0x49342b,

            metalness: 0.55,

            roughness: 0.4

        }),


    command:
        new THREE.MeshStandardMaterial({

            color: 0x38315b,

            metalness: 0.35,

            roughness: 0.45

        }),


    cargo:
        new THREE.MeshStandardMaterial({

            color: 0x3c4148,

            metalness: 0.55,

            roughness: 0.48

        }),


    hangar:
        new THREE.MeshStandardMaterial({

            color: 0x283b4b,

            metalness: 0.6,

            roughness: 0.4

        }),


    quarantine:
        new THREE.MeshStandardMaterial({

            color: 0x33462f,

            metalness: 0.3,

            roughness: 0.55

        }),


    maintenance:
        new THREE.MeshStandardMaterial({

            color: 0x3f3a31,

            metalness: 0.5,

            roughness: 0.5

        }),


    blue:
        new THREE.MeshStandardMaterial({

            color: 0x3474ff,

            emissive: 0x102b82,

            emissiveIntensity: 1.6

        }),


    cyan:
        new THREE.MeshStandardMaterial({

            color: 0x39e1ff,

            emissive: 0x073b55,

            emissiveIntensity: 2

        }),


    red:
        new THREE.MeshStandardMaterial({

            color: 0xff303d,

            emissive: 0x650000,

            emissiveIntensity: 2

        }),


    yellow:
        new THREE.MeshStandardMaterial({

            color: 0xffc247,

            emissive: 0x5a3800,

            emissiveIntensity: 1.8

        }),


    green:
        new THREE.MeshStandardMaterial({

            color: 0x43e69a,

            emissive: 0x0b5835,

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

function createFloor(
    scene,
    x,
    z,
    width,
    depth,
    material = materials.floor
) {

    return createBox(

        scene,

        x,

        FLOOR_Y,

        z,

        width,

        0.25,

        depth,

        material

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

        CEILING_Y,

        z,

        width,

        0.12,

        depth,

        materials.wallDark

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
    material = materials.wall
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
HORIZONTAL WALL WITH DOOR
==================================================

Creates:

wall ---- DOOR ---- wall

doorWidth = opening size

==================================================
*/

function horizontalWallWithDoor(
    scene,
    collision,
    x,
    z,
    totalWidth,
    doorWidth,
    material = materials.wall
) {

    const sideWidth =
        (totalWidth - doorWidth) / 2;


    if (sideWidth > 0.05) {

        createWall(

            scene,
            collision,

            x - (
                doorWidth / 2 +
                sideWidth / 2
            ),

            z,

            sideWidth,
            WALL_THICKNESS,
            material

        );


        createWall(

            scene,
            collision,

            x + (
                doorWidth / 2 +
                sideWidth / 2
            ),

            z,

            sideWidth,
            WALL_THICKNESS,
            material

        );

    }


    /*
    Door frame
    */

    createDoorFrame(

        scene,

        x,
        z,
        doorWidth,
        true

    );

}


/*
==================================================
VERTICAL WALL WITH DOOR
==================================================
*/

function verticalWallWithDoor(
    scene,
    collision,
    x,
    z,
    totalDepth,
    doorWidth,
    material = materials.wall
) {

    const sideDepth =
        (totalDepth - doorWidth) / 2;


    if (sideDepth > 0.05) {

        createWall(

            scene,
            collision,

            x,

            z - (
                doorWidth / 2 +
                sideDepth / 2
            ),

            WALL_THICKNESS,
            sideDepth,
            material

        );


        createWall(

            scene,
            collision,

            x,

            z + (
                doorWidth / 2 +
                sideDepth / 2
            ),

            WALL_THICKNESS,
            sideDepth,
            material

        );

    }


    createDoorFrame(

        scene,

        x,
        z,
        doorWidth,
        false

    );

}


/*
==================================================
DOOR FRAME
==================================================
*/

function createDoorFrame(
    scene,
    x,
    z,
    width,
    horizontal
) {

    const frameMaterial =
        new THREE.MeshStandardMaterial({

            color: 0x263b55,

            emissive: 0x0b1c35,

            emissiveIntensity: 1

        });


    if (horizontal) {

        createBox(

            scene,

            x - width / 2,

            2,

            z,

            0.12,
            4,
            0.48,
            frameMaterial

        );


        createBox(

            scene,

            x + width / 2,

            2,

            z,

            0.12,
            4,
            0.48,
            frameMaterial

        );


        createBox(

            scene,

            x,

            3.9,

            z,

            width,
            0.15,
            0.48,
            frameMaterial

        );

    } else {

        createBox(

            scene,

            x,

            2,

            z - width / 2,

            0.48,
            4,
            0.12,
            frameMaterial

        );


        createBox(

            scene,

            x,

            2,

            z + width / 2,

            0.48,
            4,
            0.12,
            frameMaterial

        );


        createBox(

            scene,

            x,

            3.9,

            z,

            0.48,
            0.15,
            width,

            frameMaterial

        );

    }

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
    material,
    doors = {}
) {

    const north =
        doors.north || 0;

    const south =
        doors.south || 0;

    const east =
        doors.east || 0;

    const west =
        doors.west || 0;


    createFloor(

        scene,

        x,
        z,

        width,
        depth,

        materials.floorMetal

    );


    createCeiling(

        scene,

        x,
        z,

        width,
        depth

    );


    /*
    NORTH
    */

    if (north > 0) {

        horizontalWallWithDoor(

            scene,
            collision,

            x,
            z - depth / 2,

            width,
            north,
            material

        );

    } else {

        createWall(

            scene,
            collision,

            x,
            z - depth / 2,

            width,
            WALL_THICKNESS,
            material

        );

    }


    /*
    SOUTH
    */

    if (south > 0) {

        horizontalWallWithDoor(

            scene,
            collision,

            x,
            z + depth / 2,

            width,
            south,
            material

        );

    } else {

        createWall(

            scene,
            collision,

            x,
            z + depth / 2,

            width,
            WALL_THICKNESS,
            material

        );

    }


    /*
    EAST
    */

    if (east > 0) {

        verticalWallWithDoor(

            scene,
            collision,

            x + width / 2,
            z,

            depth,
            east,
            material

        );

    } else {

        createWall(

            scene,
            collision,

            x + width / 2,
            z,

            WALL_THICKNESS,
            depth,
            material

        );

    }


    /*
    WEST
    */

    if (west > 0) {

        verticalWallWithDoor(

            scene,
            collision,

            x - width / 2,
            z,

            depth,
            west,
            material

        );

    } else {

        createWall(

            scene,
            collision,

            x - width / 2,
            z,

            WALL_THICKNESS,
            depth,
            material

        );

    }


    /*
    Interior lighting
    */

    createLight(

        scene,

        x,
        z,

        0x566fff,
        4,
        18

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
    color = 0x3474ff
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
    Floor center strip
    */

    createBox(

        scene,

        x,
        0.02,
        z,

        Math.min(width, 0.16),
        0.025,
        Math.min(depth, 0.16),

        new THREE.MeshStandardMaterial({

            color: color,

            emissive: color,

            emissiveIntensity: 1.8

        })

    );


    /*
    Ceiling lights
    */

    const count =
        Math.max(

            1,

            Math.floor(
                Math.max(width, depth) / 8
            )

        );


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const t =
            count === 1
                ? 0
                : i / (count - 1);


        let lx = x;

        let lz = z;


        if (width >= depth) {

            lx =
                x -
                width / 2 +
                width * t;

        } else {

            lz =
                z -
                depth / 2 +
                depth * t;

        }


        createLight(

            scene,

            lx,
            lz,
            color,
            3,
            12

        );

    }

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
    color = 0x596cff,
    intensity = 4,
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
        3.55,
        z

    );


    scene.add(light);


    createBox(

        scene,

        x,
        3.94,
        z,

        1.6,
        0.08,
        0.3,

        new THREE.MeshStandardMaterial({

            color: color,

            emissive: color,

            emissiveIntensity: 2.2

        })

    );

}


/*
==================================================
STRIP
==================================================
*/

function createStrip(
    scene,
    x,
    z,
    width,
    depth,
    color = 0x3474ff
) {

    createBox(

        scene,

        x,

        0.035,

        z,

        width,
        0.035,
        depth,

        new THREE.MeshStandardMaterial({

            color: color,

            emissive: color,

            emissiveIntensity: 2

        })

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
    label,
    color = 0x3474ff
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
                1.45,
                0.5

            ),

            materials.metal

        );


    body.position.y =
        0.72;


    group.add(body);


    const screenMaterial =
        new THREE.MeshStandardMaterial({

            color: color,

            emissive: color,

            emissiveIntensity: 2

        });


    const screen =
        new THREE.Mesh(

            new THREE.BoxGeometry(

                0.58,
                0.42,
                0.05

            ),

            screenMaterial

        );


    screen.position.set(

        0,
        1.05,
        -0.27

    );


    group.add(screen);


    const light =
        new THREE.PointLight(

            color,

            1.5,
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

        label,

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

                0.7,
                0.7,
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

                0.4,
                0.4,
                0.3,
                24

            ),

            materials.red

        );


    button.position.y =
        0.4;


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
CRATES
==================================================
*/

function createCrates(
    scene,
    x,
    z,
    count
) {

    for (
        let i = 0;
        i < count;
        i++
    ) {

        const ox =
            (Math.random() - 0.5) * 7;

        const oz =
            (Math.random() - 0.5) * 7;


        createBox(

            scene,

            x + ox,

            0.65,

            z + oz,

            1.1,
            1.3,
            1.1,

            materials.cargo

        );

    }

}


/*
==================================================
REACTOR
==================================================
*/

function createReactor(
    scene,
    x,
    z
) {

    const core =
        new THREE.Mesh(

            new THREE.CylinderGeometry(

                2.2,
                2.2,
                4.5,
                32

            ),

            materials.metal

        );


    core.position.set(

        x,
        2.25,
        z

    );


    scene.add(core);


    const energy =
        new THREE.Mesh(

            new THREE.CylinderGeometry(

                1.15,
                1.15,
                3.8,
                32

            ),

            materials.cyan

        );


    energy.position.set(

        x,
        2.25,
        z

    );


    scene.add(energy);


    const glow =
        new THREE.PointLight(

            0x39e1ff,

            8,

            22

        );


    glow.position.set(

        x,
        2.5,
        z

    );


    scene.add(glow);

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
    42 x 42
    */

    createRoom(

        scene,
        collision,

        0,
        0,

        42,
        42,

        materials.wallDark,

        {

            north: 10,

            south: 10,

            east: 10,

            west: 10

        }

    );


    createStrip(

        scene,

        0,
        0,

        30,
        0.25,

        0x3474ff

    );


    createStrip(

        scene,

        0,
        0,

        0.25,
        30,

        0x3474ff

    );


    createEmergencyButton(

        scene,

        0,
        0

    );


    createTaskTerminal(

        scene,

        0,
        -8,

        "CENTRAL CONTROL"

    );


    createTaskTerminal(

        scene,

        -8,
        0,

        "STATION NETWORK"

    );


    createTaskTerminal(

        scene,

        8,
        0,

        "MISSION CONTROL"

    );


    createTaskTerminal(

        scene,

        0,
        8,

        "COMMUNICATIONS"

    );


    /*
    Decorative pillars
    */

    const positions = [

        [-14, -14],

        [14, -14],

        [-14, 14],

        [14, 14]

    ];


    for (
        const [x, z] of positions
    ) {

        createBox(

            scene,

            x,
            1.5,
            z,

            0.6,
            3,
            0.6,

            materials.metal

        );

    }

}


/*
==================================================
NORTH RESEARCH
==================================================
*/

function createResearch(
    scene,
    collision
) {

    createRoom(

        scene,
        collision,

        0,
        -60,

        48,
        28,

        materials.research,

        {

            south: 12,

            north: 8

        }

    );


    createRoom(

        scene,
        collision,

        -30,
        -60,

        24,
        28,

        materials.research,

        {

            east: 8

        }

    );


    createRoom(

        scene,
        collision,

        30,
        -60,

        24,
        28,

        materials.research,

        {

            west: 8

        }

    );


    createTaskTerminal(

        scene,

        -10,
        -60,

        "RESEARCH CORE",

        0x39e1ff

    );


    createTaskTerminal(

        scene,

        10,
        -60,

        "LABORATORY",

        0x39e1ff

    );


    createTaskTerminal(

        scene,

        -30,
        -60,

        "SPECIMEN CONTROL",

        0x39e1ff

    );


    createTaskTerminal(

        scene,

        30,
        -60,

        "DATA ANALYSIS",

        0x39e1ff

    );

}


/*
==================================================
SOUTH SECURITY
==================================================
*/

function createSecurity(
    scene,
    collision
) {

    createRoom(

        scene,
        collision,

        0,
        60,

        48,
        28,

        materials.security,

        {

            north: 12,

            south: 8

        }

    );


    createRoom(

        scene,
        collision,

        -30,
        60,

        24,
        28,

        materials.security,

        {

            east: 8

        }

    );


    createRoom(

        scene,
        collision,

        30,
        60,

        24,
        28,

        materials.security,

        {

            west: 8

        }

    );


    createTaskTerminal(

        scene,

        -12,
        60,

        "SECURITY CONTROL",

        0xff3d55

    );


    createTaskTerminal(

        scene,

        12,
        60,

        "SURVEILLANCE",

        0xff3d55

    );


    createEmergencyButton(

        scene,

        0,
        60

    );

}


/*
==================================================
WEST MEDICAL
==================================================
*/

function createMedical(
    scene,
    collision
) {

    createRoom(

        scene,
        collision,

        -60,
        0,

        28,
        48,

        materials.medical,

        {

            east: 12,

            west: 8

        }

    );


    createRoom(

        scene,
        collision,

        -60,
        -32,

        28,
        22,

        materials.medical,

        {

            south: 8

        }

    );


    createRoom(

        scene,
        collision,

        -60,
        32,

        28,
        22,

        materials.quarantine,

        {

            north: 8

        }

    );


    createTaskTerminal(

        scene,

        -60,
        -8,

        "MEDICAL SYSTEM",

        0x43e69a

    );


    createTaskTerminal(

        scene,

        -60,
        8,

        "LIFE SUPPORT",

        0x43e69a

    );


    createTaskTerminal(

        scene,

        -60,
        32,

        "QUARANTINE CONTROL",

        0xffc247

    );

}


/*
==================================================
EAST ENGINEERING
==================================================
*/

function createEngineering(
    scene,
    collision
) {

    createRoom(

        scene,
        collision,

        60,
        0,

        28,
        48,

        materials.engineering,

        {

            west: 12,

            east: 8

        }

    );


    createRoom(

        scene,
        collision,

        60,
        -32,

        28,
        22,

        materials.maintenance,

        {

            south: 8

        }

    );


    createRoom(

        scene,
        collision,

        60,
        32,

        28,
        22,

        materials.reactor,

        {

            north: 8

        }

    );


    createTaskTerminal(

        scene,

        60,
        -8,

        "ENGINE CONTROL",

        0xffc247

    );


    createTaskTerminal(

        scene,

        60,
        8,

        "POWER SYSTEM",

        0xffc247

    );


    createTaskTerminal(

        scene,

        60,
        32,

        "REACTOR CONTROL",

        0x39e1ff

    );


    createReactor(

        scene,

        60,
        32

    );

}


/*
==================================================
COMMAND
==================================================
*/

function createCommand(
    scene,
    collision
) {

    createRoom(

        scene,
        collision,

        0,
        -82,

        44,
        16,

        materials.command,

        {

            south: 10

        }

    );


    createTaskTerminal(

        scene,

        -12,
        -82,

        "COMMAND",

        0xb66cff

    );


    createTaskTerminal(

        scene,

        12,
        -82,

        "NAVIGATION",

        0xb66cff

    );

}


/*
==================================================
HANGAR
==================================================
*/

function createHangar(
    scene,
    collision
) {

    createRoom(

        scene,
        collision,

        82,
        0,

        16,
        52,

        materials.hangar,

        {

            west: 10

        }

    );


    createRoom(

        scene,
        collision,

        82,
        -35,

        16,
        18,

        materials.hangar,

        {

            south: 7

        }

    );


    createRoom(

        scene,
        collision,

        82,
        35,

        16,
        18,

        materials.hangar,

        {

            north: 7

        }

    );


    createCrates(

        scene,

        82,
        0,

        10

    );


    createTaskTerminal(

        scene,

        82,
        -35,

        "DOCKING CONTROL",

        0x39e1ff

    );


    createTaskTerminal(

        scene,

        82,
        35,

        "HANGAR CONTROL",

        0x39e1ff

    );

}


/*
==================================================
CARGO
==================================================
*/

function createCargo(
    scene,
    collision
) {

    createRoom(

        scene,
        collision,

        -82,
        0,

        16,
        52,

        materials.cargo,

        {

            east: 10

        }

    );


    createCrates(

        scene,

        -82,
        0,

        18

    );


    createTaskTerminal(

        scene,

        -82,
        -20,

        "CARGO SYSTEM",

        0xffc247

    );


    createTaskTerminal(

        scene,

        -82,
        20,

        "LOGISTICS",

        0xffc247

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
    NORTH
    */

    createCorridor(

        scene,

        0,
        -51,

        12,
        18,

        0x3474ff

    );


    createCorridor(

        scene,

        0,
        -71,

        12,
        14,

        0x596cff

    );


    /*
    SOUTH
    */

    createCorridor(

        scene,

        0,
        51,

        12,
        18,

        0xff3d55

    );


    /*
    WEST
    */

    createCorridor(

        scene,

        -51,
        0,

        18,
        12,

        0x43e69a

    );


    createCorridor(

        scene,

        -71,
        0,

        14,
        12,

        0xffc247

    );


    /*
    EAST
    */

    createCorridor(

        scene,

        51,
        0,

        18,
        12,

        0xffc247

    );


    createCorridor(

        scene,

        71,
        0,

        14,
        12,

        0x39e1ff

    );


    /*
    Diagonal / secondary circulation
    */

    createCorridor(

        scene,

        -35,
        -35,

        10,
        10,

        0x3474ff

    );


    createCorridor(

        scene,

        35,
        -35,

        10,
        10,

        0x39e1ff

    );


    createCorridor(

        scene,

        -35,
        35,

        10,
        10,

        0x43e69a

    );


    createCorridor(

        scene,

        35,
        35,

        10,
        10,

        0xffc247

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
        WALL_THICKNESS,
        materials.wallDark

    );


    createWall(

        scene,
        collision,

        0,
        HALF_WORLD,

        size,
        WALL_THICKNESS,
        materials.wallDark

    );


    createWall(

        scene,
        collision,

        -HALF_WORLD,
        0,

        WALL_THICKNESS,
        size,
        materials.wallDark

    );


    createWall(

        scene,
        collision,

        HALF_WORLD,
        0,

        WALL_THICKNESS,
        size,
        materials.wallDark

    );

}


/*
==================================================
WORLD FLOOR
==================================================
*/

function createWorldFloor(
    scene
) {

    /*
    ONE giant floor only.

    No overlapping floor slabs.
    This prevents Z-fighting.
    */

    createFloor(

        scene,

        0,
        0,

        WORLD_SIZE - 2,
        WORLD_SIZE - 2,

        materials.floor

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
    Central lights
    */

    const lights = [

        [-15, -15],

        [15, -15],

        [-15, 15],

        [15, 15],

        [0, 0]

    ];


    for (
        const [x, z] of lights
    ) {

        createLight(

            scene,

            x,
            z,

            0x596cff,
            5,
            20

        );

    }


    /*
    Navigation strips
    */

    for (
        let i = -80;
        i <= 80;
        i += 20
    ) {

        createStrip(

            scene,

            i,
            0,

            6,
            0.12,

            0x273cff

        );


        createStrip(

            scene,

            0,
            i,

            0.12,
            6,

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
    ------------------------------------------
    CLEAR OLD COLLISION
    ------------------------------------------
    */

    if (
        collision &&
        typeof collision.clear ===
        "function"
    ) {

        collision.clear();

    }


    /*
    ------------------------------------------
    ONE GLOBAL FLOOR
    ------------------------------------------
    */

    createWorldFloor(
        scene
    );


    /*
    ------------------------------------------
    CENTRAL
    ------------------------------------------
    */

    createCentralHub(
        scene,
        collision
    );


    /*
    ------------------------------------------
    NORTH
    ------------------------------------------
    */

    createResearch(
        scene,
        collision
    );


    createCommand(
        scene,
        collision
    );


    /*
    ------------------------------------------
    SOUTH
    ------------------------------------------
    */

    createSecurity(
        scene,
        collision
    );


    /*
    ------------------------------------------
    WEST
    ------------------------------------------
    */

    createMedical(
        scene,
        collision
    );


    createCargo(
        scene,
        collision
    );


    /*
    ------------------------------------------
    EAST
    ------------------------------------------
    */

    createEngineering(
        scene,
        collision
    );


    createHangar(
        scene,
        collision
    );


    /*
    ------------------------------------------
    CORRIDORS
    ------------------------------------------
    */

    createConnections(
        scene
    );


    /*
    ------------------------------------------
    BOUNDARY
    ------------------------------------------
    */

    createOuterBoundary(
        scene,
        collision
    );


    /*
    ------------------------------------------
    DECORATION
    ------------------------------------------
    */

    createDecoration(
        scene
    );


    /*
    ------------------------------------------
    WORLD INFORMATION
    ------------------------------------------
    */

    return {

        size:
            WORLD_SIZE,

        height:
            WALL_HEIGHT,

        mapId:
            "VOID-STATION-01",

        mapName:
            "The Void Station",

        spawn: {

            x: 0,

            y: 0,

            z: 0

        },

        rooms: [

            "Central Hub",

            "Research Sector",

            "Command",

            "Security Sector",

            "Medical Sector",

            "Quarantine",

            "Cargo",

            "Engineering Sector",

            "Maintenance",

            "Reactor",

            "Hangar",

            "Docking"

        ],

        maps: [

            {

                id:
                    "VOID-STATION-01",

                name:
                    "The Void Station",

                size:
                    "180x180"

            },

            {

                id:
                    "VOID-STATION-02",

                name:
                    "Deep Research Facility",

                size:
                    "Coming Soon"

            },

            {

                id:
                    "VOID-STATION-03",

                name:
                    "Orbital Colony",

                size:
                    "Coming Soon"

            }

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
                    "command",

                name:
                    "Command"

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
                    "quarantine",

                name:
                    "Quarantine"

            },

            {

                id:
                    "cargo",

                name:
                    "Cargo"

            },

            {

                id:
                    "engineering",

                name:
                    "Engineering"

            },

            {

                id:
                    "maintenance",

                name:
                    "Maintenance"

            },

            {

                id:
                    "reactor",

                name:
                    "Reactor"

            },

            {

                id:
                    "hangar",

                name:
                    "Hangar"

            },

            {

                id:
                    "docking",

                name:
                    "Docking"

            }

        ],

        tasks: [

            "CENTRAL CONTROL",

            "STATION NETWORK",

            "MISSION CONTROL",

            "COMMUNICATIONS",

            "RESEARCH CORE",

            "LABORATORY",

            "SPECIMEN CONTROL",

            "DATA ANALYSIS",

            "COMMAND",

            "NAVIGATION",

            "SECURITY CONTROL",

            "SURVEILLANCE",

            "MEDICAL SYSTEM",

            "LIFE SUPPORT",

            "QUARANTINE CONTROL",

            "CARGO SYSTEM",

            "LOGISTICS",

            "ENGINE CONTROL",

            "POWER SYSTEM",

            "REACTOR CONTROL",

            "DOCKING CONTROL",

            "HANGAR CONTROL"

        ],

        emergencyButton:
            true

    };

};


export default world;
