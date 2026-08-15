import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


class VoidWorld {

    constructor() {

        this.rooms = [];
        this.tasks = [];

    }


    material(color, roughness = 0.5, metalness = 0.3) {

        return new THREE.MeshStandardMaterial({

            color,
            roughness,
            metalness

        });

    }


    glow(color, intensity = 2.5) {

        return new THREE.MeshStandardMaterial({

            color,

            emissive: color,

            emissiveIntensity: intensity,

            roughness: 0.25,

            metalness: 0.4

        });

    }


    create(scene, collision) {

        this.rooms = [];
        this.tasks = [];

        if (collision && typeof collision.clear === "function") {

            collision.clear();

        }


        /*
        ==================================================
        MATERIALS
        ==================================================
        */

        const floorMat =
            this.material(
                0x171c2b,
                0.72,
                0.35
            );


        const hubWall =
            this.material(
                0x20283b,
                0.45,
                0.65
            );


        const commandWall =
            this.material(
                0x172b48,
                0.42,
                0.7
            );


        const engineeringWall =
            this.material(
                0x3a2618,
                0.48,
                0.65
            );


        const medicalWall =
            this.material(
                0x17352e,
                0.42,
                0.7
            );


        const reactorWall =
            this.material(
                0x2b1b42,
                0.42,
                0.7
            );


        const cyan =
            this.glow(
                0x20eaff,
                3.5
            );


        const blue =
            this.glow(
                0x347cff,
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
                0xb14dff,
                3
            );


        const metal =
            this.material(
                0x343e55,
                0.28,
                0.9
            );


        /*
        ==================================================
        FLOOR
        ==================================================
        */

        const floor =
            new THREE.Mesh(

                new THREE.PlaneGeometry(
                    110,
                    110
                ),

                floorMat

            );


        floor.rotation.x =
            -Math.PI / 2;


        floor.position.y =
            -0.02;


        floor.receiveShadow =
            true;


        scene.add(floor);


        /*
        ==================================================
        GRID
        ==================================================
        */

        const grid =
            new THREE.GridHelper(
                110,
                55,
                0x28405d,
                0x151c2b
            );


        grid.position.y =
            0.01;


        scene.add(grid);


        /*
        ==================================================
        CENTRAL HUB
        ==================================================
        */

        this.createRoom(

            scene,

            "CENTRAL HUB",

            0,
            0,

            30,
            24,

            hubWall,
            cyan,

            ["north", "south", "west", "east"],

            collision

        );


        /*
        ==================================================
        COMMAND
        ==================================================
        */

        this.createRoom(

            scene,

            "COMMAND",

            0,
            -20,

            24,
            16,

            commandWall,
            blue,

            ["south"],

            collision

        );


        /*
        ==================================================
        ENGINEERING
        ==================================================
        */

        this.createRoom(

            scene,

            "ENGINEERING",

            0,
            20,

            24,
            16,

            engineeringWall,
            orange,

            ["north"],

            collision

        );


        /*
        ==================================================
        MEDICAL
        ==================================================
        */

        this.createRoom(

            scene,

            -23,
            0,

            16,
            20,

            medicalWall,
            green,

            ["east"],

            collision

        );


        /*
        ==================================================
        REACTOR
        ==================================================
        */

        this.createRoom(

            scene,

            "REACTOR",

            23,
            0,

            16,
            20,

            reactorWall,
            purple,

            ["west"],

            collision

        );


        /*
        ==================================================
        DOOR FRAMES
        ==================================================
        */

        this.createDoorFrame(
            scene,
            0,
            -12,
            0,
            cyan
        );


        this.createDoorFrame(
            scene,
            0,
            12,
            Math.PI,
            orange
        );


        this.createDoorFrame(
            scene,
            -15,
            0,
            Math.PI / 2,
            green
        );


        this.createDoorFrame(
            scene,
            15,
            0,
            -Math.PI / 2,
            purple
        );


        /*
        ==================================================
        CENTRAL PLATFORM
        ==================================================
        */

        const platform =
            new THREE.Mesh(

                new THREE.CylinderGeometry(
                    5.5,
                    5.5,
                    0.3,
                    64
                ),

                metal

            );


        platform.position.y =
            0.15;


        platform.castShadow =
            true;


        platform.receiveShadow =
            true;


        scene.add(platform);


        const ring =
            new THREE.Mesh(

                new THREE.TorusGeometry(
                    5,
                    0.11,
                    16,
                    80
                ),

                cyan

            );


        ring.rotation.x =
            Math.PI / 2;


        ring.position.y =
            0.34;


        scene.add(ring);


        /*
        ==================================================
        TERMINALS
        ==================================================
        */

        this.createTerminal(
            scene,
            -4,
            0,
            cyan
        );


        this.createTerminal(
            scene,
            4,
            0,
            blue
        );


        this.createTerminal(
            scene,
            -4,
            -20,
            blue
        );


        this.createTerminal(
            scene,
            4,
            20,
            orange
        );


        this.createTerminal(
            scene,
            -23,
            0,
            green
        );


        this.createTerminal(
            scene,
            23,
            0,
            purple
        );


        /*
        ==================================================
        TASKS
        ==================================================
        */

        this.tasks.push(

            this.createTask(
                scene,
                "POWER CORE",
                -4,
                0,
                cyan
            )

        );


        this.tasks.push(

            this.createTask(
                scene,
                "NAVIGATION",
                4,
                0,
                blue
            )

        );


        this.tasks.push(

            this.createTask(
                scene,
                "COMMAND",
                -4,
                -20,
                blue
            )

        );


        this.tasks.push(

            this.createTask(
                scene,
                "ENGINEERING",
                4,
                20,
                orange
            )

        );


        this.tasks.push(

            this.createTask(
                scene,
                "MEDICAL",
                -23,
                0,
                green
            )

        );


        this.tasks.push(

            this.createTask(
                scene,
                "REACTOR",
                23,
                0,
                purple
            )

        );


        /*
        ==================================================
        LIGHTS
        ==================================================
        */

        this.createLights(scene);


        /*
        ==================================================
        DATA
        ==================================================
        */

        this.rooms = [

            "CENTRAL HUB",
            "COMMAND",
            "ENGINEERING",
            "MEDICAL",
            "REACTOR"

        ];


        console.log(
            "VOID WORLD READY",
            this.rooms
        );


        return {

            rooms: this.rooms,

            tasks: this.tasks,

            spawn: {

                x: 0,
                y: 0,
                z: 7

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
        openings,
        collision
    ) {

        const wallHeight =
            5.5;


        const wallThickness =
            0.6;


        /*
        FLOOR
        */

        const floor =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    width,
                    0.25,
                    depth
                ),

                wallMaterial

            );


        floor.position.set(
            x,
            0.125,
            z
        );


        floor.receiveShadow =
            true;


        scene.add(floor);


        /*
        WALL CREATOR
        */

        const addWall =
            (
                px,
                pz,
                sx,
                sz
            ) => {

                const wall =
                    new THREE.Mesh(

                        new THREE.BoxGeometry(
                            sx,
                            wallHeight,
                            sz
                        ),

                        wallMaterial

                    );


                wall.position.set(

                    px,

                    wallHeight / 2,

                    pz

                );


                wall.castShadow =
                    true;


                wall.receiveShadow =
                    true;


                scene.add(wall);


                if (collision) {

                    collision.addBox(

                        px,
                        pz,
                        sx,
                        sz

                    );

                }

            };


        /*
        ==================================================
        NORTH WALL
        ==================================================
        */

        if (openings.includes("north")) {

            const opening =
                6;


            const side =
                (width - opening) / 2;


            addWall(
                x - (opening + side) / 2,
                z - depth / 2,
                side,
                wallThickness
            );


            addWall(
                x + (opening + side) / 2,
                z - depth / 2,
                side,
                wallThickness
            );

        }
        else {

            addWall(
                x,
                z - depth / 2,
                width,
                wallThickness
            );

        }


        /*
        SOUTH
        */

        if (openings.includes("south")) {

            const opening =
                6;


            const side =
                (width - opening) / 2;


            addWall(
                x - (opening + side) / 2,
                z + depth / 2,
                side,
                wallThickness
            );


            addWall(
                x + (opening + side) / 2,
                z + depth / 2,
                side,
                wallThickness
            );

        }
        else {

            addWall(
                x,
                z + depth / 2,
                width,
                wallThickness
            );

        }


        /*
        WEST
        */

        if (openings.includes("west")) {

            const opening =
                6;


            const side =
                (depth - opening) / 2;


            addWall(
                x - width / 2,
                z - (opening + side) / 2,
                wallThickness,
                side
            );


            addWall(
                x - width / 2,
                z + (opening + side) / 2,
                wallThickness,
                side
            );

        }
        else {

            addWall(
                x - width / 2,
                z,
                wallThickness,
                depth
            );

        }


        /*
        EAST
        */

        if (openings.includes("east")) {

            const opening =
                6;


            const side =
                (depth - opening) / 2;


            addWall(
                x + width / 2,
                z - (opening + side) / 2,
                wallThickness,
                side
            );


            addWall(
                x + width / 2,
                z + (opening + side) / 2,
                wallThickness,
                side
            );

        }
        else {

            addWall(
                x + width / 2,
                z,
                wallThickness,
                depth
            );

        }


        /*
        GLOW STRIPS
        */

        const strip =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    width - 1,
                    0.1,
                    0.08
                ),

