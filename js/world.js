import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


class VoidWorld {

    constructor() {

        this.rooms = [];
        this.tasks = [];

    }


    material(
        color,
        roughness = 0.55,
        metalness = 0.35
    ) {

        return new THREE.MeshStandardMaterial({

            color,
            roughness,
            metalness

        });

    }


    glow(color) {

        return new THREE.MeshStandardMaterial({

            color,

            emissive: color,

            emissiveIntensity: 2.5,

            roughness: 0.25,

            metalness: 0.45

        });

    }


    create(scene) {

        this.rooms = [];
        this.tasks = [];


        /* ================================
           MATERIALS
        ================================= */

        const floor =
            this.material(
                0x0b101b,
                0.75,
                0.25
            );


        const hubWall =
            this.material(
                0x202b3d,
                0.5,
                0.55
            );


        /* ROOM COLORS */

        const cyan =
            this.glow(0x18dfff);

        const blue =
            this.glow(0x3975ff);

        const orange =
            this.glow(0xff7a24);

        const green =
            this.glow(0x28ff9c);

        const purple =
            this.glow(0xa34cff);


        /* ================================
           GLOBAL FLOOR
        ================================= */

        const floorMesh =
            new THREE.Mesh(

                new THREE.PlaneGeometry(
                    90,
                    90
                ),

                floor

            );


        floorMesh.rotation.x =
            -Math.PI / 2;

        floorMesh.position.y =
            -0.02;

        floorMesh.receiveShadow =
            true;

        scene.add(
            floorMesh
        );


        /* GRID */

        const grid =
            new THREE.GridHelper(
                90,
                45,
                0x1d4560,
                0x111b2a
            );

        grid.position.y =
            0.01;

        scene.add(
            grid
        );


        /* ================================
           ROOMS
        ================================= */

        this.addRoom(
            scene,
            "CENTRAL HUB",
            0,
            0,
            22,
            18,
            hubWall,
            cyan
        );


        this.addRoom(
            scene,
            "COMMAND",
            0,
            -16,
            18,
            10,
            this.material(0x18263f, 0.5, 0.6),
            blue
        );


        this.addRoom(
            scene,
            "ENGINEERING",
            0,
            16,
            18,
            10,
            this.material(0x3a2118, 0.5, 0.6),
            orange
        );


        this.addRoom(
            scene,
            "MEDICAL",
            -18,
            0,
            10,
            14,
            this.material(0x15352b, 0.5, 0.55),
            green
        );


        this.addRoom(
            scene,
            "REACTOR",
            18,
            0,
            10,
            14,
            this.material(0x2d1940, 0.5, 0.6),
            purple
        );


        /* ================================
           DOOR FRAMES
        ================================= */

        this.door(
            scene,
            0,
            -9,
            cyan
        );

        this.door(
            scene,
            0,
            9,
            orange
        );

        this.door(
            scene,
            -11,
            0,
            green
        );

        this.door(
            scene,
            11,
            0,
            purple
        );


        /* ================================
           CENTRAL PLATFORM
        ================================= */

        const platform =
            new THREE.Mesh(

                new THREE.CylinderGeometry(
                    4,
                    4,
                    0.25,
                    48
                ),

                this.material(
                    0x303b4d,
                    0.3,
                    0.8
                )

            );


        platform.position.y =
            0.125;

        platform.castShadow =
            true;

        platform.receiveShadow =
            true;

        scene.add(
            platform
        );


        const ring =
            new THREE.Mesh(

                new THREE.TorusGeometry(
                    3.5,
                    0.09,
                    12,
                    64
                ),

                cyan

            );


        ring.rotation.x =
            Math.PI / 2;

        ring.position.y =
            0.3;

        scene.add(
            ring
        );


        /* ================================
           TASKS
        ================================= */

        this.addTask(
            scene,
            "POWER CORE",
            -3.5,
            0,
            cyan
        );


        this.addTask(
            scene,
            "NAVIGATION",
            3.5,
            0,
            blue
        );


        this.addTask(
            scene,
            "COMMAND SYSTEM",
            -3,
            -16,
            blue
        );


        this.addTask(
            scene,
            "ENGINE CORE",
            3,
            16,
            orange
        );


        this.addTask(
            scene,
            "MEDICAL SCAN",
            -18,
            0,
            green
        );


        this.addTask(
            scene,
            "REACTOR CONTROL",
            18,
            0,
            purple
        );


        /* ================================
           TERMINALS
        ================================= */

        this.terminal(
            scene,
            -3.5,
            0,
            cyan
        );

        this.terminal(
            scene,
            3.5,
            0,
            blue
        );

        this.terminal(
            scene,
            -3,
            -16,
            blue
        );

        this.terminal(
            scene,
            3,
            16,
            orange
        );

        this.terminal(
            scene,
            -18,
            0,
            green
        );

        this.terminal(
            scene,
            18,
            0,
            purple
        );


        /* ================================
           LIGHTS
        ================================= */

        this.addLight(
            scene,
            0,
            4,
            0,
            0x35dfff,
            5,
            22
        );

        this.addLight(
            scene,
            -18,
            3,
            0,
            0x28ff9c,
            4,
            14
        );

        this.addLight(
            scene,
            18,
            3,
            0,
            0xa34cff,
            4,
            14
        );

        this.addLight(
            scene,
            0,
            3,
            -16,
            0x3975ff,
            4,
            15
        );

        this.addLight(
            scene,
            0,
            3,
            16,
            0xff7a24,
            4,
            15
        );


        this.rooms = [
            "CENTRAL HUB",
            "COMMAND",
            "ENGINEERING",
            "MEDICAL",
            "REACTOR"
        ];


        console.log(
            "VOID WORLD READY"
        );

        console.log(
            "ROOMS:",
            this.rooms
        );

        console.log(
            "TASKS:",
            this.tasks.length
        );


        return {

            rooms: this.rooms,

            tasks: this.tasks,

            spawn: {
                x: 0,
                y: 0,
                z: 5
            }

        };

    }


