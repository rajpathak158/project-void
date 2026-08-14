import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


class CollisionSystem {

    constructor() {

        this.walls = [];

        /*
        ==========================================
        PLAYER COLLISION SIZE
        ==========================================
        */

        this.playerRadius = 0.42;

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

        /*
        Ignore invalid walls
        */

        if (
            width <= 0 ||
            depth <= 0
        ) {

            return;

        }


        /*
        Store exact rectangular
        collision area.
        */

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

        const radius =
            this.playerRadius;


        for (
            const wall of this.walls
        ) {

            /*
            Expand collision rectangle
            by player radius.
            */

            const minX =
                wall.minX - radius;

            const maxX =
                wall.maxX + radius;

            const minZ =
                wall.minZ - radius;

            const maxZ =
                wall.maxZ + radius;


            /*
            Player is inside the
            expanded wall area.
            */

            if (
                x >= minX &&
                x <= maxX &&
                z >= minZ &&
                z <= maxZ
            ) {

                return false;

            }

        }


        return true;

    }


    /*
    ==========================================
    SAFE PLAYER MOVEMENT
    ==========================================
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
        ======================================
        X AXIS
        ======================================
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
        ======================================
        Z AXIS
        ======================================
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
    RESOLVE PLAYER POSITION
    ==========================================
    
    Prevents the player from becoming
    stuck inside a wall.
    
    ==========================================
    */

    resolvePlayerPosition(
        player
    ) {

        let x =
            player.position.x;

        let z =
            player.position.z;


        const radius =
            this.playerRadius;


        for (
            const wall of this.walls
        ) {

            const minX =
                wall.minX - radius;

            const maxX =
                wall.maxX + radius;

            const minZ =
                wall.minZ - radius;

            const maxZ =
                wall.maxZ + radius;


            /*
            Is player inside wall?
            */

            if (
                x >= minX &&
                x <= maxX &&
                z >= minZ &&
                z <= maxZ
            ) {

                /*
                Distance to each side
                */

                const distanceLeft =
                    Math.abs(
                        x - minX
                    );

                const distanceRight =
                    Math.abs(
                        maxX - x
                    );

                const distanceTop =
                    Math.abs(
                        z - minZ
                    );

                const distanceBottom =
                    Math.abs(
                        maxZ - z
                    );


                const smallest =
                    Math.min(
                        distanceLeft,
                        distanceRight,
                        distanceTop,
                        distanceBottom
                    );


                /*
                Push player toward
                nearest safe side.
                */

                if (
                    smallest ===
                    distanceLeft
                ) {

                    x =
                        minX;

                }
                else if (
                    smallest ===
                    distanceRight
                ) {

                    x =
                        maxX;

                }
                else if (
                    smallest ===
                    distanceTop
                ) {

                    z =
                        minZ;

                }
                else {

                    z =
                        maxZ;

                }

            }

        }


        player.position.x =
            x;

        player.position.z =
            z;

    }


    /*
    ==========================================
    CHECK WALL COUNT
    ==========================================
    */

    getWallCount() {

        return this.walls.length;

    }


    /*
    ==========================================
    CLEAR ALL COLLISIONS
    ==========================================
    */

    clear() {

        this.walls.length =
            0;

    }

}


export default CollisionSystem;if (
    this.collision &&
    typeof this.collision.resolvePlayerPosition ===
    "function"
) {

    this.collision.resolvePlayerPosition(
        this.player
    );

}
