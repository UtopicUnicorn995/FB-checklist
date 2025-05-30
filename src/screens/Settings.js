import {useState, useContext, useEffect} from 'react';
import {View, Text, Image} from 'react-native';
import AppLayout from '../layout/AppLayout';
import GlobalStyles from '../styles/GlobalStyles.';
import Pressable from '../components/Pressable';
import {getDatabase, ref, get} from '@react-native-firebase/database';
import {UserContext} from '../context/UserContext';
import {updateSettings} from '../utils/firebaseServices';
import {getUserSettings, setUserSettings} from '../utils/asyncStorage';

export default function Settings() {
  const {user} = useContext(UserContext);
  const db = getDatabase();

  const defaultNotificationSettings = [
    {
      key: 'checklistItemCreated',
      description: 'Notify when someone created an item.',
      state: true,
    },
    {
      key: 'invites',
      description: 'Notify when someone sent an invite.',
      state: true,
    },
    {
      key: 'checklistUpdates',
      description:
        'Notify when a checklist has been modified or checked.',
      state: true,
    },
  ];

  const defaultDisplaySettings = [
    {key: 'theme', description: 'Dark Theme.', state: true},
    {key: 'colorBlind', description: 'Color blind mode', state: true},
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
      const normalizeSettings = (storedSettings, defaultSettings) => {
        return defaultSettings.map(defaultItem => {
          const found = storedSettings?.find(
            item => item.description === defaultItem.description,
          );
          return found
            ? {
                ...defaultItem, // ensures key is included
                state: found.state,
              }
            : defaultItem;
        });
      };

      try {
        const cachedSettings = await getUserSettings();

        if (cachedSettings?.notifications) {
          const normalized = normalizeSettings(
            cachedSettings.notifications,
            defaultNotificationSettings,
          );
          setNotificationSettings(normalized);
        }

        if (cachedSettings?.display) {
          const normalized = normalizeSettings(
            cachedSettings.display,
            defaultDisplaySettings,
          );
          setDisplaySettings(normalized);
        }

        const settingsRef = ref(db, `users/${user.id}/settings`);
        const snapshot = await get(settingsRef);
        const settings = snapshot.val();

        if (settings) {
          const normalizedNotifications = normalizeSettings(
            settings.notifications,
            defaultNotificationSettings,
          );
          const normalizedDisplay = normalizeSettings(
            settings.display,
            defaultDisplaySettings,
          );

          setNotificationSettings(normalizedNotifications);
          setDisplaySettings(normalizedDisplay);

          await setUserSettings(
            {
              notifications: normalizedNotifications,
              display: normalizedDisplay,
            },
            user.id,
          );
        }
      } catch (error) {
        console.error(
          'Error fetching settings:',
          error instanceof Error ? error.message : error,
        );
      }
    };

    fetchSettings();
  }, [user?.id]);

  const handleSettings = async (index, type) => {
    let updatedNotificationSettings = notificationSettings;
    let updatedDisplaySettings = displaySettings;

    if (type === 'display') {
      updatedDisplaySettings = displaySettings.map((setting, i) =>
        i === index ? {...setting, state: !setting.state} : setting,
      );
      setDisplaySettings(updatedDisplaySettings);
    } else {
      updatedNotificationSettings = notificationSettings.map((setting, i) =>
        i === index ? {...setting, state: !setting.state} : setting,
      );
      setNotificationSettings(updatedNotificationSettings);
    }

    const updatedSettings = {
      notifications: updatedNotificationSettings,
      display: updatedDisplaySettings,
    };

    try {
      await updateSettings(updatedSettings);
      await setUserSettings(updatedSettings, user.id);
    } catch (err) {
      console.error('Failed to update settings:', err);
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
