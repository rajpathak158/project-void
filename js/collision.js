import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


class CollisionSystem {

    constructor() {

        this.walls = [];

        // Character collision radius
        this.playerRadius = 0.38;

    }


    /*
    ==================================================
    ADD WALL
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
    REMOVE ALL WALLS
    ==================================================
    */

    clear() {

        this.walls.length = 0;

    }


    /*
    ==================================================
    CHECK COLLISION
    ==================================================
    */

    collides(
        x,
        z
    ) {

        const r =
            this.playerRadius;


        for (
            const wall of this.walls
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


            if (
                dx * dx +
                dz * dz <
                r * r
            ) {

                return true;

            }

        }


        return false;

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

        return !this.collides(
            x,
            z
        );

    }


    /*
    ==================================================
    MOVEMENT WITH WALL SLIDING
    ==================================================
    */

    movePlayer(
        player,
        targetX,
        targetZ
    ) {

        const currentX =
            player.position.x;

        const currentZ =
            player.position.z;


        /*
        ----------------------------------------------
        Try full movement
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
        Try X only
        ----------------------------------------------
        */

        if (
            this.canMoveTo(
                targetX,
                currentZ
            )
        ) {

            player.position.x =
                targetX;

        }


        /*
        ----------------------------------------------
        Try Z only
        ----------------------------------------------
        */

        if (
            this.canMoveTo(
                player.position.x,
                targetZ
            )
        ) {

            player.position.z =
                targetZ;

        }

    }


    /*
    ==================================================
    GET WALL COUNT
    ==================================================
    */

    getWallCount() {

        return this.walls.length;

    }

}


export default CollisionSystem;
