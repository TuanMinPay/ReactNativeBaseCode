import React from 'react';
import {Image} from 'react-native-elements';

const CBImage = (props) => {
    return (
        <Image {...props} containerStyle={props.style}/>
    );
};

export default CBImage;

