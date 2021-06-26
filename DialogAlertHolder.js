export default class DialogAlertHolder {

    static dialogAlert;

    static setDialogAlert(dialogAlert) {
        this.dialogAlert = dialogAlert;
    }

    static alert(...args) {
        if (this.dialogAlert) {
            this.dialogAlert.alert(...args);
        }
    }

    static dismiss() {
        if (this.dialogAlert) {
            this.dialogAlert.hide();
        }
    }
}
