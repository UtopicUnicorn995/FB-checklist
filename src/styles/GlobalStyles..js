import {StyleSheet} from 'react-native';

const GlobalStyles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  flexColumn: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  border: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  fullHeight: {
    height: '100%',
  },
  padding: {
    padding: 10,
  },
  margin: {
    margin: 10,
  },
  textCenter: {
    textAlign: 'center',
  },
  textBold: {
    fontWeight: 'bold',
  },
  textPrimary: {
    color: '#007bff',
  },
  textSecondary: {
    color: '#6c757d',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default GlobalStyles;