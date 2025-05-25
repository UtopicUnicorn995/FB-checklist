import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  app: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  container: {
    backgroundColor: '#FFF7E3',
    flex: 1,
    width: '100%',
    paddingHorizontal: 32,
    flexDirection: 'column',
    borderTopRightRadius: 32,
    gap: 20,
    position: 'relative',
  },
  headerFold: {
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    gap: 20,
    borderBottomWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'black',
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'black',

  },
});
