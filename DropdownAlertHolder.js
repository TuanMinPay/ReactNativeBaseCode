export default class DropdownAlertHolder {

    static dropdownAlert;

    static setDropdownAlert(dropdownAlert) {
        this.dropdownAlert = dropdownAlert;
    }

    static alertWithType(...args) {
        if (this.dropdownAlert) {
            this.dropdownAlert.alertWithType(...args);
        }
    }
}
