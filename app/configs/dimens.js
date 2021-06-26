import {Dimensions, Platform} from 'react-native';
import {getStatusBarHeight, getBottomSpace} from 'react-native-iphone-x-helper';
import DeviceInfo from 'react-native-device-info';

const {width, height} = Dimensions.get('window');

export default {
    isTablet: DeviceInfo.isTablet(),
    statusBar: getStatusBarHeight(true),
    bottomSpace: getBottomSpace(),
    appBar: Platform.select({ios: 44, android: 56}),
    widthScreen: width,
    heightScreen: height,
    yottaLargeText: 38,
    zettaLargeText: 36,
    exaLargeText: 34,
    petaLargeText: 32,
    teraLargeText: 30,
    megaLargeText: 27,
    xxxLargeText: 25,
    xxLargeText: 23,
    xLargeText: 21,
    largeText: 19,
    mediumText: 17,
    normalText: 15,
    smallText: 13,
    tinyText: 11,
    atomText: 9
}
