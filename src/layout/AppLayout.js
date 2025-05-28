import {useState, useRef, useContext, useEffect} from 'react';
import {useSafeAreaInsets, SafeAreaView} from 'react-native-safe-area-context';
import {View, TextInput, Animated, Image, StatusBar, Text} from 'react-native';
import Pressable from '../components/Pressable';
import {UserContext} from '../context/UserContext';
import styles from '../styles/AppLayout.styles';
import {useNavigation} from '@react-navigation/native';
import ModalView from '../components/ModalView';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import IOIcons from 'react-native-vector-icons/Ionicons';
import {sendNotificationToBackend} from '../utils/sendNotificationToBackend';
import messaging from '@react-native-firebase/messaging';

export default function AppLayout({
  children,
  title,
  setTitle,
  isEditable,
  setIsEditable,
  handleTitleEdit,
  handleBack,
  noModalScreen,
  onAddItem,
  isDetails,
}) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [deviceToken, setDeviceToken] = useState(
    'e8AjNxiKQbGYSxuQ00yMTZ:APA91bHfRuRg19QrZn3haoxdzZqEAR0vW9Y9h_irKcOIDu9h7ap_jY710bU0WpkpQ886oZQC0o2xQUx1q9lBQe19EO5CHgc75BEhvGLLI1ePzlmKhREpeZs',
  );

  const toggleAddItemModal = () => {
    setIsAddItemModalOpen(prev => !prev);
  };

  const testNotification = async () => {
    const title = 'sample Title';
    const body = 'booooddyy';
    const data = 'sample data';

    await sendNotificationToBackend(deviceToken, title, body, data);
  };

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: 'black'}}
      edges={['bottom', 'left', 'right']}>
      <StatusBar hidden={true} />
      <View style={[styles.app]}>
        <View
          style={[
            styles.container,
            {paddingTop: insets.top + 10, paddingBottom: insets.bottom - 30},
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
            {!handleBack ? (
              <Pressable
                style={{flex: 1}}
                onPress={() => {
                  if (handleTitleEdit) setIsEditable(true);
                }}>
                {isEditable ? (
                  <TextInput
                    style={[
                      styles.headerText,
                      isEditable && {
                        backgroundColor: '#fff',
                        borderWidth: 1,
                        borderRightWidth: 0,
                        borderColor: '#ccc',
                        fontSize: 20,
                      },
                    ]}
                    editable={isEditable}
                    value={title}
                    onChangeText={setTitle}
                  />
                ) : (
                  <Text style={[styles.headerText, {paddingVertical: 10}]}>
                    {title}
                  </Text>
                )}
              </Pressable>
            ) : (
              <Text style={[styles.headerText, {flex: 1, paddingVertical: 10}]}>
                {title}
              </Text>
            )}

            {isEditable ? (
              <>
                <Pressable
                  style={[
                    styles.floatingIcon,
                    {
                      backgroundColor: '#F44336',
                    },
                  ]}
                  onPress={() => {
                    handleTitleEdit && setIsEditable(false);
                  }}>
                  <IOIcons name="close" size={28} color="#fff" />
                </Pressable>
                <Pressable
                  style={[
                    styles.floatingIcon,
                    {
                      backgroundColor: '#262626',
                    },
                  ]}
                  onPress={handleTitleEdit}>
                  <FAIcon name="floppy-o" size={28} color="#fff" />
                </Pressable>
              </>
            ) : handleBack ? (
              <Pressable style={styles.floatingIcon} onPress={handleBack}>
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
              !noModalScreen && (
                <Pressable
                  style={styles.floatingIcon}
                  onPress={toggleAddItemModal}>
                  {/* onPress={testNotification}> */}
                  <Animated.Image
                    source={require('../assets/addIcon.png')}
                    style={{width: 25, height: 25}}
                  />
                </Pressable>
              )
            )}
          </View>
          {children}
        </View>
        {!handleBack && !noModalScreen && (
          <ModalView
            openMenu={isAddItemModalOpen}
            setModalMenu={toggleAddItemModal}
            handleAddItem={onAddItem}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