    /* ================================
       ROOM
    ================================= */

    addRoom(
        scene,
        name,
        x,
        z,
        width,
        depth,
        wallMaterial,
        glowMaterial
    ) {

        const floor =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    width,
                    0.16,
                    depth
                ),

                wallMaterial

            );


        floor.position.set(
            x,
            0.08,
            z
        );

        floor.receiveShadow =
            true;

        scene.add(
            floor
        );


        const height =
            3.4;

        const thickness =
            0.35;


        /* NORTH */

        const north =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    width,
                    height,
                    thickness
                ),

                wallMaterial

            );


        north.position.set(
            x,
            height / 2,
            z - depth / 2
        );

        north.castShadow =
            true;

        scene.add(
            north
        );


        /* SOUTH */

        const south =
            north.clone();


        south.position.z =
            z + depth / 2;

        scene.add(
            south
        );


        /* WEST */

        const west =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    thickness,
                    height,
                    depth
                ),

                wallMaterial

            );


        west.position.set(
            x - width / 2,
            height / 2,
            z
        );

        west.castShadow =
            true;

        scene.add(
            west
        );


        /* EAST */

        const east =
            west.clone();


        east.position.x =
            x + width / 2;

        scene.add(
            east
        );


        /* GLOW STRIPS */

        const strip =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    width - 0.7,
                    0.08,
                    0.05
                ),

                glowMaterial

            );


        strip.position.set(
            x,
            2.55,
            z - depth / 2 - 0.22
        );

        scene.add(
            strip
        );


        const strip2 =
            strip.clone();


        strip2.position.z =
            z + depth / 2 + 0.22;

        scene.add(
            strip2
        );

    }


    /* ================================
       DOOR
    ================================= */

    door(
        scene,
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


        group.add(
            left
        );


        const right =
            left.clone();


        right.position.x =
            2;


        group.add(
            right
        );


        const top =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    4,
                    0.18,
                    0.18
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


    /* ================================
       TASK
    ================================= */

    addTask(
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


        const base =
            new THREE.Mesh(

                new THREE.CylinderGeometry(
                    0.8,
                    0.8,
                    0.12,
                    24
                ),

                this.material(
                    0x111827,
                    0.35,
                    0.7
                )

            );


        base.position.y =
            0.06;


        group.add(
            base
        );


        const core =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    0.3,
                    20,
                    16
                ),

                material

            );


        core.position.y =
            0.7;


        core.userData.task =
            true;

        core.userData.label =
            label;

        core.userData.completed =
            false;


        group.add(
            core
        );


        const ring =
            new THREE.Mesh(

                new THREE.TorusGeometry(
                    0.5,
                    0.045,
                    8,
                    32
                ),

                material

            );


        ring.rotation.x =
            Math.PI / 2;

        ring.position.y =
            0.7;


        group.add(
            ring
        );


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


        this.tasks.push(
            core
        );

    }


    /* ================================
       TERMINAL
    ================================= */

    terminal(
        scene,
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


        const body =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    1.1,
                    1.3,
                    0.7
                ),

                this.material(
                    0x101722,
                    0.35,
                    0.75
                )

            );


        body.position.y =
            0.65;


        group.add(
            body
        );


        const screen =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    0.75,
                    0.5,
                    0.05
                ),

                material

            );


        screen.position.set(
            0,
            0.85,
            -0.38
        );


        group.add(
            screen
        );


        scene.add(
            group
        );

    }


    /* ================================
       LIGHT
    ================================= */

    addLight(
        scene,
        x,
        y,
        z,
        color,
        intensity,
        distance
    ) {

        const light =
            new THREE.PointLight(
                color,
                intensity,
                distance
            );


        light.position.set(
            x,
            y,
            z
        );


        scene.add(
            light
        );

    }

}


const world =
    new VoidWorld();


export default world;
