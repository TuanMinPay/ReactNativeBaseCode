import React, {useState, useEffect} from 'react';
import {Image as RNImage} from 'react-native';
import {Image} from 'react-native-elements';

const CBScaleImage = (props) => {
    const [height, setHeight] = useState(0);
    useEffect(() => {
        const {source, width: w, height: h} = props;
        if (source && typeof source === 'number') {
            const {width, height} = RNImage.resolveAssetSource(source);
            setHeight(height * (w / width));
        } else if (source && typeof source === 'object') {
            if (source.uri && source.uri.indexOf('base64') > -1) {
                RNImage.getSize(source.uri, (width, height) => setHeight(height * (w/ width)), () => setHeight(h));
            } else {
                fetch(source.uri).then((response) => {
                    RNImage.getSize(source.uri, (width, height) => setHeight(height * (w / width)), () => setHeight(h));
                }).catch((error) => setHeight(h));
            }
        } else {
            setHeight(h);
        }
    }, []);
    return (
        <Image {...props} containerStyle={props.style} style={{width: props.width, height: height}}/>
    );
};

export default CBScaleImage;

