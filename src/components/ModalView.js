import React, {useState} from 'react';
import {
  Modal,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Image,
  Keyboard,
} from 'react-native';
import Pressable from './Pressable';
import {capitalize} from '../utils/utilsFunc';

export default function ModalView({openMenu, setModalMenu, handleAddItem}) {
  const [itemDetails, setItemDetails] = useState({
    title: '',
    description: '',
  });

  const {type, func} = handleAddItem


  const handleItemDetails = (text, key) => {
    setItemDetails(prev => ({...prev, [key]: text}));
  };

  const handleModalMenu = () => {
    console.log('toogling the menu');
    setModalMenu();
    setItemDetails({title: '', description: ''});
  };

  const saveAddItem = () => {
    func(itemDetails.title, itemDetails.description);
    setItemDetails({title: '', description: ''});
  };

  return (
    <View pointerEvents="box-none">
      <Modal animationType="slide" transparent={true} visible={openMenu}>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
            handleModalMenu();
          }}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalView}>
                <Pressable
                  style={styles.closeIconContainer}
                  onPress={handleModalMenu}>
                  <Image
                    source={require('../assets/addIcon.png')}
                    style={styles.closeIcon}
                  />
                </Pressable>
                <View style={styles.modalItems}>
                  <Text style={styles.modalTitle}>Add {type}</Text>
                  <View style={styles.inputGroup}>
                    <Text>{capitalize(type)} title:</Text>
                    <TextInput
                      value={itemDetails.title}
                      style={styles.inputText}
                      onChangeText={text => handleItemDetails(text, 'title')}
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text>{capitalize(type)} description:</Text>
                    <TextInput
                      value={itemDetails.description}
                      style={[styles.inputText, {height: 60}]}
                      onChangeText={text =>
                        handleItemDetails(text, 'description')
                      }
                      multiline
                    />
                  </View>
                  <Pressable style={styles.addButton} onPress={saveAddItem}>
                    <Text style={{color: '#fff'}}>Save</Text>
                  </Pressable>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#FFF7E3',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 30,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalItems: {
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    marginBottom: 15,
    fontSize: 20,
    textAlign: 'left',
    width: '100%',
  },
  inputGroup: {
    flexDirection: 'column',
    alignItems: 'left',
    gap: 10,
    marginBottom: 20,
    width: '100%',
  },
  inputText: {
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 5,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  closeIconContainer: {
    position: 'absolute',
    padding: 10,
    top: 10,
    right: 10,
    zIndex: 10
  },
  closeIcon: {
    width: 20,
    height: 20,
    transform: [
      {
        rotate: '45deg',
      },
    ],
  },
});
