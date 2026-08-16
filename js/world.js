import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


/*
==================================================
PROJECT: VOID
WORLD ENGINE v4
==================================================
*/


const world = {};

const WORLD_SIZE = 160;
const HALF = WORLD_SIZE / 2;

const WALL_H = 7;
const WALL_T = 0.6;


/*
==================================================
MATERIALS
==================================================
*/

function mat(
    color,
    metalness = 0.3,
    roughness = 0.55,
    emissive = 0x000000,
    intensity = 0
) {

    return new THREE.MeshStandardMaterial({

        color,
        metalness,
        roughness,
        emissive,
        emissiveIntensity: intensity

    });

}


const M = {

    floor:
        mat(0x111722, 0.65, 0.5),

    floorDark:
        mat(0x090d15, 0.7, 0.5),

    wall:
        mat(0x28344a, 0.55, 0.42),

    research:
        mat(
            0x24558a,
            0.45,
            0.42,
            0x071b42,
            0.5
        ),

    security:
        mat(
            0x702637,
            0.45,
            0.42,
            0x300711,
            0.5
        ),

    medical:
        mat(
            0x17695f,
            0.4,
            0.42,
            0x05352f,
            0.5
        ),

    engineering:
        mat(
            0x8a5b22,
            0.5,
            0.4,
            0x3a2205,
            0.5
        ),

    metal:
        mat(0x343e50, 0.8, 0.32),

    dark:
        mat(0x171d29, 0.8, 0.35),

    cyan:
        mat(
            0x24eaff,
            0.2,
            0.2,
            0x00cfff,
            3
        ),

    blue:
        mat(
            0x4c72ff,
            0.2,
            0.2,
            0x1738ff,
            3
        ),

    green:
        mat(
            0x35ffb0,
            0.2,
            0.2,
            0x00c875,
            3
        ),

    red:
        mat(
            0xff3d55,
            0.2,
            0.2,
            0xff001d,
            3
        ),

    orange:
        mat(
            0xffa52f,
            0.2,
            0.2,
            0xff5a00,
            3
        )

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
    w,
    h,
    d,
    material,
    options = {}
) {

    const mesh =
        new THREE.Mesh(

            new THREE.BoxGeometry(
                w,
                h,
                d
            ),

            material

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


    if (options.task) {

        mesh.userData.task =
            true;

    }


    if (options.decoration) {

        mesh.userData.decoration =
            true;

    }


    scene.add(mesh);

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
    w,
    d,
    material = M.floor
) {

    return box(
        scene,
        x,
        -0.1,
        z,
        w,
        0.2,
        d,
        material
    );

}


/*
==================================================
SOLID WALL
==================================================
*/

function wall(
    scene,
    x,
    z,
    w,
    d,
    material = M.wall
) {

    return box(
        scene,
        x,
        WALL_H / 2,
        z,
        w,
        WALL_H,
        d,
        material
    );

}


/*
==================================================
HORIZONTAL WALL WITH DOOR
==================================================
*/

function wallH(
    scene,
    x,
    z,
    width,
    doorWidth,
    material
) {

    const side =
        (width - doorWidth) / 2;


    if (side <= 0) {

        wall(
            scene,
            x,
            z,
            width,
            WALL_T,
            material
        );

        return;

    }


    wall(
        scene,
        x -
        (doorWidth / 2) -
        (side / 2),
        z,
        side,
        WALL_T,
        material
    );


    wall(
        scene,
        x +
        (doorWidth / 2) +
        (side / 2),
        z,
        side,
        WALL_T,
        material
    );

}


/*
==================================================
VERTICAL WALL WITH DOOR
==================================================
*/

function wallV(
    scene,
    x,
    z,
    depth,
    doorWidth,
    material
) {

    const side =
        (depth - doorWidth) / 2;


    if (side <= 0) {

        wall(
            scene,
            x,
            z,
            WALL_T,
            depth,
            material
        );

        return;

    }


    wall(
        scene,
        x,
        z -
        (doorWidth / 2) -
        (side / 2),
        WALL_T,
        side,
        material
    );


    wall(
        scene,
        x,
        z +
        (doorWidth / 2) +
        (side / 2),
        WALL_T,
        side,
        material
    );

}


/*
==================================================
NEON FLOOR STRIP
==================================================
*/

function strip(
    scene,
    x,
    z,
    w,
    d,
    material
) {

    box(
        scene,
        x,
        0.035,
        z,
        w,
        0.06,
        d,
        material,
        {
            noCollision: true,
            decoration: true,
            castShadow: false
        }
    );

}


/*
==================================================
ROOM LIGHT
==================================================
*/

function light(
    scene,
    x,
    z,
    color
) {

    /*
    Small emissive panel.
    No point light on every terminal.
    */

    box(
        scene,
        x,
        WALL_H - 0.25,
        z,
        2.5,
        0.08,
        0.35,
        color,
        {
            noCollision: true,
            decoration: true,
            castShadow: false,
            receiveShadow: false
        }
    );

}


/*
==================================================
ROOM
==================================================
*/

function room(
    scene,
    x,
    z,
    w,
    d,
    material,
    neon,
    door
) {

    floor(
        scene,
        x,
        z,
        w,
        d
    );


    /*
    NORTH
    */

    if (door === "north") {

        wallH(
            scene,
            x,
            z - d / 2,
            w,
            7,
            material
        );

    } else {

        wall(
            scene,
            x,
            z - d / 2,
            w,
            WALL_T,
            material
        );

    }


    /*
    SOUTH
    */

    if (door === "south") {

        wallH(
            scene,
            x,
            z + d / 2,
            w,
            7,
            material
        );

    } else {

        wall(
            scene,
            x,
            z + d / 2,
            w,
            WALL_T,
            material
        );

    }


    /*
    WEST
    */

    if (door === "west") {

        wallV(
            scene,
            x - w / 2,
            z,
            d,
            7,
            material
        );

    } else {

        wall(
            scene,
            x - w / 2,
            z,
            WALL_T,
            d,
            material
        );

    }


    /*
    EAST
    */

    if (door === "east") {

        wallV(
            scene,
            x + w / 2,
            z,
            d,
            7,
            material
        );

    } else {

        wall(
            scene,
            x + w / 2,
            z,
            WALL_T,
            d,
            material
        );

    }


    /*
    Floor lighting
    */

    strip(
        scene,
        x,
        z - d / 2 + 0.35,
        w - 1,
        0.12,
        neon
    );


    strip(
        scene,
        x,
        z + d / 2 - 0.35,
        w - 1,
        0.12,
        neon
    );


    light(
        scene,
        x,
        z,
        neon
    );

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
    w,
    d,
    neon
) {

    floor(
        scene,
        x,
        z,
        w,
        d,
        M.floorDark
    );


    strip(
        scene,
        x,
        z,
        0.16,
        d - 0.5,
        neon
    );


    light(
        scene,
        x,
        z,
        neon
    );

}


/*
==================================================
TASK TERMINAL
==================================================
*/

function createTask(
    scene,
    tasks,
    x,
    z,
    name,
    color
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
                1.1,
                1.7,
                0.55
            ),

            M.dark

        );


    body.position.y =
        0.85;


    body.castShadow =
        true;


    group.add(body);


    /*
    Screen
    */

    const screen =
        new THREE.Mesh(

            new THREE.BoxGeometry(
                0.78,
                0.55,
                0.06
            ),

            color

        );


    screen.position.set(
        0,
        1.15,
        -0.31
    );


    group.add(screen);


    /*
    Light
    */

    const indicator =
        new THREE.Mesh(

            new THREE.BoxGeometry(
                0.18,
                0.08,
                0.08
            ),

            color

        );


    indicator.position.set(
        0,
        0.48,
        -0.32
    );


    group.add(indicator);


    group.userData.task =
        true;


    group.userData.taskName =
        name;


    /*
    Important:
    TaskSystem uses this position.
    */

    scene.add(group);


    tasks.push({

        object: group,

        name: name,

        completed: false

    });


    return group;

}


