export default class TaskManager {

    constructor() {
        this.MAX_RUNNING_TASK = 1;
        this.currentRunningTask = 0;
        this.taskList = [];
        this.currentIndex = 0;
    }

    addTask(task) {
        if (task && typeof task === 'function') {
            this.taskList.push(task);
        }
    }

    clear() {
        this.taskList = [];
        this.currentRunningTask = 0;
        this.currentIndex = 0;
    }

    doTask(callback) {
        let task = this.taskList[this.currentIndex];
        if (task && typeof task === 'function' && this.currentRunningTask < this.MAX_RUNNING_TASK) {
            this.currentRunningTask = this.currentRunningTask + 1;
            this.currentIndex = this.currentIndex + 1;
            task(() => {
                this.currentRunningTask = Math.max(this.currentRunningTask - 1, 0);
                this.doTask(callback);
            });
            this.doTask(callback);
        } else if (this.currentRunningTask === 0) {
            if (callback && typeof callback === 'function') {
                callback();
            }
        } else {
            console.log('Waitting....');
        }
    }
}
