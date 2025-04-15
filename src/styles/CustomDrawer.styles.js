import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  drawerContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#FFF7E3',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 32,
    position: 'relative',
    overflow: 'hidden',
  },
  drawerHeader: {
    marginBottom: 20,
    borderBottomWidth: 1.5,
    borderStyle: 'dashed',
    borderBottomColor: 'black',
    paddingBottom: 20,
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  drawerItem: {
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  drawerItemText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  foldStyle: {
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
});
