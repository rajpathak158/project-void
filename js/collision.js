import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


class CollisionSystem {

    constructor() {

        this.walls = [];

        this.playerRadius = 0.42;

    }


    /*
    ==========================================
    ADD RECTANGULAR COLLISION WALL
    ==========================================
    */

    addWall(
        x,
        z,
        width,
        depth
    ) {

        this.walls.push({

            minX:
                x - width / 2,

            maxX:
                x + width / 2,

            minZ:
                z - depth / 2,

            maxZ:
                z + depth / 2

        });

    }


    /*
    ==========================================
    REMOVE ALL COLLISION
    ==========================================
    */

    clear() {

        this.walls.length = 0;

    }


    /*
    ==========================================
    CIRCLE vs RECTANGLE
    ==========================================
    */

    collides(
        x,
        z
    ) {

        const radius =
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
                radius * radius
            ) {

                return true;

            }

        }

        return false;

    }


    /*
    ==========================================
    MOVE PLAYER
    ==========================================

    Separate X and Z movement.

    This prevents the player from getting
    stuck or shaking against corners.
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
        --------------------------------------
        X
        --------------------------------------
        */

        if (
            !this.collides(
                targetX,
                z
            )
        ) {

            x =
                targetX;

        }


        /*
        --------------------------------------
        Z
        --------------------------------------
        */

        if (
            !this.collides(
                x,
                targetZ
            )
        ) {

            z =
                targetZ;

        }


        player.position.x =
            x;

        player.position.z =
            z;

    }


    /*
    ==========================================
    CHECK POSITION
    ==========================================
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
    ==========================================
    DEBUG
    ==========================================
    */

    getWallCount() {

        return this.walls.length;

    }

}


export default CollisionSystem;
