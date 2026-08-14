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
        color: 0x10131b,
        roughness: 0.82,
        metalness: 0.05
    }),

    floorPanel: new THREE.MeshStandardMaterial({
        color: 0x1a1e29,
        roughness: 0.65,
        metalness: 0.25
    }),

    wall: new THREE.MeshStandardMaterial({
        color: 0x292d39,
        roughness: 0.65,
        metalness: 0.2
    }),

    wallDark: new THREE.MeshStandardMaterial({
        color: 0x171a22,
        roughness: 0.75,
        metalness: 0.3
    }),

    metal: new THREE.MeshStandardMaterial({
        color: 0x3a3d49,
        metalness: 0.75,
        roughness: 0.32
    }),

    metalDark: new THREE.MeshStandardMaterial({
        color: 0x171a22,
        metalness: 0.8,
        roughness: 0.28
    }),

    glass: new THREE.MeshStandardMaterial({
        color: 0x5ddcff,
        transparent: true,
        opacity: 0.35,
        metalness: 0.6,
        roughness: 0.12
    }),

    blue: new THREE.MeshStandardMaterial({
        color: 0x3975ff,
        emissive: 0x142e88,
        emissiveIntensity: 1.8
    }),

    cyan: new THREE.MeshStandardMaterial({
        color: 0x37e5ff,
        emissive: 0x087c99,
        emissiveIntensity: 2
    }),

    emergency: new THREE.MeshStandardMaterial({
        color: 0xff3030,
        emissive: 0x770000,
        emissiveIntensity: 2.5
    }),

    yellow: new THREE.MeshStandardMaterial({
        color: 0xffc72e,
        emissive: 0x6b4d00,
        emissiveIntensity: 1.5
    }),

    green: new THREE.MeshStandardMaterial({
        color: 0x31e58a,
        emissive: 0x087744,
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


    /*
    Floor grid panels
    */

    for (
        let x = -14;
        x <= 14;
        x += 4
    ) {

        for (
            let z = -14;
            z <= 14;
            z += 4
        ) {

            createBox(
                scene,
                x,
                0.015,
                z,
                3.7,
                0.035,
                3.7,
                materials.floorPanel
            );

        }

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
    color = 0x7a6cff,
    intensity = 7
) {

    const light =
        new THREE.PointLight(
            color,
            intensity,
            9
        );


    light.position.set(
        x,
        3.5,
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
CEILING LIGHT STRIP
==================================================
*/

function createCeilingStrip(
    scene,
    x,
    z,
    width,
    color = 0x6577ff
) {

    createBox(
        scene,
        x,
        3.92,
        z,
        width,
        0.08,
        0.22,
        new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 2.5
        })
    );

}


/*
==================================================
HORIZONTAL DOOR WALL
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


    if (sideWidth <= 0) {

        return;

    }


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


/*
==================================================
VERTICAL DOOR WALL
==================================================
*/

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


    if (sideDepth <= 0) {

        return;

    }


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


/*
==================================================
DOOR FRAME
==================================================
*/

function createDoorFrame(
    scene,
    x,
    z,
    horizontal = true
) {

    const frameMaterial =
        materials.metal;


    if (horizontal) {

        createBox(
            scene,
            x - 1.7,
            2,
            z,
            0.18,
            4,
            0.5,
            frameMaterial
        );


        createBox(
            scene,
            x + 1.7,
            2,
            z,
            0.18,
            4,
            0.5,
            frameMaterial
        );


        createBox(
            scene,
            x,
            3.9,
            z,
            3.55,
            0.18,
            0.5,
            frameMaterial
        );

    } else {

        createBox(
            scene,
            x,
            2,
            z - 1.7,
            0.5,
            4,
            0.18,
            frameMaterial
        );


        createBox(
            scene,
            x,
            2,
            z + 1.7,
            0.5,
            4,
            0.18,
            frameMaterial
        );


        createBox(
            scene,
            x,
            3.9,
            z,
            0.5,
            0.18,
            3.55,
            frameMaterial
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

    const door = 3.4;


    /*
    NORTH
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
    SOUTH
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
    WEST
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
    EAST
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


    /*
    Door frames
    */

    createDoorFrame(
        scene,
        0,
        -5,
        true
    );


    createDoorFrame(
        scene,
        0,
        5,
        true
    );


    createDoorFrame(
        scene,
        -6,
        0,
        false
    );


    createDoorFrame(
        scene,
        6,
        0,
        false
    );


    /*
    Lights
    */

    createLight(
        scene,
        -3,
        0,
        0x6f7cff,
        5
    );


    createLight(
        scene,
        3,
        0,
        0x6f7cff,
        5
    );


    createCeilingStrip(
        scene,
        0,
        0,
        5
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

    /*
    Floor
    */

    createBox(
        scene,
        x,
        -0.02,
        z,
        width,
        0.05,
        depth,
        materials.floorPanel
    );


    /*
    Lights along corridor
    */

    const count =
        Math.max(
            2,
            Math.floor(
                Math.max(width, depth) / 3
            )
        );


    const horizontal =
        width > depth;


    for (
        let i = 0;
        i < count;
        i++
    ) {

        let lx = x;

        let lz = z;


        if (horizontal) {

            lx =
                x -
                width / 2 +
                width *
                (i + 0.5) /
                count;

        } else {

            lz =
                z -
                depth / 2 +
                depth *
                (i + 0.5) /
                count;

        }


        createLight(
            scene,
            lx,
            lz,
            0x596cff,
            3
        );

    }

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
    Back wall
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
    Front wall
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
    Left wall
    */

    createVerticalDoorWall(
        scene,
        collision,
        x - width / 2,
        z,
        depth,
        door,
        thickness
    );


    /*
    Right wall
    */

    createVerticalDoorWall(
        scene,
        collision,
        x + width / 2,
        z,
        depth,
        door,
        thickness
    );


    /*
    Door frame
    */

    createDoorFrame(
        scene,
        x - width / 2,
        z,
        false
    );


    createDoorFrame(
        scene,
        x + width / 2,
        z,
        false
    );


    /*
    Room light
    */

    createLight(
        scene,
        x,
        z,
        0x626dff,
        4
    );


    /*
    Room name marker
    */

    createBox(
        scene,
        x,
        3.2,
        z - depth / 2 + 0.2,
        2.8,
        0.45,
        0.08,
        materials.metalDark
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


    /*
    Main body
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


    body.castShadow = true;


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
            materials.blue
        );


    screen.position.set(
        0,
        1,
        -0.24
    );


    group.add(screen);


    /*
    Screen glow
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
    Status light
    */

    const status =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.06,
                12,
                12
            ),
            materials.green
        );


    status.position.set(
        0.28,
        1.48,
        -0.23
    );


    group.add(status);


    /*
    Task data
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
                0.65,
                0.65,
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
                0.37,
                0.37,
                0.28,
                24
            ),
            materials.emergency
        );


    button.position.y =
        0.38;


    group.add(button);


    /*
    Glow
    */

    const light =
        new THREE.PointLight(
            0xff2222,
            3,
            4
        );


    light.position.set(
        0,
        0.8,
        0
    );


    group.add(light);


    group.userData = {

        type: "emergency",

        active: true

    };


    scene.add(group);


    return group;

}


/*
==================================================
CRATE
==================================================
*/

function createCrate(
    scene,
    x,
    z,
    scale = 1
) {

    const crate =
        createBox(
            scene,
            x,
            0.45 * scale,
            z,
            0.9 * scale,
            0.9 * scale,
            0.9 * scale,
            materials.metalDark
        );


    /*
    Cross bars
    */

    createBox(
        scene,
        x,
        0.45 * scale,
        z - 0.46 * scale,
        0.75 * scale,
        0.08 * scale,
        0.08 * scale,
        materials.yellow
    );


    createBox(
        scene,
        x,
        0.45 * scale,
        z + 0.46 * scale,
        0.75 * scale,
        0.08 * scale,
        0.08 * scale,
        materials.yellow
    );


    return crate;

}


/*
==================================================
ENGINE DECORATION
==================================================
*/

function createEngineCore(
    scene,
    x,
    z
) {

    const base =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                1.2,
                1.2,
                0.5,
                32
            ),
            materials.metalDark
        );


    base.position.set(
        x,
        0.25,
        z
    );


    scene.add(base);


    const core =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.65,
                0.65,
                1.5,
                24
            ),
            materials.cyan
        );


    core.position.set(
        x,
        1,
        z
    );


    scene.add(core);


    const light =
        new THREE.PointLight(
            0x25ddff,
            5,
            6
        );


    light.position.set(
        x,
        1.5,
        z
    );


    scene.add(light);

}


