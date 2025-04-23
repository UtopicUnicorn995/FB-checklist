import {View, Text} from 'react-native';
import AppLayout from '../layout/AppLayout';

export default function Notes() {
  return <AppLayout title={'Notes'} screen>
    <View>
        <Text>
            This is from notes Screen
        </Text>
    </View>
  </AppLayout>;
}
