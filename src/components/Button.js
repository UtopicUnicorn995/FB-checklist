import React from 'react';
import {StyleSheet, Text} from 'react-native';
import PropTypes from 'prop-types';
import Pressable from './Pressable';

export default function Button({
  onPress,
  title,
  btnStyleProp,
  btnTextStyleProp,
  accessibilityLabel,
}) {
  return (
    <Pressable
      style={[styles.btnStyle, btnStyleProp]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}>
      <Text style={[styles.btnText, btnTextStyleProp]}>{title}</Text>
    </Pressable>
  );
}

Button.propTypes = {
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  btnStyleProp: PropTypes.object,
  btnTextStyleProp: PropTypes.object,
  accessibilityLabel: PropTypes.string,
};

Button.defaultProps = {
  btnStyleProp: {},
  btnTextStyleProp: {},
  accessibilityLabel: null,
};

const styles = StyleSheet.create({
  btnStyle: {
    width: '100%',
    backgroundColor: '#262626',
    padding: 10,
    paddingTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 99,
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center'
  },
});
