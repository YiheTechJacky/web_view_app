import React from 'react';
import ColorPattern from '../../src/styles/variables';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faUndo } from '@fortawesome/free-solid-svg-icons';

const Navbar = (props) => {
  const { navbarStyle, title, backBtnWrapper, textStyle, mt5, mr7, rightBtnWrapper, rightFloatTextWrapper, rightFloatText } = styles;
  const mergedStyle = StyleSheet.flatten([navbarStyle, props.style]);
  return (
    <View style={mergedStyle}>
      <TouchableOpacity
        style={backBtnWrapper}
        onPress={() => {
          props.backKeyPressed();
        }}>
        <FontAwesomeIcon style={textStyle} icon={faChevronLeft} size={20} />
        <Text style={{ ...textStyle, ...mt5 }}>返回</Text>
      </TouchableOpacity>
      {/* <Text numberOfLines={1} style={{ ...textStyle, ...mr7, ...title }}>
        {props.title}
      </Text>
      <TouchableOpacity
        style={{ rightBtnWrapper }}
        onPress={() => {
          props.reloadKeyPressed();
        }}>
        <View style={rightFloatTextWrapper}><Text style={rightFloatText}>线路{props.curLane + 1}</Text></View>
        <FontAwesomeIcon style={textStyle} icon={faUndo} size={20} />
      </TouchableOpacity> */}
    </View>
  );
};

const {
  colors: { normal, primary, shadow },
} = ColorPattern;

const styles = StyleSheet.create({
  navbarStyle: {
    backgroundColor: shadow,
    height: 30,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textStyle: {
    marginTop: 10,
    color: "#3493ff",
    maxWidth: 200,
  },
  backBtnWrapper: {
    display: 'flex',
    flexDirection: 'row',
  },
  mt5: {
    marginTop: 13,
    color: "#3493ff",
  },
  mr7: {
    marginRight: 20,
  },
  rightBtnWrapper: {
  },
  rightFloatTextWrapper: {
    position: 'absolute',
    left: -50,
  },
  rightFloatText: {
    width: 50,
    color: 'white',
    marginTop: 13,
    fontSize: 15,
  },
  title: {
    fontSize: 20,
  },
});

export default Navbar;
