import React from 'react';
import {
    Text,
    View
} from 'react-native';
import RootNavigation from 'screens/RootNavigation';
import {CBView} from 'components';
import JsonUtil from 'utils/JsonUtil';
import {appStyles} from 'configs/styles';
import {helpers} from "configs/themes";

import Base from 'screens/Base';

export default class Demo extends Base {

    onPress = () => {
        RootNavigation.navigate('Empty', {
            defaultParam: JsonUtil.buildDefaultParam({
                count: 1
            })
        })
    };

    render() {
        return (
            <CBView style={[appStyles.container, helpers('container', this.scheme)]}>
                <View style={[appStyles.content, {alignItems: 'center', justifyContent: 'center'}, helpers('content', this.scheme)]}>
                    <Text style={[appStyles.text, helpers('text', this.scheme)]} onPress={this.onPress}>{'Demo'}</Text>
                </View>
            </CBView>
        );
    }
}
