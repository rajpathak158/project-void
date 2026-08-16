/*
==================================================
PROJECT: VOID
TASK SYSTEM
VERSION 6.0
==================================================
*/

class TaskSystem {

    constructor(scene, camera, player) {

        this.scene = scene;
        this.camera = camera;
        this.player = player;

        this.tasks = [];

        this.activeTask = null;
        this.currentPromptTask = null;

        this.interactionDistance = 3.5;

        this.container = null;

        this.sequence = [];
        this.playerSequence = [];
        this.sequencePosition = 0;

        this.gameStarted = false;

        this.createUI();
        this.setupInteractButton();

    }


    /*
    ==================================================
    REGISTER TASK
    ==================================================
    */

    register(object, name = "TASK") {

        if (!object) {
            return;
        }

        if (
            this.tasks.some(
                task => task.object === object
            )
        ) {
            return;
        }

        const task = {

            object: object,

            name: name,

            completed: false

        };

        object.userData.task = true;
        object.userData.taskName = name;

        this.tasks.push(task);

        this.updateProgress();

    }


    /*
    ==================================================
    CREATE TASK UI
    ==================================================
    */

    createUI() {

        const old =
            document.getElementById(
                "void-task-system"
            );

        if (old) {
            old.remove();
        }


        this.container =
            document.createElement("div");

        this.container.id =
            "void-task-system";


        this.container.innerHTML = `

            <div id="void-task-box">

                <div id="void-task-title">
                    TASK SYSTEM
                </div>

                <div id="void-task-name">
                    SYSTEM READY
                </div>

                <div id="void-task-progress">
                    0 / 0 TASKS
                </div>

                <div id="void-task-game">

                    <div id="void-task-instruction">
                        PRESS START
                    </div>

                    <div id="void-sequence-buttons">

                        <button
                            class="void-sequence-button"
                            data-number="1"
                            type="button"
                        >
                            1
                        </button>

                        <button
                            class="void-sequence-button"
                            data-number="2"
                            type="button"
                        >
                            2
                        </button>

                        <button
                            class="void-sequence-button"
                            data-number="3"
                            type="button"
                        >
                            3
                        </button>

                        <button
                            class="void-sequence-button"
                            data-number="4"
                            type="button"
                        >
                            4
                        </button>

                    </div>

                    <button
                        id="void-task-start"
                        type="button"
                    >
                        START SYSTEM
                    </button>

                    <button
                        id="void-task-close"
                        type="button"
                    >
                        CANCEL
                    </button>

                </div>

            </div>

        `;


        document.body.appendChild(
            this.container
        );


        this.container.style.display =
            "none";


        this.taskNameElement =
            this.container.querySelector(
                "#void-task-name"
            );


        this.progressElement =
            this.container.querySelector(
                "#void-task-progress"
            );


        this.instructionElement =
            this.container.querySelector(
                "#void-task-instruction"
            );


        this.startButton =
            this.container.querySelector(
                "#void-task-start"
            );


        this.closeButton =
            this.container.querySelector(
                "#void-task-close"
            );


        this.sequenceButtons =
            this.container.querySelectorAll(
                ".void-sequence-button"
            );


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
        SEQUENCE
        */

        this.sequenceButtons.forEach(
            button => {

                button.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();
                        event.stopPropagation();

                        this.pressSequenceButton(
                            Number(
                                button.dataset.number
                            )
                        );

                    }
                );

            }
        );


        /*
        DO NOT LET GAME CAMERA
        RECEIVE UI CLICKS
        */

        this.container.addEventListener(
            "pointerdown",
            event => {

                event.stopPropagation();

            }
        );

    }


    /*
    ==================================================
    INTERACT BUTTON
    ==================================================
    */

    setupInteractButton() {

        this.interactButton =
            document.getElementById(
                "interact-button"
            );


        if (!this.interactButton) {
            return;
        }


        this.interactButton.style.display =
            "none";


        this.interactButton.addEventListener(
            "click",
            event => {

                event.preventDefault();
                event.stopPropagation();

                if (
                    this.currentPromptTask
                ) {

                    this.openTask(
                        this.currentPromptTask
                    );

                }

            }
        );

    }


    /*
    ==================================================
    PLAYER DISTANCE
    ==================================================
    */

    getDistance(task) {

        if (
            !task ||
            !task.object ||
            !this.player
        ) {

            return Infinity;

        }


        return this.player.position.distanceTo(
            task.object.getWorldPosition(
                this._taskWorldPosition ||
                (this._taskWorldPosition =
                    this.player.position.clone())
            )
        );

    }


    /*
    ==================================================
    UPDATE
    ==================================================
    */

    update() {

        if (this.activeTask) {
            return;
        }


        let closestTask = null;

        let closestDistance =
            this.interactionDistance;


        for (
            const task of this.tasks
        ) {

            if (task.completed) {
                continue;
            }


            const distance =
                this.getDistance(task);


            if (
                distance <
                closestDistance
            ) {

                closestDistance =
                    distance;

                closestTask =
                    task;

            }

        }


        if (closestTask) {

            this.showPrompt(
                closestTask
            );

        }
        else {

            this.hidePrompt();

        }

    }


    /*
    ==================================================
    SHOW INTERACTION
    ==================================================
    */

    showPrompt(task) {

        this.currentPromptTask =
            task;


        if (!this.interactButton) {
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

    hidePrompt() {

        this.currentPromptTask =
            null;


        if (this.interactButton) {

            this.interactButton.style.display =
                "none";

        }

    }


    /*
    ==================================================
    OPEN TASK
    ==================================================
    */

    openTask(task) {

        if (!task) {
            return;
        }


        if (task.completed) {
            return;
        }


        if (this.activeTask) {
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


        this.hidePrompt();


        this.container.style.display =
            "flex";


        this.taskNameElement.textContent =
            task.name;


        this.resetMiniGame();

    }


    /*
    ==================================================
    RESET MINI GAME
    ==================================================
    */

    resetMiniGame() {

        this.sequence =
            [1, 2, 3, 4]
            .sort(
                () => Math.random() - 0.5
            );


        this.playerSequence =
            [];


        this.sequencePosition =
            0;


        this.gameStarted =
            false;


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
    START
    ==================================================
    */

    startMiniGame() {

        if (!this.activeTask) {
            return;
        }


        this.gameStarted =
            true;


        this.playerSequence =
            [];


        this.sequencePosition =
            0;


        this.startButton.style.display =
            "none";


        this.instructionElement.textContent =
            "MEMORIZE SEQUENCE";


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

        for (
            const number of
            this.sequence
        ) {

            if (!this.gameStarted) {
                return;
            }


            const button =
                this.container.querySelector(
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
                180
            );

        }


        if (!this.gameStarted) {
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
    BUTTON PRESS
    ==================================================
    */

    pressSequenceButton(number) {

        if (!this.gameStarted) {
            return;
        }


        const expected =
            this.sequence[
                this.sequencePosition
            ];


        const button =
            this.container.querySelector(
                `[data-number="${number}"]`
            );


        /*
        WRONG
        */

        if (number !== expected) {

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
                    300
                );

            }


            this.gameStarted =
                false;


            this.instructionElement.textContent =
                "WRONG SEQUENCE";


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
                200
            );

        }


        this.sequencePosition++;


        if (
            this.sequencePosition >=
            this.sequence.length
        ) {

            this.finishMiniGame();

        }

    }


    /*
    ==================================================
    FINISH
    ==================================================
    */

    finishMiniGame() {

        if (!this.activeTask) {
            return;
        }


        const task =
            this.activeTask;


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
        Visual change on terminal
        */

        task.object.traverse(
            object => {

                if (
                    object.material &&
                    object.material.emissive
                ) {

                    object.material.emissiveIntensity =
                        1;

                }

            }
        );


        this.updateProgress();


        setTimeout(
            () => {

                this.closeTask();

            },
            1000
        );

    }


    /*
    ==================================================
    CLOSE
    ==================================================
    */

    closeTask() {

        this.activeTask =
            null;


        this.gameStarted =
            false;


        if (this.container) {

            this.container.style.display =
                "none";

        }


        this.update();

    }


    /*
    ==================================================
    WAIT
    ==================================================
    */

    wait(ms) {

        return new Promise(
            resolve => {

                setTimeout(
                    resolve,
                    ms
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

        if (!this.progressElement) {
            return;
        }


        const completed =
            this.tasks.filter(
                task =>
                    task.completed
            ).length;


        this.progressElement.textContent =
            `${completed} / ${this.tasks.length} TASKS`;

    }


    /*
    ==================================================
    ALL COMPLETED
    ==================================================
    */

    allCompleted() {

        return (
            this.tasks.length > 0 &&
            this.tasks.every(
                task =>
                    task.completed
            )
        );

    }

}


export default TaskSystem;
