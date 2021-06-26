import React, {Component} from 'react';
import {Appearance, AppState, Linking, LogBox, StatusBar, View} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import CBCache from 'caches/CBCache';
import CBConfig from 'configs/CBConfig';
import ConfigManager from 'controls/ConfigManager';
import CBDeeplinkHandler from 'handlers/CBDeeplinkHandler';
import {ThemeProvider} from 'react-native-elements';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {setJSExceptionHandler, setNativeExceptionHandler} from 'react-native-exception-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import analytics from '@react-native-firebase/analytics';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import messaging from '@react-native-firebase/messaging';
import SplashScreen from 'react-native-splash-screen';
import {ModalPortal} from 'react-native-modals';
import DeviceInfo from 'react-native-device-info';
import {Settings} from 'react-native-fbsdk-next';
import OneSignal from 'react-native-onesignal';
import {appStyles} from 'configs/styles';
import {helpers} from 'configs/themes';
import {strings} from 'controls/i18n';
import colors from 'configs/colors';
import dimens from 'configs/dimens';

import DropdownAlert from 'react-native-dropdownalert';
import DropdownAlertHolder from './DropdownAlertHolder';
import DialogAlert from './DialogAlert';
import DialogAlertHolder from './DialogAlertHolder';

import Demo from 'screens/Demo';
import Web from 'screens/Web';
import Empty from 'screens/Empty';

const errorHandler = (e, isFatal) => {
    if (isFatal) {
        DialogAlertHolder.alert(strings('title_alert_crash'), strings('message_alert_crash'));
    } else {
        console.log(e);
    }
};

setJSExceptionHandler(errorHandler, !__DEV__);

setNativeExceptionHandler((errorString) => {
    DialogAlertHolder.alert(strings('title_alert_crash'), strings('message_alert_crash'));
});

LogBox.ignoreAllLogs(__DEV__);

const Stack = createStackNavigator();

export default class App extends Component {

    constructor(props) {
        super(props);
        Settings.initializeSDK();
        this.navigationRef = React.createRef();
        this.routeNameRef = React.createRef();
        this.state = {
            appState: AppState.currentState,
            isSubscribed: false
        };
    }

    componentDidMount() {
        ConfigManager.execute();
        Promise.all([DeviceInfo.getDeviceName(), DeviceInfo.getManufacturer(), DeviceInfo.isEmulator()]).then(values => {
            CBCache.uniqueId = DeviceInfo.getUniqueId();
            CBCache.deviceId = escape(DeviceInfo.getDeviceId() || '');
            CBCache.deviceName = escape(values[0] || '');
            CBCache.manufacturer = escape(values[1] || '');
            CBCache.isEmulator = values[2] || false;
        });

        this.unsubscribeNetwork = NetInfo.addEventListener(this.handleConnectivityChange);

        AppState.addEventListener('change', this.handleAppStateChange);

        Linking.addEventListener('url', this.handleOpenUrl);
        Linking.getInitialURL().then((url) => {
            CBDeeplinkHandler.handleUrl(url);
        }).catch((error) => console.error('An error occurred', error));

        this.unsubscribeDynamicLinks = dynamicLinks().onLink(this.handleOpenDynamicUrl);
        dynamicLinks().getInitialLink().then((link) => {
            CBDeeplinkHandler.handleDynamicUrl(link?.url);
        }).catch((error) => console.error('An error occurred', error));

        this.unsubscribeMessaging = messaging().onMessage(async (remoteMessage) => {
            console.log('dctan :: ' + JSON.stringify(remoteMessage));
        });

        OneSignal.setAppId(CBConfig.ONE_SIGNAL_APP_ID);
        OneSignal.setLogLevel(6, 0);
        OneSignal.setRequiresUserPrivacyConsent(false);
        OneSignal.promptForPushNotificationsWithUserResponse(response => {

        });
        OneSignal.setNotificationWillShowInForegroundHandler(notifReceivedEvent => {

        });
        OneSignal.setNotificationOpenedHandler(notification => {

        });
        OneSignal.setInAppMessageClickHandler(event => {

        });
        OneSignal.addEmailSubscriptionObserver((event) => {

        });
        OneSignal.addSubscriptionObserver(event => {

        });
        OneSignal.addPermissionObserver(event => {

        });
        OneSignal.getDeviceState().then(deviceState => {
            this.setState({
                isSubscribed: deviceState.isSubscribed
            }, this.onLoaded);
        }).catch((error) => console.error('An error occurred', error));
    }

