import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    gap: 10,
    marginBottom: 10,
    width: '100%',
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  editableTextInput: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  itemChecklist: {
    flex: 1,
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 40,
  },
  itemTitle: {
    fontSize: 16,
    color: 'black',
  },
  itemDescription: {
    fontSize: 16,
    color: '#555',
    marginTop: 4,
  },
  itemStatus: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
  noItemsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  galleryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  addImgBtn: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    height: 70,
    width: 70,
  },
  imageBackground: {
    height: 70,
    width: 70,
  },
  checklistItemImgContainer: {
    gap: 10
  }
});