/*
==================================================
CENTRAL HUB
==================================================
*/

function centralHub(
    scene
) {

    floor(
        scene,
        0,
        0,
        40,
        40,
        M.floor
    );


    wallH(
        scene,
        0,
        -20,
        40,
        8,
        M.wall
    );


    wallH(
        scene,
        0,
        20,
        40,
        8,
        M.wall
    );


    wallV(
        scene,
        -20,
        0,
        40,
        8,
        M.wall
    );


    wallV(
        scene,
        20,
        0,
        40,
        8,
        M.wall
    );


    /*
    Reactor
    */

    box(
        scene,
        0,
        1.4,
        0,
        3,
        2.8,
        3,
        M.dark
    );


    box(
        scene,
        0,
        2.9,
        0,
        2.3,
        0.12,
        2.3,
        M.cyan,
        {
            noCollision: true,
            decoration: true
        }
    );


    /*
    Task
    */

    createTask(
        scene,
        currentTasks,
        -8,
        0,
        "REACTOR CALIBRATION",
        M.cyan
    );


    createTask(
        scene,
        currentTasks,
        8,
        0,
        "NAVIGATION CONSOLE",
        M.cyan
    );

}


/*
==================================================
SECTORS
==================================================
*/

function createSectors(
    scene
) {

    /*
    RESEARCH
    */

    room(
        scene,
        -42,
        -52,
        34,
        28,
        M.research,
        M.blue,
        "south"
    );


    createTask(
        scene,
        currentTasks,
        -42,
        -52,
        "SAMPLE ANALYSIS",
        M.blue
    );


    room(
        scene,
        0,
        -60,
        30,
        22,
        M.research,
        M.blue,
        "south"
    );


    createTask(
        scene,
        currentTasks,
        0,
        -60,
        "LABORATORY TERMINAL",
        M.blue
    );


    corridor(
        scene,
        -21,
        -31,
        10,
        22,
        M.blue
    );


    /*
    SECURITY
    */

    room(
        scene,
        -42,
        52,
        34,
        28,
        M.security,
        M.red,
        "north"
    );


    createTask(
        scene,
        currentTasks,
        -42,
        52,
        "SECURITY CONSOLE",
        M.red
    );


    room(
        scene,
        0,
        60,
        30,
        22,
        M.security,
        M.red,
        "north"
    );


    createTask(
        scene,
        currentTasks,
        0,
        60,
        "CAMERA SYSTEM",
        M.red
    );


    corridor(
        scene,
        -21,
        31,
        10,
        22,
        M.red
    );


    /*
    MEDICAL
    */

    room(
        scene,
        -52,
        -8,
        28,
        34,
        M.medical,
        M.green,
        "east"
    );


    createTask(
        scene,
        currentTasks,
        -52,
        -8,
        "MEDICAL SCANNER",
        M.green
    );


    room(
        scene,
        -60,
        35,
        22,
        28,
        M.medical,
        M.green,
        "east"
    );


    createTask(
        scene,
        currentTasks,
        -60,
        35,
        "LIFE SUPPORT",
        M.green
    );


    corridor(
        scene,
        -31,
        -8,
        22,
        10,
        M.green
    );


    /*
    ENGINEERING
    */

    room(
        scene,
        52,
        -8,
        28,
        34,
        M.engineering,
        M.orange,
        "west"
    );


    createTask(
        scene,
        currentTasks,
        52,
        -8,
        "GENERATOR REPAIR",
        M.orange
    );


    room(
        scene,
        60,
        35,
        22,
        28,
        M.engineering,
        M.orange,
        "west"
    );


    createTask(
        scene,
        currentTasks,
        60,
        35,
        "POWER TERMINAL",
        M.orange
    );


    corridor(
        scene,
        31,
        -8,
        22,
        10,
        M.orange
    );

}


