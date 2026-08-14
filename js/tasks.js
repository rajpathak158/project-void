/*
==================================================
PROJECT: VOID
TASK SYSTEM
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


        /*
        ==========================================
        TASK DATA
        ==========================================
        */

        this.tasks = [];

        this.total = 0;

        this.activeTask = null;


        /*
        ==========================================
        SETTINGS
        ==========================================
        */

        this.interactionDistance = 2.5;


        /*
        ==========================================
        UI
        ==========================================
        */

        this.container = null;

        this.completeButton = null;

        this.taskNameElement = null;

        this.progressElement = null;


        /*
        ==========================================
        INTERACTION
        ==========================================
        */

        this.promptHandler = null;

        this.currentPromptTask = null;


        /*
        ==========================================
        CREATE UI
        ==========================================
        */

        this.createUI();

    }


    /*
    ==================================================
    REGISTER TASK
    ==================================================
    */

    register(
        object,
        name
    ) {

        /*
        Prevent invalid task.
        */

        if (!object) {

            return;

        }


        /*
        Prevent duplicate registration.
        */

        const alreadyRegistered =
            this.tasks.some(
                task =>
                    task.object === object
            );


        if (
            alreadyRegistered
        ) {

            return;

        }


        /*
        Create task.
        */

        const task = {

            object: object,

            name:
                name ||
                "TASK",

            completed: false

        };


        this.tasks.push(
            task
        );


        /*
        Always derive total
        from actual task list.
        */

        this.total =
            this.tasks.length;


        this.updateProgress();

    }


    /*
    ==================================================
    UI
    ==================================================
    */

    createUI() {

        /*
        Remove an old task UI if one exists.
        This protects against duplicate UI.
        */

        const oldUI =
            document.getElementById(
                "task-ui"
            );


        if (oldUI) {

            oldUI.remove();

        }


        /*
        Create container.
        */

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

                <button
                    id="task-complete"
                    type="button"
                >
                    COMPLETE TASK
                </button>

            </div>

        `;


        document.body.appendChild(
            this.container
        );


        /*
        Hide initially.
        */

        this.container.style.display =
            "none";


        /*
        Store references.
        */

        this.completeButton =
            this.container.querySelector(
                "#task-complete"
            );


        this.taskNameElement =
            this.container.querySelector(
                "#task-name"
            );


        this.progressElement =
            this.container.querySelector(
                "#task-progress"
            );


        /*
        Complete button.
        */

        this.completeButton.addEventListener(
            "click",
            event => {

                /*
                Stop click from reaching
                the interaction system.
                */

                event.preventDefault();

                event.stopPropagation();


                this.completeCurrentTask();

            }
        );


        /*
        Prevent pointer events from
        accidentally affecting the game.
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
            this.player.getPosition();


        const taskPosition =
            task.object.position;


        return playerPosition.distanceTo(
            taskPosition
        );

    }


    /*
    ==================================================
    UPDATE
    ==================================================
    */

    update() {

        /*
        Don't search for another task
        while one is already open.
        */

        if (
            this.activeTask
        ) {

            return;

        }


        /*
        Find closest unfinished task.
        */

        let closestTask =
            null;


        let closestDistance =
            this.interactionDistance;


        for (
            const task of this.tasks
        ) {

            /*
            IMPORTANT:
            Completed tasks are ignored.
            */

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

                closestTask =
                    task;

            }

        }


        /*
        Show / hide interaction.
        */

        if (
            closestTask
        ) {

            this.showPrompt(
                closestTask
            );

        } else {

            this.hidePrompt();

        }

    }


    /*
    ==================================================
    SHOW PROMPT
    ==================================================
    */

    showPrompt(
        task
    ) {

        const interaction =
            document.getElementById(
                "interaction"
            );


        if (
            interaction
        ) {

            interaction.style.display =
                "block";


            interaction.textContent =
                `TAP TO USE: ${task.name}`;

        }


        /*
        Don't create multiple
        document click listeners.
        */

        if (
            this.currentPromptTask ===
            task
        ) {

            return;

        }


        this.currentPromptTask =
            task;


        /*
        Remove old handler.
        */

        if (
            this.promptHandler
        ) {

            document.removeEventListener(
                "click",
                this.promptHandler
            );

        }


        /*
        Create new handler.
        */

        this.promptHandler =
            event => {

                /*
                Ignore clicks on the
                task UI itself.
                */

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


        if (
            interaction
        ) {

            interaction.style.display =
                "none";

        }


        this.currentPromptTask =
            null;


        /*
        Remove old click listener.
        */

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

    openTask(
        task
    ) {

        /*
        Safety checks.
        */

        if (
            !task
        ) {

            return;

        }


        if (
            this.activeTask
        ) {

            return;

        }


        /*
        A completed task can NEVER
        be opened again.
        */

        if (
            task.completed
        ) {

            return;

        }


        /*
        Distance check.
        */

        if (
            this.getDistance(task) >
            this.interactionDistance
        ) {

            return;

        }


        /*
        Set active task.
        */

        this.activeTask =
            task;


        /*
        Hide interaction prompt.
        */

        this.hidePrompt();


        /*
        Show task panel.
        */

        this.container.style.display =
            "flex";


        /*
        Task name.
        */

        this.taskNameElement.textContent =
            task.name;


        /*
        Progress.
        */

        this.updateProgress();

    }


    /*
    ==================================================
    COMPLETE TASK
    ==================================================
    */

    completeCurrentTask() {

        /*
        No active task.
        */

        if (
            !this.activeTask
        ) {

            return;

        }


        const task =
            this.activeTask;


        /*
        CRITICAL PROTECTION
        ==============================================

        If the task is already completed,
        DO NOT increase anything.
        */

        if (
            task.completed
        ) {

            this.activeTask =
                null;

            this.closeTaskUI();

            return;

        }


        /*
        Mark task completed.
        */

        task.completed =
            true;


        /*
        Clear active task immediately.
        This prevents double-clicks.
        */

        this.activeTask =
            null;


        /*
        Close UI.
        */

        this.closeTaskUI();


        /*
        Update progress from
        actual task states.
        */

        this.updateProgress();


        /*
        Check all tasks.
        */

        if (
            this.allCompleted()
        ) {

            console.log(
                "ALL TASKS COMPLETED!"
            );

        } else {

            console.log(
                "Task completed:",
                task.name
            );

        }


        /*
        Refresh interaction.
        */

        setTimeout(
            () => {

                this.update();

            },
            50
        );

    }


    /*
    ==================================================
    CLOSE TASK UI
    ==================================================
    */

    closeTaskUI() {

        if (
            this.container
        ) {

            this.container.style.display =
                "none";

        }


        this.activeTask =
            null;

    }


    /*
    ==================================================
    GET COMPLETED COUNT
    ==================================================
    */

    getCompletedCount() {

        /*
        IMPORTANT:

        We calculate this from the
        actual task objects.

        Therefore it is IMPOSSIBLE
        to get 9 / 4.
        */

        let count = 0;


        for (
            const task of this.tasks
        ) {

            if (
                task.completed
            ) {

                count++;

            }

        }


        return count;

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
            this.getCompletedCount();


        const total =
            this.tasks.length;


        this.progressElement.textContent =
            `${completed} / ${total} TASKS`;

    }


    /*
    ==================================================
    ALL COMPLETED
    ==================================================
    */

    allCompleted() {

        const total =
            this.tasks.length;


        if (
            total === 0
        ) {

            return false;

        }


        return (
            this.getCompletedCount() ===
            total
        );

    }


    /*
    ==================================================
    PUBLIC
    ==================================================
    */

    getProgress() {

        return {

            completed:
                this.getCompletedCount(),

            total:
                this.tasks.length

        };

    }

}


export default TaskSystem;
