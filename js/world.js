import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


/*
==================================================
PROJECT: VOID
WORLD SYSTEM
VERSION 2
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

            emissiveIntensity:
                intensity,

            roughness: 0.25,

            metalness: 0.45

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
        MATERIAL PALETTE
        ==============================================
        */

        const floorMat =
            this.material(
                0x111522,
                0.72,
                0.35
            );


        const centralWall =
            this.material(
                0x252d40,
                0.48,
                0.65
            );


        const commandWall =
            this.material(
                0x243b68,
                0.42,
                0.7
            );


        const engineeringWall =
            this.material(
                0x59351e,
                0.45,
                0.68
            );


        const medicalWall =
            this.material(
                0x204b3f,
                0.42,
                0.7
            );


        const reactorWall =
            this.material(
                0x3d285e,
                0.42,
                0.72
            );


        const metal =
            this.material(
                0x39445b,
                0.25,
                0.9
            );


        const darkMetal =
            this.material(
                0x080c15,
                0.3,
                0.85
            );


        /*
        ==============================================
        ROOM COLORS
        ==============================================
        */

        const cyan =
            this.glow(
                0x20d9ff,
                3
            );


        const blue =
            this.glow(
                0x376cff,
                3
            );


        const orange =
            this.glow(
                0xff8a32,
                3
            );


        const green =
            this.glow(
                0x32ffb0,
                3
            );


        const purple =
            this.glow(
                0x9b4dff,
                3
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
                0x111827
            );


        grid.position.y =
            0.006;


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
            centralWall,
            cyan,
            null
        );


        /*
        ==============================================
        COMMAND
        ==============================================
        */

        this.createRoom(
            scene,
            "COMMAND",
            0,
            -16,
            18,
            10,
            commandWall,
            blue,
            null
        );


        /*
        ==============================================
        ENGINEERING
        ==============================================
        */

        this.createRoom(
            scene,
            "ENGINEERING",
            0,
            16,
            18,
            10,
            engineeringWall,
            orange,
            null
        );


        /*
        ==============================================
        MEDICAL
        ==============================================
        */

        this.createRoom(
            scene,
            "MEDICAL",
            -18,
            0,
            10,
            14,
            medicalWall,
            green,
            null
        );


        /*
        ==============================================
        REACTOR
        ==============================================
        */

        this.createRoom(
            scene,
            "REACTOR",
            18,
            0,
            10,
            14,
            reactorWall,
            purple,
            null
        );


        /*
        ==============================================
        DOORS
        ==============================================
        */

        this.createDoorFrame(
            scene,
            0,
            -9,
            0,
            cyan
        );


        this.createDoorFrame(
            scene,
            0,
            9,
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
                    4.3,
                    4.3,
                    0.28,
                    48
                ),

                metal

            );


        platform.position.set(
            0,
            0.14,
            0
        );


        platform.castShadow =
            true;


        platform.receiveShadow =
            true;


        scene.add(
            platform
        );


        /*
        ==============================================
        CENTRAL ENERGY RING
        ==============================================
        */

        const ring =
            new THREE.Mesh(

                new THREE.TorusGeometry(
                    3.7,
                    0.09,
                    12,
                    64
                ),

                cyan

            );


        ring.rotation.x =
            Math.PI / 2;


        ring.position.y =
            0.31;


        scene.add(
            ring
        );


        /*
        ==============================================
        CENTRAL ENERGY CORE
        ==============================================
        */

        const core =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    0.8,
                    24,
                    24
                ),

                cyan

            );


        core.position.y =
            1.05;


        core.castShadow =
            true;


        scene.add(
            core
        );


        const coreLight =
            new THREE.PointLight(
                0x20d9ff,
                5,
                10
            );


        coreLight.position.set(
            0,
            1.2,
            0
        );


        scene.add(
            coreLight
        );


        /*
        ==============================================
        TERMINALS
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


        this.createTerminal(
            scene,
            -3,
            -16,
            blue
        );


        this.createTerminal(
            scene,
            3,
            16,
            orange
        );


        this.createTerminal(
            scene,
            -18,
            0,
            green
        );


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
        LIGHTING
        ==============================================
        */

        this.createLights(
            scene
        );


        /*
        ==============================================
        ROOM CEILING LIGHTS
        ==============================================
        */

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
            orange
        );


        this.createCeilingLights(
            scene,
            -18,
            0,
            green
        );


        this.createCeilingLights(
            scene,
            18,
            0,
            purple
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
        RETURN WORLD DATA
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
                z: 5

            }

        };

    }


    /*
    ==================================================
    ROOM
    ==================================================
    */

    createRoom(
        scene,
        name,
        x,
        z,
        width,
        depth,
        wallMaterial,
        glowMaterial,
        collision
    ) {

        /*
        ==============================================
        ROOM FLOOR
        ==============================================
        */

        const roomFloor =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    width,
                    0.18,
                    depth
                ),

                wallMaterial

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
        ==============================================
        WALL SETTINGS
        ==============================================
        */

        const wallHeight =
            3.2;


        const thickness =
            0.35;


        /*
        ==============================================
        NORTH WALL
        ==============================================
        */

        this.createWall(
            scene,
            width,
            wallHeight,
            thickness,
            x,
            z - depth / 2,
            wallMaterial
        );


        /*
        ==============================================
        SOUTH WALL
        ==============================================
        */

        this.createWall(
            scene,
            width,
            wallHeight,
            thickness,
            x,
            z + depth / 2,
            wallMaterial
        );


        /*
        ==============================================
        WEST WALL
        ==============================================
        */

        this.createSideWall(
            scene,
            thickness,
            wallHeight,
            depth,
            x - width / 2,
            z,
            wallMaterial
        );


        /*
        ==============================================
        EAST WALL
        ==============================================
        */

        this.createSideWall(
            scene,
            thickness,
            wallHeight,
            depth,
            x + width / 2,
            z,
            wallMaterial
        );


        /*
        ==============================================
        GLOW STRIPS
        ==============================================
        */

        const strip =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    width - 0.8,
                    0.08,
                    0.06
                ),

                glowMaterial

            );


        strip.position.set(
            x,
            2.55,
            z - depth / 2 - 0.2
        );


        scene.add(
            strip
        );


        const strip2 =
            strip.clone();


        strip2.position.z =
            z + depth / 2 + 0.2;


        scene.add(
            strip2
        );


        /*
        ==============================================
        ROOM NAME PLATE
        ==============================================
        */

        this.createRoomMarker(
            scene,
            name,
            x,
            z,
            glowMaterial
        );

    }


    /*
    ==================================================
    WALL
    ==================================================
    */

    createWall(
        scene,
        width,
        height,
        thickness,
        x,
        z,
        material
    ) {

        const wall =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    width,
                    height,
                    thickness
                ),

                material

            );


        wall.position.set(
            x,
            height / 2,
            z
        );


        wall.castShadow =
            true;


        wall.receiveShadow =
            true;


        scene.add(
            wall
        );

    }


    /*
    ==================================================
    SIDE WALL
    ==================================================
    */

    createSideWall(
        scene,
        thickness,
        height,
        depth,
        x,
        z,
        material
    ) {

        const wall =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    thickness,
                    height,
                    depth
                ),

                material

            );


        wall.position.set(
            x,
            height / 2,
            z
        );


        wall.castShadow =
            true;


        wall.receiveShadow =
            true;


        scene.add(
            wall
        );

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

        const group =
            new THREE.Group();


        group.position.set(
            x,
            0,
            z
        );


        group.rotation.y =
            rotation;


        /*
        LEFT PILLAR
        */

        const left =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    0.2,
                    3,
                    0.25
                ),

                material

            );


        left.position.set(
            -2,
            1.5,
            0
        );


        left.castShadow =
            true;


        group.add(
            left
        );


        /*
        RIGHT PILLAR
        */

        const right =
            left.clone();


        right.position.x =
            2;


        group.add(
            right
        );


        /*
        TOP
        */

        const top =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    4.2,
                    0.2,
                    0.25
                ),

                material

            );


        top.position.y =
            3;


        group.add(
            top
        );


        scene.add(
            group
        );

    }


    /*
    ==================================================
    ROOM MARKER
    ==================================================
    */

    createRoomMarker(
        scene,
        name,
        x,
        z,
        material
    ) {

        const marker =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    2.8,
                    0.08,
                    0.08
                ),

                material

            );


        marker.position.set(
            x,
            2.85,
            z
        );


        scene.add(
            marker
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
                    1.15,
                    1.35,
                    0.7
                ),

                this.material(
                    0x101522,
                    0.32,
                    0.8
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
                    0.78,
                    0.5,
                    0.05
                ),

                glowMaterial

            );


        screen.position.set(
            0,
            0.9,
            -0.37
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
                    1.4,
                    0.18,
                    0.9
                ),

                this.material(
                    0x080b12,
                    0.3,
                    0.85
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
            0.05;


        group.add(
            ring
        );


        scene.add(
            group
        );

    }


    /*
    ==================================================
    TASK
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
                    0.78,
                    0.78,
                    0.14,
                    24
                ),

                this.material(
                    0x111827,
                    0.35,
                    0.7
                )

            );


        platform.position.y =
            0.07;


        platform.receiveShadow =
            true;


        group.add(
            platform
        );


        /*
        CORE
        */

        const core =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    0.28,
                    18,
                    18
                ),

                material

            );


        core.position.y =
            0.65;


        core.castShadow =
            true;


        core.userData.type =
            "task";


        core.userData.task =
            true;


        core.userData.label =
            label;


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
        scene
    ) {

        const ambient =
            new THREE.HemisphereLight(
                0x7184c8,
                0x080b12,
                1.5
            );


        scene.add(
            ambient
        );


        const central =
            new THREE.PointLight(
                0x20d9ff,
                4,
                20
            );


        central.position.set(
            0,
            4,
            0
        );


        central.castShadow =
            true;


        scene.add(
            central
        );


        const blue =
            new THREE.PointLight(
                0x376cff,
                3,
                15
            );


        blue.position.set(
            0,
            3,
            -16
        );


        scene.add(
            blue
        );


        const orange =
            new THREE.PointLight(
                0xff8a32,
                3,
                15
            );


        orange.position.set(
            0,
            3,
            16
        );


        scene.add(
            orange
        );


        const green =
            new THREE.PointLight(
                0x32ffb0,
                3,
                14
            );


        green.position.set(
            -18,
            3,
            0
        );


        scene.add(
            green
        );


        const purple =
            new THREE.PointLight(
                0x9b4dff,
                3,
                14
            );


        purple.position.set(
            18,
            3,
            0
        );


        scene.add(
            purple
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
                        0.14
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
SINGLE WORLD INSTANCE
==================================================
*/

const world =
    new VoidWorld();


export default world;
