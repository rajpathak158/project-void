class TaskSystem {

    constructor(scene, camera, player) {

        this.scene = scene;
        this.camera = camera;
        this.player = player;

        this.tasks = [];

        this.activeTask = null;

        this.interactionDistance = 2.5;

        this.createUI();

    }


    /*
    ==========================================
    REGISTER TASK
    ==========================================
    */

    register(object, name) {

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


        if (alreadyRegistered) {
            return;
        }


        this.tasks.push({

            object: object,

            name: name,

            completed: false

        });


        this.updateProgress();

    }


    /*
    ==========================================
    GET COMPLETED
    ==========================================
    */

    getCompletedCount() {

        return this.tasks.filter(
            task =>
                task.completed
        ).length;

    }


    /*
    ==========================================
    GET TOTAL
    ==========================================
    */

    getTotalCount() {

        return this.tasks.length;

    }


    /*
    ==========================================
    UI
    ==========================================
    */

    createUI() {

        this.container =
            document.createElement("div");


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


        this.container.style.display =
            "none";


        this.completeButton =
            document.getElementById(
                "task-complete"
            );


        /*
        Only the button completes
        the currently open task.
        */

        this.completeButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();

                this.completeCurrentTask();

            }
        );

    }


    /*
    ==========================================
    DISTANCE
    ==========================================
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
    ==========================================
    UPDATE
    ==========================================
    */

    update() {

        /*
        Don't search for another
        task while one is open.
        */

        if (this.activeTask) {

            return;

        }


        let closestTask =
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

                closestTask =
                    task;

            }

        }


        if (closestTask) {

            this.showPrompt(
                closestTask
            );

        } else {

            this.hidePrompt();

        }

    }


    /*
    ==========================================
    PROMPT
    ==========================================
    */

    showPrompt(task) {

        const interaction =
            document.getElementById(
                "interaction"
            );


        if (!interaction) {

            return;

        }


        interaction.style.display =
            "block";


        interaction.textContent =
            `TAP TO USE: ${task.name}`;


        /*
        Remove previous listener.
        */

        if (
            this.promptHandler
        ) {

            interaction.removeEventListener(
                "click",
                this.promptHandler
            );

        }


        /*
        Store the current task.
        */

        this.currentPromptTask =
            task;


        this.promptHandler =
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

            };


        /*
        IMPORTANT:
        Listen only on the interaction
        button, NOT the entire document.
        */

        interaction.addEventListener(
            "click",
            this.promptHandler
        );

    }


    /*
    ==========================================
    HIDE PROMPT
    ==========================================
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


        if (
            interaction &&
            this.promptHandler
        ) {

            interaction.removeEventListener(
                "click",
                this.promptHandler
            );

        }


        this.promptHandler =
            null;


        this.currentPromptTask =
            null;

    }


    /*
    ==========================================
    OPEN TASK
    ==========================================
    */

    openTask(task) {

        if (
            !task ||
            task.completed
        ) {

            return;

        }


        if (
            this.activeTask
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


        const panel =
            document.getElementById(
                "task-ui"
            );


        const name =
            document.getElementById(
                "task-name"
            );


        if (name) {

            name.textContent =
                task.name;

        }


        this.updateProgress();


        if (panel) {

            panel.style.display =
                "flex";

        }


        this.hidePrompt();

    }


    /*
    ==========================================
    COMPLETE CURRENT TASK
    ==========================================
    */

    completeCurrentTask() {

        if (
            !this.activeTask
        ) {

            return;

        }


        /*
        Make sure it isn't already
        completed.
        */

        if (
            this.activeTask.completed
        ) {

            this.activeTask =
                null;

            this.closeTask();

            return;

        }


        /*
        Mark the actual task
        as completed.
        */

        this.activeTask.completed =
            true;


        console.log(
            "Completed:",
            this.activeTask.name
        );


        /*
        Clear active task.
        */

        this.activeTask =
            null;


        /*
        Close UI.
        */

        this.closeTask();


        /*
        Update counter from the
        actual task array.
        */

        this.updateProgress();


        /*
        Check victory condition.
        */

        if (
            this.allCompleted()
        ) {

            console.log(
                "ALL TASKS COMPLETED!"
            );

        }

    }


    /*
    ==========================================
    CLOSE TASK
    ==========================================
    */

    closeTask() {

        const panel =
            document.getElementById(
                "task-ui"
            );


        if (panel) {

            panel.style.display =
                "none";

        }

    }


    /*
    ==========================================
    PROGRESS
    ==========================================
    */

    updateProgress() {

        const progress =
            document.getElementById(
                "task-progress"
            );


        if (!progress) {

            return;

        }


        const completed =
            this.getCompletedCount();


        const total =
            this.getTotalCount();


        progress.textContent =
            `${completed} / ${total} TASKS`;

    }


    /*
    ==========================================
    ALL COMPLETE
    ==========================================
    */

    allCompleted() {

        const total =
            this.getTotalCount();


        return (
            total > 0 &&
            this.getCompletedCount() === total
        );

    }


    /*
    ==========================================
    RESET
    ==========================================
    */

    reset() {

        for (
            const task of this.tasks
        ) {

            task.completed =
                false;

        }


        this.activeTask =
            null;


        this.closeTask();


        this.updateProgress();

    }


    /*
    ==========================================
    PUBLIC DATA
    ==========================================
    */

    getProgress() {

        return {

            completed:
                this.getCompletedCount(),

            total:
                this.getTotalCount()

        };

    }

}


export default TaskSystem;
