import {Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DialogAlertHolder from '../../DialogAlertHolder';
import RootNavigation from 'screens/RootNavigation';
import CBCache from 'caches/CBCache';
import VXRConfigs from 'configs/VXRConfigs';
import CBConstant from 'constants/CBConstant';
import CBGlobal from 'globals/CBGlobal';
import CBNative from 'modules/CBNative';
import TimeUtil from 'utils/TimeUtil';
import I18n from 'react-native-i18n';
import axios from 'axios';
import {strings} from 'controls/i18n';

var qs = require('qs');

axios.interceptors.request.use((config) => {
    if (config && config.headers) {
        config.headers['Accept-Language'] = I18n.locale;
        config.headers['Identification'] = JSON.stringify({
            appVersion: CBNative.appVersion,
            buildVersion: CBNative.buildVersion,
            imei: CBNative.imei,
            platform: Platform.OS,
            uniqueId: CBCache.uniqueId,
            deviceId: CBCache.deviceId,
            deviceName: CBCache.deviceName,
            manufacturer: CBCache.manufacturer,
            isEmulator: CBCache.isEmulator,
            language: I18n.locale,
            timezone: TimeUtil.getTimezone()
        });
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

axios.interceptors.response.use(async (response) => {
    CBNative.hideLoading();
    const {config} = response;
    const index = CBService.routes.indexOf(config?.url);
    if (index > -1) CBService.routes.splice(index, 1);
    return response;
}, (error) => {
    CBNative.hideLoading();
    const {config, response, message} = error || {};
    const {status, data} = response || {};

    if (status === 401 || message?.indexOf('401') > -1 || data?.error?.code === 401) {
        if (!config.retry) {
            config.retry = true;
            return axios.post(`${VXRConfigs.ACCOUNT_SERVICE_URL}/v1/oauth/token`, {
                grant_type: 'refresh_token',
                refresh_token: CBGlobal.userRefresh
            }).then(async ({status: s, data: d}) => {
                if (s === CBConstant.STATUS_OK) {
                    const expired_token = TimeUtil.getCurrentUnix() + Number(d?.expires_in || 0);
                    await AsyncStorage.multiSet([
                        ['@user_token', d?.access_token || ''],
                        ['@user_refresh', d?.refresh_token || ''],
                        ['@user_expired', String(expired_token)]
                    ]);

                    CBGlobal.userToken = d?.access_token || '';
                    CBGlobal.userRefresh = d?.refresh_token || '';
                    CBGlobal.userExpired = String(expired_token);

                    config.headers['Authorization'] = `Bearer ${d?.access_token || ''}`;
                    return axios(config);
                }
            });
        }
    }

    const index = CBService.routes.indexOf(config?.url);
    if (index > -1) CBService.routes.splice(index, 1);
    if (status === 401 || message?.indexOf('401') > -1 || data?.error?.code === 401) {
        DialogAlertHolder.alert(strings('title_alert_auth'),
            strings('message_alert_auth'),
            [
                {text: strings('button_ok'), onPress: async () => {
                    await AsyncStorage.multiSet([['@user_token', ''], ['@user_role', '']]);
                    RootNavigation.navigate('Login');
                }}
            ],
            {cancelable: false}
        );
    } else if (index > -1 && message?.indexOf('timeout') > -1) {
        DialogAlertHolder.alert(strings('title_alert_timeout'), strings('message_alert_timeout'));
    } else if (index > -1 && message?.indexOf('Network Error') > -1) {
        DialogAlertHolder.alert(strings('title_alert_network_error'), strings('message_alert_network_error'));
    } else if (index > -1) {
        DialogAlertHolder.alert(strings('title_alert_request'), data?.message || data?.error?.message || strings('message_alert_request'));
    }
    return Promise.reject(error);
});

export default class CBService {

    static routes = [];

    constructor(baseUrl = '', headers = {}) {
        this.baseUrl = baseUrl;
        this.headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=UTF-8'
        };
        Object.assign(this.headers, headers);
    }

    fetch(url, method, data, isQuery, showLoading, showError) {
        let route = `${this.baseUrl}${url}`;
        if (isQuery && data) {
            const query = qs.stringify(data);
            route = `${route}?${query}`;
            data = undefined;
        }
        let options = {
            method,
            url: route,
            headers: this.headers,
            timeout: 30 * 1000
        };
        if (data) {
            if (data instanceof FormData) {
                Object.assign(options, {data: data});
            } else {
                Object.assign(options, {data: JSON.stringify(data)});
            }
        }
        if (showLoading) {
            CBNative.showLoading();
        }
        if (showError) {
            CBService.routes.push(route);
        }
        return axios(options);
    }

    GET(route, query, showLoading = true, showError = true) {
        return this.fetch(route, 'GET', query, true, showLoading, showError);
    }

    POST(route, body, showLoading = true, showError = true) {
        return this.fetch(route, 'POST', body, false, showLoading, showError);
    }

    PUT(route, body, showLoading = true, showError = true) {
        return this.fetch(route, 'PUT', body, false, showLoading, showError);
    }

    DELETE(route, query, showLoading = true, showError = true) {
        return this.fetch(route, 'DELETE', query, true, showLoading, showError);
    }
}
