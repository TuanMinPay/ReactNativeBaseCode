import React, {Component} from 'react';
import {Appearance} from 'react-native';
import DropdownAlertHolder from '../../DropdownAlertHolder';
import DialogAlertHolder from '../../DialogAlertHolder';
import RootNavigation from 'screens/RootNavigation';
import JsonUtil from 'utils/JsonUtil';

export default class Base extends Component {

    scheme = Appearance.getColorScheme();
    defaultParam = {};

    componentDidMount() {
        const {navigation, route} = this.props;
        this.focusSubscription = navigation.addListener('focus', this.handleFocusSubscription);
        this.blurSubscription = navigation.addListener('blur', this.handleBlurSubscription);
        this.setNavigation(navigation, route);
        this.setOptions(navigation, route);
        this.setDefaultParam(route);
    }

    setNavigation(navigation, route) {
        RootNavigation.setNavigation(navigation);
        RootNavigation.setRoute(route);
    }

    handleFocusSubscription = () => {
        const {navigation, route} = this.props;
        this.setNavigation(navigation, route);
        this.componentFocus();
    };

    handleBlurSubscription = () => {
        this.componentBlur();
    };

    setOptions(navigation, route) {

    }

    setDefaultParam(route) {
        const {params} = route;
        if (params && params.defaultParam) {
            this.defaultParam = JsonUtil.parseJsonString(params.defaultParam);
        }
    }

    componentFocus() {

    }

    componentBlur() {

    }

    componentWillUnmount() {
        this.focusSubscription();
        this.blurSubscription();
    }

    alertWithType(...args) {
        DropdownAlertHolder.alertWithType(...args);
    }

    alert(...args) {
        DialogAlertHolder.alert(...args);
    }

    dismiss() {
        DialogAlertHolder.dismiss();
    }

    render() {
        return null;
    }
}
