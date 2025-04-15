import {useState, useRef, useContext} from 'react';
import {View, TextInput, Animated, Easing, Image} from 'react-native';
import Pressable from '../components/Pressable';
import {AppContext} from '../context/AppContext';
import styles from '../styles/AppLayout.styles';

export default function AppLayout({
  children,
  title,
  setTitle,
  isEditable,
  setIsEditable,
  toggleAddItemModal,
  handleTitleEdit,
}) {
  const {} = useContext(AppContext);

  return (
    <View style={styles.app}>
      <View style={styles.container}>
        <View style={styles.headerFold}>
          <Image
            source={require('../assets/fold.png')}
            style={{width: 45, height: 45}}
          />
        </View>
        <View style={styles.header}>
          <Pressable
            style={{flex: 1}}
            onPress={() => {
              if (handleTitleEdit) setIsEditable(true);
            }}>
            <TextInput
              style={[
                styles.headerText,
                isEditable && {
                  backgroundColor: '#fff',
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: '#ccc',
                },
              ]}
              editable={isEditable ? true : false}
              value={title}
              onChangeText={setTitle}
              onBlur={() => {
                setIsEditable(false);
                handleTitleEdit();
              }}
            />
          </Pressable>
          {isEditable ? (
            <Pressable style={styles.floatingIcon} onPress={toggleAddItemModal}>
              <Animated.Image
                source={require('../assets/editItem.png')}
                style={[
                  {
                    width: 25,
                    height: 25,
                  },
                ]}
              />
            </Pressable>
          ) : (
            <Pressable style={styles.floatingIcon} onPress={toggleAddItemModal}>
              <Animated.Image
                source={require('../assets/addIcon.png')}
                style={[
                  {
                    width: 25,
                    height: 25,
                  },
                ]}
              />
            </Pressable>
          )}
        </View>
        {children}
      </View>
    </View>
  );
}