/*
==================================================
BOUNDARY
==================================================
*/

function boundary(
    scene
) {

    wall(
        scene,
        0,
        -HALF,
        WORLD_SIZE,
        1,
        M.dark
    );


    wall(
        scene,
        0,
        HALF,
        WORLD_SIZE,
        1,
        M.dark
    );


    wall(
        scene,
        -HALF,
        0,
        1,
        WORLD_SIZE,
        M.dark
    );


    wall(
        scene,
        HALF,
        0,
        1,
        WORLD_SIZE,
        M.dark
    );

}


/*
==================================================
GLOBAL LIGHT
==================================================
*/

function lighting(
    scene
) {

    const hemi =
        new THREE.HemisphereLight(
            0x7188cc,
            0x080b12,
            1.3
        );


    scene.add(hemi);


    const main =
        new THREE.DirectionalLight(
            0xffffff,
            1.2
        );


    main.position.set(
        20,
        35,
        15
    );


    main.castShadow =
        true;


    main.shadow.mapSize.set(
        512,
        512
    );


    scene.add(main);

}


/*
==================================================
TASK STORAGE
==================================================
*/

let currentTasks = [];


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

    currentTasks = [];


    /*
    Base floor
    */

    floor(
        scene,
        0,
        0,
        WORLD_SIZE,
        WORLD_SIZE,
        M.floor
    );


    /*
    Central hub
    */

    centralHub(
        scene
    );


    /*
    Sectors
    */

    createSectors(
        scene
    );


    /*
    Outer walls
    */

    boundary(
        scene
    );


    /*
    Lighting
    */

    lighting(
        scene
    );


    console.log(
        "WORLD TASKS CREATED:",
        currentTasks.length
    );


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


        /*
        THIS IS THE IMPORTANT PART.
        */

        tasks:
            currentTasks,


        maps: [
            "VOID-STATION-02"
        ],


        sectors: [

            {
                id: "central",
                name: "Central Hub",
                color: "#24eaff"
            },

            {
                id: "research",
                name: "Research Sector",
                color: "#4c72ff"
            },

            {
                id: "security",
                name: "Security Sector",
                color: "#ff3d55"
            },

            {
                id: "medical",
                name: "Medical Sector",
                color: "#35ffb0"
            },

            {
                id: "engineering",
                name: "Engineering Sector",
                color: "#ffa52f"
            }

        ]

    };

};


export default world;
