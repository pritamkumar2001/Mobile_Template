import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import styled from 'styled-components/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';

const ApplyLeave = () => {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [remark, setRemark] = useState('');
  const [typeOfLeave, setTypeOfLeave] = useState('');
  const [numOfDays, setNumOfDays] = useState(0);

  // Function to calculate number of days between two dates
  const calculateDays = (startDate, endDate) => {
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setNumOfDays(diffDays);
  };

    //   Styled Component
  const Container = styled.View`
  flex: 1;
  padding: 10px 10px;
  background-color: #fff;
`;

const FieldContainer = styled.View`
  margin-bottom: 20px;
`;

const Label = styled.Text`
  font-size: 16px;
  margin-bottom: 5px;
`;

const DatePickerButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-width: 1px;
  border-color: #ccc;
  padding: 10px;
  border-radius: 5px;
`;

const DateText = styled.Text`
  font-size: 16px;
`;

const Icon = styled.Image`
  width: 24px;
  height: 24px;
`;

const LeaveTypePicker = styled.View`
border-width: 1px;
border-color: #ccc;
border-radius: 5px;
`;
const RemarkInput = styled.TextInput`
  border-width: 1px;
  border-color: #ccc;
  padding: 10px;
  border-radius: 5px;
  height: 100px;
  text-align-vertical: top;
`;

const SubmitButton = styled.TouchableOpacity`
  background-color: #007bff;
  padding: 15px;
  border-radius: 5px;
  align-items: center;
`;

const SubmitButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

// Picker select custom styles
const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 2,

    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
};

  return (
    <Container>
      <FieldContainer>
        <Label>From Date</Label>
        <DatePickerButton onPress={() => setShowFromPicker(true)}>
          <DateText>{fromDate.toDateString()}</DateText>
          <Icon source={require('../assets/images/c-icon.png')} />
        </DatePickerButton>
        {showFromPicker && (
          <DateTimePicker
            value={fromDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              const currentDate = selectedDate || fromDate;
              setShowFromPicker(Platform.OS === 'ios');
              setFromDate(currentDate);
              calculateDays(currentDate, toDate);
            }}
          />
        )}
      </FieldContainer>

      <FieldContainer>
        <Label>To Date</Label>
        <DatePickerButton onPress={() => setShowToPicker(true)}>
          <DateText>{toDate.toDateString()}</DateText>
          <Icon source={require('../assets/images/c-icon.png')} />
        </DatePickerButton>
        {showToPicker && (
          <DateTimePicker
            value={toDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              const currentDate = selectedDate || toDate;
              setShowToPicker(Platform.OS === 'ios');
              setToDate(currentDate);
              calculateDays(fromDate, currentDate);
            }}
          />
        )}
      </FieldContainer>

      <FieldContainer>
        <Label>No. of Days : {numOfDays} Days</Label>
      </FieldContainer>

      <FieldContainer>
        <Label>Remark</Label>
        <RemarkInput
          placeholder="Enter your remark"
          value={remark}
          onChangeText={(text) => setRemark(text)}
        />
      </FieldContainer>

      <FieldContainer>
        <Label>Type of Leave</Label>
        <LeaveTypePicker>
        <RNPickerSelect
          onValueChange={(value) => setTypeOfLeave(value)}
          items={[
            { label: 'Sick Leave', value: 'sick' },
            { label: 'Casual Leave', value: 'casual' },
            { label: 'Earned Leave', value: 'earned' },
          ]}
          placeholder={{ label: 'Select Type of Leave', value: null }}
          style={pickerSelectStyles}
        />
        </LeaveTypePicker>
        
      </FieldContainer>

      <SubmitButton>
        <SubmitButtonText>SUBMIT</SubmitButtonText>
      </SubmitButton>
    </Container>
  );
};



export default ApplyLeave;
