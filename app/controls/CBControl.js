//import {DeviceEventEmitter} from 'react-native';
//import RootNavigation from 'screens/RootNavigation';
//import ServiceHandler from 'databases/handler/ServiceHandler';
//import JsonUtil from 'utils/JsonUtil';

export default class CBControl {

    static navigateWith(root, param, injection) {
        /*const services = ServiceHandler.getServiceByCode(root);
        const refId = services[0]?.refId || root;
        const defaultParam = {
            ...JsonUtil.parseJsonString(services[0]?.defaultParam),
            ...JsonUtil.parseJsonString(param)
        };

        RootNavigation.navigate(refId, {
            defaultParam: JsonUtil.buildDefaultParam({
                ...defaultParam
            }),
            ...injection
        });

        if (injection && typeof injection === 'string') {
            const array = injection.split('|');
            setTimeout(() => DeviceEventEmitter.emit(array[0], array[1]), 300);
        }*/
    }
}
