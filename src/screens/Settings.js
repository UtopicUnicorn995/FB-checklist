import {useState, useContext, useEffect} from 'react';
import {View, Text, Image} from 'react-native';
import AppLayout from '../layout/AppLayout';
import GlobalStyles from '../styles/GlobalStyles.';
import Pressable from '../components/Pressable';
import {getDatabase, ref, get} from '@react-native-firebase/database';
import { UserContext } from '../context/UserContext';
import { updateSettings } from '../utils/firebaseServices';

export default function Settings() {
  const {user} = useContext(UserContext);
  const db = getDatabase();

  const defaultNotificationSettings = [
    {
      description: 'Notify when someone else checked an item.',
      state: true,
    },
    {description: 'Notify when someone sent an invite.', state: true},
    {
      description:
        'Notify when a checklist has been added, modified or deleted.',
      state: true,
    },
  ];

  const defaultDisplaySettings = [
    {description: 'Dark Theme.', state: true},
    {description: 'Color blind mode', state: true},
  ];

  const [notificationSettings, setNotificationSettings] = useState(
    defaultNotificationSettings,
  );
  const [displaySettings, setDisplaySettings] = useState(
    defaultDisplaySettings,
  );

  useEffect(() => {
    if (!user?.id) return;

    const fetchSettings = async () => {
      const settingsRef = ref(db, `users/${user.id}/settings`);
      const snapshot = await get(settingsRef);
      const settings = snapshot.val();

      if (settings?.notifications) {
        setNotificationSettings(settings.notifications);
      }
      if (settings?.display) {
        setDisplaySettings(settings.display);
      }
    };

    fetchSettings();
  }, [user?.id]);

  const handleSettings = (index, type) => {
    if (type === 'display') {
      const updated = displaySettings.map((setting, i) =>
        i === index ? {...setting, state: !setting.state} : setting,
      );
      setDisplaySettings(updated);
      updateSettings({
        notifications: notificationSettings,
        display: updated,
      });
    } else {
      const updated = notificationSettings.map((setting, i) =>
        i === index ? {...setting, state: !setting.state} : setting,
      );
      setNotificationSettings(updated);
      updateSettings({
        notifications: updated,
        display: displaySettings, 
      });
    }
  };

  return (
    <AppLayout title={'Settings'} noModalScreen>
      <View style={GlobalStyles.gap}>
        <Text style={[GlobalStyles.textPrimary, GlobalStyles.textBold]}>
          Notification settings:
        </Text>
        <View style={[GlobalStyles.padding, GlobalStyles.gap]}>
          {notificationSettings.map((setting, index) => (
            <Pressable
              onPress={() => handleSettings(index, 'notifications')}
              key={index}
              style={[
                GlobalStyles.flexRow,
                GlobalStyles.fullWidth,
                {alignItems: 'center'},
              ]}>
              <Text
                style={[
                  GlobalStyles.textSecondary,
                  {flex: 1, lineHeight: 20, paddingVertical: 5},
                ]}>
                {setting.description}
              </Text>
              <Image
                source={
                  setting.state
                    ? require('../assets/checkedtrue.png')
                    : require('../assets/checkedfalse.png')
                }
                style={{
                  width: setting.state ? 24 : 20,
                  height: 20,
                  flexShrink: 0,
                  marginRight: setting.state ? 0 : 4,
                }}
              />
            </Pressable>
          ))}
        </View>
      </View>
      <View style={GlobalStyles.gap}>
        <Text style={[GlobalStyles.textPrimary, GlobalStyles.textBold]}>
          Display settings:
        </Text>
        <View style={[GlobalStyles.padding, GlobalStyles.gap]}>
          {displaySettings.map((setting, index) => (
            <Pressable
              onPress={() => handleSettings(index, 'display')}
              key={index}
              style={[
                GlobalStyles.flexRow,
                GlobalStyles.fullWidth,
                {alignItems: 'center'},
              ]}>
              <Text
                style={[
                  GlobalStyles.textSecondary,
                  {flex: 1, lineHeight: 20, paddingVertical: 5},
                ]}>
                {setting.description}
              </Text>
              <Image
                source={
                  setting.state
                    ? require('../assets/checkedtrue.png')
                    : require('../assets/checkedfalse.png')
                }
                style={{
                  width: setting.state ? 24 : 20,
                  height: 20,
                  flexShrink: 0,
                  marginRight: setting.state ? 0 : 4,
                }}
              />
            </Pressable>
          ))}
        </View>
      </View>
    </AppLayout>
  );
}
