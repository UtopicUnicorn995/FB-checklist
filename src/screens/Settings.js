import {useState} from 'react';
import {View, Text, Image} from 'react-native';
import AppLayout from '../layout/AppLayout';
import GlobalStyles from '../styles/GlobalStyles.';
import Pressable from '../components/Pressable';

export default function Settings() {
  const [notificationSettings, setNotificationSettings] = useState([
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
  ]);

  const [displaySettings, setDisplaySettings] = useState([
    {
      description: 'Dark Theme.',
      state: true,
    },
    {description: 'Color blind mode', state: true},
  ]);

  const handleSettings = (index, type) => {
    if (type === 'display') {
      setDisplaySettings(prev =>
        prev.map((setting, i) =>
          i === index ? {...setting, state: !setting.state} : setting,
        ),
      );
    } else {
      setNotificationSettings(prev =>
        prev.map((setting, i) =>
          i === index ? {...setting, state: !setting.state} : setting,
        ),
      );
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
              {setting.state ? (
                <Image
                  source={require('../assets/checkedtrue.png')}
                  style={{width: 24, height: 20, flexShrink: 0}}
                />
              ) : (
                <Image
                  source={require('../assets/checkedfalse.png')}
                  style={{width: 20, height: 20, flexShrink: 0, marginRight: 4}}
                />
              )}
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
              {setting.state ? (
                <Image
                  source={require('../assets/checkedtrue.png')}
                  style={{width: 24, height: 20, flexShrink: 0}}
                />
              ) : (
                <Image
                  source={require('../assets/checkedfalse.png')}
                  style={{width: 20, height: 20, flexShrink: 0, marginRight: 4}}
                />
              )}
            </Pressable>
          ))}
        </View>
      </View>
    </AppLayout>
  );
}
