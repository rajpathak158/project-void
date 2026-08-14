/*
==================================================
PROJECT: VOID
TASK SYSTEM v5
==================================================
*/

class TaskSystem {

    constructor(scene, camera, player) {

        this.scene = scene;
        this.camera = camera;
        this.player = player;

        this.tasks = [];

        this.activeTask = null;

        this.interactionDistance = 2.5;

        this.container = null;

        this.createUI();
    }


    /*
    ==================================================
    REGISTER
    ==================================================
    */

    register(object, name) {

        if (!object) {
            return;
        }

        const exists =
            this.tasks.some(
                task => task.object === object
            );

        if (exists) {
            return;
        }

        this.tasks.push({

            object: object,

            name:
                name ||
                "TASK",

            completed: false

        });

        this.updateProgress();
    }


    /*
    ==================================================
    UI
    ==================================================
    */

    createUI() {

        const old =
            document.getElementById(
                "task-ui"
            );

        if (old) {
            old.remove();
        }


        this.container =
            document.createElement(
                "div"
            );

        this.container.id =
            "task-ui";


        this.container.innerHTML = `

            <div id="task-panel">

                <div id="task-header">
                    TASK SYSTEM
                </div>

                <div id="task-name">
                    SYSTEM READY
                </div>

                <div id="task-progress">
                    0 / 0 TASKS
                </div>

                <div id="task-game">

                    <div id="task-instruction">
                        PRESS START
                    </div>

                    <div id="sequence-buttons">

                        <button
                            class="sequence-button"
                            data-number="1"
                        >
                            1
                        </button>

                        <button
                            class="sequence-button"
                            data-number="2"
                        >
                            2
                        </button>

                        <button
                            class="sequence-button"
                            data-number="3"
                        >
                            3
                        </button>

                        <button
                            class="sequence-button"
                            data-number="4"
                        >
                            4
                        </button>

                    </div>

                    <button
                        id="task-start"
                        type="button"
                    >
                        START SYSTEM
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
                "#task-name"
            );


        this.progressElement =
            this.container.querySelector(
                "#task-progress"
            );


        this.instructionElement =
            this.container.querySelector(
                "#task-instruction"
            );


        this.startButton =
            this.container.querySelector(
                "#task-start"
            );


        this.sequenceButtons =
            this.container.querySelectorAll(
                ".sequence-button"
            );


        /*
        ==================================================
        START BUTTON
        ==================================================
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
        ==================================================
        SEQUENCE BUTTONS
        ==================================================
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
        ==================================================
        PREVENT GAME CLICKS
        ==================================================
        */

        this.container.addEventListener(
            "click",
            event => {

                event.stopPropagation();

            }
        );

    }


    /*
    ==================================================
    DISTANCE
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


        return this.player
            .getPosition()
            .distanceTo(
                task.object.position
            );

    }


    /*
    ==================================================
    UPDATE
    ==================================================
    */

    update() {

        if (
            this.activeTask
        ) {

            return;

        }


        let closest =
            null;

        let closestDistance =
            this.interactionDistance;


        for (
            const task of this.tasks
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
                distance <
                closestDistance
            ) {

                closestDistance =
                    distance;

                closest =
                    task;

            }

        }


        if (closest) {

            this.showPrompt(
                closest
            );

        } else {

            this.hidePrompt();

        }

    }


    /*
    ==================================================
    PROMPT
    ==================================================
    */

    showPrompt(task) {

        const interaction =
            document.getElementById(
                "interaction"
            );


        if (interaction) {

            interaction.style.display =
                "block";

            interaction.textContent =
                `TAP TO USE: ${task.name}`;

        }


        if (
            this.currentPromptTask ===
            task
        ) {

            return;

        }


        this.currentPromptTask =
            task;


        if (
            this.promptHandler
        ) {

            document.removeEventListener(
                "click",
                this.promptHandler
            );

        }


        this.promptHandler =
            event => {

                if (
                    this.container &&
                    this.container.contains(
                        event.target
                    )
                ) {

                    return;

                }


                this.openTask(
                    task
                );

            };


        document.addEventListener(
            "click",
            this.promptHandler
        );

    }


    /*
    ==================================================
    HIDE PROMPT
    ==================================================
    */

    hidePrompt() {

        const interaction =
            document.getElementById(
                "interaction"
            );


        if (interaction) {

            interaction.style.display =
                "none";

        }


        this.currentPromptTask =
            null;


        if (
            this.promptHandler
        ) {

            document.removeEventListener(
                "click",
                this.promptHandler
            );

            this.promptHandler =
                null;

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


        if (this.activeTask) {
            return;
        }


        if (task.completed) {
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

        this.updateProgress();

    }


    /*
    ==================================================
    RESET MINI GAME
    ==================================================
    */

    resetMiniGame() {

        this.sequence = [];

        this.playerSequence = [];

        this.sequencePosition = 0;

        this.gameStarted = false;


        /*
        Generate random sequence.
        */

        const numbers =
            [1, 2, 3, 4];


        for (
            let i = numbers.length - 1;
            i > 0;
            i--
        ) {

            const j =
                Math.floor(
                    Math.random() *
                    (i + 1)
                );


            [
                numbers[i],
                numbers[j]
            ] =
            [
                numbers[j],
                numbers[i]
            ];

        }


        this.sequence =
            numbers;


        this.instructionElement.textContent =
            "PRESS START";


        this.startButton.style.display =
            "block";


        this.sequenceButtons.forEach(
            button => {

                button.disabled =
                    true;

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


        this.gameStarted =
            true;


        this.playerSequence =
            [];


        this.sequencePosition =
            0;


        this.instructionElement.textContent =
            "REPEAT THE SEQUENCE";


        this.startButton.style.display =
            "none";


        this.sequenceButtons.forEach(
            button => {

                button.disabled =
                    false;

                button.classList.remove(
                    "correct",
                    "wrong"
                );

            }
        );


        /*
        Show the sequence briefly.
        */

        this.showSequence();

    }


    /*
    ==================================================
    SHOW SEQUENCE
    ==================================================
    */

    async showSequence() {

        this.sequenceButtons.forEach(
            button => {

                button.disabled =
                    true;

            }
        );


        for (
            const number of this.sequence
        ) {

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
                500
            );


            button.classList.remove(
                "active"
            );


            await this.wait(
                180
            );

        }


        if (
            !this.gameStarted
        ) {

            return;

        }


        this.instructionElement.textContent =
            "NOW REPEAT IT";


        this.sequenceButtons.forEach(
            button => {

                button.disabled =
                    false;

            }
        );

    }


    /*
    ==================================================
    PRESS BUTTON
    ==================================================
    */

    pressSequenceButton(number) {

        if (
            !this.gameStarted
        ) {

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
        WRONG BUTTON
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
                    300
                );

            }


            this.instructionElement.textContent =
                "⚠ WRONG SEQUENCE";


            this.gameStarted =
                false;


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
        CORRECT BUTTON
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
        COMPLETED
        */

        if (
            this.sequencePosition >=
            this.sequence.length
        ) {

            this.finishMiniGame();

        }

    }


    /*
    ==================================================
    FINISH MINI GAME
    ==================================================
    */

    finishMiniGame() {

        if (
            !this.activeTask
        ) {

            return;

        }


        const task =
            this.activeTask;


        /*
        Safety.
        */

        if (
            task.completed
        ) {

            return;

        }


        /*
        COMPLETE TASK.
        */

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
        Update counter.
        */

        this.updateProgress();


        /*
        Wait before closing.
        */

        setTimeout(
            () => {

                this.closeTask();

            },
            1000
        );

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


        this.container.style.display =
            "none";


        this.update();

    }


    /*
    ==================================================
    WAIT
    ==================================================
    */

    wait(ms) {

        return new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    ms
                )
        );

    }


    /*
    ==================================================
    PROGRESS
    ==================================================
    */

    updateProgress() {

        if (
            !this.progressElement
        ) {

            return;

        }


        let completed =
            0;


        for (
            const task of this.tasks
        ) {

            if (
                task.completed
            ) {

                completed++;

            }

        }


        this.progressElement.textContent =
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

}


export default TaskSystem;
