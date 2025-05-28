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
  newChecklistInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  newChecklistInput: {
    backgroundColor: '#fff',
    borderRadius: 4,
    flex: 1,
  },
  newChecklistBtn: {
    padding: 5,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
