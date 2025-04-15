import {useState, useContext} from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function GuestLayout({children}) {
  return <View style={styles.app}>{children}</View>;
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#FFF7E3',
  },
});
