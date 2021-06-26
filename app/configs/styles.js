import React from 'react';
import {StyleSheet} from 'react-native';
import {moderateScale} from 'utils/ThemeUtil';
import colors from 'configs/colors';
import dimens from 'configs/dimens';

export const appStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.contentColor
    },
    content: {
        flex: 1,
        backgroundColor: colors.contentColor
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15
    },
    body: {
        flex: 1,
        padding: 15
    },
    title: {
        fontSize: dimens.largeText,
        color: colors.primaryTextColor,
        fontFamily: 'GoogleSans-Black'
    },
    label: {
        fontSize: dimens.mediumText,
        color: colors.primaryColor,
        fontFamily: 'GoogleSans-Bold'
    },
    text: {
        fontSize: dimens.mediumText,
        color: colors.primaryTextColor,
        fontFamily: 'GoogleSans-Regular'
    },
    subtext: {
        fontSize: dimens.normalText,
        color: colors.secondaryTextColor,
        fontFamily: 'GoogleSans-Regular'
    },
    caption: {
        fontSize: dimens.smallText,
        color: colors.tertiaryTextColor,
        fontFamily: 'GoogleSans-Light'
    },
    error: {
        fontSize: dimens.normalText,
        color: colors.errorTextColor,
        fontFamily: 'GoogleSans-Regular'
    },
    image: {
        width: moderateScale(240),
        height: moderateScale(240)
    },
    cover: {
        width: '100%',
        height: (0.9 * dimens.widthScreen) / 2
    },
    negative: {
        fontSize: dimens.mediumText,
        color: colors.primaryTextColor,
        fontFamily: 'GoogleSans-Regular',
        padding: 2
    },
    positive: {
        fontSize: dimens.mediumText,
        color: colors.primaryColor,
        fontFamily: 'GoogleSans-Regular',
        padding: 2
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 15
    },
    action: {
        borderRadius: 20,
        borderWidth: 1
    },
    button: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