                glowMaterial

            );


        strip.position.set(
            x,
            4.4,
            z - depth / 2 - 0.05
        );


        scene.add(strip);


        const strip2 =
            strip.clone();


        strip2.position.z =
            z + depth / 2 + 0.05;


        scene.add(strip2);

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


        const left =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    0.25,
                    5,
                    0.25
                ),

                material

            );


        left.position.set(
            -3,
            2.5,
            0
        );


        group.add(left);


        const right =
            left.clone();


        right.position.x =
            3;


        group.add(right);


        const top =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    6,
                    0.25,
                    0.25
                ),

                material

            );


        top.position.y =
            5;


        group.add(top);


        scene.add(group);

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


        const body =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    1.5,
                    1.8,
                    0.8
                ),

                this.material(
                    0x0c111d,
                    0.35,
                    0.8
                )

            );


        body.position.y =
            0.9;


        body.castShadow =
            true;


        group.add(body);


        const screen =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    1.05,
                    0.65,
                    0.05
                ),

                glowMaterial

            );


        screen.position.set(
            0,
            1.15,
            -0.43
        );


        group.add(screen);


        const base =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    1.8,
                    0.22,
                    1.05
                ),

                this.material(
                    0x080b12,
                    0.3,
                    0.9
                )

            );


        base.position.y =
            0.11;


        group.add(base);


        scene.add(group);

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


        const platform =
            new THREE.Mesh(

                new THREE.CylinderGeometry(
                    1,
                    1,
                    0.18,
                    32
                ),

                this.material(
                    0x111827,
                    0.35,
                    0.7
                )

            );


        platform.position.y =
            0.09;


        group.add(platform);


        const core =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    0.38,
                    20,
                    20
                ),

                material

            );


        core.position.y =
            0.8;


        core.userData.task =
            true;


        core.userData.label =
            label;


        core.castShadow =
            true;


        group.add(core);


        const ring =
            new THREE.Mesh(

                new THREE.TorusGeometry(
                    0.65,
                    0.06,
                    10,
                    40
                ),

                material

            );


        ring.rotation.x =
            Math.PI / 2;


        ring.position.y =
            0.8;


        group.add(ring);


        scene.add(group);


        return core;

    }


    /*
    ==================================================
    LIGHTING
    ==================================================
    */

    createLights(scene) {

        const ambient =
            new THREE.HemisphereLight(
                0x7890c8,
                0x080b12,
                1.8
            );


        scene.add(ambient);


        const cyan =
            new THREE.PointLight(
                0x20eaff,
                7,
                30
            );


        cyan.position.set(
            0,
            5,
            0
        );


        scene.add(cyan);


        const blue =
            new THREE.PointLight(
                0x347cff,
                5,
                25
            );


        blue.position.set(
            0,
            5,
            -20
        );


        scene.add(blue);


        const orange =
            new THREE.PointLight(
                0xff8a32,
                5,
                25
            );


        orange.position.set(
            0,
            5,
            20
        );


        scene.add(orange);


        const purple =
            new THREE.PointLight(
                0xb14dff,
                5,
                25
            );


        purple.position.set(
            23,
            5,
            0
        );


        scene.add(purple);


        const green =
            new THREE.PointLight(
                0x32ffb0,
                5,
                25
            );


        green.position.set(
            -23,
            5,
            0
        );


        scene.add(green);

    }

}


export default new VoidWorld();
