class TaskSystem {

    constructor(scene, camera, player) {

        this.scene = scene;

        this.camera = camera;

        this.player = player;

        this.tasks = [];

        this.completed = 0;

        this.total = 0;

        this.activeTask = null;

        this.interactionDistance = 2.5;

        this.createUI();

    }


    /*
    ==========================================
    REGISTER TASKS
    ==========================================
    */

    register(object, name) {

        this.tasks.push({

            object: object,

            name: name,

            completed: false

        });

        this.total++;

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

                <button id="task-complete">
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


        this.completeButton.addEventListener(
            "click",
            () => {

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

        if (
            this.activeTask
        ) {

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
    ==========================================
    PROMPT
    ==========================================
    */

    showPrompt(task) {

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


        if (
            !this.promptHandler
        ) {

            this.promptHandler =
                () => {

                    this.openTask(
                        task
                    );

                };


            document.addEventListener(
                "click",
                this.promptHandler
            );

        }

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


        if (
            interaction
        ) {

            interaction.style.display =
                "none";

        }

    }


    /*
    ==========================================
    OPEN TASK
    ==========================================
    */

    openTask(task) {

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


        panel.style.display =
            "flex";


        document.getElementById(
            "task-name"
        ).textContent =
            task.name;


        this.updateProgress();

    }


    /*
    ==========================================
    COMPLETE
    ==========================================
    */

    completeCurrentTask() {

        if (
            !this.activeTask
        ) {

            return;

        }


        this.activeTask.completed =
            true;


        this.completed++;


        this.activeTask =
            null;


        const panel =
            document.getElementById(
                "task-ui"
            );


        panel.style.display =
            "none";


        this.updateProgress();


        this.hidePrompt();


        console.log(
            "Task completed!"
        );


        console.log(
            `${this.completed}/${this.total}`
        );

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


        if (
            progress
        ) {

            progress.textContent =
                `${this.completed} / ${this.total} TASKS`;

        }

    }


    /*
    ==========================================
    ALL COMPLETE
    ==========================================
    */

    allCompleted() {

        return (
            this.total > 0 &&
            this.completed ===
            this.total
        );

    }

}


export default TaskSystem;
