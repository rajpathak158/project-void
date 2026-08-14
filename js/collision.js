import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


class CollisionSystem {

    constructor() {

        this.walls = [];

        this.playerRadius = 0.45;

    }


    /*
    ==========================================
    ADD WALL
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
    CHECK POSITION
    ==========================================
    */

    canMoveTo(
        x,
        z
    ) {

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


            const distanceSquared =
                dx * dx +
                dz * dz;


            if (
                distanceSquared <
                this.playerRadius *
                this.playerRadius
            ) {

                return false;

            }

        }


        return true;

    }


    /*
    ==========================================
    SAFE MOVE
    ==========================================
    */

    movePlayer(
        player,
        newX,
        newZ
    ) {

        /*
        Try X movement
        */

        if (
            this.canMoveTo(
                newX,
                player.position.z
            )
        ) {

            player.position.x =
                newX;

        }


        /*
        Try Z movement
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
    ==========================================
    CLEAR
    ==========================================
    */

    clear() {

        this.walls = [];

    }

}


export default CollisionSystem;
