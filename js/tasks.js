import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


/*
==================================================
PROJECT: VOID
TASK SYSTEM v6
==================================================

FEATURES
- Works with THREE.Group player
- Uses #interact-button from index.html
- Uses existing #task-panel / #task-list
- Mobile friendly
- Interaction distance
- Sequence mini-game
- Task completion
- Retry system
- No duplicate task UI
==================================================
*/


class TaskSystem {

    constructor(
        scene,
        camera,
        player
    ) {

        this.scene = scene;

        this.camera = camera;

        this.player = player;

        this.tasks = [];

        this.activeTask = null;

        this.currentPromptTask = null;

        this.interactionDistance = 3.2;

        this.sequence = [];

        this.sequencePosition = 0;

        this.gameStarted = false;

        this.taskPanel = null;

        this.taskList = null;

        this.interactButton = null;

        this.createUI();

        this.setupInteraction();

    }


    /*
    ==================================================
    UI
    ==================================================
    */

    createUI() {

        /*
        Use existing HTML.
        */

        this.taskPanel =
            document.getElementById(
                "task-panel"
            );


        this.taskList =
            document.getElementById(
                "task-list"
            );


        this.interactButton =
            document.getElementById(
                "interact-button"
            );


        /*
        Create task-game overlay only once.
        */

        let old =
            document.getElementById(
                "void-task-game"
            );


        if (old) {

            old.remove();

        }


        const game =
            document.createElement(
                "div"
            );


        game.id =
            "void-task-game";


        game.innerHTML = `

            <div id="void-task-box">

                <div id="void-task-title">
                    TASK SYSTEM
                </div>

                <div id="void-task-name">
                    TASK
                </div>

                <div id="void-task-progress">
                    0 / 0 TASKS
                </div>

                <div id="void-task-instruction">
                    PRESS START
                </div>

                <div id="void-sequence-buttons">

                    <button
                        type="button"
                        data-number="1"
                    >
                        1
                    </button>

                    <button
                        type="button"
                        data-number="2"
                    >
                        2
                    </button>

                    <button
                        type="button"
                        data-number="3"
                    >
                        3
                    </button>

                    <button
                        type="button"
                        data-number="4"
                    >
                        4
                    </button>

                </div>

                <button
                    type="button"
                    id="void-task-start"
                >
                    START SYSTEM
                </button>

                <button
                    type="button"
                    id="void-task-close"
                >
                    CANCEL
                </button>

            </div>

        `;


        document.body.appendChild(
            game
        );


        this.gameUI =
            game;


        this.taskNameElement =
            game.querySelector(
                "#void-task-name"
            );


        this.taskProgressElement =
            game.querySelector(
                "#void-task-progress"
            );


        this.instructionElement =
            game.querySelector(
                "#void-task-instruction"
            );


        this.startButton =
            game.querySelector(
                "#void-task-start"
            );


        this.closeButton =
            game.querySelector(
                "#void-task-close"
            );


        this.sequenceButtons =
            game.querySelectorAll(
                "#void-sequence-buttons button"
            );


        /*
        Hidden initially.
        */

        game.style.display =
            "none";


        /*
        START
        */

        this.startButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();

                this.startMiniGame();

            }
        );


        /*
        CANCEL
        */

        this.closeButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();

                this.closeTask();

            }
        );


        /*
        SEQUENCE BUTTONS
        */

        this.sequenceButtons.forEach(
            button => {

                button.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();

                        event.stopPropagation();

                        const number =
                            Number(
                                button.dataset.number
                            );

                        this.pressSequenceButton(
                            number
                        );

                    }
                );

            }
        );


        /*
        Prevent canvas interaction
        while task UI is open.
        */

        game.addEventListener(
            "pointerdown",
            event => {

                event.stopPropagation();

            }
        );


        game.addEventListener(
            "click",
            event => {

                event.stopPropagation();

            }
        );


        this.updateProgress();

    }


    /*
    ==================================================
    INTERACT BUTTON
    ==================================================
    */

    setupInteraction() {

        if (!this.interactButton) {

            return;

        }


        this.interactButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();

                this.interact();

            }
        );


        this.interactButton.addEventListener(
            "touchend",
            event => {

                event.preventDefault();

                event.stopPropagation();

                this.interact();

            },
            {
                passive: false
            }
        );


        this.hideInteraction();

    }


    /*
    ==================================================
    REGISTER TASK
    ==================================================
    */

    register(
        object,
        name = "TASK"
    ) {

        if (!object) {

            return null;

        }


        /*
        Prevent duplicate registration.
        */

        const existing =
            this.tasks.find(
                task =>
                    task.object === object
            );


        if (existing) {

            return existing;

        }


        const task = {

            object: object,

            name: name,

            completed: false

        };


        this.tasks.push(
            task
        );


        /*
        Make task object visually identifiable.
        */

        object.userData =
            object.userData || {};


        object.userData.task =
            true;


        object.userData.taskName =
            name;


        this.updateTaskList();

        this.updateProgress();

        return task;

    }


    /*
    ==================================================
    REGISTER MANY
    ==================================================
    */

    registerMany(
        objects
    ) {

        if (!Array.isArray(objects)) {

            return;

        }


        objects.forEach(
            object => {

                if (!object) {

                    return;

                }


                const name =
                    object.userData?.taskName ||
                    object.name ||
                    "TASK";


                this.register(
                    object,
                    name
                );

            }
        );

    }


    /*
    ==================================================
    PLAYER POSITION
    ==================================================
    */

    getPlayerPosition() {

        const position =
            new THREE.Vector3();


        if (
            this.player &&
            this.player.isObject3D
        ) {

            this.player.getWorldPosition(
                position
            );

        }


        return position;

    }


    /*
    ==================================================
    TASK POSITION
    ==================================================
    */

    getTaskPosition(
        task
    ) {

        const position =
            new THREE.Vector3();


        if (
            task &&
            task.object &&
            task.object.isObject3D
        ) {

            task.object.getWorldPosition(
                position
            );

        }


        return position;

    }


    /*
    ==================================================
    DISTANCE
    ==================================================
    */

    getDistance(
        task
    ) {

        if (
            !task ||
            !task.object ||
            !this.player
        ) {

            return Infinity;

        }


        const playerPosition =
            this.getPlayerPosition();


        const taskPosition =
            this.getTaskPosition(
                task
            );


        return playerPosition.distanceTo(
            taskPosition
        );

    }


    /*
    ==================================================
    FIND CLOSEST TASK
    ==================================================
    */

    getClosestTask() {

        let closest =
            null;


        let closestDistance =
            this.interactionDistance;


        for (
            const task of
            this.tasks
        ) {

            if (
                task.completed
            ) {

                continue;

            }


            const distance =
                this.getDistance(
                    task
                );


            if (
                distance <=
                closestDistance
            ) {

                closestDistance =
                    distance;

                closest =
                    task;

            }

        }


        return closest;

    }


    /*
    ==================================================
    UPDATE
    ==================================================
    */

    update() {

        /*
        Do not show prompts while
        a task is open.
        */

        if (
            this.activeTask
        ) {

            return;

        }


        const closest =
            this.getClosestTask();


        if (closest) {

            this.currentPromptTask =
                closest;


            this.showInteraction(
                closest
            );

        }
        else {

            this.currentPromptTask =
                null;


            this.hideInteraction();

        }


        this.updateTaskList();

    }


    /*
    ==================================================
    SHOW INTERACTION
    ==================================================
    */

    showInteraction(
        task
    ) {

        if (
            !this.interactButton
        ) {

            return;

        }


        this.interactButton.style.display =
            "block";


        this.interactButton.textContent =
            `USE: ${task.name}`;

    }


    /*
    ==================================================
    HIDE INTERACTION
    ==================================================
    */

    hideInteraction() {

        if (
            !this.interactButton
        ) {

            return;

        }


        this.interactButton.style.display =
            "none";

    }


    /*
    ==================================================
    INTERACT
    ==================================================
    */

    interact() {

        if (
            this.activeTask
        ) {

            return;

        }


        const task =
            this.getClosestTask();


        if (!task) {

            return;

        }


        this.openTask(
            task
        );

    }


    /*
    ==================================================
    OPEN TASK
    ==================================================
    */

    openTask(
        task
    ) {

        if (!task) {

            return;

        }


        if (
            task.completed
        ) {

            return;

        }


        if (
            this.getDistance(task) >
            this.interactionDistance
        ) {

            return;

        }


        this.activeTask =
            task;


        this.hideInteraction();


        this.gameUI.style.display =
            "flex";


        this.taskNameElement.textContent =
            task.name;


        this.resetMiniGame();


        this.updateProgress();

    }


    /*
    ==================================================
    CLOSE TASK
    ==================================================
    */

    closeTask() {

        this.activeTask =
            null;


        this.gameStarted =
            false;


        this.gameUI.style.display =
            "none";


        this.update();

    }


    /*
    ==================================================
    RESET MINI GAME
    ==================================================
    */

    resetMiniGame() {

        this.gameStarted =
            false;


        this.sequencePosition =
            0;


        /*
        Generate random 4-number sequence.
        */

        this.sequence = [

            1,
            2,
            3,
            4

        ];


        for (
            let i =
                this.sequence.length - 1;

            i > 0;

            i--
        ) {

            const j =
                Math.floor(
                    Math.random() *
                    (i + 1)
                );


            [
                this.sequence[i],
                this.sequence[j]
            ] =
            [
                this.sequence[j],
                this.sequence[i]
            ];

        }


        this.instructionElement.textContent =
            "PRESS START";


        this.startButton.textContent =
            "START SYSTEM";


        this.startButton.style.display =
            "block";


        this.sequenceButtons.forEach(
            button => {

                button.disabled =
                    true;


                button.classList.remove(
                    "active",
                    "correct",
                    "wrong"
                );

            }
        );

    }


    /*
    ==================================================
    START MINI GAME
    ==================================================
    */

    startMiniGame() {

        if (
            !this.activeTask
        ) {

            return;

        }


        if (
            this.gameStarted
        ) {

            return;

        }


        this.gameStarted =
            true;


        this.sequencePosition =
            0;


        this.instructionElement.textContent =
            "MEMORIZE SEQUENCE";


        this.startButton.style.display =
            "none";


        this.sequenceButtons.forEach(
            button => {

                button.disabled =
                    true;

                button.classList.remove(
                    "correct",
                    "wrong"
                );

            }
        );


        this.showSequence();

    }


    /*
    ==================================================
    SHOW SEQUENCE
    ==================================================
    */

    async showSequence() {

        if (
            !this.gameStarted
        ) {

            return;

        }


        for (
            const number of
            this.sequence
        ) {

            if (
                !this.gameStarted
            ) {

                return;

            }


            const button =
                this.gameUI.querySelector(
                    `[data-number="${number}"]`
                );


            if (!button) {

                continue;

            }


            button.classList.add(
                "active"
            );


            await this.wait(
                550
            );


            button.classList.remove(
                "active"
            );


            await this.wait(
                220
            );

        }


        if (
            !this.gameStarted
        ) {

            return;

        }


        this.instructionElement.textContent =
            "REPEAT THE SEQUENCE";


        this.sequenceButtons.forEach(
            button => {

                button.disabled =
                    false;

            }
        );

    }


    /*
    ==================================================
    PRESS SEQUENCE BUTTON
    ==================================================
    */

    pressSequenceButton(
        number
    ) {

        if (
            !this.gameStarted ||
            !this.activeTask
        ) {

            return;

        }


        const expected =
            this.sequence[
                this.sequencePosition
            ];


        const button =
            this.gameUI.querySelector(
                `[data-number="${number}"]`
            );


        /*
        WRONG
        */

        if (
            number !== expected
        ) {

            if (button) {

                button.classList.add(
                    "wrong"
                );


                setTimeout(
                    () => {

                        button.classList.remove(
                            "wrong"
                        );

                    },
                    350
                );

            }


            this.gameStarted =
                false;


            this.sequencePosition =
                0;


            this.instructionElement.textContent =
                "WRONG — TRY AGAIN";


            this.startButton.textContent =
                "TRY AGAIN";


            this.startButton.style.display =
                "block";


            this.sequenceButtons.forEach(
                button => {

                    button.disabled =
                        true;

                }
            );


            return;

        }


        /*
        CORRECT
        */

        if (button) {

            button.classList.add(
                "correct"
            );


            setTimeout(
                () => {

                    button.classList.remove(
                        "correct"
                    );

                },
                250
            );

        }


        this.sequencePosition++;


        /*
        FINISHED
        */

        if (
            this.sequencePosition >=
            this.sequence.length
        ) {

            this.finishTask();

        }

    }


    /*
    ==================================================
    FINISH TASK
    ==================================================
    */

    finishTask() {

        if (
            !this.activeTask
        ) {

            return;

        }


        const task =
            this.activeTask;


        if (
            task.completed
        ) {

            return;

        }


        task.completed =
            true;


        this.gameStarted =
            false;


        this.instructionElement.textContent =
            "✓ TASK COMPLETED";


        this.sequenceButtons.forEach(
            button => {

                button.disabled =
                    true;

            }
        );


        /*
        Update world object.
        */

        if (
            task.object
        ) {

            task.object.userData.taskCompleted =
                true;

        }


        this.updateProgress();

        this.updateTaskList();


        /*
        Close after success.
        */

        setTimeout(
            () => {

                if (
                    this.activeTask ===
                    task
                ) {

                    this.closeTask();

                }

            },
            1000
        );

    }


    /*
    ==================================================
    TASK LIST
    ==================================================
    */

    updateTaskList() {

        if (!this.taskList) {

            return;

        }


        if (
            this.tasks.length === 0
        ) {

            this.taskList.innerHTML =
                `<div class="task-item">
                    <span class="task-dot"></span>
                    NO TASKS
                </div>`;

            return;

        }


        this.taskList.innerHTML =
            "";


        this.tasks.forEach(
            task => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "task-item";


                if (
                    task.completed
                ) {

                    item.classList.add(
                        "task-complete"
                    );

                }


                const dot =
                    document.createElement(
                        "span"
                    );


                dot.className =
                    "task-dot";


                const text =
                    document.createElement(
                        "span"
                    );


                text.textContent =
                    task.name;


                item.appendChild(
                    dot
                );


                item.appendChild(
                    text
                );


                this.taskList.appendChild(
                    item
                );

            }
        );

    }


    /*
    ==================================================
    PROGRESS
    ==================================================
    */

    updateProgress() {

        if (
            !this.taskProgressElement
        ) {

            return;

        }


        let completed =
            0;


        for (
            const task of
            this.tasks
        ) {

            if (
                task.completed
            ) {

                completed++;

            }

        }


        this.taskProgressElement.textContent =
            `${completed} / ${this.tasks.length} TASKS`;

    }


    /*
    ==================================================
    ALL COMPLETED
    ==================================================
    */

    allCompleted() {

        if (
            this.tasks.length === 0
        ) {

            return false;

        }


        return this.tasks.every(
            task =>
                task.completed
        );

    }


    /*
    ==================================================
    WAIT
    ==================================================
    */

    wait(
        milliseconds
    ) {

        return new Promise(
            resolve => {

                setTimeout(
                    resolve,
                    milliseconds
                );

            }
        );

    }

}


export default TaskSystem;
