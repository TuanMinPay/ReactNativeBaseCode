import {Linking} from 'react-native';
import DialogAlertHolder from '../../DialogAlertHolder';
import {strings} from 'controls/i18n';

export default class CBHandler {

    static openUrl(url) {
        Linking.canOpenURL(url).then((supported) => {
            if (!supported) {
                DialogAlertHolder.alert(strings('title_alert_open_url'), strings('message_alert_open_url'));
            }
            return Linking.openURL(url);
        }).catch((error) => console.error('An error occurred', error));
    }
}
