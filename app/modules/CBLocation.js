import {
    NativeModules,
    NativeEventEmitter
} from 'react-native';

const CBLocationModule = NativeModules.CBLocation;
const CBLocationEmitter = new NativeEventEmitter(CBLocationModule);

export default class CBLocation {

    static getCurrentLocation(callback) {
        CBLocationModule.getCurrentLocation(callback);
    }

    static startUpdatingLocation() {
        CBLocationModule.startUpdatingLocation();
    }

    static stopUpdatingLocation() {
        CBLocationModule.stopUpdatingLocation();
    }

    static onLocationChange(callback) {
        return CBLocationEmitter.addListener('CBLocationChange', callback);
    }
};
