'use strict';

import React from 'react';

import {
	Platform,
	View
} from 'react-native';

import WheelCurvedPicker from './WheelCurvedPicker'

module.exports = (Platform.OS === 'ios' ? View : WheelCurvedPicker)
