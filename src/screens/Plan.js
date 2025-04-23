import {View, Text} from 'react-native';
import AppLayout from '../layout/AppLayout';

export default function Plan() {
  return <AppLayout title={'Plan'} screen>
    <View>
        <Text>
            This is from Plan Screen
        </Text>
    </View>
  </AppLayout>;
}
