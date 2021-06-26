import React from 'react';
import {
    Text,
    View
} from 'react-native';
import {CBAnimator, CBButton, CBView} from 'components';
import ImageUtil from 'utils/ImageUtil';
import {appStyles} from 'configs/styles';
import {helpers} from 'configs/themes';
import {strings} from 'controls/i18n';
import dimens from 'configs/dimens';

import Base from 'screens/Base';

export default class Empty extends Base {

    goHome = () => {

    };

    onUpdate = () => {

    };

    render() {
        const containerStyle = helpers('container', this.scheme);
        const contentStyle = helpers('content', this.scheme);
        const titleStyle = helpers('title', this.scheme);
        const textStyle = helpers('text', this.scheme);

        const width = (dimens.widthScreen - 45) / 2;
        return (
            <CBView style={[appStyles.container, containerStyle]}>
                <View style={[appStyles.content, contentStyle]}>
                    <CBAnimator style={{width: '100%'}} enable={true} source={ImageUtil.getImage('bg_not_found')}/>
                    <View style={appStyles.body}>
                        <Text style={[appStyles.title, titleStyle]}>{strings('text_opps')}</Text>
                        <Text style={[appStyles.text, {marginTop: 15}, textStyle]}>{strings('text_not_found')}</Text>
                    </View>
                    <View style={appStyles.footer}>
                        <CBButton buttonStyle={[appStyles.action, {width}]} type={'outline'} title={strings('button_home')} onPress={this.goHome}/>
                        <CBButton buttonStyle={[appStyles.action, {width}]} title={strings('button_update')} onPress={this.onUpdate}/>
                    </View>
                </View>
            </CBView>
        );
    }
}
