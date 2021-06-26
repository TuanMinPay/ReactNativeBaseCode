import AsyncStorage from '@react-native-async-storage/async-storage';
import remoteConfig from '@react-native-firebase/remote-config';

export default class ConfigManager {

    static execute() {
        remoteConfig().setDefaults(require('assets/jsons/config')).then(() => {
            console.log('Default values set.');
        });
    }

    static getItem(key, callback) {
        if (!key) callback(null);
        remoteConfig().fetch(0).then(() => {
            return remoteConfig().fetchAndActivate();
        }).then((activated) => {
            if (activated) return remoteConfig().getValue(key);
            return null;
        }).then(async (snapshot) => {
            const val = snapshot ? snapshot.asString() : null;
            if (val) {
                await AsyncStorage.setItem(key, val);
                callback(val);
            } else {
                const value = await AsyncStorage.getItem(key);
                callback(value);
            }
        }).catch(async() => {
            const value = await AsyncStorage.getItem(key);
            callback(value);
        });
    }
}
