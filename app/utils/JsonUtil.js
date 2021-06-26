export default class JsonUtil {

    static parseJsonString(jsonString) {
        try {
            if (!jsonString || (jsonString && jsonString.length === 0)) {
                return null;
            }
            return JSON.parse(jsonString);
        } catch (e) {
            return null;
        }
    }

    static buildDefaultParam(object) {
        if (object) {
            return JSON.stringify(object);
        } else {
            return '';
        }
    }
}
