import React from 'react';
import { View, StatusBar } from 'react-native';

const GeneralStatusBarColor = ({ backgroundColor, ...props }) => {
  return (
    <View style={{ backgroundColor }} >
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View >
  );
}
export default GeneralStatusBarColor;
