import React from 'react';
import {SafeAreaView} from 'react-native';

const CBView = ({style, children}) => {
    return (
        <SafeAreaView style={[{flex: 1}, style]}>
            {children}
        </SafeAreaView>
    );
};

export default CBView;

