import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import styled from 'styled-components/native';
import moment from 'moment';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';

import * as DocumentPicker from 'expo-document-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { getProfileInfo } from './services/authServices';
import { useNavigation, useRouter } from 'expo-router';
import HeaderComponent from './HeaderComponent';

const Container = styled.View`
  flex: 1;
  padding: 20px;
  padding-top: 20px;
  background-color: #fff;
`;

const Header = styled.Text`
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
`;

const Label = styled.Text`
  font-size: 18px;
  margin-bottom: 10px;
`;

const Value = styled.Text`
  font-size: 16px;
  margin-bottom: 20px;
`;

const Button = styled.TouchableOpacity`
  background-color: ${(props) => (props.checked ? '#28a745' : '#007bff')};
  padding: 15px;
  margin: 10px 0;
  border-radius: 10px;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: bold;
`;

const CheckStatusButton = styled.TouchableOpacity`
  background-color: #007bff;
  padding: 10px;
  margin-top: 20px;
  border-radius: 10px;
  align-items: center;
`;

const CheckStatusText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

const AttendanceCard = styled.View`
  border: 1px solid #007bff;
  padding: 20px;
  border-radius: 10px;
  margin-top: 20px;
`;

const AddAttendance = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [employeeData, setEmployeeData] = useState({
    empId: 'Employee_Id',
    designation: 'Position',
  });
  const [hasPermission, setHasPermission] = useState(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const [attendanceData, setAttendanceData] = useState({
    latitude: null,
    longitude: null,
  });
  console.log('Check-In', attendanceData);
  const navigation = useNavigation();
  const router = useRouter();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const date = moment().format('DD/MM/YYYY');
    const time = moment().format('hh:mm A');
    setCurrentDate(date);
    setCurrentTime(time);

    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    getProfileInfo().then((res) => {
      setEmployeeData(res.data);
    });
  }, []);

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const handleCheckIn = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Location permission is required to check in.');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    setAttendanceData({
      latitude: location?.coords?.latitude,
      longitude: location?.coords?.longitude,
    });

    setCheckedIn(true); // Set check-in status to true
  };

  const handleCheckOut = () => {
    // Logic for check-out
  };

  const handlePressStatus = () => {
    router.push({
      pathname: 'AttendanceStatusDisplay',
      params: employeeData?.emp_data,
    });
  };

  return (
    <>
      <HeaderComponent headerTitle="My Attendance" onBackPress={handleBackPress} />
      <Container>
        <Header>Add Attendance</Header>
        <Label>Date: {currentDate}</Label>
        <Label>Time: {currentTime}</Label>
        <Image
          source={{ uri: `${employeeData && employeeData?.image}` }}
          style={{ width: 60, height: 60, borderRadius: 30 }}
        />
        <Value>Emp-Id: {employeeData && employeeData?.emp_data?.emp_id}</Value>
        <Value>Designation: {employeeData && employeeData?.emp_data?.grade_name}</Value>
        <AttendanceCard>
          <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Attendance</Text>
          <Button onPress={handleCheckIn} checked={checkedIn}>
            <ButtonText>{checkedIn ? 'Checked-In' : 'CHECK IN'}</ButtonText>
          </Button>

          {checkedIn && (
            <Button onPress={handleCheckOut}>
              <ButtonText>CHECK OUT</ButtonText>
            </Button>
          )}
        </AttendanceCard>
        <CheckStatusButton onPress={handlePressStatus}>
          <CheckStatusText>Check Status</CheckStatusText>
        </CheckStatusButton>
      </Container>
    </>
  );
};

export default AddAttendance;
