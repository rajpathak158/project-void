import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


class CollisionSystem {

    constructor() {

        this.walls = [];

        this.playerRadius = 0.45;

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
    ==================================================
    REMOVE ALL COLLIDERS
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

        const radius =
            this.playerRadius;


        for (
            const wall of this.walls
        ) {

            /*
            Closest point on wall
            to player center.
            */

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
    MOVE PLAYER
    ==================================================

    Attempts the complete movement first.

    If blocked, X and Z are tested separately.

    This creates smooth wall sliding instead
    of the shaking caused by repeatedly rejecting
    the complete movement vector.
    ==================================================
    */

    movePlayer(
        player,
        newX,
        newZ
    ) {

        const currentX =
            player.position.x;


        const currentZ =
            player.position.z;


        /*
        No movement.
        */

        if (
            Math.abs(
                newX - currentX
            ) < 0.000001 &&
            Math.abs(
                newZ - currentZ
            ) < 0.000001
        ) {

            return;

        }


        /*
        ==================================================
        TRY COMPLETE MOVEMENT
        ==================================================
        */

        if (
            this.canMoveTo(
                newX,
                newZ
            )
        ) {

            player.position.x =
                newX;

            player.position.z =
                newZ;

            return;

        }


        /*
        ==================================================
        TRY X
        ==================================================
        */

        if (
            this.canMoveTo(
                newX,
                currentZ
            )
        ) {

            player.position.x =
                newX;

        }


        /*
        ==================================================
        TRY Z
        ==================================================
        */

        if (
            this.canMoveTo(
                player.position.x,
                newZ
            )
        ) {

            player.position.z =
                newZ;

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
