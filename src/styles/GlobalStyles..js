import {StyleSheet} from 'react-native';

const GlobalStyles = StyleSheet.create({
  flex: {
    flex: 1,
    width: '100%',
    // flexShrink: 0,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  gap: {
    gap: 10,
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
  paddingVertical: {
    paddingVertical: 10,
  },
  paddingHorizontal: {
    paddingHorizontal: 10,
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
    color: '#262626',
    fontSize: 18,
  },
  textSecondary: {
    color: '#484D52',
    fontSize: 16,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default GlobalStyles;
