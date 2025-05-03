import { useState } from 'react';
import {View, Text, ScrollView} from 'react-native';
import AppLayout from '../layout/AppLayout';
import {convertDate} from '../utils/utilsFunc';
import GlobalStyles from '../styles/GlobalStyles.';
import FAIcon from 'react-native-vector-icons';

export default function NotesItemDetails({route}) {
  const details = route.params.item;
   const [editDetails, setEditDetails] = useState(false);

  console.log('eye tem', details);
  return (
    <AppLayout title={details.title} canBack>
      <ScrollView>
        <View>
          <View>
            <Text style={GlobalStyles.textPrimary}>Description:</Text>
            <FAIcon onPress={handleEditDescription} name="floppy-o" size={22} />
          </View>
          <Text style={GlobalStyles.textSecondary}>{details.description}</Text>
        </View>

        <View
          style={[
            GlobalStyles.flexRow,
            GlobalStyles.gap,
            GlobalStyles.paddingVertical,
          ]}>
          <Text style={GlobalStyles.textPrimary}>Created date:</Text>
          <Text style={GlobalStyles.textPrimary}>
            {convertDate(details.createdAt, `{month} {day}, {year}`)}
          </Text>
        </View>
        <View
          style={[
            GlobalStyles.flexRow,
            GlobalStyles.gap,
            GlobalStyles.paddingVertical,
          ]}>
          <Text style={GlobalStyles.textPrimary}>Last modified:</Text>
          <Text style={GlobalStyles.textPrimary}>
            {convertDate(details.updatedAt, `{month} {day}, {year}`)}
          </Text>
        </View>
      </ScrollView>
    </AppLayout>
  );
}
