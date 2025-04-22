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
  drawerItemsContainer: {
    gap: 10,
  },
  drawerItem: {
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  checkListItem: {
    padding: 5,
    paddingLeft: 20,
    borderRadius: 4,
    // backgroundColor: '#fff'
  },
  newChecklistInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  newChecklistInput: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    fontSize: 12,
    flex: 1,
    height: 40,
  },
  newChecklistBtnContainer: {
    backgroundColor: '#fff',
    padding: 10,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
});
