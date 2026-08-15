import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


/*
==================================================
PROJECT: VOID
WORLD SYSTEM
SAFE REBUILD
==================================================
*/

class VoidWorld {

    constructor() {

        this.rooms = [];

        this.tasks = [];

    }


    /*
    ==================================================
    MATERIALS
    ==================================================
    */

    material(
        color,
        roughness = 0.5,
        metalness = 0.2
    ) {

        return new THREE.MeshStandardMaterial({

            color,
            roughness,
            metalness

        });

    }


    glow(
        color,
        intensity = 2
    ) {

        return new THREE.MeshStandardMaterial({

            color,

            emissive: color,

            emissiveIntensity: intensity,

            roughness: 0.25,

            metalness: 0.4

        });

    }


    /*
    ==================================================
    CREATE WORLD
    ==================================================
    */

    create(scene, collision) {

        console.log(
            "VOID WORLD: BUILDING..."
        );


        /*
        ==============================================
        CLEAR OLD COLLISION DATA
        ==============================================
        */

        if (collision) {

            try {

                if (
                    typeof collision.clear ===
                    "function"
                ) {

                    collision.clear();

                }

                if (
                    typeof collision.reset ===
                    "function"
                ) {

                    collision.reset();

                }

                if (
                    Array.isArray(
                        collision.colliders
                    )
                ) {

                    collision.colliders.length = 0;

                }

                if (
                    Array.isArray(
                        collision.objects
                    )
                ) {

                    collision.objects.length = 0;

                }

            }
            catch (error) {

                console.warn(
                    "VOID WORLD: collision cleanup skipped",
                    error
                );

            }

        }


        /*
        ==============================================
        MATERIAL PALETTE
        ==============================================
        */

        const floorMat =
            this.material(
                0x111522,
                0.72,
                0.35
            );


        const wallMat =
            this.material(
                0x1b2030,
                0.55,
                0.55
            );


        const darkMat =
            this.material(
                0x080b12,
                0.4,
                0.7
            );


        const metalMat =
            this.material(
                0x30394c,
                0.28,
                0.85
            );


        const cyan =
            this.glow(
                0x20d9ff,
                3
            );


        const blue =
            this.glow(
                0x376cff,
                2.5
            );


        const purple =
            this.glow(
                0x9b4dff,
                2.5
            );


        const green =
            this.glow(
                0x32ffb0,
                2.5
            );


        const orange =
            this.glow(
                0xff8a32,
                2.5
            );


        /*
        ==============================================
        FLOOR
        ==============================================
        */

        const floor =
            new THREE.Mesh(

                new THREE.PlaneGeometry(
                    80,
                    80
                ),

                floorMat

            );


        floor.rotation.x =
            -Math.PI / 2;


        floor.position.y =
            -0.02;


        floor.receiveShadow =
            true;


        floor.userData.isFloor =
            true;


        scene.add(
            floor
        );


        /*
        ==============================================
        FLOOR GRID
        ==============================================
        */

        const grid =
            new THREE.GridHelper(
                80,
                40,
                0x28415c,
                0x151d2c
            );


        grid.position.y =
            0.005;


        scene.add(
            grid
        );


        /*
        ==============================================
        CENTRAL HUB
        ==============================================
        */

        this.createRoom(
            scene,
            "CENTRAL HUB",
            0,
            0,
            22,
            18,
            wallMat,
            cyan,
            collision
        );


        /*
        ==============================================
        NORTH ROOM
        ==============================================
        */

        this.createRoom(
            scene,
            "COMMAND",
            0,
            -16,
            18,
            10,
            wallMat,
            blue,
            collision
        );


        /*
        ==============================================
        SOUTH ROOM
        ==============================================
        */

        this.createRoom(
            scene,
            "ENGINEERING",
            0,
            16,
            18,
            10,
            wallMat,
            orange,
            collision
        );


        /*
        ==============================================
        WEST ROOM
        ==============================================
        */

        this.createRoom(
            scene,
            "MEDICAL",
            -18,
            0,
            10,
            14,
            wallMat,
            green,
            collision
        );


        /*
        ==============================================
        EAST ROOM
        ==============================================
        */

        this.createRoom(
            scene,
            "REACTOR",
            18,
            0,
            10,
            14,
            wallMat,
            purple,
            collision
        );


        /*
        ==============================================
        OPEN CONNECTIONS
        ==============================================
        */

        /*
        IMPORTANT:

        The central hub remains open.

        We deliberately DO NOT put collision walls
        across these four entrances.
        */


        this.createDoorFrame(
            scene,
            0,
            -9.0,
            0,
            cyan
        );


        this.createDoorFrame(
            scene,
            0,
            9.0,
            Math.PI,
            orange
        );


        this.createDoorFrame(
            scene,
            -11,
            0,
            Math.PI / 2,
            green
        );


        this.createDoorFrame(
            scene,
            11,
            0,
            -Math.PI / 2,
            purple
        );


        /*
        ==============================================
        CENTRAL PLATFORM
        ==============================================
        */

        const platform =
            new THREE.Mesh(

                new THREE.CylinderGeometry(
                    4.2,
                    4.2,
                    0.25,
                    48
                ),

                metalMat

            );


        platform.position.set(
            0,
            0.125,
            0
        );


        platform.receiveShadow =
            true;


        platform.castShadow =
            true;


        scene.add(
            platform
        );


        /*
        CENTRAL RING
        */

        const ring =
            new THREE.Mesh(

                new THREE.TorusGeometry(
                    3.7,
                    0.08,
                    12,
                    64
                ),

                cyan

            );


        ring.rotation.x =
            Math.PI / 2;


        ring.position.y =
            0.28;


        scene.add(
            ring
        );


        /*
        ==============================================
        CENTRAL TERMINAL
        ==============================================
        */

        this.createTerminal(
            scene,
            -3.5,
            0,
            cyan
        );


        this.createTerminal(
            scene,
            3.5,
            0,
            blue
        );


        /*
        ==============================================
        NORTH COMMAND TERMINAL
        ==============================================
        */

        this.createTerminal(
            scene,
            -3,
            -16,
            blue
        );


        /*
        ==============================================
        SOUTH ENGINEERING TERMINAL
        ==============================================
        */

        this.createTerminal(
            scene,
            3,
            16,
            orange
        );


        /*
        ==============================================
        WEST MEDICAL TERMINAL
        ==============================================
        */

        this.createTerminal(
            scene,
            -18,
            0,
            green
        );


        /*
        ==============================================
        EAST REACTOR TERMINAL
        ==============================================
        */

        this.createTerminal(
            scene,
            18,
            0,
            purple
        );


        /*
        ==============================================
        TASKS
        ==============================================
        */

        this.tasks = [];


        this.tasks.push(
            this.createTask(
                scene,
                "POWER CORE",
                -3.5,
                0,
                cyan
            )
        );


        this.tasks.push(
            this.createTask(
                scene,
                "NAVIGATION",
                3.5,
                0,
                blue
            )
        );


        this.tasks.push(
            this.createTask(
                scene,
                "COMMAND",
                -3,
                -16,
                blue
            )
        );


        this.tasks.push(
            this.createTask(
                scene,
                "ENGINEERING",
                3,
                16,
                orange
            )
        );


        this.tasks.push(
            this.createTask(
                scene,
                "MEDICAL",
                -18,
                0,
                green
            )
        );


        this.tasks.push(
            this.createTask(
                scene,
                "REACTOR",
                18,
                0,
                purple
            )
        );


        /*
        ==============================================
        DECORATION
        ==============================================
        */

        this.createLights(
            scene,
            cyan,
            blue,
            purple
        );


        this.createCeilingLights(
            scene,
            0,
            -5,
            cyan
        );


        this.createCeilingLights(
            scene,
            0,
            5,
            blue
        );


        /*
        ==============================================
        ROOMS DATA
        ==============================================
        */

        this.rooms = [

            "CENTRAL HUB",

            "COMMAND",

            "ENGINEERING",

            "MEDICAL",

            "REACTOR"

        ];


        console.log(
            "VOID WORLD: READY"
        );


        console.log(
            "Rooms:",
            this.rooms
        );


        console.log(
            "Tasks:",
            this.tasks.length
        );


        /*
        ==============================================
        RETURN OBJECT
        ==============================================
        */

        return {

            rooms:
                this.rooms,

            tasks:
                this.tasks,

            spawn: {

                x: 0,

                y: 0,

                z: 4

            }

        };

    }


