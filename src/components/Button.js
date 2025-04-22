import React, {useState} from 'react';
import {StyleSheet, Text, ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';
import Pressable from './Pressable';
import FAIcon from 'react-native-vector-icons/FontAwesome5';

export default function Button({
  onPress,
  title,
  btnStyleProp,
  btnTextStyleProp,
  accessibilityLabel,
  isLoading,
  iconName,
}) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      style={[
        styles.btnStyle,
        btnStyleProp,
        isPressed && {
          backgroundColor: iconName ? '#eee' : '#444',
          borderColor: iconName ? '#eee' : '#444',
        },
      ]}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}>
      {iconName ? (
        <FAIcon name={iconName} size={btnTextStyleProp} />
      ) : (
        <Text style={[styles.btnText, btnTextStyleProp]}>{title}</Text>
      )}

      {isLoading && <ActivityIndicator color="#ccc" animating={isLoading} />}
    </Pressable>
  );
}

Button.propTypes = {
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  btnStyleProp: PropTypes.object,
  btnTextStyleProp: PropTypes.object,
  accessibilityLabel: PropTypes.string,
  isLoading: PropTypes.bool,
};

Button.defaultProps = {
  btnStyleProp: {},
  btnTextStyleProp: {},
  accessibilityLabel: null,
  isLoading: false,
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
    flexDirection: 'row',
    gap: 10,
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