    componentWillUnmount() {
        if (this.unsubscribeNetwork) this.unsubscribeNetwork();

        AppState.removeEventListener('change', this.handleAppStateChange);

        Linking.removeEventListener('url', this.handleOpenUrl);

        if (this.unsubscribeDynamicLinks) this.unsubscribeDynamicLinks();

        if (this.unsubscribeMessaging) this.unsubscribeMessaging();
    }

    handleConnectivityChange = (state) => {
        const {appState: action} = this.state;
        if (action === 'active') {
            const {isConnected} = state;
            if (!isConnected) {
                DropdownAlertHolder.alertWithType('error', strings('title_alert_no_internet'), strings('message_alert_no_internet'));
            }
        }
    };

    handleAppStateChange = (state) => {
        this.setState({appState: state});
    };

    handleOpenUrl = (event) => {
        CBDeeplinkHandler.handleUrl(event?.url);
    };

    handleOpenDynamicUrl = (link) => {
        CBDeeplinkHandler.handleDynamicUrl(link?.url);
    };

    onLoaded = () => {
        SplashScreen.hide();
    };

    onReady = () => {
        this.routeNameRef.current = this.navigationRef.current.getCurrentRoute().name;
    };

    onStateChange = async () => {
        const previousRouteName = this.routeNameRef.current;
        const currentRouteName = this.navigationRef.current.getCurrentRoute().name;
        if (previousRouteName !== currentRouteName) {
            await analytics().logScreenView({
                screen_name: currentRouteName,
                screen_class: currentRouteName
            });
        }
        this.routeNameRef.current = currentRouteName;
    };

    renderHeaderBackImage = (props) => {
        return (
            <View style={[appStyles.button, {marginLeft: 5}]}>
                <Ionicons name={'chevron-back-outline'} color={props.tintColor} size={25}/>
            </View>
        );
    };

    render() {
        const scheme = Appearance.getColorScheme();
        const barStyle = scheme === 'dark' ? 'light-content' : 'dark-content';
        const statusBarColor = scheme === 'dark' ? colors.statusBarDarkColor : colors.statusBarColor;
        const textColor = scheme === 'dark' ? colors.primaryTextDarkColor : colors.primaryTextColor;
        return (
            <ThemeProvider theme={helpers('elements', scheme)}>
                <StatusBar barStyle={barStyle} backgroundColor={statusBarColor}/>
                <NavigationContainer ref={this.navigationRef} onReady={this.onReady} onStateChange={this.onStateChange} theme={helpers('navigation', scheme)} initialRouteName={'Demo'}>
                    <Stack.Navigator
                        mode={'modal'}
                        screenOptions={{
                            ...TransitionPresets.SlideFromRightIOS,
                            headerBackImage: this.renderHeaderBackImage,
                            headerBackTitleVisible: false,
                            headerTitleAllowFontScaling: false,
                            headerBackAllowFontScaling: false,
                            headerTitleAlign: 'center',
                            headerTintColor: textColor,
                            headerTitleStyle: {
                                fontSize: dimens.largeText,
                                fontFamily: 'GoogleSans-Regular'
                            }
                        }}>
                        <Stack.Screen name={'Demo'} component={Demo}/>
                        <Stack.Screen name={'Web'} component={Web} options={{title: strings('screen_web')}}/>
                        <Stack.Screen name={'Empty'} component={Empty} options={{title: strings('screen_empty')}}/>
                    </Stack.Navigator>
                </NavigationContainer>
                <DropdownAlert ref={ref => DropdownAlertHolder.setDropdownAlert(ref)} inactiveStatusBarStyle={barStyle} inactiveStatusBarBackgroundColor={statusBarColor}/>
                <DialogAlert ref={ref => DialogAlertHolder.setDialogAlert(ref)} scheme={scheme}/>
                <ModalPortal/>
            </ThemeProvider>
        );
    }
}
