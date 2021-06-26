import React from 'react';
import {Keyboard} from 'react-native';
import {Button} from 'react-native-elements';
import {debounce} from 'lodash';

const CBButton = (props) => {
    const onPress = () => {Keyboard.dismiss(); props.onPress();};
    const onPressDebounce = props.onPress ? debounce(onPress, 300, {leading: true, trailing: false}) : null;
    return (
        <Button {...props} containerStyle={[{minWidth: 80}, props.style]} onPress={onPressDebounce}/>
    );
};

export default CBButton;

