import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


class CollisionSystem {

    constructor() {

        this.walls = [];

        this.playerRadius = 0.42;

        this.margin = 0.02;

    }


    /*
    ==================================================
    ADD RECTANGULAR COLLISION WALL
    ==================================================
    */

    addWall(
        x,
        z,
        width,
        depth
    ) {

        this.walls.push({

            minX: x - width / 2,

            maxX: x + width / 2,

            minZ: z - depth / 2,

            maxZ: z + depth / 2

        });

    }


    /*
    ==================================================
    ADD WALL ONLY IF VALID
    ==================================================
    */

    addWallSafe(
        x,
        z,
        width,
        depth
    ) {

        if (
            width <= 0 ||
            depth <= 0
        ) {

            return;

        }

        this.addWall(
            x,
            z,
            width,
            depth
        );

    }


    /*
    ==================================================
    CHECK CIRCLE AGAINST WALL
    ==================================================
    */

    circleHitsWall(
        x,
        z,
        wall
    ) {

        const closestX =
            THREE.MathUtils.clamp(
                x,
                wall.minX,
                wall.maxX
            );


        const closestZ =
            THREE.MathUtils.clamp(
                z,
                wall.minZ,
                wall.maxZ
            );


        const dx =
            x - closestX;


        const dz =
            z - closestZ;


        const radius =
            this.playerRadius +
            this.margin;


        return (
            dx * dx +
            dz * dz <
            radius * radius
        );

    }


    /*
    ==================================================
    CAN MOVE
    ==================================================
    */

    canMoveTo(
        x,
        z
    ) {

        for (
            const wall of this.walls
        ) {

            if (
                this.circleHitsWall(
                    x,
                    z,
                    wall
                )
            ) {

                return false;

            }

        }


        return true;

    }


    /*
    ==================================================
    MOVE PLAYER
    ==================================================
    */

    movePlayer(
        player,
        targetX,
        targetZ
    ) {

        let x =
            player.position.x;

        let z =
            player.position.z;


        /*
        ----------------------------------------------
        FIRST: TRY COMPLETE MOVEMENT
        ----------------------------------------------
        */

        if (
            this.canMoveTo(
                targetX,
                targetZ
            )
        ) {

            player.position.x =
                targetX;

            player.position.z =
                targetZ;

            return;

        }


        /*
        ----------------------------------------------
        SECOND: TRY X
        ----------------------------------------------
        */

        if (
            this.canMoveTo(
                targetX,
                z
            )
        ) {

            x =
                targetX;

        }


        /*
        ----------------------------------------------
        THIRD: TRY Z
        ----------------------------------------------
        */

        if (
            this.canMoveTo(
                x,
                targetZ
            )
        ) {

            z =
                targetZ;

        }


        /*
        ----------------------------------------------
        APPLY
        ----------------------------------------------
        */

        player.position.x =
            x;

        player.position.z =
            z;


        /*
        ----------------------------------------------
        FINAL DEPENETRATION FIX
        ----------------------------------------------
        */

        this.resolvePenetration(
            player
        );

    }


    /*
    ==================================================
    DEPENETRATION
    ==================================================
    */

    resolvePenetration(
        player
    ) {

        const radius =
            this.playerRadius +
            this.margin;


        /*
        Only a few iterations are needed.
        This prevents corner shaking.
        */

        for (
            let iteration = 0;
            iteration < 4;
            iteration++
        ) {

            let corrected =
                false;


            for (
                const wall of
                this.walls
            ) {

                const closestX =
                    THREE.MathUtils.clamp(
                        player.position.x,
                        wall.minX,
                        wall.maxX
                    );


                const closestZ =
                    THREE.MathUtils.clamp(
                        player.position.z,
                        wall.minZ,
                        wall.maxZ
                    );


                let dx =
                    player.position.x -
                    closestX;


                let dz =
                    player.position.z -
                    closestZ;


                const distanceSquared =
                    dx * dx +
                    dz * dz;


                if (
                    distanceSquared >=
                    radius * radius
                ) {

                    continue;

                }


                let distance =
                    Math.sqrt(
                        distanceSquared
                    );


                /*
                Player is exactly inside
                the closest point.

                Choose the nearest wall direction.
                */

                if (
                    distance < 0.0001
                ) {

                    const left =
                        Math.abs(
                            player.position.x -
                            wall.minX
                        );

                    const right =
                        Math.abs(
                            wall.maxX -
                            player.position.x
                        );

                    const top =
                        Math.abs(
                            player.position.z -
                            wall.minZ
                        );

                    const bottom =
                        Math.abs(
                            wall.maxZ -
                            player.position.z
                        );


                    const minimum =
                        Math.min(
                            left,
                            right,
                            top,
                            bottom
                        );


                    if (
                        minimum === left
                    ) {

                        dx = -1;
                        dz = 0;

                    } else if (
                        minimum === right
                    ) {

                        dx = 1;
                        dz = 0;

                    } else if (
                        minimum === top
                    ) {

                        dx = 0;
                        dz = -1;

                    } else {

                        dx = 0;
                        dz = 1;

                    }


                    distance = 1;

                }


                const penetration =
                    radius -
                    distance;


                dx /= distance;

                dz /= distance;


                player.position.x +=
                    dx *
                    penetration;

                player.position.z +=
                    dz *
                    penetration;


                corrected =
                    true;

            }


            if (
                !corrected
            ) {

                break;

            }

        }

    }


    /*
    ==================================================
    CLEAR
    ==================================================
    */

    clear() {

        this.walls.length = 0;

    }


    /*
    ==================================================
    DEBUG
    ==================================================
    */

    getWallCount() {

        return this.walls.length;

    }

}


export default CollisionSystem;
