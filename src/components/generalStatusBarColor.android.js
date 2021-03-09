import React from 'react';
import { View, StatusBar } from 'react-native';

const BAR_HEIGHT = StatusBar.currentHeight;

console.log(BAR_HEIGHT);

const GeneralStatusBarColor = ({ backgroundColor, ...props }) => {
  return (
    <View style={{ backgroundColor, height: BAR_HEIGHT }} >
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View >
  );
}
export default GeneralStatusBarColor;
