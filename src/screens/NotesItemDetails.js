import {View, Text, ScrollView} from 'react-native';
import AppLayout from '../layout/AppLayout';
import {convertDate} from '../utils/utilsFunc';

export default function NotesItemDetails({route}) {
  const details = route.params.item;

  console.log('eye tem', details);
  return (
    <AppLayout title={'Checklist details'} canBack>
      <ScrollView>
        <View>
          <Text>Description:</Text>
          <Text>{details.description}</Text>
        </View>
        {details.checkedBy && (
          <>
            <View>
              <Text>Checked date:</Text>
              <Text>
                {convertDate(
                  details.updatedAt,
                  `{month} {day}, {year} {hour}:{minute} {ampm}`,
                )}
              </Text>
            </View>
            <View>
              <Text>Checked by:</Text>
              <Text>{details.checkedBy}</Text>
            </View>
          </>
        )}
      </ScrollView>
    </AppLayout>
  );
}
