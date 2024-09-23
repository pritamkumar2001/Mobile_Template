import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, StatusBar, ScrollView, KeyboardAvoidingView } from 'react-native';
import styled from 'styled-components/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from 'expo-router';
import { postEmpLeave } from './services/productServices';

const ApplyLeave = (props) => {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [leave_type, setLeave_type] = useState('EL');
  const [numOfDays, setNumOfDays] = useState(0);
  const call_mode = 'ADD';

  const navigation = useNavigation();

  // Function to calculate number of days between two dates
  const calculateDays = useCallback((startDate, endDate) => {
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Added +1 to include both start and end dates
    setNumOfDays(diffDays);
  }, []);

  // Function to handle applying leave
  const addLeave = () => {
    if (!fromDate || !toDate || !leave_type) {
      alert('Please fill all required fields');
      return;
    }

    if (toDate < fromDate) {
      alert('To Date should be after From Date');
      return;
    }

    const leavePayload = {
      emp_id: props.id,
      from_date: `${fromDate.getDate().toString().padStart(2, '0')}-${(fromDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${fromDate.getFullYear()}`,
      to_date: `${toDate.getDate().toString().padStart(2, '0')}-${(toDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${toDate.getFullYear()}`,
      remarks,
      leave_type,
      call_mode,
    };

    console.log(leavePayload, 'data--->');
    postEmpLeave(leavePayload)
      .then((res) => {
        alert('Leave applied successfully');
        navigation.goBack(); // Navigate back after successful submission
      })
      .catch((error) => {
        console.error(error);
        alert('Failed to apply leave');
      });
  };

  // Styled Components
  const Container = styled(SafeAreaView)`
    flex: 1;
    padding: 10px;
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
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <Container>
          <StatusBar barStyle={'light-content'} backgroundColor={'#007bff'} />

          {/* From Date */}
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

          {/* To Date */}
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

          {/* Remark */}
          <FieldContainer>
            <Label>Remark</Label>
            <RemarkInput
              multiline
              placeholder="Remark"
              value={remarks}
              onChangeText={(text) => setRemarks(text)}
            />
          </FieldContainer>

          {/* Type of Leave */}
          <FieldContainer>
            <Label>Type of Leave</Label>
            <LeaveTypePicker>
              <RNPickerSelect
                onValueChange={(value) => setLeave_type(value)}
                value={leave_type}
                items={[
                  { label: 'Earned Leave', value: 'EL' },
                  { label: 'Loss of Pay', value: 'LP' },
                  { label: 'Work From Home', value: 'WH' },
                ]}
                placeholder={{ label: 'Select Type of Leave', value: null }}
                style={pickerSelectStyles}
              />
            </LeaveTypePicker>
          </FieldContainer>

          {/* Submit Button */}
          <SubmitButton onPress={addLeave}>
            <SubmitButtonText>SUBMIT</SubmitButtonText>
          </SubmitButton>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ApplyLeave;
