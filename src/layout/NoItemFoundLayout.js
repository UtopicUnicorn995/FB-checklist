import {useState} from 'react';
import {View, Text, TextInput} from 'react-native';
import Pressable from '../components/Pressable';
import Button from '../components/Button';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import IOIcon from 'react-native-vector-icons/Ionicons';
import NoItemFoundLayoutStyles from '../styles/NoItemFoundLayout.styles';

export default function NoItemFoundLayout({onPress, bodyText}) {
  const [isAddItem, setIsAddItem] = useState(false);
  const [textInputValue, setTextinputValue] = useState('');

  return (
    <View>
      <Text style={NoItemFoundLayoutStyles.noItemsText}>{bodyText}</Text>
      {onPress &&
        (isAddItem ? (
          <View style={NoItemFoundLayoutStyles.newChecklistInputContainer}>
            <TextInput
              style={NoItemFoundLayoutStyles.newChecklistInput}
              placeholder="Checklist title"
              value={textInputValue}
              onChangeText={text => setTextinputValue(text)}
            />
            <Pressable
              onPress={() => {
                setTextinputValue('');
                setIsAddItem(false);
              }}
              style={[
                NoItemFoundLayoutStyles.newChecklistBtn,
                {backgroundColor: '#F44336'},
              ]}>
              <IOIcon name="close" size={24} color="#fff" />
            </Pressable>
            <Pressable
              onPress={() => onPress(textInputValue)}
              style={[
                NoItemFoundLayoutStyles.newChecklistBtn,
                {backgroundColor: '#262626'},
              ]}>
              <FAIcon name="floppy-o" size={20} color="#fff" />
            </Pressable>
          </View>
        ) : (
          <Button
            title="Create checklist"
            onPress={() => setIsAddItem(true)}
            iconName="plus"
            btnStyleProp={{marginTop: 24}}
          />
        ))}
    </View>
  );
}
