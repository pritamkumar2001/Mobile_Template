import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, StatusBar, ScrollView, KeyboardAvoidingView, Alert } from 'react-native';
import styled from 'styled-components/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from 'expo-router';
import { postEmpLeave } from './services/productServices';
import HeaderComponent from './HeaderComponent';

const Container = styled.ScrollView`
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
  const handleBackPress = () => {
    navigation.goBack();
  };

  const calculateDays = useCallback((startDate, endDate) => {
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    setNumOfDays(diffDays);
  }, []);

  const addLeave = () => {
    if (!fromDate || !toDate || !leave_type) {
      Alert.alert('Incomplete Form', 'Please fill all required fields');
      return;
    }

    if (toDate < fromDate) {
      Alert.alert('Invalid Date Range', 'To Date should be after From Date');
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

    postEmpLeave(leavePayload)
      .then((res) => {
        Alert.alert('Application Submitted', 'Leave applied successfully');
        navigation.goBack();
      })
      .catch((error) => {
        console.error(error);
        Alert.alert('Leave Application Failed', 'Failed to apply leave');
      });
  };

  return (
    <>
      <HeaderComponent headerTitle="Apply Leave" onBackPress={handleBackPress} />
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
          <Label>Remark</Label>
          <RemarkInput
            placeholder="Remark :"
            value={remarks}
            onChangeText={(text) => setRemarks(text)}
          />
        </FieldContainer>

        <FieldContainer>
          <Label>Type of Leave</Label>
          <Dropdown
            data={[
              { label: 'Earned Leave', value: 'EL' },
              { label: 'Loss of Pay', value: 'LP' },
              { label: 'Work From Home', value: 'WH' },
            ]}
            labelField="label"
            valueField="value"
            placeholder="Select Type of Leave"
            value={leave_type}
            onChange={(item) => {
              setLeave_type(item.value);
            }}
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 5,
              padding: 10,
            }}
            placeholderStyle={{ fontSize: 16, color: '#aaa' }}
            selectedTextStyle={{ fontSize: 16, color: 'black' }}
          />
        </FieldContainer>

        <SubmitButton onPress={addLeave}>
          <SubmitButtonText>SUBMIT</SubmitButtonText>
        </SubmitButton>
      </Container>
    </>
  );
};

export default ApplyLeave;