/*
==================================================
SECURITY CONSOLE
==================================================
*/

function createSecurityConsole(
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


    const body =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                1.5,
                1.5,
                0.6
            ),
            materials.metal
        );


    body.position.y =
        0.75;


    group.add(body);


    for (
        let i = 0;
        i < 3;
        i++
    ) {

        const screen =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.35,
                    0.5,
                    0.04
                ),
                materials.blue
            );


        screen.position.set(
            -0.45 + i * 0.45,
            1,
            -0.33
        );


        group.add(screen);

    }


    scene.add(group);

}


/*
==================================================
MEDBAY BEDS
==================================================
*/

function createMedbayBed(
    scene,
    x,
    z
) {

    createBox(
        scene,
        x,
        0.55,
        z,
        1.2,
        0.25,
        2.4,
        materials.metal
    );


    createBox(
        scene,
        x,
        0.85,
        z - 0.75,
        1.15,
        0.45,
        0.15,
        materials.glass
    );


    createLight(
        scene,
        x,
        z,
        0x3affb0,
        2
    );

}


/*
==================================================
LAB EQUIPMENT
==================================================
*/

function createLabEquipment(
    scene,
    x,
    z
) {

    createBox(
        scene,
        x,
        0.7,
        z,
        1.8,
        1.4,
        0.7,
        materials.metalDark
    );


    createBox(
        scene,
        x,
        1.4,
        z - 0.38,
        1.3,
        0.5,
        0.05,
        materials.cyan
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
    ==========================================
    FLOOR
    ==========================================
    */

    createFloor(scene);


    /*
    ==========================================
    CENTRAL HUB
    ==========================================
    */

    createCentralHub(
        scene,
        collision
    );


    /*
    ==========================================
    CORRIDORS
    ==========================================
    */

    /*
    West corridor
    */

    createCorridor(
        scene,
        collision,
        -7.5,
        0,
        3,
        5
    );


    /*
    East corridor
    */

    createCorridor(
        scene,
        collision,
        7.5,
        0,
        3,
        5
    );


    /*
    North corridor
    */

    createCorridor(
        scene,
        collision,
        0,
        -6.5,
        5,
        3
    );


    /*
    South corridor
    */

    createCorridor(
        scene,
        collision,
        0,
        6.5,
        5,
        3
    );


    /*
    ==========================================
    ROOMS
    ==========================================
    */

    const laboratory =
        createRoom(
            scene,
            collision,
            -9,
            -7,
            "Laboratory"
        );


    const security =
        createRoom(
            scene,
            collision,
            9,
            -7,
            "Security"
        );


    const medbay =
        createRoom(
            scene,
            collision,
            -9,
            7,
            "Medbay"
        );


    const engine =
        createRoom(
            scene,
            collision,
            9,
            7,
            "Engine Room"
        );


    /*
    ==========================================
    TASK TERMINALS
    ==========================================
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
    ==========================================
    EMERGENCY BUTTON
    ==========================================
    */

    createEmergencyButton(
        scene,
        0,
        0
    );


    /*
    ==========================================
    ROOM DECORATIONS
    ==========================================
    */

    /*
    Laboratory
    */

    createLabEquipment(
        scene,
        -10,
        -8
    );


    createCrate(
        scene,
        -8,
        -8,
        0.8
    );


    /*
    Security
    */

    createSecurityConsole(
        scene,
        10,
        -8
    );


    createCrate(
        scene,
        8,
        -8,
        0.7
    );


    /*
    Medbay
    */

    createMedbayBed(
        scene,
        -10,
        7
    );


    createMedbayBed(
        scene,
        -8,
        7
    );


    /*
    Engine room
    */

    createEngineCore(
        scene,
        10,
        7
    );


    createCrate(
        scene,
        8,
        8,
        0.8
    );


    /*
    ==========================================
    OUTER BOUNDARIES
    ==========================================
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
    ==========================================
    AMBIENT LIGHTS
    ==========================================
    */

    createLight(
        scene,
        0,
        0,
        0xff3030,
        5
    );


    createLight(
        scene,
        -12,
        0,
        0x5868ff,
        3
    );


    createLight(
        scene,
        12,
        0,
        0x5868ff,
        3
    );


    /*
    ==========================================
    RETURN STATION DATA
    ==========================================
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
