import {View, Text} from 'react-native';
import AppLayout from '../layout/AppLayout';

export default function Settings() {
  return <AppLayout title={'Settings'} screen>
    <View>
        <Text>
            This is from Settings Screen
        </Text>
    </View>
  </AppLayout>;
}
