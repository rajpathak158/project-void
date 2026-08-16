/*
==================================================
PROJECT: VOID
TASK SYSTEM v6
==================================================
*/

class TaskSystem {

    constructor(
        scene,
        camera,
        player,
        tasks = []
    ) {

        this.scene = scene;
        this.camera = camera;
        this.player = player;

        this.tasks = [];

        this.activeTask = null;
        this.nearestTask = null;

        this.interactionDistance = 3.2;

        this.container = null;

        this.sequence = [];
        this.playerSequence = [];
        this.sequencePosition = 0;

        this.gameStarted = false;

        this.createUI();

        this.setTasks(tasks);

    }


    /*
    ==================================================
    SET TASKS
    ==================================================
    */

    setTasks(tasks) {

        this.tasks = Array.isArray(tasks)
            ? tasks
            : [];

        /*
        Normalize task objects.
        */

        this.tasks =
            this.tasks
                .filter(task =>
                    task &&
                    task.object
                )
                .map(task => {

                    if (
                        typeof task.completed !==
                        "boolean"
                    ) {

                        task.completed = false;

                    }

                    if (!task.name) {

                        task.name =
                            task.object
                                ?.userData
                                ?.taskName ||
                            "TASK";

                    }

                    return task;

                });


        this.updateProgress();

        this.updateTaskList();


        console.log(
            "TASK SYSTEM:",
            this.tasks.length,
            "TASKS REGISTERED"
        );

    }


    /*
    ==================================================
    UI
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
            document.createElement(
                "div"
            );


        this.container.id =
            "void-task-system";


        this.container.innerHTML = `

            <div id="void-task-window">

                <div id="void-task-title">
                    TASK SYSTEM
                </div>

                <div id="void-task-name">
                    SYSTEM READY
                </div>

                <div id="void-task-progress">
                    0 / 0 TASKS
                </div>

                <div id="void-task-instruction">
                    PRESS START
                </div>

                <div id="void-sequence-buttons">

                    <button
                        class="void-sequence-button"
                        data-number="1"
                    >
                        1
                    </button>

                    <button
                        class="void-sequence-button"
                        data-number="2"
                    >
                        2
                    </button>

                    <button
                        class="void-sequence-button"
                        data-number="3"
                    >
                        3
                    </button>

                    <button
                        class="void-sequence-button"
                        data-number="4"
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
        Prevent game input.
        */

        this.container.addEventListener(
            "pointerdown",
            event => {

                event.stopPropagation();

            }
        );

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


        const dx =
            this.player.position.x -
            task.object.position.x;


        const dz =
            this.player.position.z -
            task.object.position.z;


        return Math.sqrt(
            dx * dx +
            dz * dz
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


        let closest = null;

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
                distance <
                closestDistance
            ) {

                closestDistance =
                    distance;

                closest =
                    task;

            }

        }


        this.nearestTask =
            closest;


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

        const button =
            document.getElementById(
                "interact-button"
            );


        if (!button) {

            return;

        }


        button.style.display =
            "block";


        button.textContent =
            `USE: ${task.name}`;


        button.onclick =
            event => {

                event.preventDefault();

                event.stopPropagation();

                this.openTask(task);

            };

    }


    /*
    ==================================================
    HIDE PROMPT
    ==================================================
    */

    hidePrompt() {

        const button =
            document.getElementById(
                "interact-button"
            );


        if (!button) {

            return;

        }


        button.style.display =
            "none";


        button.onclick =
            null;

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


        if (
            this.activeTask
        ) {

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


        this.hidePrompt();


        this.container.style.display =
            "flex";


        this.taskNameElement.textContent =
            task.name;


        this.resetMiniGame();

    }


    /*
    ==================================================
    RESET
    ==================================================
    */

    resetMiniGame() {

        this.sequence = [];

        this.playerSequence = [];

        this.sequencePosition = 0;

        this.gameStarted = false;


        const numbers =
            [1, 2, 3, 4];


        /*
        Shuffle
        */

        for (
            let i =
                numbers.length - 1;

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
            ] = [
                numbers[j],
                numbers[i]
            ];

        }


        this.sequence =
            numbers;


        this.instructionElement.textContent =
            "PRESS START";


        this.startButton.textContent =
            "START SYSTEM";


        this.startButton.style.display =
            "block";


        this.closeButton.style.display =
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


        this.startButton.style.display =
            "none";


        this.closeButton.style.display =
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

            if (
                !this.gameStarted
            ) {

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
                450
            );


            button.classList.remove(
                "active"
            );


            await this.wait(
                150
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
    PRESS
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


            this.closeButton.style.display =
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
                220
            );

        }


        this.sequencePosition++;


        /*
        COMPLETE
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
    FINISH
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


        this.updateProgress();

        this.updateTaskList();


        /*
        Mark terminal completed.
        */

        if (
            task.object
        ) {

            task.object.userData.completed =
                true;

        }


        setTimeout(
            () => {

                this.closeTask();

            },
            900
        );

    }


    /*
    ==================================================
    CLOSE
    ==================================================
    */

    closeTask() {

        this.gameStarted =
            false;


        this.activeTask =
            null;


        if (this.container) {

            this.container.style.display =
                "none";

        }


        this.update();

    }


    /*
    ==================================================
    TASK LIST
    ==================================================
    */

    updateTaskList() {

        const list =
            document.getElementById(
                "task-list"
            );


        if (!list) {

            return;

        }


        if (
            this.tasks.length === 0
        ) {

            list.innerHTML =
                `
                <div class="task-item">
                    <span>NO TASKS</span>
                </div>
                `;

            return;

        }


        list.innerHTML =
            this.tasks
                .map(task => {

                    const completed =
                        task.completed;


                    return `

                        <div
                            class="
                                task-item
                                ${
                                    completed
                                        ? "task-complete"
                                        : ""
                                }
                            "
                        >

                            <span
                                class="task-dot"
                            ></span>

                            <span>
                                ${task.name}
                            </span>

                        </div>

                    `;

                })
                .join("");

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
    DESTROY
    ==================================================
    */

    destroy() {

        if (
            this.container
        ) {

            this.container.remove();

        }

        this.tasks = [];

        this.activeTask = null;

    }

}


export default TaskSystem;
