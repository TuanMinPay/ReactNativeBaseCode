import React from 'react';
import {
    BackHandler,
    Platform,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import {WebView} from 'react-native-webview';
import RootNavigation from 'screens/RootNavigation';
import {HeaderBackButton} from '@react-navigation/stack';
import {CBAnimator, CBButton, CBView} from 'components';
import EventTracker from 'controls/EventTracker';
import CBControl from 'controls/CBControl';
import CBHandler from 'handlers/CBHandler';
import ImageUtil from 'utils/ImageUtil';
import {Menu, MenuItem, Position} from 'react-native-enhanced-popup-menu';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Progress from 'react-native-progress';
import Toast from 'react-native-simple-toast';
import Share from 'react-native-share';
import {appStyles} from 'configs/styles';
import {helpers} from 'configs/themes';
import {strings} from 'controls/i18n';
import colors from 'configs/colors';
import dimens from 'configs/dimens';

import Base from 'screens/Base';

export default class Web extends Base {

    constructor(props) {
        super(props);
        this.webView = React.createRef();
        this.menu = React.createRef();
        this.anchor = React.createRef();
        this.state = {
            progress: 0,
            canGoBack: false,
            canGoForward: false,
            source: {uri: 'https://google.com'},
            javascript: ''
        };
    }

    componentDidMount() {
        super.componentDidMount();
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        this.load();
    }

    setOptions(navigation, route) {
        const {params} = route;
        navigation.setOptions({
            title: params?.title || strings('screen_web'),
            headerLeft: (props) => <HeaderBackButton {...props} onPress={this.handleBackPress}/>,
            headerRight: () => (
                <TouchableOpacity style={[appStyles.button, {marginRight: 5}]} onPress={this.onMenu}>
                    <Ionicons name={'ellipsis-horizontal'} color={helpers('icon', this.scheme)} size={25}/>
                </TouchableOpacity>
            )
        });
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
        clearInterval(this.timer);
    }

    handleBackPress = () => {
        const {canGoBack} = this.state;
        if (canGoBack) {
            this.webView.current.goBack();
        } else {
            RootNavigation.goBack();
        }
        return true;
    };

    onMenu = () => {
        this.menu.current.show(this.anchor.current, Position.TOP_RIGHT, {top: 0, left: dimens.widthScreen});
        EventTracker.logEvent('screen_web', {action: 'click_button_menu'});
    };

    onForward = () => {
        this.menu.current.hide();
        this.webView.current.goForward();
        EventTracker.logEvent('screen_web', {action: 'click_button_forward'});
    };

    onReload = () => {
        this.menu.current.hide();
        this.webView.current.reload();
        EventTracker.logEvent('screen_web', {action: 'click_button_reload'});
    };

    onShare = () => {
        if (this.url) {
            this.menu.current.hide();
            setTimeout(() => {
                Share.open({url: this.url});
            }, Platform.select({android: 300, ios: 500}));
        }
        EventTracker.logEvent('screen_web', {action: 'click_button_share'});
    };

    onCopy = () => {
        if (this.url) {
            this.menu.current.hide();
            setTimeout(() => {
                Clipboard.setString(this.url);
                Toast.show(strings('toast_copied'), Toast.SHORT);
            }, Platform.select({android: 300, ios: 500}));
        }
        EventTracker.logEvent('screen_web', {action: 'click_button_copy'});
    };

    onOpenWithBrowser = () => {
        if (this.url) {
            this.menu.current.hide();
            CBHandler.openUrl(this.url);
        }
        EventTracker.logEvent('screen_web', {action: 'click_button_open_with_browser'});
    };

    onExit = () => {
        this.menu.current.hide();
        RootNavigation.goBack();
        EventTracker.logEvent('screen_web', {action: 'click_button_exit'});
    };

    load() {
        this.setState({
            source: {
                uri: this.defaultParam?.uri || 'https://google.com',
                headers: this.defaultParam?.headers || {}
            },
            javascript: this.defaultParam?.javascript || ''
        }, this.updateProgress);
    }

    updateProgress = () => {
        this.timer = setInterval(() => {
            const {progress} = this.state;
            if (progress < 0.8) {
                this.setState({
                    progress: progress + (0.2 * Math.random())
                });
            } else {
                clearInterval(this.timer);
            }
        }, 300);
    };

    onNavigationStateChange = (navState) => {
        this.url = navState.url;
        this.setState({
            progress: navState.loading ? 0 : 1,
            canGoBack: navState.canGoBack,
            canGoForward: navState.canGoForward
        }, this.updateProgress);

        const {url} = navState;
        if (url && url.indexOf('/close') > -1) {
            RootNavigation.goBack();
        }
    };

    onLoad = () => {

    };

    onLoadEnd = () => {

    };

    onError = (syntheticEvent) => {
        const {nativeEvent} = syntheticEvent;
        if (nativeEvent) {
            this.setState({progress: 1});
        }
    };

    onTryAgain = () => {
        this.webView.current.reload();
        EventTracker.logEvent('screen_web', {action: 'click_button_try_again'});
    };

    renderError = (domain, code, description) => {
        const contentStyle = helpers('content', this.scheme);
        const titleStyle = helpers('title', this.scheme);
        const textStyle = helpers('subtext', this.scheme);

        return (
            <View style={[appStyles.content, appStyles.overlay, contentStyle]}>
                <CBAnimator style={{width: '100%'}} enable={true} source={ImageUtil.getImage('bg_not_found')}/>
                <Text style={[appStyles.title, {textAlign: 'center', marginTop: 15}, titleStyle]}>{code}</Text>
                <Text style={[appStyles.text, {textAlign: 'center', marginTop: 15}, textStyle]}>{description}</Text>
                <CBButton style={{marginTop: 15}} title={strings('button_try_again')} onPress={this.onTryAgain}/>
            </View>
        );
    };

    onMessage = (event) => {
        const data = event.nativeEvent.data;
        const handleDataSourceChange = this.getParam('handleDataSourceChange');
        if (data.match(`BACK|ERROR|EXIT`)) {
            RootNavigation.goBack();
        } else if (data.match(`HOME`)) {
            RootNavigation.goHome();
        } else if (handleDataSourceChange && typeof handleDataSourceChange === 'function') {
            handleDataSourceChange(data);
        } else {
            const array = data.split('~');
            CBControl.navigateWith(array[0], array[1], array[2]);
        }
    };

    render() {
        const containerStyle = helpers('container', this.scheme);
        const contentStyle = helpers('content', this.scheme);
        const textStyle = helpers('text', this.scheme);
        const iconColor = helpers('icon', this.scheme);

        const {progress, canGoForward, source, javascript} = this.state;
        return (
            <CBView style={[appStyles.container, containerStyle]}>
                <View style={[appStyles.content, contentStyle]}>
                    <Progress.Bar
                        color={colors.primaryColor}
                        borderWidth={0}
                        borderColor={colors.contentColor}
                        borderRadius={0}
                        height={1}
                        progress={progress}
                        width={dimens.widthScreen}/>
                    <WebView
                        ref={this.webView}
                        source={source}
                        javaScriptEnabled={true}
                        injectedJavaScript={javascript}
                        onNavigationStateChange={this.onNavigationStateChange}
                        onLoad={this.onLoad}
                        onLoadEnd={this.onLoadEnd}
                        onError={this.onError}
                        renderError={this.renderError}
                        onMessage={this.onMessage}/>
                    <TouchableOpacity ref={this.anchor} style={{position: 'absolute', top: 0, right: 0, width: 1, height: 1}}/>
                    <Menu ref={this.menu} style={helpers('menu', this.scheme)}>
                        <View style={[appStyles.row, {borderBottomWidth: 1}, helpers('border', this.scheme)]}>
                            <TouchableOpacity disabled={!canGoForward} style={[appStyles.button, {opacity: canGoForward ? 1 : 0.3}]} onPress={this.onForward}>
                                <Ionicons name={'chevron-forward'} color={iconColor} size={25}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={appStyles.button} onPress={this.onReload}>
                                <Ionicons name={'reload'} color={iconColor} size={20}/>
                            </TouchableOpacity>
                        </View>
                        <MenuItem textStyle={[appStyles.text, textStyle]} onPress={this.onShare}>{strings('action_share')}</MenuItem>
                        <MenuItem textStyle={[appStyles.text, textStyle]} onPress={this.onCopy}>{strings('action_copy')}</MenuItem>
                        <MenuItem textStyle={[appStyles.text, textStyle]} onPress={this.onOpenWithBrowser}>{strings('action_open_with_browser')}</MenuItem>
                        <MenuItem textStyle={[appStyles.text, textStyle]} onPress={this.onExit}>{strings('action_exit')}</MenuItem>
                    </Menu>
                </View>
            </CBView>
        );
    }
}
