import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  checklist: {
    backgroundColor: '#FFF7E3',
    flex: 1,
  },
  noItemsText: {
    fontSize: 20,
  },
  createChecklist: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#262626',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 24,
    borderRadius: 4,
  },
  newChecklistInput: {
    backgroundColor: '#fff',
    borderRadius: 4,
    marginTop: 24,
  },
});