    /*
    ==================================================
    ROOM CREATOR
    ==================================================
    */

    createRoom(
        scene,
        name,
        x,
        z,
        width,
        depth,
        wallMat,
        glowMat,
        collision
    ) {

        /*
        ----------------------------------------------
        ROOM FLOOR
        ----------------------------------------------
        */

        const roomFloor =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    width,
                    0.18,
                    depth
                ),

                wallMat

            );


        roomFloor.position.set(
            x,
            0.09,
            z
        );


        roomFloor.receiveShadow =
            true;


        scene.add(
            roomFloor
        );


        /*
        ----------------------------------------------
        WALL HEIGHT
        ----------------------------------------------
        */

        const wallHeight =
            3.2;


        const wallThickness =
            0.35;


        /*
        ----------------------------------------------
        NORTH WALL
        ----------------------------------------------
        */

        const north =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    width,
                    wallHeight,
                    wallThickness
                ),

                wallMat

            );


        north.position.set(
            x,
            wallHeight / 2,
            z - depth / 2
        );


        scene.add(
            north
        );


        /*
        ----------------------------------------------
        SOUTH WALL
        ----------------------------------------------
        */

        const south =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    width,
                    wallHeight,
                    wallThickness
                ),

                wallMat

            );


        south.position.set(
            x,
            wallHeight / 2,
            z + depth / 2
        );


        scene.add(
            south
        );


        /*
        ----------------------------------------------
        WEST WALL
        ----------------------------------------------
        */

        const west =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    wallThickness,
                    wallHeight,
                    depth
                ),

                wallMat

            );


        west.position.set(
            x - width / 2,
            wallHeight / 2,
            z
        );


        scene.add(
            west
        );


        /*
        ----------------------------------------------
        EAST WALL
        ----------------------------------------------
        */

        const east =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    wallThickness,
                    wallHeight,
                    depth
                ),

                wallMat

            );


        east.position.set(
            x + width / 2,
            wallHeight / 2,
            z
        );


        scene.add(
            east
        );


        /*
        ----------------------------------------------
        GLOW STRIPS
        ----------------------------------------------
        */

        const strip1 =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    width - 0.8,
                    0.07,
                    0.04
                ),

                glowMat

            );


        strip1.position.set(
            x,
            2.5,
            z - depth / 2 - 0.2
        );


        scene.add(
            strip1
        );


        const strip2 =
            strip1.clone();


        strip2.position.z =
            z + depth / 2 + 0.2;


        scene.add(
            strip2
        );


        /*
        ----------------------------------------------
        IMPORTANT COLLISION DESIGN
        ----------------------------------------------

        We intentionally DO NOT register the room
        walls with collision here.

        This prevents the old invisible-wall problem.

        The player is therefore free to move while
        we verify that rendering/world generation works.
        ----------------------------------------------
        */

    }


    /*
    ==================================================
    DOOR FRAME
    ==================================================
    */

    createDoorFrame(
        scene,
        x,
        z,
        rotation,
        material
    ) {

        const frame =
            new THREE.Group();


        frame.position.set(
            x,
            0,
            z
        );


        frame.rotation.y =
            rotation;


        /*
        LEFT
        */

        const left =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    0.18,
                    3,
                    0.18
                ),

                material

            );


        left.position.set(
            -2,
            1.5,
            0
        );


        frame.add(
            left
        );


        /*
        RIGHT
        */

        const right =
            left.clone();


        right.position.x =
            2;


        frame.add(
            right
        );


        /*
        TOP
        */

        const top =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    4,
                    0.18,
                    0.18
                ),

                material

            );


        top.position.set(
            0,
            3,
            0
        );


        frame.add(
            top
        );


        scene.add(
            frame
        );

    }


    /*
    ==================================================
    TERMINAL
    ==================================================
    */

    createTerminal(
        scene,
        x,
        z,
        glowMaterial
    ) {

        const group =
            new THREE.Group();


        group.position.set(
            x,
            0,
            z
        );


        /*
        BODY
        */

        const body =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    1.1,
                    1.35,
                    0.65
                ),

                this.material(
                    0x111725,
                    0.4,
                    0.7
                )

            );


        body.position.y =
            0.68;


        body.castShadow =
            true;


        group.add(
            body
        );


        /*
        SCREEN
        */

        const screen =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    0.75,
                    0.48,
                    0.04
                ),

                glowMaterial

            );


        screen.position.set(
            0,
            0.85,
            -0.35
        );


        group.add(
            screen
        );


        /*
        BASE
        */

        const base =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    1.35,
                    0.18,
                    0.85
                ),

                this.material(
                    0x080b12,
                    0.35,
                    0.8
                )

            );


        base.position.y =
            0.09;


        group.add(
            base
        );


        /*
        GLOW RING
        */

        const ring =
            new THREE.Mesh(

                new THREE.TorusGeometry(
                    0.32,
                    0.035,
                    8,
                    24
                ),

                glowMaterial

            );


        ring.rotation.x =
            Math.PI / 2;


        ring.position.y =
            0.04;


        group.add(
            ring
        );


        scene.add(
            group
        );

    }


    /*
    ==================================================
    TASK OBJECT
    ==================================================
    */

    createTask(
        scene,
        label,
        x,
        z,
        material
    ) {

        const group =
            new THREE.Group();


        group.position.set(
            x,
            0,
            z
        );


        /*
        PLATFORM
        */

        const platform =
            new THREE.Mesh(

                new THREE.CylinderGeometry(
                    0.75,
                    0.75,
                    0.12,
                    24
                ),

                this.material(
                    0x111827,
                    0.4,
                    0.6
                )

            );


        platform.position.y =
            0.06;


        group.add(
            platform
        );


        /*
        TASK CORE
        */

        const core =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    0.28,
                    16,
                    16
                ),

                material

            );


        core.position.y =
            0.65;


        core.userData.type =
            "task";


        core.userData.label =
            label;


        core.userData.task =
            true;


        core.castShadow =
            true;


        group.add(
            core
        );


        /*
        RING
        */

        const ring =
            new THREE.Mesh(

                new THREE.TorusGeometry(
                    0.48,
                    0.045,
                    8,
                    32
                ),

                material

            );


        ring.rotation.x =
            Math.PI / 2;


        ring.position.y =
            0.65;


        group.add(
            ring
        );


        /*
        LIGHT
        */

        const light =
            new THREE.PointLight(
                material.color,
                2.5,
                5
            );


        light.position.y =
            0.7;


        group.add(
            light
        );


        scene.add(
            group
        );


        return core;

    }


    /*
    ==================================================
    LIGHTING
    ==================================================
    */

    createLights(
        scene,
        cyan,
        blue,
        purple
    ) {

        const light1 =
            new THREE.PointLight(
                0x20d9ff,
                4,
                18
            );


        light1.position.set(
            0,
            4,
            0
        );


        scene.add(
            light1
        );


        const light2 =
            new THREE.PointLight(
                0x376cff,
                3,
                15
            );


        light2.position.set(
            -12,
            3,
            -12
        );


        scene.add(
            light2
        );


        const light3 =
            new THREE.PointLight(
                0x9b4dff,
                3,
                15
            );


        light3.position.set(
            12,
            3,
            12
        );


        scene.add(
            light3
        );

    }


    /*
    ==================================================
    CEILING LIGHTS
    ==================================================
    */

    createCeilingLights(
        scene,
        x,
        z,
        material
    ) {

        for (
            let i = -2;
            i <= 2;
            i++
        ) {

            const light =
                new THREE.Mesh(

                    new THREE.BoxGeometry(
                        2.2,
                        0.08,
                        0.12
                    ),

                    material

                );


            light.position.set(
                x + i * 3,
                3.05,
                z
            );


            scene.add(
                light
            );

        }

    }

}


/*
==================================================
EXPORT SINGLE WORLD INSTANCE
==================================================
*/

const world =
    new VoidWorld();


export default world;
