import React, { Dispatch, SetStateAction } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { View } from 'react-native';

interface TimePickerProps {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  time: Date;
  setTime: Dispatch<SetStateAction<Date>>;
}

const TimePicker: React.FC<TimePickerProps> = ({ visible, setVisible, time, setTime }) => {
  const onChange = (selectedDate: Date) => {
    let currentDate = selectedDate || new Date();

    setTime(currentDate);
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <View>
      <DateTimePicker
        testID="dateTimePicker"
        value={time}
        mode="time"
        is24Hour={true}
        display="default"
        onChange={(event, date) => onChange(date as Date)}
      />
    </View>
    
  );
};

export default TimePicker;