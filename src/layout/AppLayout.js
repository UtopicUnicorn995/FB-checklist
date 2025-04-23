import {useState, useRef, useContext} from 'react';
import {useSafeAreaInsets, SafeAreaView} from 'react-native-safe-area-context';
import {
  View,
  TextInput,
  Animated,
  Easing,
  Image,
  StatusBar,
  Text,
} from 'react-native';
import Pressable from '../components/Pressable';
import {AppContext} from '../context/AppContext';
import styles from '../styles/AppLayout.styles';
import {useNavigation} from '@react-navigation/native';

export default function AppLayout({
  children,
  title,
  setTitle,
  isEditable,
  setIsEditable,
  toggleAddItemModal,
  handleTitleEdit,
  detailsScreen,
}) {
  const {} = useContext(AppContext);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: 'black'}}
      edges={['bottom', 'left', 'right']}>
      <StatusBar hidden={true} />
      <View style={[styles.app]}>
        <View
          style={[
            styles.container,
            {paddingTop: insets.top + 10, paddingBottom: insets.bottom},
          ]}>
          <Pressable
            onPress={navigation.toggleDrawer}
            style={styles.headerFold}>
            <Image
              source={require('../assets/fold.png')}
              style={{width: 45, height: 45}}
            />
          </Pressable>

          <View style={styles.header}>
            {!detailsScreen ? (
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
                  editable={isEditable}
                  value={title}
                  onChangeText={setTitle}
                />
              </Pressable>
            ) : (
              <Text style={[styles.headerText, {flex: 1, paddingVertical: 10}]}>
                {title}
              </Text>
            )}

            {isEditable ? (
              <Pressable style={styles.floatingIcon} onPress={handleTitleEdit}>
                <Animated.Image
                  source={require('../assets/editItem.png')}
                  style={{width: 28, height: 25}}
                />
              </Pressable>
            ) : detailsScreen ? (
              <Pressable
                style={styles.floatingIcon}
                onPress={() => navigation.goBack()}>
                <Animated.Image
                  source={require('../assets/addIcon.png')}
                  style={{
                    width: 25,
                    height: 25,
                    transform: [
                      {
                        rotate: '45deg',
                      },
                    ],
                  }}
                />
              </Pressable>
            ) : (
              <Pressable
                style={styles.floatingIcon}
                onPress={toggleAddItemModal}>
                <Animated.Image
                  source={require('../assets/addIcon.png')}
                  style={{width: 25, height: 25}}
                />
              </Pressable>
            )}
          </View>

          {children}
        </View>
      </View>
    </SafeAreaView>
  );
}
