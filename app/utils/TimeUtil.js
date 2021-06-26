import moment from 'moment';

export default class TimeUtil {

    static getTimezone() {
        return moment().utcOffset() / 60;
    }
}
