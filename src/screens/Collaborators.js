import {View, Text} from 'react-native';
import AppLayout from '../layout/AppLayout';

export default function Collaborators() {
  return <AppLayout title={'Collaborators'} noModalScreen invitationModal>
    <View>
        <Text>
            This is from Collaborators Screen
        </Text>
    </View>
  </AppLayout>;
}
