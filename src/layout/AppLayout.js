import {useState} from 'react';
import {useSafeAreaInsets, SafeAreaView} from 'react-native-safe-area-context';
import {View, TextInput, Animated, Image, StatusBar, Text} from 'react-native';
import Pressable from '../components/Pressable';
import {UserContext} from '../context/UserContext';
import styles from '../styles/AppLayout.styles';
import {useNavigation} from '@react-navigation/native';
import ModalView from '../components/ModalView';
import InviteModal from '../components/InviteModal';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import IOIcons from 'react-native-vector-icons/Ionicons';
import {getFunctions, httpsCallable} from '@react-native-firebase/functions';
import {getApp} from '@react-native-firebase/app';

export default function AppLayout({
  children,
  title,
  isEditable,
  setIsEditable,
  handleTitleEdit,
  handleBack,
  noModalScreen,
  onAddItem,
  invitationModal,
}) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [layoutTitle, setLayoutTitle] = useState(title);

  const toggleAddItemModal = () => {
    setIsAddItemModalOpen(prev => !prev);
  };

  const saveNewTitle = () => {
    handleTitleEdit(layoutTitle);
    console.log('handle save titles');
  };

  const cancelEditTitle = () => {
    setLayoutTitle(title);
    setIsEditable(false);
  };

  async function sendInvite() {
    try {
      const functions = getFunctions(undefined, 'asia-southeast1');
      const sendInviteFn = httpsCallable(functions, 'sendInvites');
      const result = await sendInviteFn({email: 'christian.degulacion@gmail.com'});
      console.log('result', result.data);
    } catch (err) {
      if (err instanceof Error) {
        console.error('❌ Error message:', err.message);
        console.error('❌ Error stack:', err.stack);
      } else {
        console.error('❌ Non-Error thrown:', err);
      }
    }
  }

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
          <Pressable onPress={sendInvite} style={styles.headerFold}>
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
                    value={layoutTitle}
                    onChangeText={text => setLayoutTitle(text)}
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
                    handleTitleEdit && cancelEditTitle();
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
                  onPress={saveNewTitle}>
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
              !noModalScreen &&
              onAddItem && (
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
        {!handleBack && !noModalScreen && onAddItem && (
          <InviteModal
            openMenu={isAddItemModalOpen}
            setModalMenu={toggleAddItemModal}
            handleAddItem={onAddItem}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
